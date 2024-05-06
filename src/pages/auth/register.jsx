import Head from 'next/head';
import NextLink from 'next/link';
import { useRouter } from 'next/router'; // 修改導入路徑
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Box, Button, Link, Stack, TextField, Typography } from '@mui/material';
import { useAuth } from 'src/hooks/use-auth';
import { Layout as AuthLayout } from 'src/layouts/auth/layout';
import React, { useState } from "react";
import { firestore } from "../firebase"; // 正确的导入路径
import { setDoc, query, where, getDocs, getDoc, collection, doc } from "firebase/firestore";
import { v4 as uuidv4 } from 'uuid';
import { collection as teamCollection, doc as teamDoc } from 'firebase/firestore';


const Page = () => {
  const router = useRouter();
  const auth = useAuth();

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
      u_email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
      u_password: Yup.string().max(255).required('Password is required'),
      u_checkpsw: Yup.string().oneOf([Yup.ref('u_password'), null], 'Passwords must match').required('Please confirm your password'),
      u_name: Yup.string().max(255).required('Name is required'),
    }),

    onSubmit: async (values, helpers) => {
      try {
        const emailAlreadyExists = await checkEmailExists(values.u_email);
        if (emailAlreadyExists) {
          setEmailExistsError("This email is already registered. Please use another email.");
          helpers.setSubmitting(false);  // 停止提交過程
          return;  // 結束函式執行
        } else {
          setEmailExistsError("");  // 清除之前的錯誤訊息
        }

        // 檢查並處理提供的隊伍 ID，如果沒有提供則略過
        if (values.u_team) {
          const teamIds = values.u_team.split(",").map(teamId => teamId.trim());
          const teamCodeName = [];

          for (const teamId of teamIds) {
            const teamSnapshot = await getDoc(teamDoc(teamCollection(firestore, 'team'), teamId));
            if (teamSnapshot.exists()) {
              teamCodeName.push(teamSnapshot.data().codeName);
            } else {
              alert("The team with the provided ID does not exist.");
              return;
            }
          }

          // 更新用戶信息，將獲取的codeName添加到用戶的隊伍數組中
          const userId = uuidv4();
          await auth.signUp(userId, values.u_password, values.u_checkpsw, values.u_name, values.u_email);
          await setDoc(doc(firestore, "users", userId), {
            u_id: userId,
            u_email: values.u_email,
            u_password: values.u_password,
            u_checkpsw: values.u_checkpsw,
            u_name: values.u_name,
            u_team: teamCodeName,
          });
        } else {
          // 如果沒有提供隊伍 ID，僅創建用戶文檔並設置空的隊伍數組
          const userId = uuidv4();
          await auth.signUp(userId, values.u_password, values.u_checkpsw, values.u_name, values.u_email);
          await setDoc(doc(firestore, "users", userId), {
            u_id: userId,
            u_email: values.u_email,
            u_password: values.u_password,
            u_checkpsw: values.u_checkpsw,
            u_name: values.u_name,
            u_team: [],
          });
        }

        // 其他代碼...
      } catch (error) {
        console.error("Error creating user document:", error);
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: error.message });
        helpers.setSubmitting(false);
      }
      router.push('/auth/login');

    }


  });

  const checkEmailExists = async (email) => {
    try {
      const q = query(collection(firestore, 'users'), where('u_email', '==', email));
      const querySnapshot = await getDocs(q);
      return !querySnapshot.empty;
    } catch (error) {
      console.error("Error checking email:", error);
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
                Already have an account?
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
