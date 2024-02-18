import { useRouter } from 'next/router';
import React, { useState } from 'react'; // 引入 useState 鉤子
import Head from 'next/head';
import { subDays, subHours } from 'date-fns';
import { Box, Container, Grid, Typography, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material'; // 引入 Dialog 和相關組件
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { OverviewLatestProducts } from 'src/sections/overview/overview-latest-products';
import Button from '@mui/material/Button';

// 在此處導入 BallparkImagePage 組件
import BallparkImagePage from './BallparkImagePage';

const now = new Date();

const DefencePlacePage = () => {
  const router = useRouter(); // 將 useRouter 放在組件函數內部

  // 1. 定義彈跳視窗的狀態
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleReturnClick = () => {
    router.push('/attackplacepage'); // 導航到另一個頁面的路徑
  };

  const handleSaveClick = () => {
    // 2. 在儲存按鈕處理程序中設置彈跳視窗狀態為 true
    setDialogOpen(true);
  };

  // 3. 定義彈跳視窗關閉處理程序
  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  return (
    <>
      <Head>
        <title>大專棒球隊 | Devias Kit | Defence Place</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8
        }}
      >
        <Container maxWidth="xl">
          <div style={{ textAlign: 'center' }}>
            <Typography variant="h4" mb={4}>
              防守位
            </Typography>
          </div>
          <Grid container spacing={3} direction="row" alignItems="center" justifyContent="center">
            <Grid item style={{ height: '550px', overflowY: 'auto', textAlign: 'center' }}>
              <OverviewLatestProducts
                products={[
                  {
                    id: '1',
                    image: '/assets/products/product-1.png',
                    name: '防守位玩家1',
                    updatedAt: subHours(now, 6).getTime()
                  },
                  // Add more defence place players as needed
                ]}
                sx={{ height: '100%', overflowY: 'auto' }}
              />
            </Grid>
            <Grid xs={12} md={6} lg={4}>
              {/* 將 BallparkImagePage 放在這裡 */}
              <BallparkImagePage />
               <div style={{ marginTop: '30px' }}>
              <Button variant="contained" color="primary" onClick={handleReturnClick}>
                 返回
                </Button>
                <Button variant="contained" color="primary" onClick={handleSaveClick} style={{ marginLeft: '8px' }}>
                 儲存
                </Button>
              </div>
            </Grid>
          </Grid>
        </Container>
      </Box>
      {/* 4. 在彈跳視窗的位置添加 Dialog 組件 */}
      <Dialog open={dialogOpen} onClose={handleDialogClose}>
      <DialogTitle>儲存成功</DialogTitle>
      <DialogContent>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleDialogClose} color="primary" autoFocus>
          記錄防守
        </Button>
        <Button onClick={handleDialogClose} color="primary">
          記錄打擊
        </Button>
        <Button onClick={handleDialogClose} color="primary">
          排打擊棒次
        </Button>
        <Button onClick={handleDialogClose} color="primary">
          排守備位置
        </Button>
        <Button onClick={handleDialogClose} color="primary">
          編輯比賽資訊
        </Button>
      </DialogActions>
    </Dialog>

    </>
  );
};

DefencePlacePage.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default DefencePlacePage;
