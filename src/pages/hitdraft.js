import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';

const BallparkImagePage = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [clickCoordinates, setClickCoordinates] = useState({ x: 0, y: 0 });

  const handleImageClick = (event) => {
    // 獲取滑鼠點擊事件的坐標
    const { offsetX, offsetY } = event.nativeEvent;
    // 設置點擊的坐標
    setClickCoordinates({ x: offsetX, y: offsetY });
    // 打開對話框
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  return (

    <>
      <img
        src='https://media.istockphoto.com/id/1269757192/zh/%E5%90%91%E9%87%8F/%E6%A3%92%E7%90%83%E5%A0%B4%E5%9C%96%E7%A4%BA%E6%A3%92%E7%90%83%E5%A0%B4%E5%90%91%E9%87%8F%E8%A8%AD%E8%A8%88%E7%9A%84%E5%B9%B3%E9%9D%A2%E5%9C%96%E8%A7%A3%E9%A0%82%E8%A6%96%E5%9C%96-web.jpg?s=612x612&w=0&k=20&c=Zt85Kr6EksFKBmYQmgs138zfLRp3eoIzKeQLS2mirLU='
        width={'400px'}
        alt='棒球向量圖'
        onClick={handleImageClick}
        style={{ cursor: 'pointer' }}
      />
      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>點擊坐標</DialogTitle>
        <DialogContent>
          <Typography>點擊的坐標：X 軸 {clickCoordinates.x}，Y 軸 {clickCoordinates.y}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary" autoFocus>
            關閉
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default BallparkImagePage;
