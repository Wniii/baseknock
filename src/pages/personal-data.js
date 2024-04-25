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
// const data = [
  // 数据项
// ];

// const now = new Date();

// const useCustomers = (page, rowsPerPage) => {
//   return useMemo(() => {
//     return applyPagination(data, page, rowsPerPage);
//   }, [page, rowsPerPage]);
// };

// const useCustomerIds = (customers) => {
//   return useMemo(() => {
//     return customers.map((customer) => customer.id);
//   }, [customers]);
// };

const Page = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [selectedTeam, setSelectedTeam] = useState(null);

  const handlePageChange = useCallback((event, value) => {
    setPage(value);
  }, []);

  const handleRowsPerPageChange = useCallback((event) => {
    setRowsPerPage(event.target.value);
  }, []);

  // 定義函數來更新 selectedPlayer 和 selectedTeam 狀態

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
        <Stack spacing={1}>
                <Typography variant="h4" sx={{ fontFamily: 'Montserrat sans-serif', fontWeight: 'bold' }}>
                  球員個人數據
                </Typography>
              </Stack>
          <Stack spacing={3}>
            <AccountProfile onPlayerSelect={setSelectedPlayer} onTeamSelect={setSelectedTeam}/>
            <div>
              <Typography variant="h6">打擊成績</Typography>
            </div>
            <Bdata
              // count={data.length}
              // items={customers}

              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
              page={page}
              rowsPerPage={rowsPerPage}
              selectedPlayer={selectedPlayer}
              selectedTeam={selectedTeam}
            />
            <Typography variant="h6">投球成績</Typography>
            <Pdata
              // count={data.length}
              // items={customers}
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
