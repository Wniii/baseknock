import React, { useState } from "react";
import { firestore } from "./firebase"; // 正确的导入路径
import { addDoc, collection, doc, setDoc } from "firebase/firestore"; // 正确的导入语句

export default function CreatePlayerDocumentButton() {
    const [playerId, setPlayerId] = useState(""); // 球员ID
    const [playerName, setPlayerName] = useState(""); // 球员姓名
    const [playerNumber, setPlayerNumber] = useState(0); // 球员背号
    const [playerHeight, setPlayerHeight] = useState(0); // 球员身高
    const [playerWeight, setPlayerWeight] = useState(0); // 球员体重
    const [playerBt, setPlayerBt] = useState(""); // 投打习惯
    const [playerGrade, setPlayerGrade] = useState(0); // 球员年级
    const [playerBirth, setPlayerBirth] = useState(null); // 球员生日
    const [playerPic, setPlayerPic] = useState(null); // 球员照片
    const [teamId, setTeamId] = useState(""); // 球队ID

    const handleCreatePlayerDocument = async (e) => {
        e.preventDefault();

        try {
            // 创建一个名为 "player" 的集合，并在其中创建一个球员文档
            await setDoc(doc(firestore, "player", playerId), {
                p_id: playerId,
                p_name: playerName,
                p_number: playerNumber,
                p_height: playerHeight,
                p_weight: playerWeight,
                p_bt: playerBt,
                p_grade: playerGrade,
                p_birth: playerBirth,
                p_pic: playerPic,
                t_id: teamId
            });

            alert("Player document created successfully!");
        } catch (error) {
            console.error("Error creating player document:", error);
        }
    };

    return (
        <div>
            <form onSubmit={handleCreatePlayerDocument}>
                <label>Player ID:</label>
                <input
                    type="text"
                    value={playerId|| ''}
                    onChange={(e) => setPlayerId(e.target.value)}
                />
                <label>Player Name:</label>
                <input
                    type="text"
                    value={playerName|| ''}
                    onChange={(e) => setPlayerName(e.target.value)}
                />
                <label>Player Number:</label>
                <input
                    type="number"
                    value={playerNumber|| ''}
                    onChange={(e) => setPlayerNumber(parseInt(e.target.value))}
                />
                <label>Player Height:</label>
                <input
                    type="number"
                    value={playerHeight|| ''}
                    onChange={(e) => setPlayerHeight(parseInt(e.target.value))}
                />
                <label>Player Weight:</label>
                <input
                    type="number"
                    value={playerWeight|| ''}
                    onChange={(e) => setPlayerWeight(parseInt(e.target.value))}
                />
                <label>Player BT:</label>
                <input
                    type="text"
                    value={playerBt|| ''}
                    onChange={(e) => setPlayerBt(e.target.value)}
                />
                <label>Player Grade:</label>
                <input
                    type="number"
                    value={playerGrade|| ''}
                    onChange={(e) => setPlayerGrade(parseInt(e.target.value))}
                />
                <label>Player Birth:</label>
                <input
                    type="date"
                    value={playerBirth|| ''}
                    onChange={(e) => setPlayerBirth(e.target.value)}
                />
                <label>Player Pic:</label>
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setPlayerPic(e.target.files[0])}
                />
                <label>Team ID:</label>
                <input
                    type="text"
                    value={teamId|| ''}
                    onChange={(e) => setTeamId(e.target.value)}
                />
                <button type="submit">Create Player Document</button>
            </form>
        </div>
    );
}
