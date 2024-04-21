import { useCallback, useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import PropTypes from 'prop-types';
import {
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
  Popover,
  Box,
  Divider,
  MenuList,
  ImageListItemBar
} from '@mui/material';
import { useAuth } from 'src/hooks/use-auth';
import { firestore } from "src/pages/firebase";
import { doc, updateDoc, getDocs, query, collection, where } from "firebase/firestore";


export const AccountPopover = (props) => {
  const { anchorEl, onClose, open } = props;
  const router = useRouter();
  const auth = useAuth();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showChangePasswordDialog, setShowChangePasswordDialog] = useState(false);
  const [oldPassword, setOldPassword] = useState('');


  useEffect(() => {
    const checkLocalStorage = () => {
      const savedUserName = localStorage.getItem('userName');
      if (savedUserName) {
        // 自動登入用戶
        setUserData({ u_name: savedUserName });
        setLoading(false);
      } else {
        setLoading(false);
      }
    };

    checkLocalStorage();
  }, []);

  const handleSignOut = useCallback(
    () => {
      onClose?.();
      auth.signOut();
      router.push('/auth/login');
    },
    [onClose, auth, router]
  );

  const handleOpenChangePasswordDialog = () => {
    setShowChangePasswordDialog(true);
  };

  const handleCloseChangePasswordDialog = () => {
    setShowChangePasswordDialog(false);
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };



  const handleChangePassword = async () => {
    console.log("newPassword:", newPassword);
    console.log("confirmPassword:", confirmPassword);
    if (newPassword === confirmPassword) {
      try {
        console.log("Updating password...");
        
        // 從本地存儲中獲取用戶電子郵件
        const userEmail = localStorage.getItem('userEmail');
        if (!userEmail) {
          console.error('User email not found in local storage');
          return;
        }
        
        // 使用本地存儲中的用戶電子郵件來查找用戶
        const userQuery = query(collection(firestore, 'users'), where('u_email', '==', userEmail));
        const querySnapshot = await getDocs(userQuery);
  
        // 假设每个用户的邮箱都是唯一的，因此我们只需要更新匹配的第一个文档
        if (!querySnapshot.empty) {
          const userDoc = querySnapshot.docs[0];
          const userData = userDoc.data();
  
          // 检查输入的旧密码是否与数据库中的密码匹配
          if (oldPassword === userData.u_password) {
            const userRef = doc(firestore, 'users', userDoc.id);
  
            // 使用 updateDoc 函式來更新使用者文件中的 u_password 欄位
            await updateDoc(userRef, {
              u_password: newPassword,
              u_checkpsw: confirmPassword,
            });
  
            // 如果成功更新密碼，關閉彈窗並清空輸入的新密碼、確認密碼和舊密碼
            setShowChangePasswordDialog(false);
            setOldPassword('');
            setNewPassword('');
            setConfirmPassword('');
            
            console.log('Password updated successfully');
            alert("修改成功!");
          } else {
            console.error('Old password does not match');
            alert("舊密碼錯誤!");
          }
        } else {
          console.error('User not found with email:', userEmail);
        }
      } catch (error) {
        console.error('Error updating password:', error);
      }
    } else {
      alert('新密碼和確認密碼不相符！');
    }
  };
  

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (auth.user) {
          // 建立查詢以獲取使用者資料
          const q = query(collection(firestore, 'users'), where('u_email', '==', auth.user.email));
          const querySnapshot = await getDocs(q);
          if (!querySnapshot.empty) {
            // 如果找到了使用者，設置使用者資料
            querySnapshot.forEach((doc) => {
              setUserData(doc.data());
              setLoading(false); // 資料加載完成後設置 loading 為 false
              localStorage.setItem('userName', doc.data().u_name);
            });
          } else {
            setUserData(null); // 如果沒有找到使用者，設置使用者資料為 null
            setLoading(false); // 資料加載完成後設置 loading 為 false

          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [auth.user]);

  // 如果資料還在載入中，顯示載入中的狀態
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Popover
      anchorEl={anchorEl}
      anchorOrigin={{
        horizontal: 'left',
        vertical: 'bottom'
      }}
      onClose={onClose}
      open={open}
      PaperProps={{ sx: { width: 200 } }}
    >
      <Box
        sx={{
          py: 1.5,
          px: 2
        }}
      >
        <Typography variant="overline">
          Account
        </Typography>
        {userData && (
          <Typography
            color="text.secondary"
            variant="body2"
          >
            {userData.u_name}
          </Typography>
        )}
      </Box>
      <Divider />
      <MenuList
        disablePadding
        dense
        sx={{
          p: '8px',
          '& > *': {
            borderRadius: 1
          }
        }}
      >
        <MenuItem onClick={handleOpenChangePasswordDialog}>
          修改密碼
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleSignOut}>
          登出
        </MenuItem>
      </MenuList>

      {/* 彈窗 */}
      {userData && (
        <Dialog open={showChangePasswordDialog} onClose={handleCloseChangePasswordDialog}>

          <DialogTitle>{userData.u_name}修改密碼</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="舊密碼"
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />
            &nbsp;
            <TextField
              fullWidth
              label="新密碼"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            &nbsp;
            <TextField
              fullWidth
              label="確認密碼"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseChangePasswordDialog}>取消</Button>
            <Button onClick={handleChangePassword} variant="contained" color="primary">確認修改</Button>
          </DialogActions>
        </Dialog>
      )}

    </Popover>
  );
};

AccountPopover.propTypes = {
  anchorEl: PropTypes.any,
  onClose: PropTypes.func,
  open: PropTypes.bool.isRequired
};
