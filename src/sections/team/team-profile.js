import React, { useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
  Typography
} from '@mui/material';
import { ref, uploadBytes } from 'firebase/storage';
import { storage } from 'src/pages/firebase'; // 导入您的Firebase配置

export const TeamProfile = () => {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null); // 用于预览图片

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result); // 设置预览图片
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    try {
      const storageRef = ref(storage, `profileImages/${file.name}`);
      await uploadBytes(storageRef, file);
      alert('圖片上傳成功');
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('上傳失敗');
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
              flexDirection: 'column',
              width: 120,
              height: 120,
            }}
          >
            {previewUrl && (
              <Avatar
                src={previewUrl}
                sx={{
                  height: 120,
                  mb: 2, // Margin bottom is set to spacing unit 2
                  width: 120, // Width is the same as height to keep the aspect ratio
                  borderRadius: 0,
                }}
              />
            )}
          </Box>
        </CardContent>
        <Divider />
        <CardActions>
          <input type="file" onChange={handleFileChange} />
          <Button
            fullWidth
            variant="text"
            onClick={handleUpload}
          >
            上傳圖片
          </Button>
        </CardActions>
      </Card>
      {/* ... */}
    </div>
  );
};
