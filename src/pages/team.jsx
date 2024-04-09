import React, { useRef } from 'react';
import Head from 'next/head';
import { Box, Button, Container, Stack, Typography, Grid, Divider } from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { TeamProfile } from 'src/sections/team/team-profile';
import CreateTeamDocumentButton from 'src/sections/team/team-profile-details';
import { AddTeam } from 'src/sections/team/addTeam';

const buttonSx = {
  backgroundColor: 'd3d3d3',
  display: 'flex',
  justifyContent: 'center',
  padding: '8px',
};

const sectionSx = {
  p: 2, // 添加白边
};

const Page = () => {
  const createTeamDocumentButtonRef = useRef();

  const handleFormSubmit = () => {
    if (createTeamDocumentButtonRef.current) {
      createTeamDocumentButtonRef.current.handleSubmit();
    }
  };

  return (
    <>
      <Head>
        <title>新增球隊</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 0
        }}
      >
        <Container maxWidth="lg">
          <Stack spacing={3}>
            <div>
              <Typography variant="h4">新增球隊</Typography>
            </div>
            <Divider />
            <div>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6} lg={4} sx={sectionSx}>
                  <TeamProfile />
                </Grid>
                <Grid item xs={12} md={6} lg={8} sx={sectionSx}>
                  <CreateTeamDocumentButton ref={createTeamDocumentButtonRef} />
                </Grid>
                <Grid item xs={12} sx={sectionSx}>
                  <AddTeam />
                </Grid>
              </Grid>
            </div>
          </Stack>
        </Container>
        <div style={buttonSx}>
          <div>
            <Button size="large" sx={{ mt: 2, mr: 1 }} type="cancel" variant="contained">
              取消
            </Button>
            <Button size="large" sx={{ mt: 2 }} variant="contained" onClick={handleFormSubmit}>
              確認新增
            </Button>
          </div>
        </div>
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
