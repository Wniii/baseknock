import React, { useEffect } from 'react';
import Head from 'next/head';
import { Box, Container, Stack, Typography, Grid, Divider } from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import TeamManagement from 'src/sections/team/team-profile-details.jsx'; // 確保路徑正確
import { useRouter } from 'next/router';
import { useAuthContext } from 'src/contexts/auth-context'; // 確保路徑正確

const Page = () => {
  const { isAuthenticated, isLoading } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading || !isAuthenticated) {
    return <div>Loading...</div>;
  }

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
