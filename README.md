# 🤖 Chat de Tradução Simples

Este é um projeto de um chat simples construído com HTML, CSS e JavaScript puro. A aplicação permite que o usuário envie uma mensagem, que é então traduzida automaticamente entre português e inglês por um "bot tradutor".

O projeto foi desenvolvido para ser uma aplicação frontend pura, sem a necessidade de um backend ou dependências complexas, rodando diretamente no navegador.

## ✨ Funcionalidades

- **Tradução Automática:** Detecta se a mensagem está em português ou inglês e a traduz para o outro idioma.
- **Interface de Chat:** Exibe as mensagens do usuário e as respostas do bot em balões de conversa distintos.
- **Avatares:** Avatares em SVG para o usuário e para o bot.
- **Indicador de Digitação:** Mostra um aviso de "Bot Tradutor está digitando..." enquanto a tradução é processada.
- **Copiar Mensagens:** Cada balão de mensagem possui um botão para copiar seu conteúdo para a área de transferência.
- **Persistência de Dados:**
    - **Histórico de Conversa:** O histórico do chat é salvo no `localStorage` do navegador, permitindo que a conversa seja restaurada ao recarregar a página.
    - **Preferência de Tema:** A escolha entre o tema claro ou escuro também é salva.
- **Menu de Configurações:**
    - **Alternador de Tema:** Permite trocar entre um tema claro e um escuro.
    - **Limpar Histórico:** Oferece um botão para apagar todo o histórico da conversa (com uma janela de confirmação).

## 🛠️ Tecnologias Utilizadas

- **HTML5**
- **CSS3**
- **JavaScript (ES6+)**
- **API:** MyMemory Translated API para as traduções.

## 🚀 Como Usar

Como este é um projeto puramente frontend, não há necessidade de instalação de pacotes ou de um servidor complexo.

1.  Clone ou baixe este repositório.
2.  Certifique-se de que os três arquivos principais estejam na mesma pasta:
    - `index.html` (Estrutura da página)
    - `style.css` (Estilos da página - *nome de arquivo sugerido*)
    - `main.js` (Lógica da aplicação)
3.  Abra o arquivo `index.html` em qualquer navegador moderno (Chrome, Firefox, Edge, etc.).
4.  Comece a digitar e veja a mágica acontecer!

## 📂 Estrutura do Projeto

```
/
├── 📄 index.html     # Arquivo principal com a estrutura HTML do chat
├── 🎨 style.css       # Folha de estilos para a aparência do chat (crie este arquivo)
└── 📜 main.js         # Contém toda a lógica JavaScript da aplicação
```

### `main.js`

O coração da aplicação. Suas responsabilidades incluem:
- Manipular eventos do DOM (envio de formulário, cliques em botões).
- Criar e exibir dinamicamente os elementos de mensagem no chat.
- Gerenciar o indicador de "digitando".
- Fazer a chamada `fetch` para a API de tradução.
- Salvar e carregar o histórico e as preferências do `localStorage`.
- Gerenciar a lógica do menu de configurações.

## 🔮 Possíveis Melhorias

- **Seleção de Idiomas:** Adicionar menus `dropdown` para que o usuário possa escolher os idiomas de origem e destino, em vez da detecção automática.
- **Melhorar Detecção de Idioma:** A detecção atual é simples. Utilizar uma biblioteca mais robusta para identificar o idioma de entrada poderia melhorar a precisão.
- **Tratamento de Erros na UI:** Exibir mensagens de erro de forma mais amigável na interface do usuário quando a API falhar, em vez de apenas no console.
- **Animações:** Adicionar transições suaves para o aparecimento de novas mensagens e para a abertura do menu de configurações.
- **Web Components:** Refatorar as mensagens do chat para se tornarem Web Components reutilizáveis.

---

*Este README foi gerado para documentar o projeto de chat com tradução.*