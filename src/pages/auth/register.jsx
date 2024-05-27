import Head from 'next/head';
import NextLink from 'next/link';
import { useRouter } from 'next/router'; // 修改導入路徑
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Box, Button, Link, Stack, TextField, Typography } from '@mui/material';
import { useAuth } from 'src/hooks/use-auth';
import { Layout as AuthLayout } from 'src/layouts/auth/layout';
import React, { useState } from "react";
import { firestore,auth } from "src/firebase"; // 正确的导入路径
import { setDoc, query, where, getDocs, getDoc, collection, doc } from "firebase/firestore";
import { v4 as uuidv4 } from 'uuid';
import { collection as teamCollection, doc as teamDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword ,updateProfile } from "firebase/auth"; // 引入Firebase Authentication功能


const Page = () => {
  const router = useRouter();

  const [emailExistsError, setEmailExistsError] = useState("");

  const formik = useFormik({
    initialValues: {
      u_id: '',
      u_email: '',
      u_password: '',
      u_checkpsw: '',
      u_name: '',
      u_team: '',
      submit: null
    },
    validationSchema: Yup.object({
      u_email: Yup.string().email('必須是有效的電子郵件').max(255).required('電子郵件是必需的'),
      u_password: Yup.string().max(255).required('密碼是必需的'),
      u_checkpsw: Yup.string().oneOf([Yup.ref('u_password'), null], '密碼必須匹配').required('請確認您的密碼'),
      u_name: Yup.string().max(255).required('姓名是必需的'),
    }),

    onSubmit: async (values, helpers) => {
      try {
        const emailAlreadyExists = await checkEmailExists(values.u_email);
        if (emailAlreadyExists) {
          setEmailExistsError("此電子郵件已被註冊。請使用另一個電子郵件。");
          helpers.setSubmitting(false);
          return;
        }

        // Firebase Authentication 進行用戶註冊
        const userCredential = await createUserWithEmailAndPassword(auth, values.u_email, values.u_password);
        const userId = userCredential.user.uid; // 獲取 Firebase Auth 生成的 UID

        // 處理用戶隊伍信息
        let userTeams = [];
        if (values.u_team) {
          const teamIds = values.u_team.split(",").map(teamId => teamId.trim());
          for (const teamId of teamIds) {
            const teamSnapshot = await getDoc(doc(firestore, 'team', teamId));
            if (teamSnapshot.exists()) {
              userTeams.push(teamSnapshot.data().codeName);
            } else {
              throw new Error("提供的隊伍ID不存在。");
            }
          }
        }

        // 將用戶數據添加到 Firestore
        await setDoc(doc(firestore, "users", userId), {
          u_id: userId,
          u_email: values.u_email,
          u_name: values.u_name,
          u_team: userTeams,
        });

        await updateProfile(userCredential.user, {
          displayName: values.u_name
        });
        
        router.push('/auth/login');
      } catch (error) {
        console.error("註冊過程中發生錯誤：", error);
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: error.message });
        helpers.setSubmitting(false);
        // 在發生錯誤時，不創建帳號
        await auth.currentUser?.delete();
      }
    }
  });

  const checkEmailExists = async (email) => {
    try {
      const q = query(collection(firestore, 'users'), where('u_email', '==', email));
      const querySnapshot = await getDocs(q);
      return !querySnapshot.empty;
    } catch (error) {
      console.error("檢查電子郵件時發生錯誤：", error);
      return false;
    }
  };

  return (
    <>
      <Head>
        <title>註冊</title>
      </Head>
      <Box
        sx={{
          flex: '1 1 auto',
          alignItems: 'center',
          display: 'flex',
          justifyContent: 'center'
        }}
      >
        <Box
          sx={{
            maxWidth: 550,
            px: 3,
            py: '100px',
            width: '100%'
          }}
        >
          <div>
            <Stack spacing={1} sx={{ mb: 3 }}>
              <Typography variant="h4">註冊</Typography>
              <Typography color="text.secondary" variant="body2">
                已經有帳號了？
                &nbsp;
                <Link component={NextLink} href="/auth/login" underline="hover" variant="subtitle2">登入</Link>
              </Typography>
            </Stack>
            <form noValidate onSubmit={formik.handleSubmit}>
              <div style={{ textAlign: 'left', padding: '4px' }}>
                <Typography variant="h8">帳號/密碼</Typography>
              </div>
              <Stack spacing={1}>
                <TextField
                  error={!!(formik.touched.u_email && formik.errors.u_email)}
                  fullWidth
                  helperText={formik.touched.u_email && formik.errors.u_email}
                  label="email"
                  name="u_email"
                  onBlur={formik.handleBlur}
                  required
                  onChange={formik.handleChange}
                  type="email"
                  value={formik.values.u_email}
                />
                {emailExistsError && (
                  <Typography color="error" sx={{ mt: 1 }} variant="body2">
                    {emailExistsError}
                  </Typography>
                )}
                <TextField
                  error={!!(formik.touched.u_password && formik.errors.u_password)}
                  fullWidth
                  helperText={formik.touched.u_password && formik.errors.u_password}
                  label="password"
                  name="u_password"
                  onBlur={formik.handleBlur}
                  required
                  onChange={formik.handleChange}
                  type="password"
                  value={formik.values.u_password}
                />
                <TextField
                  error={!!(formik.touched.u_checkpsw && formik.errors.u_checkpsw)}
                  fullWidth
                  helperText={formik.touched.u_checkpsw && formik.errors.u_checkpsw}
                  label="confirm password"
                  name="u_checkpsw"
                  onBlur={formik.handleBlur}
                  required
                  onChange={formik.handleChange}
                  type="password"
                  value={formik.values.u_checkpsw}
                />
              </Stack>
              <br></br>
              <div style={{ textAlign: 'left', padding: '4px' }}>
                <Typography variant="h8">個人資料</Typography>
              </div>
              <Stack spacing={1}>
                <TextField
                  error={!!(formik.touched.u_name && formik.errors.u_name)}
                  fullWidth
                  helperText={formik.touched.u_name && formik.errors.u_name}
                  label="name"
                  name="u_name"
                  onBlur={formik.handleBlur}
                  required
                  onChange={formik.handleChange}
                  type="text"
                  value={formik.values.u_name}
                />
              </Stack>
              <Stack spacing={1}>
                <br></br>
                <div style={{ textAlign: 'left', padding: '4px' }}>
                  <Typography variant="h8">加入球隊？</Typography>
                </div>
                <TextField
                  fullWidth
                  label="team ID"
                  name="u_team"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  type="text"
                  value={formik.values.u_team}
                />
              </Stack>
              {formik.errors.submit && (
                <Typography color="error" sx={{ mt: 3 }} variant="body2">
                  {formik.errors.submit}
                </Typography>
              )}
              <Button fullWidth size="large" sx={{ mt: 3 }} type="submit" variant="contained" disabled={formik.isSubmitting}>確認註冊</Button>
            </form>
          </div>
        </Box>
      </Box>
    </>
  );
};

Page.getLayout = (page) => (
  <AuthLayout>
    {page}
  </AuthLayout>
);

export default Page;
