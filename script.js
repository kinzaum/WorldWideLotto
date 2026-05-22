// script.js
const startBtn = document.getElementById('start-btn');
const analyzeBtn = document.getElementById('analyze-btn');
const clearBtn = document.getElementById('clear-btn');
const outputText = document.getElementById('output-text');
const verifyBox = document.getElementById('verify-box');
const langSelect = document.getElementById('lang-select');
const startSub = document.getElementById('start-sub');
const analyzeSub = document.getElementById('analyze-sub');
const clearSub = document.getElementById('clear-sub');
const confirmText = document.getElementById('confirm-text');
const yesBtn = document.getElementById('yes-btn');
const noBtn = document.getElementById('no-btn');

const API_URL = "https://script.google.com/macros/s/AKfycbwMApjBhxoBJct7tAy6hEHk0PuOtCUIBgozwtWJKRhhtmRotZ7gLcazcEraf8dsyz6srw/exec";
let recognizedNumbers = [];
let finalTranscript = '';

const translations = {
    "en-US": { start: "Listening", analyze: "Analyze", clear: "Clear", confirm: "I recognized these numbers. Are they correct?", yes: "YES, Check Lottery", no: "NO, Edit Text", placeholder: "Speak your lottery numbers..." },
    "pt-BR": { start: "Ouvir", analyze: "Analisar Fala", clear: "Limpar", confirm: "Reconheci estes números. Estão corretos?", yes: "SIM, Verificar Loteria", no: "NÃO, Editar Texto", placeholder: "Diga seus números..." }
};

function updateLanguage() {
    const t = translations[langSelect.value] || translations["en-US"];
    startSub.textContent = t.start;
    analyzeSub.textContent = t.analyze;
    clearSub.textContent = t.clear;
    confirmText.textContent = t.confirm;
    yesBtn.textContent = t.yes;
    noBtn.textContent = t.no;
    outputText.placeholder = t.placeholder;
}

// Lógica de Reconhecimento de Fala
const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
const recognition = new SpeechRecognition();
recognition.continuous = true;
recognition.interimResults = true;
recognition.lang = langSelect.value;

langSelect.onchange = () => { recognition.lang = langSelect.value; updateLanguage(); };

startBtn.onclick = () => {
    if (startBtn.classList.contains('listening')) { recognition.stop(); }
    else { finalTranscript = outputText.value; recognition.start(); }
};

recognition.onstart = () => startBtn.classList.add('listening');
recognition.onend = () => startBtn.classList.remove('listening');

recognition.onresult = (event) => {
    let interim = '';
    for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) finalTranscript += event.results[i][0].transcript + " ";
        else interim += event.results[i][0].transcript;
    }
    outputText.value = finalTranscript + interim;
};

// Lógica de Análise
analyzeBtn.onclick = () => {
    const matches = outputText.value.match(/\d+/g);
    if (matches) {
        recognizedNumbers = [...new Set(matches.map(Number))];
        const disp = document.getElementById('number-display');
        disp.innerHTML = recognizedNumbers.map(n => `<span class="num-tag">${n}</span>`).join('');
        verifyBox.style.display = 'block';
    }
};

const handleYesClick = () => {
    verifyBox.innerHTML = `<p style="padding: 20px; font-weight: bold; color: #007bff;">Analyzing worldwide database drawings in the cloud...</p>`;
    fetch(`${API_URL}?numbers=${recognizedNumbers.join(',')}`)
        .then(res => res.json())
        .then(categories => {
            let resultsHTML = `<div style="text-align: left; max-height: 500px; overflow-y: auto; padding-right: 10px;">
                               <h3 style="text-align: center; border-bottom: 2px solid #ddd; padding-bottom: 10px;">Search Results</h3>`;
            
            for (let matchNum = 6; matchNum >= 3; matchNum--) {
                const draws = categories[matchNum];
                if (draws && draws.length > 0) {
                    resultsHTML += `<h4 style="background-color: ${getTierColor(matchNum)}; color: white; padding: 6px 12px; border-radius: 6px;">${matchNum} Numbers Match (${draws.length} draws)</h4>`;
                    draws.forEach(draw => {
                        const numbersHtml = draw.numbers.map(n => {
                            const isMatch = recognizedNumbers.includes(n);
                            return `<span style="background:${isMatch ? '#dc3545' : '#e0e0e0'}; color:${isMatch ? '#fff' : '#333'}; padding: 2px 6px; border-radius: 4px; margin: 0 2px; font-weight: bold;">${n}</span>`;
                        }).join('');
                        resultsHTML += `<li style="padding: 10px; border-bottom: 1px solid #eee;"><strong>${draw.game}</strong><br/>Numbers: ${numbersHtml}<br/><a href="${draw.url}" target="_blank" style="color:#007bff;">Go to Official Page →</a></li>`;
                    });
                }
            }
            resultsHTML += `<button onclick="location.reload()" style="width:100%; margin-top:20px; padding:10px;">Close Results</button></div>`;
            verifyBox.innerHTML = resultsHTML;
        });
};

function getTierColor(m) { return {6:'#28a745', 5:'#ffc107', 4:'#fd7e14', 3:'#17a2b8'}[m] || '#007bff'; }

// Eventos de clique adicionais
yesBtn.onclick = handleYesClick;
noBtn.onclick = () => verifyBox.style.display = 'none';
clearBtn.onclick = () => { outputText.value = ''; finalTranscript = ''; verifyBox.style.display = 'none'; };

updateLanguage();
