import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { firestore } from 'src/pages/firebase';
import { collection, getDocs, addDoc, deleteDoc, doc, setDoc, updateDoc, query, where, getDoc } from 'firebase/firestore';
import { Box, Card, ListItem, ListItemIcon, List, Typography, Link, TextField, Button } from '@mui/material';
import firebase from 'firebase/app';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useAuth } from 'src/hooks/use-auth';
import 'firebase/firestore';



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
    const [teamId, setTeamId] = useState('');
    const [message, setMessage] = useState('');
    const [currentUserId, setCurrentUserId] = useState('');
    const [userData, setUserData] = useState(null);
    const auth = useAuth();
    const router = useRouter();
    const [userId, setUserId] = useState(null);


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

    useEffect(() => {
        // 在组件加载时从LocalStorage中获取userId
        const storedUserId = localStorage.getItem('userId');
        if (storedUserId) {
            // 如果LocalStorage中有userId，则设置到状态变量中
            setUserId(storedUserId);
        }
    }, []);


    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setCurrentUserId(user.uid);
                localStorage.setItem('userId', auth.user.id);
            }
        });
        return () => unsubscribe();
    }, []);



    //加入球隊欄位
    const handleAddTeam = async () => {
        const userId = localStorage.getItem('userId');
        try {
            if (!userId) {
                alert('無效的使用者ID');
                return;
            }
            // 获取用户输入的球队 ID
            const teamIdTrimmed = teamId.trim(); // 删除可能存在的空格
            if (!teamIdTrimmed) {
                alert('請輸入球隊ID');
                return;
            }
            // 檢查球隊是否存在於資料庫中
            const teamRef = doc(firestore, "team", teamIdTrimmed);
            const teamDoc = await getDoc(teamRef);
            if (!teamDoc.exists()) {
                alert('找不到該球隊');
                return;
            }
            // 獲取球隊名稱
            const teamcodeName = teamDoc.data().codeName;
            // 更新用戶文檔中的 u_team 欄位，將球隊名稱添加到數組中
            const userRef = doc(firestore, "users", userId);
            await updateDoc(userRef, {
                u_team: firebase.firestore.FieldValue.arrayUnion(teamcodeName)
            }, { merge: true });
            alert('成功將球隊添加到使用者');
        }
        catch (error) {
            console.error('Error adding team to user:', error);
            alert('添加球隊時出錯');
        }
    };

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
