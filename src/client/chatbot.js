/**
 * FAQ Chatbot - Embeddable Widget Script
 * 
 * This script creates a floating chatbot widget that can be embedded on any website.
 * It loads a predefined set of FAQs from the server and allows users to ask questions.
 */

(function() {
  // Configuration (will be replaced with actual API key when generated)
  const API_KEY = '{{API_KEY}}';
  const API_URL = '{{API_URL}}';

  // Define language detection
  const detectLanguage = () => {
    const htmlLang = document.documentElement.lang;
    if (htmlLang && htmlLang.startsWith('he')) return 'he';
    return 'en'; // Default to English
  };

  // State
  let chatOpen = false;
  let projectConfig = null;
  let currentLanguage = detectLanguage();
  let sessionId = null;

  // Generate a random session ID
  const generateSessionId = () => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  };

  // Load project configuration from API
  const loadProject = async () => {
    try {
      const response = await fetch(`${API_URL}/api/projects/api-key/${API_KEY}`);
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          projectConfig = data.data;
          return true;
        }
      }
      console.error('Failed to load chatbot configuration');
      return false;
    } catch (error) {
      console.error('Error loading chatbot:', error);
      return false;
    }
  };

  // Create and inject CSS
  const injectStyles = () => {
    const direction = projectConfig.settings.direction;
    const position = projectConfig.settings.position;
    const primaryColor = projectConfig.settings.primaryColor;
    const secondaryColor = projectConfig.settings.secondaryColor;
    const fontFamily = projectConfig.settings.fontFamily;
    const fontSize = projectConfig.settings.fontSize;
    
    let positionStyles = '';
    if (position === 'bottom-right') {
      positionStyles = 'bottom: 20px; right: 20px;';
    } else if (position === 'bottom-left') {
      positionStyles = 'bottom: 20px; left: 20px;';
    } else if (position === 'top-right') {
      positionStyles = 'top: 20px; right: 20px;';
    } else if (position === 'top-left') {
      positionStyles = 'top: 20px; left: 20px;';
    }
    
    const css = `
      #faq-chatbot-container {
        position: fixed;
        z-index: 9999;
        ${positionStyles}
        font-family: ${fontFamily};
        direction: ${direction};
      }
      
      #faq-chatbot-icon {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background-color: ${primaryColor};
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
        transition: transform 0.3s ease;
        overflow: hidden;
      }
      
      #faq-chatbot-icon:hover {
        transform: scale(1.1);
      }
      
      #faq-chatbot-icon img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      
      #faq-chatbot-window {
        position: absolute;
        bottom: 70px;
        ${direction === 'rtl' ? 'right' : 'left'}: 0;
        width: 300px;
        height: 400px;
        background-color: #fff;
        border-radius: 10px;
        box-shadow: 0 5px 25px rgba(0, 0, 0, 0.2);
        display: flex;
        flex-direction: column;
        overflow: hidden;
        transition: transform 0.3s ease, opacity 0.3s ease;
        transform-origin: bottom ${direction === 'rtl' ? 'right' : 'left'};
        opacity: 0;
        transform: scale(0);
        pointer-events: none;
      }
      
      #faq-chatbot-window.open {
        opacity: 1;
        transform: scale(1);
        pointer-events: all;
      }
      
      #faq-chatbot-header {
        background-color: ${primaryColor};
        color: #fff;
        padding: 15px;
        text-align: ${direction === 'rtl' ? 'right' : 'left'};
        font-weight: bold;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      
      #faq-chatbot-close {
        background: none;
        border: none;
        color: #fff;
        font-size: 16px;
        cursor: pointer;
      }
      
      #faq-chatbot-messages {
        flex: 1;
        overflow-y: auto;
        padding: 15px;
        display: flex;
        flex-direction: column;
        gap: 10px;
        font-size: ${fontSize};
      }
      
      .chatbot-message {
        max-width: 80%;
        padding: 10px 15px;
        border-radius: 15px;
        margin-bottom: 5px;
      }
      
      .chatbot-message.bot {
        background-color: ${secondaryColor};
        align-self: ${direction === 'rtl' ? 'flex-end' : 'flex-start'};
        border-bottom-${direction === 'rtl' ? 'right' : 'left'}-radius: 5px;
      }
      
      .chatbot-message.user {
        background-color: ${primaryColor};
        color: #fff;
        align-self: ${direction === 'rtl' ? 'flex-start' : 'flex-end'};
        border-bottom-${direction === 'rtl' ? 'left' : 'right'}-radius: 5px;
      }
      
      #faq-chatbot-input {
        display: flex;
        border-top: 1px solid #e0e0e0;
        padding: 10px;
      }
      
      #faq-chatbot-input input {
        flex: 1;
        padding: 10px;
        border: 1px solid #e0e0e0;
        border-radius: 20px;
        outline: none;
        direction: ${direction};
        font-family: ${fontFamily};
      }
      
      #faq-chatbot-input button {
        background-color: ${primaryColor};
        color: #fff;
        border: none;
        border-radius: 20px;
        padding: 10px 15px;
        margin-${direction === 'rtl' ? 'right' : 'left'}: 10px;
        cursor: pointer;
      }
      
      @media (max-width: 480px) {
        #faq-chatbot-window {
          width: 280px;
          bottom: 70px;
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
    
    // Chat icon (trigger)
    const iconElement = document.createElement('div');
    iconElement.id = 'faq-chatbot-icon';
    
    const iconImg = document.createElement('img');
    iconImg.src = projectConfig.settings.chatIcon.startsWith('/uploads') 
      ? `${API_URL}${projectConfig.settings.chatIcon}` 
      : projectConfig.settings.chatIcon;
    iconImg.alt = 'Chat';
    iconElement.appendChild(iconImg);
    
    // Chat window
    const chatWindow = document.createElement('div');
    chatWindow.id = 'faq-chatbot-window';
    
    // Chat header
    const header = document.createElement('div');
    header.id = 'faq-chatbot-header';
    
    const title = document.createElement('div');
    title.textContent = projectConfig.name;
    header.appendChild(title);
    
    const closeButton = document.createElement('button');
    closeButton.id = 'faq-chatbot-close';
    closeButton.innerHTML = '&times;';
    header.appendChild(closeButton);
    
    // Messages container
    const messagesContainer = document.createElement('div');
    messagesContainer.id = 'faq-chatbot-messages';
    
    // Input area
    const inputArea = document.createElement('div');
    inputArea.id = 'faq-chatbot-input';
    
    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = currentLanguage === 'he' ? 'שאל/י שאלה...' : 'Ask a question...';
    
    const sendButton = document.createElement('button');
    sendButton.textContent = currentLanguage === 'he' ? 'שלח' : 'Send';
    
    inputArea.appendChild(input);
    inputArea.appendChild(sendButton);
    
    // Assemble chat window
    chatWindow.appendChild(header);
    chatWindow.appendChild(messagesContainer);
    chatWindow.appendChild(inputArea);
    
    // Add everything to container
    container.appendChild(iconElement);
    container.appendChild(chatWindow);
    
    document.body.appendChild(container);
    
    // Add event listeners
    iconElement.addEventListener('click', toggleChat);
    closeButton.addEventListener('click', toggleChat);
    sendButton.addEventListener('click', sendMessage);
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        sendMessage();
      }
    });
    
    // Show welcome message
    const welcomeMsg = projectConfig.settings.welcomeMessage[currentLanguage] ||
      projectConfig.settings.welcomeMessage[currentLanguage === 'he' ? 'en' : 'he'];
    
    if (welcomeMsg) {
      addMessage(welcomeMsg, 'bot');
    }
  };

  // Toggle chat open/closed
  const toggleChat = () => {
    const chatWindow = document.getElementById('faq-chatbot-window');
    
    if (chatOpen) {
      chatWindow.classList.remove('open');
    } else {
      chatWindow.classList.add('open');
      document.getElementById('faq-chatbot-messages').scrollTop = 
        document.getElementById('faq-chatbot-messages').scrollHeight;
    }
    
    chatOpen = !chatOpen;
  };

  // Add a message to the chat
  const addMessage = (text, sender) => {
    const messagesContainer = document.getElementById('faq-chatbot-messages');
    const messageElement = document.createElement('div');
    
    messageElement.className = `chatbot-message ${sender}`;
    messageElement.textContent = text;
    
    messagesContainer.appendChild(messageElement);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  };

  // Send a message and get response
  const sendMessage = async () => {
    const input = document.querySelector('#faq-chatbot-input input');
    const question = input.value.trim();
    
    if (!question) return;
    
    // Add user message to chat
    addMessage(question, 'user');
    
    // Clear input
    input.value = '';
    
    try {
      // Send question to API
      const response = await fetch(`${API_URL}/api/faq/answer/${projectConfig.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          question,
          language: currentLanguage,
          sessionId
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        
        if (data.success) {
          if (data.data.found) {
            // Add bot response to chat
            addMessage(data.data.answer, 'bot');
          } else {
            // No answer found
            const noAnswerMsg = currentLanguage === 'he'
              ? 'מצטער, לא מצאתי תשובה לשאלה זו.'
              : 'Sorry, I couldn\'t find an answer to that question.';
            
            addMessage(noAnswerMsg, 'bot');
          }
        } else {
          console.error('Error getting answer:', data.message);
          
          const errorMsg = currentLanguage === 'he'
            ? 'אירעה שגיאה, אנא נסה שנית מאוחר יותר.'
            : 'An error occurred, please try again later.';
          
          addMessage(errorMsg, 'bot');
        }
      } else {
        console.error('Error in API response:', response.statusText);
        
        const errorMsg = currentLanguage === 'he'
          ? 'אירעה שגיאה, אנא נסה שנית מאוחר יותר.'
          : 'An error occurred, please try again later.';
        
        addMessage(errorMsg, 'bot');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      
      const errorMsg = currentLanguage === 'he'
        ? 'אירעה שגיאה, אנא נסה שנית מאוחר יותר.'
        : 'An error occurred, please try again later.';
      
      addMessage(errorMsg, 'bot');
    }
  };

  // Initialize the chatbot
  const initChatbot = async () => {
    try {
      sessionId = generateSessionId();
      const projectLoaded = await loadProject();
      
      if (projectLoaded) {
        injectStyles();
        createChatUI();
      } else {
        console.error('Failed to initialize chatbot: Project configuration not loaded');
      }
    } catch (error) {
      console.error('Failed to initialize chatbot:', error);
    }
  };

  // Initialize on DOM load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initChatbot);
  } else {
    initChatbot();
  }
})(); 