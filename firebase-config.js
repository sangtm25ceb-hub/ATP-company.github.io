import {initializeApp} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {getAuth} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {getFirestore} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
const app = initializeApp({apiKey:"AIzaSyCBK9avRf81eEV8hlfz6guqTsBDkhaiG8c",authDomain:"atp-company-de625.firebaseapp.com",projectId:"atp-company-de625",appId:"1:178704466689:web:4e6e409ddfc2e4f5589100"});
export const auth = getAuth(app), db = getFirestore(app);
