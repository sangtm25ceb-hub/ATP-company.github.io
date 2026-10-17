import {auth,db} from "./firebase-config.js";
import {signInWithEmailAndPassword as si,createUserWithEmailAndPassword as su,onAuthStateChanged as on,signOut} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {doc,getDoc,setDoc,collection,query,where,orderBy,limit,onSnapshot,addDoc,updateDoc,serverTimestamp} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
const $=id=>document.getElementById(id), msg=t=>$("msg").textContent=t;
const isStaff=u=>["staff","admin"].includes(u.role);
const ini=n=>(n||"?").trim().split(/\s+/).slice(-2).map(w=>w[0]).join("").toUpperCase();
const names={general:"Nhóm chung"};
let me,cur,unsub,unsubU;
window.onunhandledrejection=e=>msg("Lỗi: "+(e.reason&&(e.reason.code||e.reason.message)));
$("bin").onclick=()=>{msg("");si(auth,$("em").value.trim(),$("pw").value).catch(e=>msg("Lỗi: "+e.code))};
$("pw").onkeydown=e=>{if(e.key==="Enter")$("bin").click()};
$("bup").onclick=async()=>{
  if(!$("nm").value.trim())return msg("Nhập tên của bạn trước khi đăng ký");
  try{const c=await su(auth,$("em").value.trim(),$("pw").value);
    await setDoc(doc(db,"users",c.user.uid),{name:$("nm").value.trim(),role:"customer",approved:false});
    location.reload();}catch(e){msg("Lỗi: "+(e.code||e.message))}};
$("out").onclick=()=>signOut(auth);
on(auth,async u=>{
  if(!u){unsub&&unsub();unsubU&&unsubU();cur=null;$("login").hidden=false;$("app").hidden=true;return}
  try{
    const s=await getDoc(doc(db,"users",u.uid));
    if(!s.exists()||!s.data().approved){await signOut(auth);return msg("Tài khoản đang chờ admin duyệt.")}
    me={uid:u.uid,...s.data()};
    $("login").hidden=true;$("app").hidden=false;
    $("av").textContent=ini(me.name);$("meName").textContent=me.name;$("meRole").textContent=isStaff(me)?"Nhân viên ATP":"Khách hàng";
    const q=isStaff(me)?query(collection(db,"users"),where("approved","==",true)):query(collection(db,"users"),where("role","in",["staff","admin"]));
    unsubU=onSnapshot(q,sn=>{
      $("rooms").replaceChildren();lab("Kênh chung");add("general","#");lab(isStaff(me)?"Tin nhắn riêng":"Nhân viên ATP");
      sn.forEach(d=>{if(d.id===me.uid)return;const id=[me.uid,d.id].sort().join("_");names[id]=d.data().name;add(id,ini(d.data().name))});
      open(cur||"general")},e=>msg("Lỗi: "+e.code));
  }catch(e){msg("Lỗi: "+(e.code||e.message))}
});
function lab(t){const d=document.createElement("div");d.className="lab";d.textContent=t;$("rooms").append(d)}
function add(id,icon){const b=document.createElement("button"),i=document.createElement("i"),s=document.createElement("span");
  b.dataset.id=id;i.textContent=icon;s.textContent=names[id];b.append(i,s);b.onclick=()=>open(id);$("rooms").append(b)}
function fill(p,t){t.split(/(@[^\n]+)/).forEach((x,i)=>{if(i%2){const a=document.createElement("span");a.className="tag";a.textContent=x;p.append(a)}else p.append(x)})}
function open(id){
  document.querySelectorAll("#rooms button").forEach(b=>b.classList.toggle("on",b.dataset.id===id));
  if(id===cur)return;
  unsub&&unsub();cur=id;$("title").textContent=names[id];$("sub").textContent=id==="general"?"TẤT CẢ THÀNH VIÊN":"TIN NHẮN RIÊNG";
  unsub=onSnapshot(query(collection(db,"rooms",id,"messages"),orderBy("at"),limit(200)),sn=>{
    $("list").replaceChildren();
    sn.forEach(d=>{const m=d.data(),prog=m.type==="progress",mine=m.from===me.uid&&!prog;
      const e=document.createElement("div"),h=document.createElement("div"),n=document.createElement("b"),tm=document.createElement("time"),p=document.createElement("p");
      e.className="m"+(mine?" mine":"")+(prog?" prog":"")+(!m.recalled&&(m.tags||[]).includes(me.uid)?" tagged":"")+(m.recalled?" recalled":"");h.className="mh";
      n.textContent=prog?"CẬP NHẬT TIẾN ĐỘ":mine?"Bạn":m.fromName;
      tm.textContent=m.at?m.at.toDate().toLocaleTimeString("vi-VN",{hour:"2-digit",minute:"2-digit"}):"";
      if(m.recalled)p.textContent="Tin nhắn đã được thu hồi";else fill(p,m.text);h.append(n,tm);
      if(m.from===me.uid&&!m.recalled){const r=document.createElement("button");r.className="rc";r.textContent="Thu hồi";r.onclick=()=>recall(id,d.id);h.append(r)}
      e.append(h,p);$("list").append(e)});
    $("list").scrollTop=1e9},e=>msg("Lỗi: "+e.code));
}
$("f").onsubmit=async e=>{e.preventDefault();const t=$("t").value.trim();if(!t)return;$("t").value="";
  try{await addDoc(collection(db,"rooms",cur,"messages"),{from:me.uid,fromName:me.name,text:t,type:"text",at:serverTimestamp()})}catch(e){alert("Không gửi được: "+e.code)}};
async function recall(room,mid){
  if(!confirm("Thu hồi tin nhắn này? Mọi người sẽ không còn thấy nội dung."))return;
  try{await updateDoc(doc(db,"rooms",room,"messages",mid),{recalled:true,text:""})}catch(e){alert("Không thu hồi được: "+e.code)}}
