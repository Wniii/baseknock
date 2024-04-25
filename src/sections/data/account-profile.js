import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  Divider, 
} from '@mui/material';
import { collection, getDocs } from "firebase/firestore";
import { firestore } from 'src/pages/firebase'; // 确保路径与您的配置文件相匹配
import PropTypes from 'prop-types';

export const AccountProfile = ({ onPlayerSelect, onTeamSelect }) => {
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState('');
  const [players, setPlayers] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState({});
  const [gameRecords, setGameRecords] = useState([]);

  // 处理球员变更
  const handlePlayerChange = (event) => {
    const player = players.find(p => p.id === event.target.value);
    console.log('Selected player ID:', player.id);
    setSelectedPlayer(player || {});
    onPlayerSelect(player || {});
  };

  const handleTeamChange = (event) => {
    setSelectedTeam(event.target.value);
    // 獲取並傳遞選定球隊的信息
    const teamInfo = teams.find(team => team.id === event.target.value);
    onTeamSelect(teamInfo); // 傳遞球隊信息給父組件
  };

  // 获取球队和球员信息
  useEffect(() => {
    const fetchTeamsAndPlayers = async () => {
      try {
        const teamsCollectionRef = collection(firestore, "team");
        const teamsSnapshot = await getDocs(teamsCollectionRef);
        const teamsData = teamsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setTeams(teamsData);

        if (selectedTeam) {
          const teamData = teamsData.find(team => team.id === selectedTeam);
          if (teamData && teamData.players) {
            const playersArray = Object.entries(teamData.players).map(([name, info]) => ({
              id: name,
              ...info,
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

  // 获取选中球员的比赛记录
  const fetchGameRecordsForPlayer = async (playerName) => {
    const gamesRef = collection(firestore, `team/${selectedTeam}/games`);
    const gamesSnapshot = await getDocs(gamesRef);
    const games = [];

    gamesSnapshot.forEach(doc => {
      const game = doc.data();
      const isPlayerIncluded = 
        (Array.isArray(game.ordermain) && game.ordermain.some(entry => entry.p_name === playerName)) ||
        (Array.isArray(game.orderoppo) && game.orderoppo.some(entry => entry.o_p_name === playerName));

      if (isPlayerIncluded) {
        const gameDate = game.date?.toDate();
        games.push({
          id: doc.id,
          date: gameDate, // 此处确保 game.date 是一个 Timestamp 类型
        });
      }
    });

    setGameRecords(games); // 存储获取的比赛数据
  };

  // 确认按钮处理函数
  const handleConfirm = () => {
    if (selectedPlayer.id) {
      fetchGameRecordsForPlayer(selectedPlayer.id);
    }
  };

  // 组件渲染
  return (
    <Card>
      <CardContent>
        <FormControl fullWidth>
          <InputLabel>球隊</InputLabel>
          <Select
            value={selectedTeam}
            label="球隊"
            onChange={handleTeamChange}
          >
            {teams.map((team) => (
              <MenuItem key={team.id} value={team.id}>{team.Name}</MenuItem>
            ))}
          </Select>
        </FormControl>
        {selectedTeam && (
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>球員</InputLabel>
            <Select
              value={selectedPlayer.id || ""}
              label="球员"
              onChange={handlePlayerChange}
            >
              {players.map((player) => (
                <MenuItem key={player.id} value={player.id}>{player.id}</MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
        {selectedPlayer.id && (
          <Box sx={{ alignItems: 'center', display: 'flex', flexDirection: 'column', mt: 2 }}>
            <Typography gutterBottom variant="body2">姓名: {selectedPlayer.id}</Typography>
            <Typography color="text.secondary" variant="body2">背號：{selectedPlayer.PNum}</Typography>
            <Typography color="text.secondary" variant="body2">守備位置：{selectedPlayer.position}</Typography>
            <Typography color="text.secondary" variant="body2">投打習慣：{selectedPlayer.habit}</Typography>
          </Box>
        )}
      </CardContent>
      <Divider />
      <CardActions>
        <Button fullWidth variant="text" onClick={handleConfirm}>確認</Button>
      </CardActions>
    </Card>
  );
};

AccountProfile.propTypes = {
  onPlayerSelect: PropTypes.func.isRequired,
  onTeamSelect: PropTypes.func.isRequired // 添加這行
};
