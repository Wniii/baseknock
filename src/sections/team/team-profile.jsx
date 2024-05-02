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
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage, db } from 'src/pages/firebase'; // 导入您的Firebase配置


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
      const downloadUrl = await getDownloadURL(storageRef); // 获取上传图片的下载 URL

      // 将图片 URL 存储到 Firestore 中
      await db.collection('team').doc('photo').update({
        photo: downloadUrl
      });

      alert('圖片上傳成功');
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('圖片上傳失敗');
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
            {/* 如果有选择文件，则显示预览图片 */}
            {previewUrl && (
              <Avatar
                src={previewUrl}
                sx={{
                  height: 120,
                  mb: 120,
                  width: 80,
                  md: 2,
                  borderRadius: 0,
                }}
              />
            )}
            {/* ... 其他用户信息 ... */}
          </Box>
        </CardContent>
        <Divider />
        <CardActions>
          {/*<input type="file" onChange={handleFileChange} />*/}
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
