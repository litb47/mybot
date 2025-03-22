import React from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  LinearProgress,
} from '@mui/material';
import {
  Chat as ChatIcon,
  People as PeopleIcon,
  QuestionAnswer as QuestionAnswerIcon,
  Speed as SpeedIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
} from '@mui/icons-material';

export default function Dashboard() {
  // נתונים לדוגמה
  const stats = {
    totalChatbots: 5,
    activeUsers: 120,
    totalConversations: 450,
    averageResponseTime: '2.5s',
    growth: {
      users: 15,
      conversations: 8,
    },
  };

  const StatCard = ({ title, value, icon: Icon, color, growth }) => (
    <Card
      sx={{
        height: '100%',
        background: 'linear-gradient(135deg, #FFFFFF 0%, #F8F9FF 100%)',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
        },
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: '12px',
              background: `${color}15`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mr: 2,
            }}
          >
            <Icon sx={{ fontSize: 24, color }} />
          </Box>
          <Typography
            variant="h6"
            component="div"
            sx={{ color: '#2D3748', fontWeight: 600 }}
          >
            {title}
          </Typography>
        </Box>
        <Typography
          variant="h4"
          component="div"
          sx={{ mb: 1, color: '#2D3748', fontWeight: 700 }}
        >
          {value}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {growth > 0 ? (
            <TrendingUpIcon sx={{ color: '#2F855A', fontSize: 20 }} />
          ) : (
            <TrendingDownIcon sx={{ color: '#C53030', fontSize: 20 }} />
          )}
          <Typography
            variant="body2"
            sx={{
              color: growth > 0 ? '#2F855A' : '#C53030',
              fontWeight: 500,
            }}
          >
            {Math.abs(growth)}% מהשבוע שעבר
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        sx={{ color: '#2D3748', fontWeight: 700, mb: 4 }}
      >
        לוח בקרה
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="צ'אטבוטים פעילים"
            value={stats.totalChatbots}
            icon={ChatIcon}
            color="#6B73FF"
            growth={stats.growth.users}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="משתמשים פעילים"
            value={stats.activeUsers}
            icon={PeopleIcon}
            color="#FF6B6B"
            growth={stats.growth.users}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="שיחות כוללות"
            value={stats.totalConversations}
            icon={QuestionAnswerIcon}
            color="#48BB78"
            growth={stats.growth.conversations}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="זמן תגובה ממוצע"
            value={stats.averageResponseTime}
            icon={SpeedIcon}
            color="#805AD5"
            growth={-5}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={6}>
          <Paper
            sx={{
              p: 3,
              height: '100%',
              background: 'linear-gradient(135deg, #FFFFFF 0%, #F8F9FF 100%)',
            }}
          >
            <Typography
              variant="h6"
              gutterBottom
              sx={{ color: '#2D3748', fontWeight: 600 }}
            >
              פעילות אחרונה
            </Typography>
            <Box sx={{ mt: 3 }}>
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    שיחות היום
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    75%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={75}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: '#E2E8F0',
                    '& .MuiLinearProgress-bar': {
                      background: 'linear-gradient(135deg, #6B73FF 0%, #4B54FF 100%)',
                    },
                  }}
                />
              </Box>
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    משתמשים פעילים
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    60%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={60}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: '#E2E8F0',
                    '& .MuiLinearProgress-bar': {
                      background: 'linear-gradient(135deg, #FF6B6B 0%, #FF4B4B 100%)',
                    },
                  }}
                />
              </Box>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper
            sx={{
              p: 3,
              height: '100%',
              background: 'linear-gradient(135deg, #FFFFFF 0%, #F8F9FF 100%)',
            }}
          >
            <Typography
              variant="h6"
              gutterBottom
              sx={{ color: '#2D3748', fontWeight: 600 }}
            >
              נושאים נפוצים
            </Typography>
            <Box sx={{ mt: 3 }}>
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    שאלות על מוצרים
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    45%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={45}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: '#E2E8F0',
                    '& .MuiLinearProgress-bar': {
                      background: 'linear-gradient(135deg, #48BB78 0%, #38A169 100%)',
                    },
                  }}
                />
              </Box>
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    תמיכה טכנית
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    30%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={30}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: '#E2E8F0',
                    '& .MuiLinearProgress-bar': {
                      background: 'linear-gradient(135deg, #805AD5 0%, #6B46C1 100%)',
                    },
                  }}
                />
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
} 