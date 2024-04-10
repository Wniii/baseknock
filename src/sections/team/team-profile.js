import React, { useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  Typography,
} from '@mui/material';

export const TeamProfile = () => {
  const [avatarUrl, setAvatarUrl] = useState(null);

  // Function to handle file selection
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const fileUrl = URL.createObjectURL(file);
      setAvatarUrl(fileUrl);
    }
  };

  return (
    <div>
      <Card>
        <CardContent>
          <Box
            sx={{
              alignItems: 'center',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <Avatar
              src={avatarUrl}
              sx={{
                height: 120, // Set the height to make it square
                width: 120, // Set the width to make it square
                mb: 2,
                borderRadius: 0, // Override MUI's default border-radius
              }}
            />
          </Box>
        </CardContent>
        <Divider />
        <CardActions>
          {/* File input for uploading picture */}
          <input type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} id="upload-avatar" />
          <label htmlFor="upload-avatar">
            <Button
              fullWidth
              variant="text"
              component="span"
            >
              Upload picture
            </Button>
          </label>
        </CardActions>
      </Card>
      <br></br>
    </div>
  );
};