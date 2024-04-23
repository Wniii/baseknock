import { useState, useEffect } from 'react';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import { collection, getDocs } from "firebase/firestore";
import { firestore } from 'src/pages/firebase'; // 确保路径与您的配置文件相匹配
import { query, where } from "firebase/firestore";

export const AccountProfile = () => {
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState('');
  const [players, setPlayers] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState({});
  
  useEffect(() => {
    const fetchTeamsAndPlayers = async () => {
      try {
        // 获取团队信息
        const teamsCollectionRef = collection(firestore, "team");
        const teamsSnapshot = await getDocs(teamsCollectionRef);
        const teamsData = teamsSnapshot.docs.map((doc) => {
          const data = doc.data();
          return { id: doc.id, ...data };
        });
        setTeams(teamsData);
    
        // 如果有选定的团队，尝试获取其球员信息
        if (selectedTeam) {
          const teamData = teamsData.find((team) => team.id === selectedTeam);
          if (teamData && teamData.players && typeof teamData.players === 'object') {
            // 将 players 对象转换为数组，每个元素包含球员名和球员信息
            const playersArray = Object.entries(teamData.players).map(([name, info]) => ({
              id: name, // 使用球员名作为 id
              ...info, // 展开球员信息
            }));
            setPlayers(playersArray);
          } else {
            setPlayers([]);
          }
        }
      } catch (error) {
        console.error("Failed to fetch teams or players:", error);
      }
    };
    
    fetchTeamsAndPlayers();
  }, [selectedTeam]);
  
  // 这里添加 console.log 来检查状态
  console.log('当前选中的队伍:', selectedTeam);
  console.log('队伍列表:', teams);
  console.log('当前选中的球员:', selectedPlayer);
  console.log('球员列表:', players);

  const [gameRecords, setGameRecords] = useState([]);

  // 为选中的球员获取游戏记录的函数
  const fetchGameRecordsForPlayer = async (playerName) => {
    const gamesRef = collection(firestore, "games");
    const q = query(gamesRef, where("p_name", "==", playerName)); // 假设 p_name 是您想要匹配的字段
    const querySnapshot = await getDocs(q);
    const games = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setGameRecords(games); // 存储获取的游戏数据
  };

  // 当点击“确认”按钮时调用这个函数
  const handleConfirm = () => {
    if (selectedPlayer.id) {
      fetchGameRecordsForPlayer(selectedPlayer.id);
    }
  };

  return (
    <Card>
      <CardContent>
        <FormControl fullWidth>
          <InputLabel>球隊</InputLabel>
          <Select
            value={selectedTeam}
            label="球隊"
            onChange={(e) => setSelectedTeam(e.target.value)}
          >
            {teams.map((team) => (
              <MenuItem key={team.id} value={team.id}>
                {team.Name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {selectedTeam && (
  <FormControl fullWidth sx={{ mt: 2 }}>
    <InputLabel>球員</InputLabel>
    <Select
      value={selectedPlayer.id || ""}
      label="球员"
      onChange={(e) => {
        // 在這裡，我們使用 'players' 數組的 'id' 屬性來找到選中的球員
        // 由於 'id' 現在存儲的是球員的名字（也就是 Firestore 中的 key），我們需要按照這個來查找
        const player = players.find(p => p.id === e.target.value);
        setSelectedPlayer(player || {});
      }}
    >
      {players.map((player) => (
        <MenuItem key={player.id} value={player.id}>
          {player.id} {/* 在這裡，'id' 實際上是球員的名字 */}
        </MenuItem>
      ))}
    </Select>
  </FormControl>
)}
        {selectedPlayer.id && (
  <Box
    sx={{
      alignItems: 'center',
      display: 'flex',
      flexDirection: 'column',
      mt: 2
    }}
  >
    {/* <Avatar
      src={selectedPlayer.photo || '/assets/avatars/default.png'}
      sx={{ height: 80, mb: 2, width: 80 }}
    /> */}
    
    <Typography gutterBottom variant="body2">
      姓名:{selectedPlayer.id} {/* 确保字段名称与 Firestore 文档中的一致 */}
    </Typography>
    <Typography color="text.secondary" variant="body2">
      背號：{selectedPlayer.PNum}
    </Typography>
    <Typography color="text.secondary" variant="body2">
      守備位置：{selectedPlayer.position}
    </Typography>
    <Typography color="text.secondary" variant="body2">
      投打習慣：{selectedPlayer.habit}
    </Typography>
  </Box>
)}
      </CardContent>
      <Divider />
      <CardActions>
      <Button
          fullWidth
          variant="text"
          onClick={handleConfirm} // 将 handleConfirm 函数附加到 onClick 事件
        >
          確認
        </Button>
      </CardActions>
    </Card>
  );
};
