// components/DraggablePlayer.js

import React from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { ListItem, ListItemText } from '@mui/material';

const ItemTypes = {
  PLAYER: 'player',
};

const DraggablePlayer = ({ playerKey, index, movePlayer, removePlayer }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.PLAYER,
    item: { playerKey, index },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }), [playerKey, index]);

  const [, drop] = useDrop(() => ({
    accept: ItemTypes.PLAYER,
    hover: (draggedItem) => {
      if (draggedItem.index !== index) {
        movePlayer(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  }), [index]);

  return (
    <ListItem
      ref={(node) => drag(drop(node))}
      key={playerKey}
      divider
      style={{ opacity: isDragging ? 0.5 : 1, cursor: 'move' }}
      onClick={() => removePlayer(playerKey)} // 添加点击事件处理程序
    >
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div style={{ marginRight: '16px' }}>{index + 1}</div>
        <ListItemText
          primary={playerKey} // 确保显示正确的玩家名称
          primaryTypographyProps={{ variant: 'body2' }}
        />
      </div>
    </ListItem>
  );
};

export default DraggablePlayer;
