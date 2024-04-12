import Head from 'next/head';
import NextLink from 'next/link';
import { useRouter } from 'next/navigation';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Box, Button, Link, Stack, TextField, Typography } from '@mui/material';
import { useAuth } from 'src/hooks/use-auth';
import { Layout as AuthLayout } from 'src/layouts/auth/layout';
import React, { useState } from "react";
import { firestore } from "../firebase"; // 正确的导入路径
import { addDoc, collection, doc, setDoc } from "firebase/firestore";
import { v4 as uuidv4 } from 'uuid';

const Page = () => {
  const router = useRouter();
  const auth = useAuth();
  
  const [userId, setUserId] = useState(""); 
  //const userId = uuidv4();
  const [password, setPassword] = useState(""); 
  const [email, setEmail] = useState(""); 
  const [userName, setUserName] = useState(""); 
  const [checkpsw, setCheckpsw] = useState(""); 
  const [playerId, setPlayerId] = useState(""); 

  const formik = useFormik({
    initialValues: {
      u_id: '',
      u_password: '',
      u_checkpsw: '',
      u_name: '',
      u_email: '',
      p_id: '',
      submit: null
    },
    validationSchema: Yup.object({
      u_id: Yup.string().max(255).required('Account is required'),
      u_password: Yup.string().max(255).required('Password is required'),
      u_checkpsw: Yup.string().oneOf([Yup.ref('u_password'), null], 'Passwords must match').required('Please confirm your password'),
      u_name: Yup.string().max(255).required('Name is required'),
      u_email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
    }),
    onSubmit: async (values, helpers) => {
      // try {
      //   await auth.signUp(values.u_id, values.u_password, values.u_checkpsw, values.u_name, values.u_email);
      //   await handleCreateUserDocument();
      //   router.push('/');
      // } catch (err) {
      //   helpers.setStatus({ success: false });
      //   helpers.setErrors({ submit: err.message });
      //   helpers.setSubmitting(false);
      // }
      try {
        await auth.signUp(values.u_id, values.u_password,values.u_checkpsw, values.u_name, values.u_email);
        await setDoc(doc(firestore, "users", userId), {
          u_id: userId,
          u_password: password,
          u_email: email,
          p_id: playerId,
          u_name: userName,
          u_checkpsw: checkpsw,
        });
        router.push('/');
        alert("User document created successfully!");
      } catch (error) {
        console.error("Error creating user document:", error);
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: error.message });
        helpers.setSubmitting(false);
      }
    }
  });

  // const handleCreateUserDocument = async (e) => {
  //   e.preventDefault();
    
  //   try {
  //     // 创建一个名为 "users" 的集合，并在其中创建一个用户文档
  //     await setDoc(doc(firestore, "users", userId), {
  //       u_id: userId,
  //       u_password: password,
  //       u_email: email,
  //       p_id: playerId,
  //       u_name: userName,
  //       u_checkpsw: checkpsw,
  //     });
  //     alert("User document created successfully!");
  //   } catch (error) {
  //     console.error("Error creating user document:", error);
  //   }
  // };

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
            {/* <form onSubmit={handleCreateUserDocument}> */}

              <div style={{ textAlign: 'left', padding: '4px'}}>
                <Typography variant="h8">帳號/密碼</Typography>
              </div>
              <Stack spacing={1}>
                <TextField
                  error={!!(formik.touched.u_id && formik.errors.u_id)}
                  fullWidth
                  helperText={formik.touched.u_id && formik.errors.u_id}
                  label="account"
                  name="u_id"
                  onBlur={formik.handleBlur}
                  //onChange={(e) => setUserId(e.target.value)}
                  //onChange={formik.handleChange}

                  onChange={(e) => {
                    setUserId(e.target.value);
                    formik.handleChange(e);
                  }}
                  
                  type="text"
                  value={formik.values.u_id}
                />
                <TextField
                  error={!!(formik.touched.u_password && formik.errors.u_password)}
                  fullWidth
                  helperText={formik.touched.u_password && formik.errors.u_password}
                  label="password"
                  name="u_password"
                  onBlur={formik.handleBlur}
                  required
                  onChange={(e) => {
                    setPassword(e.target.value);
                    formik.handleChange(e);
                  }}
                  //onChange={(e) => setPassword(e.target.value)}
                  //onChange={formik.handleChange}

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
                  //onChange={(e) => setCheckpsw(e.target.value)}
                  //onChange={formik.handleChange}

                  onChange={(e) => {
                    setCheckpsw(e.target.value);
                    formik.handleChange(e);
                  }}
                  type="password"
                  value={formik.values.u_checkpsw}
                />
              </Stack>
              <br></br>
              <div style={{ textAlign: 'left', padding: '4px'}}>
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
                  //onChange={(e) => setUserName(e.target.value)}
                  //onChange={formik.handleChange}

                  onChange={(e) => {
                    setUserName(e.target.value);
                    formik.handleChange(e);
                  }}

                  type="text"
                  value={formik.values.u_name}
                />
                <TextField
                  error={!!(formik.touched.u_email && formik.errors.u_email)}
                  fullWidth
                  helperText={formik.touched.u_email && formik.errors.u_email}
                  label="email"
                  name="u_email"
                  onBlur={formik.handleBlur}
                  //onChange={(e) => setEmail(e.target.value)}
                  //onChange={formik.handleChange}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    formik.handleChange(e);
                  }}
                  type="email"
                  value={formik.values.u_email}
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
