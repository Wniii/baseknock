import { useCallback, useMemo, useState, useEffect } from 'react';
import Head from 'next/head';
import { Box, Button, Container, Stack, SvgIcon, Typography } from '@mui/material';
import { useSelection } from 'src/hooks/use-selection';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { DefendTable } from 'src/sections/defendrecord/defendrecord-table';
import { DefendSelect } from 'src/sections/defendrecord/defendrecord-select';
import { applyPagination } from 'src/utils/apply-pagination';
import { collection, getDocs } from 'firebase/firestore';
import { firestore } from 'src/pages/firebase';

const now = new Date();

const Page = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [playersData, setPlayersData] = useState([]);
  const player = useMemo(() => applyPagination(playersData, page, rowsPerPage), [playersData, page, rowsPerPage]);
  const playerId = useMemo(() => player.map(player => player.id), [player]);
  const playerSelection = useSelection(playerId);

  const [selectedTeam, setSelectedTeam] = useState(null);
  const [selectedColumns, setSelectedColumns] = useState([]); // 将 setSelectedColumns 添加到 Page 组件中
  const [selectedGameType, setSelectedGameType] = useState([]);

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

  
  const handleSearchConfirm = useCallback((columns, team, gameType) => {
    setSelectedColumns(columns);
    setSelectedTeam(team);
    // 儲存所選的比賽性質
    setSelectedGameType(gameType);
  }, []);

  return (
    <>
      <Head>
        <title>
          投球數據
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
                  投球數據
                </Typography>
              </Stack>
            </Stack>
            <DefendSelect onConfirm={handleSearchConfirm}/>
            <DefendTable
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
              selectedColumns={selectedColumns}
              selectedTeam={selectedTeam}
              selectedGameType={selectedGameType} 
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
