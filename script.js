const CHANNELS_COUNT = 30;
const FX_LIST = ["APLAUSOS", "RISADA", "SIRENE", "EXPLOSÃO", "SUSPENSE", "VINHETA", "ERRO", "VITÓRIA", "TRANS", "BELL"];

document.addEventListener('DOMContentLoaded', () => {
    initMixer();
    initFX();
    animateVUs();
});

// Troca de Abas
function changeTab(tabId, btn) {
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    
    document.getElementById(tabId).classList.add('active');
    btn.classList.add('active');
}

// Criar Canais
function initMixer() {
    const render = document.getElementById('mixer-render');
    for (let i = 1; i <= CHANNELS_COUNT; i++) {
        const div = document.createElement('div');
        div.className = 'ch-strip';
        div.innerHTML = `
            <input type="text" class="ch-name" value="CH ${i}">
            <div style="height:40px; width:4px; background:#000; border-radius:2px; margin-bottom:10px">
                <div id="vu-${i}" style="width:100%; background:var(--accent); height:0%; transition:0.1s"></div>
            </div>
            <div class="fader-box">
                <input type="range" class="v-slider" id="vol-${i}" min="0" max="100" value="80">
            </div>
            <button class="btn-fx" style="height:35px; width:90%; font-size:10px; margin-top:15px" onclick="this.classList.toggle('active-btn')">MUTE</button>
        `;
        render.appendChild(div);
    }
}

// Criar Efeitos
function initFX() {
    const render = document.getElementById('fx-render');
    FX_LIST.forEach(fx => {
        const b = document.createElement('button');
        b.className = 'btn-fx';
        b.innerText = fx;
        b.onclick = () => {
            // Feedback haptico (vibração) se disponível
            if (navigator.vibrate) navigator.vibrate(50);
            console.log("Play: " + fx);
        };
        render.appendChild(b);
    });
}

// Animação de VU leve para Mobile
function animateVUs() {
    setInterval(() => {
        const activeTab = document.getElementById('mixer').classList.contains('active');
        if(!activeTab) return; // Economiza CPU se não estiver no mixer

        for(let i=1; i<=CHANNELS_COUNT; i+=2) { // Atualiza metade dos canais por vez para performance
            const val = Math.random() * 70;
            const el = document.getElementById(`vu-${i}`);
            if(el) el.style.height = val + "%";
        }
    }, 200);
}

// Simulação Bluetooth
function simulateConnect() {
    const status = document.getElementById('status-text');
    const dot = document.getElementById('bt-dot');
    status.innerText = "BUSCANDO...";
    
    setTimeout(() => {
        status.innerText = "CONECTADO: PHONE-AUDIO-BT";
        dot.style.background = "#39ff14";
        dot.style.boxShadow = "0 0 10px #39ff14";
    }, 1500);
}

// Presets
function savePreset() {
    const vals = {};
    for(let i=1; i<=30; i++) vals[i] = document.getElementById(`vol-${i}`).value;
    localStorage.setItem('mobile_mixer_save', JSON.stringify(vals));
    alert("PRESET SALVO");
}

function loadPreset() {
    const data = JSON.parse(localStorage.getItem('mobile_mixer_save'));
    if(data) {
        Object.keys(data).forEach(k => document.getElementById(`vol-${k}`).value = data[k]);
        alert("PRESET CARREGADO");
    }
}