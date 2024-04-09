import { firestore } from "./firebase";
import { doc, setDoc } from "firebase/firestore";

// 資料庫操作函數
export async function createHresultDocument(好球數, 壞球數, 出局數) {
    try {
        // 在資料庫中設置文件
        await setDoc(doc(firestore, "hresult", "your_document_id"), {
            好球數: 好球數,
            壞球數: 壞球數,
            出局數: 出局數,
        });
    } catch (error) {
        throw new Error("Error creating hresult document: " + error);
    }
}