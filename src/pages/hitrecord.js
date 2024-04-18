// src/pages/hitrecord.js

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import Head from 'next/head';
import { Box, Container, Stack, Typography } from '@mui/material';
import { useSelection } from 'src/hooks/use-selection';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { HitrecordTable } from 'src/sections/hitrecord/hitrecord-table';
import { HitrecordSearch } from 'src/sections/hitrecord/hitrecord-search';
import { collection, getDocs } from 'firebase/firestore';
import { firestore } from 'src/pages/firebase';
import { applyPagination } from 'src/utils/apply-pagination';
import Manage from 'src/sections/hitrecord/hitrecord-detail'; // 引入 Manage 组件

import {  query, where } from 'firebase/firestore';


const Page = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [playersData, setPlayersData] = useState([]);
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [teamPlayers, setTeamPlayers] = useState([]);

  const playerSelection = useSelection(playersData.map(player => player.id));

  useEffect(() => {
    const fetchPlayersData = async () => {
      const playersCollection = collection(firestore, 'players');
      const querySnapshot = await getDocs(playersCollection);
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      console.log('Players Data:', data);
      setPlayersData(data);
    };

    fetchPlayersData();
  }, []);

  useEffect(() => {
    const fetchTeamPlayers = async () => {
      if (selectedTeam) {
        const playersCollection = collection(firestore, 'players');
        const q = query(playersCollection, where('teamId', '==', selectedTeam.id));
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTeamPlayers(data);
      }
    };
  
    fetchTeamPlayers();
  }, [selectedTeam]);

  const handleTeamSelect = (team) => {
    console.log("Team selected:", team);
    setSelectedTeam(team);
  };

  const handleSearchConfirm = useCallback((columns) => {
    setSelectedColumns(columns);
  }, []);
  useEffect(() => {
    const paginatedPlayers = applyPagination(selectedTeam ? teamPlayers : playersData, page, rowsPerPage);
  
    console.log('Paginated Players:', paginatedPlayers);
  }, []); // 这里传递一个空数组作为依赖项
  

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
            <Typography variant="h4" sx={{ fontFamily: 'Montserrat sans-serif', fontWeight: 'bold' }}>
              打擊數據
            </Typography>
            {/* 添加 Manage 组件，并传递 handleTeamSelect 方法 */}
            <Manage onTeamSelect={handleTeamSelect} />
            <HitrecordSearch onConfirm={handleSearchConfirm} />
            <HitrecordTable
              items={paginatedPlayers} // 使用分页后的数据
              selectedColumns={selectedColumns}
              selected={playerSelection.selected}
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