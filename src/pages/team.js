import Head from 'next/head';
import { Box, Container, Stack, Typography, Unstable_Grid2 as Grid, Divider } from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { TeamProfile } from 'src/sections/team/team-profile';
import { TeamProfileDetails } from 'src/sections/team/team-profile-details';
import { AddTeam } from 'src/sections/team/addTeam';


const Page = () => (
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
                <TeamProfileDetails />
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
    </Box>
  </>
);

Page.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Page;
