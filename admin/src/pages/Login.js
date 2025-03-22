import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  InputAdornment,
  IconButton,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email as EmailIcon,
  Lock as LockIcon,
} from '@mui/icons-material';

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // כאן תהיה לוגיקת התחברות
      // כרגע נפשט ונעשה התחברות ישירה
      if (formData.email === 'admin@example.com' && formData.password === 'admin123') {
        localStorage.setItem('isLoggedIn', 'true');
        navigate('/');
      } else {
        setError('שם משתמש או סיסמה שגויים');
      }
    } catch (err) {
      setError('אירעה שגיאה בהתחברות');
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #6B73FF 0%, #4B54FF 100%)',
      }}
    >
      <Container component="main" maxWidth="xs">
        <Paper
          elevation={0}
          sx={{
            padding: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            borderRadius: 4,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          }}
        >
          <Box
            sx={{
              width: 60,
              height: 60,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #6B73FF 0%, #4B54FF 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 3,
            }}
          >
            <svg
              viewBox="0 0 24 24"
              width="30"
              height="30"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
            </svg>
          </Box>

          <Typography
            component="h1"
            variant="h5"
            sx={{
              fontWeight: 600,
              mb: 3,
              color: '#2D3748',
            }}
          >
            ברוכים הבאים למערכת
          </Typography>

          {error && (
            <Alert
              severity="error"
              sx={{
                mt: 2,
                width: '100%',
                borderRadius: 2,
                '& .MuiAlert-icon': {
                  color: '#FF6B6B',
                },
              }}
            >
              {error}
            </Alert>
          )}

          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              mt: 1,
              width: '100%',
              '& .MuiTextField-root': {
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '&:hover fieldset': {
                    borderColor: '#6B73FF',
                  },
                },
                '& .Mui-focused fieldset': {
                  borderColor: '#6B73FF',
                },
              },
            }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="אימייל"
              name="email"
              autoComplete="email"
              autoFocus
              value={formData.email}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon sx={{ color: '#718096' }} />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="סיסמה"
              type={showPassword ? 'text' : 'password'}
              id="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon sx={{ color: '#718096' }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: 3,
                mb: 2,
                py: 1.5,
                borderRadius: 2,
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: 500,
                background: 'linear-gradient(135deg, #6B73FF 0%, #4B54FF 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #8B92FF 0%, #6B73FF 100%)',
                },
              }}
            >
              התחבר
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
} 