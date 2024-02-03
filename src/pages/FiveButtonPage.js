// src/pages/fiveButtonsPage.js

import React from 'react';
import Head from 'next/head';
import { Box, Button, Container, Typography } from '@mui/material';

const FiveButtonsPage = () => (
  <>
    <Head>
      <title>五個按鈕頁面</title>
    </Head>
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 8,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Container maxWidth="xl">
        <div style={{ textAlign: 'center' }}>
          
        </div>
        {/* Buttons */}
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
        >
          <Button
            variant="contained"
            color="primary"
            style={{ marginBottom: '10px', width: '200px', height: '50px' }}
          >
            記錄防守
          </Button>
          <Button
            variant="contained"
            color="primary"
            style={{ marginBottom: '10px', width: '200px', height: '50px' }}
          >
            記錄打擊
          </Button>
          <Button
            variant="contained"
            color="primary"
            style={{ marginBottom: '10px', width: '200px', height: '50px' }}
          >
            排打擊棒次
          </Button>
          <Button
            variant="contained"
            color="primary"
            style={{ marginBottom: '10px', width: '200px', height: '50px' }}
          >
            排守備位置
          </Button>
          <Button
            variant="contained"
            color="primary"
            style={{ width: '200px', height: '50px' }}
          >
            編輯比賽資訊
          </Button>
        </Box>
      </Container>
    </Box>
  </>
);

export default FiveButtonsPage;
