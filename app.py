from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import requests
import re
import pandas as pd
from flask import Flask, render_template, request, jsonify 

app = Flask(__name__)
CORS(app)  # this allowed frontend to call this backend

# Load trained ML model and symptom labels
model = joblib.load("disease_prediction_model.pkl")
symptom_labels = joblib.load("symptom_labels.pkl")
label_encoder = joblib.load("disease_label_encoder.pkl")

# Prepare mappings for symptom extraction
label_mapping = {s: s.replace("_", " ").lower() for s in symptom_labels}
reverse_mapping = {v: k for k, v in label_mapping.items()}
processed_symptom_list = list(label_mapping.values())

message_history = [
    {
        "role": "system",
        "content": "You are a friendly and emotionally intelligent AI healthcare assistant named 'Aidra'. Always provide answers in a kind and reassuring tone. Keep messages short (2–3 bullet points max). Your goal is to make the user feel heard, supported, and less stressed. End with a caring phrase like 'You’ve got this 💙' or 'I’m here if you need anything 💬'."
    }
]

# Function to extract symptoms from user input
def extract_symptoms(user_input):
    user_input = user_input.lower()
    return [
        reverse_mapping[symptom]
        for symptom in processed_symptom_list
        if re.search(rf"\b{re.escape(symptom)}\b", user_input)
    ]

# Function to classify user input
def classify_input(user_input):
    symptoms = extract_symptoms(user_input)
    if symptoms:
        return "symptoms", symptoms
    else:
        return "general_question", None

# Predict disease using trained ML model
def predict_disease(symptoms):
    input_vector = [1 if s in symptoms else 0 for s in symptom_labels]
    prediction = model.predict([input_vector])[0]
    predicted_disease = label_encoder.inverse_transform([prediction])[0]
    return predicted_disease

def ask_deepseek_v3(messages):
    headers = {
        "Authorization": "Bearer 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", 
        "HTTP-Referer": "http://localhost",  
        "Content-Type": "application/json"
    }

    data = {
        "model": "deepseek/deepseek-chat-v3-0324:free",
        "messages": message_history,
        "temperature": 0.5,
        "max_tokens": 100
    }

    response = requests.post("https://openrouter.ai/api/v1/chat/completions", headers=headers, json=data)

    try:
        return response.json()["choices"][0]["message"]["content"].strip()
    except Exception as e:
        print("Error from OpenRouter:", response.json())
        return "⚠️ Sorry, I couldn't generate a response right now."
    
# Flask route

@app.route('/')
def landing():
    return render_template('landing.html')

@app.route('/index')
def index():
    return render_template('index.html')

@app.route('/privacy')
def privacy():
    return render_template('privacy.html')

@app.route("/chatbot", methods=["POST"])

def chatbot():
    global message_history

    user_input = request.json.get("user_input", "")
    if not user_input.strip():
        return jsonify({"response": "Please enter a valid message."})

    input_type, data = classify_input(user_input)

    # If it's symptom input, use ML model
    if input_type == "symptoms":
        predicted_disease = predict_disease(data)
        response_text = f"🩺 Based on your symptoms, you may be experiencing: {predicted_disease}. Please take care and consult a doctor if symptoms persist 💙"

        # Add to conversation history
        message_history.append({"role": "user", "content": user_input})
        message_history.append({"role": "assistant", "content": response_text})

        return jsonify({"response": response_text})

    # Else, send to LLM for answer
    else:
        message_history.append({"role": "user", "content": user_input})
        bot_reply = ask_deepseek_v3(message_history)
        message_history.append({"role": "assistant", "content": bot_reply})

        return jsonify({"response": bot_reply})

@app.route("/reset", methods=["POST"])
def reset_chat():
    global message_history
    message_history = [
        {
            "role": "system",
            "content": "You are a calm, supportive AI medical assistant. Always answer in a kind and helpful tone, and explain in 2–3 short bullet points if appropriate. Be stress-relieving and friendly 💙"
        }
    ]
    return jsonify({"response": "🔄 Chat has been reset."})

# to run the app
if __name__ == '__main__':
    app.run(debug=True)

