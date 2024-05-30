import { useCallback, useRef, useState } from "react";
import Head from "next/head";
import { Box, Typography, Button, Container, Stack } from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import Bdata  from "src/sections/data/b-data";
import Pdata from "src/sections/data/p-data"; // 确保这里是默认导出
import * as XLSX from 'xlsx';
import { AccountProfile } from "src/sections/data/account-profile";
import DownloadIcon from '@mui/icons-material/Download';

const Page = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [selectedTeam, setSelectedTeam] = useState(null);

  const bDataRef = useRef();
  const pDataRef = useRef();

  const handlePageChange = useCallback((event, value) => {
    setPage(value);
  }, []);

  const handleRowsPerPageChange = useCallback((event) => {
    setRowsPerPage(event.target.value);
  }, []);

  const exportToExcel = () => {

    if (!selectedPlayer || !selectedTeam) {
      alert("請選擇完隊伍和球員");
      return;
    }
    const bData = bDataRef.current.getPlayerGames();
    const bDataTotals = bDataRef.current.getTotals();
  
    const pData = pDataRef.current.getPlayerGames();
    const pDataTotals = pDataRef.current.getTotals();
  
    const wb = XLSX.utils.book_new();
  
    const bDataSheet = XLSX.utils.json_to_sheet([...bData, bDataTotals]);
    XLSX.utils.sheet_add_aoa(bDataSheet, [['球員','比賽日期', '打席', '打數', '安打', '壘打數', '打點', '一安', '二安', '三安', '全壘打', '雙殺', '四壞', '犧飛', '犧觸', '觸身','打擊率','上壘率','長打率','OPS']], { origin: 'A1' });
    XLSX.utils.book_append_sheet(wb, bDataSheet, "打擊成績");
  
    const pDataSheet = XLSX.utils.json_to_sheet([...pData, pDataTotals]);
    XLSX.utils.sheet_add_aoa(pDataSheet, [['球員','比賽日期', '好球數', '壞球數', '耗球數', 'ERA', '局數', '安打', '失分', '四壞', '奪三振', 'WHIP', '好壞球比', 'K/9', 'BB/9', 'H/9']], { origin: 'A1' });
    XLSX.utils.book_append_sheet(wb, pDataSheet, "投手成績");
  
    XLSX.writeFile(wb, `${selectedPlayer.id}個人數據.xlsx`);
  };
  
  

  return (
    <>
      <Head>
        <title>球員個人數據</title>
      </Head>
      
      <Box component="main" sx={{ flexGrow: 1 }}>
        <Container maxWidth="xl">
          <Stack spacing={1}>
            <Typography variant="h4" sx={{ fontFamily: 'Montserrat sans-serif', fontWeight: 'bold' }}>
              球員個人數據
            </Typography>
          </Stack>
          
          <Stack spacing={3}>
            <AccountProfile onPlayerSelect={setSelectedPlayer} onTeamSelect={setSelectedTeam} />
      
            <Button onClick={exportToExcel} sx={{ width: '120px' }} startIcon={<DownloadIcon />}>
      下載數據
      </Button>
            <div>
              <Typography variant="h6">打擊成績</Typography>
            </div>
            <Bdata
              ref={bDataRef}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
              page={page}
              rowsPerPage={rowsPerPage}
              selectedPlayer={selectedPlayer}
              selectedTeam={selectedTeam}
            />
            <Typography variant="h6">投球成績</Typography>
            <Pdata
              ref={pDataRef}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
              page={page}
              rowsPerPage={rowsPerPage}
              selectedPlayer={selectedPlayer}
              selectedTeam={selectedTeam}
            />
            
          </Stack>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
