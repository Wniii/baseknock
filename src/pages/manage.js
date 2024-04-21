import React, { useState } from 'react'; // 确保引入了 useState
import Head from 'next/head';
import { Box, Container, Stack, Typography, Unstable_Grid2 as Grid, Divider } from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { Manage } from 'src/sections/manage/manage-details';
import { ManageProfile } from 'src/sections/manage/manage-profile';
import { ManageProfileDetails } from 'src/sections/manage/manage-profile-details';
import { ManagePlayer } from 'src/sections/manage/manage-player';

const Page = () => {
    // 在组件函数内部声明状态变量
    const [selectedTeam, setSelectedTeam] = useState(null);

    return (
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
                                    <Manage onTeamSelect={setSelectedTeam} />
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
                                    <ManageProfileDetails teamInfo={selectedTeam} />
                                </Grid>
                                <Grid
                                    xs={12}
                                    md={12}
                                    lg={12}
                                >
                                    <ManagePlayer teamInfo={selectedTeam} />
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
