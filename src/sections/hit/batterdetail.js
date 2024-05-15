import React, { useState, useEffect } from 'react';
import { getDocs, collection, doc } from 'firebase/firestore';
import { Typography } from '@mui/material';
import { firestore } from 'src/firebase'; // Import your Firebase configuration

const PlayerInfo = ({ playerId }) => {
  const [player, setPlayers] = useState(null);

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const playerCollection = collection(firestore, 'player');
        const playerSnapshot = await getDocs(playerCollection);
        const playerData = playerSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setPlayers(playerData);
      } catch (error) {
        console.error('Error fetching players:', error);
      }
    };

    fetchPlayers();
  }, []);

  return (
    <div>
      {player ? (
        <div>
          <Typography variant="h4">玩家資料：</Typography>
          <Typography variant="body1">玩家：{player.id}</Typography>
          {/* 顯示其他玩家資料 */}
        </div>
      ) : (
        <Typography variant="body1">正在加載玩家資料...</Typography>
      )}
    </div>
  );
};

export default PlayerInfo;