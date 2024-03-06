import React, { useState } from "react";
import { firestore } from "./firebase"; // 正确的导入路径
import { addDoc, collection, doc, setDoc } from "firebase/firestore"; // 正确的导入语句

export default function CreateRecordDocumentButton() {
    const [recordID, setRecordID] = useState(""); // 记录ID
    const [innings, setInnings] = useState(""); // 局数
    const [score1, setScore1] = useState(""); // 分数1
    const [score2, setScore2] = useState(""); // 分数2

    const handleCreateRecordDocument = async (e) => {
        e.preventDefault();

        try {
            // 创建一个名为 "record" 的集合，并在其中创建一个记录文档
            await setDoc(doc(firestore, "record", recordID), {
                r_id: recordID,
                r_innings: innings,
                r_score1: score1,
                r_score2: score2
            });

            alert("Record document created successfully!");
        } catch (error) {
            console.error("Error creating record document:", error);
        }
    };

    return (
        <div>
            <form onSubmit={handleCreateRecordDocument}>
                <label>Record ID:</label>
                <input
                    type="text"
                    value={recordID || ''}
                    onChange={(e) => setRecordID(e.target.value)}
                />
                <label>Innings:</label>
                <input
                    type="text"
                    value={innings || ''}
                    onChange={(e) => setInnings(e.target.value)}
                />
                <label>Score 1:</label>
                <input
                    type="text"
                    value={score1 || ''}
                    onChange={(e) => setScore1(e.target.value)}
                />
                <label>Score 2:</label>
                <input
                    type="text"
                    value={score2 || ''}
                    onChange={(e) => setScore2(e.target.value)}
                />
                <button type="submit">Create Record Document</button>
            </form>
        </div>
    );
}
