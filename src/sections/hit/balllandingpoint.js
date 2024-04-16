import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Card, CardContent } from '@mui/material';

const BallLandingPoint = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [clickCoordinates, setClickCoordinates] = useState({ x: 0, y: 0 });
  const [markers, setMarkers] = useState([]);

  const handleImageClick = (event) => {
    const { offsetX, offsetY } = event.nativeEvent;
    setClickCoordinates({ x: offsetX, y: offsetY });
    setMarkers([...markers, { x: offsetX, y: offsetY }]);
    setDialogOpen(true);
  };

  const handleSave = () => {
    setDialogOpen(false);
    console.log('Saved markers:', markers);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleDeleteLastMarker = () => {
    // 刪除最後一個添加的標記
    const newMarkers = markers.slice(0, -1);
    setMarkers(newMarkers);
  };

  return (
    <>
      <Card>
        <CardContent>
          <div style={{ position: 'relative' }}>
            <img
              src='https://media.istockphoto.com/id/1269757192/zh/%E5%90%91%E9%87%8F/%E6%A3%92%E7%90%83%E5%A0%B4%E5%9C%96%E7%A4%BA%E6%A3%92%E7%90%83%E5%A0%B4%E5%90%91%E9%87%8F%E8%A8%AD%E8%A8%88%E7%9A%84%E5%B9%B3%E9%9D%A2%E5%9C%96%E8%A7%A3%E9%A0%82%E8%A6%96%E5%9C%96-web.jpg?s=612x612&w=0&k=20&c=Zt85Kr6EksFKBmYQmgs138zfLRp3eoIzKeQLS2mirLU='
              // 替換成您圖片的實際 URL
              width={'400px'}
              alt='棒球場地'
              onClick={handleImageClick}
              style={{ cursor: 'pointer' }}
            />
            {markers.map((marker, index) => (
              <div key={index} style={{ position: 'absolute', top: marker.y, left: marker.x, width: '10px', height: '10px', backgroundColor: 'red', transform: 'translate(-50%, -50%)', borderRadius: '50%' }} />
            ))}
          </div>
          <Button onClick={handleDeleteLastMarker} color="secondary">
            返回
          </Button>
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
        </CardContent>
      </Card>
    </>
  );
};

export default BallLandingPoint;
