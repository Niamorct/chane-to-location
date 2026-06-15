import { useState, useMemo, useEffect, useCallback } from "react";

const SUPA_URL = "https://lmtgoehaeepigauxeeor.supabase.co";
const SUPA_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxtdGdvZWhhZWVwaWdhdXhlZW9yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE1MDg0NTksImV4cCI6MjA5NzA4NDQ1OX0.c4RvAe0leTvcMHUzYoAeZX8F1-VtAbePaqBV-F89kbc";
const H = {"Content-Type":"application/json","apikey":SUPA_KEY,"Authorization":"Bearer "+SUPA_KEY,"Prefer":"return=representation"};
async function dbGet(t){const r=await fetch(SUPA_URL+"/rest/v1/"+t+"?order=id",{headers:H});return r.json();}
async function dbIns(t,o){const r=await fetch(SUPA_URL+"/rest/v1/"+t,{method:"POST",headers:H,body:JSON.stringify(o)});return r.json();}
async function dbUpd(t,id,o){const r=await fetch(SUPA_URL+"/rest/v1/"+t+"?id=eq."+id,{method:"PATCH",headers:H,body:JSON.stringify(o)});return r.json();}
async function dbDel(t,id){await fetch(SUPA_URL+"/rest/v1/"+t+"?id=eq."+id,{method:"DELETE",headers:H});}

const LOGO="data:image/png;base64,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";

const VT=["Berline","Citadine","SUV","Utilitaire","Fourgon","Minibus","Cabriolet","Autre"];
const VC=["#3B82F6","#8B5CF6","#EC4899","#F59E0B","#10B981","#EF4444","#06B6D4","#F97316","#84CC16","#A855F7"];
const VE={Berline:"🚗",Citadine:"🚗",SUV:"🚙",Utilitaire:"🚐",Fourgon:"🚐",Minibus:"🚌",Cabriolet:"🚗",Autre:"🚗"};
const EC=["Carburant","Entretien","Assurance","Réparation","Nettoyage","Péage","Amende","Autres"];
const MFR=["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"];
const CO={name:"Chane-To Location",address:"",phone:"0693 01 00 94",email:"",siret:"",rcs:""};

const mv=r=>({id:r.id,name:r.name,plate:r.plate,type:r.type,color:r.color,year:r.year||"",mileage:r.mileage||"",fuel:r.fuel||"Essence"});
const mb=r=>({id:r.id,vehicleId:r.vehicle_id,client:r.client,phone:r.phone||"",email:r.email||"",address:r.address||"",licenseNum:r.license_num||"",start:r.start_date,end:r.end_date,rate:r.rate,deposit:r.deposit||0,notes:r.notes||""});
const me=r=>({id:r.id,vehicleId:r.vehicle_id,date:r.date,amount:r.amount,category:r.category,note:r.note||""});

const pd=s=>{const[y,m,d]=s.split("-").map(Number);return new Date(y,m-1,d);};
const fd=s=>pd(s).toLocaleDateString("fr-FR",{day:"2-digit",month:"2-digit",year:"numeric"});
const fdl=s=>pd(s).toLocaleDateString("fr-FR",{day:"2-digit",month:"long",year:"numeric"});
const fds=s=>pd(s).toLocaleDateString("fr-FR",{day:"2-digit",month:"short"});
const ad=(ds,n)=>{const d=pd(ds);d.setDate(d.getDate()+n);return d.toISOString().slice(0,10);};
const dir=(date,s,e)=>{const d=pd(date),a=pd(s),b=pd(e);return d>=a&&d<=b;};
const gdb=(s,e)=>Math.round((pd(e).getTime()-pd(s).getTime())/(864e5))+1;
const gym=ds=>{const d=pd(ds);return{y:d.getFullYear(),m:d.getMonth()};};
const br=b=>b.rate*gdb(b.start,b.end);
const avail=(vid,s,e,bks,ex)=>!bks.some(b=>b.vehicleId===vid&&b.id!==ex&&!(pd(b.end)<pd(s)||pd(b.start)>pd(e)));

function n2w(n){
  const u=["","un","deux","trois","quatre","cinq","six","sept","huit","neuf","dix","onze","douze","treize","quatorze","quinze","seize","dix-sept","dix-huit","dix-neuf"],t=["","","vingt","trente","quarante","cinquante","soixante","soixante","quatre-vingt","quatre-vingt"];
  if(n===0)return"zéro";if(n<0)return"moins "+n2w(-n);if(n<20)return u[n];
  if(n<100){const a=Math.floor(n/10),b=n%10;if(a===7||a===9)return t[a]+(b===0?"":(a===7?"-":(b===1?" et "+u[b+10]:"-"+u[b+10])));return t[a]+(b===0?(a===8?"s":""):(b===1?" et un":"-"+u[b]));}
  if(n<1000){const h=Math.floor(n/100),r=n%100;return(h===1?"cent":u[h]+" cent")+(r===0?(h>1?"s":""):" "+n2w(r));}
  if(n<1e6){const k=Math.floor(n/1000),r=n%1000;return(k===1?"mille":n2w(k)+" mille")+(r===0?"":" "+n2w(r));}
  return n.toString();
}

