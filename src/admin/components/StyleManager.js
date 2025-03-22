import React from 'react';
import {
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
  Paper,
  Button
} from '@mui/material';
import { SketchPicker } from 'react-color';

function StyleManager({ styleData, setStyleData }) {
  const handleChange = (field) => (event) => {
    setStyleData({
      ...styleData,
      [field]: event.target.value
    });
  };

  const handleColorChange = (field) => (color) => {
    setStyleData({
      ...styleData,
      [field]: color.hex
    });
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        הגדרות עיצוב
      </Typography>

      <Paper sx={{ p: 2 }}>
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>מיקום הצ'אטבוט</InputLabel>
          <Select
            value={styleData.position}
            onChange={handleChange('position')}
            label="מיקום הצ'אטבוט"
          >
            <MenuItem value="bottom-right">פינה ימנית תחתונה</MenuItem>
            <MenuItem value="bottom-left">פינה שמאלית תחתונה</MenuItem>
            <MenuItem value="top-right">פינה ימנית עליונה</MenuItem>
            <MenuItem value="top-left">פינה שמאלית עליונה</MenuItem>
          </Select>
        </FormControl>

        <Box sx={{ mb: 2 }}>
          <Typography gutterBottom>צבע ראשי</Typography>
          <SketchPicker
            color={styleData.primaryColor}
            onChange={handleColorChange('primaryColor')}
            disableAlpha
          />
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography gutterBottom>צבע משני</Typography>
          <SketchPicker
            color={styleData.secondaryColor}
            onChange={handleColorChange('secondaryColor')}
            disableAlpha
          />
        </Box>

        <TextField
          fullWidth
          label="גודל טקסט"
          value={styleData.fontSize}
          onChange={handleChange('fontSize')}
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          label="גופן"
          value={styleData.fontFamily}
          onChange={handleChange('fontFamily')}
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          label="כתובת אייקון הצ'אט"
          value={styleData.chatIcon}
          onChange={handleChange('chatIcon')}
          sx={{ mb: 2 }}
        />
      </Paper>
    </Box>
  );
}

export default StyleManager; 