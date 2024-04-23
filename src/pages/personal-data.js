import { useCallback, useMemo, useState } from "react";
import Head from "next/head";
import { Box, Typography } from "@mui/material";
import { useSelection } from "src/hooks/use-selection";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { Bdata } from "src/sections/data/b-data";
import { Pdata } from "src/sections/data/p-data";
import { applyPagination } from "src/utils/apply-pagination";
import { Container, Stack } from "@mui/material";
import { AccountProfile } from "src/sections/data/account-profile";

// 假设这是你的数据
const data = [
  // 数据项
];

const now = new Date();

const useCustomers = (page, rowsPerPage) => {
  return useMemo(() => {
    return applyPagination(data, page, rowsPerPage);
  }, [page, rowsPerPage]);
};

const useCustomerIds = (customers) => {
  return useMemo(() => {
    return customers.map((customer) => customer.id);
  }, [customers]);
};

const Page = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const customers = useCustomers(page, rowsPerPage);
  const customersIds = useCustomerIds(customers);
  const customersSelection = useSelection(customersIds);

  const handlePageChange = useCallback((event, value) => {
    setPage(value);
  }, []);

  const handleRowsPerPageChange = useCallback((event) => {
    setRowsPerPage(event.target.value);
  }, []);

  return (
    <>
      <Head>
        <title>頁面 | Devias Kit</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <AccountProfile />
            <div>
              <Typography variant="h6">打擊成績</Typography>
            </div>
            <Bdata
              count={data.length}
              items={customers}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
              page={page}
              rowsPerPage={rowsPerPage}
            />
            <Typography variant="h6">投球成績</Typography>
            <Pdata
              count={data.length}
              items={customers}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
              page={page}
              rowsPerPage={rowsPerPage}
            />
          </Stack>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
