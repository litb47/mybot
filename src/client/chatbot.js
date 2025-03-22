/**
 * Modern FAQ Chatbot Widget
 * 
 * A futuristic and modern chatbot widget with sleek animations and design
 */

(function() {
  // Check if required data is available
  if (typeof faqData === 'undefined' || typeof styleData === 'undefined') {
    console.error('FAQ Chatbot: Required data is missing');
    return;
  }

  // State
  let chatOpen = false;
  let messages = [];
  let inputValue = '';
  let isTyping = false;

  // Create and inject CSS
  const injectStyles = () => {
    const css = `
      @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
      }

      @keyframes slideIn {
        from { transform: translateY(20px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
      }

      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }

      @keyframes typing {
        0% { opacity: 0.3; }
        50% { opacity: 1; }
        100% { opacity: 0.3; }
      }

      #faq-chatbot-container {
        position: fixed;
        z-index: 9999;
        ${styleData.position.includes('right') ? 'right: 20px;' : 'left: 20px;'}
        ${styleData.position.includes('bottom') ? 'bottom: 20px;' : 'top: 20px;'}
        font-family: ${styleData.fontFamily};
        direction: rtl;
      }
      
      #faq-chatbot-icon {
        width: 65px;
        height: 65px;
        border-radius: 20px;
        background: linear-gradient(135deg, ${styleData.primaryColor}, ${styleData.secondaryColor});
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        transition: all 0.3s ease;
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255,255,255,0.1);
      }
      
      #faq-chatbot-icon:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 25px rgba(0,0,0,0.2);
        animation: pulse 2s infinite;
      }
      
      #faq-chatbot-icon img {
        width: 30px;
        height: 30px;
        object-fit: contain;
        filter: brightness(0) invert(1);
        transition: transform 0.3s ease;
      }

      #faq-chatbot-icon:hover img {
        transform: scale(1.1);
      }
      
      #faq-chatbot-window {
        position: absolute;
        bottom: 80px;
        ${styleData.position.includes('right') ? 'right: 0;' : 'left: 0;'}
        width: 380px;
        height: 600px;
        background: rgba(255,255,255,0.95);
        border-radius: 24px;
        box-shadow: 0 10px 40px rgba(0,0,0,0.1);
        display: flex;
        flex-direction: column;
        overflow: hidden;
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        transform-origin: bottom ${styleData.position.includes('right') ? 'right' : 'left'};
        opacity: 0;
        transform: scale(0.95);
        pointer-events: none;
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255,255,255,0.2);
      }
      
      #faq-chatbot-window.open {
        opacity: 1;
        transform: scale(1);
        pointer-events: all;
      }
      
      #faq-chatbot-header {
        background: linear-gradient(135deg, ${styleData.primaryColor}, ${styleData.secondaryColor});
        color: #fff;
        padding: 20px;
        text-align: right;
        font-weight: 600;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid rgba(255,255,255,0.1);
      }

      #faq-chatbot-header .title {
        font-size: 1.1em;
        display: flex;
        align-items: center;
        gap: 8px;
      }

      #faq-chatbot-header .status {
        font-size: 0.8em;
        opacity: 0.8;
      }
      
      #faq-chatbot-close {
        background: none;
        border: none;
        color: #fff;
        font-size: 24px;
        cursor: pointer;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s ease;
        backdrop-filter: blur(5px);
        background: rgba(255,255,255,0.1);
      }

      #faq-chatbot-close:hover {
        background: rgba(255,255,255,0.2);
        transform: rotate(90deg);
      }
      
      #faq-chatbot-messages {
        flex: 1;
        overflow-y: auto;
        padding: 20px;
        display: flex;
        flex-direction: column;
        gap: 15px;
        font-size: ${styleData.fontSize};
        scroll-behavior: smooth;
      }

      #faq-chatbot-messages::-webkit-scrollbar {
        width: 6px;
      }

      #faq-chatbot-messages::-webkit-scrollbar-track {
        background: rgba(0,0,0,0.05);
        border-radius: 3px;
      }

      #faq-chatbot-messages::-webkit-scrollbar-thumb {
        background: rgba(0,0,0,0.1);
        border-radius: 3px;
      }
      
      .chatbot-message {
        max-width: 85%;
        padding: 12px 18px;
        border-radius: 18px;
        margin-bottom: 5px;
        animation: slideIn 0.3s ease forwards;
        position: relative;
        line-height: 1.5;
      }

      .chatbot-message::before {
        content: '';
        position: absolute;
        width: 0;
        height: 0;
        border-style: solid;
      }
      
      .chatbot-message.bot {
        background: linear-gradient(135deg, ${styleData.secondaryColor}40, ${styleData.secondaryColor}20);
        align-self: flex-end;
        border-bottom-right-radius: 5px;
        border: 1px solid ${styleData.secondaryColor}30;
      }

      .chatbot-message.bot::before {
        border-width: 8px 0 8px 8px;
        border-color: transparent transparent transparent ${styleData.secondaryColor}20;
        right: -8px;
        bottom: 0;
      }
      
      .chatbot-message.user {
        background: linear-gradient(135deg, ${styleData.primaryColor}, ${styleData.primaryColor}90);
        color: #fff;
        align-self: flex-start;
        border-bottom-left-radius: 5px;
        box-shadow: 0 2px 10px ${styleData.primaryColor}30;
      }

      .chatbot-message.user::before {
        border-width: 8px 8px 8px 0;
        border-color: transparent ${styleData.primaryColor} transparent transparent;
        left: -8px;
        bottom: 0;
      }

      .typing-indicator {
        display: flex;
        gap: 5px;
        padding: 12px 18px;
        background: ${styleData.secondaryColor}20;
        border-radius: 18px;
        width: fit-content;
        align-self: flex-end;
        margin-bottom: 5px;
      }

      .typing-dot {
        width: 8px;
        height: 8px;
        background: ${styleData.secondaryColor};
        border-radius: 50%;
        animation: typing 1.5s infinite;
      }

      .typing-dot:nth-child(2) { animation-delay: 0.2s; }
      .typing-dot:nth-child(3) { animation-delay: 0.4s; }
      
      #faq-chatbot-input {
        display: flex;
        padding: 20px;
        gap: 10px;
        background: rgba(255,255,255,0.9);
        border-top: 1px solid rgba(0,0,0,0.05);
        backdrop-filter: blur(10px);
      }
      
      #faq-chatbot-input input {
        flex: 1;
        padding: 12px 20px;
        border: 1px solid rgba(0,0,0,0.1);
        border-radius: 15px;
        outline: none;
        direction: rtl;
        font-family: ${styleData.fontFamily};
        font-size: 0.95em;
        transition: all 0.3s ease;
        background: rgba(255,255,255,0.9);
      }

      #faq-chatbot-input input:focus {
        border-color: ${styleData.primaryColor};
        box-shadow: 0 0 0 3px ${styleData.primaryColor}20;
      }
      
      #faq-chatbot-input button {
        background: linear-gradient(135deg, ${styleData.primaryColor}, ${styleData.primaryColor}90);
        color: #fff;
        border: none;
        border-radius: 15px;
        padding: 12px 25px;
        cursor: pointer;
        transition: all 0.3s ease;
        font-weight: 600;
        display: flex;
        align-items: center;
        gap: 8px;
      }

      #faq-chatbot-input button:hover {
        transform: translateY(-2px);
        box-shadow: 0 5px 15px ${styleData.primaryColor}30;
      }

      #faq-chatbot-input button:active {
        transform: translateY(0);
      }

      @media (max-width: 480px) {
        #faq-chatbot-window {
          width: calc(100vw - 40px);
          height: calc(100vh - 100px);
          bottom: 80px;
        }

        #faq-chatbot-icon {
          width: 55px;
          height: 55px;
          border-radius: 16px;
        }
      }
    `;
    
    const styleElement = document.createElement('style');
    styleElement.type = 'text/css';
    styleElement.appendChild(document.createTextNode(css));
    document.head.appendChild(styleElement);
  };

  // Create chat UI
  const createChatUI = () => {
    const container = document.createElement('div');
    container.id = 'faq-chatbot-container';
    
    // Chat icon
    const iconElement = document.createElement('div');
    iconElement.id = 'faq-chatbot-icon';
    
    const iconImg = document.createElement('img');
    iconImg.src = styleData.chatIcon;
    iconImg.alt = 'Chat';
    iconElement.appendChild(iconImg);
    
    // Chat window
    const chatWindow = document.createElement('div');
    chatWindow.id = 'faq-chatbot-window';
    
    // Chat header
    const header = document.createElement('div');
    header.id = 'faq-chatbot-header';
    
    const titleContainer = document.createElement('div');
    titleContainer.className = 'title';
    
    const title = document.createElement('div');
    title.textContent = 'AI צ\'אט תמיכה';
    titleContainer.appendChild(title);
    
    const status = document.createElement('div');
    status.className = 'status';
    status.textContent = 'מחובר | זמין לשיחה';
    titleContainer.appendChild(status);
    
    header.appendChild(titleContainer);
    
    const closeButton = document.createElement('button');
    closeButton.id = 'faq-chatbot-close';
    closeButton.innerHTML = '×';
    header.appendChild(closeButton);
    
    // Messages container
    const messagesContainer = document.createElement('div');
    messagesContainer.id = 'faq-chatbot-messages';
    
    // Input container
    const inputContainer = document.createElement('div');
    inputContainer.id = 'faq-chatbot-input';
    
    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'הקלד את שאלתך...';
    
    const sendButton = document.createElement('button');
    sendButton.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>שלח';
    
    inputContainer.appendChild(input);
    inputContainer.appendChild(sendButton);
    
    // Assemble chat window
    chatWindow.appendChild(header);
    chatWindow.appendChild(messagesContainer);
    chatWindow.appendChild(inputContainer);
    
    // Assemble container
    container.appendChild(iconElement);
    container.appendChild(chatWindow);
    
    // Add to page
    document.body.appendChild(container);
    
    // Event listeners
    iconElement.addEventListener('click', () => {
      chatOpen = !chatOpen;
      chatWindow.classList.toggle('open');
      if (chatOpen) {
        input.focus();
      }
    });
    
    closeButton.addEventListener('click', () => {
      chatOpen = false;
      chatWindow.classList.remove('open');
    });
    
    sendButton.addEventListener('click', handleSendMessage);
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        handleSendMessage();
      }
    });
    
    // Add welcome message
    setTimeout(() => {
      addMessage('שלום! 👋 אני עוזר AI חכם שישמח לעזור לך. במה אוכל לסייע?', 'bot');
    }, 500);
  };

  // Add message to chat
  const addMessage = (content, type) => {
    const messagesContainer = document.getElementById('faq-chatbot-messages');
    
    if (type === 'bot' && !isTyping) {
      // Add typing indicator
      isTyping = true;
      const typingIndicator = document.createElement('div');
      typingIndicator.className = 'typing-indicator';
      for (let i = 0; i < 3; i++) {
        const dot = document.createElement('div');
        dot.className = 'typing-dot';
        typingIndicator.appendChild(dot);
      }
      messagesContainer.appendChild(typingIndicator);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
      
      // Remove typing indicator and add message after delay
      setTimeout(() => {
        messagesContainer.removeChild(typingIndicator);
        const messageElement = document.createElement('div');
        messageElement.className = `chatbot-message ${type}`;
        messageElement.textContent = content;
        messagesContainer.appendChild(messageElement);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        isTyping = false;
      }, 1500);
    } else {
      const messageElement = document.createElement('div');
      messageElement.className = `chatbot-message ${type}`;
      messageElement.textContent = content;
      messagesContainer.appendChild(messageElement);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  };

  // Handle sending message
  const handleSendMessage = () => {
    const input = document.querySelector('#faq-chatbot-input input');
    const message = input.value.trim();
    
    if (!message) return;
    
    // Add user message
    addMessage(message, 'user');
    input.value = '';
    
    // Find best matching answer
    const bestMatch = findBestMatch(message);
    
    // Add bot response
    addMessage(bestMatch || 'מצטער, לא מצאתי תשובה מתאימה לשאלתך. נסה לשאול בצורה אחרת.', 'bot');
  };

  // Find best matching answer
  const findBestMatch = (query) => {
    const queryWords = query.toLowerCase().split(' ');
    let bestMatch = null;
    let bestScore = 0;

    faqData.forEach(item => {
      const questionWords = item.question.toLowerCase().split(' ');
      const score = queryWords.filter(word => 
        questionWords.includes(word)
      ).length;

      if (score > bestScore) {
        bestScore = score;
        bestMatch = item.answer;
      }
    });

    return bestMatch;
  };

  // Initialize
  injectStyles();
  createChatUI();
})(); 