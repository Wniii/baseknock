import Head from 'next/head';
import ArrowUpOnSquareIcon from '@heroicons/react/24/solid/ArrowUpOnSquareIcon';
import ArrowDownOnSquareIcon from '@heroicons/react/24/solid/ArrowDownOnSquareIcon';
import PlusIcon from '@heroicons/react/24/solid/PlusIcon';
import {
  Box,
  Button,
  Container,
  Pagination,
  Stack,
  SvgIcon,
  Typography,
  Unstable_Grid2 as Grid
} from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { Rankpage } from 'src/sections/rank/rank-table';
import { CompaniesSearch } from 'src/sections/rank/rank-search';

import { subDays, subHours } from 'date-fns';


const now = new Date();


const Page = () => (
  <>
    <Head>
      <title>
        各項排名
      </title>
    </Head>
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 8
      }}
    >
      <Container maxWidth="xl">
        <Stack spacing={3}>
          <Stack
            direction="row"
            justifyContent="space-between"
            spacing={4}
          >
            <Stack spacing={1}>
              <Typography variant="h4">
                各項排名
              </Typography>
              <Stack
                alignItems="center"
                direction="row"
                spacing={1}
              >
              </Stack>
            </Stack>
          </Stack>
          <CompaniesSearch />
          <Grid
            container
            spacing={3}
          >
            <Rankpage
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
                // Add more attack place players as needed
              ]}
              sx={{ height: '100%', overflowY: 'auto' }}
            />
            
            {/* {companies.map((company) => (
              <Grid
                xs={12}
                md={6}
                lg={4}
                key={company.id}
              >
                <CompanyCard company={company} />
              </Grid>
            ))} */}
          </Grid>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center'
            }}
          >
            <Pagination
              count={3}
              size="small"
            />
          </Box>
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
