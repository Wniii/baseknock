import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { firestore } from 'src/pages/firebase';
import { collection, getDocs, addDoc, deleteDoc, doc, setDoc, updateDoc, query, where } from 'firebase/firestore';
import { Box, Card, ListItem, ListItemIcon, List, Typography, Link, TextField, Button } from '@mui/material';
import firebase from 'firebase/app';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useAuth } from 'src/hooks/use-auth';


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


        const getCurrentUserId = async () => {
            const auth = getAuth();
            let currentUserId = null;

            onAuthStateChanged(auth, user => {
                if (user) {
                    // User is signed in.
                    currentUserId = user.uid;
                } else {
                    // User is signed out.
                    currentUserId = null;
                }
            });

            return currentUserId;
        };
        getCurrentUserId();
    }, []);

    //加入球隊欄位
    const handleAddTeam = async () => {
        try {
            if (!auth.user.id) {
                alert('無效的使用者ID');
                return;
            }
            const userRef = collection(firestore, "users");
            const q = query(userRef, where('u_id', '==', auth.user.id));
            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) {
                const userDoc = querySnapshot.docs[0];
                const teamRef = doc(firestore, "team", teamId);
                const teamDoc = await getDoc(teamRef);
                if (teamDoc.exists()) {
                    await updateDoc(userDoc.ref, {
                        u_team: firebase.firestore.FieldValue.arrayUnion(teamDoc.data().codeName)
                    });
                    alert('成功將球隊添加到使用者');
                } else {
                    alert('找不到該球隊');
                }
            } else {
                alert('找不到該用戶');
            }
        } catch (error) {
            console.error('Error adding team to user:', error);
            alert('添加球隊時出錯');
        }
    };


    useEffect(() => {
        const checkLocalStorage = () => {
            const savedUserName = localStorage.getItem('userName');
            if (savedUserName) {
                // 自動登入用戶
                setUserData({ u_name: savedUserName });
            }
        };

        checkLocalStorage();
    }, []);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                if (auth.user) {
                    // 建立查詢以獲取使用者資料
                    const q = query(collection(firestore, 'users'), where('u_id', '==', auth.user.id));
                    const querySnapshot = await getDocs(q);
                    if (!querySnapshot.empty) {
                        // 如果找到了使用者，設置使用者資料
                        querySnapshot.forEach((doc) => {
                            setUserData(doc.data());
                            setLoading(false); // 資料加載完成後設置 loading 為 false
                            localStorage.setItem('userName', doc.data().u_name);
                        });
                    } else {
                        setUserData(null); // 如果沒有找到使用者，設置使用者資料為 null
                        setLoading(false); // 資料加載完成後設置 loading 為 false

                    }
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData();
    }, [auth.user]);





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
