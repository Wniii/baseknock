// import React from 'react';
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
import * as React from 'react';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import { useMediaQuery } from '@mui/material';



const CurrentTeamSx = {
    backgroundColor: '#ffffff',
    padding: '8px',
    //borderRadius: '4px',
    height: 'auto',
    width: 'auto',
    margin: 'auto',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center', // 垂直置中
    textAlign: 'center', // 文字水平置中
};




const buttonSx = {
    backgroundColor: 'd3d3d3',
    display: 'flex',
    justifyContent: 'center', // 將兩個按鈕水平置中

};



export const ManagePlayer = () => {
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

    return (
        <div>

            <form
                autoComplete="off"
                noValidate
                onSubmit={handleSubmit}
            >

                <div style={{ textAlign: 'left', padding: '8px' }}>
                    <Typography variant="h6">球員名單</Typography>
                </div>

                <Card sx={CurrentTeamSx}>
                    {/* <List>
                        <ListItem style={{ display: 'flex' }}>
                            <ListItemIcon style={{ marginRight: '50px' }}>
                                <a href='/Users/tsang/Desktop/test/src/sections/overview/overview-latest-orders.js'>
                                    <img src="https://upload.wikimedia.org/wikipedia/zh/thumb/d/da/Fu_Jen_Catholic_University_logo.svg/640px-Fu_Jen_Catholic_University_logo.svg.png" alt="icon" style={{ width: '100px', height: '100px' }} />
                                </a>
                            </ListItemIcon>
                            <ListItemIcon>
                                <a href='/Users/tsang/Desktop/test/src/sections/overview/overview-latest-orders.js'>
                                    <img src="https://i1.sndcdn.com/avatars-WHnH0JLI2cyztR1r-yKwKmA-t240x240.jpg" alt="icon" style={{ width: '100px', height: '100px' }} />
                                </a>
                            </ListItemIcon>
                        </ListItem>
                    </List> */}
                    <List>
                        <ImageList variant="standard" cols={cols} gap={8}>
                            {itemData.map((item) => (
                                <ImageListItem key={item.img} sx={{ width: '100px', height: '50px' }}>
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
                    </List>
                </Card>
                <br></br>
            </form>
        </div>

    );
};
const itemData = [
    {
        img: 'https://images.unsplash.com/photo-1549388604-817d15aa0110',
        title: 'Bed',
        author: '06嚕嚕',
    },
    {
        img: 'https://images.unsplash.com/photo-1525097487452-6278ff080c31',
        title: 'Books',
        author: '07瑋柔',
    },
    {
        img: 'https://images.unsplash.com/photo-1523413651479-597eb2da0ad6',
        title: 'Sink',
        author: '10加息',
    },
    {
        img: 'https://images.unsplash.com/photo-1563298723-dcfebaa392e3',
        title: 'Kitchen',
        author: '45俊宇',
    },
    {
        img: 'https://images.unsplash.com/photo-1588436706487-9d55d73a39e3',
        title: 'Blinds',
        author: '69資提',
    },
    {
        img: 'https://images.unsplash.com/photo-1574180045827-681f8a1a9622',
        title: 'Chairs',
        author: '72文尼',
    },
    {
        img: 'https://images.unsplash.com/photo-1530731141654-5993c3016c77',
        title: 'Laptop',
        author: '80 XX',
    },
    {
        img: 'https://images.unsplash.com/photo-1481277542470-605612bd2d61',
        title: 'Doors',
        author: 'Philipp Berndt',
    },
    {
        img: 'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7',
        title: 'Coffee',
        author: 'Jen P.',
    },
    {
        img: 'https://images.unsplash.com/photo-1516455207990-7a41ce80f7ee',
        title: 'Storage',
        author: 'Douglas Sheppard',
    },
    {
        img: 'https://images.unsplash.com/photo-1597262975002-c5c3b14bbd62',
        title: 'Candle',
        author: 'Fi Bell',
    },
    {
        img: 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4',
        title: 'Coffee table',
        author: 'Hutomo Abrianto',
    },
];