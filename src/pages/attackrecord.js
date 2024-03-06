import Head from 'next/head';
import { Box, Container, Stack, Typography, Button, Grid, CardActions } from '@mui/material';
import { HitTable } from 'src/sections/hit/hittable';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import HitDetail from 'src/sections/hit/hitdetail';
import BaseSituation from 'src/sections/hit/basesituation';
import BallLandingPoint from 'src/sections/hit/balllandingpoint';


const Page = () => (
  <>
    <Head>
      <title>
        Settings | Devias Kit
      </title>
    </Head>
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 8
      }}
    >
      <Container maxWidth="lg">
        <Stack spacing={3}>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Typography variant="h3">
            新增打席
          </Typography>
        </div>
        <div style={{marginTop: '20px'}}>
        <Grid
          container
          spacing={3}
        >
        <Grid
          xs={12}
          sm={6}
          item
        >
          <HitTable />
        </Grid>

        <Grid
          xs={12}
          sm={6}
          item
        >
          <BallLandingPoint />
        </Grid> 

        <Grid
          xs={12}
          sm={6}
          item
        >
          <HitDetail />
        </Grid>
        <Grid
          xs={12}
          sm={6}
          item
        >
          <BaseSituation />
        </Grid>
        </Grid>
        </div>          
        </Stack>
        <CardActions sx={{ justifyContent: 'center' }}>
          <Button variant="contained">
              Save
          </Button>
        </CardActions>
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

