import Head from 'next/head';
import { Box, Container, Stack, Typography, Unstable_Grid2 as Grid, Divider } from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { PManage } from 'src/sections/personal/p_manage';



const Page = () => (
    <>
        <Head>
            <title>
                個人介面
            </title>
        </Head>
        <Box
            component="main"
            sx={{
                flexGrow: 1,
                py: 0,
                display: 'flex',
                justifyContent: 'center', // 居中对齐
                alignItems: 'center', // 垂直居中
            
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
                                <PManage />
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
