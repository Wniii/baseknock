import Head from 'next/head';
import NextLink from 'next/link';
import { useRouter } from 'next/router'; // 注意这里的变更
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Box, Button, Link, Stack, TextField, Typography } from '@mui/material';
import { useAuth } from 'src/hooks/use-auth';
import { Layout as AuthLayout } from 'src/layouts/auth/layout';
import React, { useState, useEffect } from "react";
import { firestore } from "../firebase"; // 正确的导入路径
import { getDocs, query, collection, where } from "firebase/firestore";

const LoginPage = () => {
  const router = useRouter(); // 注意这里的变更
  const auth = useAuth();
  const [userId, setUserId] = useState("");
  const [userteam, setUserTeam] = useState("");

  

  useEffect(() => {
  //   // 在组件加载时，从 sessionStorage 中获取用户ID
  //   const userIdFromStorage = window.sessionStorage.getItem('userId');
  //   if (userIdFromStorage) {
  //     setUserId(userIdFromStorage);
  //   }
  // }, []);

  const userIdFromStorage = window.localStorage.getItem('userId');
    if (userIdFromStorage) {
      setUserId(userIdFromStorage);
    }
  }, []);
  const storeUserIdInLocalStorage = (userId) => {
    window.localStorage.setItem('userId', userId);
  };


  const storeUserEmailInLocalStorage = (userEmail) => {
    localStorage.setItem('userEmail', userEmail);
  };

  const fetchUserTeam = async (userId) => {
    try {
      const userRef = collection(firestore, "users");
      const q = query(userRef, where('u_id', '==', userId));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach(doc => {
        setUserTeam(doc.data().u_team);
        // 存储团队信息到本地存储
        window.localStorage.setItem('userTeam', doc.data().u_team);
      });
    } catch (error) {
      console.error('Error fetching user team:', error);
    }
  };

  const formik = useFormik({
    initialValues: {
      u_email: '',
      u_password: '',
      submit: '',
    },

    validationSchema: Yup.object({
      u_email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
      u_password: Yup.string().max(255).required('Password is required')
    }),
    onSubmit: async (values, helpers) => {
      try {
        // 连接数据库，检查用户是否存在
        const q = query(collection(firestore, "users"), where('u_email', '==', values.u_email));
        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) {
          // 用户不存在
          throw new Error('Invalid email or password');
        }

        const sendUserIdToServer = async (userId) => {
          try {
            console.log('Sending user ID to server:', auth.user.id);
            const response = await fetch('/', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/localstorage'
              },
              body: JSON.stringify({ userId })
            });
        
            if (!response.ok) {
              throw new Error('Failed to send user ID to server');
            }
            console.log('User ID sent successfully to server');
          } catch (error) {
            console.error('Error sending user ID to server:', error);
          }
        };

        


        

        // 用户存在，尝试进行登录
        await auth.signIn(values.u_email, values.u_password);
        const user = auth.currentUser; // Get the currently signed-in user
        if (user) {
          // Set the user ID in state
          setUserId(user.uid);
          // Send the user ID to the server
          await 
          fetchUserTeam(auth.user.id);
          sendUserIdToServer(auth.user.id);
          storeUserIdInLocalStorage(auth.user.id);

          storeUserEmailInLocalStorage(values.u_email);
          // Redirect to home page with userId query parameter
          router.push(`/?userId=${auth.user.id}`);
        } else {
          throw new Error('User not found');
        }

      } catch (err) {
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: err.message });
        helpers.setSubmitting(false);
      }
    }
  });



  return (
    <>
      <Head>
        <title>登入</title>
      </Head>
      <Box
        sx={{
          backgroundColor: 'background.paper',
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
            <Stack
              spacing={1}
              sx={{ mb: 3 }}
            >
              <Typography variant="h4">登入</Typography>
              <Typography
                color="text.secondary"
                variant="body2"
              >
                Don&apos;t have an account?
                &nbsp;
                <Link
                  component={NextLink}
                  href="/auth/register"
                  underline="hover"
                  variant="subtitle2"
                >
                  註冊
                </Link>
              </Typography>
            </Stack>
            <form onSubmit={formik.handleSubmit}>
              <Stack spacing={2}>
                <TextField
                  fullWidth
                  id="u_email"
                  //name="email"
                  type="email"
                  label="Email Address"
                  value={formik.values.u_email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.u_email && Boolean(formik.errors.u_email)}
                  helperText={formik.touched.u_email && formik.errors.u_email}
                />
                <TextField
                  fullWidth
                  id="u_password"
                  //name="password"
                  type="password"
                  label="Password"
                  value={formik.values.u_password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.u_password && Boolean(formik.errors.u_password)}
                  helperText={formik.touched.u_password && formik.errors.u_password}
                />
                {formik.errors.submit && (
                  <Typography color="error" variant="body2">
                    {formik.errors.submit}
                  </Typography>
                )}
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={formik.isSubmitting}
                >
                  登入
                </Button>
              </Stack>
            </form>
          </div>
        </Box>
      </Box>
    </>
  );
};

LoginPage.getLayout = (page) => (
  <AuthLayout>
    {page}
  </AuthLayout>
);

export default LoginPage;
