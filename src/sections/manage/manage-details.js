import React, { useEffect, useState } from 'react';
import { firestore } from 'src/pages/firebase';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { Box, Card, ListItem, ListItemIcon, List, Typography, Link, TextField, Button } from '@mui/material';
import firebase from 'firebase/app';


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
    display: 'flex',
    flexDirection: 'row',
    padding: 0,
    margin: 0
};

const ListItemStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    margin: '8px'
};

export const Manage = ({ onTeamSelect }) => {
    const [teams, setTeams] = useState([]);
    const [teamId, setTeamId] = useState('');
    const [message, setMessage] = useState('');
    const [currentUserId, setCurrentUserId] = useState(''); // 新增一個狀態來存儲當前用戶的ID

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

    const handleAddTeam = async () => {
        try {
            if (!currentUserId) {
                alert('無效的使用者ID');
                return;
            }

            const teamRef = doc(firestore, "team", teamId);
            const teamDoc = await getDocs(teamRef);
            if (!teamDoc.exists()) {
                alert('找不到該球隊');
                return;
            }

            const userRef = doc(firestore, "users", currentUserId); // 使用當前用戶的ID來查找用戶
            await updateDoc(userRef, {
                u_team: firebase.firestore.FieldValue.arrayUnion(teamDoc.data().Name)
            });
            alert('成功將球隊添加到使用者');
        } 
        catch (error) {
            console.error('Error adding team to user:', error);
            alert('添加球隊時出錯');
        }
    };

    
    const fetchCurrentUserId = async () => {
        // 假設有一個方法可以獲取當前用戶ID
        const userId = await getCurrentUserId(); // 這個方法要根據你的具體情況來實現
        setCurrentUserId(userId); // 設置當前用戶ID
    };

    useEffect(() => {
        fetchCurrentUserId(); // 獲取當前用戶ID
    }, []);

    return (
        <div>
            <form>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="h6" style={{ flex: 1 }}>目前球隊</Typography>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant="h6" style={{ textAlign: 'right' }}>
                            加入球隊：
                        </Typography>
                        <TextField
                            label="輸入球隊ID"
                            value={teamId}
                            onChange={(e) => setTeamId(e.target.value)}
                            sx={{ width: '300px', marginLeft: '8px' }}
                        />
                        <Button variant="contained" onClick={handleAddTeam}>確認</Button>
                    </div>
                    <Typography variant="body1" color={message.includes('成功') ? 'success' : 'error'}>
                        {message}
                    </Typography>
                </div>
                &nbsp;
                <Card sx={CurrentTeamSx}>
                    <List style={ListStyle}>
                        {teams.map((team) => (
                            <ListItem key={team.id} style={{ display: 'flex' }} onClick={() => onTeamSelect(team)}>
                                <Box>
                                    <ListItemIcon style={{ margin: 'auto' }}>
                                        <Link>
                                            <img src={team.icon} alt="icon" style={{ width: '100px', height: '100px' }} />
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

// 假設 getCurrentUserId 是一個可以獲取當前用戶ID的函數
const getCurrentUserId = async () => {
    // 這裡實現獲取當前用戶ID的邏輯
    // 例如，使用 Firebase 身份驗證獲取當前用戶ID
    // 或者從後端服務獲取當前用戶ID
};

export default Manage;
