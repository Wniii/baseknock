import React, { useState, useEffect } from 'react';
import { firestore } from 'src/firebase'; // 确保路径正确
import { doc, deleteDoc, updateDoc, deleteField, setDoc } from 'firebase/firestore';
import {
    Box,
    Grid,
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
    DialogContentText,
    Input
} from '@mui/material';
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from '@mui/icons-material/Close';



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
    { value: '左投/左打', label: '左投/左打' },
    { value: '左投/右打', label: '左投/右打' },
    { value: '右投/右打', label: '右投/右打' },
    { value: '右投/左打', label: '右投/左打' }
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

    const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
    const [playerToDelete, setPlayerToDelete] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [showOtherDialog, setShowOtherDialog] = useState(true);

    const handleIconButtonClick = () => {
        setEditMode(!editMode);
        setShowOtherDialog(false); // 点击 IconButton 时暂停其他对话框的触发
    };
    const handleDialogClose = () => {
        setShowOtherDialog(true); // 在关闭对话框时恢复其他对话框的触发
    };



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
            window.location.reload();
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


    const handleDelete = (key, event) => {
        event.stopPropagation();
        setPlayerToDelete(key);
        setConfirmDeleteOpen(true);
    };

    const confirmDelete = async () => {
        const teamRef = doc(firestore, `team/${teamInfo.id}`);
        const updates = { [`players.${playerToDelete}`]: deleteField() };

        try {
            await updateDoc(teamRef, updates);
            console.log(`Player ${playerToDelete} successfully deleted.`);
            setPlayerKeys(playerKeys.filter(k => k !== playerToDelete));
            setConfirmDeleteOpen(false);
        } catch (error) {
            console.error('Error removing player: ', error);
        }
    };

    const cancelDelete = () => {
        setConfirmDeleteOpen(false);
    };


    // 根据获取的 player 键名生成 itemData
    const itemData = playerKeys.map(key => ({
        title: key,
        author: key
    }));

    const handleClick = (player) => {
        const playerData = teamInfo.players[player.title]; // 获取点击球员的完整信息

        if (!editMode) {
            setOpenDialog(true);
            setSelectedPlayer(playerData);
            setDialogTitle(player.author);

        }
    };

    // 关闭对话框
    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const handleUpdatePlayer = async () => {
        if (!selectedPlayer || !teamInfo || !teamInfo.id) {
            console.error("Missing team or player information.");
            return;
        }

        const playerKey = dialogTitle; // Assuming the dialogTitle is the player key, adjust as necessary
        const teamRef = doc(firestore, 'team', teamInfo.id);
        const playerPath = `players.${playerKey}`; // The path to the player in the Firestore document

        // Create the update object
        const playerUpdate = {
            [`${playerPath}.PNum`]: selectedPlayer.PNum,
            [`${playerPath}.position`]: selectedPlayer.position,
            [`${playerPath}.habit`]: selectedPlayer.habit
        };

        try {
            await updateDoc(teamRef, playerUpdate);
            console.log("Player updated successfully:", playerKey);
            alert("修改成功！");
            window.location.reload();  // 刷新页面

        } catch (error) {
            console.error("Error updating player:", error);
        }

        handleCloseDialog(); // Close the dialog after updating
    };



    return (
        <div>
            <Box display="flex" alignItems="center">
                <Typography variant="h6" style={{ textAlign: 'left', padding: '8px' }}>
                    球員名單
                </Typography>
                <IconButton
                    sx={{
                        padding: "5px",
                        "& .MuiSvgIcon-root": { fontSize: "1rem" },
                    }}
                    onClick={() => setEditMode(!editMode)}
                    color="primary"
                >
                    <EditIcon />
                </IconButton>
            </Box>
            <Card>

                <List>
                    <ImageList variant="standard" cols={cols} gap={8}>
                        {itemData.map((item) => (
                            <ImageListItem key={item.title} sx={{ width: '100px', height: '50px', marginLeft: '16px' }} onClick={() => handleClick(item)}>
                                <ImageListItemBar
                                    position="below"
                                    title={item.author}
                                    sx={{ textAlign: 'center', cursor: 'pointer' }}
                                    onClick={() => handleClick(item)}
                                />
                                {editMode && (
                                    <IconButton
                                        onClick={(event) => handleDelete(item.title, event)}
                                        color="error"
                                        aria-label="delete team"
                                        sx={{
                                            position: "absolute", // 绝对定位
                                            top: 6, // 顶部
                                            right: 0, // 右边
                                            padding: "3px", // 更小的内边距
                                            "& .MuiSvgIcon-root": { fontSize: "1rem" }, // 调整图标大小
                                            backgroundColor: "rgba(255, 255, 255, 0.7)", // 半透明背景增加可见性
                                        }}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                )}
                            </ImageListItem>
                        ))}
                    </ImageList>
                </List>
                <Dialog open={openDialog} onClose={handleCloseDialog}>
                    <DialogTitle>
                        {dialogTitle}
                        <DialogActions>
                            <Button onClick={handleCloseDialog} style={{ position: 'absolute', right: 2, top: 5 }}>
                                <CloseIcon />
                            </Button>
                        </DialogActions>
                    </DialogTitle>
                    <DialogContent>
                        {selectedPlayer && (
                            <>
                                <TextField margin="dense" label="背號" fullWidth variant="standard" value={selectedPlayer.PNum} onChange={e => setSelectedPlayer({ ...selectedPlayer, PNum: e.target.value })} />
                                <FormControl fullWidth margin="normal">
                                    <InputLabel>守備位置</InputLabel>
                                    <Select value={selectedPlayer.position} onChange={e => setSelectedPlayer({ ...selectedPlayer, position: e.target.value })} label="守備位置">
                                        {positionOptions.map((option) => (
                                            <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>

                                <FormControl fullWidth margin="normal">
                                    <InputLabel>投打習慣</InputLabel>
                                    <Select value={selectedPlayer.habit} onChange={e => setSelectedPlayer({ ...selectedPlayer, habit: e.target.value })} label="投打習慣">
                                        {habitOptions.map((option) => (
                                            <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </>
                        )}
                    </DialogContent>
                    <DialogActions >
                        <Button onClick={handleUpdatePlayer}>確認修改</Button>
                    </DialogActions>
                </Dialog>
                <Dialog open={confirmDeleteOpen} onClose={cancelDelete}>
                    <DialogTitle>確認刪除</DialogTitle>
                    <DialogContent>
                        <DialogContentText>您確定要刪除這位球員嗎？</DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={cancelDelete}>取消</Button>
                        <Button onClick={confirmDelete} color="error">確認</Button>
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