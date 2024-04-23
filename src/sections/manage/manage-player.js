import React, { useState, useEffect } from 'react';
import { firestore } from 'src/pages/firebase'; // 确保路径正确
import { doc, deleteDoc, updateDoc, deleteField, setDoc } from 'firebase/firestore';
import {
  useMediaQuery,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Card,
  List,
  Button,
  TextField,
  Typography,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  DialogContentText
} from '@mui/material';

const CurrentTeamSx = {
    backgroundColor: '#ffffff',
    padding: '8px',
    height: 'auto',
    width: 'auto',
    margin: 'auto',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    textAlign: 'center'
};

const positionOptions = [
    // 定义守備位置选项
    { value: '', label: '' },
    { value: 'P', label: 'P' },
    { value: 'C', label: 'C' },
    { value: '1B', label: '1B' },
    { value: '2B', label: '2B' },
    { value: '3B', label: '3B' },
    { value: 'SS', label: 'SS' },
    { value: 'LF', label: 'LF' },
    { value: 'CF', label: 'CF' },
    { value: 'RF', label: 'RF' }
];

const habitOptions = [
    // 定义投打习惯选项
    { value: '', label: '' },
    { value: 'LL', label: '左投/左打' },
    { value: 'LR', label: '左投/右打' },
    { value: 'RR', label: '右投/右打' },
    { value: 'RL', label: '右投/左打' }
];

