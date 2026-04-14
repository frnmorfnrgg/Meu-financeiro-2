let dadosHub = {
    lucro: parseFloat(localStorage.getItem('hub_lucro') || 0),
    investido: parseFloat(localStorage.getItem('hub_inv') || 0)
};

atualizarInterfaceHub();

function toggleMenu() {
    document.getElementById('sidebar').classList.toggle('open');
    document.getElementById('overlay').classList.toggle('active');
}

function showPage(p) {
    document.querySelectorAll('.page').forEach(c => c.classList.remove('active'));
    document.getElementById('page-' + p).classList.add('active');
    document.getElementById('btn-puxar-ia').style.display = (p === 'ia') ? 'block' : 'none';
    document.getElementById('btn-lancar-pedro').style.display = (p === 'fin') ? 'block' : 'none';
    toggleMenu();
}

function puxarDadosIA() {
    const frameIA = document.getElementById('iframe-ia').contentWindow;
    frameIA.postMessage({ type: 'requestFullHistory' }, '*');
}

function transferirParaCentro() {
    const frameFin = document.getElementById('iframe-fin').contentWindow;
    frameFin.postMessage({
        type: 'forceUpdateFinance',
        lucro: dadosHub.lucro,
        investido: dadosHub.investido
    }, '*');
    alert("🚀 Saldo enviado para as caixas de "+ document.getElementById('iframe-fin').src);
}

window.addEventListener('message', function(event) {
    if (event.data.type === 'sync_history') {
        dadosHub.lucro = event.data.lucroTotal;
        dadosHub.investido = event.data.invTotal;
        localStorage.setItem('hub_lucro', dadosHub.lucro);
        localStorage.setItem('hub_inv', dadosHub.investido);
        atualizarInterfaceHub();
        alert("✅ Topo atualizado!");
    }
});

function atualizarInterfaceHub() {
    document.getElementById('saldo-lucro').innerText = 'R$ ' + dadosHub.lucro.toLocaleString('pt-BR', {minimumFractionDigits: 2});
    document.getElementById('saldo-inv').innerText = 'R$ ' + dadosHub.investido.toLocaleString('pt-BR', {minimumFractionDigits: 2});
}

function resetarTudo() {
    if(confirm("Zerar?")) { localStorage.clear(); location.reload(); }
}
