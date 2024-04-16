import React, { useEffect, useState } from 'react';
import { firestore } from 'src/pages/firebase';
import { collection, getDocs, addDoc, deleteDoc, doc, setDoc } from 'firebase/firestore';
import {
    Box,
    Card,
    ListItem,
    ListItemIcon,
    List,
    Typography,
    Link
} from '@mui/material';

const CurrentTeamSx = {
    backgroundColor: '#d3d3d3',
    padding: '8px',
    height: 'auto',
    width: 'auto',
    margin: 'auto',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    textAlign: 'center',
};
const ListStyle = {
    display: 'flex', // 使用Flexbox
    flexDirection: 'row', // 子元素水平排列
    padding: 0, // 可以根据需要调整
    margin: 0 // 可以根据需要调整
};

const ListItemStyle = {
    display: 'flex', // 使用Flexbox
    justifyContent: 'center', // 水平居中对齐
    alignItems: 'center', // 垂直居中对齐
    margin: '8px' // 为每个项添加外边距
};

export const Manage = ({ onTeamSelect }) => {
    const [teams, setTeams] = useState([]);

    useEffect(() => {
        const fetchTeams = async () => {
            const querySnapshot = await getDocs(collection(firestore, "team"));
            const teamsArray = [];
            querySnapshot.forEach((doc) => {
                teamsArray.push({ id: doc.id, ...doc.data() });
            });
            setTeams(teamsArray);
        };

        fetchTeams();
    }, []);

    return (
        <div>
            <form>
                <div style={{ textAlign: 'left', padding: '8px' }}>
                    <Typography variant="h6">目前球隊（可點選更改）</Typography>
                </div>

                <Card sx={CurrentTeamSx}>
                    <List style={ListStyle}>
                        {teams.map((team) => (
                            <ListItem key={team.id} style={{ display: 'flex' }} onClick={() => onTeamSelect(team)}>
                                <Box>
                                    <ListItemIcon style={{ margin: 'auto' }}>
                                        <Link /* ... */>
                                            <img src={team.photo} alt="icon" style={{ width: '100px', height: '100px' }} />
                                            <br></br>
                                            {team.Name}
                                        </Link>
                                    </ListItemIcon>
                                </Box>
                            </ListItem>
                        ))}
                    </List>
                </Card>
                <br></br>
            </form>
        </div>
    );
};
