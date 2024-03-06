import React, { useState } from "react";
import { firestore } from "./firebase"; // 正确的导入路径
import { addDoc, collection, doc, setDoc } from "firebase/firestore"; // 正确的导入语句

export default function CreateGlistDocumentButton() {
    const [glistID, setGlistID] = useState(""); // 先发球员名单ID
    const [home_p, setHome_p] = useState("");
    const [home_c, setHome_c] = useState(""); // 主队投手
    const [home_1b, setHome1b] = useState(""); // 主队一垒手
    const [home_2b, setHome2b] = useState(""); // 主队二垒手
    const [home_3b, setHome3b] = useState(""); // 主队三垒手
    const [home_ss, setHome_ss] = useState(""); // 主队游击手
    const [home_if, setHome_if] = useState(""); // 主队内野手
    const [home_cf, setHome_cf] = useState(""); // 主队中外野手
    const [home_rf, setHome_rf] = useState("");
    const [away_p, setAway_p] = useState(""); // 客队投手
    const [away_c, setAway_c] = useState(""); // 客队捕手
    const [away_1b, setAway_1b] = useState(""); // 客队一垒手
    const [away_2b, setAway_2b] = useState(""); // 客队二垒手
    const [away_3b, setAway_3b] = useState(""); // 客队三垒手
    const [away_ss, setAway_ss] = useState(""); // 客队游击手
    const [away_if, setAway_if] = useState(""); // 客队内野手
    const [away_cf, setAway_cf] = useState(""); // 客队中外野手
    const [away_rf, setAway_rf] = useState(""); // 客队右外野手

    const handleCreateGlistDocument = async (e) => {
        e.preventDefault();

        try {
            // 创建一个名为 "glist" 的集合，并在其中创建一个先发球员名单文档
            await setDoc(doc(firestore, "glist", glistID), {
                glist_id: glistID,
                home_p: home_p,
                home_c: home_c,
                home_1b: home_1b,
                home_2b: home_2b,
                home_3b: home_3b,
                home_ss: home_ss,
                home_if: home_if,
                home_cf: home_cf,
                home_rf: home_rf,
                away_p: away_p,
                away_c: away_c,
                away_1b: away_1b,
                away_2b: away_2b,
                away_3b: away_3b,
                away_ss: away_ss,
                away_if: away_if,
                away_cf: away_cf,
                away_rf: away_rf
            });

            alert("Glist document created successfully!");
        } catch (error) {
            console.error("Error creating glist document:", error);
        }
    };

    return (
        <div>
            <form onSubmit={handleCreateGlistDocument}>
                <label>Glist ID:</label>
                <input
                    type="text"
                    value={glistID || ''}
                    onChange={(e) => setGlistID(e.target.value)}
                />
                <label>Home Pitcher:</label>
                <input
                    type="text"
                    value={home_p || ''}
                    onChange={(e) => setHome_p(e.target.value)}
                />
                <label>Home Catcher:</label>
                <input
                    type="text"
                    value={home_c || ''}
                    onChange={(e) => setHome_c(e.target.value)}
                />
                <label>Home 1st Baseman:</label>
                <input
                    type="text"
                    value={home_1b || ''}
                    onChange={(e) => setHome1b(e.target.value)}
                />
                <label>Home 2nd Baseman:</label>
                <input
                    type="text"
                    value={home_2b || ''}
                    onChange={(e) => setHome2b(e.target.value)}
                />
                <label>Home 3rd Baseman:</label>
                <input
                    type="text"
                    value={home_3b || ''}
                    onChange={(e) => setHome3b(e.target.value)}
                />
                <label>Home Shortstop:</label>
                <input
                    type="text"
                    value={home_ss || ''}
                    onChange={(e) => setHome_ss(e.target.value)}
                />
                <label>Home Infielder:</label>
                <input
                    type="text"
                    value={home_if || ''}
                    onChange={(e) => setHome_if(e.target.value)}
                />
                <label>Home Center Fielder:</label>
                <input
                    type="text"
                    value={home_cf || ''}
                    onChange={(e) => setHome_cf(e.target.value)}
                />
                <label>Home Right Fielder:</label>
                <input
                    type="text"
                    value={home_rf || ''}
                    onChange={(e) => setHome_rf(e.target.value)}
                />
                <label>Away Pitcher:</label>
                <input
                    type="text"
                    value={away_p || ''}
                    onChange={(e) => setAway_p(e.target.value)}
                />
                <label>Away Catcher:</label>
                <input
                    type="text"
                    value={away_c || ''}
                    onChange={(e) => setAway_c(e.target.value)}
                />
                <label>Away 1st Baseman:</label>
                <input
                    type="text"
                    value={away_1b || ''}
                    onChange={(e) => setAway_1b(e.target.value)}
                />
                <label>Away 2nd Baseman:</label>
                <input
                    type="text"
                    value={away_2b || ''}
                    onChange={(e) => setAway_2b(e.target.value)}
                />
                <label>Away 3rd Baseman:</label>
                <input
                    type="text"
                    value={away_3b || ''}
                    onChange={(e) => setAway_3b(e.target.value)}
                />
                <label>Away Shortstop:</label>
                <input
                    type="text"
                    value={away_ss || ''}
                    onChange={(e) => setAway_ss(e.target.value)}
                />
                <label>Away Infielder:</label>
                <input
                    type="text"
                    value={away_if || ''}
                    onChange={(e) => setAway_if(e.target.value)}
                />
                <label>Away Center Fielder:</label>
                <input
                    type="text"
                    value={away_cf || ''}
                    onChange={(e) => setAway_cf(e.target.value)}
                />
                <label>Away Right Fielder:</label>
                <input
                    type="text"
                    value={away_rf || ''}
                    onChange={(e) => setAway_rf(e.target.value)}
                />
                <button type="submit">Create Glist Document</button>
            </form>
        </div>
    );
}
