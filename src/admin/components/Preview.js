import React, { useEffect, useState } from 'react';
import { Box, Paper, Typography } from '@mui/material';

function Preview({ faqData, styleData }) {
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    // Add welcome message
    setMessages([
      {
        type: 'bot',
        content: 'שלום! אני כאן כדי לעזור לך. איך אוכל לסייע?'
      }
    ]);
  }, []);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    // Add user message
    setMessages(prev => [...prev, { type: 'user', content: inputValue }]);

    // Find best matching answer
    const bestMatch = findBestMatch(inputValue, faqData);
    
    // Add bot response
    setTimeout(() => {
      setMessages(prev => [...prev, {
        type: 'bot',
        content: bestMatch || 'מצטער, לא מצאתי תשובה מתאימה לשאלתך. נסה לשאול בצורה אחרת.'
      }]);
    }, 500);

    setInputValue('');
  };

  const findBestMatch = (query, faqData) => {
    // Simple matching for now - can be improved with more sophisticated NLP
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

  const styles = {
    container: {
      position: 'fixed',
      [styleData.position.includes('right') ? 'right' : 'left']: '20px',
      [styleData.position.includes('bottom') ? 'bottom' : 'top']: '20px',
      zIndex: 9999,
      fontFamily: styleData.fontFamily,
      direction: 'rtl'
    },
    chatIcon: {
      width: '60px',
      height: '60px',
      borderRadius: '50%',
      backgroundColor: styleData.primaryColor,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
      transition: 'transform 0.3s ease'
    },
    chatWindow: {
      position: 'absolute',
      bottom: '70px',
      [styleData.position.includes('right') ? 'right' : 'left']: '0',
      width: '300px',
      height: '400px',
      backgroundColor: '#fff',
      borderRadius: '10px',
      boxShadow: '0 5px 25px rgba(0,0,0,0.2)',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      transition: 'transform 0.3s ease, opacity 0.3s ease',
      transformOrigin: `bottom ${styleData.position.includes('right') ? 'right' : 'left'}`,
      opacity: chatOpen ? 1 : 0,
      transform: chatOpen ? 'scale(1)' : 'scale(0)',
      pointerEvents: chatOpen ? 'all' : 'none'
    },
    header: {
      backgroundColor: styleData.primaryColor,
      color: '#fff',
      padding: '15px',
      textAlign: 'right',
      fontWeight: 'bold',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    messages: {
      flex: 1,
      overflowY: 'auto',
      padding: '15px',
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      fontSize: styleData.fontSize
    },
    message: {
      maxWidth: '80%',
      padding: '10px 15px',
      borderRadius: '15px',
      marginBottom: '5px'
    },
    botMessage: {
      backgroundColor: styleData.secondaryColor,
      alignSelf: 'flex-end',
      borderBottomRightRadius: '5px'
    },
    userMessage: {
      backgroundColor: styleData.primaryColor,
      color: '#fff',
      alignSelf: 'flex-start',
      borderBottomLeftRadius: '5px'
    },
    input: {
      display: 'flex',
      borderTop: '1px solid #e0e0e0',
      padding: '10px'
    },
    inputField: {
      flex: 1,
      padding: '10px',
      border: '1px solid #e0e0e0',
      borderRadius: '20px',
      outline: 'none',
      direction: 'rtl',
      fontFamily: styleData.fontFamily
    },
    sendButton: {
      backgroundColor: styleData.primaryColor,
      color: '#fff',
      border: 'none',
      borderRadius: '20px',
      padding: '10px 15px',
      marginRight: '10px',
      cursor: 'pointer'
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        תצוגה מקדימה
      </Typography>

      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="body2" color="text.secondary">
          זהו תצוגה מקדימה של הצ'אטבוט. נסה לשאול שאלה כדי לראות איך הוא עובד!
        </Typography>
      </Paper>

      <div style={styles.container}>
        <div 
          style={styles.chatIcon}
          onClick={() => setChatOpen(!chatOpen)}
        >
          <img 
            src={styleData.chatIcon} 
            alt="Chat" 
            style={{ width: '30px', height: '30px' }}
          />
        </div>

        <div style={styles.chatWindow}>
          <div style={styles.header}>
            <div>צ'אט תמיכה</div>
            <button 
              onClick={() => setChatOpen(false)}
              style={{
                background: 'none',
                border: 'none',
                color: '#fff',
                fontSize: '16px',
                cursor: 'pointer'
              }}
            >
              ×
            </button>
          </div>

          <div style={styles.messages}>
            {messages.map((message, index) => (
              <div
                key={index}
                style={{
                  ...styles.message,
                  ...(message.type === 'bot' ? styles.botMessage : styles.userMessage)
                }}
              >
                {message.content}
              </div>
            ))}
          </div>

          <div style={styles.input}>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="הקלד הודעה..."
              style={styles.inputField}
            />
            <button
              onClick={handleSendMessage}
              style={styles.sendButton}
            >
              שלח
            </button>
          </div>
        </div>
      </div>
    </Box>
  );
}

export default Preview; 