// ====== 1. CONTROLE DE TAMANHO DE FONTE (Acessibilidade) ======
let currentFontSize = 16;
const bodyElement = document.body;

document.getElementById('btn-increase').addEventListener('click', () => {
    if (currentFontSize < 24) { // Limite máximo por bom senso de UX
        currentFontSize += 2;
        bodyElement.style.fontSize = currentFontSize + 'px';
    }
});

document.getElementById('btn-decrease').addEventListener('click', () => {
    if (currentFontSize > 12) { // Limite mínimo para manter legível
        currentFontSize -= 2;
        bodyElement.style.fontSize = currentFontSize + 'px';
    }
});

// ====== 2. MODAL DE AJUDA (Interações e HCI) ======
const helpModal = document.getElementById('help-modal');
const btnHelp = document.getElementById('btn-help');
const btnCloseModal = document.getElementById('close-modal');

function toggleModal(open) {
    if (open) {
        helpModal.classList.add('active');
        helpModal.setAttribute('aria-hidden', 'false');
        btnCloseModal.focus(); // Prática de HCI: joga o foco no botão fechar
    } else {
        helpModal.classList.remove('active');
        helpModal.setAttribute('aria-hidden', 'true');
        btnHelp.focus();
    }
}

btnHelp.addEventListener('click', () => toggleModal(true));
btnCloseModal.addEventListener('click', () => toggleModal(false));

// Fechar se clicar fora do conteúdo do modal
helpModal.addEventListener('click', (e) => {
    if (e.target === helpModal) toggleModal(false);
});


// ====== 3. LEITURA EM VOZ ALTA / TTS (Inclusão Social) ======
document.getElementById('btn-tts').addEventListener('click', () => {
    // Pega o texto da última mensagem que está no chat-output
    const chatOutput = document.getElementById('chat-output');
    const textToRead = chatOutput.innerText;

    // Cancela leituras anteriores que estejam rodando
    window.speechSynthesis.cancel();

    if (textToRead) {
        const utterance = new SpeechSynthesisUtterance(textToRead);
        utterance.lang = 'pt-BR';
        utterance.rate = 1.1; // Velocidade levemente ajustada para naturalidade
        window.speechSynthesis.speak(utterance);
    }
});


// ====== 4. MANIPULAÇÃO DO DOM & SIMULAÇÃO DO GEMINI ======
document.getElementById('gemini-form').addEventListener('submit', function(e) {
    e.preventDefault(); // Impede a página de recarregar

    const inputField = document.getElementById('user-input');
    const userText = inputField.value.trim();
    const chatOutput = document.getElementById('chat-output');

    if (!userText) return;

    // 1. Inserir a pergunta do usuário no DOM
    const userMessageDiv = document.createElement('div');
    userMessageDiv.className = 'message user-message-card';
    userMessageDiv.innerHTML = `<p><strong>Você:</strong> ${userText}</p>`;
    chatOutput.appendChild(userMessageDiv);

    // Limpar o campo de input
    inputField.value = '';

    // Rolar o chat para baixo automaticamente
    chatOutput.scrollTop = chatOutput.scrollHeight;

    // 2. Simular a resposta da IA (Gemini) enquanto processa
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'message gemini-message-card';
    loadingDiv.innerHTML = `<p><em><i class="fa-solid fa-spinner fa-spin"></i> Gemini está pensando...</em></p>`;
    chatOutput.appendChild(loadingDiv);
    chatOutput.scrollTop = chatOutput.scrollHeight;

    // 3. Resposta simulada baseada no que o aluno aprendeu (Simula a chamada da API)
    setTimeout(() => {
        // Remove a mensagem de carregando
        chatOutput.removeChild(loadingDiv);

        const geminiResponseDiv = document.createElement('div');
        geminiResponseDiv.className = 'message gemini-message-card';
        
        // Resposta didática simulada inteligente
        geminiResponseDiv.innerHTML = `
            <p><strong><i class="fa-solid fa-robot"></i> Gemini AI:</strong></p>
            <p>Recebi sua dúvida: "${userText}". Como um modelo de IA focado em inclusão, 
            lembre-se que para criar soluções web acessíveis você deve sempre validar o HTML semântico, 
            garantir o contraste de cores correto de acordo com a WCAG e respeitar os direitos digitais dos usuários!</p>
        `;
        
        chatOutput.appendChild(geminiResponseDiv);
        chatOutput.scrollTop = chatOutput.scrollHeight;
    }, 1500); // Espera 1.5 segundos para parecer real
});
