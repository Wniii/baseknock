import * as React from "react";
import { useCallback, useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { firestore } from "./firebase"; // 此處導入 Firestore 實例
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  Stack,
  Unstable_Grid2 as Grid,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  TextField,
  Accordion,
  AccordionDetails,
  AccordionSummary,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export const PitcherRecord = () => {
  const [players, setPlayers] = useState([
    { id: 1, name: "茲提", gameId: 1, innings: ["第1局"] },
    { id: 2, name: "加西", gameId: 1, innings: ["第1局"] },
    // Add more players as needed
  ]);

  const handleAddPlayer = () => {
    const newPlayerId = players.length + 1; // Generate a new ID
    const newPlayer = { id: newPlayerId, name: `新投手${newPlayerId}`, gameId: 1, innings: [] };
    setPlayers((prevPlayers) => [...prevPlayers, newPlayer]);
  };

  const handleAddInning = (playerId) => {
    setPlayers((prevPlayers) => {
      return prevPlayers.map((player) => {
        if (player.id === playerId) {
          const newInning = `第${player.innings.length + 1}局`;
          return { ...player, innings: [...player.innings, newInning] };
        }
        return player;
      });
    });
  };

  const handleSubmit = useCallback(async (event) => {
    event.preventDefault();

    try {
      const formElements = event.target.elements;
      const pitcherData = {
        goodBall: formElements.goodBall.value,
        badBall: formElements.badBall.value,
        strikeouts: formElements.strikeouts.value,
        hits: formElements.hits.value,
        walks: formElements.walks.value,
        outs: formElements.outs.value,
        runs: formElements.runs.value,
      };

      const collectionRef = collection(firestore, "pitchers");

      await addDoc(collectionRef, pitcherData);

      alert("數據保存成功！");
    } catch (error) {
      console.error("Error adding document: ", error);
      alert("數據保存失敗！");
    }
  }, []);

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader
          title="投手紀錄"
          action={
            <Button
              onClick={handleAddPlayer}
              variant="outlined"
              sx={{
                color: "#2196f3",
                borderColor: "#2196f3",
                "&:hover": {
                  color: "#1976d2",
                  borderColor: "#1976d2",
                },
                width: "auto", // 自動調整寬度
              }}
            >
              新增投手
            </Button>
          }
        />
        <Divider />
        <CardContent>
          <Grid container spacing={12} wrap="wrap">
            <Grid item xs={12} sm={6} md={12}>
              <Stack spacing={1}>
                {players.map((player) => (
                  <Stack key={player.id}>
                    <div>
                      <List
                        sx={{
                          width: "100%",
                          maxWidth: 960,
                          bgcolor: "background.paper",
                        }}
                      >
                        <Accordion>
                          <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                          >
                            <ListItem alignItems="flex-start">
                              <ListItemAvatar>
                                <Avatar
                                  alt={player.name}
                                  src={`/static/images/avatar/${player.id}.jpg`}
                                />
                              </ListItemAvatar>
                              <ListItemText
                                primary={`${player.id} ${player.name}  0.0 IP 0 SO 0 BB 0 R`}
                              />
                            </ListItem>
                          </AccordionSummary>
                          <AccordionDetails>
                            <div>
                              {player.innings.map((inning, index) => (
                                <div key={index}>
                                  <ListItemText primary={inning} />
                                  <TextField
                                    label="好球"
                                    id={`goodBall_${player.id}_${index}`}
                                    defaultValue="0"
                                    size="normal"
                                    variant="standard"
                                    sx={{ width: "50px" }}
                                  />
                                  <TextField
                                    label="壞球"
                                    id={`badBall_${player.id}`}
                                    defaultValue="0"
                                    size="normal"
                                    variant="standard"
                                    sx={{ width: "50px" }}
                                  />
                                  <TextField
                                    label="奪三振"
                                    id={`strikeouts_${player.id}`}
                                    defaultValue="0"
                                    size="normal"
                                    variant="standard"
                                    sx={{ width: "50px" }}
                                  />
                                  <TextField
                                    label="被安打"
                                    id={`hits_${player.id}`}
                                    defaultValue="0"
                                    size="normal"
                                    variant="standard"
                                    sx={{ width: "50px" }}
                                  />
                                  <TextField
                                    label="四壞"
                                    id={`walks_${player.id}`}
                                    defaultValue="0"
                                    size="normal"
                                    variant="standard"
                                    sx={{ width: "50px" }}
                                  />
                                  <TextField
                                    label="出局"
                                    id={`outs_${player.id}`}
                                    defaultValue="0"
                                    size="normal"
                                    variant="standard"
                                    sx={{ width: "50px" }}
                                  />
                                  <TextField
                                    label="失分"
                                    id={`runs_${player.id}`}
                                    defaultValue="0"
                                    size="normal"
                                    variant="standard"
                                    sx={{ width: "50px" }}
                                  />
                                </div>
                              ))}
                              <div style={{ marginTop: "10px" }}>
                                <Button
                                  onClick={() => handleAddInning(player.id)}
                                  variant="outlined"
                                  size="small"
                                  sx={{
                                    color: "#2196f3",
                                    borderColor: "#2196f3",
                                    "&:hover": {
                                      color: "#1976d2",
                                      borderColor: "#1976d2",
                                    },
                                  }}
                                >
                                  +
                                </Button>
                              </div>
                            </div>
                          </AccordionDetails>
                        </Accordion>
                      </List>
                    </div>
                  </Stack>
                ))}
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
        <Divider />
        <CardActions sx={{ justifyContent: "flex-end" }}>
          <Button type="submit" variant="contained">
            Save
          </Button>{" "}
        </CardActions>
      </Card>
    </form>
  );
};
