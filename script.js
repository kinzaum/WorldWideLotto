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
        start: "Listening", analyze: "Analyze", clear: "Clear", confirm: "I recognized these numbers. Are they correct?", yes: "YES, Check Lottery", no: "NO, Edit Text", placeholder: "Speak your lottery numbers...",
        results: { title: "Search Results", matches: "Matches", estimateTitle: "⚠️ Lazy Estimate Breakdown", estimateDesc: "This amount is a purely modern valuation to estimate potential gains based on today's averages.", matchLabel: "Numbers Match", draws: "draws", withBonus: "with Bonus", each: "each", close: "Close Results", loading: "Analyzing worldwide database drawings in the cloud..." }
    },
    "pt-BR": { 
        start: "Ouvir", analyze: "Analisar Fala", clear: "Limpar", confirm: "Reconheci estes números. Estão corretos?", yes: "SIM, Verificar Loteria", no: "NÃO, Editar Texto", placeholder: "Diga seus números...",
        results: { title: "Resultados da Busca", matches: "Acertos", estimateTitle: "⚠️ Estimativa Simples", estimateDesc: "Este valor é uma avaliação moderna para estimar ganhos potenciais com base nas médias atuais.", matchLabel: "Números Acertados", draws: "sorteios", withBonus: "com Bônus", each: "cada", close: "Fechar Resultados", loading: "Analisando sorteios globais no banco de dados..." }
    },
    "fr-FR": { 
        start: "Écouter", analyze: "Analyser la parole", clear: "Effacer", confirm: "J'ai reconnu ces numéros. Sont-ils corrects ?", yes: "OUI, Vérifier la loterie", no: "NON, Modifier le texte", placeholder: "Dites vos numéros de loterie...",
        results: { title: "Résultats de Recherche", matches: "Correspondances", estimateTitle: "⚠️ Estimation Sommaire", estimateDesc: "Ce montant est une évaluation moderne pour estimer les gains potentiels basés sur les moyennes actuelles.", matchLabel: "Numéros Correspondants", draws: "tirages", withBonus: "avec Bonus", each: "chacun", close: "Fermer les Résultats", loading: "Analyse des tirages mondiaux dans le cloud..." }
    },
    "es-ES": { 
        start: "Escuchar", analyze: "Analizar voz", clear: "Limpiar", confirm: "Reconocí estos números. ¿Son correctos?", yes: "SÍ, Verificar Lotería", no: "NO, Editar Texto", placeholder: "Diga sus números de lotería...",
        results: { title: "Resultados de Búsqueda", matches: "Coincidencias", estimateTitle: "⚠️ Estimación Simple", estimateDesc: "Esta cantidad es una valoración puramente moderna para estimar ganancias potenciales basadas en los promedios de hoy.", matchLabel: "Números Acertados", draws: "sorteos", withBonus: "con Bono", each: "cada uno", close: "Cerrar Resultados", loading: "Analizando sorteos mundiales en la nube..." }
    },
    "it-IT": { 
        start: "Ascolta", analyze: "Analizza voce", clear: "Cancella", confirm: "Ho riconosciuto questi numeri. Sono corretti?", yes: "SÌ, Controlla Lotteria", no: "NO, Modifica Testo", placeholder: "Pronuncia i tuoi numeri della lotteria...",
        results: { title: "Risultati della Ricerca", matches: "Corrispondenze", estimateTitle: "⚠️ Stima Approssimativa", estimateDesc: "Questo importo è una valutazione puramente moderna per stimare i guadagni potenziali basati sulle medie odierne.", matchLabel: "Numeri Indovinati", draws: "estrazioni", withBonus: "con Bonus", each: "ciascuno", close: "Chiudi Risultati", loading: "Analisi delle estrazioni globali nel cloud..." }
    },
    "de-DE": { 
        start: "Zuhören", analyze: "Sprache analysieren", clear: "Löschen", confirm: "Ich habe diese Zahlen erkannt. Sind sie korrekt?", yes: "JA, Lotto prüfen", no: "NEIN, Text bearbeiten", placeholder: "Sprechen Sie Ihre Lottozahlen...",
        results: { title: "Suchergebnisse", matches: "Treffer", estimateTitle: "⚠️ Einfache Schätzung", estimateDesc: "Dieser Betrag ist eine rein moderne Bewertung, um potenzielle Gewinne auf der Grundlage des heutigen Durchschnitts zu schätzen.", matchLabel: "Zahlen Treffer", draws: "Ziehungen", withBonus: "mit Bonus", each: "pro Los", close: "Ergebnisse schließen", loading: "Analysiere weltweite Ziehungen in der Cloud..." }
    },
    "ko-KR": { 
        start: "듣기", analyze: "음성 분석", clear: "지우기", confirm: "인식된 숫자입니다. 맞습니까?", yes: "네, 복권 확인하기", no: "아니요, 텍스트 수정", placeholder: "복권 번호를 말씀해 주세요...",
        results: { title: "검색 결과", matches: "개 일치", estimateTitle: "⚠️ 예상 당첨금 분석", estimateDesc: "이 금액은 오늘날의 평균을 기준으로 잠재적 이익을 추정하기 위한 가치 평가입니다.", matchLabel: "개 숫자 일치", draws: "회 추첨", withBonus: "보너스 포함", each: "각", close: "결과 닫기", loading: "클라우드에서 글로벌 추첨 데이터 분석 중..." }
    },
    "zh-CN": { 
        start: "开始聆听", analyze: "分析语音", clear: "清除", confirm: "我识别了这些数字。正确吗？", yes: "是的，核对彩票", no: "不，修改文本", placeholder: "请说出您的彩票号码...",
        results: { title: "搜索结果", matches: "个匹配", estimateTitle: "⚠️ 估算数据细目", estimateDesc: "该金额纯粹是根据当今平均水平估算潜在收益的现代估值。", matchLabel: "个数字 匹配", draws: "次开奖", withBonus: "含 special 号码", each: "每个", close: "关闭结果", loading: "正在云端分析全球开奖数据..." }
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
        
        document.getElementById('confirm-text').style.display = 'block';
        document.querySelector('.choice-btns').style.display = 'flex';
        
        const oldResults = document.getElementById('lottery-results-container');
        if (oldResults) { oldResults.remove(); }
        
        verifyBox.style.display = 'block';
    }
};

