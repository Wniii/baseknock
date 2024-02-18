import Head from "next/head";
import { Box, Container, Stack, Typography } from "@mui/material";
import { ScoreAndError } from "src/sections/derecord/score-and-error";
import { PitcherRecord } from "src/sections/derecord/pitcher-record";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";

const Page = () => (
  <>
    <Head>
      <title>Settings | Devias Kit</title>
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
          <Typography variant="h4">防守紀錄</Typography>
          <ScoreAndError />
          <PitcherRecord />
        </Stack>
      </Container>
    </Box>
  </>
);

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
