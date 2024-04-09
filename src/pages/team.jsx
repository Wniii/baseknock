import React, { useRef } from 'react';
import Head from 'next/head';
import { Box, Button, Container, Stack, Typography, Unstable_Grid2 as Grid, Divider } from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { TeamProfile } from 'src/sections/team/team-profile';
import CreateTeamDocumentButton from 'src/sections/team/team-profile-details';
import { AddTeam } from 'src/sections/team/addTeam';


const buttonSx = {
  backgroundColor: 'd3d3d3',
  display: 'flex',
  justifyContent: 'center', // 將兩個按鈕水平置中
  padding: '8px',
};

const Page = () => {

  const createTeamDocumentButtonRef = useRef();
  // 处理提交按钮点击事件
  const handleFormSubmit = () => {
    // 调用 CreateTeamDocumentButton 组件中的 handleSubmit 函数来提交数据
    createTeamDocumentButtonRef.current.handleSubmit();
  };

  return (
    <>
      <Head>
        <title>
          新增球隊
        </title>
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
              <Typography variant="h4">
                新增球隊
              </Typography>
            </div>
            <Divider />
            <div>
              <Grid
                container
                spacing={3}
              >
                <Grid
                  xs={12}
                  md={6}
                  lg={4}
                >
                  <TeamProfile />
                </Grid>
                <Grid
                  xs={12}
                  md={6}
                  lg={8}
                >
                  <CreateTeamDocumentButton ref={createTeamDocumentButtonRef} />
                </Grid>
                <Grid
                  xs={12}
                  md={12}
                  lg={12}
                >
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
            <Button size="large" sx={{ mt: 2 }} type="submit" variant="contained" >
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
