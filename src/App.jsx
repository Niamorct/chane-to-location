import { useState, useMemo, useEffect, useCallback } from "react";

const SUPA_URL="https://lmtgoehaeepigauxeeor.supabase.co";
const SUPA_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxtdGdvZWhhZWVwaWdhdXhlZW9yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE1MDg0NTksImV4cCI6MjA5NzA4NDQ1OX0.c4RvAe0leTvcMHUzYoAeZX8F1-VtAbePaqBV-F89kbc";
const H={"Content-Type":"application/json","apikey":SUPA_KEY,"Authorization":"Bearer "+SUPA_KEY,"Prefer":"return=representation"};
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
  return"<!DOCTYPE html><html><head><meta charset='UTF-8'><title>Contrat "+cn+"</title><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:Arial,sans-serif;font-size:10pt}.p{width:210mm;min-height:297mm;padding:13mm 15mm;margin:0 auto}.hd{display:flex;justify-content:space-between;border-bottom:3px solid #0F1117;padding-bottom:10px;margin-bottom:12px}.cn{font-size:17pt;font-weight:900;color:#0F1117}.g2{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:10px}.g3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:7px}.s{border:1px solid #d1d5db;border-radius:5px;overflow:hidden;margin-bottom:10px}.sh{background:#0F1117;color:white;padding:5px 10px;font-size:8pt;font-weight:700}.sb{padding:9px 10px}.fr{display:flex;justify-content:space-between;border-bottom:1px solid #f3f4f6;padding:3px 0}.fr:last-child{border:none}.fl{font-size:8pt;color:#6b7280;font-weight:600;min-width:120px}.fv{font-size:9pt;color:#111827;font-weight:600;text-align:right}.am{background:linear-gradient(135deg,#0F1117,#3b82f6);color:white;border-radius:7px;padding:12px 16px;margin-bottom:10px}.ag{display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;text-align:center}.al{font-size:7pt;opacity:.75;margin-bottom:2px}.av{font-size:13pt;font-weight:900}.at{text-align:center;margin-top:7px;border-top:1px solid rgba(255,255,255,.3);padding-top:7px}.sg{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:10px}.si{border:1px solid #d1d5db;border-radius:5px;padding:9px 10px}.st{font-size:8pt;font-weight:700;margin-bottom:5px}.sl{border-bottom:1.5px solid #374151;height:42px;margin-bottom:5px}.sm{font-size:7pt;color:#6b7280}.cv{border:1px solid #e5e7eb;border-radius:5px;padding:10px}.ct{font-size:9pt;font-weight:900;color:#0F1117;margin-bottom:7px;text-align:center;border-bottom:2px solid #0F1117;padding-bottom:5px}.at2{margin-bottom:5px}.at2-t{font-size:8pt;font-weight:700;color:#0F1117;margin-bottom:1px}.at2-b{font-size:7pt;color:#374151;line-height:1.4}.ft{font-size:7pt;color:#9ca3af;text-align:center;border-top:1px solid #e5e7eb;padding-top:7px;margin-top:10px}@media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact}}</style></head><body><div class='p'><div class='hd'><div><div class='cn'>"+co.name+"</div><div style='font-size:8pt;color:#64748b'>Location de véhicules</div><div style='margin-top:5px;font-size:7.5pt;color:#374151;line-height:1.5'>"+co.address+"<br>Tél : "+co.phone+(co.email?" - "+co.email:"")+"<br>"+(co.siret?"SIRET : "+co.siret:"")+"</div></div><div><div style='background:#0F1117;color:white;padding:4px 12px;border-radius:4px;font-size:7pt;font-weight:700;letter-spacing:1px;text-align:center;margin-bottom:4px'>CONTRAT DE LOCATION</div><div style='font-size:9pt;font-weight:700;text-align:center'>"+cn+"</div><div style='font-size:7.5pt;color:#6b7280;text-align:center;margin-top:3px'>Établi le "+ts+"</div></div></div><div class='g2'><div class='s'><div class='sh'>LE LOUEUR</div><div class='sb'><div class='fr'><span class='fl'>Société</span><span class='fv'>"+co.name+"</span></div><div class='fr'><span class='fl'>Téléphone</span><span class='fv'>"+co.phone+"</span></div><div class='fr'><span class='fl'>Email</span><span class='fv'>"+(co.email||"—")+"</span></div><div class='fr'><span class='fl'>SIRET</span><span class='fv'>"+(co.siret||"—")+"</span></div></div></div><div class='s'><div class='sh'>LE LOCATAIRE</div><div class='sb'><div class='fr'><span class='fl'>Nom complet</span><span class='fv'>"+b.client+"</span></div><div class='fr'><span class='fl'>Adresse</span><span class='fv'>"+(b.address||"—")+"</span></div><div class='fr'><span class='fl'>Téléphone</span><span class='fv'>"+(b.phone||"—")+"</span></div><div class='fr'><span class='fl'>Email</span><span class='fv'>"+(b.email||"—")+"</span></div><div class='fr'><span class='fl'>N° Permis</span><span class='fv'>"+(b.licenseNum||"—")+"</span></div></div></div></div><div class='s'><div class='sh'>VÉHICULE LOUÉ</div><div class='sb'><div class='g3'><div class='fr'><span class='fl'>Désignation</span><span class='fv'>"+v.name+"</span></div><div class='fr'><span class='fl'>Immatriculation</span><span class='fv'>"+v.plate+"</span></div><div class='fr'><span class='fl'>Type</span><span class='fv'>"+v.type+"</span></div><div class='fr'><span class='fl'>Année</span><span class='fv'>"+(v.year||"—")+"</span></div><div class='fr'><span class='fl'>Carburant</span><span class='fv'>"+(v.fuel||"—")+"</span></div><div class='fr'><span class='fl'>Km départ</span><span class='fv'>"+(v.mileage||"—")+" km</span></div></div></div></div><div class='s'><div class='sh'>PÉRIODE</div><div class='sb'><div class='g3'><div class='fr'><span class='fl'>Départ</span><span class='fv'>"+fdl(b.start)+"</span></div><div class='fr'><span class='fl'>Retour</span><span class='fv'>"+fdl(b.end)+"</span></div><div class='fr'><span class='fl'>Durée</span><span class='fv'>"+days+" jour"+(days>1?"s":"")+"</span></div></div></div></div><div class='am'><div style='font-size:8pt;opacity:.8;font-weight:600;margin-bottom:5px'>RECAPITULATIF FINANCIER</div><div class='ag'><div><div class='al'>TARIF/JOUR</div><div class='av'>"+b.rate+" €</div></div><div><div class='al'>DURÉE</div><div class='av'>"+days+"j</div></div><div><div class='al'>CAUTION</div><div class='av'>"+(b.deposit||0)+" €</div></div></div><div class='at'><div style='font-size:8pt;opacity:.8'>MONTANT TOTAL</div><div style='font-size:17pt;font-weight:900'>"+total.toLocaleString("fr-FR")+" €</div><div style='font-size:8pt;opacity:.85;font-style:italic;margin-top:2px'>Soit : "+tw+" euros</div></div></div>"+(b.notes?"<div style='background:#fef3c7;border:1px solid #f59e0b;border-radius:5px;padding:7px 10px;margin-bottom:10px;font-size:7.5pt;color:#92400e;text-align:center;font-weight:600'>NOTE : "+b.notes+"</div>":"")+"<div class='sg'><div class='si'><div class='st'>SIGNATURE DU LOUEUR</div><div class='sl'></div><div class='sm'>Lu et approuvé - "+co.name+"</div></div><div class='si'><div class='st'>SIGNATURE DU LOCATAIRE</div><div class='sl'></div><div class='sm'>Lu et approuvé - "+b.client+"</div></div></div><div class='cv'><div class='ct'>CONDITIONS GÉNÉRALES DE LOCATION</div><div class='at2'><div class='at2-t'>Art. 1 - Objet</div><div class='at2-b'>Mise à disposition du véhicule décrit. La signature vaut acceptation sans réserve.</div></div><div class='at2'><div class='at2-t'>Art. 2 - Éligibilité</div><div class='at2-b'>Permis valable depuis 2 ans minimum, âge minimum 21 ans. Tout document falsifié entraîne résiliation et poursuites.</div></div><div class='at2'><div class='at2-t'>Art. 3 - Restitution</div><div class='at2-b'>État des lieux à la prise et restitution. Véhicule rendu propre avec même niveau carburant. Retard non signalé 24h avant = tarif majoré 20%.</div></div><div class='at2'><div class='at2-t'>Art. 4 - Caution</div><div class='at2-b'>Caution restituée à la remise déduction faite des frais. Règlement intégral à la signature.</div></div><div class='at2'><div class='at2-t'>Art. 5 - Responsabilité</div><div class='at2-b'>Le locataire est responsable de tout dommage. Franchise à sa charge. Utilisation à l'étranger nécessite autorisation écrite.</div></div><div class='at2'><div class='at2-t'>Art. 6 - Interdictions</div><div class='at2-b'>Interdit : sous-louer, utiliser en compétition, matières dangereuses, dépasser charge utile, fumer à bord.</div></div><div class='at2'><div class='at2-t'>Art. 7 - Panne/Accidents</div><div class='at2-b'>Contacter immédiatement le loueur. Constat amiable obligatoire sous 24h. Réparations soumises à accord préalable.</div></div><div class='at2'><div class='at2-t'>Art. 8 - Litiges</div><div class='at2-b'>Règlement amiable privilégié. Tribunal du siège du loueur. Droit français applicable.</div></div></div><div class='ft'>"+co.name+" — "+co.phone+" | Contrat "+cn+" — "+ts+"</div></div></body></html>";
}

