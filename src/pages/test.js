import { useCallback, useState, useEffect, useMemo } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Box, Container, Stack, Typography } from '@mui/material';  // 移除了 TableComponent 的導入
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import AwayCustomersTable from 'src/sections/customer/awaycustomers-table';
import CustomersTable from 'src/sections/customer/customers-table';
import { Score } from 'src/sections/gamerecord/Score';
import { doc, getDoc, collection } from 'firebase/firestore';
import { firestore } from './firebase'; // 你的 Firebase 配置和初始化


const Page = () => {
  const router = useRouter();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const { codeName, timestamp, teamId } = router.query; // 从路由参数获取值
  const [outs, setOuts] = useState(0);
  const [gameDocSnapshot, setGameDocSnapshot] = useState(null);

  useEffect(() => {
    const fetchGames = async () => {
      if (!teamId || !timestamp) {
        return; // 如果没有提供团队文档ID或游戏文档ID，直接返回
      }

      console.log('Fetching games...');

      try {
        // 获取指定团队文档
        const teamDocRef = doc(firestore, "team", teamId);
        const teamDocSnapshot = await getDoc(teamDocRef);

        if (teamDocSnapshot.exists()) {
          console.log("Team document ID:", teamId);

          // 获取指定团队文档中的游戏子集合
          const gamesCollectionRef = collection(teamDocSnapshot.ref, "games");

          // 获取指定游戏文档
          const gameDocRef = doc(gamesCollectionRef, timestamp);
          const gameDocSnapshot = await getDoc(gameDocRef);

          if (gameDocSnapshot.exists()) {
            console.log("Game document ID:", timestamp);
            console.log("Game data:", gameDocSnapshot.data());

            // 假设游戏数据中有一个名为 'outs' 的字段
            const gameData = gameDocSnapshot.data();
            const newOuts = gameData.outs || 0; // 确保 outs 有个默认值
            setOuts(newOuts); // 更新状态
          } else {
            console.log("No matching game document with ID:", timestamp);
          }
        } else {
          console.log("No team document found with ID:", teamId);
        }
      } catch (error) {
        console.error("Error fetching games:", error);
      }
    };

    fetchGames();
  }, [teamId, timestamp]);



  // console.log("code111",codeName)
  // console.log("111",timestamp)
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


  // 定義每個範圍對應的表格類型
  const renderTableComponent = () => {
    const numericOuts = Number(outs); // 確保outs是一個數字
    const tableComponents = [AwayCustomersTable, CustomersTable];
    const rangeIndex = Math.floor(numericOuts / 3) % 2;

    // 確保選擇的組件在範圍內，並檢查是否為 undefined
    const TableComponent = tableComponents[rangeIndex];
    if (!TableComponent) {
      console.error('TableComponent is undefined. Check the rangeIndex and outs value:', rangeIndex, outs);
      return <div>Error: Table component not found.</div>;  // 或其他錯誤處理方式
    }


    return (
      <TableComponent
        teamId={teamId}
        timestamp={timestamp}
        codeName={codeName}
        outs={numericOuts}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        page={page}
        rowsPerPage={rowsPerPage}
      />
    );
  };

  const teamType = useMemo(() => {
    const rangeIndex = Math.floor(Number(outs) / 3) % 2;
    return rangeIndex === 0 ? "客隊" : "主隊";
  }, [outs]);
  




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
                    {teamType}
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
              codeName={codeName}
            />
            {renderTableComponent()}

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
