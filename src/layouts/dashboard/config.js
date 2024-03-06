import { useState } from 'react';
import { Button, Menu, MenuItem, SvgIcon } from '@mui/material';

import ChartBarIcon from '@heroicons/react/24/solid/ChartBarIcon';
import AddIcon from '@mui/icons-material/Add';
import CogIcon from '@heroicons/react/24/solid/CogIcon';
import LockClosedIcon from '@heroicons/react/24/solid/LockClosedIcon';
import ShoppingBagIcon from '@heroicons/react/24/solid/ShoppingBagIcon';
import UserIcon from '@heroicons/react/24/solid/UserIcon';
import UserPlusIcon from '@heroicons/react/24/solid/UserPlusIcon';
import UsersIcon from '@heroicons/react/24/solid/UsersIcon';
import XCircleIcon from '@heroicons/react/24/solid/XCircleIcon';
import { Title } from '@mui/icons-material';

 import { DropdownMenuItem } from 'src/layouts/dashboard/dropdownmenuitem';
// import { SvgIcon } from '@mui/material';

// import React from 'react';
// import IconButton from '@material-ui/core/IconButton';
// import Menu from '@material-ui/core/Menu';
// import MenuItem from '@material-ui/core/MenuItem';
// import MoreVertIcon from '@material-ui/icons/MoreVert';

export const items = [
  {
    title: '首頁',
    path: '/',
    icon: (
      <SvgIcon fontSize="small">
        <ChartBarIcon />
      </SvgIcon>
    )
  },
  
  {
    title: 'Customers',
    path: '/customers',
    icon: (
      <SvgIcon fontSize="small">
        <UsersIcon />
      </SvgIcon>
    )
  },
  {
    title: 'Companies',
    path: '/companies',
    icon: (
      <SvgIcon fontSize="small">
        <ShoppingBagIcon />
      </SvgIcon>
    )
  },
  {
    title: '新增球隊',
    path: '/team',
    icon: (
      <SvgIcon fontSize="small">
        <AddIcon />
      </SvgIcon>
    )
  },
  {
    title: '新增比賽',
    path: '/game',
    icon: (
      <SvgIcon fontSize="small">
        <UserIcon />
      </SvgIcon>
    )
  },
  {
    title: '管理',
    path: '/manage',
    icon: (
      <SvgIcon fontSize="small">
        <UserIcon />
      </SvgIcon>
    )
  },
  {
    title: '賽程表',
    path: '/schedule',
    icon: (
      <SvgIcon fontSize="small">
        <UserIcon />
      </SvgIcon>
    )
  },

  {
    title: '數據',
    icon: (
      <SvgIcon fontSize="small">
        <CogIcon />
      </SvgIcon>
    ),
    options: [
      {
        title: '打擊數據',
        path: '/hitrecord'
      },
      {
        title: '防守數據',
        path: '/defendrecord'
      },
      {
        title: '各項排名',
        path: '/rank'
      },
      {
        title: '團隊比較',
        path: '/vsteam'
      },
      {
        title: '球員比較',
        path: '/vsplayer'
      }
    ]
  },

  {
    title: 'Settings',
    path: '/settings',
    icon: (
      <SvgIcon fontSize="small">
        <CogIcon />
      </SvgIcon>
    )
  },
  {
    title: '登入',
    path: '/auth/login',
    icon: (
      <SvgIcon fontSize="small">
        <LockClosedIcon />
      </SvgIcon>
    )
  },
  {
    title: '註冊',
    path: '/auth/register',
    icon: (
      <SvgIcon fontSize="small">
        <UserPlusIcon />
      </SvgIcon>
    )
  },
  {
    title: 'Error',
    path: '/404',
    icon: (
      <SvgIcon fontSize="small">
        <XCircleIcon />
      </SvgIcon>
    )
  }
];


const MyComponent = () => {
  return (
    <div>
      {items.map((item, index) => (
        <div key={index}>
          {item.options ? (
            <DropdownMenuItem title={item.title} options={item.options} />
          ) : (
            <div>{item.title}</div>
          )}
        </div>
      ))}
    </div>
  );
};

export default MyComponent;