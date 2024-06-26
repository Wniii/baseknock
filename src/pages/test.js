import { useCallback, useState, useEffect, useMemo } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Box, Container, Stack, Typography } from '@mui/material';  // 移除了 TableComponent 的導入
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import AwayCustomersTable from 'src/sections/customer/awaycustomers-table';
import CustomersTable from 'src/sections/customer/customers-table';
import { Score } from 'src/sections/gamerecord/Score';
import { doc, getDoc, collection } from 'firebase/firestore';
import { firestore } from 'src/firebase'; // 你的 Firebase 配置和初始化


const Page = () => {
  const router = useRouter();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const { codeName, timestamp, teamId, acodeName } = router.query; // 从路由参数获取值
  const [outs, setOuts] = useState(0);
  const [gameDocSnapshot, setGameDocSnapshot] = useState(null);
  const [gameData, setGameData] = useState(null);
  const [row, setRow] = useState('');
  const [column, setColumn] = useState('');

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
          }
          if (gameDocSnapshot.exists()) {
            console.log("Game document ID:", timestamp);
            console.log("Game data:", gameDocSnapshot.data());
            const gameData = gameDocSnapshot.data();
            setGameData(gameData); // 保存游戏数据状态
            // ...其他代码
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



  const getGameTypeName = (gName) => {
    switch (gName) {
      case 'ubl':
        return '大專盃';
      case 'friendly':
        return '友誼賽';
      case 'mei':
        return '梅花旗';
      case 'tao':
        return '桃園盃';
      case 'spring':
        return '春季聯賽';
      case 'beer':
        return '台啤盃';
      default:
        return '未知比賽'; // 如果 gName 不是已知值時顯示
    }
  };



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
    const numericOuts = Number(outs); // 确保 outs 是一个数字
    const tableComponents = [AwayCustomersTable, CustomersTable];
    const rangeIndex = Math.floor(numericOuts / 3) % 2;

    // 如果 outs 等于 54，则同时显示 AwayCustomersTable 和 CustomersTable
    if (numericOuts === 54) {
      return (
        <>
          <div style={{ marginBottom: '10px' }}>
            <AwayCustomersTable
              teamId={teamId}
              timestamp={timestamp}
              codeName={codeName}
              acodeName={acodeName}
              outs={numericOuts}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
              page={page}
              rowsPerPage={rowsPerPage}
              row={row}
              column={column}
            />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <CustomersTable
              teamId={teamId}
              timestamp={timestamp}
              codeName={codeName}
              acodeName={acodeName}
              outs={numericOuts}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
              page={page}
              rowsPerPage={rowsPerPage}
              row={row}
              column={column}
            />
          </div>
        </>
      );
    }

    // 否则按照原有逻辑渲染对应的表格组件
    const TableComponent = tableComponents[rangeIndex];
    if (!TableComponent) {
      console.error('TableComponent is undefined. Check the rangeIndex and outs value:', rangeIndex, outs);
      return <div>Error: Table component not found.</div>; // 或其他错误处理方式
    }

    return (
      <TableComponent
        teamId={teamId}
        timestamp={timestamp}
        codeName={codeName}
        acodeName={acodeName}
        outs={numericOuts}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        page={page}
        rowsPerPage={rowsPerPage}
        row={row}
        column={column}
      />
    );
  };


  const teamType = useMemo(() => {
    // 如果 outs 等于 54，返回 "比賽結束"
    if (outs === 54) {
      return "比賽結束";
    }
  
    const rangeIndex = Math.floor(Number(outs) / 3) % 2;
    return rangeIndex === 0 ? "客隊" : "主隊";
  }, [outs]);
  





  return (
    <>
      <Head>
        <title>
          比賽紀錄
        </title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
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
                    {gameData ? getGameTypeName(gameData.gName) : '正在加載...'}
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
                    {
                      gameData && gameData.GDate
                        ? new Date(gameData.GDate.seconds * 1000).toLocaleDateString('zh-TW', {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit'
                        })
                        : '正在加載...'
                    }
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