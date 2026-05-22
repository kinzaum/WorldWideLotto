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
    "en-US": { start: "Listening", analyze: "Analyze", clear: "Clear", confirm: "I recognized these numbers. Are they correct?", yes: "YES, Check", no: "NO, Edit", placeholder: "Speak your lottery numbers..." },
    "pt-BR": { start: "Ouvir", analyze: "Analisar", clear: "Limpar", confirm: "Reconheci estes números. Estão corretos?", yes: "SIM, Verificar", no: "NÃO, Editar", placeholder: "Diga seus números..." },
    "fr-FR": { start: "Écouter", analyze: "Analyser", clear: "Effacer", confirm: "J'ai reconnu ces numéros. Sont-ils corrects ?", yes: "OUI, Vérifier", no: "NON, Éditer", placeholder: "Dites vos numéros..." },
    "es-ES": { start: "Escuchar", analyze: "Analizar", clear: "Borrar", confirm: "Reconocí estos números. ¿Son correctos?", yes: "SÍ, Verificar", no: "NO, Editar", placeholder: "Diga sus números..." },
    "it-IT": { start: "Ascoltare", analyze: "Analizza", clear: "Cancella", confirm: "Ho riconosciuto questi numeri. Sono corretti?", yes: "SÌ, Verifica", no: "NO, Modifica", placeholder: "Dì i tuoi numeri..." },
    "de-DE": { start: "Zuhören", analyze: "Analysieren", clear: "Löschen", confirm: "Ich habe diese Zahlen erkannt. Sind sie richtig?", yes: "JA, Prüfen", no: "NEIN, Bearbeiten", placeholder: "Sagen Sie Ihre Zahlen..." },
    "ko-KR": { start: "듣기", analyze: "분석", clear: "지우기", confirm: "번호를 인식했습니다. 정확합니까?", yes: "네, 확인", no: "아니오, 수정", placeholder: "번호를 말씀하세요..." },
    "zh-CN": { start: "倾听", analyze: "分析", clear: "清除", confirm: "我识别到了这些数字。正确吗？", yes: "是的，检查", no: "不，编辑", placeholder: "请说出您的号码..." }
};

function updateLanguage() {
    const t = translations[langSelect.value];
    startSub.textContent = t.start; 
    analyzeSub.textContent = t.analyze; 
    clearSub.textContent = t.clear;
    confirmText.textContent = t.confirm; 
    yesBtn.textContent = t.yes; 
    noBtn.textContent = t.no;
    outputText.placeholder = t.placeholder;
}

const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
const recognition = new SpeechRecognition();
recognition.continuous = true;
recognition.interimResults = true; 
recognition.lang = langSelect.value;

langSelect.onchange = () => {
    recognition.lang = langSelect.value;
    updateLanguage();
};

startBtn.onclick = () => {
    if (startBtn.classList.contains('listening')) {
        recognition.stop();
    } else {
        finalTranscript = outputText.value; 
        recognition.start();
    }
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
    verifyBox.innerHTML = `<p style="padding: 20px;">Analyzing in cloud...</p>`;
    fetch(`${API_URL}?numbers=${recognizedNumbers.join(',')}`)
        .then(res => res.json())
        .then(data => {
            // Lógica de exibição com destaque vermelho (isMatch)
            let html = `<h3>Results</h3>`;
            for (let m = 6; m >= 3; m--) {
                if (data[m]?.length) {
                    html += `<h4>${m} Matches</h4><ul>`;
                    data[m].forEach(draw => {
                        const numbersHtml = draw.numbers.map(n => {
                            const isMatch = recognizedNumbers.includes(n);
                            return `<span style="background:${isMatch ? '#dc3545' : '#e0e0e0'}; color:${isMatch ? '#fff' : '#333'}; padding: 2px 6px; border-radius: 4px; margin: 2px;">${n}</span>`;
                        }).join('');
                        html += `<li>${draw.game} - ${numbersHtml}</li>`;
                    });
                    html += `</ul>`;
                }
            }
            verifyBox.innerHTML = html + `<button onclick="location.reload()">Close</button>`;
        });
};

yesBtn.onclick = handleYesClick;
noBtn.onclick = () => verifyBox.style.display = 'none';
clearBtn.onclick = () => { outputText.value = ''; finalTranscript = ''; verifyBox.style.display = 'none'; };

updateLanguage();
