// src/pages/attackplace.js

import React from 'react';
import Head from 'next/head';
import { subDays, subHours } from 'date-fns';
import { Box, Container, Grid, Typography } from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { OverviewLatestProducts } from 'src/sections/overview/overview-latest-products';
import { OverviewTraffic } from 'src/sections/overview/overview-traffic';
import { AttackPlayerPage } from 'src/player/AttackPlayerPage';
import Button from '@mui/material/Button';


import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { useRouter } from 'next/router'; // 移到這裡

const now = new Date();

const AttackPlacePage = () => {
  const router = useRouter(); // 在這裡使用 useRouter

  const handleReturnClick = () => {
    router.push('/your-other-page');
  };

  const handleSaveClick = () => {
    router.push('/DefencePlacePage'); // 導航到另一個頁面的路徑
  };

  return (
  <>
    <Head>
      <title>大專棒球隊 | Devias Kit | Attack Place</title>
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
            攻擊位
          </Typography>
        </div>
        <Grid container spacing={3} justifyContent="center">
          <Grid item>
            {/* Dropdown Menu 1 */}
            <FormControl variant="outlined" style={{ minWidth: '150px' }}>
              <InputLabel id="dropdown-label-1">查詢期間</InputLabel>
              <Select
                labelId="dropdown-label-1"
                label="選項1"
                // Add onChange and value props as needed
              >
                {/* Add MenuItem components with options */}
                <MenuItem value={1}>選項1.1</MenuItem>
                <MenuItem value={2}>選項1.2</MenuItem>
                {/* Add more options as needed */}
              </Select>
            </FormControl>
          </Grid>
          <Grid item>
            {/* Dropdown Menu 2 */}
            <FormControl variant="outlined" style={{ minWidth: '150px' }}>
              <InputLabel id="dropdown-label-2">排序</InputLabel>
              <Select
                labelId="dropdown-label-2"
                label="選項2"
                // Add onChange and value props as needed
              >
                {/* Add MenuItem components with options */}
                <MenuItem value={1}>選項2.1</MenuItem>
                <MenuItem value={2}>選項2.2</MenuItem>
                {/* Add more options as needed */}
              </Select>
            </FormControl>
          </Grid>
          <Grid item>
            {/* Dropdown Menu 3 */}
            <FormControl variant="outlined" style={{ minWidth: '150px' }}>
              <InputLabel id="dropdown-label-3">最近打席</InputLabel>
              <Select
                labelId="dropdown-label-3"
                label="選項3"
                // Add onChange and value props as needed
              >
                {/* Add MenuItem components with options */}
                <MenuItem value={1}>選項3.1</MenuItem>
                <MenuItem value={2}>選項3.2</MenuItem>
                {/* Add more options as needed */}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        <Grid container spacing={3} direction="row" alignItems="center" justifyContent="center">
          <Grid item style={{ height: '550px', overflowY: 'auto', textAlign: 'center' }}>
            <OverviewLatestProducts
              products={[
                {
                  id: '1',
                  image: '/assets/products/product-1.png',
                  name: '攻擊位玩家1',
                  updatedAt: subHours(now, 6).getTime()
                },
                {
                  id: '2',
                  image: '/assets/products/product-1.png',
                  name: '攻擊位玩家1',
                  updatedAt: subHours(now, 6).getTime()
                },
                {
                  id: '3',
                  image: '/assets/products/product-1.png',
                  name: '攻擊位玩家1',
                  updatedAt: subHours(now, 6).getTime()
                },
                {
                  id: '4',
                  image: '/assets/products/product-1.png',
                  name: '攻擊位玩家1',
                  updatedAt: subHours(now, 6).getTime()
                },
                {
                  id: '5',
                  image: '/assets/products/product-1.png',
                  name: '攻擊位玩家1',
                  updatedAt: subHours(now, 6).getTime()
                },
                {
                  id: '6',
                  image: '/assets/products/product-1.png',
                  name: '攻擊位玩家1',
                  updatedAt: subHours(now, 6).getTime()
                },
                {
                  id: '7',
                  image: '/assets/products/product-1.png',
                  name: '攻擊位玩家1',
                  updatedAt: subHours(now, 6).getTime()
                },
                {
                  id: '8',
                  image: '/assets/products/product-1.png',
                  name: '攻擊位玩家1',
                  updatedAt: subHours(now, 6).getTime()
                },
                {
                  id: '9',
                  image: '/assets/products/product-1.png',
                  name: '攻擊位玩家1',
                  updatedAt: subHours(now, 6).getTime()
                },
                // Add more attack place players as needed
              ]}
              sx={{ height: '100%', overflowY: 'auto' }}
              />
              </Grid>
              {/* Buttons in the same column */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Button variant="contained" color="primary" style={{ marginBottom: '10px', width: '200px', height: '50px' }}>
              自動填滿
              </Button>
              <Button variant="contained" color="primary" style={{ width: '200px', height: '50px' }}>
                清除先發
              </Button>
              <div style={{ marginTop: '30px' }}>
              <Button variant="contained" color="primary" onClick={handleReturnClick}>
                 返回
                </Button>
                <Button variant="contained" color="primary" onClick={handleSaveClick} style={{ marginLeft: '8px' }}>
                 儲存
                </Button>
              </div>
            </div>

              <Grid item style={{ height: '550px', overflowY: 'auto', textAlign: 'center' }}>
                
                <AttackPlayerPage
              players={[
                {
                  id: '1',
                  image: '/assets/products/product-1.png',
                  name: '攻擊位玩家1',
                  updatedAt: subHours(now, 6).getTime()
                },
                {
                  id: '2',
                  image: '/assets/products/product-1.png',
                  name: '攻擊位玩家1',
                  updatedAt: subHours(now, 6).getTime()
                },
                {
                  id: '3',
                  image: '/assets/products/product-1.png',
                  name: '攻擊位玩家1',
                  updatedAt: subHours(now, 6).getTime()
                },
                {
                  id: '4',
                  image: '/assets/products/product-1.png',
                  name: '攻擊位玩家1',
                  updatedAt: subHours(now, 6).getTime()
                },
                {
                  id: '5',
                  image: '/assets/products/product-1.png',
                  name: '攻擊位玩家1',
                  updatedAt: subHours(now, 6).getTime()
                },
                {
                  id: '6',
                  image: '/assets/products/product-1.png',
                  name: '攻擊位玩家1',
                  updatedAt: subHours(now, 6).getTime()
                },
                {
                  id: '7',
                  image: '/assets/products/product-1.png',
                  name: '攻擊位玩家1',
                  updatedAt: subHours(now, 6).getTime()
                },
                {
                  id: '8',
                  image: '/assets/products/product-1.png',
                  name: '攻擊位玩家1',
                  updatedAt: subHours(now, 6).getTime()
                },
                {
                  id: '9',
                  image: '/assets/products/product-1.png',
                  name: '攻擊位玩家1',
                  updatedAt: subHours(now, 6).getTime()
                },
                // Add more attack place players as needed
              ]}
              sx={{ height: '100%', overflowY: 'auto' }}
            />
            
          </Grid>
        </Grid>
      </Container>
    </Box>
  </>
);
}
AttackPlacePage.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default AttackPlacePage;
