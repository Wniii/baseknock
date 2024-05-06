
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

import { doc, getDoc } from "firebase/firestore"; // 导入doc和getDoc函数

const Page = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [playersData, setPlayersData] = useState([]);
  const [selectedColumns, setSelectedColumns] = useState([]); // 将 setSelectedColumns 添加到 Page 组件中
  const [selectedGameTypes, setSelectedGameTypes] = useState([]);
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
      // 仅当selectedTeam存在时才执行以下代码
      if (!selectedTeam) {
        console.log('未选择团队！');
        return;
      }
      
      try {
        const teamDocRef = doc(firestore, 'team', selectedTeam); // 'selectedTeam' 应该是团队文档的ID
        const teamDocSnap = await getDoc(teamDocRef);
  
        if (!teamDocSnap.exists()) {
          console.log('未检索到团队文档！');
          return;
        }
  
        const teamData = teamDocSnap.data();
        const players = teamData.players;
  
        if (players && typeof players === 'object') {
          const playerKeys = Object.keys(players);
          const playersArray = playerKeys.map((key) => ({
            p_id: key,
            ...players[key],
          }));
  
          setPlayersData(playersArray); // 设置playersData为playersArray
        } else {
          console.log('在团队文档中找不到 players 字段或者 players 不是一个对象:', selectedTeam);
        }
      } catch (error) {
        console.error("获取数据时出错: ", error);
      }
    };
  
    fetchPlayersData();
  }, [selectedTeam]); // 当selectedTeam改变时，会重新运行这个effect
  
  
  

  const handleSearchConfirm = useCallback((columns, team, gameTypes) => {
    console.log('Team received on confirm:', team); // Added log
    setSelectedColumns(columns);
    setSelectedTeam(team);
    setSelectedGameTypes(gameTypes); // Set selectedGameTypes state in the parent component
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
              selectedGameTypes={selectedGameTypes}
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
