import Head from 'next/head';
import { Box, Container, Stack, Typography, Unstable_Grid2 as Grid, Divider } from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { Calendar } from 'src/sections/schedule/schedule-calendar';



const Page = () => (
    <>
        <Head>
            <title>
                賽程表
            </title>
        </Head>
        <Box
            component="main"
            sx={{
                flexGrow: 1,
                py: 0
            }}
        >
            <Container maxWidth="lg">
                <Stack spacing={3}>
                    <div>
                        <Typography variant="h4">
                            賽程表
                        </Typography>
                    </div>
                    <Divider />
                    <div>
                        <Grid
                            container
                            spacing={3}
                        >

                            <Grid
                                xs={12}
                                md={12}
                                lg={12}
                            >
                                <Calendar />
                            </Grid>
                        </Grid>
                    </div>
                </Stack>
            </Container>

        </Box>
    </>
);

Page.getLayout = (page) => (
    <DashboardLayout>
        {page}
    </DashboardLayout>
);

export default Page;
