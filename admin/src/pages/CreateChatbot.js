import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Card,
  CardContent,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Help as HelpIcon,
  ColorLens as ColorLensIcon,
} from '@mui/icons-material';

export default function CreateChatbot() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'faq',
    language: 'he',
    isActive: true,
    welcomeMessage: '',
    primaryColor: '#6B73FF',
    secondaryColor: '#FFFFFF',
  });
  const [error, setError] = useState('');

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

  return (
    <Box sx={{ p: 3 }}>
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        sx={{ color: '#2D3748', fontWeight: 700, mb: 4 }}
      >
        יצירת צ'אטבוט חדש
      </Typography>

      {error && (
        <Alert
          severity="error"
          sx={{
            mb: 3,
            borderRadius: 2,
            '& .MuiAlert-icon': {
              color: '#FF6B6B',
            },
          }}
        >
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper
            sx={{
              p: 3,
              borderRadius: 2,
              background: 'linear-gradient(135deg, #FFFFFF 0%, #F8F9FF 100%)',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
            }}
          >
            <Typography
              variant="h6"
              gutterBottom
              sx={{ color: '#2D3748', fontWeight: 600, mb: 3 }}
            >
              הגדרות כלליות
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="שם הצ'אטבוט"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '&:hover fieldset': {
                        borderColor: '#6B73FF',
                      },
                    },
                    '& .Mui-focused fieldset': {
                      borderColor: '#6B73FF',
                    },
                  }}
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
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '&:hover fieldset': {
                        borderColor: '#6B73FF',
                      },
                    },
                    '& .Mui-focused fieldset': {
                      borderColor: '#6B73FF',
                    },
                  }}
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
                    sx={{
                      borderRadius: 2,
                      '&:hover fieldset': {
                        borderColor: '#6B73FF',
                      },
                    }}
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
                    sx={{
                      borderRadius: 2,
                      '&:hover fieldset': {
                        borderColor: '#6B73FF',
                      },
                    }}
                  >
                    <MenuItem value="he">עברית</MenuItem>
                    <MenuItem value="en">אנגלית</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="הודעת פתיחה"
                  name="welcomeMessage"
                  value={formData.welcomeMessage}
                  onChange={handleChange}
                  multiline
                  rows={3}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '&:hover fieldset': {
                        borderColor: '#6B73FF',
                      },
                    },
                    '& .Mui-focused fieldset': {
                      borderColor: '#6B73FF',
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.isActive}
                      onChange={handleChange}
                      name="isActive"
                      sx={{
                        '& .MuiSwitch-switchBase.Mui-checked': {
                          color: '#6B73FF',
                          '&:hover': {
                            backgroundColor: '#6B73FF15',
                          },
                        },
                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                          backgroundColor: '#6B73FF',
                        },
                      }}
                    />
                  }
                  label="פעיל"
                  sx={{
                    '& .MuiFormControlLabel-label': {
                      color: '#2D3748',
                      fontWeight: 500,
                    },
                  }}
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 3,
              borderRadius: 2,
              background: 'linear-gradient(135deg, #FFFFFF 0%, #F8F9FF 100%)',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
            }}
          >
            <Typography
              variant="h6"
              gutterBottom
              sx={{ color: '#2D3748', fontWeight: 600, mb: 3 }}
            >
              עיצוב
            </Typography>

            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <ColorLensIcon sx={{ color: '#718096', mr: 1 }} />
                <Typography variant="subtitle2" sx={{ color: '#2D3748' }}>
                  צבע ראשי
                </Typography>
              </Box>
              <TextField
                fullWidth
                name="primaryColor"
                type="color"
                value={formData.primaryColor}
                onChange={handleChange}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    height: 40,
                    borderRadius: 2,
                    '&:hover fieldset': {
                      borderColor: '#6B73FF',
                    },
                  },
                }}
              />
            </Box>

            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <ColorLensIcon sx={{ color: '#718096', mr: 1 }} />
                <Typography variant="subtitle2" sx={{ color: '#2D3748' }}>
                  צבע משני
                </Typography>
              </Box>
              <TextField
                fullWidth
                name="secondaryColor"
                type="color"
                value={formData.secondaryColor}
                onChange={handleChange}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    height: 40,
                    borderRadius: 2,
                    '&:hover fieldset': {
                      borderColor: '#6B73FF',
                    },
                  },
                }}
              />
            </Box>

            <Card
              sx={{
                background: 'linear-gradient(135deg, #6B73FF 0%, #4B54FF 100%)',
                borderRadius: 2,
                mb: 3,
              }}
            >
              <CardContent>
                <Typography
                  variant="h6"
                  sx={{ color: '#FFFFFF', fontWeight: 600, mb: 2 }}
                >
                  תצוגה מקדימה
                </Typography>
                <Box
                  sx={{
                    width: '100%',
                    height: 200,
                    background: '#FFFFFF',
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: formData.primaryColor,
                    fontSize: '1.2rem',
                    fontWeight: 500,
                  }}
                >
                  {formData.name || 'שם הצ\'אטבוט'}
                </Box>
              </CardContent>
            </Card>
          </Paper>
        </Grid>
      </Grid>

      <Box
        sx={{
          display: 'flex',
          gap: 2,
          justifyContent: 'flex-end',
          mt: 4,
        }}
      >
        <Button
          variant="outlined"
          onClick={() => navigate('/chatbots')}
          sx={{
            color: '#718096',
            borderColor: '#E2E8F0',
            '&:hover': {
              borderColor: '#718096',
              backgroundColor: '#71809615',
            },
          }}
        >
          ביטול
        </Button>
        <Button
          type="submit"
          variant="contained"
          onClick={handleSubmit}
          sx={{
            background: 'linear-gradient(135deg, #6B73FF 0%, #4B54FF 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #8B92FF 0%, #6B73FF 100%)',
            },
          }}
        >
          שמור
        </Button>
      </Box>
    </Box>
  );
} 