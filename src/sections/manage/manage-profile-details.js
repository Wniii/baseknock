import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  TextField,
  Grid,
  Typography,
} from "@mui/material";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { firestore, storage } from "src/pages/firebase"; // Ensure these are correctly imported
import { doc, updateDoc } from "firebase/firestore";

export const ManageProfileDetails = ({ teamInfo }) => {
  const [values, setValues] = useState({
    id: "",
    Name: "",
    codeName: "",
    introduction: "",
    photo: "",
  });
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (teamInfo) {
      setValues({
        id: teamInfo.id,
        Name: teamInfo.Name,
        codeName: teamInfo.codeName,
        introduction: teamInfo.introduction,
        photo: teamInfo.photo,
      });
    }
  }, [teamInfo]);

  const handleImageChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setValues({ ...values, photo: reader.result });
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSave = async () => {
    let photoURL = values.photo;

    if (file) {
      const storageRef = ref(storage, `teamImages/${file.name}`);
      await uploadBytes(storageRef, file);
      photoURL = await getDownloadURL(storageRef);
    }

    const updatedData = {
      Name: values.Name,
      introduction: values.introduction || '', // Ensure this is not undefined
      photo: photoURL,
    };

    try {
      const teamDocRef = doc(firestore, "team", values.id);
      await updateDoc(teamDocRef, updatedData);
      alert("Team information and photo updated successfully!");
      window.location.reload();  // 刷新页面
    } catch (error) {
      console.error("Error updating team information and photo:", error);
      alert("Failed to update team information and photo.");
    }
};


  const handleSubmit = async (e) => {
    e.preventDefault();
    // Trigger the file upload and then handle saving the form data
    await handleSave();
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader title="Team Details" />
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Team ID"
                name="id"
                value={values.id}
                InputProps={{ readOnly: true }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Team Name"
                name="Name"
                value={values.Name}
                onChange={(e) => setValues({ ...values, Name: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Team Introduction"
                name="introduction"
                value={values.introduction}
                onChange={(e) =>
                  setValues({ ...values, introduction: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                hidden
              />
              {/* Removed the <img> tag */}
            </Grid>
          </Grid>
        </CardContent>
        <CardActions>
          <Button type="submit" fullWidth variant="contained" color="primary">
            Confirm Changes
          </Button>
        </CardActions>
      </Card>
    </form>
  );
};
