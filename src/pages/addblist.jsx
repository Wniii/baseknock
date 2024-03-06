import React, { useState } from "react";
import { firestore } from "./firebase"; // 正确的导入路径
import { addDoc, collection, doc, setDoc } from "firebase/firestore"; // 正确的导入语句

export default function CreateBlistDocumentButton() {
    const [blistID, setBlistID] = useState(""); // 先发棒次名单ID
    const [home1, setHome1] = useState(""); // 主队棒次一
    const [home2, setHome2] = useState(""); // 主队棒次二
    const [home3, setHome3] = useState(""); // 主队棒次三
    const [home4, setHome4] = useState(""); // 主队棒次四
    const [home5, setHome5] = useState(""); // 主队棒次五
    const [home6, setHome6] = useState(""); // 主队棒次六
    const [home7, setHome7] = useState(""); // 主队棒次七
    const [home8, setHome8] = useState(""); // 主队棒次八
    const [home9, setHome9] = useState(""); // 主队棒次九
    const [away1, setAway1] = useState(""); // 客队棒次一
    const [away2, setAway2] = useState(""); // 客队棒次二
    const [away3, setAway3] = useState(""); // 客队棒次三
    const [away4, setAway4] = useState(""); // 客队棒次四
    const [away5, setAway5] = useState(""); // 客队棒次五
    const [away6, setAway6] = useState(""); // 客队棒次六
    const [away7, setAway7] = useState(""); // 客队棒次七
    const [away8, setAway8] = useState(""); // 客队棒次八
    const [away9, setAway9] = useState(""); // 客队棒次九

    const handleCreateBlistDocument = async (e) => {
        e.preventDefault();

        try {
            // 创建一个名为 "blist" 的集合，并在其中创建一个先发棒次名单文档
            await setDoc(doc(firestore, "blist", blistID), {
                blist_id: blistID,
                home_1: home1,
                home_2: home2,
                home_3: home3,
                home_4: home4,
                home_5: home5,
                home_6: home6,
                home_7: home7,
                home_8: home8,
                home_9: home9,
                away_1: away1,
                away_2: away2,
                away_3: away3,
                away_4: away4,
                away_5: away5,
                away_6: away6,
                away_7: away7,
                away_8: away8,
                away_9: away9
            });

            alert("Blist document created successfully!");
        } catch (error) {
            console.error("Error creating blist document:", error);
        }
    };

    return (
        <div>
            <form onSubmit={handleCreateBlistDocument}>
                <label>Blist ID:</label>
                <input
                    type="text"
                    value={blistID || ''}
                    onChange={(e) => setBlistID(e.target.value)}
                />
                <label>Home 1:</label>
                <input
                    type="text"
                    value={home1 || ''}
                    onChange={(e) => setHome1(e.target.value)}
                />
                <label>Home 2:</label>
                <input
                    type="text"
                    value={home2 || ''}
                    onChange={(e) => setHome2(e.target.value)}
                />
                <label>Home 3:</label>
                <input
                    type="text"
                    value={home3 || ''}
                    onChange={(e) => setHome3(e.target.value)}
                />
                <label>Home 4:</label>
                <input
                    type="text"
                    value={home4 || ''}
                    onChange={(e) => setHome4(e.target.value)}
                />
                <label>Home 5:</label>
                <input
                    type="text"
                    value={home5 || ''}
                    onChange={(e) => setHome5(e.target.value)}
                />
                <label>Home 6:</label>
                <input
                    type="text"
                    value={home6 || ''}
                    onChange={(e) => setHome6(e.target.value)}
                />
                <label>Home 7:</label>
                <input
                    type="text"
                    value={home7 || ''}
                    onChange={(e) => setHome7(e.target.value)}
                />
                <label>Home 8:</label>
                <input
                    type="text"
                    value={home8 || ''}
                    onChange={(e) => setHome8(e.target.value)}
                />
                <label>Home 9:</label>
                <input
                    type="text"
                    value={home9 || ''}
                    onChange={(e) => setHome9(e.target.value)}
                />
                <label>Away 1:</label>
                <input
                    type="text"
                    value={away1 || ''}
                    onChange={(e) => setAway1(e.target.value)}
                />
                <label>Away 2:</label>
                <input
                    type="text"
                    value={away2 || ''}
                    onChange={(e) => setAway2(e.target.value)}
                />
                <label>Away 3:</label>
                <input
                    type="text"
                    value={away3 || ''}
                    onChange={(e) => setAway3(e.target.value)}
                />
                <label>Away 4:</label>
                <input
                    type="text"
                    value={away4 || ''}
                    onChange={(e) => setAway4(e.target.value)}
                />
                <label>Away 5:</label>
                <input
                    type="text"
                    value={away5 || ''}
                    onChange={(e) => setAway5(e.target.value)}
                />
                <label>Away 6:</label>
                <input
                    type="text"
                    value={away6 || ''}
                    onChange={(e) => setAway6(e.target.value)}
                />
                <label>Away 7:</label>
                <input
                    type="text"
                    value={away7 || ''}
                    onChange={(e) => setAway7(e.target.value)}
                />
                <label>Away 8:</label>
                <input
                    type="text"
                    value={away8 || ''}
                    onChange={(e) => setAway8(e.target.value)}
                />
                <label>Away 9:</label>
                <input
                    type="text"
                    value={away9 || ''}
                    onChange={(e) => setAway9(e.target.value)}
                />
                <button type="submit">Create Blist Document</button>
            </form>
        </div>
    );
}
