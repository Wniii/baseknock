import Head from 'next/head';
import { Box, Container, Stack, Typography, Unstable_Grid2 as Grid, Divider } from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { Manage } from 'src/sections/manage/manage-details';
import { ManageProfile } from 'src/sections/manage/manage-profile';
import { ManageProfileDetails } from 'src/sections/manage/manage-profile-details';
import { ManagePlayer } from 'src/sections/manage/manage-player';


const Page = () => (
    <>
        <Head>
            <title>
                管理
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
                        <Grid
                            container
                            spacing={3}
                        >
                            <Grid
                                xs={12}
                                md={12}
                                lg={12}
                            >
                                <Manage />
                            </Grid>
                        </Grid>
                        <br></br>
                        <div>
                            <Typography variant="h4">
                                管理球隊
                            </Typography>
                        </div>
                        <Divider />
                        <br></br>
                        <Grid
                            container
                            spacing={3}

                        >
                            <Grid
                                xs={12}
                                md={6}
                                lg={4}
                                sx={{ justifyContent: 'center' }}
                            >
                                <ManageProfile />
                            </Grid>
                            <Grid
                                xs={12}
                                md={6}
                                lg={8}
                            >
                                <ManageProfileDetails />
                            </Grid>
                            <Grid
                                xs={12}
                                md={12}
                                lg={12}
                            >
                                <ManagePlayer />
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
