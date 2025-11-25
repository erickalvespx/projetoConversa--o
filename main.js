// Pega os elementos do HTML para que possamos manipulá-los
const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const msgInput = document.getElementById('msg');
const settingsBtn = document.getElementById('settings-btn');
const settingsMenu = document.getElementById('settings-menu');
const themeToggleBtn = document.getElementById('theme-toggle-btn');

// --- AVATARES GERADOS COMO SVG ---
// Avatar genérico (estilo WhatsApp)
const USER_AVATAR = `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd"><path d="M24 22h-24v-20h24v20zm-1-19h-22v18h22v-18zm-6 16h-10v-1h10v1zm-5-3c-3.311 0-6-2.689-6-6s2.689-6 6-6 6 2.689 6 6-2.689 6-6 6zm0-1c2.759 0 5-2.241 5-5s-2.241-5-5-5-5 2.241-5 5 2.241 5 5 5zm-5-7h10v-1h-10v1z"/></svg>`;
// Avatar do Bot
const BOT_AVATAR = `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd"><path d="M7 19h10v-1h-10v1zm-4-2h18v-12h-18v12zm1-11h16v10h-16v-10zm8 2c1.656 0 3 1.344 3 3s-1.344 3-3 3-3-1.344-3-3 1.344-3 3-3zm0 1c1.104 0 2 .896 2 2s-.896 2-2 2-2-.896-2-2 .896-2 2-2zm-5-4h10v-1h-10v1zm2-1h6v-1h-6v1z"/></svg>`;
// Ícone de Copiar
const COPY_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M22 6v16h-16v-16h16zm2-2h-20v20h20v-20zm-24 16h2v-14h14v-2h-16v16z"/></svg>`;

// Array para armazenar o histórico da conversa em memória
let chatHistory = [];

// A função do event listener agora é 'async' para poder usar 'await'
chatForm.addEventListener('submit', async (e) => {
    // Previne o comportamento padrão do formulário (que é recarregar a página)
    e.preventDefault();

    // Pega o texto que o usuário digitou
    const msgText = msgInput.value;

    if (!msgText) {
        return;
    }

    // Cria e exibe a mensagem original do usuário
    outputMessage('Você', msgText);
    saveMessageToHistory('Você', msgText);
    
    // Limpa o campo de digitação e foca nele para a próxima mensagem
    msgInput.value = '';
    msgInput.focus();

    // Mostra o indicador de "digitando"
    showTypingIndicator();

    // Pega o texto traduzido da API
    const translatedText = await getTranslation(msgText);

    // Remove o indicador de "digitando"
    removeTypingIndicator();

    // Exibe a mensagem traduzida
    outputMessage('Bot Tradutor', translatedText);
    saveMessageToHistory('Bot Tradutor', translatedText);
});

// Adiciona um "ouvinte" para o clique no botão de configurações
settingsBtn.addEventListener('click', (e) => {
    e.stopPropagation(); // Impede que o clique se propague para o window
    settingsMenu.classList.toggle('show');
});

// Fecha o menu se o usuário clicar em qualquer outro lugar
window.addEventListener('click', () => {
    if (settingsMenu.classList.contains('show')) {
        settingsMenu.classList.remove('show');
    }
});

// Lógica para o botão de alternar tema
themeToggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('light-theme');

    // Salva a preferência do tema no localStorage
    if (document.body.classList.contains('light-theme')) {
        localStorage.setItem('theme', 'light');
        themeToggleBtn.textContent = 'Alterar para Tema Escuro';
    } else {
        localStorage.setItem('theme', 'dark');
        themeToggleBtn.textContent = 'Alterar para Tema Claro';
    }
});

// Lógica para o botão de limpar DENTRO do menu
const clearChatMenuBtn = document.getElementById('clear-chat-menu-btn');
clearChatMenuBtn.addEventListener('click', () => {
    // Pede confirmação ao usuário
    if (confirm('Tem certeza que deseja limpar todo o histórico? Esta ação não pode ser desfeita.')) {
        localStorage.removeItem('chatHistory');
        chatHistory = [];
        chatMessages.innerHTML = '';
    }
});

/**
 * Função que cria os elementos HTML para uma nova mensagem e a exibe na tela.
 * @param {string} user - O nome do usuário que enviou a mensagem (ex: "Você", "Bot Tradutor").
 * @param {string} text - O texto da mensagem.
 */
