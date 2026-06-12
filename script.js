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
    "en-US": { 
        start: "Listening", 
        analyze: "Analyze", 
        clear: "Clear", 
        confirm: "I recognized these numbers. Are they correct?", 
        yes: "YES, Check Lottery", 
        no: "NO, Edit Text", 
        placeholder: "Speak your lottery numbers..." 
    },
    "pt-BR": { 
        start: "Ouvir", 
        analyze: "Analisar Fala", 
        clear: "Limpar", 
        confirm: "Reconheci estes números. Estão corretos?", 
        yes: "SIM, Verificar Loteria", 
        no: "NÃO, Editar Texto", 
        placeholder: "Diga seus números..." 
    },
    "fr-FR": { 
        start: "Écouter", 
        analyze: "Analyser la parole", 
        clear: "Effacer", 
        confirm: "J'ai reconnu ces numéros. Sont-ils corrects ?", 
        yes: "OUI, Vérifier la loterie", 
        no: "NON, Modifier le texte", 
        placeholder: "Dites vos numéros de loterie..." 
    },
    "es-ES": { 
        start: "Escuchar", 
        analyze: "Analizar voz", 
        clear: "Limpiar", 
        confirm: "Reconocí estos números. ¿Son correctos?", 
        yes: "SÍ, Verificar Lotería", 
        no: "NO, Editar Texto", 
        placeholder: "Diga sus números de lotería..." 
    },
    "it-IT": { 
        start: "Ascolta", 
        analyze: "Analizza voce", 
        clear: "Cancella", 
        confirm: "Ho riconosciuto questi numeri. Sono corretti?", 
        yes: "SÌ, Controlla Lotteria", 
        no: "NO, Modifica Testo", 
        placeholder: "Pronuncia i tuoi numeri della lotteria..." 
    },
    "de-DE": { 
        start: "Zuhören", 
        analyze: "Sprache analysieren", 
        clear: "Löschen", 
        confirm: "Ich habe diese Zahlen erkannt. Sind sie korrekt?", 
        yes: "JA, Lotto prüfen", 
        no: "NEIN, Text bearbeiten", 
        placeholder: "Sprechen Sie Ihre Lottozahlen..." 
    },
    "ko-KR": { 
        start: "듣기", 
        analyze: "음성 분석", 
        clear: "지우기", 
        confirm: "인식된 숫자입니다. 맞습니까?", 
        yes: "네, 복권 확인하기", 
        no: "아니요, 텍스트 수정", 
        placeholder: "복권 번호를 말씀해 주세요..." 
    },
    "zh-CN": { 
        start: "开始聆听", 
        analyze: "分析语音", 
        clear: "清除", 
        confirm: "我识别了这些数字。正确吗？", 
        yes: "是的，核对彩票", 
        no: "不，修改文本", 
        placeholder: "请说出您的彩票号码..." 
    }
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

// Lógica de Análise e Confirmação
analyzeBtn.onclick = () => {
    const matches = outputText.value.match(/\d+/g);
    if (matches) {
        recognizedNumbers = [...new Set(matches.map(Number))];
        const disp = document.getElementById('number-display');
        disp.innerHTML = recognizedNumbers.map(n => `<span class="num-tag">${n}</span>`).join('');
        
        // --- THE RESET FIX ---
        // 1. Ensure the confirmation text and YES/NO buttons are visible again
        document.getElementById('confirm-text').style.display = 'block';
        document.querySelector('.choice-btns').style.display = 'flex'; // Uses 'flex' or 'block' depending on your CSS
        
        // 2. Remove any old results left over from a previous search
        const oldResults = document.getElementById('lottery-results-container');
        if (oldResults) {
            oldResults.remove();
        }
        
        // 3. Display the fresh verification box
        verifyBox.style.display = 'block';
    }
};