function cHTML(b,v,co){
  const days=gdb(b.start,b.end),total=b.rate*days,tw=n2w(total);
  const cn="CTR-"+new Date().getFullYear()+"-"+String(b.id).padStart(4,"0");
  const ts=new Date().toLocaleDateString("fr-FR",{day:"2-digit",month:"long",year:"numeric"});
  return`<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><title>Contrat ${cn}</title><style>*{margin:0;padding:0;box-sizing:border-box;}body{font-family:Arial,sans-serif;font-size:10pt;color:#1a1a1a;}.p{width:210mm;min-height:297mm;padding:13mm 15mm;margin:0 auto;}.hd{display:flex;justify-content:space-between;align-items:flex-start;border-bottom:3px solid #0F1117;padding-bottom:10px;margin-bottom:12px;}.cn{font-size:17pt;font-weight:900;color:#0F1117;}.bg{background:#0F1117;color:white;padding:4px 12px;border-radius:4px;font-size:7pt;font-weight:700;letter-spacing:1px;text-align:center;margin-bottom:4px;}.g2{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:10px;}.g3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:7px;}.s{border:1px solid #d1d5db;border-radius:5px;overflow:hidden;margin-bottom:10px;}.sh{background:#0F1117;color:white;padding:5px 10px;font-size:8pt;font-weight:700;}.sb{padding:9px 10px;}.fr{display:flex;justify-content:space-between;border-bottom:1px solid #f3f4f6;padding:3px 0;}.fr:last-child{border:none;}.fl{font-size:8pt;color:#6b7280;font-weight:600;min-width:120px;}.fv{font-size:9pt;color:#111827;font-weight:600;text-align:right;}.am{background:linear-gradient(135deg,#0F1117,#3b82f6);color:white;border-radius:7px;padding:12px 16px;margin-bottom:10px;}.ag{display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;text-align:center;}.al{font-size:7pt;opacity:.75;margin-bottom:2px;}.av{font-size:13pt;font-weight:900;}.at{text-align:center;margin-top:7px;border-top:1px solid rgba(255,255,255,.3);padding-top:7px;}.sg{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:10px;}.si{border:1px solid #d1d5db;border-radius:5px;padding:9px 10px;}.st{font-size:8pt;font-weight:700;margin-bottom:5px;}.sl{border-bottom:1.5px solid #374151;height:42px;margin-bottom:5px;}.sm{font-size:7pt;color:#6b7280;}.cv{border:1px solid #e5e7eb;border-radius:5px;padding:10px;}.ct{font-size:9pt;font-weight:900;color:#0F1117;margin-bottom:7px;text-align:center;border-bottom:2px solid #0F1117;padding-bottom:5px;}.at2{margin-bottom:5px;}.at2-t{font-size:8pt;font-weight:700;color:#0F1117;margin-bottom:1px;}.at2-b{font-size:7pt;color:#374151;line-height:1.4;}.ft{font-size:7pt;color:#9ca3af;text-align:center;border-top:1px solid #e5e7eb;padding-top:7px;margin-top:10px;}@media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact;}}</style></head><body>
<div class="p">
<div class="hd"><div><div class="cn">${co.name}</div><div style="font-size:8pt;color:#64748b;">Location de véhicules</div><div style="margin-top:5px;font-size:7.5pt;color:#374151;line-height:1.5;">${co.address}<br>Tél : ${co.phone}${co.email?" · "+co.email:""}<br>${co.siret?"SIRET : "+co.siret:""}${co.rcs?" · RCS : "+co.rcs:""}</div></div>
<div><div class="bg">CONTRAT DE LOCATION</div><div style="font-size:9pt;font-weight:700;text-align:center;">${cn}</div><div style="font-size:7.5pt;color:#6b7280;text-align:center;margin-top:3px;">Établi le ${ts}</div></div></div>
<div class="g2">
<div class="s"><div class="sh">🏢 LE LOUEUR</div><div class="sb"><div class="fr"><span class="fl">Société</span><span class="fv">${co.name}</span></div><div class="fr"><span class="fl">Adresse</span><span class="fv">${co.address||"—"}</span></div><div class="fr"><span class="fl">Téléphone</span><span class="fv">${co.phone}</span></div><div class="fr"><span class="fl">Email</span><span class="fv">${co.email||"—"}</span></div><div class="fr"><span class="fl">SIRET</span><span class="fv">${co.siret||"—"}</span></div></div></div>
<div class="s"><div class="sh">👤 LE LOCATAIRE</div><div class="sb"><div class="fr"><span class="fl">Nom complet</span><span class="fv">${b.client}</span></div><div class="fr"><span class="fl">Adresse</span><span class="fv">${b.address||"—"}</span></div><div class="fr"><span class="fl">Téléphone</span><span class="fv">${b.phone||"—"}</span></div><div class="fr"><span class="fl">Email</span><span class="fv">${b.email||"—"}</span></div><div class="fr"><span class="fl">N° Permis</span><span class="fv">${b.licenseNum||"—"}</span></div></div></div>
</div>
<div class="s"><div class="sh">🚗 VÉHICULE LOUÉ</div><div class="sb"><div class="g3"><div class="fr"><span class="fl">Désignation</span><span class="fv">${v.name}</span></div><div class="fr"><span class="fl">Immatriculation</span><span class="fv">${v.plate}</span></div><div class="fr"><span class="fl">Type</span><span class="fv">${v.type}</span></div><div class="fr"><span class="fl">Année</span><span class="fv">${v.year||"—"}</span></div><div class="fr"><span class="fl">Carburant</span><span class="fv">${v.fuel||"—"}</span></div><div class="fr"><span class="fl">Km départ</span><span class="fv">${v.mileage||"—"} km</span></div></div></div></div>
<div class="s"><div class="sh">📅 PÉRIODE DE LOCATION</div><div class="sb"><div class="g3"><div class="fr"><span class="fl">Départ</span><span class="fv">${fdl(b.start)}</span></div><div class="fr"><span class="fl">Retour</span><span class="fv">${fdl(b.end)}</span></div><div class="fr"><span class="fl">Durée</span><span class="fv">${days} jour${days>1?"s":""}</span></div></div></div></div>
<div class="am"><div style="font-size:8pt;opacity:.8;font-weight:600;margin-bottom:5px;">💰 RÉCAPITULATIF FINANCIER</div><div class="ag"><div><div class="al">TARIF/JOUR</div><div class="av">${b.rate} €</div></div><div><div class="al">DURÉE</div><div class="av">${days}j</div></div><div><div class="al">CAUTION</div><div class="av">${b.deposit||0} €</div></div></div><div class="at"><div style="font-size:8pt;opacity:.8;">MONTANT TOTAL</div><div style="font-size:17pt;font-weight:900;">${total.toLocaleString("fr-FR")} €</div><div style="font-size:8pt;opacity:.85;font-style:italic;margin-top:2px;">Soit : ${tw} euros</div></div></div>
${b.notes?`<div style="background:#fef3c7;border:1px solid #f59e0b;border-radius:5px;padding:7px 10px;margin-bottom:10px;font-size:7.5pt;color:#92400e;text-align:center;font-weight:600;">📋 ${b.notes}</div>`:""}
<div class="sg"><div class="si"><div class="st">SIGNATURE DU LOUEUR</div><div class="sl"></div><div class="sm">Lu et approuvé — ${co.name}</div><div class="sm">Cachet et signature</div></div><div class="si"><div class="st">SIGNATURE DU LOCATAIRE</div><div class="sl"></div><div class="sm">Lu et approuvé — ${b.client}</div><div class="sm">Faire précéder la signature de « Lu et approuvé »</div></div></div>
<div class="cv"><div class="ct">CONDITIONS GÉNÉRALES DE LOCATION DE VÉHICULE</div>
<div class="at2"><div class="at2-t">Art. 1 — Objet</div><div class="at2-b">Mise à disposition du véhicule décrit ci-dessus. La signature vaut acceptation sans réserve.</div></div>
<div class="at2"><div class="at2-t">Art. 2 — Éligibilité</div><div class="at2-b">Permis valable depuis 2 ans minimum, âge minimum 21 ans. Tout document falsifié entraîne résiliation immédiate et poursuites judiciaires.</div></div>
<div class="at2"><div class="at2-t">Art. 3 — Prise en charge et restitution</div><div class="at2-b">État des lieux à la prise en charge et restitution. Véhicule rendu propre avec même niveau de carburant. Retard non signalé 24h avant = tarif majoré 20%.</div></div>
<div class="at2"><div class="at2-t">Art. 4 — Caution et paiement</div><div class="at2-b">Caution restituée à la remise déduction faite des frais éventuels. Règlement intégral à la signature du contrat.</div></div>
<div class="at2"><div class="at2-t">Art. 5 — Responsabilité et assurances</div><div class="at2-b">Le locataire est responsable de tout dommage et sinistre causé à des tiers. Franchise à sa charge. Utilisation à l'étranger : autorisation écrite préalable obligatoire.</div></div>
<div class="at2"><div class="at2-t">Art. 6 — Interdictions</div><div class="at2-b">Interdit : sous-louer, utiliser en compétition, transporter matières dangereuses, dépasser la charge utile, fumer à bord. Résiliation immédiate sans remboursement en cas de manquement.</div></div>
<div class="at2"><div class="at2-t">Art. 7 — Panne et accidents</div><div class="at2-b">Contacter immédiatement le loueur. Constat amiable obligatoire sous 24h. Toute réparation nécessite l'accord préalable du loueur.</div></div>
<div class="at2"><div class="at2-t">Art. 8 — Litiges</div><div class="at2-b">Règlement amiable privilégié. À défaut, Tribunal du siège du loueur compétent. Droit français applicable.</div></div>
</div>
<div class="ft">${co.name} — ${co.phone} | Contrat ${cn} — ${ts}</div>
</div></body></html>`;
}

function BC({data,h=110}){
  if(!data?.length)return null;
  const mx=Math.max(...data.map(d=>Math.max(d.income,d.expense)),1),w=100/data.length;
  return<svg viewBox={`0 0 100 ${h}`} style={{width:"100%",height:h,display:"block"}}>{data.map((d,i)=>{const ih=(d.income/mx)*(h-18),eh=(d.expense/mx)*(h-18),x=i*w;return<g key={i}><rect x={x+w*.1} y={h-18-ih} width={w*.35} height={ih} fill="#10B981" opacity=".85" rx="1"/><rect x={x+w*.55} y={h-18-eh} width={w*.35} height={eh} fill="#EF4444" opacity=".85" rx="1"/><text x={x+w/2} y={h-3} textAnchor="middle" fontSize="4" fill="#475569">{d.label}</text></g>;})}</svg>;
}
function Row({icon,label,value}){return<div style={{display:"flex",gap:10,alignItems:"flex-start"}}><span style={{fontSize:15,width:22,flexShrink:0}}>{icon}</span><div><div style={{fontSize:10,color:"#475569",fontWeight:600}}>{label.toUpperCase()}</div><div style={{fontSize:13,color:"#E2E8F0",marginTop:1}}>{value}</div></div></div>;}
function Fld({label,value,onChange,placeholder,type="text",textarea,disabled}){
  const s={width:"100%",background:"#0F1117",border:"1px solid #2D3748",color:"#E2E8F0",padding:"9px 11px",borderRadius:7,fontSize:13,outline:"none",resize:"vertical",fontFamily:"inherit",opacity:disabled?.6:1};
  return<div><label style={{fontSize:11,color:"#475569",fontWeight:600,display:"block",marginBottom:5}}>{label.toUpperCase()}</label>{textarea?<textarea value={value||""} onChange={e=>onChange(e.target.value)} placeholder={placeholder} rows={3} style={s} disabled={disabled}/>:<input type={type} value={value||""} onChange={e=>onChange(e.target.value)} placeholder={placeholder} style={s} disabled={disabled}/>}</div>;
}
function CF({label,value,onChange,placeholder,disabled}){
  return<div><label style={{fontSize:10,color:"#475569",fontWeight:600,display:"block",marginBottom:3}}>{label.toUpperCase()}</label><input value={value||""} onChange={e=>onChange(e.target.value)} placeholder={placeholder} disabled={disabled} style={{width:"100%",background:"#0F1117",border:"1px solid #1E2535",color:"#E2E8F0",padding:"7px 9px",borderRadius:6,fontSize:12,outline:"none",opacity:disabled?.6:1}}/></div>;
}

