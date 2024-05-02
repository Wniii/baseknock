import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { firestore } from "src/pages/firebase";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  setDoc,
  updateDoc,
  query,
  where,
  getDoc,
} from "firebase/firestore";
import {
  Box,
  Card,
  ListItem,
  ListItemIcon,
  List,
  Typography,
  Link,
  TextField,
  Button,
} from "@mui/material";
import firebase from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useAuth } from "src/hooks/use-auth";
import "firebase/firestore";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";

const CurrentTeamSx = {
  backgroundColor: "#d3d3d3",
  padding: "8px",
  height: "auto",
  width: "auto",
  margin: "auto",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  textAlign: "center",
  overflowX: "auto", // 垂直滚动
};

const ListStyle = {
  display: "flex", // Keep using Flexbox
  flexDirection: "row", // Keep child elements in a row
  padding: 0, // Adjust as needed
  margin: 0, // Adjust as needed
  justifyContent: "flex-start", // Align items to the left side
};

const ListItemStyle = {
  display: "flex", // Keep using Flexbox
  justifyContent: "flex-start", // Align items to the left side
  alignItems: "center", // Keep vertical center alignment
  margin: "1px", // Minimize space between items, adjust as needed
};

export const Manage = ({ onTeamSelect }) => {
  const [teams, setTeams] = useState([]);
  const [teamId, setTeamId] = useState("");
  const [message, setMessage] = useState("");
  const [currentUserId, setCurrentUserId] = useState("");
  const [userData, setUserData] = useState(null);
  const auth = useAuth();
  const router = useRouter();
  const [userId, setUserId] = useState(null);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    const fetchTeam = async () => {
      const userTeamCodeNameString = localStorage.getItem("userTeam"); // 從localStorage中獲取代碼名稱
      if (userTeamCodeNameString) {
        const userTeamCodeNames = userTeamCodeNameString.split(","); // 使用逗號分隔字符串，轉成數組
        const teamsData = [];

        for (const codeName of userTeamCodeNames) {
          const q = query(collection(firestore, "team"), where("codeName", "==", codeName.trim()));
          const querySnapshot = await getDocs(q);
          querySnapshot.forEach((doc) => {
            teamsData.push({ id: doc.id, ...doc.data() });
          });
        }

        if (teamsData.length > 0) {
          setTeams(teamsData); // 將所有找到的團隊設置到狀態中
        } else {
          console.log("No such team!");
          alert("找不到對應的球隊");
        }
      }
    };

    fetchTeam();
  }, []);

  useEffect(() => {
    // 在组件加载时从LocalStorage中获取userId
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      // 如果LocalStorage中有userId，则设置到状态变量中
      setUserId(storedUserId);
    }
  }, []);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUserId(user.uid);
        localStorage.setItem("userId", auth.user.id);
      }
    });
    return () => unsubscribe();
  }, []);
  console.log();

  const handleRemoveTeam = async (teamId) => {
    const userId = localStorage.getItem("userId");
    console.log("Current userId:", userId); // 输出当前用户ID
    console.log("Team ID to remove:", teamId); // 输出要移除的 Team ID

    if (!userId) {
      alert("无效的用户ID");
      return;
    }

    const userRef = doc(firestore, "users", userId);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      alert("找不到用户文档");
      return;
    }

    const teamRef = doc(firestore, "team", teamId);
    const teamDoc = await getDoc(teamRef);
    if (!teamDoc.exists()) {
      alert("找不到球队文档");
      return;
    }
    const teamCodeName = teamDoc.data().codeName;

    // 弹出确认窗口
    const confirmExit = confirm(`确定要退出球队 ${teamCodeName} 吗？`);
    if (!confirmExit) {
      console.log("用户取消了退出操作");
      return; // 用户点击“取消”，终止函数执行
    }

    let userTeams = userDoc.data().u_team || [];
    console.log("Original Teams:", userTeams);

    userTeams = userTeams.filter((team) => team !== teamCodeName);
    console.log("Filtered Teams:", userTeams);

    try {
      await updateDoc(userRef, { u_team: userTeams });
      console.log("Updated Teams in Firestore");
      alert("已退出球队");

      // 更新localStorage并刷新页面
      localStorage.setItem("userTeam", userTeams.join(","));
      location.reload(); // 刷新页面以反映更新
    } catch (error) {
      console.error("Error removing team from user:", error);
      alert("退出球队时出错");
    }
  };

  //加入球隊欄位
  const handleAddTeam = async () => {
    console.log("Starting handleAddTeam...");

    const userId = localStorage.getItem("userId");
    console.log("userId:", userId);

    try {
      if (!userId) {
        alert("無效的使用者ID");
        return;
      }
      const teamIdTrimmed = teamId.trim(); // 刪除可能存在的空格
      console.log("teamIdTrimmed:", teamIdTrimmed);

      if (!teamIdTrimmed) {
        alert("請輸入球隊ID");
        return;
      }
      const teamRef = doc(firestore, "team", teamIdTrimmed);
      console.log("teamRef:", teamRef);
      const teamDoc = await getDoc(teamRef);
      console.log("teamDoc:", teamDoc);

      if (!teamDoc.exists()) {
        alert("找不到該球隊");
        return;
      }

      const teamcodeName = teamDoc.data().codeName;
      console.log("teamcodeName:", teamcodeName);

      const userRef = doc(firestore, "users", userId);
      console.log("userRef:", userRef);

      // 獲取當前用戶的文檔
      const userDoc = await getDoc(userRef);
      let userDocData = userDoc.data();

      // 如果用戶文檔不存在或者 u_team 欄位不存在，初始化為一個空陣列
      if (!userDoc.exists() || !userDocData.u_team) {
        userDocData.u_team = [];
      }

      // 使用 push 方法將新的值添加到陣列的末尾
      userDocData.u_team.push(teamcodeName);

      // 更新用戶文檔中的 u_team 欄位為新的陣列
      await updateDoc(
        userRef,
        {
          u_team: userDocData.u_team,
        },
        { merge: true }
      );

      console.log("Team added to user successfully.");
      alert("已成功加入球隊！");

      // 更新localStorage
      localStorage.setItem("userTeam", userDocData.u_team.join(","));

      // 刷新页面以反映更新
      location.reload();
    } catch (error) {
      console.error("Error adding team to user:", error);
      alert("添加球隊時出錯");
    }
  };

  return (
    <div>
      <form>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Typography variant="h5" style={{ flex: 1 }}>
            目前球隊
          </Typography>
          <div style={{ display: "flex", alignItems: "center" }}>
            <Typography variant="h6" style={{ textAlign: "right" }}>
              加入球隊：
            </Typography>
            <TextField
              label="輸入球隊ID"
              value={teamId}
              onChange={(e) => setTeamId(e.target.value)}
              sx={{ width: "300px", marginLeft: "8px", height: "50px" }}
            />
            &nbsp;
            <Button variant="contained" onClick={handleAddTeam}>
              確認
            </Button>
          </div>
          <Typography variant="body1" color={message.includes("成功") ? "success" : "error"}>
            {message}
          </Typography>
        </div>
        &nbsp;
        <Card sx={CurrentTeamSx} style={{ position: "relative" }}>
          <IconButton
            sx={{
              position: "absolute", // 使用 fixed 定位
              left: "10px", // 根据实际视觉效果调整
              top: "10px", // 根据实际视觉效果调整
              padding: "5px", // 减小内边距使得整体按钮看起来更小
              "& .MuiSvgIcon-root": { fontSize: "1rem" }, // 自定义图标大小
            }}
            onClick={() => setEditMode(!editMode)} // 切换编辑模式
            color="primary"
          >
            <EditIcon />
          </IconButton>
          <br />
          <List style={ListStyle}>
            {teams.map((team) => (
              <ListItem
                key={team.id}
                onClick={() => onTeamSelect(team)}
                sx={{
                  ...ListItemStyle,
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  position: "relative", // 为了使删除按钮定位
                }}
              >
                <ListItemIcon sx={{ width: "100px", height: "100px", position: "relative" }}>
                  <Link>
                    {team.photo ? (
                      <img
                        src={team.photo}
                        alt={team.Name}
                        style={{ width: "100%", height: "100%" }}
                      />
                    ) : (
                      <div style={{ width: "100%", height: "100%", backgroundColor: "#ccc" }} />
                    )}
                  </Link>
                  {editMode && (
                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent the click from triggering List item events
                        handleRemoveTeam(team.id);
                      }}
                      color="error"
                      aria-label="delete team"
                      sx={{
                        position: "absolute", // 绝对定位
                        top: 0, // 顶部
                        right: 0, // 右边
                        padding: "3px", // 更小的内边距
                        "& .MuiSvgIcon-root": { fontSize: "1rem" }, // 调整图标大小
                        backgroundColor: "rgba(255, 255, 255, 0.7)", // 半透明背景增加可见性
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  )}
                </ListItemIcon>
                <Typography variant="subtitle1" sx={{ mt: 1 }}>
                  {team.Name}
                </Typography>
              </ListItem>
            ))}
          </List>
        </Card>
        <br></br>
      </form>
    </div>
  );
};
