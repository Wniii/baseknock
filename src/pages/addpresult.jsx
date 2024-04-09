import React, { useState } from "react";
import { firestore } from "./firebase"; // 正确的导入路径
import { addDoc, collection, doc, setDoc } from "firebase/firestore"; // 正确的导入语句

export default function CreatePitchResultDocumentButton() {
    const [prID, setPRID] = useState(""); // 投球结果ID
    const [strike, setStrike] = useState(0); // 三振
    const [ball, setBall] = useState(0); // 四球
    const [total, setTotal] = useState(0); // 投球总数
    const [style, setStyle] = useState(""); // 风格
    const [playerId, setPlayerId] = useState("");
    const [gameID, setGameID] = useState("");

    const handleCreatePitchResultDocument = async (e) => {
        e.preventDefault();

        try {
            // 创建一个名为 "pitch_result" 的集合，并在其中创建一个投球结果文档
            await setDoc(doc(firestore, "pitch_result", prID), {
                pr_id: prID,
                pr_strike: strike,
                pr_ball: ball,
                pr_total: total,
                pr_style: style,
                p_id: playerId,
                g_id: gameID
            });

            alert("Pitch Result document created successfully!");
        } catch (error) {
            console.error("Error creating pitch result document:", error);
        }
    };

    return (
        <div>
            <form onSubmit={handleCreatePitchResultDocument}>
                <label>Pitch Result ID:</label>
                <input
                    type="text"
                    value={prID || ''}
                    onChange={(e) => setPRID(e.target.value)}
                />
                <label>Strike:</label>
                <input
                    type="number"
                    value={strike || ''}
                    onChange={(e) => setStrike(parseInt(e.target.value))}
                />
                <label>Ball:</label>
                <input
                    type="number"
                    value={ball || ''}
                    onChange={(e) => setBall(parseInt(e.target.value))}
                />
                <label>Total:</label>
                <input
                    type="number"
                    value={total || ''}
                    onChange={(e) => setTotal(parseInt(e.target.value))}
                />
                <label>Style:</label>
                <input
                    type="text"
                    value={style || ''}
                    onChange={(e) => setStyle(e.target.value)}
                />
                <label>PlayerID:</label>
                <input
                    type="text"
                    value={playerId || ''}
                    onChange={(e) => setPlayerId(e.target.value)}
                />
                <label>GameID:</label>
                <input
                    type="text"
                    value={gameID || ''}
                    onChange={(e) => setGameID(e.target.value)}
                />
                <button type="submit">Create Pitch Result Document</button>
            </form>
        </div>
    );
}
