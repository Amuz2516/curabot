
function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('overlay');
  sidebar.classList.toggle('visible');
  overlay.classList.toggle('active');
}

function selectModel(button) {
  document.querySelectorAll('.model-toggle button').forEach(btn => btn.classList.remove('active'));
  button.classList.add('active');
}

function startNewChat() {
  document.getElementById('chatWindow').innerHTML = '';
}

function clearChat() {
const chatWindow = document.getElementById('chatWindow');
chatWindow.innerHTML = '';

const cleared = document.createElement('div');
cleared.className = 'bubble bot';
cleared.textContent = "🧹 Chat cleared. Ready to help again!";
chatWindow.appendChild(cleared);
chatWindow.scrollTop = chatWindow.scrollHeight;
}

function addChatBubble(text, sender) {
  const chatWindow = document.getElementById('chatWindow');
  const bubble = document.createElement('div');
  bubble.className = `bubble ${sender}`;
  bubble.textContent = text;
  chatWindow.appendChild(bubble);
  chatWindow.scrollTop = chatWindow.scrollHeight;
  bubble.scrollIntoView({ behavior: 'smooth' });
}

function simulateTyping(message) {
  const chatWindow = document.getElementById('chatWindow');
  const bubble = document.createElement('div');
  bubble.className = 'bubble bot';
  chatWindow.appendChild(bubble);
  chatWindow.scrollTop = chatWindow.scrollHeight;
  bubble.scrollIntoView({ behavior: 'smooth' });

  let index = 0;
  const speed = 30;
  const interval = setInterval(() => {
    if (index < message.length) {
      bubble.textContent += message.charAt(index);
      index++;
      chatWindow.scrollTop = chatWindow.scrollHeight;
    } else {
      clearInterval(interval);
    }
  }, speed);
}

function sendUserMessage() {
const input = document.getElementById('chatInput');
const text = input.value.trim();
if (!text) return;

addChatBubble(text, 'user');
input.value = '';

const chatWindow = document.getElementById('chatWindow');
const typing = document.createElement('div');
typing.className = 'bubble bot typing-indicator';
typing.innerHTML = '<span class="dot"></span><span class="dot"></span><span class="dot"></span>';
chatWindow.appendChild(typing);
chatWindow.scrollTop = chatWindow.scrollHeight;

fetch('https://curabot-z3qx.onrender.com', {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({ user_input: text })
})
.then(response => response.json())
.then(data => {
  typing.remove();
  simulateTyping(data.response);
})
.catch(() => {
  typing.remove();
  simulateTyping("⚠️ Sorry, I couldn't connect to the server.");
});
}
function updateSidebarUI() {
  const sidebar = document.getElementById('sidebarUser');
  const username = localStorage.getItem('aiva_user');
  if (username) {
    sidebar.innerHTML = `
      <hr style="margin: 20px 0; border: 0; border-top: 1px solid #6a7f5a;">
      <div style="margin-bottom: 10px; font-weight: bold;">👋 Welcome, ${username}</div>
      <button onclick="alert('Profile info: ' + localStorage.getItem('aiva_user'))">👤 My Profile</button>
      <button onclick="logout()">🚪 Logout</button>
    `;
  } else {
    sidebar.innerHTML = `
      <hr style="margin: 20px 0; border: 0; border-top: 1px solid #6a7f5a;">
      <button onclick="showForm('login')">🔐 Login</button>
      <button onclick="showForm('register')">📝 Register</button>
    `;
  }
}

function toggleDarkMode() {
document.body.classList.toggle('dark-mode');

// Save preference
if (document.body.classList.contains('dark-mode')) {
localStorage.setItem('theme', 'dark');
} else {
localStorage.setItem('theme', 'light');
}
}

// Load saved theme
window.addEventListener('DOMContentLoaded', () => {
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
document.body.classList.add('dark-mode');
}
});

function showForm(type) {
  const name = prompt(`Enter your ${type === 'register' ? 'new' : ''} username:`);
  if (name) {
    localStorage.setItem('aiva_user', name);
    updateSidebarUI();
    alert(`${type === 'register' ? 'Registered' : 'Logged in'} as ${name}`);
  }
}

function logout() {
  localStorage.removeItem('aiva_user');
  updateSidebarUI();
  alert('You have been logged out.');
}

window.addEventListener('DOMContentLoaded', updateSidebarUI);


function toggleTheme() {
const body = document.body;
const toggleBtn = document.getElementById('themeToggle');
body.classList.toggle('dark-mode');

const isDark = body.classList.contains('dark-mode');
toggleBtn.textContent = isDark ? '☀️' : '🌙';
localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

// Load theme preference on page load
window.addEventListener('DOMContentLoaded', () => {
const savedTheme = localStorage.getItem('theme');
const isDark = savedTheme === 'dark';
if (isDark) document.body.classList.add('dark-mode');
document.getElementById('themeToggle').textContent = isDark ? '☀️' : '🌙';
});

document.getElementById('chatInput').addEventListener('keydown', function (event) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();      // Prevent new line
      sendUserMessage();          // Call your sending function
    }
  });

function startVoiceInput() {
const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.lang = 'en-US';
recognition.interimResults = false;
recognition.maxAlternatives = 1;

recognition.start();

recognition.onresult = (event) => {
const spokenText = event.results[0][0].transcript;
document.getElementById('chatInput').value = spokenText;
sendUserMessage(); // auto-send after speech
};

recognition.onerror = (event) => {
alert("Voice recognition failed. Please try again.");
console.error("Speech error:", event.error);
};
}

function sendSuggestion(text) {
const input = document.getElementById('chatInput');
input.value = text;
sendUserMessage(); // existing function you already use
}

window.addEventListener('DOMContentLoaded', function () {
    document.getElementById('chatInput').addEventListener('keydown', function (event) {
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        sendUserMessage();
      }
    });
  });
