// Memória persistente do HUB
let dadosHub = {
    lucro: parseFloat(localStorage.getItem('hub_lucro') || 0),
    investido: parseFloat(localStorage.getItem('hub_inv') || 0)
};

// Inicializa a tela com os valores salvos
atualizarInterfaceHub();

function toggleMenu() {
    document.getElementById('sidebar').classList.toggle('open');
    document.getElementById('overlay').classList.toggle('active');
}

function showPage(p) {
    document.querySelectorAll('.page').forEach(c => c.classList.remove('active'));
    document.getElementById('page-' + p).classList.add('active');
    
    // Mostra o botão certo para cada aba
    document.getElementById('btn-puxar-ia').style.display = (p === 'ia') ? 'block' : 'none';
    document.getElementById('btn-lancar-pedro').style.display = (p === 'fin') ? 'block' : 'none';
    
    toggleMenu();
}

// 1. Solicita dados ao Iframe da IA (Site Cavalo)
function puxarDadosIA() {
    const frameIA = document.getElementById('iframe-ia').contentWindow;
    frameIA.postMessage({ type: 'requestFullHistory' }, '*');
}

// 2. Envia os dados do Topo para o Painel Central (Site Pedro)
function transferirParaCentro() {
    const frameFin = document.getElementById('iframe-fin').contentWindow;
    frameFin.postMessage({
        type: 'forceUpdateFinance',
        lucro: dadosHub.lucro,
        investido: dadosHub.investido
    }, '*');
    alert("🚀 Saldo enviado para os campos centrais!");
}

// Escuta as respostas dos sites filhos
window.addEventListener('message', function(event) {
    // Quando recebe os dados da IA
    if (event.data.type === 'sync_history') {
        dadosHub.lucro = event.data.lucroTotal;
        dadosHub.investido = event.data.invTotal;
        
        // Salva no Navegador
        localStorage.setItem('hub_lucro', dadosHub.lucro);
        localStorage.setItem('hub_inv', dadosHub.investido);
        
        atualizarInterfaceHub();
        alert("✅ Topo atualizado! Agora vá no Financeiro e clique em LANÇAR.");
    }
});

function atualizarInterfaceHub() {
    document.getElementById('saldo-lucro').innerText = 'R$ ' + dadosHub.lucro.toLocaleString('pt-BR', {minimumFractionDigits: 2});
    document.getElementById('saldo-inv').innerText = 'R$ ' + dadosHub.investido.toLocaleString('pt-BR', {minimumFractionDigits: 2});
}

function resetarTudo() {
    if(confirm("Deseja zerar os saldos do Hub?")) {
        localStorage.clear();
        location.reload();
    }
}