function outputMessage(user, text) {
    const div = document.createElement('div');
    div.classList.add('message');
    // Adiciona uma classe específica para as mensagens do usuário
    if (user === 'Você') {
        div.classList.add('user-message');
    }

    // Cria um container para o balão de texto (meta + texto)
    const messageBubble = document.createElement('div');
    messageBubble.classList.add('message-bubble');

    // Cria o botão de copiar
    const copyBtn = document.createElement('button');
    copyBtn.classList.add('copy-btn');
    copyBtn.innerHTML = COPY_ICON;
    copyBtn.title = 'Copiar texto';
    copyBtn.addEventListener('click', () => {
        // Usa a API do Clipboard para copiar o texto
        navigator.clipboard.writeText(text).then(() => {
            // Feedback visual temporário
            copyBtn.classList.add('copied');
            copyBtn.innerHTML = '✓'; // Ícone de check
            setTimeout(() => { 
                copyBtn.classList.remove('copied');
                copyBtn.innerHTML = COPY_ICON; 
            }, 1500);
        });
    });
    messageBubble.appendChild(copyBtn);

    const pMeta = document.createElement('p');
    pMeta.classList.add('meta');
    pMeta.innerText = user;
    
    const time = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    pMeta.innerHTML += ` <span>${time}</span>`;
    messageBubble.appendChild(pMeta);

    const pText = document.createElement('p');
    pText.classList.add('text');
    pText.innerText = text;
    messageBubble.appendChild(pText);

    // Cria o elemento do avatar e insere o SVG
    const avatarDiv = document.createElement('div');
    avatarDiv.classList.add('avatar');
    avatarDiv.innerHTML = user === 'Você' ? USER_AVATAR : BOT_AVATAR;

    div.appendChild(messageBubble);
    div.insertBefore(avatarDiv, messageBubble); // Insere o avatar ANTES do balão
    chatMessages.appendChild(div);

    // Rola a tela para a última mensagem
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

/**
 * Mostra uma mensagem de "digitando..." no chat.
 */
function showTypingIndicator() {
    const div = document.createElement('div');
    // Adiciona um ID para que possamos encontrá-lo e removê-lo facilmente
    div.id = 'typing-indicator';
    div.classList.add('message');

    div.innerHTML = `<p class="text"><i>Bot Tradutor está digitando...</i></p>`;
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

/**
 * Remove a mensagem de "digitando..." do chat.
 */
function removeTypingIndicator() {
    const indicator = document.getElementById('typing-indicator');
    if (indicator) {
        indicator.remove();
    }
}
/**
 * Conecta-se à API MyMemory para obter a tradução.
 * @param {string} text - O texto a ser traduzido.
 * @returns {Promise<string>} O texto traduzido.
 */
async function getTranslation(text) {
    // Detecção simples de idioma
    const isPortuguese = /[áàâãéèêíïóôõöúçñ]/i.test(text);
    const sourceLang = isPortuguese ? 'pt-br' : 'en';
    const targetLang = isPortuguese ? 'en' : 'pt-br';

    const apiUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${sourceLang}|${targetLang}`;

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error('A resposta da rede não foi boa.');
        }
        const data = await response.json();
        
        // Acessa o texto traduzido dentro da resposta da API
        return data.responseData.translatedText;

    } catch (error) {
        console.error('Erro ao buscar tradução:', error);
        return "Desculpe, não foi possível traduzir neste momento.";
    }
}

/**
 * Salva uma única mensagem no array de histórico e no localStorage.
 * @param {string} user 
 * @param {string} text 
 */
function saveMessageToHistory(user, text) {
    chatHistory.push({ user, text });
    localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
}

/**
 * Carrega o histórico do chat do localStorage e o exibe na tela.
 */
function loadHistory() {
    const savedHistory = localStorage.getItem('chatHistory');

    if (savedHistory) {
        chatHistory = JSON.parse(savedHistory);
        chatHistory.forEach(message => {
            outputMessage(message.user, message.text);
        });
    }
}

// Função para carregar as preferências do usuário
function loadUserPreferences() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.body.classList.add('light-theme');
        themeToggleBtn.textContent = 'Alterar para Tema Escuro';
    } else {
        themeToggleBtn.textContent = 'Alterar para Tema Claro';
    }
}

// Carrega o histórico assim que a página é aberta
loadHistory();
// Carrega as preferências do usuário
loadUserPreferences();
