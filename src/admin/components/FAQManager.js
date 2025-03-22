import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Paper,
  Typography
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

function FAQManager({ faqData, setFaqData }) {
  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswer, setNewAnswer] = useState('');
  const [editingIndex, setEditingIndex] = useState(-1);

  const handleAdd = () => {
    if (newQuestion && newAnswer) {
      if (editingIndex === -1) {
        setFaqData([...faqData, { question: newQuestion, answer: newAnswer }]);
      } else {
        const updatedData = [...faqData];
        updatedData[editingIndex] = { question: newQuestion, answer: newAnswer };
        setFaqData(updatedData);
      }
      setNewQuestion('');
      setNewAnswer('');
      setEditingIndex(-1);
    }
  };

  const handleEdit = (index) => {
    setNewQuestion(faqData[index].question);
    setNewAnswer(faqData[index].answer);
    setEditingIndex(index);
  };

  const handleDelete = (index) => {
    const updatedData = faqData.filter((_, i) => i !== index);
    setFaqData(updatedData);
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        ניהול שאלות ותשובות
      </Typography>

      <Paper sx={{ p: 2, mb: 2 }}>
        <TextField
          fullWidth
          label="שאלה"
          value={newQuestion}
          onChange={(e) => setNewQuestion(e.target.value)}
          margin="normal"
          dir="rtl"
        />
        <TextField
          fullWidth
          label="תשובה"
          value={newAnswer}
          onChange={(e) => setNewAnswer(e.target.value)}
          margin="normal"
          multiline
          rows={3}
          dir="rtl"
        />
        <Button
          variant="contained"
          onClick={handleAdd}
          sx={{ mt: 2 }}
        >
          {editingIndex === -1 ? 'הוסף' : 'עדכן'}
        </Button>
      </Paper>

      <List>
        {faqData.map((item, index) => (
          <ListItem key={index}>
            <ListItemText
              primary={item.question}
              secondary={item.answer}
            />
            <ListItemSecondaryAction>
              <IconButton
                edge="end"
                onClick={() => handleEdit(index)}
                sx={{ mr: 1 }}
              >
                <EditIcon />
              </IconButton>
              <IconButton
                edge="end"
                onClick={() => handleDelete(index)}
              >
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    </Box>
  );
}

export default FAQManager; 