function useIsMobile(){
  const[m,setM]=useState(typeof window!=="undefined"&&window.innerWidth<768);
  useEffect(()=>{const h=()=>setM(window.innerWidth<768);window.addEventListener("resize",h);return()=>window.removeEventListener("resize",h);},[]);
  return m;
}

export default function App(){
  const today=new Date().toISOString().slice(0,10);
  const TY=new Date().getFullYear(),TM=new Date().getMonth();
  const mob=useIsMobile();

  const[vehicles,setVehicles]=useState([]);
  const[bookings,setBookings]=useState([]);
  const[expenses,setExpenses]=useState([]);
  const[loading,setLoading]=useState(true);
  const[syncing,setSyncing]=useState(false);
  const[selDate,setSelDate]=useState(today);
  const[modal,setModal]=useState(null);
  const[form,setForm]=useState({});
  const[vm,setVm]=useState("day");
  const[page,setPage]=useState("calendar");
  const[dc,setDc]=useState(null);
  const[toast,setToast]=useState(null);
  const[tYear,setTYear]=useState(TY);
  const[tMonth,setTMonth]=useState(TM);
  const[tFilter,setTFilter]=useState("month");
  const[evf,setEvf]=useState("all");
  const[ps,setPs]=useState(today);
  const[pe,setPe]=useState(ad(today,1));
  const[spf,setSpf]=useState(false);
  const[cbid,setCbid]=useState(null);
  const[cco,setCco]=useState({...CO});
  const[cex,setCex]=useState({email:"",address:"",licenseNum:"",deposit:0});

  const loadAll=useCallback(async()=>{
    setLoading(true);
    try{const[vR,bR,eR]=await Promise.all([dbGet("vehicles"),dbGet("bookings"),dbGet("expenses")]);
    setVehicles((vR||[]).map(mv));setBookings((bR||[]).map(mb));setExpenses((eR||[]).map(me));}
    catch(e){showT("Erreur connexion","error");}
    setLoading(false);
  },[]);
  useEffect(()=>{loadAll();},[loadAll]);

  const showT=(msg,type="success")=>{setToast({msg,type});setTimeout(()=>setToast(null),3000);};
  const gbod=(vid,date)=>bookings.find(b=>b.vehicleId===vid&&dir(date,b.start,b.end));

  const openDetail=(vid,date)=>{const bk=gbod(vid,date);if(bk){setModal({type:"detail",vehicleId:vid,booking:bk,date});}else{setForm({vehicleId:vid,start:spf?ps:date,end:spf?pe:date,client:"",phone:"",email:"",address:"",licenseNum:"",rate:"",deposit:"",notes:""});setModal({type:"add",vehicleId:vid,date});}};
  const openEdit=bk=>{setForm({...bk});setModal({type:"edit",booking:bk});};
  const saveBk=async()=>{
    if(!form.client||!form.start||!form.end||!form.rate)return;
    if(pd(form.end)<pd(form.start))return;
    setSyncing(true);
    const p={vehicle_id:Number(form.vehicleId),client:form.client,phone:form.phone||"",email:form.email||"",address:form.address||"",license_num:form.licenseNum||"",start_date:form.start,end_date:form.end,rate:Number(form.rate),deposit:Number(form.deposit)||0,notes:form.notes||""};
    try{if(modal.type==="add"||modal.type==="add-g"){const[r]=await dbIns("bookings",p);setBookings(p=>[...p,mb(r)]);showT("Réservation ajoutée ✓");}
    else{await dbUpd("bookings",form.id,p);setBookings(p=>p.map(b=>b.id===form.id?{...mb({...p,id:form.id})}:b));showT("Réservation modifiée ✓");}}
    catch(e){showT("Erreur","error");}
    setSyncing(false);setModal(null);
  };
  const delBk=async id=>{setSyncing(true);await dbDel("bookings",id);setBookings(p=>p.filter(b=>b.id!==id));setModal(null);setDc(null);showT("Supprimée","info");setSyncing(false);};

  const openAddV=()=>{setForm({name:"",plate:"",type:"Berline",color:VC[Math.floor(Math.random()*VC.length)],year:"",mileage:"",fuel:"Essence"});setModal({type:"add-v"});};
  const openEditV=v=>{setForm({...v});setModal({type:"edit-v",vehicle:v});};
  const saveV=async()=>{
    if(!form.name||!form.plate||!form.type)return;setSyncing(true);
    const p={name:form.name,plate:form.plate,type:form.type,color:form.color,year:form.year||"",mileage:form.mileage||"",fuel:form.fuel||"Essence"};
    try{if(modal.type==="add-v"){const[r]=await dbIns("vehicles",p);setVehicles(p=>[...p,mv(r)]);showT("Véhicule ajouté ✓");}
    else{await dbUpd("vehicles",form.id,p);setVehicles(p=>p.map(v=>v.id===form.id?{...mv({...p,id:form.id})}:v));showT("Modifié ✓");}}
    catch(e){showT("Erreur","error");}
    setSyncing(false);setModal(null);
  };
  const delV=id=>{const h=bookings.some(b=>b.vehicleId===id);setDc(h?{type:"v-bk",id}:{type:"v",id});};
  const confDelV=async(id,wb)=>{
    setSyncing(true);
    if(wb){for(const b of bookings.filter(b=>b.vehicleId===id))await dbDel("bookings",b.id);}
    for(const e of expenses.filter(e=>e.vehicleId===id))await dbDel("expenses",e.id);
    await dbDel("vehicles",id);
    setVehicles(p=>p.filter(v=>v.id!==id));
    if(wb)setBookings(p=>p.filter(b=>b.vehicleId!==id));
    setExpenses(p=>p.filter(e=>e.vehicleId!==id));
    setDc(null);setModal(null);showT("Supprimé","info");setSyncing(false);
  };
  const openAddE=()=>{setForm({vehicleId:"",date:today,amount:"",category:"Carburant",note:""});setModal({type:"add-e"});};
  const openEditE=e=>{setForm({...e});setModal({type:"edit-e"});};
  const saveE=async()=>{
    if(!form.vehicleId||!form.date||!form.amount||!form.category)return;setSyncing(true);
    const p={vehicle_id:Number(form.vehicleId),date:form.date,amount:Number(form.amount),category:form.category,note:form.note||""};
    try{if(modal.type==="add-e"){const[r]=await dbIns("expenses",p);setExpenses(p=>[...p,me(r)]);showT("Dépense ajoutée ✓");}
    else{await dbUpd("expenses",form.id,p);setExpenses(p=>p.map(e=>e.id===form.id?{...me({...p,id:form.id})}:e));showT("Modifiée ✓");}}
    catch(e){showT("Erreur","error");}
    setSyncing(false);setModal(null);
  };
  const delE=async id=>{setSyncing(true);await dbDel("expenses",id);setExpenses(p=>p.filter(e=>e.id!==id));setModal(null);showT("Supprimée","info");setSyncing(false);};
  const openNewR=()=>{setForm({vehicleId:vehicles[0]?.id||"",start:spf?ps:today,end:spf?pe:ad(today,1),client:"",phone:"",email:"",address:"",licenseNum:"",rate:"",deposit:"",notes:""});setModal({type:"add-g"});};
  const exportPDF=(b,v)=>{const m={...b,...cex};const html=cHTML(m,v,cco);const w=window.open("","_blank","width=950,height=1100");if(!w)return;w.document.write(html);w.document.close();setTimeout(()=>w.print(),600);};

  const aip=useMemo(()=>{if(!spf||!ps||!pe)return vehicles;return vehicles.filter(v=>avail(v.id,ps,pe,bookings,undefined));},[vehicles,bookings,spf,ps,pe]);
  const dv=spf?aip:vehicles;
  const td=useMemo(()=>{
    let fb=bookings,fe=expenses;
    if(tFilter==="month"){fb=bookings.filter(b=>{const{y,m}=gym(b.start);return y===tYear&&m===tMonth;});fe=expenses.filter(e=>{const{y,m}=gym(e.date);return y===tYear&&m===tMonth;});}
    else if(tFilter==="year"){fb=bookings.filter(b=>gym(b.start).y===tYear);fe=expenses.filter(e=>gym(e.date).y===tYear);}
    const ti=fb.reduce((s,b)=>s+br(b),0),te=fe.reduce((s,e)=>s+e.amount,0),tp=ti-te;
    const pv=vehicles.map(v=>{const vi=fb.filter(b=>b.vehicleId===v.id).reduce((s,b)=>s+br(b),0),ve=fe.filter(e=>e.vehicleId===v.id).reduce((s,e)=>s+e.amount,0);return{...v,income:vi,expense:ve,profit:vi-ve};}).sort((a,b)=>b.income-a.income);
    const mc=Array.from({length:6},(_,i)=>{const d=new Date(TY,TM-5+i,1),y=d.getFullYear(),m=d.getMonth();const inc=bookings.filter(b=>{const bym=gym(b.start);return bym.y===y&&bym.m===m;}).reduce((s,b)=>s+br(b),0),exp=expenses.filter(e=>{const eym=gym(e.date);return eym.y===y&&eym.m===m;}).reduce((s,e)=>s+e.amount,0);return{label:MFR[m].slice(0,3),income:inc,expense:exp};});
    const bc={};fe.forEach(e=>{bc[e.category]=(bc[e.category]||0)+e.amount;});
    return{ti,te,tp,pv,mc,sc:Object.entries(bc).sort((a,b)=>b[1]-a[1]),fb,fe};
  },[bookings,expenses,vehicles,tFilter,tYear,tMonth,TY,TM]);

  const wdates=Array.from({length:7},(_,i)=>ad(selDate,i-(new Date(selDate).getDay()===0?6:new Date(selDate).getDay()-1)));
  const at=vehicles.filter(v=>!gbod(v.id,selDate));
  const bt=vehicles.filter(v=>gbod(v.id,selDate));
  const scb=bookings.find(b=>b.id===cbid);
  const scv=scb?vehicles.find(v=>v.id===scb.vehicleId):null;
  const si=spf?[{l:"Disponibles",v:aip.length,c:"#10B981",bg:"rgba(16,185,129,0.1)"},{l:"Non disponibles",v:vehicles.length-aip.length,c:"#F59E0B",bg:"rgba(245,158,11,0.1)"},{l:"Total",v:vehicles.length,c:"#3B82F6",bg:"rgba(59,130,246,0.1)"}]:[{l:"Disponibles",v:at.length,c:"#10B981",bg:"rgba(16,185,129,0.1)"},{l:"Loués",v:bt.length,c:"#F59E0B",bg:"rgba(245,158,11,0.1)"},{l:"Revenus/j",v:bt.reduce((a,v)=>{const b=gbod(v.id,selDate);return a+(b?b.rate:0);},0)+" €",c:"#3B82F6",bg:"rgba(59,130,246,0.1)"}];

  // Styles
  const BG="#0F1117",S1="#161B27",S2="#1E2535",S3="#2D3748";
  const pg=mob?{padding:"12px 14px",paddingBottom:80}:{maxWidth:1240,margin:"0 auto",padding:"20px 32px"};
  const card={background:S1,border:"1px solid "+S2,borderRadius:14,padding:mob?13:18};
  const btnP={background:"linear-gradient(135deg,#1a1a2e,#3B82F6)",border:"none",color:"#fff",padding:mob?"7px 12px":"9px 18px",borderRadius:9,cursor:"pointer",fontWeight:700,fontSize:mob?12:13};
  const btnS={background:S2,border:"none",color:"#94A3B8",padding:"7px 14px",borderRadius:7,cursor:"pointer",fontSize:12,fontWeight:600};

  if(loading)return<div style={{minHeight:"100vh",minHeight:"100dvh",background:BG,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:16}}><img src={LOGO} alt="" style={{width:80,height:80,objectFit:"contain",filter:"brightness(10)"}}/><div style={{color:"#F1F5F9",fontSize:17,fontWeight:700}}>Chane-To Location</div><div style={{display:"flex",alignItems:"center",gap:8,color:"#475569",fontSize:13}}><div style={{width:16,height:16,border:"2px solid "+S2,borderTopColor:"#3B82F6",borderRadius:"50%",animation:"spin .8s linear infinite"}}/>Chargement…</div></div>;

  const TABS=[{id:"calendar",icon:"📅",label:"Calendrier"},{id:"fleet",icon:"🚗",label:"Flotte"},{id:"treasury",icon:"💰",label:"Trésorerie"},{id:"contracts",icon:"📄",label:"Contrats"}];

  return<div style={{minHeight:"100vh",minHeight:"100dvh",width:"100%",background:BG,color:"#E2E8F0",fontFamily:"'Inter',system-ui,sans-serif",overflowX:"hidden"}}>
    <style>{"@keyframes spin{to{transform:rotate(360deg)}}input[type='date']::-webkit-calendar-picker-indicator{filter:invert(.5);cursor:pointer;}*{box-sizing:border-box;}"}</style>

    {toast&&<div style={{position:"fixed",top:mob?8:16,right:mob?8:16,zIndex:3000,background:toast.type==="success"?"#10B981":toast.type==="error"?"#EF4444":"#64748B",color:"#fff",padding:"9px 14px",borderRadius:9,fontWeight:600,fontSize:13,boxShadow:"0 4px 20px rgba(0,0,0,.5)"}}>{toast.msg}</div>}
    {syncing&&<div style={{position:"fixed",top:mob?8:16,left:"50%",transform:"translateX(-50%)",zIndex:3000,background:S1,border:"1px solid "+S3,color:"#94A3B8",padding:"5px 14px",borderRadius:20,fontSize:11,display:"flex",alignItems:"center",gap:6}}><div style={{width:11,height:11,border:"2px solid "+S2,borderTopColor:"#3B82F6",borderRadius:"50%",animation:"spin .8s linear infinite"}}/>Sync…</div>}

    {/* HEADER */}
    <header style={{background:S1,borderBottom:"1px solid "+S2,padding:mob?"0 12px":"0 32px",position:"sticky",top:0,zIndex:200}}>
      <div style={{maxWidth:1240,margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"space-between",height:mob?54:64,gap:8}}>
        <div style={{display:"flex",alignItems:"center",gap:mob?8:10,flexShrink:0}}>
          <img src={LOGO} alt="" style={{width:mob?34:42,height:mob?34:42,objectFit:"contain",filter:"brightness(10)"}}/>
          {!mob&&<div><div style={{fontWeight:800,fontSize:15,color:"#F1F5F9",letterSpacing:"-.02em"}}>Chane-To Location</div><div style={{fontSize:10,color:"#64748B"}}>Gestion de flotte · 0693 01 00 94</div></div>}
        </div>
        {!mob&&<nav style={{display:"flex",gap:3,background:S2,borderRadius:10,padding:3}}>
          {TABS.map(t=><button key={t.id} onClick={()=>setPage(t.id)} style={{background:page===t.id?"linear-gradient(135deg,#1a1a2e,#3B82F6)":"transparent",border:"none",color:page===t.id?"#fff":"#64748B",padding:"6px 14px",borderRadius:7,cursor:"pointer",fontSize:13,fontWeight:600}}>{t.icon} {t.label}</button>)}
        </nav>}
        <div style={{display:"flex",gap:6,alignItems:"center"}}>
          <button onClick={loadAll} title="Rafraîchir" style={{background:S2,border:"none",color:"#64748B",width:30,height:30,borderRadius:7,cursor:"pointer",fontSize:14,display:"flex",alignItems:"center",justifyContent:"center"}}>⟳</button>
          {!mob&&<div style={{background:S2,borderRadius:20,padding:"3px 10px",fontSize:11,color:"#94A3B8"}}>{vehicles.length} véh · {bt.length} loués</div>}
        </div>
      </div>
    </header>

    {/* MOBILE BOTTOM NAV */}
    {mob&&<nav style={{position:"fixed",bottom:0,left:0,right:0,background:S1,borderTop:"1px solid "+S2,display:"flex",zIndex:200,paddingBottom:"env(safe-area-inset-bottom,0px)"}}>
      {TABS.map(t=><button key={t.id} onClick={()=>setPage(t.id)} style={{flex:1,background:"none",border:"none",color:page===t.id?"#3B82F6":"#475569",padding:"9px 4px 7px",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:2}}>
        <span style={{fontSize:19}}>{t.icon}</span>
        <span style={{fontSize:9,fontWeight:600}}>{t.label}</span>
      </button>)}
    </nav>}

    {/* ── CALENDRIER ── */}
    {page==="calendar"&&<div style={pg}>
      {/* Top controls */}
      <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:10,flexWrap:"wrap"}}>
        <div style={{display:"flex",alignItems:"center",gap:5}}>
          <button onClick={()=>setSelDate(ad(selDate,-1))} style={{...btnS,padding:"6px 10px"}}>‹</button>
          <input type="date" value={selDate} onChange={e=>setSelDate(e.target.value)} style={{background:S2,border:"1px solid "+S3,color:"#E2E8F0",padding:"6px 9px",borderRadius:8,fontSize:13,fontWeight:600,cursor:"pointer"}}/>
          <button onClick={()=>setSelDate(ad(selDate,1))} style={{...btnS,padding:"6px 10px"}}>›</button>
        </div>
        <button onClick={()=>setSelDate(today)} style={{...btnS,background:selDate===today?"linear-gradient(135deg,#1a1a2e,#3B82F6)":"",color:selDate===today?"#fff":"#94A3B8"}}>Auj.</button>
        <button onClick={openNewR} style={{background:"linear-gradient(135deg,#10B981,#3B82F6)",border:"none",color:"#fff",padding:"7px 13px",borderRadius:8,cursor:"pointer",fontSize:12,fontWeight:700}}>＋ Réservation</button>
        {!mob&&<div style={{marginLeft:"auto",display:"flex",gap:3,background:S2,borderRadius:9,padding:3}}>
          {["day","week"].map(m=><button key={m} onClick={()=>setVm(m)} style={{background:vm===m?"linear-gradient(135deg,#1a1a2e,#3B82F6)":"transparent",border:"none",color:vm===m?"#fff":"#64748B",padding:"5px 12px",borderRadius:7,cursor:"pointer",fontSize:12,fontWeight:600}}>{m==="day"?"Jour":"Semaine"}</button>)}
        </div>}
      </div>

      {/* Period filter */}
      <div style={{background:S1,border:"1.5px solid "+(spf?"#3B82F6":S2),borderRadius:10,padding:"9px 12px",marginBottom:10}}>
        <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
          <button onClick={()=>setSpf(p=>!p)} style={{...btnS,background:spf?"linear-gradient(135deg,#1a1a2e,#3B82F6)":"",color:spf?"#fff":"#94A3B8",fontSize:12}}>🔍 Disponibilité</button>
          {spf&&<><div style={{display:"flex",alignItems:"center",gap:4}}><span style={{fontSize:11,color:"#64748B"}}>Du</span><input type="date" value={ps} onChange={e=>setPs(e.target.value)} style={{background:BG,border:"1px solid "+S3,color:"#E2E8F0",padding:"4px 7px",borderRadius:6,fontSize:11}}/></div>
          <div style={{display:"flex",alignItems:"center",gap:4}}><span style={{fontSize:11,color:"#64748B"}}>Au</span><input type="date" value={pe} onChange={e=>setPe(e.target.value)} style={{background:BG,border:"1px solid "+S3,color:"#E2E8F0",padding:"4px 7px",borderRadius:6,fontSize:11}}/></div>
          <span style={{fontSize:11,color:"#3B82F6",fontWeight:600}}>{aip.length}/{vehicles.length} dispo</span>
          <button onClick={()=>setSpf(false)} style={{...btnS,padding:"4px 8px",fontSize:11}}>✕</button></>}
        </div>
      </div>

      {/* Stats — toujours en grille 3 colonnes */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:mob?8:10,marginBottom:14}}>
        {si.map(s=><div key={s.l} style={{background:s.bg,border:"1px solid "+s.c+"30",borderRadius:10,padding:mob?"10px 8px":"12px 14px",textAlign:"center"}}>
          <div style={{fontSize:mob?18:22,fontWeight:700,color:s.c,lineHeight:1}}>{s.v}</div>
          <div style={{fontSize:mob?9:11,color:"#64748B",marginTop:3,lineHeight:1.2}}>{s.l}</div>
        </div>)}
      </div>

      {/* Day view */}
      {(vm==="day"||mob)&&<div style={{display:"grid",gridTemplateColumns:mob?"1fr":"repeat(auto-fill,minmax(270px,1fr))",gap:10}}>
        {vehicles.length===0&&<div style={{...card,textAlign:"center",padding:"36px",color:"#475569",gridColumn:"1/-1"}}>Aucun véhicule. Ajoutez-en dans "Flotte".</div>}
        {spf&&aip.length===0&&vehicles.length>0&&<div style={{...card,textAlign:"center",padding:"36px",gridColumn:"1/-1"}}><div style={{fontSize:32,marginBottom:8}}>🔍</div><div style={{fontSize:14,fontWeight:700,color:"#F1F5F9"}}>Aucun véhicule disponible sur cette période</div></div>}
        {dv.map(vehicle=>{const bk=gbod(vehicle.id,selDate),isB=spf?false:!!bk;return<div key={vehicle.id} onClick={()=>openDetail(vehicle.id,selDate)} style={{background:isB?"linear-gradient(135deg,"+vehicle.color+"18,"+vehicle.color+"08)":S1,border:"1.5px solid "+(isB?vehicle.color+"60":S2),borderRadius:13,padding:mob?13:16,cursor:"pointer",position:"relative",overflow:"hidden"}}>
          <div style={{position:"absolute",top:10,right:10,width:8,height:8,borderRadius:"50%",background:isB?"#F59E0B":"#10B981"}}/>
          <div style={{display:"flex",gap:9,alignItems:"flex-start",marginBottom:10}}>
            <div style={{width:36,height:36,borderRadius:9,background:vehicle.color+"30",display:"flex",alignItems:"center",justifyContent:"center",fontSize:17,flexShrink:0}}>{VE[vehicle.type]||"🚗"}</div>
            <div><div style={{fontWeight:700,fontSize:13,color:"#F1F5F9"}}>{vehicle.name}</div><div style={{fontSize:10,color:"#475569",marginTop:1}}>{vehicle.plate} · {vehicle.type}</div></div>
          </div>
          {isB?<div style={{background:BG,borderRadius:8,padding:"9px 11px"}}><div style={{fontSize:12,fontWeight:700,color:"#F1F5F9",marginBottom:3}}>👤 {bk.client}</div>{bk.phone&&<div style={{fontSize:10,color:"#64748B",marginBottom:2}}>📞 {bk.phone}</div>}<div style={{fontSize:10,color:"#64748B",marginBottom:5}}>📅 {fds(bk.start)} → {fds(bk.end)}</div><div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><span style={{color:"#F59E0B",fontWeight:700,fontSize:13}}>{bk.rate} €/j</span><span style={{fontSize:9,color:"#475569",background:S2,padding:"2px 6px",borderRadius:10}}>{gdb(bk.start,bk.end)}j · {bk.rate*gdb(bk.start,bk.end)} €</span></div></div>
          :<div style={{display:"flex",alignItems:"center",gap:6}}><span style={{color:"#10B981",fontSize:12,fontWeight:600}}>✓ Disponible</span><span style={{fontSize:11,color:"#334155",marginLeft:"auto"}}>+ Réserver</span></div>}
        </div>;})}
      </div>}

      {/* Week view desktop */}
      {vm==="week"&&!mob&&<div style={{overflowX:"auto"}}><div style={{minWidth:780}}>
        <div style={{display:"grid",gridTemplateColumns:"155px repeat(7,1fr)",gap:1,marginBottom:1}}>
          <div style={{padding:"7px 10px",background:S1,fontSize:10,color:"#475569",fontWeight:600}}>VÉHICULE</div>
          {wdates.map(date=>{const d=pd(date),isT=date===today,isS=date===selDate;return<div key={date} onClick={()=>{setSelDate(date);setVm("day");}} style={{padding:"7px",background:isS?"#3B82F620":S1,textAlign:"center",cursor:"pointer",borderBottom:isS?"2px solid #3B82F6":"2px solid transparent"}}><div style={{fontSize:9,color:"#475569",fontWeight:600}}>{d.toLocaleDateString("fr-FR",{weekday:"short"}).toUpperCase()}</div><div style={{fontSize:14,fontWeight:700,color:isT?"#3B82F6":"#E2E8F0"}}>{d.getDate()}</div></div>;})}
        </div>
        {dv.map(v=><div key={v.id} style={{display:"grid",gridTemplateColumns:"155px repeat(7,1fr)",gap:1,marginBottom:1}}>
          <div style={{background:S1,padding:"7px 10px",display:"flex",alignItems:"center",gap:7}}><div style={{width:7,height:7,borderRadius:"50%",background:v.color,flexShrink:0}}/><div style={{fontSize:11,fontWeight:600,color:"#E2E8F0",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{v.name}</div></div>
          {wdates.map(date=>{const bk=gbod(v.id,date),isS=date===selDate;return<div key={date} onClick={()=>openDetail(v.id,date)} style={{background:bk?v.color+"25":S1,border:"1px solid "+(isS?"#3B82F650":"transparent"),padding:"6px 8px",cursor:"pointer",minHeight:48,position:"relative"}}>{bk?<><div style={{fontSize:9,fontWeight:700,color:v.color,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{bk.client}</div><div style={{fontSize:8,color:"#64748B"}}>{bk.rate} €/j</div><div style={{position:"absolute",bottom:0,left:0,right:0,height:2,background:v.color,opacity:.7}}/></>:<div style={{color:S2,fontSize:14,textAlign:"center",marginTop:4}}>+</div>}</div>;})}
        </div>)}
      </div></div>}
    </div>}

    {/* ── FLOTTE ── */}
    {page==="fleet"&&<div style={pg}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
        <div><div style={{fontSize:mob?17:20,fontWeight:700,color:"#F1F5F9"}}>Ma flotte</div><div style={{fontSize:11,color:"#475569"}}>{vehicles.length} véhicule{vehicles.length>1?"s":""}</div></div>
        <button onClick={openAddV} style={btnP}>+ Ajouter</button>
      </div>
      {vehicles.length===0&&<div style={{...card,textAlign:"center",padding:"36px",color:"#475569"}}>Aucun véhicule. Commencez par en ajouter un.</div>}
      <div style={{display:"grid",gridTemplateColumns:mob?"1fr":"repeat(auto-fill,minmax(270px,1fr))",gap:10}}>
        {vehicles.map(v=>{const vB=bookings.filter(b=>b.vehicleId===v.id),aB=gbod(v.id,today);return<div key={v.id} style={{background:S1,border:"1.5px solid "+v.color+"40",borderRadius:13,overflow:"hidden"}}><div style={{height:3,background:v.color}}/><div style={{padding:mob?12:15}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
            <div style={{display:"flex",gap:9,alignItems:"center"}}><div style={{width:38,height:38,borderRadius:9,background:v.color+"25",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>{VE[v.type]||"🚗"}</div><div><div style={{fontWeight:700,fontSize:13,color:"#F1F5F9"}}>{v.name}</div><div style={{fontSize:10,color:"#475569"}}>{v.plate}</div></div></div>
            <div style={{display:"flex",gap:5}}><button onClick={()=>openEditV(v)} style={{background:S2,border:"none",color:"#94A3B8",width:28,height:28,borderRadius:6,cursor:"pointer",fontSize:12}}>✏️</button><button onClick={()=>delV(v.id)} style={{background:"#EF444415",border:"1px solid #EF444430",color:"#EF4444",width:28,height:28,borderRadius:6,cursor:"pointer",fontSize:12}}>🗑</button></div>
          </div>
          <div style={{display:"flex",gap:5,marginBottom:8}}>
            <span style={{background:v.color+"20",color:v.color,padding:"2px 8px",borderRadius:20,fontSize:10,fontWeight:600}}>{v.type}</span>
            <span style={{background:aB?"#F59E0B20":"#10B98120",color:aB?"#F59E0B":"#10B981",padding:"2px 8px",borderRadius:20,fontSize:10,fontWeight:600}}>● {aB?"Loué":"Dispo"}</span>
          </div>
          {aB&&<div style={{background:BG,borderRadius:7,padding:"7px 9px",marginBottom:7}}><div style={{fontSize:11,fontWeight:700,color:"#F1F5F9"}}>{aB.client}</div><div style={{fontSize:10,color:"#64748B"}}>jusqu'au {fds(aB.end)} · {aB.rate} €/j</div></div>}
          <div style={{fontSize:10,color:"#475569",borderTop:"1px solid "+S2,paddingTop:7}}>{vB.length} réservation{vB.length>1?"s":""}</div>
        </div></div>;})}
        <div onClick={openAddV} style={{background:S1,border:"1.5px dashed "+S3,borderRadius:13,padding:"24px",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:8,minHeight:100}}>
          <div style={{width:40,height:40,borderRadius:11,background:S2,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>+</div>
          <div style={{fontSize:12,color:"#475569",fontWeight:600}}>Ajouter un véhicule</div>
        </div>
      </div>
      {dc?.type?.startsWith("v")&&<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.8)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:300,padding:16}}><div style={{background:S1,borderRadius:15,width:"100%",maxWidth:360,border:"1px solid "+S2,padding:22}}><div style={{fontSize:15,fontWeight:700,color:"#EF4444",marginBottom:8}}>🗑 Supprimer le véhicule ?</div>{dc.type==="v-bk"&&<div style={{background:"#EF444415",border:"1px solid #EF444430",borderRadius:7,padding:9,marginBottom:10,fontSize:11,color:"#EF4444"}}>⚠️ Les réservations associées seront aussi supprimées.</div>}<div style={{fontSize:12,color:"#94A3B8",marginBottom:14}}>Cette action est irréversible.</div><div style={{display:"flex",gap:7}}><button onClick={()=>setDc(null)} style={{flex:1,background:S2,border:"none",color:"#94A3B8",padding:"9px",borderRadius:7,cursor:"pointer",fontWeight:600,fontSize:12}}>Annuler</button><button onClick={()=>confDelV(dc.id,dc.type==="v-bk")} style={{flex:1,background:"#EF4444",border:"none",color:"#fff",padding:"9px",borderRadius:7,cursor:"pointer",fontWeight:700,fontSize:12}}>Supprimer</button></div></div></div>}
    </div>}

    {/* ── TRÉSORERIE ── */}
    {page==="treasury"&&<div style={pg}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14,flexWrap:"wrap",gap:8}}>
        <div><div style={{fontSize:mob?17:20,fontWeight:700,color:"#F1F5F9"}}>Trésorerie</div><div style={{fontSize:11,color:"#475569"}}>Revenus et dépenses</div></div>
        <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
          <div style={{display:"flex",gap:2,background:S1,border:"1px solid "+S2,borderRadius:7,padding:2}}>
            {[{v:"month",l:"Mois"},{v:"year",l:"Année"},{v:"all",l:"Tout"}].map(f=><button key={f.v} onClick={()=>setTFilter(f.v)} style={{background:tFilter===f.v?"linear-gradient(135deg,#1a1a2e,#3B82F6)":"transparent",border:"none",color:tFilter===f.v?"#fff":"#64748B",padding:"4px 9px",borderRadius:5,cursor:"pointer",fontSize:11,fontWeight:600}}>{f.l}</button>)}
          </div>
          {tFilter==="month"&&<div style={{display:"flex",gap:4,alignItems:"center"}}>
            <button onClick={()=>{let m=tMonth-1,y=tYear;if(m<0){m=11;y--;}setTMonth(m);setTYear(y);}} style={{...btnS,padding:"4px 7px"}}>‹</button>
            <span style={{fontSize:11,fontWeight:600,color:"#E2E8F0",minWidth:82,textAlign:"center"}}>{MFR[tMonth].slice(0,4)} {tYear}</span>
            <button onClick={()=>{let m=tMonth+1,y=tYear;if(m>11){m=0;y++;}setTMonth(m);setTYear(y);}} style={{...btnS,padding:"4px 7px"}}>›</button>
          </div>}
          <button onClick={openAddE} style={btnP}>+ Dépense</button>
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:mob?"1fr 1fr":"repeat(4,1fr)",gap:9,marginBottom:13}}>
        {[{l:"Revenus",v:td.ti,c:"#10B981",bg:"rgba(16,185,129,0.08)",icon:"📈"},{l:"Dépenses",v:td.te,c:"#EF4444",bg:"rgba(239,68,68,0.08)",icon:"📉"},{l:"Bénéfice",v:td.tp,c:td.tp>=0?"#3B82F6":"#F59E0B",bg:td.tp>=0?"rgba(59,130,246,0.08)":"rgba(245,158,11,0.08)",icon:"💰"},{l:"Marge",v:td.ti>0?Math.round((td.tp/td.ti)*100)+"%":"—",c:"#8B5CF6",bg:"rgba(139,92,246,0.08)",icon:"📊"}].map(k=><div key={k.l} style={{...card,background:k.bg,border:"1px solid "+k.c+"25"}}>
          <div style={{fontSize:14,marginBottom:3}}>{k.icon}</div>
          <div style={{fontSize:9,color:"#64748B",fontWeight:600,marginBottom:2}}>{k.l}</div>
          <div style={{fontSize:mob?16:20,fontWeight:800,color:k.c}}>{typeof k.v==="number"?(k.v<0?"-":"")+Math.abs(k.v).toLocaleString("fr-FR")+" €":k.v}</div>
        </div>)}
      </div>
      <div style={{display:"grid",gridTemplateColumns:mob?"1fr":"1fr 1fr",gap:10,marginBottom:10}}>
        <div style={card}><div style={{fontSize:12,fontWeight:700,color:"#F1F5F9",marginBottom:8}}>6 derniers mois</div><BC data={td.mc}/></div>
        <div style={card}><div style={{fontSize:12,fontWeight:700,color:"#F1F5F9",marginBottom:10}}>Par catégorie</div>
          {td.sc.length===0?<div style={{color:"#475569",fontSize:11,textAlign:"center",padding:"12px 0"}}>Aucune dépense</div>:
          <div style={{display:"flex",flexDirection:"column",gap:7}}>{td.sc.map(([cat,amt])=>{const pct=td.te>0?Math.round((amt/td.te)*100):0;return<div key={cat}><div style={{display:"flex",justifyContent:"space-between",marginBottom:2}}><span style={{fontSize:11,color:"#E2E8F0"}}>{cat}</span><span style={{fontSize:11,fontWeight:700,color:"#EF4444"}}>{amt.toLocaleString("fr-FR")} €</span></div><div style={{height:3,background:S2,borderRadius:2}}><div style={{height:3,width:pct+"%",background:"#EF4444",borderRadius:2}}/></div></div>;})}</div>}
        </div>
      </div>
      <div style={{...card,marginBottom:10}}>
        <div style={{fontSize:12,fontWeight:700,color:"#F1F5F9",marginBottom:10}}>Performance par véhicule</div>
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
            <thead><tr style={{borderBottom:"1px solid "+S2}}>{["Véhicule","Revenus","Dépenses","Bénéfice"].map(h=><th key={h} style={{padding:"5px 9px",textAlign:"left",fontSize:9,color:"#475569",fontWeight:600}}>{h.toUpperCase()}</th>)}</tr></thead>
            <tbody>{td.pv.map(v=><tr key={v.id} style={{borderBottom:"1px solid "+S2+"20"}}><td style={{padding:"7px 9px"}}><div style={{display:"flex",alignItems:"center",gap:6}}><div style={{width:6,height:6,borderRadius:"50%",background:v.color,flexShrink:0}}/><span style={{fontWeight:600,color:"#E2E8F0"}}>{v.name}</span></div></td><td style={{padding:"7px 9px",color:"#10B981",fontWeight:700}}>{v.income.toLocaleString("fr-FR")} €</td><td style={{padding:"7px 9px",color:"#EF4444",fontWeight:700}}>{v.expense.toLocaleString("fr-FR")} €</td><td style={{padding:"7px 9px",color:v.profit>=0?"#3B82F6":"#F59E0B",fontWeight:700}}>{v.profit>=0?"+":""}{v.profit.toLocaleString("fr-FR")} €</td></tr>)}</tbody>
          </table>
        </div>
      </div>
      <div style={card}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10,flexWrap:"wrap",gap:7}}>
          <div style={{fontSize:12,fontWeight:700,color:"#F1F5F9"}}>Dépenses</div>
          <select value={evf} onChange={e=>setEvf(e.target.value)} style={{background:BG,border:"1px solid "+S3,color:"#E2E8F0",padding:"4px 9px",borderRadius:6,fontSize:11,cursor:"pointer"}}>
            <option value="all">Tous</option>{vehicles.map(v=><option key={v.id} value={v.id}>{v.name}</option>)}
          </select>
        </div>
        {td.fe.filter(e=>evf==="all"||e.vehicleId===Number(evf)).length===0?<div style={{color:"#475569",fontSize:11,textAlign:"center",padding:"14px"}}>Aucune dépense</div>:
        <div style={{display:"flex",flexDirection:"column",gap:6}}>{td.fe.filter(e=>evf==="all"||e.vehicleId===Number(evf)).sort((a,b)=>pd(b.date)-pd(a.date)).map(e=>{const v=vehicles.find(v=>v.id===e.vehicleId);return<div key={e.id} style={{display:"flex",alignItems:"center",gap:9,padding:"8px 10px",background:BG,borderRadius:8,cursor:"pointer"}} onClick={()=>openEditE(e)}>
          <div style={{width:30,height:30,borderRadius:7,background:(v?.color||"#475569")+"20",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,flexShrink:0}}>{e.category==="Carburant"?"⛽":e.category==="Entretien"?"🔧":e.category==="Assurance"?"🛡️":e.category==="Réparation"?"🔩":e.category==="Nettoyage"?"🧹":e.category==="Péage"?"🛣️":e.category==="Amende"?"📋":"💸"}</div>
          <div style={{flex:1,minWidth:0}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><span style={{fontWeight:600,color:"#E2E8F0",fontSize:12}}>{e.category}</span><span style={{fontWeight:700,color:"#EF4444",fontSize:12}}>-{e.amount.toLocaleString("fr-FR")} €</span></div><div style={{fontSize:10,color:"#475569",marginTop:1}}>{v?.name||"?"} · {fd(e.date)}</div></div>
        </div>);}}</div>}
      </div>
    </div>}

    {/* ── CONTRATS ── */}
    {page==="contracts"&&<div style={pg}>
      <div style={{marginBottom:14}}><div style={{fontSize:mob?17:20,fontWeight:700,color:"#F1F5F9"}}>📄 Contrats</div><div style={{fontSize:11,color:"#475569"}}>Exportez vos contrats en PDF</div></div>
      <div style={{display:"grid",gridTemplateColumns:mob?"1fr":"300px 1fr",gap:12,alignItems:"start"}}>
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          <div style={card}>
            <div style={{fontSize:11,fontWeight:700,color:"#F1F5F9",marginBottom:10}}>🏢 Société</div>
            <div style={{display:"flex",flexDirection:"column",gap:7}}>
              <CF label="Nom" value={cco.name} onChange={v=>setCco({...cco,name:v})} placeholder="Chane-To Location"/>
              <CF label="Adresse" value={cco.address} onChange={v=>setCco({...cco,address:v})} placeholder="Votre adresse"/>
              <CF label="Téléphone" value={cco.phone} onChange={v=>setCco({...cco,phone:v})} placeholder="0693 01 00 94"/>
              <CF label="Email" value={cco.email} onChange={v=>setCco({...cco,email:v})} placeholder="contact@..."/>
              <CF label="SIRET" value={cco.siret} onChange={v=>setCco({...cco,siret:v})} placeholder="123 456 789..."/>
            </div>
          </div>
          <div style={card}>
            <div style={{fontSize:11,fontWeight:700,color:"#F1F5F9",marginBottom:10}}>📋 Réservation</div>
            {bookings.length===0?<div style={{color:"#475569",fontSize:11,textAlign:"center",padding:"14px 0"}}>Aucune réservation</div>:
            <div style={{display:"flex",flexDirection:"column",gap:6,maxHeight:mob?180:360,overflowY:"auto"}}>
              {bookings.sort((a,b)=>pd(b.start)-pd(a.start)).map(b=>{const v=vehicles.find(v=>v.id===b.vehicleId),isSel=cbid===b.id;return<div key={b.id} onClick={()=>{setCbid(b.id);setCex({email:b.email||"",address:b.address||"",licenseNum:b.licenseNum||"",deposit:b.deposit||0});}} style={{background:isSel?"#3B82F620":BG,border:"1.5px solid "+(isSel?"#3B82F6":S2),borderRadius:8,padding:"8px 10px",cursor:"pointer"}}>
                <div style={{fontSize:11,fontWeight:700,color:"#F1F5F9"}}>{b.client}</div>
                <div style={{fontSize:9,color:"#64748B",marginTop:1}}>{v?.name||"?"} · {fd(b.start)} → {fd(b.end)}</div>
                <div style={{fontSize:11,fontWeight:700,color:"#F59E0B",marginTop:1}}>{b.rate*gdb(b.start,b.end)} €</div>
                {isSel&&<div style={{fontSize:9,color:"#3B82F6",fontWeight:600,marginTop:3}}>✓ Sélectionné</div>}
              </div>;})}
            </div>}
          </div>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {!scb?<div style={{...card,textAlign:"center",padding:"48px 20px"}}><div style={{fontSize:38,marginBottom:10}}>📄</div><div style={{fontSize:13,fontWeight:700,color:"#F1F5F9",marginBottom:5}}>Sélectionnez une réservation</div><div style={{fontSize:11,color:"#475569"}}>Choisissez une réservation pour créer le contrat.</div></div>:(
          <>
            <div style={card}>
              <div style={{fontSize:11,fontWeight:700,color:"#F1F5F9",marginBottom:10}}>👤 Locataire</div>
              <div style={{display:"grid",gridTemplateColumns:mob?"1fr":"1fr 1fr",gap:7}}>
                <CF label="Nom" value={scb.client} onChange={()=>{}} disabled/>
                <CF label="Téléphone" value={scb.phone} onChange={()=>{}} disabled/>
                <CF label="Email" value={cex.email} onChange={v=>setCex({...cex,email:v})} placeholder="email@client.fr"/>
                <CF label="N° Permis" value={cex.licenseNum} onChange={v=>setCex({...cex,licenseNum:v})} placeholder="123456789012"/>
                <div style={{gridColumn:mob?"1":"1/-1"}}><CF label="Adresse" value={cex.address} onChange={v=>setCex({...cex,address:v})} placeholder="12 rue..."/></div>
              </div>
            </div>
            <div style={{...card,background:"linear-gradient(135deg,#1a1a2e15,#3b82f60a)",border:"1.5px solid #3B82F630"}}>
              <div style={{fontSize:11,fontWeight:700,color:"#F1F5F9",marginBottom:10}}>📋 Récapitulatif</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                <div style={{background:BG,borderRadius:8,padding:"9px"}}><div style={{fontSize:9,color:"#64748B",marginBottom:2}}>VÉHICULE</div><div style={{fontSize:12,fontWeight:700,color:"#F1F5F9"}}>{scv?.name}</div><div style={{fontSize:10,color:"#475569"}}>{scv?.plate}</div></div>
                <div style={{background:BG,borderRadius:8,padding:"9px"}}><div style={{fontSize:9,color:"#64748B",marginBottom:2}}>PÉRIODE</div><div style={{fontSize:11,fontWeight:700,color:"#F1F5F9"}}>{fd(scb.start)}</div><div style={{fontSize:10,color:"#475569"}}>→ {fd(scb.end)}</div></div>
                <div style={{background:BG,borderRadius:8,padding:"9px"}}><div style={{fontSize:9,color:"#64748B",marginBottom:2}}>TOTAL</div><div style={{fontSize:15,fontWeight:800,color:"#F59E0B"}}>{(scb.rate*gdb(scb.start,scb.end)).toLocaleString("fr-FR")} €</div></div>
                <div style={{background:BG,borderRadius:8,padding:"9px"}}><div style={{fontSize:9,color:"#64748B",marginBottom:2}}>CAUTION (€)</div><input type="number" value={cex.deposit||0} onChange={e=>setCex({...cex,deposit:Number(e.target.value)})} style={{width:"100%",background:"transparent",border:"none",color:"#F1F5F9",fontSize:15,fontWeight:800,outline:"none"}}/></div>
              </div>
            </div>
            <button onClick={()=>exportPDF({...scb,...cex},scv)} style={{background:"linear-gradient(135deg,#1a1a2e,#3B82F6)",border:"none",color:"#fff",padding:"13px 20px",borderRadius:10,cursor:"pointer",fontWeight:800,fontSize:13,display:"flex",alignItems:"center",justifyContent:"center",gap:7,boxShadow:"0 4px 20px rgba(59,130,246,.4)"}}>
              <span style={{fontSize:15}}>📥</span> Exporter en PDF
            </button>
          </>)}
        </div>
      </div>
    </div>}

    {/* ── MODALS ── */}
    {modal&&!dc?.type?.startsWith("v")&&<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.82)",display:"flex",alignItems:mob?"flex-end":"center",justifyContent:"center",zIndex:250,padding:mob?0:16}} onClick={e=>e.target===e.currentTarget&&setModal(null)}>
      <div style={{background:S1,borderRadius:mob?"18px 18px 0 0":"18px",width:"100%",maxWidth:mob?"100%":490,border:"1px solid "+S2,boxShadow:"0 20px 60px rgba(0,0,0,.7)",maxHeight:mob?"92vh":"88vh",overflowY:"auto"}}>

        {modal.type==="detail"&&modal.booking&&(()=>{const v=vehicles.find(v=>v.id===modal.vehicleId),b=modal.booking;return<>
          <div style={{padding:"18px 22px",borderBottom:"1px solid "+S2,display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}><div><div style={{fontSize:10,color:"#475569",fontWeight:600,marginBottom:2}}>RÉSERVATION</div><div style={{fontSize:17,fontWeight:700,color:"#F1F5F9"}}>{b.client}</div></div><button onClick={()=>setModal(null)} style={{background:S2,border:"none",color:"#64748B",width:28,height:28,borderRadius:6,cursor:"pointer",fontSize:15}}>×</button></div>
          <div style={{padding:"14px 22px",display:"flex",flexDirection:"column",gap:11}}>
            <Row icon="🚗" label="Véhicule" value={(v?.name||"?")+" · "+(v?.plate||"?")}/>
            <Row icon="📞" label="Téléphone" value={b.phone||"—"}/>
            <Row icon="📧" label="Email" value={b.email||"—"}/>
            <Row icon="📅" label="Période" value={fd(b.start)+" → "+fd(b.end)}/>
            <Row icon="⏱" label="Durée" value={gdb(b.start,b.end)+" jour(s)"}/>
            <div style={{background:BG,borderRadius:9,padding:"12px",display:"flex",justifyContent:"space-between"}}><div><div style={{fontSize:10,color:"#475569"}}>Tarif/jour</div><div style={{fontSize:20,fontWeight:700,color:"#F59E0B"}}>{b.rate} €</div></div><div style={{textAlign:"right"}}><div style={{fontSize:10,color:"#475569"}}>Total</div><div style={{fontSize:20,fontWeight:700,color:"#10B981"}}>{b.rate*gdb(b.start,b.end)} €</div></div></div>
            {b.notes&&<Row icon="💬" label="Notes" value={b.notes}/>}
          </div>
          <div style={{padding:"10px 22px 22px",display:"flex",gap:7,flexWrap:"wrap"}}>
            <button onClick={()=>openEdit(b)} style={{flex:1,background:"#3B82F6",border:"none",color:"#fff",padding:"10px",borderRadius:8,cursor:"pointer",fontWeight:600,fontSize:12}}>✏️ Modifier</button>
            <button onClick={()=>{setPage("contracts");setCbid(b.id);setCex({email:b.email||"",address:b.address||"",licenseNum:b.licenseNum||"",deposit:b.deposit||0});setModal(null);}} style={{flex:1,background:"#1a1a2e30",border:"1px solid #3B82F640",color:"#3B82F6",padding:"10px",borderRadius:8,cursor:"pointer",fontWeight:600,fontSize:12}}>📄 Contrat</button>
            <button onClick={()=>setDc(b.id)} style={{flex:1,background:"#EF444420",border:"1px solid #EF444440",color:"#EF4444",padding:"10px",borderRadius:8,cursor:"pointer",fontWeight:600,fontSize:12}}>🗑</button>
          </div>
          {dc===b.id&&<div style={{padding:"0 22px 18px"}}><div style={{background:"#EF444415",border:"1px solid #EF444430",borderRadius:8,padding:"11px"}}><div style={{fontSize:11,color:"#EF4444",marginBottom:9,fontWeight:600}}>Confirmer la suppression ?</div><div style={{display:"flex",gap:6}}><button onClick={()=>delBk(b.id)} style={{flex:1,background:"#EF4444",border:"none",color:"#fff",padding:"7px",borderRadius:6,cursor:"pointer",fontWeight:600,fontSize:11}}>Oui</button><button onClick={()=>setDc(null)} style={{flex:1,background:S2,border:"none",color:"#94A3B8",padding:"7px",borderRadius:6,cursor:"pointer",fontSize:11}}>Non</button></div></div></div>}
        </>;})()} 

        {(modal.type==="add"||modal.type==="edit"||modal.type==="add-g")&&(()=>{const isE=modal.type==="edit",isG=modal.type==="add-g",v=vehicles.find(v=>v.id===(Number(form.vehicleId)||modal.vehicleId));return<>
          <div style={{padding:"18px 22px",borderBottom:"1px solid "+S2,display:"flex",justifyContent:"space-between",alignItems:"center"}}><div><div style={{fontSize:10,color:"#475569",fontWeight:600}}>{isE?"MODIFIER":"NOUVELLE RÉSERVATION"}</div><div style={{fontSize:15,fontWeight:700,color:"#F1F5F9",marginTop:2}}>{isE?v?.name:(isG?"Choisir un véhicule":v?.name)}</div></div><button onClick={()=>setModal(null)} style={{background:S2,border:"none",color:"#64748B",width:28,height:28,borderRadius:6,cursor:"pointe