export const ManagePlayer = ({ teamInfo }) => {
    const [playerKeys, setPlayerKeys] = useState([]);
    const [openAddPlayerDialog, setOpenAddPlayerDialog] = useState(false);
    const [newPlayerName, setNewPlayerName] = useState('');
    const [newPlayerNumber, setNewPlayerNumber] = useState('');
    const [newPlayerPosition, setNewPlayerPosition] = useState('');
    const [newPlayerHabit, setNewPlayerHabit] = useState('');
    const [selectedTeamInfo, setSelectedTeamInfo] = useState(null); // 新增状态来保存选择的球队信息

    const [openDialog, setOpenDialog] = useState(false);
    const [selectedPlayer, setSelectedPlayer] = useState(null);
    const [dialogTitle, setDialogTitle] = useState('');

    

    useEffect(() => {


        if (teamInfo && teamInfo.players) {
            const keys = Object.keys(teamInfo.players);
            setPlayerKeys(keys);
        }
    }, [teamInfo]);


    const handleOpenAddPlayerDialog = (teamInfo) => {
        setSelectedTeamInfo(teamInfo); // 设置选定的球队信息
        setOpenAddPlayerDialog(true);
        console.log('Selected Team Info:', teamInfo); // 打印选定的球队信息
    };
    
    const handleCloseAddPlayerDialog = () => {
        setOpenAddPlayerDialog(false);
        console.log('Add player dialog closed'); // 打印对话框关闭信息
    };
    
    const handleAddPlayer = async (teamInfo) => {
        try {
          const teamRef = doc(firestore, 'team', teamInfo.id);
          
          // 構造要添加的新球員數據
          const newPlayerData = {
            PNum: newPlayerNumber,
            habit: newPlayerHabit,
            position: newPlayerPosition
          };
          
          // 將新球員數據添加到球隊集合中的 players 欄位
          await setDoc(teamRef, { players: { ...teamInfo.players, [newPlayerName]: newPlayerData } }, { merge: true });
          
          // 更新選定的球隊信息
          const updatedPlayers = {
            ...teamInfo.players,
            [newPlayerName]: newPlayerData
          };
          const updatedTeamInfo = { ...teamInfo, players: updatedPlayers };
          setSelectedTeamInfo(updatedTeamInfo);
          
          // 重置輸入框的值
          setNewPlayerName('');
          setNewPlayerNumber('');
          setNewPlayerPosition('');
          setNewPlayerHabit('');
          
          // 關閉對話框
          handleCloseAddPlayerDialog();
          
          console.log('Player added successfully');
        } catch (error) {
          console.error('Error adding player:', error);
          
          console.log('Player data:', {
            PName: newPlayerName,
            PNum: newPlayerNumber,
            position: newPlayerPosition,
            habit: newPlayerHabit
          });
        }
      };
      
    

    const isLargeScreen = useMediaQuery('(min-width:600px)');
    const isMediumScreen = useMediaQuery('(min-width:400px)');
    let cols = isLargeScreen ? 8 : (isMediumScreen ? 3 : 2);

    const handleDelete = (key) => {
        const teamRef = doc(firestore, `team/${teamInfo.id}`);
    
        // Prepare the update object to remove the player key using deleteField
        const updates = {};
        updates[`players.${key}`] = deleteField();
    
        updateDoc(teamRef, updates)
            .then(() => {
                console.log(`Player with key ${key} successfully deleted from the document.`);
                // 更新本地状态以反映更改
                const updatedKeys = playerKeys.filter(k => k !== key);
                setPlayerKeys(updatedKeys);
            })
            .catch(error => {
                console.error('Error removing player: ', error);
            });
    };
    
    // 根据获取的 player 键名生成 itemData
    const itemData = playerKeys.map(key => ({
        img: 'https://img.lovepik.com/png/20231027/Dark-gray-simple-avatar-grey-silhouette-placeholder_369196_wh860.png',
        title: key,
        author: key
    }));

    const handleClick = (player) => {
        const playerData = teamInfo.players[player.title]; // 获取点击球员的完整信息
        setSelectedPlayer(playerData); // 设置选定的球员信息
        setDialogTitle(player.author);
        setOpenDialog(true); // 打开对话框
    };
    
    

    // 关闭对话框
    const handleCloseDialog = () => {
        setOpenDialog(false);
    };



    return (
        <div>
            <Typography variant="h6" style={{ textAlign: 'left', padding: '8px' }}>球員名單</Typography>
            <Card>
            <List>
                <ImageList variant="standard" cols={cols} gap={8}>
                    {itemData.map((item) => (
                        <ImageListItem key={item.img} sx={{ width: '100px', height: '50px', marginLeft: '16px' }} onClick={() => handleClick(item)}>
                            <img src={`${item.img}?w=248&fit=crop&auto=format`} alt={item.title} loading="lazy"/>
                            <ImageListItemBar position="below" title={item.author} sx={{ textAlign: 'center' }} />
                            <Button onClick={() => handleDelete(item.title)}>刪除</Button>
                        </ImageListItem>
                    ))}
                </ImageList>
            </List>
            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>{dialogTitle}</DialogTitle>
                <DialogContent>
                    {selectedPlayer && (
                        <DialogContentText>
                            背號: {selectedPlayer.PNum}<br/>
                            投打習慣: {selectedPlayer.habit}<br/>
                            守備位置: {selectedPlayer.position}<br/>
                        </DialogContentText>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>關閉</Button>
                </DialogActions>
            </Dialog>
        </Card>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
            <Button variant="contained" color="primary" onClick={() => handleOpenAddPlayerDialog(teamInfo)}>新增球員</Button>
        </div>
            <Dialog open={openAddPlayerDialog} onClose={handleCloseAddPlayerDialog}>
                <DialogTitle>新增球員</DialogTitle>
                <DialogContent>
                    <TextField autoFocus margin="dense" label="球員姓名" fullWidth variant="standard" value={newPlayerName} onChange={(e) => setNewPlayerName(e.target.value)} />
                    <TextField margin="dense" label="背號" fullWidth variant="standard" value={newPlayerNumber} onChange={(e) => setNewPlayerNumber(e.target.value)} />
                    <FormControl fullWidth margin="normal">
                        <InputLabel>守備位置</InputLabel>
                        <Select value={newPlayerPosition} onChange={(e) => setNewPlayerPosition(e.target.value)} label="守備位置">
                            {positionOptions.map((option) => (
                                <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl fullWidth margin="normal">
                        <InputLabel>投打習慣</InputLabel>
                        <Select value={newPlayerHabit} onChange={(e) => setNewPlayerHabit(e.target.value)} label="投打習慣">
                            {habitOptions.map((option) => (
                                <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseAddPlayerDialog}>取消</Button>
                    <Button onClick={() => handleAddPlayer(teamInfo)}>新增</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};
