import React, { useState } from "react";
import { firestore } from "./firebase"; // 正确的导入路径
import { addDoc, collection, doc, setDoc } from "firebase/firestore"; // 正确的导入语句

export default function CreateErrorDocumentButton() {
    const [errorID, setErrorID] = useState(""); // 错误ID
    const [count, setCount] = useState(0); // 计数
    const [playerId, setPlayerId] = useState("");
    const [gameID, setGameID] = useState("");

    const handleCreateErrorDocument = async (e) => {
        e.preventDefault();

        try {
            // 创建一个名为 "error" 的集合，并在其中创建一个错误文档
            await setDoc(doc(firestore, "error", errorID), {
                e_id: errorID,
                e_count: count,
                p_id: playerId,
                g_id: gameID
            });

            alert("Error document created successfully!");
        } catch (error) {
            console.error("Error creating error document:", error);
        }
    };

    return (
        <div>
            <form onSubmit={handleCreateErrorDocument}>
                <label>Error ID:</label>
                <input
                    type="text"
                    value={errorID || ''}
                    onChange={(e) => setErrorID(e.target.value)}
                />
                <label>Count:</label>
                <input
                    type="number"
                    value={count || ''}
                    onChange={(e) => setCount(parseInt(e.target.value))}
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
                <button type="submit">Create Error Document</button>
            </form>
        </div>
    );
}
