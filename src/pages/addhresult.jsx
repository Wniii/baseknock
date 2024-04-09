import React, { useState } from "react";
import { firestore } from "./firebase"; 
import { addDoc, collection, doc, setDoc } from "firebase/firestore"; 


export default function CreateHresultDocumentButton() {
    const [hresultId, setHitResultId] = useState(""); 
    const [一安, set一安] = useState(""); 
    const [二安, set二安] = useState(""); 
    const [三安, set三安] = useState(""); 
    const [全打, set全打] = useState("");
    const [三振, set三振] = useState("");
    const [四壞, set四壞] = useState("");
    const [觸身, set觸身] = useState("");
    const [飛球, set飛球] = useState("");
    const [滾地, set滾地] = useState("");
    const [失誤, set失誤] = useState("");
    const [野選, set野選] = useState("");
    const [雙殺, set雙殺] = useState("");
    const [違規, set違規] = useState("");
    const [犧飛, set犧飛] = useState("");
    const [犧觸, set犧觸] = useState("");
    const [不知, set不知] = useState("");
    const [好球數, set好球數] = useState("");
    const [壞球數, set壞球數] = useState("");
    const [壘上情形, set壘上情形] = useState("");
    const [出局數, set出局數] = useState("");
    const [playerId, setPlayerId] = useState("");
    const [gameID, setGameID] = useState("");


    const handleCreateUserDocument = async (e) => {
        e.preventDefault();

        try {
            // 创建一个名为 "users" 的集合，并在其中创建一个用户文档
            await setDoc(doc(firestore, "hresult", hresultId), {
                hr_id: hresultId,
                hr_1b: 一安,
                hr_2b: 二安,
                hr_3b: 三安,
                hr_hr: 全打,
                hr_so: 三振,
                hr_bb: 四壞,
                hr_hbp: 觸身,
                hr_fb: 飛球,
                hr_gb: 滾地,
                hr_e: 失誤,
                hr_fc: 野選,
                hr_dbp: 雙殺,
                hr_i: 違規,
                hr_sf: 犧飛,
                hr_sac: 犧觸,
                hr_pass: 不知,
                hr_s: 好球數,
                hr_b: 壞球數,
                hr_base: 壘上情形,
                hr_outs: 出局數,
                p_id: playerId,
                g_id: gameID,

            });

            alert("hresult document created successfully!");
        } catch (error) {
            console.error("Error creating hresult document:", error);
        }
    };

    return (
        <div>
            <form onSubmit={handleCreateUserDocument}>
                <label>打擊內容 ID:</label>
                <input
                    type="text"
                    value={hresultId}
                    onChange={(e) => setHitResultId(e.target.value)}
                />
                <label>一壘安打</label>
                <input
                    type="button"
                    value={一安}
                    onChange={(e) => set一安(e.target.value)}
                />
                <label>二壘安打</label>
                <input
                    type="button"
                    value={二安}
                    onChange={(e) => set二安(e.target.value)}
                />
                <label>三壘安打</label>
                <input
                    type="button"
                    value={三安}
                    onChange={(e) => set三安(e.target.value)}
                />
                <label>全打</label>
                <input
                    type="button"
                    value={全打}
                    onChange={(e) => set全打(e.target.value)}
                />
                <label>三振</label>
                <input
                    type="button"
                    value={三振}
                    onChange={(e) => set三振(e.target.value)}
                />
                <label>四壞</label>
                <input
                    type="button"
                    value={四壞}
                    onChange={(e) => set四壞(e.target.value)}
                />
                <label>觸身</label>
                <input
                    type="button"
                    value={觸身}
                    onChange={(e) => set觸身(e.target.value)}
                />
                <label>飛球</label>
                <input
                    type="button"
                    value={飛球}
                    onChange={(e) => set飛球(e.target.value)}
                />
                <label>滾地</label>
                <input
                    type="button"
                    value={滾地}
                    onChange={(e) => set滾地(e.target.value)}
                />
                <label>失誤</label>
                <input
                    type="button"
                    value={失誤}
                    onChange={(e) => set失誤(e.target.value)}
                />
                <label>野選</label>
                <input
                    type="button"
                    value={野選}
                    onChange={(e) => set野選(e.target.value)}
                />
                <label>雙殺</label>
                <input
                    type="button"
                    value={雙殺}
                    onChange={(e) => set雙殺(e.target.value)}
                />
                <label>違規</label>
                <input
                    type="button"
                    value={違規}
                    onChange={(e) => set違規(e.target.value)}
                />
                <label>犧飛</label>
                <input
                    type="button"
                    value={犧飛}
                    onChange={(e) => set犧飛(e.target.value)}
                />
                <label>犧觸</label>
                <input
                    type="button"
                    value={犧觸}
                    onChange={(e) => set犧觸(e.target.value)}
                />
                <label>不知</label>
                <input
                    type="button"
                    value={不知}
                    onChange={(e) => set不知(e.target.value)}
                />
                <label>好球數</label>
                <input
                    type="checkbox"
                    value={好球數}
                    onChange={(e) => set好球數(e.target.value)}
                />
                <label>壞球數</label>
                <input
                    type="checkbox"
                    value={壞球數}
                    onChange={(e) => set壞球數(e.target.value)}
                />
                <label>壘上情形</label>
                <input
                    type="checkbox"
                    value={壘上情形}
                    onChange={(e) => set壘上情形(e.target.value)}
                />
                <label>出局數</label>
                <input
                    type="checkbox"
                    value={出局數}
                    onChange={(e) => set出局數(e.target.value)}
                />
                <label>playerId</label>
                <input
                    type="text"
                    value={playerId}
                    onChange={(e) => setPlayerId(e.target.value)}
                />
                <label>gameID</label>
                <input
                    type="text"
                    value={gameID}
                    onChange={(e) => setGameID(e.target.value)}
                />
                <button type="submit">Create hit result</button>
            </form>
        </div>
    );
}
