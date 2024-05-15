import Head from "next/head";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Box, Button, Link, Stack, TextField, Typography } from "@mui/material";
import { Layout as AuthLayout } from "src/layouts/auth/layout";
import React, { useCallback,useState, useEffect } from "react";
import { firestore,firebaseApp } from "src/firebase";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getDocs, query, collection, where } from "firebase/firestore";



function useAuth() {
  const auth = getAuth(firebaseApp); // 獲取 Firebase Auth 實例

  const signIn = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  return { signIn };
}

const LoginPage = () => {
  const auth = getAuth(firebaseApp);
  const router = useRouter();
  const [userTeam, setUserTeam] = useState("");
  const [userEamil, setUserEmail] = useState("");

  const signIn = useCallback(async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  }, [auth]);

  const fetchUserTeam = useCallback(async (uid) => {
    try {
      const userRef = collection(firestore, "users");
      const q = query(userRef, where("u_id", "==", uid));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs[0]?.data();
      console.log("xxscw",data)

      setUserTeam(data?.u_team || "No team assigned");
      setUserEmail(data?.u_mail || "No email assigned");
      
      window.localStorage.setItem("userTeam", data?.u_team || "");
      window.localStorage.setItem("userEmail", data?.u_Email || "");
      window.localStorage.setItem("userID", data?.u_id || "");
      window.localStorage.setItem("username", data?.u_name || "");



    } catch (error) {
      console.error("Error fetching user team:", error);
    }
  }, []);

  const formik = useFormik({
    initialValues: {
      u_email: "",
      u_password: "",
    },
    validationSchema: Yup.object({
      u_email: Yup.string().email("Must be a valid email").required("Email is required"),
      u_password: Yup.string().required("Password is required"),
    }),
    onSubmit: async (values, helpers) => {
      try {
        const user = await signIn(values.u_email, values.u_password);
        fetchUserTeam(user.uid);
        router.push(`/`);
      } catch (error) {
        helpers.setErrors({ submit: error.message });
      }
    },
  });// Depend on auth.user and userId changes

  return (
    <>
      <Head>
        <title>登入</title>
      </Head>
      <Box
        sx={{
          backgroundColor: "background.paper",
          flex: "1 1 auto",
          alignItems: "center",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            maxWidth: 550,
            px: 3,
            py: "100px",
            width: "100%",
          }}
        >
          <div>
            <Stack spacing={1} sx={{ mb: 3 }}>
              <Typography variant="h4">登入</Typography>
              <Typography color="text.secondary" variant="body2">
                Don&apos;t have an account? &nbsp;
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
                <Button type="submit" fullWidth variant="contained" disabled={formik.isSubmitting}>
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

LoginPage.getLayout = (page) => <AuthLayout>{page}</AuthLayout>;

export default LoginPage;
