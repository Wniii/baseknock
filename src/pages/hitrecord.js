// Page.js

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import Head from 'next/head';
import { subDays, subHours } from 'date-fns';
import { Box, Button, Container, Stack, Typography } from '@mui/material';
import { useSelection } from 'src/hooks/use-selection';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { HitrecordTable } from 'src/sections/hitrecord/hitrecord-table';
import { HitrecordSearch } from 'src/sections/hitrecord/hitrecord-search';
import { collection, getDocs } from 'firebase/firestore';
import { firestore } from 'src/pages/firebase';
import { applyPagination } from 'src/utils/apply-pagination';

const Page = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [playersData, setPlayersData] = useState([]);
  const [selectedColumns, setSelectedColumns] = useState([]); // 将 setSelectedColumns 添加到 Page 组件中

  const player = useMemo(() => applyPagination(playersData, page, rowsPerPage), [playersData, page, rowsPerPage]);
  const playerId = useMemo(() => player.map(player => player.id), [player]);
  const playerSelection = useSelection(playerId);

  const [selectedTeam, setSelectedTeam] = useState(null);

  const handlePageChange = useCallback((event, value) => {
    setPage(value);
  }, []);

  const handleRowsPerPageChange = useCallback((event) => {
    setRowsPerPage(event.target.value);
  }, []);

  useEffect(() => {
    const fetchPlayersData = async () => {
      const playersCollection = collection(firestore, 'player');
      const querySnapshot = await getDocs(playersCollection);
      const data = [];
      querySnapshot.forEach((doc) => {
        data.push({
          p_id: doc.id,
          p_name: doc.data().p_name
        });
      });

      setPlayersData(data);
    };
    fetchPlayersData();
  }, []);

  const handleSearchConfirm = useCallback((columns, team) => {
    setSelectedColumns(columns);
    setSelectedTeam(team); // 更新selectedTeam變量
  }, []);

  return (
    <>
      <Head>
        <title>打擊數據</title>
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
                <Typography variant="h4" sx={{ fontFamily: 'Montserrat sans-serif', fontWeight: 'bold' }}>
                  打擊數據
                </Typography>
              </Stack>
            </Stack>
            {/* 将 ParentComponent 替换为 HitrecordTable 的子组件 */}
            <HitrecordSearch onConfirm={handleSearchConfirm} />
            <HitrecordTable
             selectedTeam={selectedTeam}
              count={playersData.length}
              items={player}
              onDeselectAll={playerSelection.handleDeselectAll}
              onDeselectOne={playerSelection.handleDeselectOne}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
              onSelectAll={playerSelection.handleSelectAll}
              onSelectOne={playerSelection.handleSelectOne}
              page={page}
              rowsPerPage={rowsPerPage}
              selected={playerSelection.selected}
              selectedColumns={selectedColumns} // 将 selectedColumns 传递给 HitrecordTable 组件
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
