import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton,
  Typography,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TablePagination,
  Tooltip,
  Avatar,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Chat as ChatIcon,
  MoreVert as MoreVertIcon,
} from '@mui/icons-material';

export default function Chatbots() {
  const navigate = useNavigate();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedChatbot, setSelectedChatbot] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // נתונים לדוגמה
  const chatbots = [
    {
      id: 1,
      name: 'צ\'אטבוט תמיכה',
      status: 'active',
      conversations: 150,
      lastActive: '2024-03-20',
      avatar: 'https://i.pravatar.cc/150?img=1',
    },
    {
      id: 2,
      name: 'צ\'אטבוט מכירות',
      status: 'inactive',
      conversations: 75,
      lastActive: '2024-03-19',
      avatar: 'https://i.pravatar.cc/150?img=2',
    },
    {
      id: 3,
      name: 'צ\'אטבוט FAQ',
      status: 'active',
      conversations: 225,
      lastActive: '2024-03-20',
      avatar: 'https://i.pravatar.cc/150?img=3',
    },
  ];

  const handleEdit = (id) => {
    navigate(`/chatbots/${id}/edit`);
  };

  const handleDelete = (chatbot) => {
    setSelectedChatbot(chatbot);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    // כאן תהיה לוגיקת מחיקה
    setDeleteDialogOpen(false);
  };

  const getStatusColor = (status) => {
    return status === 'active' ? 'success' : 'error';
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 4,
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          sx={{ color: '#2D3748', fontWeight: 700 }}
        >
          צ'אטבוטים
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/chatbots/create')}
          sx={{
            background: 'linear-gradient(135deg, #6B73FF 0%, #4B54FF 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #8B92FF 0%, #6B73FF 100%)',
            },
          }}
        >
          צ'אטבוט חדש
        </Button>
      </Box>

      <Paper
        sx={{
          borderRadius: 2,
          overflow: 'hidden',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
        }}
      >
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#F8F9FF' }}>
                <TableCell sx={{ fontWeight: 600, color: '#2D3748' }}>
                  צ'אטבוט
                </TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#2D3748' }}>
                  סטטוס
                </TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#2D3748' }}>
                  שיחות
                </TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#2D3748' }}>
                  פעילות אחרונה
                </TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#2D3748' }}>
                  פעולות
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {chatbots
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((chatbot) => (
                  <TableRow
                    key={chatbot.id}
                    sx={{
                      '&:hover': {
                        backgroundColor: '#F8F9FF',
                      },
                    }}
                  >
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar
                          src={chatbot.avatar}
                          sx={{
                            width: 40,
                            height: 40,
                            background: 'linear-gradient(135deg, #6B73FF 0%, #4B54FF 100%)',
                          }}
                        >
                          <ChatIcon />
                        </Avatar>
                        <Box>
                          <Typography
                            variant="body1"
                            sx={{ fontWeight: 500, color: '#2D3748' }}
                          >
                            {chatbot.name}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ color: '#718096' }}
                          >
                            ID: {chatbot.id}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={chatbot.status === 'active' ? 'פעיל' : 'לא פעיל'}
                        color={getStatusColor(chatbot.status)}
                        size="small"
                        sx={{
                          borderRadius: '6px',
                          fontWeight: 500,
                          '& .MuiChip-label': {
                            px: 1,
                          },
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ color: '#2D3748' }}>
                        {chatbot.conversations}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ color: '#718096' }}>
                        {chatbot.lastActive}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Tooltip title="ערוך">
                          <IconButton
                            color="primary"
                            onClick={() => handleEdit(chatbot.id)}
                            sx={{
                              color: '#6B73FF',
                              '&:hover': {
                                backgroundColor: '#6B73FF15',
                              },
                            }}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="מחק">
                          <IconButton
                            color="error"
                            onClick={() => handleDelete(chatbot)}
                            sx={{
                              color: '#FF6B6B',
                              '&:hover': {
                                backgroundColor: '#FF6B6B15',
                              },
                            }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="אפשרויות נוספות">
                          <IconButton
                            sx={{
                              color: '#718096',
                              '&:hover': {
                                backgroundColor: '#71809615',
                              },
                            }}
                          >
                            <MoreVertIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={chatbots.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{
            '.MuiTablePagination-select': {
              borderRadius: 1,
              border: '1px solid #E2E8F0',
              px: 2,
              py: 1,
            },
            '.MuiTablePagination-selectLabel': {
              color: '#718096',
            },
            '.MuiTablePagination-displayedRows': {
              color: '#2D3748',
              fontWeight: 500,
            },
          }}
        />
      </Paper>

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: 2,
            minWidth: 400,
          },
        }}
      >
        <DialogTitle sx={{ color: '#2D3748', fontWeight: 600 }}>
          מחיקת צ'אטבוט
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ color: '#718096' }}>
            האם אתה בטוח שברצונך למחוק את הצ'אטבוט "{selectedChatbot?.name}"?
            פעולה זו אינה הפיכה.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 1 }}>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            sx={{
              color: '#718096',
              '&:hover': {
                backgroundColor: '#71809615',
              },
            }}
          >
            ביטול
          </Button>
          <Button
            onClick={confirmDelete}
            variant="contained"
            color="error"
            sx={{
              background: 'linear-gradient(135deg, #FF6B6B 0%, #FF4B4B 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #FF8B8B 0%, #FF6B6B 100%)',
              },
            }}
          >
            מחק
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
} 