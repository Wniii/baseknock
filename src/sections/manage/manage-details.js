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
    display: 'flex', // Keep using Flexbox
    flexDirection: 'row', // Keep child elements in a row
    padding: 0, // Adjust as needed
    margin: 0, // Adjust as needed
    justifyContent: 'flex-start' // Align items to the left side
};

const ListItemStyle = {
    display: 'flex', // Keep using Flexbox
    justifyContent: 'flex-start', // Align items to the left side
    alignItems: 'center', // Keep vertical center alignment
    margin: '1px' // Minimize space between items, adjust as needed
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
        const fetchTeam = async () => {
            const userTeamCodeNameString = localStorage.getItem('userTeam'); // 從localStorage中獲取代碼名稱
            if (userTeamCodeNameString) {
                const userTeamCodeNames = userTeamCodeNameString.split(','); // 使用逗號分隔字符串，轉成數組
                const teamsData = [];

                for (const codeName of userTeamCodeNames) {
                    const q = query(collection(firestore, "team"), where("codeName", "==", codeName.trim()));
                    const querySnapshot = await getDocs(q);
                    querySnapshot.forEach((doc) => {
                        teamsData.push({ id: doc.id, ...doc.data() });
                    });
                }

                if (teamsData.length > 0) {
                    setTeams(teamsData); // 將所有找到的團隊設置到狀態中
                } else {
                    console.log("No such team!");
                    alert('找不到對應的球隊');
                }
            }
        };

        fetchTeam();
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
    console.log()

    //加入球隊欄位
    const handleAddTeam = async () => {
        console.log("Starting handleAddTeam...");

        const userId = localStorage.getItem('userId');
        console.log("userId:", userId);

        try {
            if (!userId) {
                alert('無效的使用者ID');
                return;
            }
            const teamIdTrimmed = teamId.trim(); // 刪除可能存在的空格
            console.log("teamIdTrimmed:", teamIdTrimmed);

            if (!teamIdTrimmed) {
                alert('請輸入球隊ID');
                return;
            }
            const teamRef = doc(firestore, "team", teamIdTrimmed);
            console.log("teamRef:", teamRef);
            const teamDoc = await getDoc(teamRef);
            console.log("teamDoc:", teamDoc);

            if (!teamDoc.exists()) {
                alert('找不到該球隊');
                return;
            }

            const teamcodeName = teamDoc.data().codeName;
            console.log("teamcodeName:", teamcodeName);

            const userRef = doc(firestore, "users", userId);
            console.log("userRef:", userRef);

            // 獲取當前用戶的文檔
            const userDoc = await getDoc(userRef);
            let userDocData = userDoc.data();

            // 如果用戶文檔不存在或者 u_team 欄位不存在，初始化為一個空陣列
            if (!userDoc.exists() || !userDocData.u_team) {
                userDocData.u_team = [];
            }

            // 使用 push 方法將新的值添加到陣列的末尾
            userDocData.u_team.push(teamcodeName);

            // 更新用戶文檔中的 u_team 欄位為新的陣列
            await updateDoc(userRef, {
                u_team: userDocData.u_team

            }, { merge: true });

            console.log("Team added to user successfully.");

            alert('已成功加入球隊！請重新登入以重整頁面');
        } catch (error) {
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
                            <ListItem sx={ListItemStyle} key={team.id} style={{ display: 'flex' }} onClick={() => onTeamSelect(team)}>
                                <Box>
                                    <ListItemIcon style={{ margin: 'auto' }}>
                                        <Link style={{ margin: '0px' }}>
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
