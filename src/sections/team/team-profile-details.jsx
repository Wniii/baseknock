import React, { useState } from "react";
import { Box, Card, CardContent, CardHeader, TextField, Grid } from '@mui/material';
import { firestore } from "../../pages/firebase";
import { setDoc, doc } from "firebase/firestore";
import { v4 as uuidv4 } from 'uuid';

const CreateTeamDocumentButton = React.forwardRef((props, ref) => {
  const [name, setName] = useState("");
  const [codeName, setCodeName] = useState("");
  const [introduction, setIntro] = useState("");

  const handleCreateTeamDocument = async () => {
    const teamId = uuidv4();

    try {
      await setDoc(doc(firestore, "team", teamId), {
        t_id: teamId,
        name: name,
        codeName: codeName,
        introduction: introduction,
      });

      alert("Team document created successfully!");
    } catch (error) {
      console.error("Error creating team document:", error);
    }
  };

  React.useImperativeHandle(ref, () => ({
    handleSubmit: handleCreateTeamDocument
  }));

  return (
    <div>
      <Card sx={{ p: 0 }}>
        <CardHeader />
        <CardContent sx={{ pt: 0 }}>
          <Box sx={{ m: -1.5 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="球隊名稱"
                  name="name"
                  type="text"
                  onChange={(e) => setName(e.target.value)}
                  required
                  value={name || ''}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="球隊代號"
                  name="codeName"
                  onChange={(e) => setCodeName(e.target.value)}
                  required
                  value={codeName || ''}
                />
              </Grid>
              <Grid item xs={12}>
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
  );
});

export default CreateTeamDocumentButton;
