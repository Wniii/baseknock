import { useCallback, useState } from 'react';
import {
    Avatar,
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    Divider,
    TextField,
    Fab,
    Unstable_Grid2 as Grid
} from '@mui/material';
import { Typography } from '@mui/material';
import * as React from 'react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { useRouter } from 'next/router';
import CogIcon from '@heroicons/react/24/solid/CogIcon';



const PersonalSx = {
    backgroundColor: '#d3d3d3',
    padding: '150px',
    //borderRadius: '4px',
    height: 'auto',
    width: 'auto',
    margin: 'auto',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start', // 垂直置中
    textAlign: 'center', // 文字水平置中
    alignItems: 'center',
};



const buttonSx = {
    backgroundColor: 'd3d3d3',
    display: 'flex',
    justifyContent: 'center', // 將兩個按鈕水平置中

};



const user = {
    avatar: 'https://upload.wikimedia.org/wikipedia/zh/thumb/d/d0/JaketheDog.png/220px-JaketheDog.png',
    //city: 'Los Angeles',
    //country: 'USA',
    //jobTitle: 'Senior Developer',
    name: '臧加息',
    email: 'vivit50923@gmail.com',
    TName: '輔仁大學',
    identity: '管理者',
    //timezone: 'GTM-7'
};





export const PManage = () => {

    return (
        <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>

            <Card sx={{ ...PersonalSx, margin: 'auto' }}>
                <CardContent>


                    <Box>
                        <Avatar
                            src={user.avatar}
                            sx={{
                                height: 150,
                                width: 150,
                                mb: 3,
                                alignItems: 'center',
                                justifyContent: 'flex-start',
                                //alignContent: 'center',
                                border: '5px solid #ffffff',
                                borderRadius: '100%',
                                padding: 0,

                            }}
                        />

                        <div>
                            <Typography
                                gutterBottom
                                variant="h5"
                            >
                                {user.name}
                            </Typography>

                            <Typography
                                color="text.secondary"
                                variant="body2"
                            >
                                {user.email}
                            </Typography>
                            <br></br>
                            <Typography
                                color="text"
                                variant="h7"
                            >
                                所屬球隊：{user.TName}
                            </Typography>
                            <br></br>
                            <Typography
                                color="text"
                                variant="h7"
                            >
                                身份：{user.identity}
                            </Typography>

                        </div>
                    </Box>
                </CardContent>
                <Divider />
                <CardActions>
                    <Button
                        fullWidth
                        variant="text"
                    >
                        修改密碼
                    </Button>
                </CardActions>
            </Card>






        </div>

    );
};
