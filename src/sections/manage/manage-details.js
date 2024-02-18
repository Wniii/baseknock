import React from 'react';
import { useCallback, useState } from 'react';
import {

    Box,
    Button,
    Card,
    ListItem,
    ListItemIcon,
    ListItemText,
    CardActions,
    CardContent,
    CardHeader,
    Divider,
    TextField,
    Unstable_Grid2 as Grid,
    List
} from '@mui/material';

import { Typography } from '@mui/material';
import { CardActionArea, CardMedia } from '@mui/material';
import Link from '@mui/material/Link';
import { SvgIcon } from '@mui/material';
import ChartBarIcon from '@heroicons/react/24/solid/ChartBarIcon';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import { useMediaQuery } from '@mui/material';






const hometeam = [

    {
        value: 'fju',
        label: '輔仁大學'
    },
    {
        value: 'kpbl',
        label: '卡皮巴拉'
    }
];

const awayteam = [
    {
        value: 'fju',
        label: '輔仁大學'
    },
    {
        value: 'kpbl',
        label: '卡皮巴拉'
    }
];

const gName = [
    {
        value: 'friendly',
        label: '友誼賽'
    },
    {
        value: 'ubl',
        label: '大專盃'
    },
    {
        value: 'mei',
        label: '梅花旗'
    }
];
const label = [
    {
        value: 'top8',
        label: '八強賽'
    },
    {
        value: 'top4',
        label: '四強賽'
    },
    {
        value: 'champ',
        label: '冠亞賽'
    },
    {
        value: 'others',
        label: '其他'
    }
];

const CurrentTeamSx = {
    backgroundColor: '#d3d3d3',
    padding: '8px',
    //borderRadius: '4px',
    height: 'auto',
    width: 'auto',
    margin: 'auto',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between', // 垂直置中
    textAlign: 'center', // 文字水平置中
};
const TeamSx = {
    backgroundColor: '#d3d3d3',
    padding: '8px',
    //borderRadius: '4px',
    height: 'auto',
    width: 'auto',
    margin: 'auto',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between', // 垂直置中
    textAlign: 'center', // 文字水平置中
};



const buttonSx = {
    backgroundColor: 'd3d3d3',
    display: 'flex',
    justifyContent: 'center', // 將兩個按鈕水平置中

};

const preventDefault = (event) => event.preventDefault();



export const Manage = () => {
    const [values, setValues] = useState({
        GDate: '',
        GTime: '',
        // hometeam: '',
        // awayteam: '',
        // gName: '',
        coach: '',
        recorder: '',
        // label: '',
        remark: '',

    });

    const handleChange = useCallback(
        (event) => {
            setValues((prevState) => ({
                ...prevState,
                [event.target.name]: event.target.value
            }));
        },
        []
    );

    const handleSubmit = useCallback(
        (event) => {
            event.preventDefault();
        },
        []
    );

    const isLargeScreen = useMediaQuery('(min-width:600px)');
    const isMediumScreen = useMediaQuery('(min-width:400px)');

    let cols = 3; // 預設列數

    if (isLargeScreen) {
        cols = 8; // 大螢幕時的列數
    } else if (isMediumScreen) {
        cols = 3; // 中等螢幕時的列數
    }

    // const items = [
    //     {
    //       title: '首頁',
    //       path: '/',
    //       icon: (
    //         <SvgIcon fontSize="small">
    //           <ChartBarIcon />
    //         </SvgIcon>
    //       )
    //     },
    // ]

    return (
        <div>

            <form
                autoComplete="off"
                noValidate
                onSubmit={handleSubmit}
            >

                <div style={{ textAlign: 'left', padding: '8px' }}>
                    <Typography variant="h6">目前球隊（可點選更改）</Typography>
                </div>

                <Card sx={CurrentTeamSx}>
                    <List>
                        <ListItem style={{ display: 'flex' }}>
                            <Box
                                sx={{
                                    typography: 'body1',
                                    '& > :not(style) ~ :not(style)': {
                                        ml: 2,
                                    },
                                }}
                                onClick={preventDefault}
                            >
                                <ListItemIcon style={{ margin: 'auto' }}>
                                    <Link href='/Users/tsang/Desktop/test/src/sections/overview/overview-latest-orders.js' align='center' color="inherit" underline="hover">
                                        <img src="https://upload.wikimedia.org/wikipedia/zh/thumb/d/da/Fu_Jen_Catholic_University_logo.svg/640px-Fu_Jen_Catholic_University_logo.svg.png" alt="icon" style={{ width: '100px', height: '100px' }} />
                                        <br></br>
                                        {'輔仁大學'}
                                    </Link>
                                </ListItemIcon>
                                <ListItemIcon>
                                    <Link href='/Users/tsang/Desktop/test/src/sections/overview/overview-latest-orders.js' align='center' color="inherit" underline="hover">
                                        <img src="https://i1.sndcdn.com/avatars-WHnH0JLI2cyztR1r-yKwKmA-t240x240.jpg" alt="icon" style={{ width: '100px', height: '100px' }} />
                                        <br></br>
                                        {'卡皮巴拉'}
                                    </Link>
                                </ListItemIcon>
                            </Box>
                        </ListItem>
                    </List>

                    {/* <List>
                        <ImageList variant="standard" cols={cols} gap={8}>
                            {itemData.map((item) => (
                                <ImageListItem key={item.img} sx={{ width: '100px', height: '50px', margin: 'auto', top: '10px' }}>
                                   
                                        
                                        <img
                                            srcSet={`${item.img}?w=248&fit=crop&auto=format&dpr=2 2x`}
                                            src={`${item.img}?w=248&fit=crop&auto=format`}
                                            alt={item.title}
                                            loading="lazy"
                                        />
                                        
                                    <ImageListItemBar position="below" title={item.author} />
                                </ImageListItem>
                            ))}
                        </ImageList>
                    </List> */}
                </Card>
                <br></br>




            </form>
        </div>

    );
};

// const itemData = [
//     {
//         img: 'https://upload.wikimedia.org/wikipedia/zh/thumb/d/da/Fu_Jen_Catholic_University_logo.svg/640px-Fu_Jen_Catholic_University_logo.svg.png',
//         title: 'Bed',
//         author: '輔仁大學',

//     },
//     {
//         img: 'https://i1.sndcdn.com/avatars-WHnH0JLI2cyztR1r-yKwKmA-t240x240.jpg',
//         title: 'Books',
//         author: '卡皮巴拉',
//     }
// ]