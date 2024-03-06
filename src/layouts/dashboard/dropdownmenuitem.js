import React, { useState } from 'react';
import { Button, Menu, MenuItem } from '@mui/material'; // 导入所需的组件

// DropdownMenuItem组件定义
const DropdownMenuItem = ({ title, options }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  // 处理点击事件打开下拉菜单
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // 处理关闭下拉菜单
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Button
        aria-controls="dropdown-menu"
        aria-haspopup="true"
        onClick={handleClick}
      >
        {title}
      </Button>
      <Menu
        id="dropdown-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {options.map((option, index) => (
          <MenuItem key={index} onClick={handleClose}>
            {option.title}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default DropdownMenuItem; // 导出DropdownMenuItem组件