function BC({data,h=110}){
  if(!data||!data.length)return null;
  const mx=Math.max(...data.map(d=>Math.max(d.income,d.expense)),1),w=100/data.length;
  return <svg viewBox={"0 0 100 "+h} style={{width:"100%",height:h,display:"block"}}>{data.map((d,i)=>{const ih=(d.income/mx)*(h-18),eh=(d.expense/mx)*(h-18),x=i*w;return <g key={i}><rect x={x+w*.1} y={h-18-ih} width={w*.35} height={ih} fill="#10B981" opacity=".85" rx="1"/><rect x={x+w*.55} y={h-18-eh} width={w*.35} height={eh} fill="#EF4444" opacity=".85" rx="1"/><text x={x+w/2} y={h-3} textAnchor="middle" fontSize="4" fill="#475569">{d.label}</text></g>;})}</svg>;
}
function Row({icon,label,value}){return <div style={{display:"flex",gap:10,alignItems:"flex-start"}}><span style={{fontSize:15,width:22,flexShrink:0}}>{icon}</span><div><div style={{fontSize:10,color:"#475569",fontWeight:600}}>{label.toUpperCase()}</div><div style={{fontSize:13,color:"#E2E8F0",marginTop:1}}>{value}</div></div></div>;}
function Fld({label,value,onChange,placeholder,type="text",textarea,disabled}){
  const s={width:"100%",background:"#0F1117",border:"1px solid #2D3748",color:"#E2E8F0",padding:"9px 11px",borderRadius:7,fontSize:13,outline:"none",resize:"vertical",fontFamily:"inherit",opacity:disabled?0.6:1};
  return <div><label style={{fontSize:11,color:"#475569",fontWeight:600,display:"block",marginBottom:5}}>{label.toUpperCase()}</label>{textarea?<textarea value={value||""} onChange={e=>onChange(e.target.value)} placeholder={placeholder} rows={3} style={s} disabled={disabled}/>:<input type={type} value={value||""} onChange={e=>onChange(e.target.value)} placeholder={placeholder} style={s} disabled={disabled}/>}</div>;
}
function CF({label,value,onChange,placeholder,disabled}){
  return <div><label style={{fontSize:10,color:"#475569",fontWeight:600,display:"block",marginBottom:3}}>{label.toUpperCase()}</label><input value={value||""} onChange={e=>onChange(e.target.value)} placeholder={placeholder} disabled={disabled} style={{width:"100%",background:"#0F1117",border:"1px solid #1E2535",color:"#E2E8F0",padding:"7px 9px",borderRadius:6,fontSize:12,outline:"none",opacity:disabled?0.6:1}}/></div>;
}
function useIsMobile(){
  const[m,setM]=useState(false);
  useEffect(()=>{
    const check=()=>setM(window.innerWidth<900);
    check();
    window.addEventListener("resize",check);
    return()=>window.removeEventListener("resize",check);
  },[]);
  return m;
}

