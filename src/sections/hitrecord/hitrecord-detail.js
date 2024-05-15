import React, { useState, useEffect } from 'react';
import { Select, MenuItem } from '@mui/material';
import { collection, getDocs } from 'firebase/firestore';
import { firestore } from 'src/firebase';

const HitrecordDetail = ({ onTeamSelect }) => {
  const [teamsData, setTeamsData] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState('');

  useEffect(() => {
    const fetchTeamsData = async () => {
      const teamsCollection = collection(firestore, 'team');
      const querySnapshot = await getDocs(teamsCollection);
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTeamsData(data);
    };

    fetchTeamsData();
  }, []);

  const handleTeamChange = (event) => {
    const teamId = event.target.value;
    const selectedTeam = teamsData.find(team => team.id === teamId);
    setSelectedTeam(selectedTeam);
    onTeamSelect(selectedTeam); // 調用父組件中的方法，將所選球隊信息傳遞給父組件
  };

  return (
    <Select
  value={selectedTeam ? selectedTeam.id : ''}
  onChange={handleTeamChange}
>
  {teamsData.length > 0 && teamsData.map((team) => (
    <MenuItem key={team.id} value={team.id}>
      {team.Name}
    </MenuItem>
  ))}
</Select>
  );
};

export default HitrecordDetail;