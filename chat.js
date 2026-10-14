import {auth,db} from "./firebase-config.js";
import {signInWithEmailAndPassword as si,createUserWithEmailAndPassword as su,onAuthStateChanged as on,signOut} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {doc,getDoc,setDoc,collection,query,where,orderBy,limit,onSnapshot,addDoc,serverTimestamp} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
const $=id=>document.getElementById(id), msg=t=>$("msg").textContent=t;
const isStaff=u=>["staff","admin"].includes(u.role);
let me,cur,unsub;
$("bin").onclick=()=>si(auth,$("em").value,$("pw").value).catch(()=>msg("Sai email hoặc mật khẩu"));
$("bup").onclick=async()=>{
  if(!$("nm").value.trim())return msg("Nhập tên của bạn trước khi đăng ký");
  try{const c=await su(auth,$("em").value,$("pw").value);
    await setDoc(doc(db,"users",c.user.uid),{name:$("nm").value.trim(),role:"customer",approved:false});
    location.reload();}catch(e){msg(e.message)}};
$("out").onclick=()=>signOut(auth);
on(auth,async u=>{
  if(!u){$("login").hidden=false;$("app").hidden=true;return}
  const s=await getDoc(doc(db,"users",u.uid));
  if(!s.exists()||!s.data().approved){await signOut(auth);return msg("Tài khoản đang chờ admin duyệt.")}
  me={uid:u.uid,...s.data()};
  $("login").hidden=true;$("app").hidden=false;$("me").textContent=me.name+" · "+(isStaff(me)?"Nhân viên ATP":"Khách hàng");
  const q=isStaff(me)?query(collection(db,"users"),where("approved","==",true)):query(collection(db,"users"),where("role","in",["staff","admin"]));
  onSnapshot(q,sn=>{$("rooms").replaceChildren();add("general","Nhóm chung");
    sn.forEach(d=>{if(d.id!==me.uid)add([me.uid,d.id].sort().join("_"),d.data().name)});open("general","Nhóm chung")});
});
function add(id,label){const b=document.createElement("button");b.textContent=label;b.onclick=()=>open(id,label);b.dataset.id=id;$("rooms").append(b)}
function open(id,title){
  unsub&&unsub();cur=id;$("title").textContent=title;
  document.querySelectorAll("#rooms button").forEach(b=>b.classList.toggle("on",b.dataset.id===id));
  unsub=onSnapshot(query(collection(db,"rooms",id,"messages"),orderBy("at"),limit(200)),sn=>{
    $("list").replaceChildren();
    sn.forEach(d=>{const m=d.data(),e=document.createElement("div"),b=document.createElement("b"),p=document.createElement("p");
      e.className="m"+(m.from===me.uid?" mine":"")+(m.type==="progress"?" prog":"")+((m.tags||[]).includes(me.uid)?" tagged":"");
      b.textContent=m.fromName;p.textContent=m.text;e.append(b,p);$("list").append(e)});
    $("list").scrollTop=1e9});
}
$("f").onsubmit=async e=>{e.preventDefault();const t=$("t").value.trim();if(!t)return;$("t").value="";
  await addDoc(collection(db,"rooms",cur,"messages"),{from:me.uid,fromName:me.name,text:t,type:"text",at:serverTimestamp()})};
