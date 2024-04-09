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
  const [codeName, setCodeName] = useState(""); // 代號
  const [introduction, setIntro] = useState(""); // 簡介


  const handleCreateTeamDocument = async (e) => {
      e.preventDefault();

      try {
          // 创建一个名为 "team" 的集合，并在其中创建一个球队文档
          await setDoc(doc(firestore, "team", teamId), {
              t_id: teamId,
              name: name,
              codeName: codeName,
              t_coach: coach,
              t_manager: manager,
              introduction: introduction,
              
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
      onSubmit={handleCreateTeamDocument}
    >
      <div>
      <Card>
        <CardHeader
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
                  name="name"
                  type="text"
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
                  label="球隊代號"
                  name="codeName"
                  onChange={(e) => setCodeName(e.target.value)}
                  required
                  value={codeName || ''}
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
            </Grid>
            
          </Box>
        </CardContent>
      </Card>
       
                
  </div>
    </form>
    
  );
};