import {initializeApp} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {getAuth} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {getFirestore} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
// Dán cấu hình Firebase của bạn vào đây (Project settings > Your apps > Web app)
const app = initializeApp({apiKey:"DAN_VAO",authDomain:"DAN_VAO",projectId:"DAN_VAO",appId:"DAN_VAO"});
export const auth = getAuth(app), db = getFirestore(app);
