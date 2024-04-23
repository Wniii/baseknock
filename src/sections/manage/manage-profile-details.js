// manage-profile-details.js

import { useCallback, useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  TextField,
  Unstable_Grid2 as Grid
} from '@mui/material';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import { firestore } from "src/pages/firebase"; // 检查这个导入语句
import { doc, getDoc, updateDoc, setDoc } from "firebase/firestore";
import firebase from 'firebase/app';
import 'firebase/firestore';

export const ManageProfileDetails = ({ teamInfo }) => {
  const [values, setValues] = useState({
    id: '',
    Name: '',
    codeName: '',
    introduction: ''
  });

  useEffect(() => {
    console.log('Received teamInfo:', teamInfo);
    if (teamInfo) {
      console.log('Team ID:', teamInfo.id);
      setValues({ ...teamInfo });
    }
  }, [teamInfo]);

  const handleNameChange = (event) => {
    setValues({ ...values, Name: event.target.value });
  };

  const handleIntroductionChange = (event) => {
    setValues({ ...values, introduction: event.target.value });
  };

  const handleSave = async (event) => {
    event.preventDefault();

    try {
      // 使用团队信息中的ID构建文档路径
      const teamDocRef = doc(firestore, "team", values.id);
      console.log(teamDocRef)
      // 更新团队信息
      await updateDoc(teamDocRef, {
        Name: values.Name,
        introduction: values.introduction
      });

      // 显示成功更新的提示框
      alert("Team information updated successfully!");
    } catch (error) {
      // 如果出现错误，将错误信息记录到控制台并显示错误提示框
      console.error("Error updating team information:", error);
      alert("An error occurred while updating team information.");
    }
  };


  return (
    <form>
      <div>
        <Card>
          <CardHeader />
          <CardContent sx={{ pt: 0 }}>
            <Box sx={{ m: -1.5 }}>
              <Grid container spacing={2}>
                <Grid xs={24} md={12}>
                  <TextField
                    fullWidth
                    label="球隊ID"
                    name="id"
                    value={values.id}
                    InputProps={{
                      readOnly: true,
                    }}
                    required
                  />
                </Grid>
                <Grid xs={24} md={12}>
                  <TextField
                    fullWidth
                    label="球隊名稱"
                    name="Name"
                    value={values.Name}
                    onChange={handleNameChange}
                    required
                  />
                </Grid>
                <Grid xs={24} md={12}>
                  <TextField
                    fullWidth
                    label="球隊代號"
                    name="codeName"
                    value={values.codeName}
                    InputProps={{
                      readOnly: true,
                    }}
                    required
                  />
                </Grid>
                <Grid xs={24} md={12}>
                  <TextField
                    fullWidth
                    label="球隊簡介"
                    name="introduction"
                    value={values.introduction}
                    onChange={handleIntroductionChange}
                  />
                </Grid>
              </Grid>
            </Box>
          </CardContent>
          <CardActions style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-start' }}>
            <Button onClick={handleSave}>確認修改</Button>
          </CardActions>

        </Card>
      </div>
    </form>
  );
};
