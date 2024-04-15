import React, { useRef } from 'react';
import Head from 'next/head';
import { Box, Button, Container, Stack, Typography, Grid, Divider } from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import TeamManagement from 'src/sections/team/team-profile-details.jsx'; // 修改這一行，确保路徑正確

const Page = () => {
  return (
    <>
      <Head>
        <title>新增球隊</title>
      </Head>
      <Box component="main" sx={{ flexGrow: 1, py: 0 }}>
        <Container maxWidth="lg">
          <Stack spacing={3}>
            <Typography variant="h4" sx={{ mb: 2 }}>新增球隊</Typography>
            <Divider />
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TeamManagement /> 
              </Grid>
            </Grid>
          </Stack>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Page;
