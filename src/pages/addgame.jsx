import React, { useState } from "react";
import { firestore } from "./firebase"; // 正确的导入路径
import { addDoc, collection, doc, setDoc } from "firebase/firestore"; // 正确的导入语句

export default function CreateGameDocumentButton() {
    const [gameID, setGameID] = useState(""); // 比赛ID
    const [date, setDate] = useState(""); // 比赛日期
    const [opponent, setOpponent] = useState(""); // 对手
    const [court, setCourt] = useState(""); // 场地
    const [name, setName] = useState(""); // 比赛名称
    const [recorder, setRecorder] = useState(""); // 记录员
    const [homeAway, setHomeAway] = useState(""); // 主场/客场
    const [label, setLabel] = useState(""); // 标签

    const handleCreateGameDocument = async (e) => {
        e.preventDefault();

        try {
            // 创建一个名为 "game" 的集合，并在其中创建一个比赛文档
            await setDoc(doc(firestore, "game", gameID), {
                g_id: gameID,
                g_date: date,
                g_opponent: opponent,
                g_court: court,
                g_name: name,
                g_recorder: recorder,
                g_ha: homeAway,
                g_label: label
            });

            alert("Game document created successfully!");
        } catch (error) {
            console.error("Error creating game document:", error);
        }
    };

    return (
        <div>
            <form onSubmit={handleCreateGameDocument}>
                <label>Game ID:</label>
                <input
                    type="text"
                    value={gameID || ''}
                    onChange={(e) => setGameID(e.target.value)}
                />
                <label>Date:</label>
                <input
                    type="date"
                    value={date || ''}
                    onChange={(e) => setDate(e.target.value)}
                />
                <label>Opponent:</label>
                <input
                    type="text"
                    value={opponent || ''}
                    onChange={(e) => setOpponent(e.target.value)}
                />
                <label>Court:</label>
                <input
                    type="text"
                    value={court || ''}
                    onChange={(e) => setCourt(e.target.value)}
                />
                <label>Name:</label>
                <input
                    type="text"
                    value={name || ''}
                    onChange={(e) => setName(e.target.value)}
                />
                <label>Recorder:</label>
                <input
                    type="text"
                    value={recorder || ''}
                    onChange={(e) => setRecorder(e.target.value)}
                />
                <label>Home/Away:</label>
                <input
                    type="text"
                    value={homeAway || ''}
                    onChange={(e) => setHomeAway(e.target.value)}
                />
                <label>Label:</label>
                <input
                    type="text"
                    value={label || ''}
                    onChange={(e) => setLabel(e.target.value)}
                />
                <button type="submit">Create Game Document</button>
            </form>
        </div>
    );
}
