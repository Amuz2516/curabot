# Cura HealthBot 🩺💬

Cura HealthBot is an AI-powered web-based healthcare assistant designed to help users analyze their symptoms and receive possible disease predictions — all from the comfort of their screen.

# Key Features

**Hybrid AI Model**: Combines a trained ML model for disease prediction and a conversational LLM for contextual Q&A.
**Symptom Analysis**: Users can describe symptoms in plain English, and the system will extract and process them intelligently.
**Disease Prediction**: Provides the most likely disease using a Random Forest classifier.
**Empathetic Chatbot Replies**: LLM (DeepSeek v3 via OpenRouter) provides emotional support with friendly tones.
**User Interface**: Fully interactive, responsive UI with dark mode, voice input, and multi-chat support.
**Landing Page + Disclaimer**: Professional homepage with project explanation, model transparency, and a privacy policy.
**Modern UI**: Sidebar navigation, chat animation, model switcher, and polished visual experience.

# Tech Stack

**Frontend**: HTML, CSS, JavaScript
**Backend**: Python (Flask), Joblib, Pandas, Regex, CORS
**ML Model**: Random Forest (trained on disease-symptom dataset)
**NLP & LLM**: Custom NLP + DeepSeek Chat v3 via OpenRouter API
**Voice Input**: Web Speech API for voice symptom input

# Project Structure

curebot/
├── app.py
├── requirements.txt
├── Procfile
├── README.md
├── ModelTraining.ipynb
├── disease_prediction_model.pkl
├── symptom_labels.pkl
├── disease_label_encoder.pkl
│
├── templates/
│ ├── landing.html
│ ├── index.html
│ └── privacy.html
│
├── static/
│ ├── styles.css
│ └── script.js
└── pic1.jpg

# How It Works

1. Users enter their symptoms (e.g., "I have chest pain and fever").
2. Backend uses NLP to extract relevant symptoms.
3. If symptoms are detected:
   - ML model predicts the likely disease.
   - Bot responds with a supportive, concise message.
4. If general health question:
   - The chatbot forwards it to an LLM (DeepSeek via OpenRouter) to respond warmly and contextually.

## How to Run Locally

### Option 1

1. Install Python 3
2. Clone this repo or download ZIP
3. Create virtual environment (optional but recommended):
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
4. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
5. Run the server:
   ```bash
   python app.py
   ```
6. Open browser and go to:
   ```
   http://127.0.0.1:5000
   ```

### Option 2

1. Download or Clone the Repository
   You can clone the GitHub repository using:

git clone https://github.com/Amuz2516/curabot.git
Or simply download the ZIP file of this repo from GitHub and extract it.

2. Navigate to the Project Folder

cd curabot
Make sure you’re in the folder where app.py exists.

3. Install Python Dependencies
   Install the necessary Python packages. If you have a requirements.txt file, run:

pip install -r requirements.txt
If requirements.txt is not available, run manually:

pip install flask flask-cors joblib scikit-learn pandas requests

4. Run the Flask App
   Use this command in the terminal:

python app.py
Once running, Flask will output something like:

Running on http://127.0.0.1:5000/ 
5. Open the Web Application
Open any web browser and navigate to:

http://127.0.0.1:5000/
This loads the landing page of the Cura HealthBot system.

You can interact with:
Landing page (/)
Chat interface (/index)
Privacy policy (/privacy)

# Privacy & Ethics

-No personal health information (PHI) is stored.
-The model is for informational purposes only.
-Clear disclaimer informs users it’s not a replacement for a medical professional.

# Credits

-Built by : Aman Kureshi - L39141861
-ML dataset inspired by open-source datasets
-LLM powered by DeepSeek via OpenRouter API
-University: University Academy 92 (UA92)
-Mentor/Tutor: Ngozi Nneke
-Supervisor: Iqra Kiyani
