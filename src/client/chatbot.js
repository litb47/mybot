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
        0% { width: 0; }
        100% { width: 100%; }
      }

      .chatbot-container {
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 1000;
      }

      .chatbot-icon {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background: linear-gradient(135deg, #6B73FF 0%, #000DFF 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        box-shadow: 0 4px 12px rgba(0, 13, 255, 0.3);
        transition: all 0.3s ease;
        animation: pulse 2s infinite;
      }

      .chatbot-icon:hover {
        transform: scale(1.1);
        box-shadow: 0 6px 16px rgba(0, 13, 255, 0.4);
      }

      .chatbot-icon svg {
        width: 30px;
        height: 30px;
        color: white;
      }

      .chatbot-window {
        position: fixed;
        bottom: 90px;
        right: 20px;
        width: 350px;
        height: 500px;
        background: white;
        border-radius: 20px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        display: none;
        flex-direction: column;
        overflow: hidden;
        animation: slideIn 0.3s ease;
      }

      .chatbot-window.active {
        display: flex;
      }

      .chatbot-header {
        background: linear-gradient(135deg, #6B73FF 0%, #000DFF 100%);
        color: white;
        padding: 15px 20px;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }

      .chatbot-header h3 {
        margin: 0;
        font-size: 18px;
        font-weight: 500;
      }

      .chatbot-close {
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        padding: 5px;
        opacity: 0.8;
        transition: opacity 0.2s;
      }

      .chatbot-close:hover {
        opacity: 1;
      }

      .chatbot-messages {
        flex: 1;
        padding: 20px;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        gap: 15px;
      }

      .chatbot-message {
        max-width: 80%;
        padding: 12px 16px;
        border-radius: 15px;
        font-size: 14px;
        line-height: 1.4;
        animation: fadeIn 0.3s ease;
      }

      .chatbot-message.user {
        background: #F0F2FF;
        color: #000DFF;
        align-self: flex-end;
        border-bottom-right-radius: 5px;
      }

      .chatbot-message.bot {
        background: #E8E9FF;
        color: #333;
        align-self: flex-start;
        border-bottom-left-radius: 5px;
      }

      .chatbot-input {
        padding: 15px;
        border-top: 1px solid #eee;
        display: flex;
        gap: 10px;
      }

      .chatbot-input input {
        flex: 1;
        padding: 12px;
        border: 2px solid #eee;
        border-radius: 25px;
        font-size: 14px;
        transition: border-color 0.3s;
      }

      .chatbot-input input:focus {
        outline: none;
        border-color: #6B73FF;
      }

      .chatbot-input button {
        background: linear-gradient(135deg, #6B73FF 0%, #000DFF 100%);
        color: white;
        border: none;
        border-radius: 50%;
        width: 45px;
        height: 45px;
        cursor: pointer;
        transition: transform 0.2s;
      }

      .chatbot-input button:hover {
        transform: scale(1.05);
      }

      .chatbot-typing {
        display: flex;
        gap: 5px;
        padding: 12px 16px;
        background: #E8E9FF;
        border-radius: 15px;
        width: fit-content;
        margin-bottom: 15px;
      }

      .chatbot-typing span {
        width: 8px;
        height: 8px;
        background: #6B73FF;
        border-radius: 50%;
        animation: typing 1s infinite;
      }

      .chatbot-typing span:nth-child(2) {
        animation-delay: 0.2s;
      }

      .chatbot-typing span:nth-child(3) {
        animation-delay: 0.4s;
      }

      @media (max-width: 480px) {
        .chatbot-window {
          width: 100%;
          height: 100%;
          bottom: 0;
          right: 0;
          border-radius: 0;
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
    container.className = 'chatbot-container';
    
    const icon = document.createElement('div');
    icon.className = 'chatbot-icon';
    icon.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
      </svg>
    `;

    const window = document.createElement('div');
    window.className = 'chatbot-window';
    window.innerHTML = `
      <div class="chatbot-header">
        <h3>${data.title}</h3>
        <button class="chatbot-close">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </button>
      </div>
      <div class="chatbot-messages"></div>
      <div class="chatbot-input">
        <input type="text" placeholder="הקלד הודעה...">
        <button>
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
          </svg>
        </button>
      </div>
    `;

    // Assemble chat window
    container.appendChild(icon);
    container.appendChild(window);
    
    // Add to page
    document.body.appendChild(container);
    
    // Event listeners
    icon.addEventListener('click', () => {
      chatOpen = !chatOpen;
      window.classList.toggle('active');
      if (chatOpen) {
        const input = document.querySelector('.chatbot-input input');
        input.focus();
      }
    });
    
    const closeButton = document.querySelector('.chatbot-close');
    closeButton.addEventListener('click', () => {
      chatOpen = false;
      window.classList.remove('active');
    });
    
    const sendButton = document.querySelector('.chatbot-input button');
    sendButton.addEventListener('click', handleSendMessage);
    const input = document.querySelector('.chatbot-input input');
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
    const messagesContainer = document.querySelector('.chatbot-messages');
    
    if (type === 'bot' && !isTyping) {
      // Add typing indicator
      isTyping = true;
      const typingIndicator = document.createElement('div');
      typingIndicator.className = 'chatbot-typing';
      for (let i = 0; i < 3; i++) {
        const dot = document.createElement('span');
        dot.className = 'chatbot-typing-dot';
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
    const input = document.querySelector('.chatbot-input input');
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