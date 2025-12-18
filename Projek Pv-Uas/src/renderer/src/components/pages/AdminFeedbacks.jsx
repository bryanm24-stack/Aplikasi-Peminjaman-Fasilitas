import React, { useContext } from 'react';
import { AuthContext } from '../Auth';
import { List, ListItem, ListItemText, Divider, Typography, Paper } from '@mui/material';

export default function AdminFeedbacks() {
  const { feedbacks } = useContext(AuthContext);

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h4" gutterBottom>Kotak Masuk Saran</Typography>
      <List>
        {feedbacks.map((f, index) => (
          <div key={f.id}>
            <ListItem alignItems="flex-start">
              <ListItemText
                primary={`${f.userName} (${f.date})`}
                secondary={<Typography component="span" variant="body2" color="text.primary">{f.message}</Typography>}
              />
            </ListItem>
            {index < feedbacks.length - 1 && <Divider variant="inset" component="li" />}
          </div>
        ))}
        {feedbacks.length === 0 && <Typography>Belum ada pesan masuk.</Typography>}
      </List>
    </Paper>
  );
}