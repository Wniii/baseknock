import * as React from 'react';
import { useCallback } from "react";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Checkbox,
  Divider,
  FormControlLabel,
  Stack,
  Typography,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  NativeSelect,
  InputBase,
  Unstable_Grid2 as Grid,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  TextField,
  Accordion, 
  AccordionDetails, 
  AccordionSummary,
} from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export const PitcherRecord = () => {
  const handleSubmit = useCallback((event) => {
    event.preventDefault();
  }, []);

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader title="投手紀錄" />
        <Divider />
        <CardContent>
          <Grid container spacing={12} wrap="wrap">
            <Grid xs={12} sm={6} md={12}>
              <Stack spacing={1}>
                <Stack>
                  <div>
                  <List sx={{ width: '100%', maxWidth: 960, bgcolor: 'background.paper' }}>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <ListItem alignItems="flex-start">
            <ListItemAvatar>
              <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
            </ListItemAvatar>
            <ListItemText
              primary="69 茲提  0.0 IP 0 SO 0 BB 0 R"
            />
          </ListItem>
        </AccordionSummary>
        <AccordionDetails>
        <div>
                    <ListItemText
                        primary="好球"
                        />
                    <TextField
                      label="1"
                      id="standard-size-normal"
                      defaultValue="0"
                      size="normal"
                      variant="standard"
                      sx={{ width: "50px" }}
                    />
                    <TextField
                      label="2"
                      id="standard-size-normal"
                      defaultValue="0"
                      size="normal"
                      variant="standard"
                      sx={{ width: "50px" }}
                    />
                    <TextField
                      label="3"
                      id="standard-size-normal"
                      defaultValue="0"
                      size="normal"
                      variant="standard"
                      sx={{ width: "50px" }}
                    />
                    <TextField
                      label="4"
                      id="standard-size-normal"
                      defaultValue="0"
                      size="normal"
                      variant="standard"
                      sx={{ width: "50px" }}
                    />
                    <TextField
                      label="5"
                      id="standard-size-normal"
                      defaultValue="0"
                      size="normal"
                      variant="standard"
                      sx={{ width: "50px" }}
                    />
                    <TextField
                      label="6"
                      id="standard-size-normal"
                      defaultValue="0"
                      size="normal"
                      variant="standard"
                      sx={{ width: "50px" }}
                    />
                    <TextField
                      label="7"
                      id="standard-size-normal"
                      defaultValue="0"
                      size="normal"
                      variant="standard"
                      sx={{ width: "50px" }}
                    />
                    <TextField
                      label="8"
                      id="standard-size-normal"
                      defaultValue="0"
                      size="normal"
                      variant="standard"
                      sx={{ width: "50px" }}
                    />
                    <TextField
                      label="9"
                      id="standard-size-normal"
                      defaultValue="0"
                      size="normal"
                      variant="standard"
                      sx={{ width: "50px" }}
                    />
                  </div>
                  <div>
                    <ListItemText
                        primary="壞球"
                        />
                    <TextField
                      label="1"
                      id="standard-size-normal"
                      defaultValue="0"
                      size="normal"
                      variant="standard"
                      sx={{ width: "50px" }}
                    />
                    <TextField
                      label="2"
                      id="standard-size-normal"
                      defaultValue="0"
                      size="normal"
                      variant="standard"
                      sx={{ width: "50px" }}
                    />
                    <TextField
                      label="3"
                      id="standard-size-normal"
                      defaultValue="0"
                      size="normal"
                      variant="standard"
                      sx={{ width: "50px" }}
                    />
                    <TextField
                      label="4"
                      id="standard-size-normal"
                      defaultValue="0"
                      size="normal"
                      variant="standard"
                      sx={{ width: "50px" }}
                    />
                    <TextField
                      label="5"
                      id="standard-size-normal"
                      defaultValue="0"
                      size="normal"
                      variant="standard"
                      sx={{ width: "50px" }}
                    />
                    <TextField
                      label="6"
                      id="standard-size-normal"
                      defaultValue="0"
                      size="normal"
                      variant="standard"
                      sx={{ width: "50px" }}
                    />
                    <TextField
                      label="7"
                      id="standard-size-normal"
                      defaultValue="0"
                      size="normal"
                      variant="standard"
                      sx={{ width: "50px" }}
                    />
                    <TextField
                      label="8"
                      id="standard-size-normal"
                      defaultValue="0"
                      size="normal"
                      variant="standard"
                      sx={{ width: "50px" }}
                    />
                    <TextField
                      label="9"
                      id="standard-size-normal"
                      defaultValue="0"
                      size="normal"
                      variant="standard"
                      sx={{ width: "50px" }}
                    />
                  </div>
                  <div>
                    <ListItemText
                        primary="奪三振"
                        />
                    <TextField
                      label="1"
                      id="standard-size-normal"
                      defaultValue="0"
                      size="normal"
                      variant="standard"
                      sx={{ width: "50px" }}
                    />
                    <TextField
                      label="2"
                      id="standard-size-normal"
                      defaultValue="0"
                      size="normal"
                      variant="standard"
                      sx={{ width: "50px" }}
                    />
                    <TextField
                      label="3"
                      id="standard-size-normal"
                      defaultValue="0"
                      size="normal"
                      variant="standard"
                      sx={{ width: "50px" }}
                    />
                    <TextField
                      label="4"
                      id="standard-size-normal"
                      defaultValue="0"
                      size="normal"
                      variant="standard"
                      sx={{ width: "50px" }}
                    />
                    <TextField
                      label="5"
                      id="standard-size-normal"
                      defaultValue="0"
                      size="normal"
                      variant="standard"
                      sx={{ width: "50px" }}
                    />
                    <TextField
                      label="6"
                      id="standard-size-normal"
                      defaultValue="0"
                      size="normal"
                      variant="standard"
                      sx={{ width: "50px" }}
                    />
                    <TextField
                      label="7"
                      id="standard-size-normal"
                      defaultValue="0"
                      size="normal"
                      variant="standard"
                      sx={{ width: "50px" }}
                    />
                    <TextField
                      label="8"
                      id="standard-size-normal"
                      defaultValue="0"
                      size="normal"
                      variant="standard"
                      sx={{ width: "50px" }}
                    />
                    <TextField
                      label="9"
                      id="standard-size-normal"
                      defaultValue="0"
                      size="normal"
                      variant="standard"
                      sx={{ width: "50px" }}
                    />
                  </div>
                  <div>
                    <ListItemText
                        primary="被安打"
                        />
                    <TextField
                      label="1"
                      id="standard-size-normal"
                      defaultValue="0"
                      size="normal"
                      variant="standard"
                      sx={{ width: "50px" }}
                    />
                    <TextField
                      label="2"
                      id="standard-size-normal"
                      defaultValue="0"
                      size="normal"
                      variant="standard"
                      sx={{ width: "50px" }}
                    />
                    <TextField
                      label="3"
                      id="standard-size-normal"
                      defaultValue="0"
                      size="normal"
                      variant="standard"
                      sx={{ width: "50px" }}
                    />
                    <TextField
                      label="4"
                      id="standard-size-normal"
                      defaultValue="0"
                      size="normal"
                      variant="standard"
                      sx={{ width: "50px" }}
                    />
                    <TextField
                      label="5"
                      id="standard-size-normal"
                      defaultValue="0"
                      size="normal"
                      variant="standard"
                      sx={{ width: "50px" }}
                    />
                    <TextField
                      label="6"
                      id="standard-size-normal"
                      defaultValue="0"
                      size="normal"
                      variant="standard"
                      sx={{ width: "50px" }}
                    />
                    <TextField
                      label="7"
                      id="standard-size-normal"
                      defaultValue="0"
                      size="normal"
                      variant="standard"
                      sx={{ width: "50px" }}
                    />
                    <TextField
                      label="8"
                      id="standard-size-normal"
                      defaultValue="0"
                      size="normal"
                      variant="standard"
                      sx={{ width: "50px" }}
                    />
                    <TextField
                      label="9"
                      id="standard-size-normal"
                      defaultValue="0"
                      size="normal"
                      variant="standard"
                      sx={{ width: "50px" }}
                    />
                  </div>
                  <div>
                    <ListItemText
                        primary="四壞"
                        />
                    <TextField
                      label="1"
                      id="standard-size-normal"
                      defaultValue="0"
                      size="normal"
                      variant="standard"
                      sx={{ width: "50px" }}
                    />
                    <TextField
                      label="2"
                      id="standard-size-normal"
                      defaultValue="0"
                      size="normal"
                      variant="standard"
                      sx={{ width: "50px" }}
                    />
                    <TextField
                      label="3"
                      id="standard-size-normal"
                      defaultValue="0"
                      size="normal"
                      variant="standard"
                      sx={{ width: "50px" }}
                    />
                    <TextField
                      label="4"
                      id="standard-size-normal"
                      defaultValue="0"
                      size="normal"
                      variant="standard"
                      sx={{ width: "50px" }}
                    />
                    <TextField
                      label="5"
                      id="standard-size-normal"
                      defaultValue="0"
                      size="normal"
                      variant="standard"
                      sx={{ width: "50px" }}
                    />
                    <TextField
                      label="6"
                      id="standard-size-normal"
                      defaultValue="0"
                      size="normal"
                      variant="standard"
                      sx={{ width: "50px" }}
                    />
                    <TextField
                      label="7"
                      id="standard-size-normal"
                      defaultValue="0"
                      size="normal"
                      variant="standard"
                      sx={{ width: "50px" }}
                    />
                    <TextField
                      label="8"
                      id="standard-size-normal"
                      defaultValue="0"
                      size="normal"
                      variant="standard"
                      sx={{ width: "50px" }}
                    />
                    <TextField
                      label="9"
                      id="standard-size-normal"
                      defaultValue="0"
                      size="normal"
                      variant="standard"
                      sx={{ width: "50px" }}
                    />
                  </div>
                  <div>
                    <ListItemText
                        primary="出局"
                        />
                    <TextField
                      label="1"
                      id="standard-size-normal"
                      defaultValue="0"
                      size="normal"
                      variant="standard"
                      sx={{ width: "50px" }}
                    />
                    <TextField
                      label="2"
                      id="standard-size-normal"
                      defaultValue="0"
                      size="normal"
                      variant="standard"
                      sx={{ width: "50px" }}
                    />
                    <TextField
                      label="3"
                      id="standard-size-normal"
                      defaultValue="0"
                      size="normal"
                      variant="standard"
                      sx={{ width: "50px" }}
                    />
                    <TextField
                      label="4"
                      id="standard-size-normal"
                      defaultValue="0"
                      size="normal"
                      variant="standard"
                      sx={{ width: "50px" }}
                    />
                    <TextField
                      label="5"
                      id="standard-size-normal"
                      defaultValue="0"
                      size="normal"
                      variant="standard"
                      sx={{ width: "50px" }}
                    />
                    <TextField
                      label="6"
                      id="standard-size-normal"
                      defaultValue="0"
                      size="normal"
                      variant="standard"
                      sx={{ width: "50px" }}
                    />
                    <TextField
                      label="7"
                      id="standard-size-normal"
                      defaultValue="0"
                      size="normal"
                      variant="standard"
                      sx={{ width: "50px" }}
                    />
                    <TextField
                      label="8"
                      id="standard-size-normal"
                      defaultValue="0"
                      size="normal"
                      variant="standard"
                      sx={{ width: "50px" }}
                    />
                    <TextField
                      label="9"
                      id="standard-size-normal"
                      defaultValue="0"
                      size="normal"
                      variant="standard"
                      sx={{ width: "50px" }}
                    />
                  </div>
                  <div>
                    <ListItemText
                        primary="失分"
                        />
                    <TextField
                      label="1"
                      id="standard-size-normal"
                      defaultValue="0"
                      size="normal"
                      variant="standard"
                      sx={{ width: "50px" }}
                    />
                    <TextField
                      label="2"
                      id="standard-size-normal"
                      defaultValue="0"
                      size="normal"
                      variant="standard"
                      sx={{ width: "50px" }}
                    />
                    <TextField
                      label="3"
                      id="standard-size-normal"
                      defaultValue="0"
                      size="normal"
                      variant="standard"
                      sx={{ width: "50px" }}
                    />
                    <TextField
                      label="4"
                      id="standard-size-normal"
                      defaultValue="0"
                      size="normal"
                      variant="standard"
                      sx={{ width: "50px" }}
                    />
                    <TextField
                      label="5"
                      id="standard-size-normal"
                      defaultValue="0"
                      size="normal"
                      variant="standard"
                      sx={{ width: "50px" }}
                    />
                    <TextField
                      label="6"
                      id="standard-size-normal"
                      defaultValue="0"
                      size="normal"
                      variant="standard"
                      sx={{ width: "50px" }}
                    />
                    <TextField
                      label="7"
                      id="standard-size-normal"
                      defaultValue="0"
                      size="normal"
                      variant="standard"
                      sx={{ width: "50px" }}
                    />
                    <TextField
                      label="8"
                      id="standard-size-normal"
                      defaultValue="0"
                      size="normal"
                      variant="standard"
                      sx={{ width: "50px" }}
                    />
                    <TextField
                      label="9"
                      id="standard-size-normal"
                      defaultValue="0"
                      size="normal"
                      variant="standard"
                      sx={{ width: "50px" }}
                    />
                  </div>
          <Typography>
            {/* Add your detailed content here */}
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Divider variant="inset" component="li" />
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2a-content"
          id="panel2a-header"
        >
          <ListItem alignItems="flex-start">
            <ListItemAvatar>
              <Avatar alt="Travis Howard" src="/static/images/avatar/2.jpg" />
            </ListItemAvatar>
            <ListItemText
              primary="10 加西  0.0 IP 0 SO 0 BB 0 R"
            />
          </ListItem>
        </AccordionSummary>
        <AccordionDetails>
        <div>
                    <ListItemText
                        primary="好球"
                        />
                    <TextField
                      label="1"
                      id="standard-size-normal"
                      defaultValue="0"
                      size="normal"
                      variant="standard"
                      sx={{ width: "50px" }}
                    />
                    <TextField
                      label="2"
                      id="standard-size-normal"
                      defaultValue="0"
                      size="normal"
                      variant="standard"
                      sx={{ width: "50px" }}
                    />
                    <TextField
                      label="3"
                      id="standard-size-normal"
                      defaultValue="0"
                      size="normal"
                      variant="standard"
                      sx={{ width: "50px" }}
                    />
                    <TextField
                      label="4"
                      id="standard-size-normal"
                      defaultValue="0"
                      size="normal"
                      variant="standard"
                      sx={{ width: "50px" }}
                    />
                    <TextField
                      label="5"
                      id="standard-size-normal"
                      defaultValue="0"
                      size="normal"
                      variant="standard"
                      sx={{ width: "50px" }}
                    />
                    <TextField
                      label="6"
                      id="standard-size-normal"
                      defaultValue="0"
                      size="normal"
                      variant="standard"
                      sx={{ width: "50px" }}
                    />
                    <TextField
                      label="7"
                      id="standard-size-normal"
                      defaultValue="0"
                      size="normal"
                      variant="standard"
                      sx={{ width: "50px" }}
                    />
                    <TextField
                      label="8"
                      id="standard-size-normal"
                      defaultValue="0"
                      size="normal"
                      variant="standard"
                      sx={{ width: "50px" }}
                    />
                    <TextField
                      label="9"
                      id="standard-size-normal"
                      defaultValue="0"
                      size="normal"
                      variant="standard"
                      sx={{ width: "50px" }}
                    />
                  </div>
                  <div>
                    <ListItemText
                        primary="壞球"
                        />
                    <TextField
                      label="1"
                      id="standard-size-normal"
                      defaultValue="0"
                      size="normal"
                      variant="standard"
                      sx={{ width: "50px" }}
                    />
                    <TextField
                      label="2"
                      id="standard-size-normal"
                      defaultValue="0"
                      size="normal"
                      variant="standard"
                      sx={{ width: "50px" }}
                    />
                    <TextField
                      label="3"
                      id="standard-size-normal"
                      defaultValue="0"
                      size="normal"
                      variant="standard"
                      sx={{ width: "50px" }}
                    />
                    <TextField
                      label="4"
                      id="standard-size-normal"
                      defaultValue="0"
                      size="normal"
                      variant="standard"
                      sx={{ width: "50px" }}
                    />
                    <TextField
                      label="5"
                      id="standard-size-normal"
                      defaultValue="0"
                      size="normal"
                      variant="standard"
                      sx={{ width: "50px" }}
                    />
                    <TextField
                      label="6"
                      id="standard-size-normal"
                      defaultValue="0"
                      size="normal"
                      variant="standard"
                      sx={{ width: "50px" }}
                    />
                    <TextField
                      label="7"
                      id="standard-size-normal"
                      defaultValue="0"
                      size="normal"
                      variant="standard"
                      sx={{ width: "50px" }}
                    />
                    <TextField
                      label="8"
                      id="standard-size-normal"
                      defaultValue="0"
                      size="normal"
                      variant="standard"
                      sx={{ width: "50px" }}
                    />
                    <TextField
                      label="9"
                      id="standard-size-normal"
                      defaultValue="0"
                      size="normal"
                      variant="standard"
                      sx={{ width: "50px" }}
                    />
                  </div>
                  <div>
                    <ListItemText
                        primary="奪三振"
                        />
                    <TextField
                      label="1"
                      id="standard-size-normal"
                      defaultValue="0"
                      size="normal"
                      variant="standard"
                      sx={{ width: "50px" }}
                    />
                    <TextField
                      label="2"
                      id="standard-size-normal"
                      defaultValue="0"
                      size="normal"
                      variant="standard"
                      sx={{ width: "50px" }}
                    />
                    <TextField
                      label="3"
                      id="standard-size-normal"
                      defaultValue="0"
                      size="normal"
                      variant="standard"
                      sx={{ width: "50px" }}
                    />
                    <TextField
                      label="4"
                      id="standard-size-normal"
                      defaultValue="0"
                      size="normal"
                      variant="standard"
                      sx={{ width: "50px" }}
                    />
                    <TextField
                      label="5"
                      id="standard-size-normal"
                      defaultValue="0"
                      size="normal"
                      variant="standard"
                      sx={{ width: "50px" }}
                    />
                    <TextField
                      label="6"
                      id="standard-size-normal"
                      defaultValue="0"
                      size="normal"
                      variant="standard"
                      sx={{ width: "50px" }}
                    />
                    <TextField
                      label="7"
                      id="standard-size-normal"
                      defaultValue="0"
                      size="normal"
                      variant="standard"
                      sx={{ width: "50px" }}
                    />
                    <TextField
                      label="8"
                      id="standard-size-normal"
                      defaultValue="0"
                      size="normal"
                      variant="standard"
                      sx={{ width: "50px" }}
                    />
                    <TextField
                      label="9"
                      id="standard-size-normal"
                      defaultValue="0"
                      size="normal"
                      variant="standard"
                      sx={{ width: "50px" }}
                    />
                  </div>
                  <div>
                    <ListItemText
                        primary="被安打"
                        />
                    <TextField
                      label="1"
                      id="standard-size-normal"
                      defaultValue="0"
                      size="normal"
                      variant="standard"
                      sx={{ width: "50px" }}
                    />
                    <TextField
                      label="2"
                      id="standard-size-normal"
                      defaultValue="0"
                      size="normal"
                      variant="standard"
                      sx={{ width: "50px" }}
                    />
                    <TextField
                      label="3"
                      id="standard-size-normal"
                      defaultValue="0"
                      size="normal"
                      variant="standard"
                      sx={{ width: "50px" }}
                    />
                    <TextField
                      label="4"
                      id="standard-size-normal"
                      defaultValue="0"
                      size="normal"
                      variant="standard"
                      sx={{ width: "50px" }}
                    />
                    <TextField
                      label="5"
                      id="standard-size-normal"
                      defaultValue="0"
                      size="normal"
                      variant="standard"
                      sx={{ width: "50px" }}
                    />
                    <TextField
                      label="6"
                      id="standard-size-normal"
                      defaultValue="0"
                      size="normal"
                      variant="standard"
                      sx={{ width: "50px" }}
                    />
                    <TextField
                      label="7"
                      id="standard-size-normal"
                      defaultValue="0"
                      size="normal"
                      variant="standard"
                      sx={{ width: "50px" }}
                    />
                    <TextField
                      label="8"
                      id="standard-size-normal"
                      defaultValue="0"
                      size="normal"
                      variant="standard"
                      sx={{ width: "50px" }}
                    />
                    <TextField
                      label="9"
                      id="standard-size-normal"
                      defaultValue="0"
                      size="normal"
                      variant="standard"
                      sx={{ width: "50px" }}
                    />
                  </div>
                  <div>
                    <ListItemText
                        primary="四壞"
                        />
                    <TextField
                      label="1"
                      id="standard-size-normal"
                      defaultValue="0"
                      size="normal"
                      variant="standard"
                      sx={{ width: "50px" }}
                    />
                    <TextField
                      label="2"
                      id="standard-size-normal"
                      defaultValue="0"
                      size="normal"
                      variant="standard"
                      sx={{ width: "50px" }}
                    />
                    <TextField
                      label="3"
                      id="standard-size-normal"
                      defaultValue="0"
                      size="normal"
                      variant="standard"
                      sx={{ width: "50px" }}
                    />
                    <TextField
                      label="4"
                      id="standard-size-normal"
                      defaultValue="0"
                      size="normal"
                      variant="standard"
                      sx={{ width: "50px" }}
                    />
                    <TextField
                      label="5"
                      id="standard-size-normal"
                      defaultValue="0"
                      size="normal"
                      variant="standard"
                      sx={{ width: "50px" }}
                    />
                    <TextField
                      label="6"
                      id="standard-size-normal"
                      defaultValue="0"
                      size="normal"
                      variant="standard"
                      sx={{ width: "50px" }}
                    />
                    <TextField
                      label="7"
                      id="standard-size-normal"
                      defaultValue="0"
                      size="normal"
                      variant="standard"
                      sx={{ width: "50px" }}
                    />
                    <TextField
                      label="8"
                      id="standard-size-normal"
                      defaultValue="0"
                      size="normal"
                      variant="standard"
                      sx={{ width: "50px" }}
                    />
                    <TextField
                      label="9"
                      id="standard-size-normal"
                      defaultValue="0"
                      size="normal"
                      variant="standard"
                      sx={{ width: "50px" }}
                    />
                  </div>
                  <div>
                    <ListItemText
                        primary="出局"
                        />
                    <TextField
                      label="1"
                      id="standard-size-normal"
                      defaultValue="0"
                      size="normal"
                      variant="standard"
                      sx={{ width: "50px" }}
                    />
                    <TextField
                      label="2"
                      id="standard-size-normal"
                      defaultValue="0"
                      size="normal"
                      variant="standard"
                      sx={{ width: "50px" }}
                    />
                    <TextField
                      label="3"
                      id="standard-size-normal"
                      defaultValue="0"
                      size="normal"
                      variant="standard"
                      sx={{ width: "50px" }}
                    />
                    <TextField
                      label="4"
                      id="standard-size-normal"
                      defaultValue="0"
                      size="normal"
                      variant="standard"
                      sx={{ width: "50px" }}
                    />
                    <TextField
                      label="5"
                      id="standard-size-normal"
                      defaultValue="0"
                      size="normal"
                      variant="standard"
                      sx={{ width: "50px" }}
                    />
                    <TextField
                      label="6"
                      id="standard-size-normal"
                      defaultValue="0"
                      size="normal"
                      variant="standard"
                      sx={{ width: "50px" }}
                    />
                    <TextField
                      label="7"
                      id="standard-size-normal"
                      defaultValue="0"
                      size="normal"
                      variant="standard"
                      sx={{ width: "50px" }}
                    />
                    <TextField
                      label="8"
                      id="standard-size-normal"
                      defaultValue="0"
                      size="normal"
                      variant="standard"
                      sx={{ width: "50px" }}
                    />
                    <TextField
                      label="9"
                      id="standard-size-normal"
                      defaultValue="0"
                      size="normal"
                      variant="standard"
                      sx={{ width: "50px" }}
                    />
                  </div>
                  <div>
                    <ListItemText
                        primary="失分"
                        />
                    <TextField
                      label="1"
                      id="standard-size-normal"
                      defaultValue="0"
                      size="normal"
                      variant="standard"
                      sx={{ width: "50px" }}
                    />
                    <TextField
                      label="2"
                      id="standard-size-normal"
                      defaultValue="0"
                      size="normal"
                      variant="standard"
                      sx={{ width: "50px" }}
                    />
                    <TextField
                      label="3"
                      id="standard-size-normal"
                      defaultValue="0"
                      size="normal"
                      variant="standard"
                      sx={{ width: "50px" }}
                    />
                    <TextField
                      label="4"
                      id="standard-size-normal"
                      defaultValue="0"
                      size="normal"
                      variant="standard"
                      sx={{ width: "50px" }}
                    />
                    <TextField
                      label="5"
                      id="standard-size-normal"
                      defaultValue="0"
                      size="normal"
                      variant="standard"
                      sx={{ width: "50px" }}
                    />
                    <TextField
                      label="6"
                      id="standard-size-normal"
                      defaultValue="0"
                      size="normal"
                      variant="standard"
                      sx={{ width: "50px" }}
                    />
                    <TextField
                      label="7"
                      id="standard-size-normal"
                      defaultValue="0"
                      size="normal"
                      variant="standard"
                      sx={{ width: "50px" }}
                    />
                    <TextField
                      label="8"
                      id="standard-size-normal"
                      defaultValue="0"
                      size="normal"
                      variant="standard"
                      sx={{ width: "50px" }}
                    />
                    <TextField
                      label="9"
                      id="standard-size-normal"
                      defaultValue="0"
                      size="normal"
                      variant="standard"
                      sx={{ width: "50px" }}
                    />
                  </div>
        </AccordionDetails>
      </Accordion>
    </List>
                    </div>
                   
                </Stack>
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
        <Divider />
        <CardActions sx={{ justifyContent: "flex-end" }}>
          <Button variant="contained">Save</Button>
        </CardActions>
      </Card>
    </form>
  );
};
