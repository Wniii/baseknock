import Head from 'next/head';
import NextLink from 'next/link';
import { useRouter } from 'next/navigation';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Box, Button, Link, Stack, TextField, Typography } from '@mui/material';
import { useAuth } from 'src/hooks/use-auth';
import { Layout as AuthLayout } from 'src/layouts/auth/layout';

const Page = () => {
  const router = useRouter();
  const auth = useAuth();
  const formik = useFormik({
    initialValues: {
      account: '',
      password: '',
      checkpsw: '',
      name: '',
      email: '',

      submit: null
    },
    validationSchema: Yup.object({
      account: Yup
      .string()
      .max(255)
      .required('Account is required'),
      password: Yup
        .string()
        .max(255)
        .required('Password is required'),
      checkpsw: Yup
        .string()
        .max(255)
        .required('Please confirm your password'),
      name: Yup
        .string()
        .max(255)
        .required('Name is required'),
      email: Yup
        .string()
        .email('Must be a valid email')
        .max(255)
        .required('Email is required'),

    }),
    onSubmit: async (values, helpers) => {
      try {
        await auth.signUp(values.account, values.password, values.checkpsw, values.name, values.email);
        router.push('/');
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
        <title>
          註冊
        </title>
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
            <Stack
              spacing={1}
              sx={{ mb: 3 }}
            >
              <Typography variant="h4">
                註冊
              </Typography>
              <Typography
                color="text.secondary"
                variant="body2"
              >
                Already have an account?
                &nbsp;
                <Link
                  component={NextLink}
                  href="/auth/login"
                  underline="hover"
                  variant="subtitle2"
                >
                  登入
                </Link>
              </Typography>
            </Stack>
            <form
              noValidate
              onSubmit={formik.handleSubmit}
            >
              <div style={{ textAlign: 'left', padding: '4px'}}>
                  <Typography variant="h8">帳號/密碼</Typography>
              </div>
              <Stack spacing={1}>
                <TextField
                  error={!!(formik.touched.account && formik.errors.account)}
                  fullWidth
                  helperText={formik.touched.account && formik.errors.account}
                  label="account"
                  name="account"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  type="account"
                  value={formik.values.account}
                />
                <TextField
                  error={!!(formik.touched.password && formik.errors.password)}
                  fullWidth
                  helperText={formik.touched.password && formik.errors.password}
                  label="password"
                  name="password"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  type="password"
                  value={formik.values.password}
                />
                <TextField
                  error={!!(formik.touched.checkpsw && formik.errors.checkpsw)}
                  fullWidth
                  helperText={formik.touched.checkpsw && formik.errors.checkpsw}
                  label="confirm password"
                  name="checkpsw"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  type="checkpsw"
                  value={formik.values.checkpsw}
                />
              </Stack>
              <br></br>
              <div style={{ textAlign: 'left', padding: '4px'}}>
                  <Typography variant="h8">個人資料</Typography>
              </div>
              <Stack spacing={1}>
                <TextField
                  error={!!(formik.touched.name && formik.errors.name)}
                  fullWidth
                  helperText={formik.touched.name && formik.errors.name}
                  label="name"
                  name="name"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  type="name"
                  value={formik.values.name}
                />
                <TextField
                  error={!!(formik.touched.email && formik.errors.email)}
                  fullWidth
                  helperText={formik.touched.email && formik.errors.email}
                  label="email"
                  name="email"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  type="email"
                  value={formik.values.email}
                />
              </Stack>
              {formik.errors.submit && (
                <Typography
                  color="error"
                  sx={{ mt: 3 }}
                  variant="body2"
                >
                  {formik.errors.submit}
                </Typography>
              )}
              <Button
                fullWidth
                size="large"
                sx={{ mt: 3 }}
                type="submit"
                variant="contained"
              >
                確認註冊
              </Button>
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
