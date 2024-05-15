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
import { firestore } from 'src/firebase'; // 确保路径与您的配置文件相匹配
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
        const userTeamString = localStorage.getItem('userTeam');
        const userTeamCodeNames = userTeamString ? userTeamString.split(',') : [];

        const teamsCollectionRef = collection(firestore, "team");
        const teamsSnapshot = await getDocs(teamsCollectionRef);
        const teamsData = teamsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        const filteredTeams = teamsData.filter(team => userTeamCodeNames.includes(team.codeName));

        setTeams(filteredTeams);
        //setTeams(teamsData);

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
    console.log(gamesRef)
    const gamesSnapshot = await getDocs(gamesRef);
    console.log("dff", gamesSnapshot)
    const games = [];

    gamesSnapshot.forEach(doc => {
      const game = doc.data();
      console.log('Gada:', game); // 打印遊戲數據
      const isPlayerIncluded =
        (Array.isArray(game.ordermain) && game.ordermain.some(entry => entry.p_name === playerName)) ||
        (Array.isArray(game.orderoppo) && game.orderoppo.some(entry => entry.o_p_name === playerName));
      console.log('Is player included:', isPlayerIncluded); // 打印球員是否包含在比賽中

      if (isPlayerIncluded) {
        const gameDate = game.date?.toDate();
        console.log('Game date:', gameDate); // 打印比賽日期
        games.push({
          id: doc.id,
          date: gameDate,
        });
      }
    });

    console.log('Gamesds:', games); // 打印所有比賽數據
    setGameRecords(games);
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
              label="球員"
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
    </Card>
  );
};

AccountProfile.propTypes = {
  onPlayerSelect: PropTypes.func.isRequired,
  onTeamSelect: PropTypes.func.isRequired // 添加這行
};