export default function App(){
  const today=new Date().toISOString().slice(0,10);
  const TY=new Date().getFullYear(),TM=new Date().getMonth();
  const mob=useIsMobile();
  const BG="#0F1117",S1="#161B27",S2="#1E2535",S3="#2D3748";
  const HH=mob?54:64;

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
    try{
      const[vR,bR,eR]=await Promise.all([dbGet("vehicles"),dbGet("bookings"),dbGet("expenses")]);
      setVehicles((vR||[]).map(mv));
      setBookings((bR||[]).map(mb));
      setExpenses((eR||[]).map(me));
    }catch(e){showT("Erreur de connexion","error");}
    setLoading(false);
  },[]);
  useEffect(()=>{loadAll();},[loadAll]);

  const showT=(msg,type="success")=>{setToast({msg,type});setTimeout(()=>setToast(null),3000);};
  const gbod=(vid,date)=>bookings.find(b=>b.vehicleId===vid&&dir(date,b.start,b.end));

  const openDetail=(vid,date)=>{
    const bk=gbod(vid,date);
    if(bk){setModal({type:"detail",vehicleId:vid,booking:bk,date});}
    else{setForm({vehicleId:vid,start:spf?ps:date,end:spf?pe:date,client:"",phone:"",email:"",address:"",licenseNum:"",rate:"",deposit:"",notes:""});setModal({type:"add",vehicleId:vid,date});}
  };
  const openEdit=bk=>{setForm({...bk});setModal({type:"edit",booking:bk});};
  const saveBk=async()=>{
    if(!form.client||!form.start||!form.end||!form.rate)return;
    if(pd(form.end)<pd(form.start))return;
    setSyncing(true);
    const p={vehicle_id:Number(form.vehicleId),client:form.client,phone:form.phone||"",email:form.email||"",address:form.address||"",license_num:form.licenseNum||"",start_date:form.start,end_date:form.end,rate:Number(form.rate),deposit:Number(form.deposit)||0,notes:form.notes||""};
    try{
      if(modal.type==="add"||modal.type==="add-g"){const[r]=await dbIns("bookings",p);setBookings(prev=>[...prev,mb(r)]);showT("Réservation ajoutée ✓");}
      else{await dbUpd("bookings",form.id,p);setBookings(prev=>prev.map(b=>b.id===form.id?mb({...p,id:form.id}):b));showT("Réservation modifiée ✓");}
    }catch(e){showT("Erreur","error");}
    setSyncing(false);setModal(null);
  };
  const delBk=async id=>{setSyncing(true);await dbDel("bookings",id);setBookings(prev=>prev.filter(b=>b.id!==id));setModal(null);setDc(null);showT("Supprimée","info");setSyncing(false);};

  const openAddV=()=>{setForm({name:"",plate:"",type:"Berline",color:VC[Math.floor(Math.random()*VC.length)],year:"",mileage:"",fuel:"Essence"});setModal({type:"add-v"});};
  const openEditV=v=>{setForm({...v});setModal({type:"edit-v"});};
  const saveV=async()=>{
    if(!form.name||!form.plate||!form.type)return;
    setSyncing(true);
    const p={name:form.name,plate:form.plate,type:form.type,color:form.color,year:form.year||"",mileage:form.mileage||"",fuel:form.fuel||"Essence"};
    try{
      if(modal.type==="add-v"){const[r]=await dbIns("vehicles",p);setVehicles(prev=>[...prev,mv(r)]);showT("Véhicule ajouté ✓");}
      else{await dbUpd("vehicles",form.id,p);setVehicles(prev=>prev.map(v=>v.id===form.id?mv({...p,id:form.id}):v));showT("Modifié ✓");}
    }catch(e){showT("Erreur","error");}
    setSyncing(false);setModal(null);
  };
  const delV=id=>{const h=bookings.some(b=>b.vehicleId===id);setDc(h?{type:"v-bk",id}:{type:"v",id});};
  const confDelV=async(id,wb)=>{
    setSyncing(true);
    if(wb){for(const b of bookings.filter(b=>b.vehicleId===id))await dbDel("bookings",b.id);}
    for(const e of expenses.filter(e=>e.vehicleId===id))await dbDel("expenses",e.id);
    await dbDel("vehicles",id);
    setVehicles(prev=>prev.filter(v=>v.id!==id));
    if(wb)setBookings(prev=>prev.filter(b=>b.vehicleId!==id));
    setExpenses(prev=>prev.filter(e=>e.vehicleId!==id));
    setDc(null);setModal(null);showT("Supprimé","info");setSyncing(false);
  };
  const openAddE=()=>{setForm({vehicleId:"",date:today,amount:"",category:"Carburant",note:""});setModal({type:"add-e"});};
  const openEditE=e=>{setForm({...e});setModal({type:"edit-e"});};
  const saveE=async()=>{
    if(!form.vehicleId||!form.date||!form.amount||!form.category)return;
    setSyncing(true);
    const p={vehicle_id:Number(form.vehicleId),date:form.date,amount:Number(form.amount),category:form.category,note:form.note||""};
    try{
      if(modal.type==="add-e"){const[r]=await dbIns("expenses",p);setExpenses(prev=>[...prev,me(r)]);showT("Dépense ajoutée ✓");}
      else{await dbUpd("expenses",form.id,p);setExpenses(prev=>prev.map(e=>e.id===form.id?me({...p,id:form.id}):e));showT("Modifiée ✓");}
    }catch(e){showT("Erreur","error");}
    setSyncing(false);setModal(null);
  };
  const delE=async id=>{setSyncing(true);await dbDel("expenses",id);setExpenses(prev=>prev.filter(e=>e.id!==id));setModal(null);showT("Supprimée","info");setSyncing(false);};
  const openNewR=()=>{setForm({vehicleId:vehicles[0]?.id||"",start:spf?ps:today,end:spf?pe:ad(today,1),client:"",phone:"",email:"",address:"",licenseNum:"",rate:"",deposit:"",notes:""});setModal({type:"add-g"});};
  const exportPDF=(b,v)=>{const bm={...b,...cex};const html=cHTML(bm,v,cco);const w=window.open("","_blank","width=950,height=1100");if(!w)return;w.document.write(html);w.document.close();setTimeout(()=>w.print(),600);};

  const aip=useMemo(()=>{if(!spf||!ps||!pe)return vehicles;return vehicles.filter(v=>avail(v.id,ps,pe,bookings,undefined));},[vehicles,bookings,spf,ps,pe]);
  const dv=spf?aip:vehicles;

  const td=useMemo(()=>{
    let fb=bookings,fe=expenses;
    if(tFilter==="month"){fb=bookings.filter(b=>{const{y,m}=gym(b.start);return y===tYear&&m===tMonth;});fe=expenses.filter(e=>{const{y,m}=gym(e.date);return y===tYear&&m===tMonth;});}
    else if(tFilter==="year"){fb=bookings.filter(b=>gym(b.start).y===tYear);fe=expenses.filter(e=>gym(e.date).y===tYear);}
    const ti=fb.reduce((s,b)=>s+br(b),0),te=fe.reduce((s,e)=>s+e.amount,0),tp=ti-te;
    const pv=vehicles.map(v=>{const vi=fb.filter(b=>b.vehicleId===v.id).reduce((s,b)=>s+br(b),0),ve=fe.filter(e=>e.vehicleId===v.id).reduce((s,e)=>s+e.amount,0);return{...v,income:vi,expense:ve,profit:vi-ve};}).sort((a,b)=>b.income-a.income);
    const mc=Array.from({length:6},(_,i)=>{
      const d=new Date(TY,TM-5+i,1),y=d.getFullYear(),m=d.getMonth();
      const inc=bookings.filter(b=>{const bym=gym(b.start);return bym.y===y&&bym.m===m;}).reduce((s,b)=>s+br(b),0);
      const exp=expenses.filter(e=>{const eym=gym(e.date);return eym.y===y&&eym.m===m;}).reduce((s,e)=>s+e.amount,0);
      return{label:MFR[m].slice(0,3),income:inc,expense:exp};
    });
    const bc={};fe.forEach(e=>{bc[e.category]=(bc[e.category]||0)+e.amount;});
    return{ti,te,tp,pv,mc,sc:Object.entries(bc).sort((a,b)=>b[1]-a[1]),fb,fe};
  },[bookings,expenses,vehicles,tFilter,tYear,tMonth,TY,TM]);

  const wdates=Array.from({length:7},(_,i)=>ad(selDate,i-(new Date(selDate).getDay()===0?6:new Date(selDate).getDay()-1)));
  const at=vehicles.filter(v=>!gbod(v.id,selDate));
  const bt=vehicles.filter(v=>gbod(v.id,selDate));
  const scb=bookings.find(b=>b.id===cbid);
  const scv=scb?vehicles.find(v=>v.id===scb.vehicleId):null;
  const si=spf
    ?[{l:"Disponibles",v:aip.length,c:"#10B981",bg:"rgba(16,185,129,0.1)"},{l:"Non disponibles",v:vehicles.length-aip.length,c:"#F59E0B",bg:"rgba(245,158,11,0.1)"},{l:"Total",v:vehicles.length,c:"#3B82F6",bg:"rgba(59,130,246,0.1)"}]
    :[{l:"Disponibles",v:at.length,c:"#10B981",bg:"rgba(16,185,129,0.1)"},{l:"Loués",v:bt.length,c:"#F59E0B",bg:"rgba(245,158,11,0.1)"},{l:"Revenus/j",v:bt.reduce((a,v)=>{const b=gbod(v.id,selDate);return a+(b?b.rate:0);},0)+" €",c:"#3B82F6",bg:"rgba(59,130,246,0.1)"}];

  const card={background:S1,border:"1px solid "+S2,borderRadius:14,padding:mob?13:18};
  const btnP={background:"linear-gradient(135deg,#1a1a2e,#3B82F6)",border:"none",color:"#fff",padding:mob?"7px 12px":"9px 18px",borderRadius:9,cursor:"pointer",fontWeight:700,fontSize:mob?12:13};
  const btnS={background:S2,border:"none",color:"#94A3B8",padding:"7px 14px",borderRadius:7,cursor:"pointer",fontSize:12,fontWeight:600};
  const pg={padding:mob?"12px 14px 88px":"20px 32px 40px",maxWidth:mob?undefined:1240,margin:mob?undefined:"0 auto",paddingTop:HH+16};

  const TABS=[{id:"calendar",icon:"📅",label:"Calendrier"},{id:"fleet",icon:"🚗",label:"Flotte"},{id:"treasury",icon:"💰",label:"Trésorerie"},{id:"contracts",icon:"📄",label:"Contrats"}];

  if(loading)return(
    <div style={{minHeight:"100dvh",background:BG,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:16}}>
      <img src={LOGO} alt="" style={{width:80,height:80,objectFit:"contain",filter:"brightness(10)"}}/>
      <div style={{color:"#F1F5F9",fontSize:17,fontWeight:700}}>Chane-To Location</div>
      <div style={{display:"flex",alignItems:"center",gap:8,color:"#475569",fontSize:13}}>
        <div style={{width:16,height:16,border:"2px solid "+S2,borderTopColor:"#3B82F6",borderRadius:"50%",animation:"spin .8s linear infinite"}}/>
        Chargement…
      </div>
    </div>
  );

  return(
    <div style={{minHeight:"100dvh",width:"100%",background:BG,color:"#E2E8F0",fontFamily:"'Inter',system-ui,sans-serif",overflowX:"hidden"}}>
      <style>{"@keyframes spin{to{transform:rotate(360deg)}}input[type='date']::-webkit-calendar-picker-indicator{filter:invert(.5);cursor:pointer;}*{box-sizing:border-box;}"}</style>

      {/* TOASTS */}
      {toast&&<div style={{position:"fixed",top:mob?8:16,right:mob?8:16,zIndex:3000,background:toast.type==="success"?"#10B981":toast.type==="error"?"#EF4444":"#64748B",color:"#fff",padding:"9px 14px",borderRadius:9,fontWeight:600,fontSize:13,boxShadow:"0 4px 20px rgba(0,0,0,.5)"}}>{toast.msg}</div>}
      {syncing&&<div style={{position:"fixed",top:mob?8:16,left:"50%",transform:"translateX(-50%)",zIndex:3000,background:S1,border:"1px solid "+S3,color:"#94A3B8",padding:"5px 14px",borderRadius:20,fontSize:11,display:"flex",alignItems:"center",gap:6}}><div style={{width:11,height:11,border:"2px solid "+S2,borderTopColor:"#3B82F6",borderRadius:"50%",animation:"spin .8s linear infinite"}}/>Sync…</div>}

      {/* HEADER FIXE */}
      <header style={{background:S1,borderBottom:"1px solid "+S2,padding:mob?"0 12px":"0 32px",position:"fixed",top:0,left:0,right:0,zIndex:200,height:HH}}>
        <div style={{maxWidth:1240,margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"space-between",height:"100%",gap:8}}>
          <div style={{display:"flex",alignItems:"center",gap:mob?8:10,flexShrink:0}}>
            <img src={LOGO} alt="" style={{width:mob?34:42,height:mob?34:42,objectFit:"contain",filter:"brightness(10)"}}/>
            {!mob&&<div><div style={{fontWeight:800,fontSize:15,color:"#F1F5F9"}}>Chane-To Location</div><div style={{fontSize:10,color:"#64748B"}}>Gestion de flotte · 0693 01 00 94</div></div>}
          </div>
          {!mob&&<nav style={{display:"flex",gap:3,background:S2,borderRadius:10,padding:3}}>
            {TABS.map(t=><button key={t.id} onClick={()=>setPage(t.id)} style={{background:page===t.id?"linear-gradient(135deg,#1a1a2e,#3B82F6)":"transparent",border:"none",color:page===t.id?"#fff":"#64748B",padding:"6px 14px",borderRadius:7,cursor:"pointer",fontSize:13,fontWeight:600}}>{t.icon} {t.label}</button>)}
          </nav>}
          <div style={{display:"flex",gap:6,alignItems:"center"}}>
            <button onClick={loadAll} style={{background:S2,border:"none",color:"#64748B",width:30,height:30,borderRadius:7,cursor:"pointer",fontSize:14,display:"flex",alignItems:"center",justifyContent:"center"}}>⟳</button>
            {!mob&&<div style={{background:S2,borderRadius:20,padding:"3px 10px",fontSize:11,color:"#94A3B8"}}>{vehicles.length} véh · {bt.length} loués</div>}
          </div>
        </div>
      </header>

      {/* NAV BAS MOBILE */}
      {mob&&<nav style={{position:"fixed",bottom:0,left:0,right:0,background:S1,borderTop:"1px solid "+S2,display:"flex",zIndex:200,paddingBottom:"env(safe-area-inset-bottom,0px)"}}>
        {TABS.map(t=><button key={t.id} onClick={()=>setPage(t.id)} style={{flex:1,background:"none",border:"none",color:page===t.id?"#3B82F6":"#475569",padding:"9px 4px 7px",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:2}}>
          <span style={{fontSize:19}}>{t.icon}</span>
          <span style={{fontSize:9,fontWeight:600}}>{t.label}</span>
        </button>)}
      </nav>}

      {/* ── CALENDRIER ── */}
      {page==="calendar"&&<div style={pg}>
        {/* CONTROLES DESKTOP */}
        {!mob&&<div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}>
          <button onClick={()=>setSelDate(ad(selDate,-1))} style={{background:S2,border:"none",color:"#E2E8F0",width:36,height:36,borderRadius:8,cursor:"pointer",fontSize:20,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>‹</button>
          <input type="date" value={selDate} onChange={e=>setSelDate(e.target.value)} style={{background:S2,border:"1px solid "+S3,color:"#E2E8F0",padding:"7px 12px",borderRadius:8,fontSize:14,fontWeight:600,cursor:"pointer",flexShrink:0}}/>
          <button onClick={()=>setSelDate(ad(selDate,1))} style={{background:S2,border:"none",color:"#E2E8F0",width:36,height:36,borderRadius:8,cursor:"pointer",fontSize:20,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>›</button>
          <button onClick={()=>setSelDate(today)} style={{background:selDate===today?"linear-gradient(135deg,#1a1a2e,#3B82F6)":S2,border:"none",color:"#fff",padding:"7px 14px",borderRadius:8,cursor:"pointer",fontSize:13,fontWeight:600,flexShrink:0}}>Aujourd'hui</button>
          <button onClick={openNewR} style={{background:"linear-gradient(135deg,#10B981,#3B82F6)",border:"none",color:"#fff",padding:"8px 14px",borderRadius:8,cursor:"pointer",fontSize:13,fontWeight:700,flexShrink:0}}>＋ Nouvelle réservation</button>
          <div style={{marginLeft:"auto",display:"flex",gap:3,background:S2,borderRadius:10,padding:4,flexShrink:0}}>
            <button onClick={()=>setVm("day")} style={{background:vm==="day"?"linear-gradient(135deg,#1a1a2e,#3B82F6)":"transparent",border:"none",color:vm==="day"?"#fff":"#94A3B8",padding:"7px 20px",borderRadius:7,cursor:"pointer",fontSize:13,fontWeight:700}}>📅 Jour</button>
            <button onClick={()=>setVm("week")} style={{background:vm==="week"?"linear-gradient(135deg,#1a1a2e,#3B82F6)":"transparent",border:"none",color:vm==="week"?"#fff":"#94A3B8",padding:"7px 20px",borderRadius:7,cursor:"pointer",fontSize:13,fontWeight:700}}>📆 Semaine</button>
          </div>
        </div>}

        {/* CONTROLES MOBILE */}
        {mob&&<div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:14}}>
          {/* Ligne 1 : navigation date */}
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <button onClick={()=>setSelDate(ad(selDate,-1))} style={{background:S2,border:"none",color:"#E2E8F0",width:44,height:44,borderRadius:10,cursor:"pointer",fontSize:22,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>‹</button>
            <input type="date" value={selDate} onChange={e=>setSelDate(e.target.value)} style={{flex:1,background:S2,border:"1px solid "+S3,color:"#E2E8F0",padding:"11px 12px",borderRadius:10,fontSize:15,fontWeight:700,cursor:"pointer",textAlign:"center"}}/>
            <button onClick={()=>setSelDate(ad(selDate,1))} style={{background:S2,border:"none",color:"#E2E8F0",width:44,height:44,borderRadius:10,cursor:"pointer",fontSize:22,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>›</button>
          </div>
          {/* Ligne 2 : Aujourd'hui + Nouvelle réservation */}
          <div style={{display:"flex",gap:8}}>
            <button onClick={()=>setSelDate(today)} style={{flex:1,background:selDate===today?"linear-gradient(135deg,#1a1a2e,#3B82F6)":S2,border:"none",color:"#fff",padding:"12px 0",borderRadius:10,cursor:"pointer",fontSize:14,fontWeight:700,textAlign:"center"}}>Aujourd'hui</button>
            <button onClick={openNewR} style={{flex:2,background:"linear-gradient(135deg,#10B981,#3B82F6)",border:"none",color:"#fff",padding:"12px 0",borderRadius:10,cursor:"pointer",fontSize:14,fontWeight:700,textAlign:"center"}}>＋ Nouvelle réservation</button>
          </div>
          {/* Ligne 3 : Jour / Semaine */}
          <div style={{display:"flex",gap:0,background:S2,borderRadius:10,padding:4}}>
            <button onClick={()=>setVm("day")} style={{flex:1,background:vm==="day"?"linear-gradient(135deg,#1a1a2e,#3B82F6)":"transparent",border:"none",color:vm==="day"?"#fff":"#64748B",padding:"10px 0",borderRadius:8,cursor:"pointer",fontSize:14,fontWeight:700}}>📅 Jour</button>
            <button onClick={()=>setVm("week")} style={{flex:1,background:vm==="week"?"linear-gradient(135deg,#1a1a2e,#3B82F6)":"transparent",border:"none",color:vm==="week"?"#fff":"#64748B",padding:"10px 0",borderRadius:8,cursor:"pointer",fontSize:14,fontWeight:700}}>📆 Semaine</button>
          </div>
        </div>}

        {/* Filtre disponibilité — esthétique amélioré */}
        <div style={{marginBottom:14}}>
          {/* Bouton centré quand fermé */}
          {!spf&&<div style={{display:"flex",justifyContent:"center"}}>
            <button onClick={()=>setSpf(true)} style={{background:"linear-gradient(135deg,#1E2535,#2D3748)",border:"1px solid #3B82F630",color:"#94A3B8",padding:"10px 32px",borderRadius:20,cursor:"pointer",fontSize:13,fontWeight:600,display:"flex",alignItems:"center",gap:8,boxShadow:"0 2px 12px rgba(0,0,0,0.3)"}}>
              <span style={{fontSize:14}}>🔍</span> Filtre de disponibilité
            </button>
          </div>}
          {/* Panel ouvert */}
          {spf&&<div style={{background:"linear-gradient(135deg,#161B27,#1E2535)",border:"1.5px solid #3B82F660",borderRadius:14,padding:"14px 16px",boxShadow:"0 4px 20px rgba(59,130,246,0.15)"}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <span style={{fontSize:14}}>🔍</span>
                <span style={{fontSize:13,fontWeight:700,color:"#3B82F6"}}>Filtre de disponibilité</span>
                <span style={{background:"#3B82F620",border:"1px solid #3B82F640",borderRadius:20,padding:"2px 10px",fontSize:11,color:"#3B82F6",fontWeight:600}}>{aip.length}/{vehicles.length} dispo</span>
              </div>
              <button onClick={()=>setSpf(false)} style={{background:"#EF444420",border:"1px solid #EF444430",color:"#EF4444",width:26,height:26,borderRadius:6,cursor:"pointer",fontSize:13,display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:mob?8:16,flexWrap:mob?"wrap":"nowrap"}}>
              <div style={{display:"flex",alignItems:"center",gap:8,flex:1}}>
                <span style={{fontSize:12,color:"#64748B",fontWeight:600,flexShrink:0}}>Du</span>
                <input type="date" value={ps} onChange={e=>setPs(e.target.value)} style={{flex:1,background:"#0F1117",border:"1px solid #2D3748",color:"#E2E8F0",padding:"8px 10px",borderRadius:8,fontSize:13,minWidth:0}}/>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:8,flex:1}}>
                <span style={{fontSize:12,color:"#64748B",fontWeight:600,flexShrink:0}}>Au</span>
                <input type="date" value={pe} onChange={e=>setPe(e.target.value)} style={{flex:1,background:"#0F1117",border:"1px solid #2D3748",color:"#E2E8F0",padding:"8px 10px",borderRadius:8,fontSize:13,minWidth:0}}/>
              </div>
              {ps&&pe&&pd(pe)>=pd(ps)&&<span style={{background:"#3B82F620",border:"1px solid #3B82F640",borderRadius:20,padding:"4px 12px",fontSize:12,color:"#3B82F6",fontWeight:700,flexShrink:0,whiteSpace:"nowrap"}}>{gdb(ps,pe)}j</span>}
            </div>
            {aip.length===0&&<div style={{marginTop:10,background:"#F59E0B15",border:"1px solid #F59E0B30",borderRadius:8,padding:"8px 12px",fontSize:12,color:"#F59E0B",textAlign:"center"}}>⚠️ Aucun véhicule disponible sur cette période</div>}
          </div>}
        </div>

        {/* Stats */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:mob?8:10,marginBottom:14}}>
          {si.map(s=>(
            <div key={s.l} style={{background:s.bg,border:"1px solid "+s.c+"30",borderRadius:10,padding:mob?"10px 8px":"12px 14px",textAlign:"center"}}>
              <div style={{fontSize:mob?18:22,fontWeight:700,color:s.c,lineHeight:1}}>{s.v}</div>
              <div style={{fontSize:mob?9:11,color:"#64748B",marginTop:3,lineHeight:1.2}}>{s.l}</div>
            </div>
          ))}
        </div>

        {/* Vue Jour */}
        {/* FILTRE ACTIF : même liste pour Jour ET Semaine */}
        {spf&&(
          <>
            {aip.length===0&&<div style={{...card,textAlign:"center",padding:"48px"}}>
              <div style={{fontSize:40,marginBottom:12}}>🔍</div>
              <div style={{fontSize:15,fontWeight:700,color:"#F1F5F9",marginBottom:6}}>Aucun véhicule disponible</div>
              <div style={{fontSize:12,color:"#475569"}}>du {fd(ps)} au {fd(pe)}</div>
            </div>}
            {aip.length>0&&<div style={{display:"flex",flexDirection:"column",gap:10}}>
              <div style={{fontSize:13,fontWeight:700,color:"#94A3B8",marginBottom:2}}>
                {aip.length} véhicule{aip.length>1?"s":""} disponible{aip.length>1?"s":""} · {fd(ps)} → {fd(pe)}
              </div>
              {aip.map(vehicle=>(
                <div key={vehicle.id} onClick={()=>openDetail(vehicle.id,selDate)} style={{background:"linear-gradient(135deg,"+vehicle.color+"15,"+vehicle.color+"05)",border:"1.5px solid "+vehicle.color+"50",borderRadius:14,padding:mob?14:18,cursor:"pointer",display:"flex",alignItems:"center",gap:14}}>
                  <div style={{width:mob?48:56,height:mob?48:56,borderRadius:12,background:vehicle.color+"30",display:"flex",alignItems:"center",justifyContent:"center",fontSize:mob?22:26,flexShrink:0}}>{VE[vehicle.type]||"🚗"}</div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
                      <div style={{fontWeight:700,fontSize:mob?14:15,color:"#F1F5F9"}}>{vehicle.name}</div>
                      <span style={{background:"#10B98120",color:"#10B981",padding:"2px 8px",borderRadius:20,fontSize:10,fontWeight:700,flexShrink:0}}>✓ Disponible</span>
                    </div>
                    <div style={{fontSize:11,color:"#475569",marginBottom:mob?6:4}}>{vehicle.plate} · {vehicle.type} · {vehicle.fuel||"—"}</div>
                    <div style={{display:"flex",gap:mob?8:16,flexWrap:"wrap"}}>
                      {vehicle.year&&<span style={{fontSize:11,color:"#64748B"}}>📅 {vehicle.year}</span>}
                      {vehicle.mileage&&<span style={{fontSize:11,color:"#64748B"}}>🛣 {Number(vehicle.mileage).toLocaleString("fr-FR")} km</span>}
                    </div>
                  </div>
                  <div style={{flexShrink:0,background:"linear-gradient(135deg,#10B981,#3B82F6)",borderRadius:10,padding:mob?"8px 12px":"10px 16px",color:"#fff",fontSize:mob?11:12,fontWeight:700,textAlign:"center"}}>
                    + Réserver
                  </div>
                </div>
              ))}
            </div>}
          </>
        )}

        {/* VUE JOUR — filtre inactif */}
        {!spf&&vm==="day"&&(
          <div style={{display:"grid",gridTemplateColumns:mob?"1fr":"repeat(auto-fill,minmax(270px,1fr))",gap:10}}>
            {vehicles.length===0&&<div style={{...card,textAlign:"center",padding:"36px",color:"#475569",gridColumn:"1/-1"}}>Aucun véhicule. Ajoutez-en dans "Flotte".</div>}
            {vehicles.map(vehicle=>{
              const bk=gbod(vehicle.id,selDate),isB=!!bk;
              return(
                <div key={vehicle.id} onClick={()=>openDetail(vehicle.id,selDate)} style={{background:isB?"linear-gradient(135deg,"+vehicle.color+"18,"+vehicle.color+"08)":S1,border:"1.5px solid "+(isB?vehicle.color+"60":S2),borderRadius:13,padding:mob?13:16,cursor:"pointer",position:"relative",overflow:"hidden"}}>
                  <div style={{position:"absolute",top:10,right:10,width:8,height:8,borderRadius:"50%",background:isB?"#F59E0B":"#10B981"}}/>
                  <div style={{display:"flex",gap:9,alignItems:"flex-start",marginBottom:10}}>
                    <div style={{width:36,height:36,borderRadius:9,background:vehicle.color+"30",display:"flex",alignItems:"center",justifyContent:"center",fontSize:17,flexShrink:0}}>{VE[vehicle.type]||"🚗"}</div>
                    <div><div style={{fontWeight:700,fontSize:13,color:"#F1F5F9"}}>{vehicle.name}</div><div style={{fontSize:10,color:"#475569",marginTop:1}}>{vehicle.plate} · {vehicle.type}</div></div>
                  </div>
                  {isB?(
                    <div style={{background:BG,borderRadius:8,padding:"9px 11px"}}>
                      <div style={{fontSize:12,fontWeight:700,color:"#F1F5F9",marginBottom:3}}>👤 {bk.client}</div>
                      {bk.phone&&<div style={{fontSize:10,color:"#64748B",marginBottom:2}}>📞 {bk.phone}</div>}
                      <div style={{fontSize:10,color:"#64748B",marginBottom:5}}>📅 {fds(bk.start)} → {fds(bk.end)}</div>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                        <span style={{color:"#F59E0B",fontWeight:700,fontSize:13}}>{bk.rate} €/j</span>
                        <span style={{fontSize:9,color:"#475569",background:S2,padding:"2px 6px",borderRadius:10}}>{gdb(bk.start,bk.end)}j · {bk.rate*gdb(bk.start,bk.end)} €</span>
                      </div>
                    </div>
                  ):(
                    <div style={{display:"flex",alignItems:"center",gap:6}}>
                      <span style={{color:"#10B981",fontSize:12,fontWeight:600}}>✓ Disponible</span>
                      <span style={{fontSize:11,color:"#334155",marginLeft:"auto"}}>+ Réserver</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* VUE SEMAINE — filtre inactif */}
        {!spf&&vm==="week"&&(
          <div style={{overflowX:"auto",WebkitOverflowScrolling:"touch",marginLeft:mob?-14:0,marginRight:mob?-14:0,paddingLeft:mob?14:0,paddingRight:mob?14:0}}>
            <div style={{minWidth:mob?500:780}}>
              <div style={{display:"grid",gridTemplateColumns:mob?"70px repeat(7,1fr)":"155px repeat(7,1fr)",gap:1,marginBottom:1}}>
                <div style={{padding:mob?"5px 4px":"7px 10px",background:S1,fontSize:mob?8:10,color:"#475569",fontWeight:600}}>{mob?"":"VÉHICULE"}</div>
                {wdates.map(date=>{const d=pd(date),isT=date===today,isS=date===selDate;return(
                  <div key={date} onClick={()=>{setSelDate(date);setVm("day");}} style={{padding:mob?"4px 2px":"7px",background:isS?"#3B82F620":S1,textAlign:"center",cursor:"pointer",borderBottom:isS?"2px solid #3B82F6":"2px solid transparent"}}>
                    <div style={{fontSize:mob?7:9,color:"#475569",fontWeight:600}}>{d.toLocaleDateString("fr-FR",{weekday:"short"}).toUpperCase()}</div>
                    <div style={{fontSize:mob?12:14,fontWeight:700,color:isT?"#3B82F6":"#E2E8F0"}}>{d.getDate()}</div>
                  </div>
                );})}
              </div>
              {vehicles.map(v=>(
                <div key={v.id} style={{display:"grid",gridTemplateColumns:mob?"70px repeat(7,1fr)":"155px repeat(7,1fr)",gap:1,marginBottom:1}}>
                  <div style={{background:S1,padding:mob?"5px 4px":"7px 10px",display:"flex",alignItems:"center",gap:mob?4:7,overflow:"hidden"}}>
                    <div style={{width:mob?5:7,height:mob?5:7,borderRadius:"50%",background:v.color,flexShrink:0}}/>
                    {!mob&&<div style={{fontSize:11,fontWeight:600,color:"#E2E8F0",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{v.name}</div>}
                    {mob&&<div style={{fontSize:8,fontWeight:600,color:"#E2E8F0",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",lineHeight:1.2}}>{v.name.split(" ").slice(-1)[0]}</div>}
                  </div>
                  {wdates.map(date=>{const bk=gbod(v.id,date),isS=date===selDate;return(
                    <div key={date} onClick={()=>openDetail(v.id,date)} style={{background:bk?v.color+"25":S1,border:"1px solid "+(isS?"#3B82F650":"transparent"),padding:mob?"3px 2px":"6px 8px",cursor:"pointer",minHeight:mob?40:48,position:"relative",overflow:"hidden"}}>
                      {bk?(<><div style={{fontSize:mob?7:9,fontWeight:700,color:v.color,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{mob?bk.client.split(" ")[0]:bk.client}</div>{!mob&&<div style={{fontSize:8,color:"#64748B"}}>{bk.rate} €/j</div>}<div style={{position:"absolute",bottom:0,left:0,right:0,height:2,background:v.color,opacity:.7}}/></>):<div style={{color:S2,fontSize:mob?10:14,textAlign:"center",marginTop:mob?10:4}}>+</div>}
                    </div>
                  );})}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>}

      {/* ── FLOTTE ── */}
      {page==="fleet"&&<div style={pg}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
          <div><div style={{fontSize:mob?17:20,fontWeight:700,color:"#F1F5F9"}}>Ma flotte</div><div style={{fontSize:11,color:"#475569"}}>{vehicles.length} véhicule{vehicles.length>1?"s":""}</div></div>
          <button onClick={openAddV} style={btnP}>+ Ajouter</button>
        </div>
        {vehicles.length===0&&<div style={{...card,textAlign:"center",padding:"36px",color:"#475569"}}>Aucun véhicule.</div>}
        <div style={{display:"grid",gridTemplateColumns:mob?"1fr":"repeat(auto-fill,minmax(270px,1fr))",gap:10}}>
          {vehicles.map(v=>{
            const vB=bookings.filter(b=>b.vehicleId===v.id),aB=gbod(v.id,today);
            return(
              <div key={v.id} style={{background:S1,border:"1.5px solid "+v.color+"40",borderRadius:13,overflow:"hidden"}}>
                <div style={{height:3,background:v.color}}/>
                <div style={{padding:mob?12:15}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
                    <div style={{display:"flex",gap:9,alignItems:"center"}}>
                      <div style={{width:38,height:38,borderRadius:9,background:v.color+"25",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>{VE[v.type]||"🚗"}</div>
                      <div><div style={{fontWeight:700,fontSize:13,color:"#F1F5F9"}}>{v.name}</div><div style={{fontSize:10,color:"#475569"}}>{v.plate}</div></div>
                    </div>
                    <div style={{display:"flex",gap:5}}>
                      <button onClick={()=>openEditV(v)} style={{background:S2,border:"none",color:"#94A3B8",width:28,height:28,borderRadius:6,cursor:"pointer",fontSize:12}}>✏️</button>
                      <button onClick={()=>delV(v.id)} style={{background:"#EF444415",border:"1px solid #EF444430",color:"#EF4444",width:28,height:28,borderRadius:6,cursor:"pointer",fontSize:12}}>🗑</button>
                    </div>
                  </div>
                  <div style={{display:"flex",gap:5,marginBottom:8}}>
                    <span style={{background:v.color+"20",color:v.color,padding:"2px 8px",borderRadius:20,fontSize:10,fontWeight:600}}>{v.type}</span>
                    <span style={{background:aB?"#F59E0B20":"#10B98120",color:aB?"#F59E0B":"#10B981",padding:"2px 8px",borderRadius:20,fontSize:10,fontWeight:600}}>● {aB?"Loué":"Dispo"}</span>
                  </div>
                  {aB&&<div style={{background:BG,borderRadius:7,padding:"7px 9px",marginBottom:7}}><div style={{fontSize:11,fontWeight:700,color:"#F1F5F9"}}>{aB.client}</div><div style={{fontSize:10,color:"#64748B"}}>jusqu'au {fds(aB.end)} · {aB.rate} €/j</div></div>}
                  <div style={{fontSize:10,color:"#475569",borderTop:"1px solid "+S2,paddingTop:7}}>{vB.length} réservation{vB.length>1?"s":""}</div>
                </div>
              </div>
            );
          })}
          <div onClick={openAddV} style={{background:S1,border:"1.5px dashed "+S3,borderRadius:13,padding:"24px",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:8,minHeight:100}}>
            <div style={{width:40,height:40,borderRadius:11,background:S2,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>+</div>
            <div style={{fontSize:12,color:"#475569",fontWeight:600}}>Ajouter un véhicule</div>
          </div>
        </div>
        {dc?.type?.startsWith("v")&&(
          <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.8)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:300,padding:16}}>
            <div style={{background:S1,borderRadius:15,width:"100%",maxWidth:360,border:"1px solid "+S2,padding:22}}>
              <div style={{fontSize:15,fontWeight:700,color:"#EF4444",marginBottom:8}}>🗑 Supprimer le véhicule ?</div>
              {dc.type==="v-bk"&&<div style={{background:"#EF444415",border:"1px solid #EF444430",borderRadius:7,padding:9,marginBottom:10,fontSize:11,color:"#EF4444"}}>⚠️ Les réservations associées seront aussi supprimées.</div>}
              <div style={{fontSize:12,color:"#94A3B8",marginBottom:14}}>Cette action est irréversible.</div>
              <div style={{display:"flex",gap:7}}>
                <button onClick={()=>setDc(null)} style={{flex:1,background:S2,border:"none",color:"#94A3B8",padding:"9px",borderRadius:7,cursor:"pointer",fontWeight:600,fontSize:12}}>Annuler</button>
                <button onClick={()=>confDelV(dc.id,dc.type==="v-bk")} style={{flex:1,background:"#EF4444",border:"none",color:"#fff",padding:"9px",borderRadius:7,cursor:"pointer",fontWeight:700,fontSize:12}}>Supprimer</button>
              </div>
            </div>
          </div>
        )}
      </div>}

      {/* ── TRÉSORERIE ── */}
      {page==="treasury"&&<div style={pg}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14,flexWrap:"wrap",gap:8}}>
          <div><div style={{fontSize:mob?17:20,fontWeight:700,color:"#F1F5F9"}}>Trésorerie</div><div style={{fontSize:11,color:"#475569"}}>Revenus et dépenses</div></div>
          <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
            <div style={{display:"flex",gap:2,background:S1,border:"1px solid "+S2,borderRadius:7,padding:2}}>
              {[{v:"month",l:"Mois"},{v:"year",l:"Année"},{v:"all",l:"Tout"}].map(f=>(
                <button key={f.v} onClick={()=>setTFilter(f.v)} style={{background:tFilter===f.v?"linear-gradient(135deg,#1a1a2e,#3B82F6)":"transparent",border:"none",color:tFilter===f.v?"#fff":"#64748B",padding:"4px 9px",borderRadius:5,cursor:"pointer",fontSize:11,fontWeight:600}}>{f.l}</button>
              ))}
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
          {[{l:"Revenus",v:td.ti,c:"#10B981",bg:"rgba(16,185,129,0.08)",icon:"📈"},{l:"Dépenses",v:td.te,c:"#EF4444",bg:"rgba(239,68,68,0.08)",icon:"📉"},{l:"Bénéfice",v:td.tp,c:td.tp>=0?"#3B82F6":"#F59E0B",bg:td.tp>=0?"rgba(59,130,246,0.08)":"rgba(245,158,11,0.08)",icon:"💰"},{l:"Marge",v:td.ti>0?Math.round((td.tp/td.ti)*100)+"%":"—",c:"#8B5CF6",bg:"rgba(139,92,246,0.08)",icon:"📊"}].map(k=>(
            <div key={k.l} style={{...card,background:k.bg,border:"1px solid "+k.c+"25"}}>
              <div style={{fontSize:14,marginBottom:3}}>{k.icon}</div>
              <div style={{fontSize:9,color:"#64748B",fontWeight:600,marginBottom:2}}>{k.l}</div>
              <div style={{fontSize:mob?16:20,fontWeight:800,color:k.c}}>{typeof k.v==="number"?(k.v<0?"-":"")+Math.abs(k.v).toLocaleString("fr-FR")+" €":k.v}</div>
            </div>
          ))}
        </div>
        <div style={{display:"grid",gridTemplateColumns:mob?"1fr":"1fr 1fr",gap:10,marginBottom:10}}>
          <div style={card}><div style={{fontSize:12,fontWeight:700,color:"#F1F5F9",marginBottom:8}}>6 derniers mois</div><BC data={td.mc}/></div>
          <div style={card}>
            <div style={{fontSize:12,fontWeight:700,color:"#F1F5F9",marginBottom:10}}>Par catégorie</div>
            {td.sc.length===0?<div style={{color:"#475569",fontSize:11,textAlign:"center",padding:"12px 0"}}>Aucune dépense</div>:(
              <div style={{display:"flex",flexDirection:"column",gap:7}}>
                {td.sc.map(([cat,amt])=>{
                  const pct=td.te>0?Math.round((amt/td.te)*100):0;
                  return(
                    <div key={cat}>
                      <div style={{display:"flex",justifyContent:"space-between",marginBottom:2}}><span style={{fontSize:11,color:"#E2E8F0"}}>{cat}</span><span style={{fontSize:11,fontWeight:700,color:"#EF4444"}}>{amt.toLocaleString("fr-FR")} €</span></div>
                      <div style={{height:3,background:S2,borderRadius:2}}><div style={{height:3,width:pct+"%",background:"#EF4444",borderRadius:2}}/></div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
        <div style={{...card,marginBottom:10}}>
          <div style={{fontSize:12,fontWeight:700,color:"#F1F5F9",marginBottom:10}}>Performance par véhicule</div>
          <div style={{overflowX:"auto"}}>
            <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
              <thead><tr style={{borderBottom:"1px solid "+S2}}>{["Véhicule","Revenus","Dépenses","Bénéfice"].map(h=><th key={h} style={{padding:"5px 9px",textAlign:"left",fontSize:9,color:"#475569",fontWeight:600}}>{h.toUpperCase()}</th>)}</tr></thead>
              <tbody>{td.pv.map(v=>(
                <tr key={v.id} style={{borderBottom:"1px solid "+S2+"20"}}>
                  <td style={{padding:"7px 9px"}}><div style={{display:"flex",alignItems:"center",gap:6}}><div style={{width:6,height:6,borderRadius:"50%",background:v.color,flexShrink:0}}/><span style={{fontWeight:600,color:"#E2E8F0"}}>{v.name}</span></div></td>
                  <td style={{padding:"7px 9px",color:"#10B981",fontWeight:700}}>{v.income.toLocaleString("fr-FR")} €</td>
                  <td style={{padding:"7px 9px",color:"#EF4444",fontWeight:700}}>{v.expense.toLocaleString("fr-FR")} €</td>
                  <td style={{padding:"7px 9px",color:v.profit>=0?"#3B82F6":"#F59E0B",fontWeight:700}}>{v.profit>=0?"+":""}{v.profit.toLocaleString("fr-FR")} €</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </div>
        <div style={card}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10,flexWrap:"wrap",gap:7}}>
            <div style={{fontSize:12,fontWeight:700,color:"#F1F5F9"}}>Dépenses</div>
            <select value={evf} onChange={e=>setEvf(e.target.value)} style={{background:BG,border:"1px solid "+S3,color:"#E2E8F0",padding:"4px 9px",borderRadius:6,fontSize:11,cursor:"pointer"}}>
              <option value="all">Tous</option>
              {vehicles.map(v=><option key={v.id} value={v.id}>{v.name}</option>)}
            </select>
          </div>
          {td.fe.filter(e=>evf==="all"||e.vehicleId===Number(evf)).length===0
            ?<div style={{color:"#475569",fontSize:11,textAlign:"center",padding:"14px"}}>Aucune dépense</div>
            :(
              <div style={{display:"flex",flexDirection:"column",gap:6}}>
                {td.fe.filter(e=>evf==="all"||e.vehicleId===Number(evf)).sort((a,b)=>pd(b.date)-pd(a.date)).map(e=>{
                  const v=vehicles.find(v=>v.id===e.vehicleId);
                  return(
                    <div key={e.id} style={{display:"flex",alignItems:"center",gap:9,padding:"8px 10px",background:BG,borderRadius:8,cursor:"pointer"}} onClick={()=>openEditE(e)}>
                      <div style={{width:30,height:30,borderRadius:7,background:(v?.color||"#475569")+"20",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,flexShrink:0}}>
                        {e.category==="Carburant"?"⛽":e.category==="Entretien"?"🔧":e.category==="Assurance"?"🛡️":e.category==="Réparation"?"🔩":e.category==="Nettoyage"?"🧹":e.category==="Péage"?"🛣️":e.category==="Amende"?"📋":"💸"}
                      </div>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><span style={{fontWeight:600,color:"#E2E8F0",fontSize:12}}>{e.category}</span><span style={{fontWeight:700,color:"#EF4444",fontSize:12}}>-{e.amount.toLocaleString("fr-FR")} €</span></div>
                        <div style={{fontSize:10,color:"#475569",marginTop:1}}>{v?.name||"?"} · {fd(e.date)}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )
          }
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
              {bookings.length===0?<div style={{color:"#475569",fontSize:11,textAlign:"center",padding:"14px 0"}}>Aucune réservation</div>:(
                <div style={{display:"flex",flexDirection:"column",gap:6,maxHeight:mob?180:360,overflowY:"auto"}}>
                  {bookings.sort((a,b)=>pd(b.start)-pd(a.start)).map(b=>{
                    const v=vehicles.find(v=>v.id===b.vehicleId),isSel=cbid===b.id;
                    return(
                      <div key={b.id} onClick={()=>{setCbid(b.id);setCex({email:b.email||"",address:b.address||"",licenseNum:b.licenseNum||"",deposit:b.deposit||0});}} style={{background:isSel?"#3B82F620":BG,border:"1.5px solid "+(isSel?"#3B82F6":S2),borderRadius:8,padding:"8px 10px",cursor:"pointer"}}>
                        <div style={{fontSize:11,fontWeight:700,color:"#F1F5F9"}}>{b.client}</div>
                        <div style={{fontSize:9,color:"#64748B",marginTop:1}}>{v?.name||"?"} · {fd(b.start)} → {fd(b.end)}</div>
                        <div style={{fontSize:11,fontWeight:700,color:"#F59E0B",marginTop:1}}>{b.rate*gdb(b.start,b.end)} €</div>
                        {isSel&&<div style={{fontSize:9,color:"#3B82F6",fontWeight:600,marginTop:3}}>✓ Sélectionné</div>}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            {!scb?(
              <div style={{...card,textAlign:"center",padding:"48px 20px"}}><div style={{fontSize:38,marginBottom:10}}>📄</div><div style={{fontSize:13,fontWeight:700,color:"#F1F5F9",marginBottom:5}}>Sélectionnez une réservation</div></div>
            ):(
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
              </>
            )}
          </div>
        </div>
      </div>}

      {/* ── MODALS ── */}
      {modal&&!dc?.type?.startsWith("v")&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.82)",display:"flex",alignItems:mob?"flex-end":"center",justifyContent:"center",zIndex:250,padding:mob?0:16}} onClick={e=>e.target===e.currentTarget&&setModal(null)}>
          <div style={{background:S1,borderRadius:mob?"18px 18px 0 0":"18px",width:"100%",maxWidth:mob?"100%":490,border:"1px solid "+S2,boxShadow:"0 20px 60px rgba(0,0,0,.7)",maxHeight:mob?"92vh":"88vh",overflowY:"auto"}}>

            {/* DETAIL */}
            {modal.type==="detail"&&modal.booking&&(()=>{
              const v=vehicles.find(v=>v.id===modal.vehicleId),b=modal.booking;
              return(
                <>
                  <div style={{padding:"18px 22px",borderBottom:"1px solid "+S2,display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                    <div><div style={{fontSize:10,color:"#475569",fontWeight:600,marginBottom:2}}>RÉSERVATION</div><div style={{fontSize:17,fontWeight:700,color:"#F1F5F9"}}>{b.client}</div></div>
                    <button onClick={()=>setModal(null)} style={{background:S2,border:"none",color:"#64748B",width:28,height:28,borderRadius:6,cursor:"pointer",fontSize:15}}>×</button>
                  </div>
                  <div style={{padding:"14px 22px",display:"flex",flexDirection:"column",gap:11}}>
                    <Row icon="🚗" label="Véhicule" value={(v?.name||"?")+" · "+(v?.plate||"?")}/>
                    <Row icon="📞" label="Téléphone" value={b.phone||"—"}/>
                    <Row icon="📧" label="Email" value={b.email||"—"}/>
                    <Row icon="📅" label="Période" value={fd(b.start)+" → "+fd(b.end)}/>
                    <Row icon="⏱" label="Durée" value={gdb(b.start,b.end)+" jour(s)"}/>
                    <div style={{background:BG,borderRadius:9,padding:"12px",display:"flex",justifyContent:"space-between"}}>
                      <div><div style={{fontSize:10,color:"#475569"}}>Tarif/jour</div><div style={{fontSize:20,fontWeight:700,color:"#F59E0B"}}>{b.rate} €</div></div>
                      <div style={{textAlign:"right"}}><div style={{fontSize:10,color:"#475569"}}>Total</div><div style={{fontSize:20,fontWeight:700,color:"#10B981"}}>{b.rate*gdb(b.start,b.end)} €</div></div>
                    </div>
                    {b.notes&&<Row icon="💬" label="Notes" value={b.notes}/>}
                  </div>
                  <div style={{padding:"10px 22px 22px",display:"flex",gap:7,flexWrap:"wrap"}}>
                    <button onClick={()=>openEdit(b)} style={{flex:1,background:"#3B82F6",border:"none",color:"#fff",padding:"10px",borderRadius:8,cursor:"pointer",fontWeight:600,fontSize:12}}>✏️ Modifier</button>
                    <button onClick={()=>{setPage("contracts");setCbid(b.id);setCex({email:b.email||"",address:b.address||"",licenseNum:b.licenseNum||"",deposit:b.deposit||0});setModal(null);}} style={{flex:1,background:"#1a1a2e30",border:"1px solid #3B82F640",color:"#3B82F6",padding:"10px",borderRadius:8,cursor:"pointer",fontWeight:600,fontSize:12}}>📄 Contrat</button>
                    <button onClick={()=>setDc(b.id)} style={{flex:1,background:"#EF444420",border:"1px solid #EF444440",color:"#EF4444",padding:"10px",borderRadius:8,cursor:"pointer",fontWeight:600,fontSize:12}}>🗑</button>
                  </div>
                  {dc===b.id&&<div style={{padding:"0 22px 18px"}}><div style={{background:"#EF444415",border:"1px solid #EF444430",borderRadius:8,padding:"11px"}}><div style={{fontSize:11,color:"#EF4444",marginBottom:9,fontWeight:600}}>Confirmer la suppression ?</div><div style={{display:"flex",gap:6}}><button onClick={()=>delBk(b.id)} style={{flex:1,background:"#EF4444",border:"none",color:"#fff",padding:"7px",borderRadius:6,cursor:"pointer",fontWeight:600,fontSize:11}}>Oui</button><button onClick={()=>setDc(null)} style={{flex:1,background:S2,border:"none",color:"#94A3B8",padding:"7px",borderRadius:6,cursor:"pointer",fontSize:11}}>Non</button></div></div></div>}
                </>
              );
            })()}

            {/* ADD / EDIT BOOKING */}
            {(modal.type==="add"||modal.type==="edit"||modal.type==="add-g")&&(()=>{
              const isE=modal.type==="edit",isG=modal.type==="add-g";
              const v=vehicles.find(v=>v.id===(Number(form.vehicleId)||modal.vehicleId));
              return(
                <>
                  <div style={{padding:"18px 22px",borderBottom:"1px solid "+S2,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <div><div style={{fontSize:10,color:"#475569",fontWeight:600}}>{isE?"MODIFIER":"NOUVELLE RÉSERVATION"}</div><div style={{fontSize:15,fontWeight:700,color:"#F1F5F9",marginTop:2}}>{isE?v?.name:(isG?"Choisir un véhicule":v?.name)}</div></div>
                    <button onClick={()=>setModal(null)} style={{background:S2,border:"none",color:"#64748B",width:28,height:28,borderRadius:6,cursor:"pointer",fontSize:15}}>×</button>
                  </div>
                  <div style={{padding:"14px 22px",display:"flex",flexDirection:"column",gap:11}}>
                    {(isG||isE)&&(
                      <div>
                        <label style={{fontSize:10,color:"#475569",fontWeight:600,display:"block",marginBottom:4}}>VÉHICULE</label>
                        <select value={form.vehicleId||""} onChange={e=>setForm({...form,vehicleId:e.target.value})} style={{width:"100%",background:BG,border:"1px solid "+S3,color:form.vehicleId?"#E2E8F0":"#475569",padding:"8px 10px",borderRadius:6,fontSize:12}}>
                          <option value="">Sélectionner…</option>
                          {vehicles.map(v=>{const ok=avail(v.id,form.start||today,form.end||today,bookings,form.id);return <option key={v.id} value={v.id} disabled={!ok&&!isE}>{v.name} — {v.plate}{(!ok&&!isE)?" (non dispo)":""}</option>;})}
                        </select>
                      </div>
                    )}
                    <Fld label="Client" value={form.client} onChange={val=>setForm({...form,client:val})} placeholder="Nom du locataire"/>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:9}}><Fld label="Téléphone" value={form.phone} onChange={val=>setForm({...form,phone:val})} placeholder="06 00 00 00 00"/><Fld label="Email" value={form.email} onChange={val=>setForm({...form,email:val})} placeholder="client@email.fr"/></div>
                    <Fld label="Adresse" value={form.address} onChange={val=>setForm({...form,address:val})} placeholder="12 rue de la Paix..."/>
                    <Fld label="N° Permis" value={form.licenseNum} onChange={val=>setForm({...form,licenseNum:val})} placeholder="123456789012"/>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:9}}>
                      <div><label style={{fontSize:10,color:"#475569",fontWeight:600,display:"block",marginBottom:4}}>DÉBUT</label><input type="date" value={form.start||""} onChange={e=>setForm({...form,start:e.target.value})} style={{width:"100%",background:BG,border:"1px solid "+S3,color:"#E2E8F0",padding:"8px 10px",borderRadius:6,fontSize:12,boxSizing:"border-box"}}/></div>
                      <div><label style={{fontSize:10,color:"#475569",fontWeight:600,display:"block",marginBottom:4}}>FIN</label><input type="date" value={form.end||""} onChange={e=>setForm({...form,end:e.target.value})} style={{width:"100%",background:BG,border:"1px solid "+S3,color:"#E2E8F0",padding:"8px 10px",borderRadius:6,fontSize:12,boxSizing:"border-box"}}/></div>
                    </div>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:9}}><Fld label="Tarif/jour (€)" value={form.rate} onChange={val=>setForm({...form,rate:val})} placeholder="75" type="number"/><Fld label="Caution (€)" value={form.deposit} onChange={val=>setForm({...form,deposit:val})} placeholder="300" type="number"/></div>
                    {form.start&&form.end&&pd(form.end)>=pd(form.start)&&<div style={{background:"#10B98115",border:"1px solid #10B98130",borderRadius:7,padding:"7px 10px",fontSize:11}}><span style={{color:"#10B981",fontWeight:700}}>{gdb(form.start,form.end)} jour(s)</span>{form.rate&&<span style={{color:"#64748B"}}> · Total : <strong style={{color:"#F59E0B"}}>{Number(form.rate)*gdb(form.start,form.end)} €</strong></span>}</div>}
                    <Fld label="Notes" value={form.notes} onChange={val=>setForm({...form,notes:val})} placeholder="Informations…" textarea/>
                  </div>
                  <div style={{padding:"0 22px 22px",display:"flex",gap:7}}>
                    <button onClick={()=>setModal(null)} style={{flex:1,background:S2,border:"none",color:"#94A3B8",padding:"10px",borderRadius:8,cursor:"pointer",fontWeight:600,fontSize:12}}>Annuler</button>
                    <button onClick={saveBk} disabled={!form.client||!form.start||!form.end||!form.rate||(isG&&!form.vehicleId)} style={{flex:2,background:(!form.client||!form.start||!form.end||!form.rate||(isG&&!form.vehicleId))?S2:"linear-gradient(135deg,#1a1a2e,#3B82F6)",border:"none",color:(!form.client||!form.start||!form.end||!form.rate||(isG&&!form.vehicleId))?"#475569":"#fff",padding:"10px",borderRadius:8,cursor:"pointer",fontWeight:700,fontSize:12}}>{syncing?"…":isE?"💾 Enregistrer":"✓ Créer"}</button>
                  </div>
                </>
              );
            })()}

            {/* ADD / EDIT VEHICLE */}
            {(modal.type==="add-v"||modal.type==="edit-v")&&(()=>{
              const isE=modal.type==="edit-v",FU=["Essence","Diesel","Hybride","Électrique","GPL"];
              return(
                <>
                  <div style={{padding:"18px 22px",borderBottom:"1px solid "+S2,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <div><div style={{fontSize:10,color:"#475569",fontWeight:600}}>{isE?"MODIFIER":"NOUVEAU VÉHICULE"}</div><div style={{fontSize:15,fontWeight:700,color:"#F1F5F9",marginTop:2}}>{isE?form.name:"Ajouter"}</div></div>
                    <button onClick={()=>setModal(null)} style={{background:S2,border:"none",color:"#64748B",width:28,height:28,borderRadius:6,cursor:"pointer",fontSize:15}}>×</button>
                  </div>
                  <div style={{padding:"14px 22px",display:"flex",flexDirection:"column",gap:12}}>
                    <Fld label="Nom" value={form.name} onChange={val=>setForm({...form,name:val})} placeholder="ex: Peugeot 308"/>
                    <Fld label="Plaque" value={form.plate} onChange={val=>setForm({...form,plate:val})} placeholder="ex: AB-123-CD"/>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:9}}><Fld label="Année" value={form.year} onChange={val=>setForm({...form,year:val})} placeholder="2021" type="number"/><Fld label="Km" value={form.mileage} onChange={val=>setForm({...form,mileage:val})} placeholder="48500" type="number"/></div>
                    <div><label style={{fontSize:10,color:"#475569",fontWeight:600,display:"block",marginBottom:6}}>CARBURANT</label><div style={{display:"flex",flexWrap:"wrap",gap:5}}>{FU.map(f=><button key={f} onClick={()=>setForm({...form,fuel:f})} style={{background:form.fuel===f?"#10B981":S2,border:"1px solid "+(form.fuel===f?"#10B981":S3),color:form.fuel===f?"#fff":"#94A3B8",padding:"4px 10px",borderRadius:20,cursor:"pointer",fontSize:11,fontWeight:form.fuel===f?700:400}}>{f}</button>)}</div></div>
                    <div><label style={{fontSize:10,color:"#475569",fontWeight:600,display:"block",marginBottom:6}}>TYPE</label><div style={{display:"flex",flexWrap:"wrap",gap:5}}>{VT.map(t=><button key={t} onClick={()=>setForm({...form,type:t})} style={{background:form.type===t?"linear-gradient(135deg,#1a1a2e,#3B82F6)":S2,border:"1px solid "+(form.type===t?"#3B82F6":S3),color:form.type===t?"#fff":"#94A3B8",padding:"4px 10px",borderRadius:20,cursor:"pointer",fontSize:11,fontWeight:form.type===t?700:400}}>{VE[t]} {t}</button>)}</div></div>
                    <div><label style={{fontSize:10,color:"#475569",fontWeight:600,display:"block",marginBottom:6}}>COULEUR</label><div style={{display:"flex",gap:7,flexWrap:"wrap"}}>{VC.map(c=><button key={c} onClick={()=>setForm({...form,color:c})} style={{width:28,height:28,borderRadius:"50%",background:c,border:form.color===c?"3px solid #fff":"3px solid transparent",cursor:"pointer",outline:form.color===c?"2px solid "+c:"none"}}/>)}</div></div>
                    {isE&&<button onClick={()=>delV(form.id)} style={{background:"#EF444415",border:"1px solid #EF444430",color:"#EF4444",padding:"8px",borderRadius:8,cursor:"pointer",fontWeight:600,fontSize:12}}>🗑 Supprimer</button>}
                  </div>
                  <div style={{padding:"0 22px 22px",display:"flex",gap:7}}>
                    <button onClick={()=>setModal(null)} style={{flex:1,background:S2,border:"none",color:"#94A3B8",padding:"10px",borderRadius:8,cursor:"pointer",fontWeight:600,fontSize:12}}>Annuler</button>
                    <button onClick={saveV} disabled={!form.name||!form.plate||!form.type} style={{flex:2,background:(!form.name||!form.plate||!form.type)?S2:"linear-gradient(135deg,#1a1a2e,#3B82F6)",border:"none",color:(!form.name||!form.plate||!form.type)?"#475569":"#fff",padding:"10px",borderRadius:8,cursor:"pointer",fontWeight:700,fontSize:12}}>{syncing?"…":isE?"💾 Enregistrer":"+ Ajouter"}</button>
                  </div>
                </>
              );
            })()}

            {/* ADD / EDIT EXPENSE */}
            {(modal.type==="add-e"||modal.type==="edit-e")&&(()=>{
              const isE=modal.type==="edit-e";
              return(
                <>
                  <div style={{padding:"18px 22px",borderBottom:"1px solid "+S2,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <div><div style={{fontSize:10,color:"#475569",fontWeight:600}}>{isE?"MODIFIER":"NOUVELLE DÉPENSE"}</div><div style={{fontSize:15,fontWeight:700,color:"#F1F5F9",marginTop:2}}>{isE?form.category:"Ajouter"}</div></div>
                    <button onClick={()=>setModal(null)} style={{background:S2,border:"none",color:"#64748B",width:28,height:28,borderRadius:6,cursor:"pointer",fontSize:15}}>×</button>
                  </div>
                  <div style={{padding:"14px 22px",display:"flex",flexDirection:"column",gap:11}}>
                    <div><label style={{fontSize:10,color:"#475569",fontWeight:600,display:"block",marginBottom:4}}>VÉHICULE</label><select value={form.vehicleId||""} onChange={e=>setForm({...form,vehicleId:e.target.value})} style={{width:"100%",background:BG,border:"1px solid "+S3,color:form.vehicleId?"#E2E8F0":"#475569",padding:"8px 10px",borderRadius:6,fontSize:12}}><option value="">Sélectionner…</option>{vehicles.map(v=><option key={v.id} value={v.id}>{v.name} — {v.plate}</option>)}</select></div>
                    <div><label style={{fontSize:10,color:"#475569",fontWeight:600,display:"block",marginBottom:6}}>CATÉGORIE</label><div style={{display:"flex",flexWrap:"wrap",gap:5}}>{EC.map(c=><button key={c} onClick={()=>setForm({...form,category:c})} style={{background:form.category===c?"#EF4444":S2,border:"1px solid "+(form.category===c?"#EF4444":S3),color:form.category===c?"#fff":"#94A3B8",padding:"4px 10px",borderRadius:20,cursor:"pointer",fontSize:11,fontWeight:form.category===c?700:400}}>{c}</button>)}</div></div>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:9}}>
                      <div><label style={{fontSize:10,color:"#475569",fontWeight:600,display:"block",marginBottom:4}}>DATE</label><input type="date" value={form.date||""} onChange={e=>setForm({...form,date:e.target.value})} style={{width:"100%",background:BG,border:"1px solid "+S3,color:"#E2E8F0",padding:"8px 10px",borderRadius:6,fontSize:12,boxSizing:"border-box"}}/></div>
                      <Fld label="Montant (€)" value={form.amount} onChange={val=>setForm({...form,amount:val})} placeholder="85" type="number"/>
                    </div>
                    <Fld label="Note" value={form.note} onChange={val=>setForm({...form,note:val})} placeholder="Description…"/>
                    {isE&&<button onClick={()=>delE(form.id)} style={{background:"#EF444415",border:"1px solid #EF444430",color:"#EF4444",padding:"8px",borderRadius:8,cursor:"pointer",fontWeight:600,fontSize:12}}>🗑 Supprimer</button>}
                  </div>
                  <div style={{padding:"0 22px 22px",display:"flex",gap:7}}>
                    <button onClick={()=>setModal(null)} style={{flex:1,background:S2,border:"none",color:"#94A3B8",padding:"10px",borderRadius:8,cursor:"pointer",fontWeight:600,fontSize:12}}>Annuler</button>
                    <button onClick={saveE} disabled={!form.vehicleId||!form.date||!form.amount||!form.category} style={{flex:2,background:(!form.vehicleId||!form.date||!form.amount||!form.category)?S2:"#EF4444",border:"none",color:(!form.vehicleId||!form.date||!form.amount||!form.category)?"#475569":"#fff",padding:"10px",borderRadius:8,cursor:"pointer",fontWeight:700,fontSize:12}}>{syncing?"…":isE?"💾 Enregistrer":"+ Ajouter"}</button>
                  </div>
                </>
              );
            })()}

          </div>
        </div>
      )}

    </div>
  );
}
