import Head from "next/head";
import { useRouter } from 'next/router'; // 导入 useRouter hook
import { Box, Container, Stack, Typography, Unstable_Grid2 as Grid } from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { AccountProfile } from "src/sections/data/account-profile";
import { EditGame } from "src/pages/edit-game-form";

const Page = () => {
  const router = useRouter(); // 使用 useRouter hook 获取路由器实例
  const { g_id } = router.query; // 从路由参数中获取 g_id

  return (
    <>
      <Head>
        <title>Account | Devias Kit</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth="lg">
          <Stack spacing={3}>
            <div>
              <Typography variant="h4">編輯比賽</Typography>
            </div>
            <div>
              <Grid container spacing={3}>
                <Grid xs={12} md={6} lg={12}>
                  {/* 将 g_id 作为属性传递给 EditGame 子组件 */}
                  <EditGame g_id={g_id} />
                </Grid>
              </Grid>
            </div>
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
