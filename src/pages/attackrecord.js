import Head from 'next/head';
import { Box, Container, Stack, Typography } from '@mui/material';
import { HitTable } from 'src/sections/hit/hittable';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';

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
            打擊紀錄
          </Typography>
        </div>
          <HitTable />
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

