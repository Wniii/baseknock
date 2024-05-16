import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import {
  useMediaQuery,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Button,
  TextField,
  Typography,
  Popover,
  Box,
  Divider,
  MenuList
} from '@mui/material';
import { getAuth, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { AuthContext } from 'src/contexts/auth-context';

const auth = getAuth();

export const AccountPopover = ({ anchorEl, onClose, open }) => {
  const router = useRouter();
  const [userData, setUserData] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [showChangePasswordDialog, setShowChangePasswordDialog] = useState(false);

  useEffect(() => {
    if (auth.currentUser) {
      setUserData({
        u_name: auth.currentUser.displayName || 'No Name',
        u_email: auth.currentUser.email
      });
    }
  }, [auth.currentUser]);

  const handleSignOut = useCallback(() => {
    auth.signOut().then(() => {
      onClose();
      router.push('/auth/login');
    }).catch((error) => {
      console.error('Error signing out:', error);
    });
    try {
      window.localStorage.removeItem('userName');
      window.localStorage.removeItem('userEmail');
      window.localStorage.removeItem('userTeam');
      window.localStorage.removeItem('authenticated');
      window.localStorage.removeItem('userId');   // 假設你也有儲存 userEmail
    } catch (err) {
      console.error('Error clearing local storage:', err);
    }
  }, [onClose, router]);

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
    if (newPassword !== confirmPassword) {
      alert('新密碼和確認密碼不相符！');
      return;
    }


    const user = auth.currentUser;
    const credential = EmailAuthProvider.credential(
      user.email,
      oldPassword
    );

    reauthenticateWithCredential(user, credential).then(() => {
      updatePassword(user, newPassword).then(() => {
        alert("密碼更新成功！");
        handleCloseChangePasswordDialog();
      }).catch((error) => {
        alert("密碼更新失敗：" + error.message);
      });
    }).catch((error) => {
      alert("重新认证失败：" + error.message);
    });
  };
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
      <Box sx={{ py: 1.5, px: 2 }}>
        <Typography variant="overline">Account</Typography>
        
        
          <Typography color="text.secondary" variant="body2">
            {localStorage.getItem("username")}
          </Typography>
        
      </Box>
      <Divider />
      <MenuList disablePadding dense sx={{ p: '8px', '& > *': { borderRadius: 1 }}}>
        <MenuItem onClick={handleOpenChangePasswordDialog}>
          修改密碼
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleSignOut}>
          登出
        </MenuItem>
      </MenuList>

      {showChangePasswordDialog && (
        <Dialog open={showChangePasswordDialog} onClose={handleCloseChangePasswordDialog}>
          <DialogTitle>{userData?.u_name} 修改密碼</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="舊密碼"
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />
            <TextField
              fullWidth
              label="新密碼"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
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
