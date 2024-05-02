import { SvgIcon } from '@mui/material';
import ChartBarIcon from '@heroicons/react/24/solid/ChartBarIcon';
import AddIcon from '@mui/icons-material/Add';
import EventIcon from '@mui/icons-material/Event'; // 引入日曆圖標
import HomeIcon from '@mui/icons-material/Home'; // 家的圖標
import CogIcon from '@heroicons/react/24/solid/CogIcon';
import LockClosedIcon from '@heroicons/react/24/solid/LockClosedIcon';
import ShoppingBagIcon from '@heroicons/react/24/solid/ShoppingBagIcon';
import UserIcon from '@heroicons/react/24/solid/UserIcon';
import UserPlusIcon from '@heroicons/react/24/solid/UserPlusIcon';
import UsersIcon from '@heroicons/react/24/solid/UsersIcon';
import XCircleIcon from '@heroicons/react/24/solid/XCircleIcon';

export const items = [
  {
    title: '首頁',
    path: '/',
    icon: (
      <SvgIcon fontSize="small">
        <HomeIcon />
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
        <AddIcon />
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
        <EventIcon />
      </SvgIcon>
    )
  },
  {
    title: '數據',
    items: [
      {
        title: '打擊數據',
        path: '/hitrecord',
        icon: (
          <SvgIcon fontSize="small">
            <ChartBarIcon />
          </SvgIcon>
        ),
      },
      {
        title: '防守數據',
        path: '/defendrecord',
        icon: (
          <SvgIcon fontSize="small">
            <ChartBarIcon />
          </SvgIcon>
        ),
      },
      {
        title: '各項排名',
        path: '/rank',
        icon: (
          <SvgIcon fontSize="small">
            <ChartBarIcon />
          </SvgIcon>
        ),
      },
      {
        title: '球隊比較',
        path: '/vsteam',
        icon: (
          <SvgIcon fontSize="small">
            <ChartBarIcon />
          </SvgIcon>
        ),
      },
      {
        title: '球員比較',
        path: '/vsplayer',
        icon: (
          <SvgIcon fontSize="small">
            <ChartBarIcon />
          </SvgIcon>
        ),
      },
      {
        title: '個人數據',
        path: '/personal-data',
        icon: (
          <SvgIcon fontSize="small">
            <ChartBarIcon />
          </SvgIcon>
        ),
      },
    ],
    icon: (
      <SvgIcon fontSize="small">
        <ChartBarIcon />
      </SvgIcon>
    ),
  },
  
];
