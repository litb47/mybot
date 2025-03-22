import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Alert,
  Tabs,
  Tab,
} from '@mui/material';

export default function EditChatbot() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'faq',
    language: 'he',
    isActive: true,
    welcomeMessage: '',
    primaryColor: '#1976d2',
    secondaryColor: '#ffffff',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    // כאן תהיה לוגיקת טעינת נתוני הצ'אטבוט
    // כרגע נשתמש בנתונים לדוגמה
    const mockData = {
      name: 'צ\'אטבוט תמיכה',
      description: 'צ\'אטבוט לתמיכה במוצרים',
      type: 'support',
      language: 'he',
      isActive: true,
      welcomeMessage: 'שלום! כיצד אוכל לעזור לך היום?',
      primaryColor: '#1976d2',
      secondaryColor: '#ffffff',
    };
    setFormData(mockData);
  }, [id]);

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'isActive' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // כאן תהיה לוגיקת שמירה
      // כרגע נפשט ונחזור לדף הרשימה
      navigate('/chatbots');
    } catch (err) {
      setError('אירעה שגיאה בשמירת הצ\'אטבוט');
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        עריכת צ'אטבוט
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: 3 }}>
        <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 3 }}>
          <Tab label="הגדרות כלליות" />
          <Tab label="תוכן" />
          <Tab label="עיצוב" />
          <Tab label="התנהגות" />
        </Tabs>

        <form onSubmit={handleSubmit}>
          {activeTab === 0 && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="שם הצ'אטבוט"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="תיאור"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  multiline
                  rows={2}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>סוג הצ'אטבוט</InputLabel>
                  <Select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    label="סוג הצ'אטבוט"
                  >
                    <MenuItem value="faq">FAQ</MenuItem>
                    <MenuItem value="support">תמיכה</MenuItem>
                    <MenuItem value="sales">מכירות</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>שפה</InputLabel>
                  <Select
                    name="language"
                    value={formData.language}
                    onChange={handleChange}
                    label="שפה"
                  >
                    <MenuItem value="he">עברית</MenuItem>
                    <MenuItem value="en">אנגלית</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.isActive}
                      onChange={handleChange}
                      name="isActive"
                    />
                  }
                  label="פעיל"
                />
              </Grid>
            </Grid>
          )}

          {activeTab === 1 && (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="הודעת פתיחה"
                  name="welcomeMessage"
                  value={formData.welcomeMessage}
                  onChange={handleChange}
                  multiline
                  rows={3}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary">
                  כאן יוצג עורך התוכן של הצ'אטבוט
                </Typography>
              </Grid>
            </Grid>
          )}

          {activeTab === 2 && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="צבע ראשי"
                  name="primaryColor"
                  type="color"
                  value={formData.primaryColor}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="צבע משני"
                  name="secondaryColor"
                  type="color"
                  value={formData.secondaryColor}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary">
                  כאן יוצגו אפשרויות עיצוב נוספות
                </Typography>
              </Grid>
            </Grid>
          )}

          {activeTab === 3 && (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary">
                  כאן יוצגו הגדרות התנהגות הצ'אטבוט
                </Typography>
              </Grid>
            </Grid>
          )}

          <Grid item xs={12}>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 3 }}>
              <Button
                variant="outlined"
                onClick={() => navigate('/chatbots')}
              >
                ביטול
              </Button>
              <Button
                type="submit"
                variant="contained"
              >
                שמור
              </Button>
            </Box>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
} 