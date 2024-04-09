import React, { useCallback, useState, useRef } from "react";
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
import { firestore } from "../../pages/firebase"; // 正确的导入路径
import { addDoc, collection, doc, setDoc } from "firebase/firestore"; // 正确的导入语句


export default function CreateTeamDocumentButton() {
  const [teamId, setTeamId] = useState(""); // 球队ID
  const [name, setName] = useState(""); // 球队名称
  const [school, setSchool] = useState(""); // 学校
  const [coach, setCoach] = useState(""); // 教练
  const [manager, setManager] = useState(""); // 经理
  const [introduction, setIntro] = useState(""); // 簡介

  const [game, setGame] = useState(0); // 比赛场次
  const [win, setWin] = useState(0); // 胜场
  const [lose, setLose] = useState(0); // 败场
  const [tie, setTie] = useState(0); // 平局
  const [pct, setPCT] = useState(0); // 胜率

  const handleCreateTeamDocument = async (e) => {
      e.preventDefault();

      try {
          // 创建一个名为 "team" 的集合，并在其中创建一个球队文档
          await setDoc(doc(firestore, "team", teamId), {
              t_id: teamId,
              t_name: name,
              t_school: school,
              t_coach: coach,
              t_manager: manager,
              t_introduction: introduction,
              
          });

          alert("Team document created successfully!");
      } catch (error) {
          console.error("Error creating team document:", error);
      }
  };

  const createTeamDocumentButtonRef = useRef();

  // 暴露函数在组件实例上
  createTeamDocumentButtonRef.current = {
    handleSubmit: handleCreateTeamDocument
  };


  return (
    
    <form
      // autoComplete="off"
      // noValidate
      onSubmit={handleCreateTeamDocument}
    >
      <div>
      <Card>
        <CardHeader
          // subheader="The information can be edited"
          // title="Profile"
        />
        <CardContent sx={{ pt: 0 }}>
          <Box sx={{ m: -1.5 }}>
            <Grid
              container
              spacing={2}
            >
              <Grid
                xs={24}
                md={12}
              >
                <TextField
                  fullWidth
                  //helperText="Please specify the first name"
                  label="球隊名稱"
                  name="school"
                  type="text"
                  onChange={(e) => setSchool(e.target.value)}
                  required
                  value={school || ''}
                  />
              </Grid>
              <Grid
                xs={24}
                md={12}
              >
                <TextField
                  fullWidth
                  label="球隊代號"
                  name="name"
                  onChange={(e) => setName(e.target.value)}
                  required
                  value={name || ''}
                  />
              </Grid>
              <Grid
                xs={24}
                md={12}
              >
                <TextField
                  fullWidth
                  label="球隊簡介"
                  name="introduction"
                  type="text"
                  onChange={(e) => setIntro(e.target.value)}
                  required
                  value={introduction || ''}
                  />
              </Grid>
              {/* <Grid
                xs={12}
                md={6}
              >
                <TextField
                  fullWidth
                  label="Phone Number"
                  name="phone"
                  onChange={handleChange}
                  type="number"
                  value={values.phone}
                />
              </Grid>
              <Grid
                xs={12}
                md={6}
              >
                <TextField
                  fullWidth
                  label="Country"
                  name="country"
                  onChange={handleChange}
                  required
                  value={values.country}
                />
              </Grid>
              <Grid
                xs={12}
                md={6}
              >
                <TextField
                  fullWidth
                  label="Select State"
                  name="state"
                  onChange={handleChange}
                  required
                  select
                  SelectProps={{ native: true }}
                  value={values.state}
                >
                  {states.map((option) => (
                    <option
                      key={option.value}
                      value={option.value}
                    >
                      {option.label}
                    </option>
                  ))}
                </TextField>
              </Grid> */}
              
            </Grid>
            
          </Box>
        </CardContent>
        {/* <Divider /> */}
        {/* <CardActions sx={{ justifyContent: 'flex-end' }}>
          <Button variant="contained">
            Save details
          </Button>
        </CardActions> */}
      </Card>
      
      
                
                
                
  </div>
    </form>
    
  );
};