const handleYesClick = () => {
    document.getElementById('confirm-text').style.display = 'none';
    document.querySelector('.choice-btns').style.display = 'none';
    
    // Grabs the localized text object for the rendering context
    const currentLang = translations[langSelect.value] || translations["en-US"];
    const rText = currentLang.results; 
    
    let resultsContainer = document.getElementById('lottery-results-container');
    if (!resultsContainer) {
        resultsContainer = document.createElement('div');
        resultsContainer.id = 'lottery-results-container';
        verifyBox.appendChild(resultsContainer);
    }
    
    // Dynamic text for loading state
    resultsContainer.innerHTML = `<p style="padding: 20px; font-weight: bold; color: #007bff; text-align: center;">${rText.loading}</p>`;
    
    fetch(`${API_URL}?numbers=${recognizedNumbers.join(',')}`)
        .then(res => res.json())
        .then(categories => {

            const prizeMatrix = {
                6: { withBonus: 20000000, noBonus: 20000000, displayLabel: "$20,000,000" },
                5: { withBonus: 1000000,  noBonus: 10000,    displayLabel: `$10,000 / $1M ${rText.withBonus}` },
                4: { withBonus: 50000,    noBonus: 100,      displayLabel: `$100 / $50,000 ${rText.withBonus}` },
                3: { withBonus: 100,      noBonus: 10,       displayLabel: `$10 / $100 ${rText.withBonus}` }
            };
            
            let totalEstimatedGains = 0;
            let totalMatches = 0;

            // Loop para calcular o prêmio estimado baseado na presença do bônus por sorteio individual
            for (let m = 6; m >= 3; m--) {
                const draws = categories[m];
                if (draws && draws.length > 0) {
                    totalMatches += draws.length;
                    draws.forEach(draw => {
                        // --- NEW DIRECT FRONTEND CHECK ---
                        // Force a true bonus match if ANY number in your spoken list matches ANY number in the draw's bonus array
                        let explicitBonusMatch = false;
                        if (draw.bonus && draw.bonus.length > 0) {
                            explicitBonusMatch = draw.bonus.some(b => recognizedNumbers.includes(Number(b)));
                        }

                        // Use either the backend flag OR our new explicit frontend check
                        if (draw.hadBonusMatch || explicitBonusMatch) {
                            totalEstimatedGains += prizeMatrix[m].withBonus;
                        } else {
                            totalEstimatedGains += prizeMatrix[m].noBonus;
                        }
                    });
                }
            }

            const formattedGains = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(totalEstimatedGains);

// 1. Fixed Header Section (Pinned at the top of the card)
            let resultsHTML = `
                <div style="text-align: left; margin-top: 15px; display: flex; flex-direction: column; height: 550px;">
                    <h3 style="text-align: center; border-bottom: 2px solid #ddd; padding-bottom: 10px; margin: 0 0 15px 0;">
                        ${rText.title} (${totalMatches} ${rText.matches})
                    </h3>
                    
                    <div style="background-color: #fff3cd; border: 1px solid #ffeeba; border-radius: 10px; padding: 15px; margin-bottom: 15px; text-align: center; flex-shrink: 0;">
                        <span style="font-size: 0.85rem; font-weight: bold; color: #856404; text-transform: uppercase; display: block; margin-bottom: 5px;">
                            ${rText.estimateTitle}
                        </span>
                        <span style="font-size: 1.8rem; font-weight: 800; color: #28a745; display: block; margin-bottom: 8px;">
                            ${formattedGains}
                        </span>
                        <p style="font-size: 0.8rem; color: #665114; margin: 0; line-height: 1.4; font-style: italic;">
                            ${rText.estimateDesc}
                        </p>
                    </div>

                    <div style="flex-grow: 1; overflow-y: auto; padding-right: 10px; margin-bottom: 15px;">
            `;
            
            for (let matchNum = 6; matchNum >= 3; matchNum--) {
                const draws = categories[matchNum];
                if (draws && draws.length > 0) {
                    resultsHTML += `<h4 style="background-color: ${getTierColor(matchNum)}; color: white; padding: 6px 12px; border-radius: 6px; margin-top: 15px; position: sticky; top: 0; z-index: 10;">
                        ${matchNum} ${rText.matchLabel} (${draws.length} ${rText.draws}) — ${prizeMatrix[matchNum].displayLabel}
                    </h4><ul style="list-style: none; padding: 0; margin: 0;">`;
                    
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
            
            // Close scrollable container and add the action buttons at the absolute bottom
            resultsHTML += `
                    </div>
                    <button id="close-results-btn" style="width:100%; padding:10px; background-color:#6c757d; color:white; border:none; border-radius:5px; cursor:pointer; flex-shrink: 0;">${rText.close}</button>
                </div>`;
            
            resultsContainer.innerHTML = resultsHTML;

            // Restores original prompt view cleanly when closed
            document.getElementById('close-results-btn').onclick = () => {
                resultsContainer.remove();
                document.getElementById('confirm-text').style.display = 'block';
                document.querySelector('.choice-btns').style.display = 'flex';
                verifyBox.style.display = 'none';
                
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
