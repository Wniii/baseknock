import { useCallback, useMemo, useState } from 'react';
import Head from 'next/head';
import { subDays, subHours } from 'date-fns';
import { useRouter } from 'next/router';
import { Box, Container, Stack, Typography } from '@mui/material';
import { useSelection } from 'src/hooks/use-selection';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { CustomersTable } from 'src/sections/customer/customers-table';
import { applyPagination } from 'src/utils/apply-pagination';
import { Score } from 'src/sections/gamerecord/Score';
const now = new Date();

const data = [
  {
    id: '5e887ac47eed253091be10cb',
    address: {
      city: 'Cleveland',
      country: 'USA',
      state: 'Ohio',
      street: '2849 Fulton Street'
    },
    avatar: '/assets/avatars/avatar-carson-darrin.png',
    createdAt: subDays(subHours(now, 7), 1).getTime(),
    email: 'carson.darrin@devias.io',
    name: '陳姿禔',
    phone: '304-428-3097'
  }
];

const useCustomers = (page, rowsPerPage) => {
  return useMemo(
    () => {
      return applyPagination(data, page, rowsPerPage);
    },
    [page, rowsPerPage]
  );
};

const useCustomerIds = (customers) => {
  return useMemo(
    () => {
      return customers.map((customer) => customer.id);
    },
    [customers]
  );
};

const Page = () => {
  const router = useRouter();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const customers = useCustomers(page, rowsPerPage);
  const customersIds = useCustomerIds(customers);
  const customersSelection = useSelection(customersIds);
  const { codeName } = router.query; // 从路由参数获取值
  const { timestamp } = router.query;
  const { teamId } = router.query;

console.log("code111",codeName)
console.log("111",timestamp)
  const handlePageChange = useCallback(
    (event, value) => {
      setPage(value);
    },
    []
  );

  const handleRowsPerPageChange = useCallback(
    (event) => {
      setRowsPerPage(event.target.value);
    },
    []
  );

  return (
    <>
      <Head>
        <title>
          Customers | Devias Kit
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
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Stack
              direction="row"
              justifyContent="space-between"
              
            >
            <div>
              <Typography variant="h3">
                比賽紀錄
              </Typography>
            </div>
            </Stack>
            </div>
            <div style={{ display: 'flex', flexDirection: 'row' }}>
            <div style={{ marginRight: '10px' }}>
                <Box 
                  border={2}
                  borderRadius={5}
                  borderColor="#84C1FF"
                  padding={1}
                  width={100} 
                  display="flex"
                  alignItems="center" 
                  justifyContent="center" 
                  bgcolor="#84C1FF"
                >
                  <Typography
                    variant="button"
                    display="flex" 
                    alignItems="center" 
                    fontWeight="bold"
                    color="#005AB5"
                  >
                    比數
                  </Typography>
                </Box>
              </div>
              <div style={{ marginRight: '10px' }}>
                <Box 
                  border={2}
                  borderRadius={5}
                  borderColor="#84C1FF"
                  padding={1}
                  width={100} 
                  display="flex"
                  alignItems="center" 
                  justifyContent="center" 
                  bgcolor="#84C1FF"
                >
                  <Typography
                    variant="button"
                    display="flex" 
                    alignItems="center" 
                    fontWeight="bold"
                    color="#005AB5"
                  >
                    比賽性質
                  </Typography>
                </Box>
              </div>
              <div>
                <Box 
                  border={2}
                  borderRadius={5}
                  borderColor="#84C1FF"
                  padding={1}
                  width={100} 
                  display="flex"
                  alignItems="center" 
                  justifyContent="center" 
                  bgcolor="#84C1FF"
                >
                  <Typography
                    variant="button"
                    display="flex"
                    alignItems="center" 
                    fontWeight="bold"
                    color="#005AB5"
                  >
                    比賽日期
                  </Typography>
                </Box>
              </div>
            </div>
            <Score 
            teamId={teamId}
            timestamp={timestamp}
            codeName={codeName} />
            <CustomersTable
              teamId={teamId}
              timestamp={timestamp}
              codeName={codeName} // 将 codeName 传递给子组件
              count={data.length}
              items={customers}
              onDeselectAll={customersSelection.handleDeselectAll}
              onDeselectOne={customersSelection.handleDeselectOne}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
              onSelectAll={customersSelection.handleSelectAll}
              onSelectOne={customersSelection.handleSelectOne}
              page={page}
              rowsPerPage={rowsPerPage}
              selected={customersSelection.selected}
            />
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
