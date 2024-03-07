import React from 'react';
import Head from 'next/head';
import { Box, Container, Stack, Typography, Grid, Divider } from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import Calendar from 'rsuite/Calendar';
import 'rsuite/Calendar/styles/index.css';

const SchedulePage = () => {
    const newLocale = {
        sunday: 'SUN',
        monday: 'MON',
        tuesday: 'TUE',
        wednesday: 'WED',
        thursday: 'THU',
        friday: 'FRI',
        saturday: 'SAT',

    };

    return (
        <>
            <Head>
                <title>賽程表</title>
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
                            <Typography variant="h4">賽程表</Typography>
                        </div>
                        <Divider />
                        <div>
                            <Grid container spacing={3}>
                                <Grid xs={12} md={12} lg={12}>
                                    <Calendar
                                        locale={newLocale}
                                    />
                                </Grid>
                            </Grid>
                        </div>
                    </Stack>
                </Container>
            </Box>
        </>
    );
};

SchedulePage.getLayout = (page) => (
    <DashboardLayout>
        {page}
    </DashboardLayout>
);

export default SchedulePage;
