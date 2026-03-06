import { useState, useMemo } from "react";

const INITIAL_BOOKS = [
  { id:1, title:"The Pragmatic Programmer", author:"Hunt & Thomas", genre:"Technology", copies:3, available:2, cover:"📘" },
  { id:2, title:"Clean Code", author:"Robert C. Martin", genre:"Technology", copies:2, available:0, cover:"📗" },
  { id:3, title:"Design Patterns", author:"Gang of Four", genre:"Technology", copies:4, available:3, cover:"📙" },
  { id:4, title:"Sapiens", author:"Yuval Noah Harari", genre:"History", copies:3, available:2, cover:"📕" },
  { id:5, title:"Dune", author:"Frank Herbert", genre:"Sci-Fi", copies:2, available:2, cover:"📔" },
  { id:6, title:"Thinking, Fast and Slow", author:"Daniel Kahneman", genre:"Psychology", copies:2, available:0, cover:"📒" },
  { id:7, title:"Introduction to Algorithms", author:"Cormen et al.", genre:"Technology", copies:5, available:3, cover:"📘" },
  { id:8, title:"The Selfish Gene", author:"Richard Dawkins", genre:"Science", copies:2, available:1, cover:"📗" },
];

const INITIAL_STUDENTS = [
  { id:1, name:"Priya Sharma",  email:"priya@aditya.edu",  rollNo:"CS2201", dept:"CSE",  phone:"9876543210" },
  { id:2, name:"Arjun Reddy",   email:"arjun@aditya.edu",  rollNo:"EC2205", dept:"ECE",  phone:"9876543211" },
  { id:3, name:"Neha Singh",    email:"neha@aditya.edu",   rollNo:"ME2209", dept:"MECH", phone:"9876543212" },
  { id:4, name:"Vikram Patel",  email:"vikram@aditya.edu", rollNo:"CS2215", dept:"CSE",  phone:"9876543213" },
  { id:5, name:"Rohan Mehta",   email:"rohan@aditya.edu",  rollNo:"CS2218", dept:"CSE",  phone:"9876543214" },
  { id:6, name:"Ananya Iyer",   email:"ananya@aditya.edu", rollNo:"IT2203", dept:"IT",   phone:"9876543215" },
];

const TODAY = "2026-02-26";

const INITIAL_BORROWINGS = [
  { id:1, studentId:1, bookId:2, borrowed:"2026-02-10", due:"2026-03-10", returned:null,         fine:0,  finePaid:false },
  { id:2, studentId:1, bookId:6, borrowed:"2026-01-15", due:"2026-02-20", returned:null,         fine:45, finePaid:false },
  { id:3, studentId:2, bookId:1, borrowed:"2026-02-10", due:"2026-03-10", returned:null,         fine:0,  finePaid:false },
  { id:4, studentId:3, bookId:7, borrowed:"2026-01-20", due:"2026-02-20", returned:null,         fine:30, finePaid:false },
  { id:5, studentId:4, bookId:4, borrowed:"2026-02-05", due:"2026-03-05", returned:"2026-02-25", fine:0,  finePaid:false },
  { id:6, studentId:5, bookId:8, borrowed:"2025-12-01", due:"2026-01-01", returned:null,         fine:105,finePaid:false },
  { id:7, studentId:1, bookId:3, borrowed:"2025-11-01", due:"2025-12-01", returned:"2025-11-28", fine:0,  finePaid:false },
  { id:8, studentId:1, bookId:4, borrowed:"2025-09-15", due:"2025-10-15", returned:"2025-10-19", fine:20, finePaid:true  },
];

// ─── helpers ─────────────────────────────────────────────────────────────────
const isOverdue = b => !b.returned && b.due < TODAY;
const calcFine  = b => {
  if (b.returned || !isOverdue(b)) return b.fine;
  return Math.floor((new Date(TODAY) - new Date(b.due)) / 86400000) * 5;
};
const getStatus = b => b.returned ? "Returned" : isOverdue(b) ? "Overdue" : "Active";

// ─── styles ──────────────────────────────────────────────────────────────────
const C = {
  bg:"#0d0f14", bg2:"#080a0e", gold:"#a08850", goldLight:"#d4af5f",
  text:"#e8e0d0", muted:"#7a7270", border:"rgba(212,175,95,0.15)",
  green:"#5de896", red:"#e8655d", blue:"#5d9de8", amber:"#e8c05d",
};
const font = "'Crimson Pro',Georgia,serif";

