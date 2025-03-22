import React, { useState } from 'react';
import { Tabs, Tab, Box } from '@mui/material';
import FAQManager from './FAQManager';
import StyleManager from './StyleManager';
import Preview from './Preview';
import EmbedCode from './EmbedCode';

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function AdminDashboard() {
  const [tabValue, setTabValue] = useState(0);
  const [faqData, setFaqData] = useState([]);
  const [styleData, setStyleData] = useState({
    primaryColor: '#007bff',
    secondaryColor: '#f0f0f0',
    position: 'bottom-right',
    fontSize: '14px',
    fontFamily: 'Arial, sans-serif',
    chatIcon: '/default-icon.png'
  });

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="שאלות ותשובות" />
          <Tab label="עיצוב" />
          <Tab label="תצוגה מקדימה" />
          <Tab label="קוד הטמעה" />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        <FAQManager 
          faqData={faqData} 
          setFaqData={setFaqData} 
        />
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <StyleManager 
          styleData={styleData} 
          setStyleData={setStyleData} 
        />
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        <Preview 
          faqData={faqData} 
          styleData={styleData} 
        />
      </TabPanel>

      <TabPanel value={tabValue} index={3}>
        <EmbedCode 
          faqData={faqData} 
          styleData={styleData} 
        />
      </TabPanel>
    </Box>
  );
}

export default AdminDashboard; 