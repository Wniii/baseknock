import React, { useState, useRef } from "react";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  Typography,
  TextField,
  Grid, // Ensure to properly import Grid from MUI if you're using a stable version
  List,
  ListItem,
  ListItemIcon,
} from "@mui/material";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, updateDoc } from "firebase/firestore";
import { storage, firestore } from "src/firebase"; // Ensure these are correctly imported

export const ManageProfile = ({ selectedTeam, onImageSelect }) => {
  // 直接使用 onImageSelect 而不是 props.onImageSelect
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(selectedTeam?.photo);
  const fileInputRef = useRef(null); // 定义 ref
  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result);
        onImageSelect(reader.result); // 直接使用解构赋值得到的函数
      };
      reader.readAsDataURL(selectedFile);
    }

    const handleUpload = async () => {
      if (!file || !selectedTeam) return;

      const storageRef = ref(storage, `teamImages/${file.name}`);
      await uploadBytes(storageRef, file);
      const photoURL = await getDownloadURL(storageRef);

      const teamRef = doc(firestore, "team", selectedTeam.id);
      await updateDoc(teamRef, {
        photo: photoURL,
      });

      console.log("Image uploaded and team photo updated!");
    };
  };

  return (
    <div>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2} justifyContent="center">
          <Grid item xs={12} md={6} lg={12}>
            <Card style={{ height: "100%" }}>
              {" "}
              {/* or you can use a specific value like '500px' */}
              <CardContent>
                <Box
                  sx={{
                    alignItems: "center",
                    display: "flex",
                    flexDirection: "column",
                    height: "200px",
                  }}
                >
                  {selectedTeam ? (
                    <img
                      src={previewUrl || selectedTeam.photo}
                      alt={selectedTeam.name}
                      style={{ height: "200px", width: "200px" }}
                    />
                  ) : (
                    <Typography>No team selected</Typography>
                  )}
                </Box>
              </CardContent>
              <Divider />
              <CardActions style={{ marginBottom: "auto" }}>
                <input
                  type="file"
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                  ref={fileInputRef}
                />
                <Button fullWidth variant="text" onClick={() => fileInputRef.current.click()}>
                  修改圖片
                </Button>
              </CardActions>
            </Card>
          </Grid>
        </Grid>
      </Box>

      <br />
    </div>
  );
};

export default ManageProfile;
