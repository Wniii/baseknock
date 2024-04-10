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
      alert('图片上传成功');
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('上传失败');
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
            {/* 如果有选择文件，则显示预览图片 */}
            {previewUrl && (
              <Avatar
                src={previewUrl}
                sx={{
                  height: 80,
                  mb: 7,
                  width: 80,
                  justifyContent: 'center',
                }}
              />
            )}
            {/* ... 其他用户信息 ... */}
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
            上传图片
          </Button>
        </CardActions>
      </Card>
      {/* ... */}
    </div>
  );
};
