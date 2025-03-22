import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Snackbar,
  Alert
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

function EmbedCode({ faqData, styleData }) {
  const [showCopied, setShowCopied] = useState(false);

  const generateEmbedCode = () => {
    const faqDataString = JSON.stringify(faqData, null, 2);
    const styleDataString = JSON.stringify(styleData, null, 2);

    return `<!-- FAQ Chatbot Widget -->
<script>
  // הגדרות הצ'אטבוט
  const faqData = ${faqDataString};
  const styleData = ${styleDataString};
</script>
<script src="https://your-domain.com/chatbot.js"></script>`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateEmbedCode());
    setShowCopied(true);
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        קוד הטמעה
      </Typography>

      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          העתק את הקוד הבא והדבק אותו בתוך תגית <code>&lt;body&gt;</code> באתר שלך:
        </Typography>

        <TextField
          fullWidth
          multiline
          rows={10}
          value={generateEmbedCode()}
          InputProps={{
            readOnly: true,
            endAdornment: (
              <Button
                startIcon={<ContentCopyIcon />}
                onClick={handleCopy}
                sx={{ position: 'absolute', top: 8, right: 8 }}
              >
                העתק
              </Button>
            ),
          }}
        />
      </Paper>

      <Paper sx={{ p: 2 }}>
        <Typography variant="subtitle1" gutterBottom>
          הוראות התקנה:
        </Typography>
        <ol>
          <li>העתק את הקוד למעלה</li>
          <li>הדבק אותו בתוך תגית <code>&lt;body&gt;</code> באתר שלך</li>
          <li>הצ'אטבוט יופיע אוטומטית באתר שלך</li>
        </ol>
      </Paper>

      <Snackbar
        open={showCopied}
        autoHideDuration={2000}
        onClose={() => setShowCopied(false)}
      >
        <Alert severity="success" sx={{ width: '100%' }}>
          הקוד הועתק בהצלחה!
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default EmbedCode; 