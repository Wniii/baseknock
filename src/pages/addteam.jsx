import React, { useState } from "react";
import { firestore } from "./firebase"; // 正确的导入路径
import { addDoc, collection, doc, setDoc } from "firebase/firestore"; // 正确的导入语句

export default function CreateTeamDocumentButton() {
    const [teamId, setTeamId] = useState(""); // 球队ID
    const [name, setName] = useState(""); // 球队名称
    const [school, setSchool] = useState(""); // 学校
    const [coach, setCoach] = useState(""); // 教练
    const [manager, setManager] = useState(""); // 经理
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
                t_game: game,
                t_win: win,
                t_lose: lose,
                t_tie: tie,
                t_pct: pct
            });

            alert("Team document created successfully!");
        } catch (error) {
            console.error("Error creating team document:", error);
        }
    };

    return (
        <div>
            <form onSubmit={handleCreateTeamDocument}>
                <label>Team ID:</label>
                <input
                    type="text"
                    value={teamId || ''}
                    onChange={(e) => setTeamId(e.target.value)}
                />
                <label>Name:</label>
                <input
                    type="text"
                    value={name || ''}
                    onChange={(e) => setName(e.target.value)}
                />
                <label>School:</label>
                <input
                    type="text"
                    value={school || ''}
                    onChange={(e) => setSchool(e.target.value)}
                />
                <label>Coach:</label>
                <input
                    type="text"
                    value={coach || ''}
                    onChange={(e) => setCoach(e.target.value)}
                />
                <label>Manager:</label>
                <input
                    type="text"
                    value={manager || ''}
                    onChange={(e) => setManager(e.target.value)}
                />
                <label>Game:</label>
                <input
                    type="number"
                    value={game || ''}
                    onChange={(e) => setGame(parseInt(e.target.value))}
                />
                <label>Win:</label>
                <input
                    type="number"
                    value={win || ''}
                    onChange={(e) => setWin(parseInt(e.target.value))}
                />
                <label>Lose:</label>
                <input
                    type="number"
                    value={lose || ''}
                    onChange={(e) => setLose(parseInt(e.target.value))}
                />
                <label>Tie:</label>
                <input
                    type="number"
                    value={tie || ''}
                    onChange={(e) => setTie(parseInt(e.target.value))}
                />
                <label>PCT:</label>
                <input
                    type="number"
                    value={pct || ''}
                    onChange={(e) => setPCT(parseInt(e.target.value))}
                />
                <button type="submit">Create Team Document</button>
            </form>
        </div>
    );
}