// --- FUNÇÃO DE RENDERIZAÇÃO ESTILIZADA COM LAZY ESTIMATE BREAKDOWN ---
const handleYesClick = () => {
    // 1. Hide the confirmation text and choices so they don't look messy, but DON'T delete the whole box
    document.getElementById('confirm-text').style.display = 'none';
    document.querySelector('.choice-btns').style.display = 'none';
    
    // 2. Safely create or target a clean container for the results inside verifyBox
    let resultsContainer = document.getElementById('lottery-results-container');
    if (!resultsContainer) {
        resultsContainer = document.createElement('div');
        resultsContainer.id = 'lottery-results-container';
        verifyBox.appendChild(resultsContainer);
    }
    
    resultsContainer.innerHTML = `<p style="padding: 20px; font-weight: bold; color: #007bff; text-align: center;">Analyzing worldwide database drawings in the cloud...</p>`;
    
    fetch(`${API_URL}?numbers=${recognizedNumbers.join(',')}`)
        .then(res => res.json())
        .then(categories => {
            const prizeValues = { 6: 20000000, 5: 10000, 4: 100, 3: 10 };
            let totalEstimatedGains = 0;
            let totalMatches = 0;

            for (let m = 6; m >= 3; m--) {
                const draws = categories[m];
                if (draws && draws.length > 0) {
                    totalEstimatedGains += draws.length * prizeValues[m];
                    totalMatches += draws.length;
                }
            }

            const formattedGains = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(totalEstimatedGains);

            let resultsHTML = `
                <div style="text-align: left; max-height: 500px; overflow-y: auto; padding-right: 10px; margin-top: 15px;">
                    <h3 style="text-align: center; border-bottom: 2px solid #ddd; padding-bottom: 10px;">Search Results (${totalMatches} Matches)</h3>
                    
                    <div style="background-color: #fff3cd; border: 1px solid #ffeeba; border-radius: 10px; padding: 15px; margin-bottom: 15px; text-align: center;">
                        <span style="font-size: 0.85rem; font-weight: bold; color: #856404; text-transform: uppercase; display: block; margin-bottom: 5px;">
                            ⚠️ Lazy Estimate Breakdown
                        </span>
                        <span style="font-size: 1.8rem; font-weight: 800; color: #28a745; display: block; margin-bottom: 8px;">
                            ${formattedGains}
                        </span>
                        <p style="font-size: 0.8rem; color: #665114; margin: 0; line-height: 1.4; font-style: italic;">
                            This amount is a purely modern valuation to estimate potential gains based on today's averages.
                        </p>
                    </div>
            `;
            
            for (let matchNum = 6; matchNum >= 3; matchNum--) {
                const draws = categories[matchNum];
                if (draws && draws.length > 0) {
                    resultsHTML += `<h4 style="background-color: ${getTierColor(matchNum)}; color: white; padding: 6px 12px; border-radius: 6px; margin-top: 15px;">${matchNum} Numbers Match (${draws.length} draws) — $${prizeValues[matchNum].toLocaleString()} each</h4><ul style="list-style: none; padding: 0; margin: 0;">`;
                    
                    draws.forEach(draw => {
                        const numbersHtml = draw.numbers.map(n => {
                            const isMatch = recognizedNumbers.includes(Number(n));
                            return `<span style="background:${isMatch ? '#dc3545' : '#e0e0e0'}; color:${isMatch ? '#fff' : '#333'}; padding: 2px 6px; border-radius: 4px; margin: 0 2px; font-weight: bold; display: inline-block;">${n}</span>`;
                        }).join('');
                        
                        let bonusHtml = '';
                        if (draw.bonus && draw.bonus.length > 0) {
                            bonusHtml = ' <span style="font-weight: normal; color:#555;">+ Bonus:</span> ' + draw.bonus.map(b => {
                                const isBonusMatch = recognizedNumbers.includes(Number(b));
                                return `<span style="background:${isBonusMatch ? '#ffc107' : '#fff3cd'}; color:#333; border: 1px solid #ffeeba; padding: 2px 6px; border-radius: 50%; margin: 0 2px; font-weight: bold; display: inline-block;">${b}</span>`;
                            }).join('');
                        }
                        
                        resultsHTML += `<li style="padding: 10px; border-bottom: 1px solid #eee;"><strong>${draw.game}</strong> - ${draw.date}<br/>Numbers: ${numbersHtml} ${bonusHtml}<br/><a href="${draw.url}" target="_blank" style="color:#007bff; font-weight: 600; text-decoration: none; display: inline-block; margin-top: 5px;">Go to Official Page →</a></li>`;
                    });
                    
                    resultsHTML += `</ul>`;
                }
            }
            
            // Clean close action that resets the elements without forcing a full page download reload
            resultsHTML += `<button id="close-results-btn" style="width:100%; margin-top:20px; padding:10px; background-color:#6c757d; color:white; border:none; border-radius:5px; cursor:pointer;">Close Results</button></div>`;
            resultsContainer.innerHTML = resultsHTML;

// Hook up the close button to restore the prompt view cleanly
            document.getElementById('close-results-btn').onclick = () => {
                resultsContainer.remove();
                document.getElementById('confirm-text').style.display = 'block';
                document.querySelector('.choice-btns').style.display = 'flex';
                verifyBox.style.display = 'none';
                
                // Clear the voice transcripts so they don't append to the next run
                outputText.value = '';
                finalTranscript = '';
                recognizedNumbers = []; 
            };
        })
        .catch(err => {
            console.error("Fetch handling error:", err);
            resultsContainer.innerHTML = `<p style="padding: 20px; color: #dc3545; font-weight: bold; text-align: center;">Error parsing database data.</p>`;
        });
};

function getTierColor(m) { return {6:'#28a745', 5:'#ffc107', 4:'#fd7e14', 3:'#17a2b8'}[m] || '#007bff'; }

// Eventos de clique
yesBtn.onclick = handleYesClick;
noBtn.onclick = () => verifyBox.style.display = 'none';
clearBtn.onclick = () => { outputText.value = ''; finalTranscript = ''; verifyBox.style.display = 'none'; };

updateLanguage();