const S = {
  // layout
  page:   { minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", background:C.bg, fontFamily:font, color:C.text },
  shell:  { display:"flex", minHeight:"100vh", background:C.bg, fontFamily:font, color:C.text },
  main:   { flex:1, padding:"2.5rem 3rem", overflowY:"auto", maxHeight:"100vh" },
  sidebar:{ width:220, background:C.bg2, borderRight:`1px solid ${C.border}`, display:"flex", flexDirection:"column", flexShrink:0 },
  // text
  h1:     { fontSize:"2rem", fontWeight:400, fontStyle:"italic", marginBottom:"0.2rem", color:C.text },
  sub:    (mb="2.5rem") => ({ fontSize:"0.7rem", letterSpacing:"0.25em", textTransform:"uppercase", color:C.gold, marginBottom:mb }),
  label:  { fontSize:"0.7rem", letterSpacing:"0.15em", textTransform:"uppercase", color:C.gold, marginBottom:"0.35rem", display:"block" },
  // inputs
  input:  { width:"100%", padding:"0.75rem 1rem", background:"rgba(255,255,255,0.04)", border:`1px solid ${C.border}`, color:C.text, fontSize:"0.95rem", outline:"none", boxSizing:"border-box", fontFamily:font, borderRadius:2 },
  // buttons
  btn:(v="gold") => {
    const map = {
      gold:   { bg:C.gold,    fg:"#0d0f14", bd:"none" },
      outline:{ bg:"transparent", fg:C.gold, bd:`1px solid rgba(212,175,95,0.3)` },
      green:  { bg:"#1a4a2a", fg:C.green, bd:`1px solid rgba(93,232,150,0.3)` },
      red:    { bg:"#4a1a1a", fg:C.red,   bd:`1px solid rgba(232,101,93,0.3)` },
    };
    const t = map[v];
    return { padding:"0.45rem 1.1rem", background:t.bg, border:t.bd, color:t.fg, fontSize:"0.75rem", letterSpacing:"0.12em", textTransform:"uppercase", cursor:"pointer", fontFamily:font, fontWeight:600, borderRadius:2, whiteSpace:"nowrap" };
  },
  // table
  table:  { width:"100%", borderCollapse:"collapse", fontSize:"0.9rem" },
  th:     { textAlign:"left", padding:"0.7rem 1rem", fontSize:"0.65rem", letterSpacing:"0.2em", textTransform:"uppercase", color:C.gold, borderBottom:`1px solid ${C.border}`, fontWeight:400 },
  td:     { padding:"0.8rem 1rem", borderBottom:"1px solid rgba(255,255,255,0.04)", color:"#c8c0b0", verticalAlign:"middle" },
  // badge
  badge:(t) => {
    const m = { Active:{bg:"#2a7a4a",c:C.green}, Overdue:{bg:"#7a2a2a",c:C.red}, Returned:{bg:"#2a4a7a",c:C.blue},
                Available:{bg:"#2a6a3a",c:C.green}, Unavailable:{bg:"#5a4a2a",c:C.amber},
                Paid:{bg:"#2a4a7a",c:C.blue}, Unpaid:{bg:"#7a2a2a",c:C.red} };
    const r = m[t] || {bg:"#333",c:"#fff"};
    return { padding:"0.2rem 0.6rem", background:r.bg, color:r.c, fontSize:"0.68rem", letterSpacing:"0.1em", textTransform:"uppercase", borderRadius:20, display:"inline-block" };
  },
  // card
  card:   { padding:"1.5rem", border:`1px solid ${C.border}`, background:"rgba(255,255,255,0.02)", borderRadius:2 },
  // alert
  alert:(t) => ({ padding:"1rem 1.5rem", background:t==="warn"?"rgba(122,42,42,0.3)":"rgba(42,122,74,0.3)", border:`1px solid ${t==="warn"?"rgba(232,101,93,0.3)":"rgba(93,232,150,0.3)"}`, borderRadius:2, marginBottom:"1.5rem", color:t==="warn"?"#e8c0b0":"#b0e8c0", fontSize:"0.9rem" }),
  // nav
  nav:(active) => ({ padding:"0.72rem 1.5rem", cursor:"pointer", fontSize:"0.85rem", color:active?C.goldLight:C.muted, background:active?"rgba(212,175,95,0.06)":"transparent", borderLeft:active?`2px solid ${C.goldLight}`:"2px solid transparent", transition:"all 0.2s", display:"flex", alignItems:"center", gap:"0.5rem" }),
  // modal
  overlay:{ position:"fixed", inset:0, background:"rgba(0,0,0,0.75)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:1000 },
  modalBox:{ background:"#141618", border:`1px solid ${C.border}`, borderRadius:2, padding:"2rem", width:460, maxWidth:"90vw", maxHeight:"85vh", overflowY:"auto" },
};

// ─── small components ─────────────────────────────────────────────────────────
function Modal({ title, onClose, children }) {
  return (
    <div style={S.overlay} onClick={e => e.target===e.currentTarget && onClose()}>
      <div style={S.modalBox}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"1.5rem" }}>
          <span style={{ fontSize:"1.25rem", fontStyle:"italic", color:C.text }}>{title}</span>
          <button onClick={onClose} style={{ background:"none", border:"none", color:C.muted, fontSize:"1.2rem", cursor:"pointer" }}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Field({ label, value, onChange, type="text", placeholder="" }) {
  return (
    <div style={{ marginBottom:"1rem" }}>
      <label style={S.label}>{label}</label>
      <input style={S.input} type={type} value={value} placeholder={placeholder}
        onChange={e => onChange(e.target.value)} />
    </div>
  );
}

function Picker({ label, value, onChange, options }) {
  return (
    <div style={{ marginBottom:"1rem" }}>
      <label style={S.label}>{label}</label>
      <select style={{ ...S.input, cursor:"pointer" }} value={value} onChange={e => onChange(e.target.value)}>
        <option value="">— Select —</option>
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}

function StatCard({ value, label, color }) {
  return (
    <div style={S.card}>
      <div style={{ fontSize:"2rem", fontWeight:400, color:color||C.goldLight }}>{value}</div>
      <div style={{ fontSize:"0.7rem", letterSpacing:"0.2em", textTransform:"uppercase", color:C.muted, marginTop:"0.25rem" }}>{label}</div>
    </div>
  );
}

function TabBtn({ id, active, onClick, children }) {
  return <button style={{ ...S.btn("outline"), ...(active?{background:"rgba(212,175,95,0.12)", borderColor:C.gold}:{}) }} onClick={() => onClick(id)}>{children}</button>;
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  // state
  const [portal, setPortal]   = useState("landing");
  const [books,   setBooks]   = useState(INITIAL_BOOKS);
  const [students,setStudents]= useState(INITIAL_STUDENTS);
  const [borrows, setBorrows] = useState(INITIAL_BORROWINGS);
  const [hover,   setHover]   = useState(null);

  // auth
  const [email, setEmail] = useState("");
  const [pass,  setPass]  = useState("");
  const [authErr,setAuthErr] = useState("");

  // student ui
  const [sTab,  setSTab]  = useState("dashboard");
  const [sCatQ, setSCatQ] = useState("");
  const [sFineF,setSFineF]= useState("all");
  const [sreqs, setSreqs] = useState({});

  // admin ui
  const [aTab,  setATab]  = useState("dashboard");
  const [aStuQ, setAStuQ] = useState("");
  const [aBkQ,  setABkQ]  = useState("");
  const [aBorF, setABorF] = useState("All");
  const [aBorQ, setABorQ] = useState("");
  const [aFinF, setAFinF] = useState("Unpaid");
  const [aRpt,  setARpt]  = useState(null);

  // modals
  const [modal, setModal] = useState(null);

  // modal form state
  const [newBorrow,  setNewBorrow]  = useState({ studentId:"", bookId:"", due:"" });
  const [newBook,    setNewBook]    = useState({ title:"", author:"", genre:"", copies:"1", cover:"📘" });
  const [editBook,   setEditBook]   = useState(null);
  const [newStudent, setNewStudent] = useState({ name:"", email:"", rollNo:"", dept:"", phone:"" });

  // ── derived ──────────────────────────────────────────────────────────────
  const STUDENT_ID = 1;
  const getBook = id => books.find(b => b.id===id) || { title:"Unknown", author:"", cover:"📚" };
  const getStu  = id => students.find(s => s.id===id) || { name:"Unknown", rollNo:"", dept:"" };

  const allFull = useMemo(() => borrows.map(b => ({
    ...b, book:getBook(b.bookId), student:getStu(b.studentId),
    status:getStatus(b), fineAmt:calcFine(b),
  })), [borrows, books, students]);

  const myBorrows = allFull.filter(b => b.studentId===STUDENT_ID);
  const myActive  = myBorrows.filter(b => !b.returned);
  const myOverdue = myActive.filter(b => isOverdue(b));
  const myFinesTotal = myBorrows.filter(b=>!b.finePaid).reduce((s,b)=>s+b.fineAmt,0);

  // ── actions ───────────────────────────────────────────────────────────────
  const login = type => {
    if (type==="student" && email==="student@aditya.edu" && pass==="password") {
      setPortal("student"); setSTab("dashboard"); setAuthErr("");
    } else if (type==="admin" && email==="admin@library.edu" && pass==="admin123") {
      setPortal("admin"); setATab("dashboard"); setAuthErr("");
    } else {
      setAuthErr(`Try: ${type==="student"?"student@aditya.edu / password":"admin@library.edu / admin123"}`);
    }
  };
  const signOut = () => { setPortal("landing"); setEmail(""); setPass(""); setAuthErr(""); };

  const payFine = id => setBorrows(bs => bs.map(b => b.id===id ? {...b, finePaid:true} : b));
  const markPaid= id => setBorrows(bs => bs.map(b => b.id===id ? {...b, finePaid:true} : b));

  const recordReturn = id => {
    const bw = borrows.find(b => b.id===id);
    if (!bw) return;
    const fine = calcFine(bw);
    setBorrows(bs => bs.map(b => b.id===id ? {...b, returned:TODAY, fine} : b));
    setBooks(bks => bks.map(bk => bk.id===bw.bookId ? {...bk, available:bk.available+1} : bk));
  };

  const submitBorrow = () => {
    const sid=parseInt(newBorrow.studentId), bid=parseInt(newBorrow.bookId);
    const bk=books.find(b=>b.id===bid);
    if (!sid||!bid||!newBorrow.due||!bk||bk.available<1) return;
    const id=Math.max(...borrows.map(b=>b.id))+1;
    setBorrows(bs=>[...bs,{id,studentId:sid,bookId:bid,borrowed:TODAY,due:newBorrow.due,returned:null,fine:0,finePaid:false}]);
    setBooks(bks=>bks.map(b=>b.id===bid?{...b,available:b.available-1}:b));
    setNewBorrow({studentId:"",bookId:"",due:""});
    setModal(null);
  };

  const submitBook = () => {
    if (!newBook.title||!newBook.author) return;
    const id=Math.max(...books.map(b=>b.id))+1;
    const n=parseInt(newBook.copies)||1;
    setBooks(bks=>[...bks,{...newBook,id,copies:n,available:n}]);
    setNewBook({title:"",author:"",genre:"",copies:"1",cover:"📘"});
    setModal(null);
  };

  const submitEditBook = () => {
    setBooks(bks=>bks.map(b=>b.id===editBook.id?editBook:b));
    setModal(null); setEditBook(null);
  };

  const removeBook = id => { if(window.confirm("Remove this book?")) setBooks(bks=>bks.filter(b=>b.id!==id)); };

  const submitStudent = () => {
    if (!newStudent.name||!newStudent.email||!newStudent.rollNo) return;
    const id=Math.max(...students.map(s=>s.id))+1;
    setStudents(ss=>[...ss,{...newStudent,id}]);
    setNewStudent({name:"",email:"",rollNo:"",dept:"",phone:""});
    setModal(null);
  };

  const removeStudent = id => { if(window.confirm("Remove this student?")) setStudents(ss=>ss.filter(s=>s.id!==id)); };

  // ── LANDING ───────────────────────────────────────────────────────────────
  if (portal==="landing") return (
    <div style={{ minHeight:"100vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
      background:"linear-gradient(135deg,#0d0f14 0%,#1a1c24 50%,#0d0f14 100%)", fontFamily:font, color:C.text, position:"relative", overflow:"hidden" }}>
      <div style={{ position:"absolute", inset:0, backgroundImage:"repeating-linear-gradient(0deg,transparent,transparent 60px,rgba(212,175,95,0.04) 60px,rgba(212,175,95,0.04) 61px),repeating-linear-gradient(90deg,transparent,transparent 60px,rgba(212,175,95,0.04) 60px,rgba(212,175,95,0.04) 61px)" }} />
      <div style={{ position:"relative", zIndex:1, textAlign:"center", padding:"0 2rem" }}>
        <div style={{ fontSize:"0.7rem", letterSpacing:"0.35em", textTransform:"uppercase", color:C.gold, marginBottom:"1rem" }}>Aditya University</div>
        <h1 style={{ fontSize:"clamp(2.5rem,6vw,5rem)", fontWeight:400, letterSpacing:"0.08em", fontStyle:"italic", marginBottom:"0.25rem" }}>Library Portal</h1>
        <div style={{ fontSize:"0.85rem", letterSpacing:"0.3em", textTransform:"uppercase", color:C.gold, marginBottom:"3rem" }}>Knowledge Preserved · Access Granted</div>
        <div style={{ display:"flex", gap:"2rem", flexWrap:"wrap", justifyContent:"center" }}>
          {[{k:"sl",icon:"🎓",lbl:"Student Access",t:"Student Portal"},{k:"al",icon:"🏛️",lbl:"Administrator",t:"Admin Portal"}].map(c=>(
            <div key={c.k} onMouseEnter={()=>setHover(c.k)} onMouseLeave={()=>setHover(null)}
              style={{ width:260,padding:"2.5rem 2rem",border:"1px solid rgba(212,175,95,0.25)",
                background:hover===c.k?"rgba(212,175,95,0.08)":"rgba(255,255,255,0.02)",
                cursor:"pointer",transition:"all 0.3s",textAlign:"center",borderRadius:2 }}
              onClick={()=>{setPortal(c.k==="sl"?"student-login":"admin-login");setEmail("");setPass("");setAuthErr("");}}>
              <div style={{fontSize:"2.5rem",marginBottom:"1rem"}}>{c.icon}</div>
              <div style={{fontSize:"0.75rem",letterSpacing:"0.25em",textTransform:"uppercase",color:C.gold,marginBottom:"0.5rem"}}>{c.lbl}</div>
              <div style={{fontSize:"1.5rem",color:C.text}}>{c.t}</div>
            </div>
          ))}
        </div>
        <div style={{marginTop:"4rem",fontSize:"0.75rem",color:"#4a4540"}}>© 2026 Aditya University Library</div>
      </div>
    </div>
  );

  // ── AUTH SCREENS ──────────────────────────────────────────────────────────
  if (portal==="student-login"||portal==="admin-login") {
    const isS = portal==="student-login";
    return (
      <div style={S.page}>
        <div style={{ width:380,padding:"3rem 2.5rem",border:`1px solid ${C.border}`,background:"rgba(255,255,255,0.02)",borderRadius:2 }}>
          <div style={{fontSize:"1.5rem",marginBottom:"1rem"}}>{isS?"🎓":"🏛️"}</div>
          <div style={{fontSize:"1.8rem",fontStyle:"italic",color:C.text,marginBottom:"0.25rem"}}>{isS?"Student Portal":"Admin Portal"}</div>
          <div style={{fontSize:"0.75rem",letterSpacing:"0.2em",textTransform:"uppercase",color:C.gold,marginBottom:"2rem"}}>
            {isS?"College Email Authentication":"Library Administration"}
          </div>
          {authErr && <div style={{color:"#e05c5c",fontSize:"0.85rem",marginBottom:"1rem"}}>{authErr}</div>}
          <div style={{marginBottom:"1rem"}}>
            <input style={S.input} type="email" placeholder={isS?"student@aditya.edu":"admin@library.edu"} value={email} onChange={e=>setEmail(e.target.value)} />
          </div>
          <div style={{marginBottom:"1.25rem"}}>
            <input style={S.input} type="password" placeholder="Password" value={pass} onChange={e=>setPass(e.target.value)}
              onKeyDown={e=>e.key==="Enter"&&login(isS?"student":"admin")} />
          </div>
          <button style={{...S.btn("gold"),width:"100%",padding:"0.85rem",fontSize:"0.8rem"}} onClick={()=>login(isS?"student":"admin")}>
            {isS?"Sign In with College ID":"Sign In as Administrator"}
          </button>
          <div style={{fontSize:"0.75rem",color:"#6b6560",marginTop:"1rem",lineHeight:1.7}}>
            Demo: {isS?"student@aditya.edu / password":"admin@library.edu / admin123"}<br/>
            <span style={{cursor:"pointer",color:C.gold}} onClick={()=>setPortal("landing")}>← Back to portal</span>
          </div>
        </div>
      </div>
    );
  }

  // ── SHELL ─────────────────────────────────────────────────────────────────
  const isStudent = portal==="student";
  const tab  = isStudent ? sTab  : aTab;
  const setTab = isStudent ? setSTab : setATab;

  const navs = isStudent
    ? [{id:"dashboard",i:"◈",l:"Dashboard"},{id:"borrowed",i:"◐",l:"My Books"},{id:"catalog",i:"◻",l:"Catalog"},
       {id:"history",i:"◑",l:"History"},{id:"fines",i:"◆",l:"Fines",badge:myFinesTotal>0}]
    : [{id:"dashboard",i:"◈",l:"Dashboard"},{id:"students",i:"◐",l:"Students"},{id:"inventory",i:"◻",l:"Inventory"},
       {id:"borrowings",i:"◑",l:"Borrowings"},{id:"fines",i:"◆",l:"Fines"},{id:"reports",i:"◇",l:"Reports"}];

  // ── page renderers ────────────────────────────────────────────────────────

  const renderStudentDashboard = () => {
    const nextDue = [...myActive].sort((a,b)=>a.due.localeCompare(b.due))[0];
    return (
      <>
        <div style={S.h1}>Good Morning, Priya</div>
        <div style={S.sub()}>Thursday, February 26, 2026</div>
        {myFinesTotal>0 && (
          <div style={S.alert("warn")}>
            ⚠ Outstanding fines: <strong>₹{myFinesTotal}</strong> — clear them to continue borrowing.
            <button style={{...S.btn("outline"),marginLeft:"0.75rem",fontSize:"0.65rem"}} onClick={()=>setSTab("fines")}>View Fines →</button>
          </div>
        )}
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(145px,1fr))",gap:"1.25rem",marginBottom:"2.5rem"}}>
          <StatCard value={myActive.length} label="Books Borrowed" />
          <StatCard value={myOverdue.length} label="Overdue" color={myOverdue.length>0?C.red:C.goldLight} />
          <StatCard value={`₹${myFinesTotal}`} label="Outstanding Fines" color={myFinesTotal>0?C.red:C.green} />
          <StatCard value={myBorrows.length} label="Total Ever" />
          {nextDue && <StatCard value={nextDue.due} label="Next Due" color={C.amber} />}
        </div>

        <div style={{marginBottom:"2.5rem"}}>
          <div style={{fontSize:"1.1rem",fontStyle:"italic",color:C.text,marginBottom:"1rem",paddingBottom:"0.5rem",borderBottom:`1px solid ${C.border}`}}>Currently Borrowed</div>
          {myActive.length===0 ? <div style={{color:C.muted}}>No active borrowings.</div> : (
            <table style={S.table}><thead><tr>
              <th style={S.th}>Book</th><th style={S.th}>Due Date</th><th style={S.th}>Days Left</th><th style={S.th}>Fine</th><th style={S.th}>Status</th>
            </tr></thead><tbody>
              {myActive.map(b=>{
                const days=Math.ceil((new Date(b.due)-new Date(TODAY))/86400000);
                return (<tr key={b.id}>
                  <td style={S.td}><div style={{color:C.text}}>{b.book.title}</div><div style={{fontSize:"0.75rem",color:C.muted}}>{b.book.author}</div></td>
                  <td style={S.td}>{b.due}</td>
                  <td style={S.td}><span style={{color:days<0?C.red:days<=3?C.amber:C.green}}>{days<0?`${Math.abs(days)}d overdue`:`${days}d left`}</span></td>
                  <td style={S.td}>{b.fineAmt>0?<span style={{color:C.red}}>₹{b.fineAmt}</span>:"—"}</td>
                  <td style={S.td}><span style={S.badge(b.status)}>{b.status}</span></td>
                </tr>);
              })}
            </tbody></table>
          )}
        </div>

        <div>
          <div style={{fontSize:"1.1rem",fontStyle:"italic",color:C.text,marginBottom:"1rem",paddingBottom:"0.5rem",borderBottom:`1px solid ${C.border}`}}>Recommended for You</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(175px,1fr))",gap:"1rem"}}>
            {books.filter(b=>b.available>0&&!myActive.find(a=>a.bookId===b.id)).slice(0,4).map(b=>(
              <div key={b.id} style={{...S.card,cursor:"pointer",transition:"border-color 0.2s"}}
                onMouseEnter={e=>e.currentTarget.style.borderColor="rgba(212,175,95,0.4)"}
                onMouseLeave={e=>e.currentTarget.style.borderColor=C.border}
                onClick={()=>setSTab("catalog")}>
                <div style={{fontSize:"2rem",marginBottom:"0.5rem"}}>{b.cover}</div>
                <div style={{color:C.text,fontSize:"0.9rem",lineHeight:1.3,marginBottom:"0.25rem"}}>{b.title}</div>
                <div style={{color:C.muted,fontSize:"0.75rem",marginBottom:"0.75rem"}}>{b.author}</div>
                <span style={S.badge("Available")}>Available</span>
              </div>
            ))}
          </div>
        </div>
      </>
    );
  };

  const renderStudentBorrowed = () => (
    <>
      <div style={S.h1}>My Books</div>
      <div style={S.sub()}>Active Borrowings</div>
      {myActive.length===0
        ? <div style={S.alert("ok")}>✓ No active borrowings currently.</div>
        : <table style={S.table}><thead><tr>
            <th style={S.th}>Book</th><th style={S.th}>Borrowed</th><th style={S.th}>Due</th><th style={S.th}>Days Left</th><th style={S.th}>Fine</th><th style={S.th}>Status</th>
          </tr></thead><tbody>
            {myActive.map(b=>{
              const days=Math.ceil((new Date(b.due)-new Date(TODAY))/86400000);
              return (<tr key={b.id}>
                <td style={S.td}><div style={{color:C.text}}>{b.book.title}</div><div style={{fontSize:"0.75rem",color:C.muted}}>{b.book.author}</div></td>
                <td style={S.td}>{b.borrowed}</td>
                <td style={S.td}>{b.due}</td>
                <td style={S.td}><span style={{color:days<0?C.red:days<=3?C.amber:C.green}}>{days<0?`${Math.abs(days)}d overdue`:`${days}d left`}</span></td>
                <td style={S.td}>{b.fineAmt>0?<span style={{color:C.red}}>₹{b.fineAmt}</span>:<span style={{color:C.green}}>None</span>}</td>
                <td style={S.td}><span style={S.badge(b.status)}>{b.status}</span></td>
              </tr>);
            })}
          </tbody></table>
      }
    </>
  );

  const renderStudentCatalog = () => {
    const filtered = books.filter(b => !sCatQ||[b.title,b.author,b.genre].some(x=>x.toLowerCase().includes(sCatQ.toLowerCase())));
    return (
      <>
        <div style={S.h1}>Book Catalog</div>
        <div style={S.sub("1rem")}>Search & Request Books</div>
        <input style={{...S.input,marginBottom:"1.5rem"}} placeholder="Search by title, author, or genre…" value={sCatQ} onChange={e=>setSCatQ(e.target.value)} />
        {sCatQ && <div style={{fontSize:"0.8rem",color:C.muted,marginBottom:"1rem"}}>{filtered.length} result{filtered.length!==1?"s":""} for "{sCatQ}"</div>}
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(210px,1fr))",gap:"1rem"}}>
          {filtered.map(b=>{
            const avail=b.available>0;
            const alreadyHave=myActive.some(a=>a.bookId===b.id);
            const requested=!!sreqs[b.id];
            return (
              <div key={b.id} style={{...S.card,opacity:avail?1:0.72}}>
                <div style={{fontSize:"2rem",marginBottom:"0.75rem"}}>{b.cover}</div>
                <div style={{color:C.text,fontSize:"0.9rem",marginBottom:"0.25rem",lineHeight:1.3}}>{b.title}</div>
                <div style={{color:C.muted,fontSize:"0.75rem",marginBottom:"0.35rem"}}>{b.author}</div>
                <div style={{fontSize:"0.7rem",color:C.gold,marginBottom:"0.75rem"}}>{b.genre} · {b.available}/{b.copies} available</div>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:"0.5rem"}}>
                  <span style={S.badge(avail?"Available":"Unavailable")}>{avail?"Available":"Checked Out"}</span>
                  {alreadyHave
                    ? <span style={{fontSize:"0.7rem",color:C.blue}}>✓ Borrowed</span>
                    : requested
                      ? <span style={{fontSize:"0.7rem",color:C.green}}>✓ Requested</span>
                      : <button style={{...S.btn("outline"),fontSize:"0.68rem"}} onClick={()=>setSreqs(r=>({...r,[b.id]:true}))}>{avail?"Request":"Notify Me"}</button>
                  }
                </div>
              </div>
            );
          })}
        </div>
      </>
    );
  };

  const renderStudentHistory = () => (
    <>
      <div style={S.h1}>Borrowing History</div>
      <div style={S.sub()}>All Past & Present Borrowings</div>
      {myBorrows.length===0 ? <div style={{color:C.muted}}>No borrowing history yet.</div> : (
        <table style={S.table}><thead><tr>
          <th style={S.th}>Book</th><th style={S.th}>Borrowed</th><th style={S.th}>Due</th><th style={S.th}>Returned</th><th style={S.th}>Fine</th><th style={S.th}>Status</th>
        </tr></thead><tbody>
          {myBorrows.map(b=>(
            <tr key={b.id}>
              <td style={S.td}><div style={{color:C.text}}>{b.book.title}</div><div style={{fontSize:"0.75rem",color:C.muted}}>{b.book.author}</div></td>
              <td style={S.td}>{b.borrowed}</td>
              <td style={S.td}>{b.due}</td>
              <td style={S.td}>{b.returned||<span style={{color:C.amber}}>Pending</span>}</td>
              <td style={S.td}>{b.fineAmt>0?<span style={{color:b.finePaid?C.muted:C.red}}>{b.finePaid?"Paid":` ₹${b.fineAmt}`}</span>:<span style={{color:C.green}}>None</span>}</td>
              <td style={S.td}><span style={S.badge(b.status)}>{b.status}</span></td>
            </tr>
          ))}
        </tbody></table>
      )}
    </>
  );

  const renderStudentFines = () => {
    const fineList = myBorrows.filter(b=>b.fineAmt>0||b.finePaid);
    const displayed = fineList.filter(b=>sFineF==="all"?true:sFineF==="paid"?b.finePaid:!b.finePaid);
    const unpaid = myBorrows.filter(b=>!b.finePaid).reduce((s,b)=>s+b.fineAmt,0);
    return (
      <>
        <div style={S.h1}>Fines</div>
        <div style={S.sub("1.25rem")}>Manage Your Outstanding Fines · ₹5/day after due date</div>
        {unpaid>0 && <div style={S.alert("warn")}>⚠ Total outstanding: <strong>₹{unpaid}</strong></div>}
        {unpaid===0 && <div style={S.alert("ok")}>✓ No outstanding fines — great job!</div>}
        <div style={{display:"flex",gap:"0.5rem",marginBottom:"1.5rem"}}>
          {["all","unpaid","paid"].map(f=>(
            <TabBtn key={f} id={f} active={sFineF===f} onClick={setSFineF}>{f.charAt(0).toUpperCase()+f.slice(1)}</TabBtn>
          ))}
        </div>
        <table style={S.table}><thead><tr>
          <th style={S.th}>Book</th><th style={S.th}>Due Date</th><th style={S.th}>Overdue Days</th><th style={S.th}>Amount</th><th style={S.th}>Status</th><th style={S.th}>Action</th>
        </tr></thead><tbody>
          {displayed.length===0
            ? <tr><td colSpan={6} style={{...S.td,textAlign:"center",color:C.muted}}>No fines in this category.</td></tr>
            : displayed.map(b=>{
                const days=Math.max(0,Math.floor((new Date(b.returned||TODAY)-new Date(b.due))/86400000));
                return (<tr key={b.id}>
                  <td style={S.td}><div style={{color:C.text}}>{b.book.title}</div><div style={{fontSize:"0.75rem",color:C.muted}}>{b.book.author}</div></td>
                  <td style={S.td}>{b.due}</td>
                  <td style={S.td}><span style={{color:C.amber}}>{days}d</span></td>
                  <td style={S.td}><span style={{color:b.finePaid?C.muted:C.red,fontWeight:500}}>₹{b.fineAmt}</span></td>
                  <td style={S.td}><span style={S.badge(b.finePaid?"Paid":"Unpaid")}>{b.finePaid?"Paid":"Unpaid"}</span></td>
                  <td style={S.td}>{!b.finePaid&&b.fineAmt>0
                    ? <button style={{...S.btn("green"),fontSize:"0.65rem"}} onClick={()=>payFine(b.id)}>Pay ₹{b.fineAmt}</button>
                    : <span style={{color:C.muted,fontSize:"0.8rem"}}>—</span>
                  }</td>
                </tr>);
              })
          }
        </tbody></table>
      </>
    );
  };

  // admin pages
  const renderAdminDashboard = () => {
    const activeC=borrows.filter(b=>!b.returned).length;
    const overdueC=borrows.filter(b=>isOverdue(b)).length;
    const finesUnpaid=allFull.filter(b=>!b.finePaid).reduce((s,b)=>s+b.fineAmt,0);
    return (
      <>
        <div style={S.h1}>Library Overview</div>
        <div style={S.sub()}>Thursday, Feb 26, 2026 · Aditya University</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(145px,1fr))",gap:"1.25rem",marginBottom:"2.5rem"}}>
          <StatCard value={books.reduce((s,b)=>s+b.copies,0)} label="Total Books" />
          <StatCard value={students.length} label="Students" />
          <StatCard value={activeC} label="Active Borrows" color={C.amber} />
          <StatCard value={overdueC} label="Overdue" color={overdueC>0?C.red:C.goldLight} />
          <StatCard value={`₹${finesUnpaid}`} label="Pending Fines" color={finesUnpaid>0?C.red:C.green} />
        </div>
        <div style={{fontSize:"1.1rem",fontStyle:"italic",color:C.text,marginBottom:"1rem",paddingBottom:"0.5rem",borderBottom:`1px solid ${C.border}`}}>Recent Transactions</div>
        <table style={S.table}><thead><tr>
          <th style={S.th}>Student</th><th style={S.th}>Book</th><th style={S.th}>Date</th><th style={S.th}>Status</th>
        </tr></thead><tbody>
          {[...allFull].reverse().slice(0,6).map(b=>(
            <tr key={b.id}>
              <td style={S.td}><div style={{color:C.text}}>{b.student.name}</div><div style={{fontSize:"0.75rem",color:C.muted}}>{b.student.rollNo}</div></td>
              <td style={S.td}>{b.book.title}</td>
              <td style={S.td}>{b.returned||b.borrowed}</td>
              <td style={S.td}><span style={S.badge(b.status)}>{b.status}</span></td>
            </tr>
          ))}
        </tbody></table>
      </>
    );
  };

  const renderAdminStudents = () => {
    const filtered=students.filter(s=>!aStuQ||[s.name,s.rollNo,s.dept,s.email].some(x=>x.toLowerCase().includes(aStuQ.toLowerCase())));
    return (
      <>
        <div style={S.h1}>Student Management</div>
        <div style={S.sub("1rem")}>{students.length} Registered Students</div>
        <div style={{display:"flex",gap:"1rem",marginBottom:"1.5rem"}}>
          <input style={{...S.input,flex:1}} placeholder="Search name, roll no, dept, email…" value={aStuQ} onChange={e=>setAStuQ(e.target.value)} />
          <button style={S.btn("gold")} onClick={()=>setModal({type:"addStudent"})}>+ Add Student</button>
        </div>
        <table style={S.table}><thead><tr>
          <th style={S.th}>Student</th><th style={S.th}>Roll No</th><th style={S.th}>Dept</th><th style={S.th}>Active</th><th style={S.th}>Fines</th><th style={S.th}>Actions</th>
        </tr></thead><tbody>
          {filtered.map(s=>{
            const sb=borrows.filter(b=>b.studentId===s.id&&!b.returned);
            const sf=allFull.filter(b=>b.studentId===s.id&&!b.finePaid).reduce((t,b)=>t+b.fineAmt,0);
            return (<tr key={s.id}>
              <td style={S.td}><div style={{color:C.text}}>{s.name}</div><div style={{fontSize:"0.75rem",color:C.muted}}>{s.email}</div></td>
              <td style={S.td}>{s.rollNo}</td>
              <td style={S.td}>{s.dept}</td>
              <td style={S.td}>{sb.length}</td>
              <td style={S.td}>{sf>0?<span style={{color:C.red}}>₹{sf}</span>:<span style={{color:C.green}}>None</span>}</td>
              <td style={S.td}>
                <button style={{...S.btn("outline"),marginRight:"0.5rem",fontSize:"0.65rem"}} onClick={()=>setModal({type:"viewStudent",data:s})}>View</button>
                <button style={{...S.btn("red"),fontSize:"0.65rem"}} onClick={()=>removeStudent(s.id)}>Remove</button>
              </td>
            </tr>);
          })}
        </tbody></table>
      </>
    );
  };

  const renderAdminInventory = () => {
    const filtered=books.filter(b=>!aBkQ||[b.title,b.author,b.genre].some(x=>x.toLowerCase().includes(aBkQ.toLowerCase())));
    return (
      <>
        <div style={S.h1}>Book Inventory</div>
        <div style={S.sub("1rem")}>{books.length} Titles · {books.reduce((s,b)=>s+b.copies,0)} Total Copies</div>
        <div style={{display:"flex",gap:"1rem",marginBottom:"1.5rem"}}>
          <input style={{...S.input,flex:1}} placeholder="Search catalog…" value={aBkQ} onChange={e=>setABkQ(e.target.value)} />
          <button style={S.btn("gold")} onClick={()=>setModal({type:"addBook"})}>+ Add Book</button>
        </div>
        <table style={S.table}><thead><tr>
          <th style={S.th}>Book</th><th style={S.th}>Genre</th><th style={S.th}>Copies</th><th style={S.th}>Available</th><th style={S.th}>Status</th><th style={S.th}>Actions</th>
        </tr></thead><tbody>
          {filtered.map(b=>(
            <tr key={b.id}>
              <td style={S.td}><div style={{color:C.text}}>{b.cover} {b.title}</div><div style={{fontSize:"0.75rem",color:C.muted}}>{b.author}</div></td>
              <td style={S.td}><span style={{fontSize:"0.75rem",color:C.gold}}>{b.genre}</span></td>
              <td style={S.td}>{b.copies}</td>
              <td style={S.td}>{b.available}</td>
              <td style={S.td}><span style={S.badge(b.available>0?"Available":"Unavailable")}>{b.available>0?"In Stock":"All Out"}</span></td>
              <td style={S.td}>
                <button style={{...S.btn("outline"),marginRight:"0.5rem",fontSize:"0.65rem"}} onClick={()=>{setEditBook({...b});setModal({type:"editBook"});}}>Edit</button>
                <button style={{...S.btn("red"),fontSize:"0.65rem"}} onClick={()=>removeBook(b.id)}>Remove</button>
              </td>
            </tr>
          ))}
        </tbody></table>
      </>
    );
  };

  const renderAdminBorrowings = () => {
    const FILTERS=["All","Active","Overdue","Returned"];
    let list=allFull;
    if (aBorF!=="All") list=list.filter(b=>b.status===aBorF);
    if (aBorQ) list=list.filter(b=>[b.student.name,b.student.rollNo,b.book.title].some(x=>x&&x.toLowerCase().includes(aBorQ.toLowerCase())));
    return (
      <>
        <div style={S.h1}>Borrowings & Returns</div>
        <div style={S.sub("1rem")}>All Transactions · {list.length} records</div>
        <div style={{display:"flex",gap:"0.6rem",marginBottom:"1rem",flexWrap:"wrap"}}>
          {FILTERS.map(f=><TabBtn key={f} id={f} active={aBorF===f} onClick={setABorF}>{f}</TabBtn>)}
          <button style={{...S.btn("gold"),marginLeft:"auto"}} onClick={()=>setModal({type:"addBorrowing"})}>+ Record Borrowing</button>
        </div>
        <input style={{...S.input,marginBottom:"1.5rem"}} placeholder="Search student name, roll no, or book title…" value={aBorQ} onChange={e=>setABorQ(e.target.value)} />
        <table style={S.table}><thead><tr>
          <th style={S.th}>Student</th><th style={S.th}>Book</th><th style={S.th}>Borrowed</th><th style={S.th}>Due</th><th style={S.th}>Returned</th><th style={S.th}>Fine</th><th style={S.th}>Status</th><th style={S.th}>Action</th>
        </tr></thead><tbody>
          {list.length===0
            ? <tr><td colSpan={8} style={{...S.td,textAlign:"center",color:C.muted}}>No records found.</td></tr>
            : list.map(b=>(
              <tr key={b.id}>
                <td style={S.td}><div style={{color:C.text}}>{b.student.name}</div><div style={{fontSize:"0.75rem",color:C.muted}}>{b.student.rollNo}</div></td>
                <td style={S.td}>{b.book.title}</td>
                <td style={S.td}>{b.borrowed}</td>
                <td style={S.td}>{b.due}</td>
                <td style={S.td}>{b.returned||<span style={{color:C.amber}}>Pending</span>}</td>
                <td style={S.td}>{b.fineAmt>0?<span style={{color:b.finePaid?C.muted:C.red}}>{b.finePaid?"Paid":`₹${b.fineAmt}`}</span>:"—"}</td>
                <td style={S.td}><span style={S.badge(b.status)}>{b.status}</span></td>
                <td style={S.td}>
                  {!b.returned
                    ? <button style={{...S.btn("green"),fontSize:"0.65rem"}} onClick={()=>recordReturn(b.id)}>Mark Returned</button>
                    : <span style={{color:C.muted,fontSize:"0.8rem"}}>✓ Done</span>
                  }
                </td>
              </tr>
            ))
          }
        </tbody></table>
      </>
    );
  };

  const renderAdminFines = () => {
    const fineRecs=allFull.filter(b=>b.fineAmt>0);
    const displayed=fineRecs.filter(b=>aFinF==="All"?true:aFinF==="Paid"?b.finePaid:!b.finePaid);
    const unpaidT=fineRecs.filter(b=>!b.finePaid).reduce((s,b)=>s+b.fineAmt,0);
    const paidT=fineRecs.filter(b=>b.finePaid).reduce((s,b)=>s+b.fineAmt,0);
    return (
      <>
        <div style={S.h1}>Fine Management</div>
        <div style={S.sub("1.5rem")}>Track & Collect Overdue Fines</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(145px,1fr))",gap:"1.25rem",marginBottom:"1.5rem"}}>
          <StatCard value={`₹${unpaidT}`} label="Outstanding" color={C.red} />
          <StatCard value={fineRecs.filter(b=>!b.finePaid).length} label="Students w/ Fines" />
          <StatCard value={`₹${paidT}`} label="Collected" color={C.green} />
        </div>
        <div style={{display:"flex",gap:"0.5rem",marginBottom:"1.5rem"}}>
          {["Unpaid","Paid","All"].map(f=><TabBtn key={f} id={f} active={aFinF===f} onClick={setAFinF}>{f}</TabBtn>)}
        </div>
        <table style={S.table}><thead><tr>
          <th style={S.th}>Student</th><th style={S.th}>Book</th><th style={S.th}>Overdue Days</th><th style={S.th}>Amount</th><th style={S.th}>Status</th><th style={S.th}>Action</th>
        </tr></thead><tbody>
          {displayed.length===0
            ? <tr><td colSpan={6} style={{...S.td,textAlign:"center",color:C.muted}}>No fines in this category.</td></tr>
            : displayed.map(b=>{
                const days=Math.max(0,Math.floor((new Date(b.returned||TODAY)-new Date(b.due))/86400000));
                return (<tr key={b.id}>
                  <td style={S.td}><div style={{color:C.text}}>{b.student.name}</div><div style={{fontSize:"0.75rem",color:C.muted}}>{b.student.rollNo}</div></td>
                  <td style={S.td}>{b.book.title}</td>
                  <td style={S.td}><span style={{color:C.amber}}>{days}d</span></td>
                  <td style={S.td}><span style={{color:b.finePaid?C.muted:C.red,fontWeight:500}}>₹{b.fineAmt}</span></td>
                  <td style={S.td}><span style={S.badge(b.finePaid?"Paid":"Unpaid")}>{b.finePaid?"Paid":"Unpaid"}</span></td>
                  <td style={S.td}>{!b.finePaid
                    ? <button style={{...S.btn("green"),fontSize:"0.65rem"}} onClick={()=>markPaid(b.id)}>Mark Paid</button>
                    : <span style={{color:C.muted,fontSize:"0.8rem"}}>✓ Cleared</span>
                  }</td>
                </tr>);
              })
          }
        </tbody></table>
      </>
    );
  };

  const REPORT_LIST = [
    {id:"monthly",icon:"📊",title:"Monthly Borrowing Report",desc:"All checkouts & returns for February 2026"},
    {id:"fines",  icon:"💰",title:"Fine Collection Report",   desc:"Fines levied and collected"},
    {id:"popular",icon:"📚",title:"Popular Books Report",     desc:"Most borrowed titles & genres"},
    {id:"overdue",icon:"⏰",title:"Overdue Books Report",     desc:"All books past due as of today"},
    {id:"inventory",icon:"📋",title:"Inventory Status Report",desc:"Current stock levels per book"},
    {id:"studentActivity",icon:"🎓",title:"Student Activity Report",desc:"Borrowing frequency by student"},
  ];

  const renderReport = id => {
    const monthB=allFull.filter(b=>b.borrowed>="2026-02-01");
    const finesU=allFull.filter(b=>!b.finePaid&&b.fineAmt>0);
    const overdueL=allFull.filter(b=>b.status==="Overdue");
    const bkCounts={};
    allFull.forEach(b=>{bkCounts[b.bookId]=(bkCounts[b.bookId]||0)+1;});
    const popular=Object.entries(bkCounts).sort((a,b)=>b[1]-a[1]).slice(0,6).map(([bid,cnt])=>({...getBook(parseInt(bid)),count:cnt}));

    if (id==="monthly") return <table style={S.table}><thead><tr><th style={S.th}>Student</th><th style={S.th}>Book</th><th style={S.th}>Borrowed</th><th style={S.th}>Status</th></tr></thead><tbody>{monthB.map(b=><tr key={b.id}><td style={S.td}>{b.student.name}</td><td style={S.td}>{b.book.title}</td><td style={S.td}>{b.borrowed}</td><td style={S.td}><span style={S.badge(b.status)}>{b.status}</span></td></tr>)}</tbody></table>;
    if (id==="fines") return <table style={S.table}><thead><tr><th style={S.th}>Student</th><th style={S.th}>Book</th><th style={S.th}>Fine</th><th style={S.th}>Status</th></tr></thead><tbody>{finesU.map(b=><tr key={b.id}><td style={S.td}>{b.student.name}</td><td style={S.td}>{b.book.title}</td><td style={S.td}><span style={{color:C.red}}>₹{b.fineAmt}</span></td><td style={S.td}><span style={S.badge("Unpaid")}>Unpaid</span></td></tr>)}</tbody></table>;
    if (id==="popular") return <table style={S.table}><thead><tr><th style={S.th}>#</th><th style={S.th}>Title</th><th style={S.th}>Author</th><th style={S.th}>Times Borrowed</th></tr></thead><tbody>{popular.map((b,i)=><tr key={b.id}><td style={S.td}>{i+1}</td><td style={S.td}>{b.title}</td><td style={S.td}>{b.author}</td><td style={S.td}>{b.count}</td></tr>)}</tbody></table>;
    if (id==="overdue") return <table style={S.table}><thead><tr><th style={S.th}>Student</th><th style={S.th}>Book</th><th style={S.th}>Due</th><th style={S.th}>Fine</th></tr></thead><tbody>{overdueL.map(b=><tr key={b.id}><td style={S.td}>{b.student.name}</td><td style={S.td}>{b.book.title}</td><td style={S.td}>{b.due}</td><td style={S.td}><span style={{color:C.red}}>₹{b.fineAmt}</span></td></tr>)}</tbody></table>;
    if (id==="inventory") return <table style={S.table}><thead><tr><th style={S.th}>Title</th><th style={S.th}>Genre</th><th style={S.th}>Total</th><th style={S.th}>Available</th><th style={S.th}>Borrowed</th></tr></thead><tbody>{books.map(b=><tr key={b.id}><td style={S.td}>{b.title}</td><td style={S.td}>{b.genre}</td><td style={S.td}>{b.copies}</td><td style={S.td}>{b.available}</td><td style={S.td}>{b.copies-b.available}</td></tr>)}</tbody></table>;
    if (id==="studentActivity") return <table style={S.table}><thead><tr><th style={S.th}>Student</th><th style={S.th}>Dept</th><th style={S.th}>Total</th><th style={S.th}>Active</th><th style={S.th}>Fines</th></tr></thead><tbody>{students.map(s=>{const sb=borrows.filter(b=>b.studentId===s.id);const sa=sb.filter(b=>!b.returned).length;const sf=allFull.filter(b=>b.studentId===s.id&&!b.finePaid).reduce((t,b)=>t+b.fineAmt,0);return <tr key={s.id}><td style={S.td}>{s.name}</td><td style={S.td}>{s.dept}</td><td style={S.td}>{sb.length}</td><td style={S.td}>{sa}</td><td style={S.td}>{sf>0?`₹${sf}`:"—"}</td></tr>;})}</tbody></table>;
    return null;
  };

  const renderAdminReports = () => (
    <>
      <div style={S.h1}>Reports</div>
      <div style={S.sub()}>Library Analytics & Insights</div>
      {aRpt ? (
        <>
          <div style={{display:"flex",alignItems:"center",gap:"1rem",marginBottom:"1.5rem"}}>
            <button style={S.btn("outline")} onClick={()=>setARpt(null)}>← Back</button>
            <div style={{fontSize:"1.1rem",fontStyle:"italic",color:C.text}}>{REPORT_LIST.find(r=>r.id===aRpt)?.title}</div>
          </div>
          {renderReport(aRpt)}
        </>
      ) : (
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))",gap:"1.5rem"}}>
          {REPORT_LIST.map(r=>(
            <div key={r.id} style={{...S.card,cursor:"pointer",display:"flex",flexDirection:"column",transition:"border-color 0.2s"}}
              onMouseEnter={e=>e.currentTarget.style.borderColor="rgba(212,175,95,0.45)"}
              onMouseLeave={e=>e.currentTarget.style.borderColor=C.border}>
              <div style={{fontSize:"1.5rem",marginBottom:"0.75rem"}}>{r.icon}</div>
              <div style={{color:C.text,marginBottom:"0.35rem"}}>{r.title}</div>
              <div style={{color:C.muted,fontSize:"0.8rem",flex:1,lineHeight:1.5,marginBottom:"1rem"}}>{r.desc}</div>
              <button style={S.btn("gold")} onClick={()=>setARpt(r.id)}>View Report</button>
            </div>
          ))}
        </div>
      )}
    </>
  );

  return (
    <div style={S.shell}>
      {/* Sidebar */}
      <div style={S.sidebar}>
        <div style={{padding:"1.5rem",borderBottom:`1px solid ${C.border}`}}>
          <div style={{fontSize:"1.1rem",fontStyle:"italic",color:C.text,marginBottom:"0.2rem"}}>Library Portal</div>
          <div style={{fontSize:"0.65rem",letterSpacing:"0.2em",textTransform:"uppercase",color:C.gold}}>{isStudent?"Student Access":"Admin Console"}</div>
        </div>
        <div style={{padding:"1.25rem 1.5rem",borderBottom:`1px solid ${C.border}`}}>
          <div style={{fontSize:"0.85rem",color:C.text}}>{isStudent?"Priya Sharma":"Dr. Ramesh Kumar"}</div>
          <div style={{fontSize:"0.7rem",color:C.muted,marginTop:"0.2rem"}}>{isStudent?"CS2201 · CSE":"Chief Librarian"}</div>
        </div>
        <nav style={{flex:1,paddingTop:"1rem"}}>
          {navs.map(n=>(
            <div key={n.id} style={S.nav(tab===n.id)} onClick={()=>setTab(n.id)}>
              <span style={{fontSize:"0.75rem"}}>{n.i}</span>
              {n.l}
              {n.badge && <span style={{marginLeft:"auto",background:"#7a2a2a",color:C.red,borderRadius:10,padding:"0 6px",fontSize:"0.65rem"}}>!</span>}
            </div>
          ))}
        </nav>
        <div style={{padding:"1.25rem"}}>
          <button style={{...S.btn("outline"),width:"100%"}} onClick={signOut}>Sign Out</button>
        </div>
      </div>

      {/* Main content */}
      <div style={S.main}>
        {isStudent && tab==="dashboard" && renderStudentDashboard()}
        {isStudent && tab==="borrowed"  && renderStudentBorrowed()}
        {isStudent && tab==="catalog"   && renderStudentCatalog()}
        {isStudent && tab==="history"   && renderStudentHistory()}
        {isStudent && tab==="fines"     && renderStudentFines()}
        {!isStudent && tab==="dashboard"  && renderAdminDashboard()}
        {!isStudent && tab==="students"   && renderAdminStudents()}
        {!isStudent && tab==="inventory"  && renderAdminInventory()}
        {!isStudent && tab==="borrowings" && renderAdminBorrowings()}
        {!isStudent && tab==="fines"      && renderAdminFines()}
        {!isStudent && tab==="reports"    && renderAdminReports()}
      </div>

      {/* ── Modals ── */}

      {modal?.type==="addBorrowing" && (
        <Modal title="Record New Borrowing" onClose={()=>setModal(null)}>
          <Picker label="Student" value={newBorrow.studentId} onChange={v=>setNewBorrow(p=>({...p,studentId:v}))}
            options={students.map(s=>({value:s.id,label:`${s.name} (${s.rollNo})`}))} />
          <Picker label="Book (available copies)" value={newBorrow.bookId} onChange={v=>setNewBorrow(p=>({...p,bookId:v}))}
            options={books.filter(b=>b.available>0).map(b=>({value:b.id,label:`${b.title} — ${b.available} avail.`}))} />
          <Field label="Due Date" value={newBorrow.due} onChange={v=>setNewBorrow(p=>({...p,due:v}))} type="date" />
          {newBorrow.studentId && newBorrow.bookId && newBorrow.due
            ? <div style={{...S.alert("ok"),marginBottom:"1rem"}}>✓ Ready to record borrowing for {getStu(parseInt(newBorrow.studentId)).name}.</div>
            : <div style={{fontSize:"0.8rem",color:C.muted,marginBottom:"1rem"}}>Fill all fields to continue.</div>
          }
          <button style={{...S.btn("gold"),width:"100%"}} onClick={submitBorrow}>Confirm Borrowing</button>
        </Modal>
      )}

      {modal?.type==="addBook" && (
        <Modal title="Add New Book" onClose={()=>setModal(null)}>
          <Field label="Title"  value={newBook.title}  onChange={v=>setNewBook(p=>({...p,title:v}))}  placeholder="Book title" />
          <Field label="Author" value={newBook.author} onChange={v=>setNewBook(p=>({...p,author:v}))} placeholder="Author name" />
          <Field label="Genre"  value={newBook.genre}  onChange={v=>setNewBook(p=>({...p,genre:v}))}  placeholder="e.g. Technology, History" />
          <Field label="Number of Copies" value={newBook.copies} onChange={v=>setNewBook(p=>({...p,copies:v}))} type="number" />
          <Picker label="Cover Icon" value={newBook.cover} onChange={v=>setNewBook(p=>({...p,cover:v}))}
            options={["📘","📗","📙","📕","📔","📒","📚","📖"].map(e=>({value:e,label:e}))} />
          <button style={{...S.btn("gold"),width:"100%"}} onClick={submitBook}>Add Book</button>
        </Modal>
      )}

      {modal?.type==="editBook" && editBook && (
        <Modal title={`Edit: ${editBook.title}`} onClose={()=>{setModal(null);setEditBook(null);}}>
          <Field label="Title"  value={editBook.title}  onChange={v=>setEditBook(p=>({...p,title:v}))} />
          <Field label="Author" value={editBook.author} onChange={v=>setEditBook(p=>({...p,author:v}))} />
          <Field label="Genre"  value={editBook.genre}  onChange={v=>setEditBook(p=>({...p,genre:v}))} />
          <Field label="Total Copies"     value={editBook.copies}    onChange={v=>setEditBook(p=>({...p,copies:parseInt(v)||1}))} type="number" />
          <Field label="Available Copies" value={editBook.available} onChange={v=>setEditBook(p=>({...p,available:parseInt(v)||0}))} type="number" />
          <Picker label="Cover Icon" value={editBook.cover} onChange={v=>setEditBook(p=>({...p,cover:v}))}
            options={["📘","📗","📙","📕","📔","📒","📚","📖"].map(e=>({value:e,label:e}))} />
          <button style={{...S.btn("gold"),width:"100%"}} onClick={submitEditBook}>Save Changes</button>
        </Modal>
      )}

      {modal?.type==="addStudent" && (
        <Modal title="Register New Student" onClose={()=>setModal(null)}>
          <Field label="Full Name"      value={newStudent.name}   onChange={v=>setNewStudent(p=>({...p,name:v}))}   placeholder="Student name" />
          <Field label="College Email"  value={newStudent.email}  onChange={v=>setNewStudent(p=>({...p,email:v}))}  placeholder="name@aditya.edu" type="email" />
          <Field label="Roll Number"    value={newStudent.rollNo} onChange={v=>setNewStudent(p=>({...p,rollNo:v}))} placeholder="e.g. CS2230" />
          <Picker label="Department" value={newStudent.dept} onChange={v=>setNewStudent(p=>({...p,dept:v}))}
            options={["CSE","ECE","MECH","IT","CIVIL","EEE"].map(d=>({value:d,label:d}))} />
          <Field label="Phone" value={newStudent.phone} onChange={v=>setNewStudent(p=>({...p,phone:v}))} placeholder="Mobile number" type="tel" />
          <button style={{...S.btn("gold"),width:"100%"}} onClick={submitStudent}>Register Student</button>
        </Modal>
      )}

      {modal?.type==="viewStudent" && modal.data && (() => {
        const s=modal.data;
        const sb=allFull.filter(b=>b.studentId===s.id);
        const sf=sb.filter(b=>!b.finePaid).reduce((t,b)=>t+b.fineAmt,0);
        return (
          <Modal title={s.name} onClose={()=>setModal(null)}>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.75rem",marginBottom:"1.5rem"}}>
              {[["Roll No",s.rollNo],["Email",s.email],["Department",s.dept],["Phone",s.phone||"N/A"],
                ["Total Borrowed",sb.length],["Pending Fines",sf>0?`₹${sf}`:"None"]].map(([k,v])=>(
                <div key={k} style={{...S.card,padding:"0.75rem 1rem"}}>
                  <div style={{fontSize:"0.65rem",color:C.gold,letterSpacing:"0.15em",textTransform:"uppercase"}}>{k}</div>
                  <div style={{color:C.text,marginTop:"0.25rem"}}>{v}</div>
                </div>
              ))}
            </div>
            <div style={{fontSize:"1rem",fontStyle:"italic",color:C.text,marginBottom:"0.75rem"}}>Borrowing History</div>
            {sb.length===0
              ? <div style={{color:C.muted,fontSize:"0.9rem"}}>No borrowings yet.</div>
              : <table style={S.table}><thead><tr><th style={S.th}>Book</th><th style={S.th}>Due</th><th style={S.th}>Status</th><th style={S.th}>Fine</th></tr></thead>
                <tbody>{sb.map(b=><tr key={b.id}>
                  <td style={S.td}>{b.book.title}</td>
                  <td style={S.td}>{b.due}</td>
                  <td style={S.td}><span style={S.badge(b.status)}>{b.status}</span></td>
                  <td style={S.td}>{b.fineAmt>0?<span style={{color:b.finePaid?C.muted:C.red}}>{b.finePaid?"Paid":`₹${b.fineAmt}`}</span>:"—"}</td>
                </tr>)}</tbody></table>
            }
          </Modal>
        );
      })()}

    </div>
  );
}
