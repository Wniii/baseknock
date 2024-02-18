import Head from 'next/head';
import { Box, Container, Stack, Typography, Unstable_Grid2 as Grid, Divider } from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { AddGame } from 'src/sections/game/game-details';


const Page = () => (
  <>
    <Head>
      <title>
        新增比賽
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
              新增比賽
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
                md={12}
                lg={12}
              >
                <AddGame />
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
