import React, { useState } from "react";
import { firestore } from "./firebase"; // 正确的导入路径
import { addDoc, collection, doc, setDoc } from "firebase/firestore"; // 正确的导入语句

export default function CreateUserDocumentButton() {
    const [userId, setUserId] = useState(""); // 用户ID
    const [password, setPassword] = useState(""); // 密码
    const [email, setEmail] = useState(""); // 电子邮件
    //const [playerId, setPlayerId] = useState(""); // 球员ID
    const [userName, setUserName] = useState(""); 
    const [checkpsw, setCheckpsw] = useState(""); 

    const handleCreateUserDocument = async (e) => {
        e.preventDefault();

        try {
            // 创建一个名为 "users" 的集合，并在其中创建一个用户文档
            await setDoc(doc(firestore, "users", userId), {
                u_id: userId,
                u_password: password,
                u_email: email,
                //p_id: playerId,
                u_name: userName,
                u_checkpsw: checkpsw,
            });

            alert("User document created successfully!");
        } catch (error) {
            console.error("Error creating user document:", error);
        }
    };

    return (
        <div>
            <form onSubmit={handleCreateUserDocument}>
                <label>User ID:</label>
                <input
                    type="text"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                />
                <label>Password:</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <label>Email:</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                {/* <label>Player ID:</label>
                <input
                    type="text"
                    value={playerId}
                    onChange={(e) => setPlayerId(e.target.value)}
                /> */}
                <button type="submit">Create User Document</button>
            </form>
        </div>
    );
}
