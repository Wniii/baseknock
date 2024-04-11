import React, { useState, useEffect } from 'react';
import firebase from 'firebase/app';
import 'firebase/database';
import { useMediaQuery } from '@mui/material';
import { firebaseConfig } from 'src/pages/firebase'; 

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
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';

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





export const ManagePlayer = ({ teamInfo }) => {
    const [playerKeys, setPlayerKeys] = useState([]);

    useEffect(() => {
        if (teamInfo) {
            // 获取 players 下每个对象的键名
            const keys = Object.keys(teamInfo.players);
            setPlayerKeys(keys);
        }
    }, [teamInfo]);

    const isLargeScreen = useMediaQuery('(min-width:600px)');
    const isMediumScreen = useMediaQuery('(min-width:400px)');

    let cols = 3; // 預設列數

    if (isLargeScreen) {
        cols = 8; // 大螢幕時的列數
    } else if (isMediumScreen) {
        cols = 3; // 中等螢幕時的列數
    }

    const handleDelete = (key) => {
        // 刪除 Firebase 中對應的資料
        firebase.database().ref(`players/${key}`).remove()
            .then(() => {
                // 刪除成功後更新前端狀態
                const updatedKeys = playerKeys.filter(k => k !== key);
                setPlayerKeys(updatedKeys);
            })
            .catch(error => {
                console.error('Error removing document: ', error);
            });
    };

    // 根据获取的 player 键名生成 itemData
    const itemData = playerKeys.map(key => ({
        img: 'https://images.unsplash.com/photo-1549388604-817d15aa0110',
        title: key,
        author: key,
    }));

    return (
        <div>
            <form>
                <div style={{ textAlign: 'left', padding: '8px' }}>
                    <Typography variant="h6">球員名單</Typography>
                </div>
                <Card sx={CurrentTeamSx}>
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
                                    <Button onClick={() => handleDelete(item.title)}>刪除</Button>
                                </ImageListItem>
                            ))}
                        </ImageList>
                    </List>
                </Card>
                <br />
            </form>
        </div>
    );
};
