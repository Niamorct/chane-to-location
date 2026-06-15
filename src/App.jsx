import { useState, useMemo, useEffect, useCallback } from "react";

// ─── SUPABASE CONFIG ───────────────────────────────────────────────────────
const SUPA_URL = "https://lmtgoehaeepigauxeeor.supabase.co";
const SUPA_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxtdGdvZWhhZWVwaWdhdXhlZW9yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE1MDg0NTksImV4cCI6MjA5NzA4NDQ1OX0.c4RvAe0leTvcMHUzYoAeZX8F1-VtAbePaqBV-F89kbc";
const HEADERS = { "Content-Type":"application/json", "apikey":SUPA_KEY, "Authorization":"Bearer "+SUPA_KEY, "Prefer":"return=representation" };

async function dbGet(table){ const r=await fetch(SUPA_URL+"/rest/v1/"+table+"?order=id",{headers:HEADERS}); return r.json(); }
async function dbInsert(table,obj){ const r=await fetch(SUPA_URL+"/rest/v1/"+table,{method:"POST",headers:HEADERS,body:JSON.stringify(obj)}); return r.json(); }
async function dbUpdate(table,id,obj){ const r=await fetch(SUPA_URL+"/rest/v1/"+table+"?id=eq."+id,{method:"PATCH",headers:HEADERS,body:JSON.stringify(obj)}); return r.json(); }
async function dbDelete(table,id){ await fetch(SUPA_URL+"/rest/v1/"+table+"?id=eq."+id,{method:"DELETE",headers:HEADERS}); }

// ─── LOGO ──────────────────────────────────────────────────────────────────
const LOGO_B64 = "data:image/png;base64,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";

// ─── CONSTANTS ─────────────────────────────────────────────────────────────
const VEHICLE_TYPES = ["Berline","Citadine","SUV","Utilitaire","Fourgon","Minibus","Cabriolet","Autre"];
const VEHICLE_COLORS = ["#3B82F6","#8B5CF6","#EC4899","#F59E0B","#10B981","#EF4444","#06B6D4","#F97316","#84CC16","#A855F7"];
const VEHICLE_EMOJIS = {Berline:"🚗",Citadine:"🚗",SUV:"🚙",Utilitaire:"🚐",Fourgon:"🚐",Minibus:"🚌",Cabriolet:"🚗",Autre:"🚗"};
const EXPENSE_CATEGORIES = ["Carburant","Entretien","Assurance","Réparation","Nettoyage","Péage","Amende","Autres"];
const MONTHS_FR = ["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"];
const COMPANY_DEFAULT = { name:"Chane-To Location", address:"", phone:"0693 01 00 94", email:"", siret:"", rcs:"" };

// ─── MAP DB ROW → APP OBJECT ────────────────────────────────────────────────
function mapVehicle(r){ return {id:r.id,name:r.name,plate:r.plate,type:r.type,color:r.color,year:r.year||"",mileage:r.mileage||"",fuel:r.fuel||"Essence"}; }
function mapBooking(r){ return {id:r.id,vehicleId:r.vehicle_id,client:r.client,phone:r.phone||"",email:r.email||"",address:r.address||"",licenseNum:r.license_num||"",start:r.start_date,end:r.end_date,rate:r.rate,deposit:r.deposit||0,notes:r.notes||""}; }
function mapExpense(r){ return {id:r.id,vehicleId:r.vehicle_id,date:r.date,amount:r.amount,category:r.category,note:r.note||""}; }

// ─── HELPERS ────────────────────────────────────────────────────────────────
function parseDate(str){const[y,m,d]=str.split("-").map(Number);return new Date(y,m-1,d);}
function formatDate(str){return parseDate(str).toLocaleDateString("fr-FR",{day:"2-digit",month:"2-digit",year:"numeric"});}
function formatDateLong(str){return parseDate(str).toLocaleDateString("fr-FR",{day:"2-digit",month:"long",year:"numeric"});}
function formatDateShort(str){return parseDate(str).toLocaleDateString("fr-FR",{day:"2-digit",month:"short"});}
function addDays(dateStr,n){const d=parseDate(dateStr);d.setDate(d.getDate()+n);return d.toISOString().slice(0,10);}
function dateInRange(date,start,end){const d=parseDate(date),s=parseDate(start),e=parseDate(end);return d>=s&&d<=e;}
function getDaysBetween(start,end){return Math.round((parseDate(end).getTime()-parseDate(start).getTime())/(1000*60*60*24))+1;}
function getYM(dateStr){const d=parseDate(dateStr);return{y:d.getFullYear(),m:d.getMonth()};}
function bookingRevenue(b){return b.rate*getDaysBetween(b.start,b.end);}
function isVehicleAvailableInRange(vehicleId,start,end,bookings,excludeId){
  return !bookings.some(b=>b.vehicleId===vehicleId&&b.id!==excludeId&&!(parseDate(b.end)<parseDate(start)||parseDate(b.start)>parseDate(end)));
}
function numToWords(n){
  const units=["","un","deux","trois","quatre","cinq","six","sept","huit","neuf","dix","onze","douze","treize","quatorze","quinze","seize","dix-sept","dix-huit","dix-neuf"];
  const tens=["","","vingt","trente","quarante","cinquante","soixante","soixante","quatre-vingt","quatre-vingt"];
  if(n===0)return"zéro";if(n<0)return"moins "+numToWords(-n);if(n<20)return units[n];
  if(n<100){const t=Math.floor(n/10),u=n%10;if(t===7||t===9){return tens[t]+(u===0?"":(t===7?"-":(u===1?" et "+units[u+10]:"-"+units[u+10])));}return tens[t]+(u===0?(t===8?"s":""):(u===1?" et un":"-"+units[u]));}
  if(n<1000){const h=Math.floor(n/100),r=n%100;return(h===1?"cent":units[h]+" cent")+(r===0?(h>1?"s":""):" "+numToWords(r));}
  if(n<1000000){const k=Math.floor(n/1000),r=n%1000;return(k===1?"mille":numToWords(k)+" mille")+(r===0?"":" "+numToWords(r));}
  return n.toString();
}

// ─── CONTRACT PDF ────────────────────────────────────────────────────────────
function generateContractHTML(booking,vehicle,company){
  const days=getDaysBetween(booking.start,booking.end),total=booking.rate*days,totalWords=numToWords(total);
  const contractNum="CTR-"+new Date().getFullYear()+"-"+String(booking.id).padStart(4,"0");
  const todayStr=new Date().toLocaleDateString("fr-FR",{day:"2-digit",month:"long",year:"numeric"});
  return "<!DOCTYPE html><html lang='fr'><head><meta charset='UTF-8'><title>Contrat "+contractNum+"</title><style>*{margin:0;padding:0;box-sizing:border-box;}body{font-family:Arial,sans-serif;font-size:10pt;color:#1a1a1a;}.page{width:210mm;min-height:297mm;padding:14mm 16mm;margin:0 auto;}.hdr{display:flex;justify-content:space-between;align-items:flex-start;border-bottom:3px solid #1a1a2e;padding-bottom:12px;margin-bottom:14px;}.co-name{font-size:18pt;font-weight:900;color:#1a1a2e;}.badge{background:#1a1a2e;color:white;padding:4px 14px;border-radius:4px;font-size:7pt;font-weight:700;letter-spacing:1px;text-align:center;margin-bottom:4px;}.cnum{font-size:9pt;font-weight:700;text-align:center;}.g2{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px;}.g3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;}.sec{border:1px solid #d1d5db;border-radius:6px;overflow:hidden;margin-bottom:12px;}.sec-h{background:#1a1a2e;color:white;padding:6px 12px;font-size:8pt;font-weight:700;}.sec-b{padding:10px 12px;}.fr{display:flex;justify-content:space-between;border-bottom:1px solid #f3f4f6;padding:4px 0;}.fr:last-child{border:none;}.fl{font-size:8pt;color:#6b7280;font-weight:600;min-width:130px;}.fv{font-size:9pt;color:#111827;font-weight:600;text-align:right;}.amt{background:linear-gradient(135deg,#1a1a2e,#3b82f6);color:white;border-radius:8px;padding:14px 18px;margin-bottom:12px;}.amt-g{display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;text-align:center;}.amt-l{font-size:7pt;opacity:.75;margin-bottom:2px;}.amt-v{font-size:14pt;font-weight:900;}.amt-tot{text-align:center;margin-top:8px;border-top:1px solid rgba(255,255,255,.3);padding-top:8px;}.sigs{display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-bottom:12px;}.sig{border:1px solid #d1d5db;border-radius:6px;padding:10px 12px;}.sig-t{font-size:8pt;font-weight:700;margin-bottom:6px;}.sig-l{border-bottom:1.5px solid #374151;height:45px;margin-bottom:6px;}.sig-m{font-size:7pt;color:#6b7280;}.cgv{border:1px solid #e5e7eb;border-radius:6px;padding:12px;}.cgv-t{font-size:9pt;font-weight:900;color:#1a1a2e;margin-bottom:8px;text-align:center;border-bottom:2px solid #1a1a2e;padding-bottom:6px;}.art{margin-bottom:6px;}.art-t{font-size:8pt;font-weight:700;color:#1a1a2e;margin-bottom:2px;}.art-b{font-size:7pt;color:#374151;line-height:1.5;}.ft{font-size:7pt;color:#9ca3af;text-align:center;border-top:1px solid #e5e7eb;padding-top:8px;margin-top:12px;}@media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact;}}</style></head><body><div class='page'>"
  +"<div class='hdr'><div><div class='co-name'>"+company.name+"</div><div style='font-size:8pt;color:#64748b;'>Location de véhicules</div><div style='margin-top:6px;font-size:7.5pt;color:#374151;line-height:1.6;'>"+company.address+"<br>Tél : "+company.phone+(company.email?" · "+company.email:"")+"<br>"+(company.siret?"SIRET : "+company.siret:"")+(company.rcs?" · RCS : "+company.rcs:"")+"</div></div>"
  +"<div><div class='badge'>CONTRAT DE LOCATION</div><div class='cnum'>"+contractNum+"</div><div style='font-size:7.5pt;color:#6b7280;text-align:center;margin-top:4px;'>Établi le "+todayStr+"</div></div></div>"
  +"<div class='g2'><div class='sec'><div class='sec-h'>🏢 LE LOUEUR</div><div class='sec-b'><div class='fr'><span class='fl'>Société</span><span class='fv'>"+company.name+"</span></div><div class='fr'><span class='fl'>Adresse</span><span class='fv'>"+company.address+"</span></div><div class='fr'><span class='fl'>Téléphone</span><span class='fv'>"+company.phone+"</span></div><div class='fr'><span class='fl'>Email</span><span class='fv'>"+(company.email||"—")+"</span></div><div class='fr'><span class='fl'>SIRET</span><span class='fv'>"+(company.siret||"—")+"</span></div></div></div>"
  +"<div class='sec'><div class='sec-h'>👤 LE LOCATAIRE</div><div class='sec-b'><div class='fr'><span class='fl'>Nom complet</span><span class='fv'>"+booking.client+"</span></div><div class='fr'><span class='fl'>Adresse</span><span class='fv'>"+(booking.address||"—")+"</span></div><div class='fr'><span class='fl'>Téléphone</span><span class='fv'>"+(booking.phone||"—")+"</span></div><div class='fr'><span class='fl'>Email</span><span class='fv'>"+(booking.email||"—")+"</span></div><div class='fr'><span class='fl'>N° Permis</span><span class='fv'>"+(booking.licenseNum||"—")+"</span></div></div></div></div>"
  +"<div class='sec'><div class='sec-h'>🚗 VÉHICULE LOUÉ</div><div class='sec-b'><div class='g3'><div class='fr'><span class='fl'>Désignation</span><span class='fv'>"+vehicle.name+"</span></div><div class='fr'><span class='fl'>Immatriculation</span><span class='fv'>"+vehicle.plate+"</span></div><div class='fr'><span class='fl'>Type</span><span class='fv'>"+vehicle.type+"</span></div><div class='fr'><span class='fl'>Année</span><span class='fv'>"+(vehicle.year||"—")+"</span></div><div class='fr'><span class='fl'>Carburant</span><span class='fv'>"+(vehicle.fuel||"—")+"</span></div><div class='fr'><span class='fl'>Kilométrage départ</span><span class='fv'>"+(vehicle.mileage||"—")+" km</span></div></div></div></div>"
  +"<div class='sec'><div class='sec-h'>📅 PÉRIODE</div><div class='sec-b'><div class='g3'><div class='fr'><span class='fl'>Départ</span><span class='fv'>"+formatDateLong(booking.start)+"</span></div><div class='fr'><span class='fl'>Retour</span><span class='fv'>"+formatDateLong(booking.end)+"</span></div><div class='fr'><span class='fl'>Durée</span><span class='fv'>"+days+" jour"+(days>1?"s":"")+"</span></div></div></div></div>"
  +"<div class='amt'><div style='font-size:8pt;opacity:.8;font-weight:600;margin-bottom:6px;'>💰 RÉCAPITULATIF FINANCIER</div><div class='amt-g'><div><div class='amt-l'>TARIF/JOUR</div><div class='amt-v'>"+booking.rate+" €</div></div><div><div class='amt-l'>DURÉE</div><div class='amt-v'>"+days+"j</div></div><div><div class='amt-l'>CAUTION</div><div class='amt-v'>"+(booking.deposit||0)+" €</div></div></div><div class='amt-tot'><div style='font-size:8pt;opacity:.8;'>MONTANT TOTAL</div><div style='font-size:18pt;font-weight:900;'>"+total.toLocaleString("fr-FR")+" €</div><div style='font-size:8pt;opacity:.85;font-style:italic;margin-top:3px;'>Soit : "+totalWords+" euros</div></div></div>"
  +(booking.notes?"<div style='background:#fef3c7;border:1px solid #f59e0b;border-radius:6px;padding:8px 12px;margin-bottom:12px;font-size:7.5pt;color:#92400e;text-align:center;font-weight:600;'>📋 OBSERVATIONS : "+booking.notes+"</div>":"")
  +"<div class='sigs'><div class='sig'><div class='sig-t'>SIGNATURE DU LOUEUR</div><div class='sig-l'></div><div class='sig-m'>Lu et approuvé — "+company.name+"</div><div class='sig-m'>Cachet et signature</div></div><div class='sig'><div class='sig-t'>SIGNATURE DU LOCATAIRE</div><div class='sig-l'></div><div class='sig-m'>Lu et approuvé — "+booking.client+"</div><div class='sig-m'>Faire précéder la signature de la mention manuscrite « Lu et approuvé »</div></div></div>"
  +"<div class='cgv'><div class='cgv-t'>CONDITIONS GÉNÉRALES DE LOCATION DE VÉHICULE</div>"
  +"<div class='art'><div class='art-t'>Art. 1 — Objet du contrat</div><div class='art-b'>Le présent contrat a pour objet la mise à disposition du véhicule décrit ci-dessus par le loueur au locataire, pour la durée et aux conditions stipulées. La signature vaut acceptation sans réserve des présentes conditions.</div></div>"
  +"<div class='art'><div class='art-t'>Art. 2 — Conditions d'éligibilité</div><div class='art-b'>Le locataire doit être titulaire d'un permis de conduire valable depuis au moins 2 ans et être âgé d'au moins 21 ans. Tout document falsifié entraîne résiliation immédiate et poursuites judiciaires.</div></div>"
  +"<div class='art'><div class='art-t'>Art. 3 — Prise en charge et restitution</div><div class='art-b'>Un état des lieux est réalisé à la prise en charge et à la restitution. Le locataire restitue le véhicule propre avec le même niveau de carburant. Tout retard non signalé 24h à l'avance sera facturé au tarif journalier majoré de 20%.</div></div>"
  +"<div class='art'><div class='art-t'>Art. 4 — Caution et paiement</div><div class='art-b'>La caution est exigée à la prise en charge et restituée à la remise, déduction faite de tout frais (dommages, carburant, nettoyage…). Le règlement est intégral à la signature.</div></div>"
  +"<div class='art'><div class='art-t'>Art. 5 — Responsabilité et assurances</div><div class='art-b'>Le locataire est responsable de tout dommage survenu au véhicule pendant la location et des sinistres causés à des tiers. Une franchise reste à sa charge. Toute utilisation à l'étranger nécessite une autorisation écrite préalable.</div></div>"
  +"<div class='art'><div class='art-t'>Art. 6 — Utilisation du véhicule</div><div class='art-b'>Il est interdit de sous-louer ou prêter le véhicule, de l'utiliser en compétition, de transporter des matières dangereuses, de dépasser la charge utile, ou de fumer à bord. Tout manquement entraîne résiliation immédiate sans remboursement.</div></div>"
  +"<div class='art'><div class='art-t'>Art. 7 — Panne et accidents</div><div class='art-b'>En cas de panne ou accident, le locataire contacte immédiatement le loueur. Un constat amiable est établi en cas d'accident avec tiers et transmis dans les 24h. Les réparations nécessitent l'accord préalable du loueur.</div></div>"
  +"<div class='art'><div class='art-t'>Art. 8 — Résiliation et litiges</div><div class='art-b'>Le contrat peut être résilié en cas de manquement grave du locataire. En cas de litige, les parties recherchent un règlement amiable. À défaut, le Tribunal compétent est celui du siège du loueur. Le droit français est applicable.</div></div></div>"
  +"<div class='ft'>"+company.name+" — "+company.phone+" | Contrat "+contractNum+" établi le "+todayStr+"</div>"
  +"</div></body></html>";
}

// ─── COMPONENTS ──────────────────────────────────────────────────────────────
function BarChart({data,height=120}){
  if(!data||!data.length)return null;
  const max=Math.max(...data.map(d=>Math.max(d.income,d.expense)),1),w=100/data.length;
  return(<svg viewBox={"0 0 100 "+height} style={{width:"100%",height,display:"block"}}>
    {data.map((d,i)=>{const ih=(d.income/max)*(height-20),eh=(d.expense/max)*(height-20),x=i*w;return(<g key={i}><rect x={x+w*.1} y={height-20-ih} width={w*.35} height={ih} fill="#10B981" opacity=".85" rx="1"/><rect x={x+w*.55} y={height-20-eh} width={w*.35} height={eh} fill="#EF4444" opacity=".85" rx="1"/><text x={x+w/2} y={height-4} textAnchor="middle" fontSize="4.5" fill="#475569">{d.label}</text></g>);})}
  </svg>);
}
function Row({icon,label,value}){return(<div style={{display:"flex",gap:12,alignItems:"flex-start"}}><span style={{fontSize:16,width:24,flexShrink:0,marginTop:1}}>{icon}</span><div><div style={{fontSize:11,color:"#475569",fontWeight:600}}>{label.toUpperCase()}</div><div style={{fontSize:14,color:"#E2E8F0",marginTop:2}}>{value}</div></div></div>);}
function Field({label,value,onChange,placeholder,type="text",textarea,disabled}){
  const s={width:"100%",background:"#0F1117",border:"1px solid #2D3748",color:"#E2E8F0",padding:"10px 12px",borderRadius:8,fontSize:14,outline:"none",resize:"vertical",fontFamily:"inherit",opacity:disabled?.6:1};
  return(<div><label style={{fontSize:12,color:"#475569",fontWeight:600,display:"block",marginBottom:6}}>{label.toUpperCase()}</label>{textarea?<textarea value={value||""} onChange={e=>onChange(e.target.value)} placeholder={placeholder} rows={3} style={s} disabled={disabled}/>:<input type={type} value={value||""} onChange={e=>onChange(e.target.value)} placeholder={placeholder} style={s} disabled={disabled}/>}</div>);
}
function CField({label,value,onChange,placeholder,disabled}){
  return(<div><label style={{fontSize:11,color:"#475569",fontWeight:600,display:"block",marginBottom:4}}>{label.toUpperCase()}</label><input value={value||""} onChange={e=>onChange(e.target.value)} placeholder={placeholder} disabled={disabled} style={{width:"100%",background:"#0F1117",border:"1px solid #1E2535",color:"#E2E8F0",padding:"8px 10px",borderRadius:6,fontSize:13,outline:"none",opacity:disabled?.6:1}}/></div>);
}
function Spinner(){return(<div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:12,padding:40,color:"#475569",fontSize:14}}><div style={{width:24,height:24,border:"3px solid #1E2535",borderTopColor:"#3B82F6",borderRadius:"50%",animation:"spin 0.8s linear infinite"}}/> Chargement…</div>);}

// ─── MAIN APP ────────────────────────────────────────────────────────────────
export default function App(){
  const today=new Date().toISOString().slice(0,10);
  const thisYear=new Date().getFullYear(),thisMonth=new Date().getMonth();

  const[vehicles,setVehicles]=useState([]);
  const[bookings,setBookings]=useState([]);
  const[expenses,setExpenses]=useState([]);
  const[loading,setLoading]=useState(true);
  const[syncing,setSyncing]=useState(false);

  const[selectedDate,setSelectedDate]=useState(today);
  const[modal,setModal]=useState(null);
  const[form,setForm]=useState({});
  const[viewMode,setViewMode]=useState("day");
  const[page,setPage]=useState("calendar");
  const[deleteConfirm,setDeleteConfirm]=useState(null);
  const[toast,setToast]=useState(null);
  const[treasuryYear,setTreasuryYear]=useState(thisYear);
  const[treasuryMonth,setTreasuryMonth]=useState(thisMonth);
  const[treasuryFilter,setTreasuryFilter]=useState("month");
  const[expenseVehicleFilter,setExpenseVehicleFilter]=useState("all");
  const[periodStart,setPeriodStart]=useState(today);
  const[periodEnd,setPeriodEnd]=useState(addDays(today,1));
  const[showPeriodFilter,setShowPeriodFilter]=useState(false);
  const[contractBookingId,setContractBookingId]=useState(null);
  const[contractCompany,setContractCompany]=useState({...COMPANY_DEFAULT});
  const[contractExtra,setContractExtra]=useState({email:"",address:"",licenseNum:"",deposit:0});

  // ── LOAD ALL DATA FROM SUPABASE ──
  const loadAll=useCallback(async()=>{
    setLoading(true);
    try{
      const[vRaw,bRaw,eRaw]=await Promise.all([dbGet("vehicles"),dbGet("bookings"),dbGet("expenses")]);
      setVehicles((vRaw||[]).map(mapVehicle));
      setBookings((bRaw||[]).map(mapBooking));
      setExpenses((eRaw||[]).map(mapExpense));
    }catch(err){showToast("Erreur de connexion à la base de données","error");}
    setLoading(false);
  },[]);

  useEffect(()=>{loadAll();},[loadAll]);

  function showToast(msg,type="success"){setToast({msg,type});setTimeout(()=>setToast(null),3500);}
  function getBookingForVehicleOnDate(vehicleId,date){return bookings.find(b=>b.vehicleId===vehicleId&&dateInRange(date,b.start,b.end));}

  // ── BOOKINGS CRUD ──
  function openDetail(vehicleId,date){
    const booking=getBookingForVehicleOnDate(vehicleId,date);
    if(booking){setModal({type:"detail",vehicleId,booking,date});}
    else{setForm({vehicleId,start:showPeriodFilter?periodStart:date,end:showPeriodFilter?periodEnd:date,client:"",phone:"",email:"",address:"",licenseNum:"",rate:"",deposit:"",notes:""});setModal({type:"add",vehicleId,date});}
  }
  function openEdit(booking){setForm({...booking});setModal({type:"edit",booking});}
  async function saveBooking(){
    if(!form.client||!form.start||!form.end||!form.rate)return;
    if(parseDate(form.end)<parseDate(form.start))return;
    setSyncing(true);
    const payload={vehicle_id:Number(form.vehicleId),client:form.client,phone:form.phone||"",email:form.email||"",address:form.address||"",license_num:form.licenseNum||"",start_date:form.start,end_date:form.end,rate:Number(form.rate),deposit:Number(form.deposit)||0,notes:form.notes||""};
    try{
      if(modal.type==="add"||modal.type==="add-global"){
        const[row]=await dbInsert("bookings",payload);
        setBookings(prev=>[...prev,mapBooking(row)]);
        showToast("Réservation ajoutée ✓");
      }else{
        await dbUpdate("bookings",form.id,payload);
        setBookings(prev=>prev.map(b=>b.id===form.id?{...mapBooking({...payload,id:form.id})}:b));
        showToast("Réservation modifiée ✓");
      }
    }catch(e){showToast("Erreur lors de la sauvegarde","error");}
    setSyncing(false);setModal(null);
  }
  async function deleteBooking(id){
    setSyncing(true);
    await dbDelete("bookings",id);
    setBookings(prev=>prev.filter(b=>b.id!==id));
    setModal(null);setDeleteConfirm(null);showToast("Réservation supprimée","info");setSyncing(false);
  }

  // ── VEHICLES CRUD ──
  function openAddVehicle(){setForm({name:"",plate:"",type:"Berline",color:VEHICLE_COLORS[Math.floor(Math.random()*VEHICLE_COLORS.length)],year:"",mileage:"",fuel:"Essence"});setModal({type:"add-vehicle"});}
  function openEditVehicle(v){setForm({...v});setModal({type:"edit-vehicle",vehicle:v});}
  async function saveVehicle(){
    if(!form.name||!form.plate||!form.type)return;
    setSyncing(true);
    const payload={name:form.name,plate:form.plate,type:form.type,color:form.color,year:form.year||"",mileage:form.mileage||"",fuel:form.fuel||"Essence"};
    try{
      if(modal.type==="add-vehicle"){const[row]=await dbInsert("vehicles",payload);setVehicles(prev=>[...prev,mapVehicle(row)]);showToast("Véhicule ajouté ✓");}
      else{await dbUpdate("vehicles",form.id,payload);setVehicles(prev=>prev.map(v=>v.id===form.id?{...mapVehicle({...payload,id:form.id})}:v));showToast("Véhicule modifié ✓");}
    }catch(e){showToast("Erreur lors de la sauvegarde","error");}
    setSyncing(false);setModal(null);
  }
  async function deleteVehicle(id){
    const hasB=bookings.some(b=>b.vehicleId===id);
    setDeleteConfirm(hasB?{type:"vehicle-with-bookings",id}:{type:"vehicle",id});
  }
  async function confirmDeleteVehicle(id,withBookings){
    setSyncing(true);
    if(withBookings){for(const b of bookings.filter(b=>b.vehicleId===id))await dbDelete("bookings",b.id);}
    for(const e of expenses.filter(e=>e.vehicleId===id))await dbDelete("expenses",e.id);
    await dbDelete("vehicles",id);
    setVehicles(prev=>prev.filter(v=>v.id!==id));
    if(withBookings)setBookings(prev=>prev.filter(b=>b.vehicleId!==id));
    setExpenses(prev=>prev.filter(e=>e.vehicleId!==id));
    setDeleteConfirm(null);setModal(null);showToast("Véhicule supprimé","info");setSyncing(false);
  }

  // ── EXPENSES CRUD ──
  function openAddExpense(){setForm({vehicleId:"",date:today,amount:"",category:"Carburant",note:""});setModal({type:"add-expense"});}
  function openEditExpense(e){setForm({...e});setModal({type:"edit-expense"});}
  async function saveExpense(){
    if(!form.vehicleId||!form.date||!form.amount||!form.category)return;
    setSyncing(true);
    const payload={vehicle_id:Number(form.vehicleId),date:form.date,amount:Number(form.amount),category:form.category,note:form.note||""};
    try{
      if(modal.type==="add-expense"){const[row]=await dbInsert("expenses",payload);setExpenses(prev=>[...prev,mapExpense(row)]);showToast("Dépense ajoutée ✓");}
      else{await dbUpdate("expenses",form.id,payload);setExpenses(prev=>prev.map(e=>e.id===form.id?{...mapExpense({...payload,id:form.id})}:e));showToast("Dépense modifiée ✓");}
    }catch(e){showToast("Erreur lors de la sauvegarde","error");}
    setSyncing(false);setModal(null);
  }
  async function deleteExpense(id){
    setSyncing(true);await dbDelete("expenses",id);
    setExpenses(prev=>prev.filter(e=>e.id!==id));setModal(null);showToast("Dépense supprimée","info");setSyncing(false);
  }

  function openNewReservation(){
    setForm({vehicleId:vehicles[0]?.id||"",start:showPeriodFilter?periodStart:today,end:showPeriodFilter?periodEnd:addDays(today,1),client:"",phone:"",email:"",address:"",licenseNum:"",rate:"",deposit:"",notes:""});
    setModal({type:"add-global"});
  }

  function exportContractPDF(booking,vehicle){
    const merged={...booking,...contractExtra};
    const html=generateContractHTML(merged,vehicle,contractCompany);
    const w=window.open("","_blank","width=950,height=1100");
    if(!w)return;w.document.write(html);w.document.close();setTimeout(()=>w.print(),600);
  }

  // ── COMPUTED ──
  const availableInPeriod=useMemo(()=>{
    if(!showPeriodFilter||!periodStart||!periodEnd)return vehicles;
    return vehicles.filter(v=>isVehicleAvailableInRange(v.id,periodStart,periodEnd,bookings,undefined));
  },[vehicles,bookings,showPeriodFilter,periodStart,periodEnd]);
  const displayVehicles=showPeriodFilter?availableInPeriod:vehicles;

  const treasuryData=useMemo(()=>{
    let fb=bookings,fe=expenses;
    if(treasuryFilter==="month"){fb=bookings.filter(b=>{const{y,m}=getYM(b.start);return y===treasuryYear&&m===treasuryMonth;});fe=expenses.filter(e=>{const{y,m}=getYM(e.date);return y===treasuryYear&&m===treasuryMonth;});}
    else if(treasuryFilter==="year"){fb=bookings.filter(b=>getYM(b.start).y===treasuryYear);fe=expenses.filter(e=>getYM(e.date).y===treasuryYear);}
    const totalIncome=fb.reduce((s,b)=>s+bookingRevenue(b),0),totalExpense=fe.reduce((s,e)=>s+e.amount,0),profit=totalIncome-totalExpense;
    const perVehicle=vehicles.map(v=>{const vi=fb.filter(b=>b.vehicleId===v.id).reduce((s,b)=>s+bookingRevenue(b),0),ve=fe.filter(e=>e.vehicleId===v.id).reduce((s,e)=>s+e.amount,0);return{...v,income:vi,expense:ve,profit:vi-ve};}).sort((a,b)=>b.income-a.income);
    const monthChart=Array.from({length:6},(_,i)=>{const d=new Date(thisYear,thisMonth-5+i,1),y=d.getFullYear(),m=d.getMonth();const inc=bookings.filter(b=>{const bym=getYM(b.start);return bym.y===y&&bym.m===m;}).reduce((s,b)=>s+bookingRevenue(b),0),exp=expenses.filter(e=>{const eym=getYM(e.date);return eym.y===y&&eym.m===m;}).reduce((s,e)=>s+e.amount,0);return{label:MONTHS_FR[m].slice(0,3),income:inc,expense:exp,profit:inc-exp};});
    const byCategory={};fe.forEach(e=>{byCategory[e.category]=(byCategory[e.category]||0)+e.amount;});
    return{totalIncome,totalExpense,profit,perVehicle,monthChart,sortedCategories:Object.entries(byCategory).sort((a,b)=>b[1]-a[1]),filteredBookings:fb,filteredExpenses:fe};
  },[bookings,expenses,vehicles,treasuryFilter,treasuryYear,treasuryMonth,thisYear,thisMonth]);

  const weekDates=Array.from({length:7},(_,i)=>addDays(selectedDate,i-(new Date(selectedDate).getDay()===0?6:new Date(selectedDate).getDay()-1)));
  const availableToday=vehicles.filter(v=>!getBookingForVehicleOnDate(v.id,selectedDate));
  const bookedToday=vehicles.filter(v=>getBookingForVehicleOnDate(v.id,selectedDate));
  const selectedContractBooking=bookings.find(b=>b.id===contractBookingId);
  const selectedContractVehicle=selectedContractBooking?vehicles.find(v=>v.id===selectedContractBooking.vehicleId):null;

  const statsItems=showPeriodFilter
    ?[{label:"Disponibles sur la période",value:availableInPeriod.length,color:"#10B981",bg:"rgba(16,185,129,0.1)"},{label:"Non disponibles",value:vehicles.length-availableInPeriod.length,color:"#F59E0B",bg:"rgba(245,158,11,0.1)"},{label:"Total véhicules",value:vehicles.length,color:"#3B82F6",bg:"rgba(59,130,246,0.1)"}]
    :[{label:"Disponibles",value:availableToday.length,color:"#10B981",bg:"rgba(16,185,129,0.1)"},{label:"Loués",value:bookedToday.length,color:"#F59E0B",bg:"rgba(245,158,11,0.1)"},{label:"Revenus du jour",value:bookedToday.reduce((acc,v)=>{const b=getBookingForVehicleOnDate(v.id,selectedDate);return acc+(b?b.rate:0);},0)+" €",color:"#3B82F6",bg:"rgba(59,130,246,0.1)"}];

  const S={page:{maxWidth:1200,margin:"0 auto",padding:"24px 32px"},card:{background:"#161B27",border:"1px solid #1E2535",borderRadius:16,padding:"20px"},btn:{background:"#1E2535",border:"none",color:"#94A3B8",padding:"8px 16px",borderRadius:8,cursor:"pointer",fontSize:13,fontWeight:600},btnPrimary:{background:"linear-gradient(135deg,#1a1a2e,#3B82F6)",border:"none",color:"#fff",padding:"10px 20px",borderRadius:10,cursor:"pointer",fontWeight:700,fontSize:14}};

  if(loading)return(
    <div style={{minHeight:"100vh",background:"#0F1117",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:20}}>
      <img src={LOGO_B64} alt="Logo" style={{width:100,height:100,objectFit:"contain",filter:"brightness(10)"}}/>
      <div style={{color:"#F1F5F9",fontSize:20,fontWeight:700}}>Chane-To Location</div>
      <div style={{display:"flex",alignItems:"center",gap:10,color:"#475569",fontSize:14}}>
        <div style={{width:20,height:20,border:"2px solid #1E2535",borderTopColor:"#3B82F6",borderRadius:"50%",animation:"spin 0.8s linear infinite"}}/>
        Connexion à la base de données…
      </div>
    </div>
  );

  return(
    <div style={{minHeight:"100vh",background:"#0F1117",color:"#E2E8F0",fontFamily:"'Inter',system-ui,sans-serif"}}>
      <style>{"@keyframes spin{to{transform:rotate(360deg)}}input[type='date']::-webkit-calendar-picker-indicator{filter:invert(0.5);cursor:pointer;}*{box-sizing:border-box;}"}</style>

      {/* TOAST */}
      {toast&&<div style={{position:"fixed",top:20,right:20,zIndex:2000,background:toast.type==="success"?"#10B981":toast.type==="error"?"#EF4444":"#64748B",color:"#fff",padding:"12px 20px",borderRadius:10,fontWeight:600,fontSize:14,boxShadow:"0 4px 20px rgba(0,0,0,0.4)",display:"flex",alignItems:"center",gap:8}}>
        {toast.type==="success"?"✓":toast.type==="error"?"✕":"ℹ"} {toast.msg}
      </div>}

      {/* SYNCING INDICATOR */}
      {syncing&&<div style={{position:"fixed",top:20,left:"50%",transform:"translateX(-50%)",zIndex:2000,background:"#1E2535",border:"1px solid #2D3748",color:"#94A3B8",padding:"8px 18px",borderRadius:20,fontSize:13,display:"flex",alignItems:"center",gap:8}}>
        <div style={{width:14,height:14,border:"2px solid #2D3748",borderTopColor:"#3B82F6",borderRadius:"50%",animation:"spin 0.8s linear infinite"}}/>Synchronisation…
      </div>}

      {/* HEADER */}
      <header style={{background:"#161B27",borderBottom:"1px solid #1E2535",padding:"0 32px"}}>
        <div style={{maxWidth:1200,margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"space-between",height:68,gap:16,flexWrap:"wrap"}}>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <img src={LOGO_B64} alt="Logo Chane-To" style={{width:48,height:48,objectFit:"contain",filter:"brightness(10) drop-shadow(0 0 8px rgba(59,130,246,0.4))"}}/>
            <div>
              <div style={{fontWeight:800,fontSize:17,letterSpacing:"-0.02em",color:"#F1F5F9"}}>Chane-To Location</div>
              <div style={{fontSize:11,color:"#64748B",marginTop:-1}}>Gestion de flotte · 0693 01 00 94</div>
            </div>
          </div>
          <div style={{display:"flex",gap:4,background:"#1E2535",borderRadius:10,padding:4}}>
            {[{id:"calendar",icon:"📅",label:"Calendrier"},{id:"fleet",icon:"🚗",label:"Ma flotte"},{id:"treasury",icon:"💰",label:"Trésorerie"},{id:"contracts",icon:"📄",label:"Contrats"}].map(tab=>(
              <button key={tab.id} onClick={()=>setPage(tab.id)} style={{background:page===tab.id?"linear-gradient(135deg,#1a1a2e,#3B82F6)":"transparent",border:"none",color:page===tab.id?"#fff":"#64748B",padding:"6px 14px",borderRadius:7,cursor:"pointer",fontSize:13,fontWeight:600,transition:"all 0.15s"}}>
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>
          <div style={{display:"flex",gap:8,alignItems:"center"}}>
            <button onClick={loadAll} title="Rafraîchir" style={{background:"#1E2535",border:"none",color:"#64748B",width:34,height:34,borderRadius:8,cursor:"pointer",fontSize:16,display:"flex",alignItems:"center",justifyContent:"center"}}>⟳</button>
            <div style={{background:"#1E2535",borderRadius:20,padding:"4px 12px",fontSize:13,color:"#94A3B8"}}>{vehicles.length} véhicules · {bookedToday.length} loués</div>
          </div>
        </div>
      </header>

      {/* ── TRÉSORERIE ── */}
      {page==="treasury"&&(
        <div style={S.page}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:24,flexWrap:"wrap",gap:16}}>
            <div><div style={{fontSize:22,fontWeight:700,color:"#F1F5F9"}}>Trésorerie</div><div style={{fontSize:13,color:"#475569",marginTop:2}}>Suivi des revenus et dépenses</div></div>
            <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
              <div style={{display:"flex",gap:4,background:"#161B27",border:"1px solid #1E2535",borderRadius:10,padding:4}}>
                {[{v:"month",l:"Ce mois"},{v:"year",l:"Cette année"},{v:"all",l:"Tout"}].map(f=>(
                  <button key={f.v} onClick={()=>setTreasuryFilter(f.v)} style={{background:treasuryFilter===f.v?"linear-gradient(135deg,#1a1a2e,#3B82F6)":"transparent",border:"none",color:treasuryFilter===f.v?"#fff":"#64748B",padding:"5px 12px",borderRadius:7,cursor:"pointer",fontSize:12,fontWeight:600}}>{f.l}</button>
                ))}
              </div>
              {treasuryFilter==="month"&&(<div style={{display:"flex",gap:6,alignItems:"center"}}>
                <button onClick={()=>{let m=treasuryMonth-1,y=treasuryYear;if(m<0){m=11;y--;}setTreasuryMonth(m);setTreasuryYear(y);}} style={{...S.btn,padding:"6px 10px"}}>‹</button>
                <span style={{fontSize:13,fontWeight:600,color:"#E2E8F0",minWidth:110,textAlign:"center"}}>{MONTHS_FR[treasuryMonth]} {treasuryYear}</span>
                <button onClick={()=>{let m=treasuryMonth+1,y=treasuryYear;if(m>11){m=0;y++;}setTreasuryMonth(m);setTreasuryYear(y);}} style={{...S.btn,padding:"6px 10px"}}>›</button>
              </div>)}
              {treasuryFilter==="year"&&(<div style={{display:"flex",gap:6,alignItems:"center"}}>
                <button onClick={()=>setTreasuryYear(y=>y-1)} style={{...S.btn,padding:"6px 10px"}}>‹</button>
                <span style={{fontSize:13,fontWeight:600,color:"#E2E8F0",minWidth:50,textAlign:"center"}}>{treasuryYear}</span>
                <button onClick={()=>setTreasuryYear(y=>y+1)} style={{...S.btn,padding:"6px 10px"}}>›</button>
              </div>)}
              <button onClick={openAddExpense} style={S.btnPrimary}>+ Dépense</button>
            </div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:16,marginBottom:24}}>
            {[{label:"Revenus locatifs",value:treasuryData.totalIncome,color:"#10B981",bg:"rgba(16,185,129,0.08)",icon:"📈"},{label:"Dépenses",value:treasuryData.totalExpense,color:"#EF4444",bg:"rgba(239,68,68,0.08)",icon:"📉"},{label:"Bénéfice net",value:treasuryData.profit,color:treasuryData.profit>=0?"#3B82F6":"#F59E0B",bg:treasuryData.profit>=0?"rgba(59,130,246,0.08)":"rgba(245,158,11,0.08)",icon:"💰"},{label:"Taux de marge",value:treasuryData.totalIncome>0?Math.round((treasuryData.profit/treasuryData.totalIncome)*100)+"%":"—",color:"#8B5CF6",bg:"rgba(139,92,246,0.08)",icon:"📊"}].map(k=>(
              <div key={k.label} style={{...S.card,background:k.bg,border:"1px solid "+k.color+"25"}}>
                <div style={{fontSize:20,marginBottom:8}}>{k.icon}</div>
                <div style={{fontSize:11,color:"#64748B",fontWeight:600,marginBottom:4}}>{k.label.toUpperCase()}</div>
                <div style={{fontSize:28,fontWeight:800,color:k.color,letterSpacing:"-0.03em"}}>{typeof k.value==="number"?(k.value<0?"-":"")+Math.abs(k.value).toLocaleString("fr-FR")+" €":k.value}</div>
              </div>
            ))}
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:16}}>
            <div style={S.card}>
              <div style={{fontSize:14,fontWeight:700,color:"#F1F5F9",marginBottom:12}}>Évolution sur 6 mois</div>
              <div style={{display:"flex",gap:16,marginBottom:12}}>
                <span style={{fontSize:12,color:"#10B981",display:"flex",alignItems:"center",gap:5}}><span style={{width:10,height:10,background:"#10B981",borderRadius:2,display:"inline-block"}}/>Revenus</span>
                <span style={{fontSize:12,color:"#EF4444",display:"flex",alignItems:"center",gap:5}}><span style={{width:10,height:10,background:"#EF4444",borderRadius:2,display:"inline-block"}}/>Dépenses</span>
              </div>
              <BarChart data={treasuryData.monthChart}/>
            </div>
            <div style={S.card}>
              <div style={{fontSize:14,fontWeight:700,color:"#F1F5F9",marginBottom:16}}>Dépenses par catégorie</div>
              {treasuryData.sortedCategories.length===0?<div style={{color:"#475569",fontSize:13,textAlign:"center",marginTop:24}}>Aucune dépense</div>:
              <div style={{display:"flex",flexDirection:"column",gap:10}}>{treasuryData.sortedCategories.map(([cat,amt])=>{const pct=treasuryData.totalExpense>0?Math.round((amt/treasuryData.totalExpense)*100):0;return(<div key={cat}><div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}><span style={{fontSize:13,color:"#E2E8F0"}}>{cat}</span><span style={{fontSize:13,fontWeight:700,color:"#EF4444"}}>{amt.toLocaleString("fr-FR")} € <span style={{color:"#475569",fontWeight:400,fontSize:11}}>({pct}%)</span></span></div><div style={{height:5,background:"#1E2535",borderRadius:3}}><div style={{height:5,width:pct+"%",background:"#EF4444",borderRadius:3,opacity:.8}}/></div></div>);})}</div>}
            </div>
          </div>
          <div style={{...S.card,marginBottom:16}}>
            <div style={{fontSize:14,fontWeight:700,color:"#F1F5F9",marginBottom:16}}>Performance par véhicule</div>
            <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
              <thead><tr style={{borderBottom:"1px solid #1E2535"}}>{["Véhicule","Revenus","Dépenses","Bénéfice","Rentabilité"].map(h=><th key={h} style={{padding:"8px 12px",textAlign:"left",fontSize:11,color:"#475569",fontWeight:600}}>{h.toUpperCase()}</th>)}</tr></thead>
              <tbody>{treasuryData.perVehicle.map(v=>(<tr key={v.id} style={{borderBottom:"1px solid #1E253520"}}><td style={{padding:"10px 12px"}}><div style={{display:"flex",alignItems:"center",gap:10}}><div style={{width:8,height:8,borderRadius:"50%",background:v.color,flexShrink:0}}/><div><div style={{fontWeight:600,color:"#E2E8F0"}}>{v.name}</div><div style={{fontSize:11,color:"#475569"}}>{v.plate}</div></div></div></td><td style={{padding:"10px 12px",color:"#10B981",fontWeight:700}}>{v.income.toLocaleString("fr-FR")} €</td><td style={{padding:"10px 12px",color:"#EF4444",fontWeight:700}}>{v.expense.toLocaleString("fr-FR")} €</td><td style={{padding:"10px 12px",color:v.profit>=0?"#3B82F6":"#F59E0B",fontWeight:700}}>{v.profit>=0?"+":""}{v.profit.toLocaleString("fr-FR")} €</td><td style={{padding:"10px 12px"}}>{v.income>0?(<div style={{display:"flex",alignItems:"center",gap:8}}><div style={{flex:1,height:6,background:"#1E2535",borderRadius:3,minWidth:60}}><div style={{height:6,width:Math.max(0,Math.min(100,Math.round((v.profit/v.income)*100)))+"%",background:v.profit>=0?"#10B981":"#EF4444",borderRadius:3}}/></div><span style={{fontSize:12,color:v.profit>=0?"#10B981":"#EF4444",fontWeight:700}}>{Math.round((v.profit/v.income)*100)}%</span></div>):<span style={{color:"#475569"}}>—</span>}</td></tr>))}</tbody>
            </table>
          </div>
          <div style={S.card}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16,flexWrap:"wrap",gap:10}}>
              <div style={{fontSize:14,fontWeight:700,color:"#F1F5F9"}}>Détail des dépenses</div>
              <select value={expenseVehicleFilter} onChange={e=>setExpenseVehicleFilter(e.target.value)} style={{background:"#0F1117",border:"1px solid #2D3748",color:"#E2E8F0",padding:"6px 12px",borderRadius:8,fontSize:13,cursor:"pointer"}}>
                <option value="all">Tous les véhicules</option>
                {vehicles.map(v=><option key={v.id} value={v.id}>{v.name}</option>)}
              </select>
            </div>
            {treasuryData.filteredExpenses.filter(e=>expenseVehicleFilter==="all"||e.vehicleId===Number(expenseVehicleFilter)).length===0?<div style={{color:"#475569",fontSize:13,textAlign:"center",padding:"24px 0"}}>Aucune dépense sur cette période</div>:
            <div style={{display:"flex",flexDirection:"column",gap:8}}>{treasuryData.filteredExpenses.filter(e=>expenseVehicleFilter==="all"||e.vehicleId===Number(expenseVehicleFilter)).sort((a,b)=>parseDate(b.date)-parseDate(a.date)).map(e=>{const v=vehicles.find(v=>v.id===e.vehicleId);return(<div key={e.id} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 12px",background:"#0F1117",borderRadius:10,cursor:"pointer"}} onClick={()=>openEditExpense(e)}><div style={{width:36,height:36,borderRadius:10,background:(v?.color||"#475569")+"20",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0}}>{e.category==="Carburant"?"⛽":e.category==="Entretien"?"🔧":e.category==="Assurance"?"🛡️":e.category==="Réparation"?"🔩":e.category==="Nettoyage"?"🧹":e.category==="Péage"?"🛣️":e.category==="Amende"?"📋":"💸"}</div><div style={{flex:1,minWidth:0}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><span style={{fontWeight:600,color:"#E2E8F0",fontSize:14}}>{e.category}</span><span style={{fontWeight:700,color:"#EF4444",fontSize:15}}>-{e.amount.toLocaleString("fr-FR")} €</span></div><div style={{fontSize:12,color:"#475569",marginTop:2,display:"flex",gap:12}}><span style={{display:"flex",alignItems:"center",gap:4}}><span style={{width:6,height:6,borderRadius:"50%",background:v?.color||"#475569",display:"inline-block"}}/>{v?.name||"?"}</span><span>📅 {formatDate(e.date)}</span>{e.note&&<span>💬 {e.note}</span>}</div></div></div>);})}</div>}
          </div>
        </div>
      )}

      {/* ── FLOTTE ── */}
      {page==="fleet"&&(
        <div style={S.page}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}}>
            <div><div style={{fontSize:22,fontWeight:700,color:"#F1F5F9"}}>Ma flotte</div><div style={{fontSize:13,color:"#475569",marginTop:2}}>{vehicles.length} véhicule{vehicles.length>1?"s":""} enregistré{vehicles.length>1?"s":""}</div></div>
            <button onClick={openAddVehicle} style={S.btnPrimary}>+ Ajouter un véhicule</button>
          </div>
          {vehicles.length===0&&<div style={{...S.card,textAlign:"center",padding:"48px",color:"#475569"}}>Aucun véhicule. Ajoutez votre premier véhicule pour commencer.</div>}
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:16}}>
            {vehicles.map(v=>{const vBookings=bookings.filter(b=>b.vehicleId===v.id),activeBooking=getBookingForVehicleOnDate(v.id,today);return(<div key={v.id} style={{background:"#161B27",border:"1.5px solid "+v.color+"40",borderRadius:16,overflow:"hidden"}}><div style={{height:4,background:v.color}}/><div style={{padding:"18px 20px"}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14}}><div style={{display:"flex",gap:12,alignItems:"center"}}><div style={{width:44,height:44,borderRadius:12,background:v.color+"25",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22}}>{VEHICLE_EMOJIS[v.type]||"🚗"}</div><div><div style={{fontWeight:700,fontSize:15,color:"#F1F5F9"}}>{v.name}</div><div style={{fontSize:12,color:"#475569",marginTop:2}}>{v.plate}</div></div></div><div style={{display:"flex",gap:6}}><button onClick={()=>openEditVehicle(v)} style={{background:"#1E2535",border:"none",color:"#94A3B8",width:32,height:32,borderRadius:8,cursor:"pointer",fontSize:14}}>✏️</button><button onClick={()=>deleteVehicle(v.id)} style={{background:"#EF444415",border:"1px solid #EF444430",color:"#EF4444",width:32,height:32,borderRadius:8,cursor:"pointer",fontSize:14}}>🗑</button></div></div><div style={{display:"flex",gap:8,marginBottom:12}}><span style={{background:v.color+"20",color:v.color,padding:"3px 10px",borderRadius:20,fontSize:12,fontWeight:600}}>{v.type}</span><span style={{background:activeBooking?"#F59E0B20":"#10B98120",color:activeBooking?"#F59E0B":"#10B981",padding:"3px 10px",borderRadius:20,fontSize:12,fontWeight:600}}>● {activeBooking?"Loué":"Disponible"}</span></div>{activeBooking&&(<div style={{background:"#0F1117",borderRadius:10,padding:"10px 12px",marginBottom:10}}><div style={{fontSize:12,color:"#64748B",marginBottom:4}}>En cours</div><div style={{fontSize:13,fontWeight:700,color:"#F1F5F9"}}>{activeBooking.client}</div><div style={{fontSize:12,color:"#64748B",marginTop:2}}>jusqu'au {formatDateShort(activeBooking.end)} · {activeBooking.rate} €/j</div></div>)}<div style={{fontSize:12,color:"#475569",borderTop:"1px solid #1E2535",paddingTop:10,marginTop:4}}>{vBookings.length} réservation{vBookings.length>1?"s":""} total</div></div></div>);})}
            <div onClick={openAddVehicle} style={{background:"#161B27",border:"1.5px dashed #2D3748",borderRadius:16,padding:"32px 20px",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:12,minHeight:180}}><div style={{width:48,height:48,borderRadius:14,background:"#1E2535",display:"flex",alignItems:"center",justifyContent:"center",fontSize:24}}>+</div><div style={{fontSize:14,color:"#475569",fontWeight:600}}>Ajouter un véhicule</div></div>
          </div>
          {deleteConfirm?.type?.startsWith("vehicle")&&(<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.7)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:100,padding:20}}><div style={{background:"#161B27",borderRadius:20,width:"100%",maxWidth:400,border:"1px solid #1E2535",padding:"28px"}}><div style={{fontSize:18,fontWeight:700,color:"#EF4444",marginBottom:12}}>🗑 Supprimer le véhicule ?</div>{deleteConfirm.type==="vehicle-with-bookings"&&<div style={{background:"#EF444415",border:"1px solid #EF444430",borderRadius:10,padding:"12px",marginBottom:16,fontSize:13,color:"#EF4444"}}>⚠️ Ce véhicule a des réservations associées qui seront aussi supprimées.</div>}<div style={{fontSize:14,color:"#94A3B8",marginBottom:20}}>Cette action est irréversible.</div><div style={{display:"flex",gap:10}}><button onClick={()=>setDeleteConfirm(null)} style={{flex:1,background:"#1E2535",border:"none",color:"#94A3B8",padding:"12px",borderRadius:10,cursor:"pointer",fontWeight:600}}>Annuler</button><button onClick={()=>confirmDeleteVehicle(deleteConfirm.id,deleteConfirm.type==="vehicle-with-bookings")} style={{flex:1,background:"#EF4444",border:"none",color:"#fff",padding:"12px",borderRadius:10,cursor:"pointer",fontWeight:700}}>Supprimer</button></div></div></div>)}
        </div>
      )}

      {/* ── CALENDRIER ── */}
      {page==="calendar"&&(
        <div style={S.page}>
          <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:16,flexWrap:"wrap"}}>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <button onClick={()=>setSelectedDate(addDays(selectedDate,-1))} style={{background:"#1E2535",border:"none",color:"#94A3B8",width:36,height:36,borderRadius:8,cursor:"pointer",fontSize:18,display:"flex",alignItems:"center",justifyContent:"center"}}>‹</button>
              <input type="date" value={selectedDate} onChange={e=>setSelectedDate(e.target.value)} style={{background:"#1E2535",border:"1px solid #2D3748",color:"#E2E8F0",padding:"8px 14px",borderRadius:10,fontSize:15,fontWeight:600,cursor:"pointer"}}/>
              <button onClick={()=>setSelectedDate(addDays(selectedDate,1))} style={{background:"#1E2535",border:"none",color:"#94A3B8",width:36,height:36,borderRadius:8,cursor:"pointer",fontSize:18,display:"flex",alignItems:"center",justifyContent:"center"}}>›</button>
            </div>
            <button onClick={()=>setSelectedDate(today)} style={{background:selectedDate===today?"linear-gradient(135deg,#1a1a2e,#3B82F6)":"#1E2535",border:"none",color:selectedDate===today?"#fff":"#94A3B8",padding:"8px 16px",borderRadius:8,cursor:"pointer",fontSize:13,fontWeight:600}}>Aujourd'hui</button>
            <button onClick={openNewReservation} style={{background:"linear-gradient(135deg,#10B981,#3B82F6)",border:"none",color:"#fff",padding:"8px 18px",borderRadius:8,cursor:"pointer",fontSize:13,fontWeight:700,display:"flex",alignItems:"center",gap:6}}>＋ Nouvelle réservation</button>
            <div style={{marginLeft:"auto",display:"flex",gap:4,background:"#1E2535",borderRadius:10,padding:4}}>
              {["day","week"].map(m=><button key={m} onClick={()=>setViewMode(m)} style={{background:viewMode===m?"linear-gradient(135deg,#1a1a2e,#3B82F6)":"transparent",border:"none",color:viewMode===m?"#fff":"#64748B",padding:"6px 16px",borderRadius:7,cursor:"pointer",fontSize:13,fontWeight:600}}>{m==="day"?"Jour":"Semaine"}</button>)}
            </div>
          </div>
          <div style={{background:"#161B27",border:"1.5px solid "+(showPeriodFilter?"#3B82F6":"#1E2535"),borderRadius:12,padding:"12px 16px",marginBottom:16}}>
            <div style={{display:"flex",alignItems:"center",gap:12,flexWrap:"wrap"}}>
              <button onClick={()=>setShowPeriodFilter(p=>!p)} style={{background:showPeriodFilter?"linear-gradient(135deg,#1a1a2e,#3B82F6)":"#1E2535",border:"none",color:"#fff",padding:"6px 14px",borderRadius:8,cursor:"pointer",fontSize:13,fontWeight:600}}>🔍 Filtre disponibilité</button>
              {showPeriodFilter&&<span style={{fontSize:12,color:"#3B82F6",fontWeight:600}}>{availableInPeriod.length}/{vehicles.length} disponible{availableInPeriod.length>1?"s":""}</span>}
              {showPeriodFilter&&(<><div style={{display:"flex",alignItems:"center",gap:6}}><span style={{fontSize:12,color:"#64748B",fontWeight:600}}>Du</span><input type="date" value={periodStart} onChange={e=>setPeriodStart(e.target.value)} style={{background:"#0F1117",border:"1px solid #2D3748",color:"#E2E8F0",padding:"6px 10px",borderRadius:8,fontSize:13}}/></div><div style={{display:"flex",alignItems:"center",gap:6}}><span style={{fontSize:12,color:"#64748B",fontWeight:600}}>Au</span><input type="date" value={periodEnd} onChange={e=>setPeriodEnd(e.target.value)} style={{background:"#0F1117",border:"1px solid #2D3748",color:"#E2E8F0",padding:"6px 10px",borderRadius:8,fontSize:13}}/></div>{periodStart&&periodEnd&&parseDate(periodEnd)>=parseDate(periodStart)&&<span style={{background:"#3B82F620",border:"1px solid #3B82F640",borderRadius:20,padding:"3px 10px",fontSize:12,color:"#3B82F6",fontWeight:600}}>{getDaysBetween(periodStart,periodEnd)}j</span>}<button onClick={()=>setShowPeriodFilter(false)} style={{background:"#1E2535",border:"none",color:"#64748B",padding:"6px 12px",borderRadius:8,cursor:"pointer",fontSize:12}}>✕</button></>)}
            </div>
            {showPeriodFilter&&availableInPeriod.length===0&&<div style={{marginTop:10,background:"#F59E0B15",border:"1px solid #F59E0B30",borderRadius:8,padding:"8px 12px",fontSize:13,color:"#F59E0B"}}>⚠️ Aucun véhicule disponible sur cette période.</div>}
          </div>
          <div style={{display:"flex",gap:12,marginBottom:24,flexWrap:"wrap"}}>
            {statsItems.map(s=><div key={s.label} style={{background:s.bg,border:"1px solid "+s.color+"30",borderRadius:12,padding:"12px 20px",display:"flex",gap:12,alignItems:"center"}}><div style={{fontSize:24,fontWeight:700,color:s.color}}>{s.value}</div><div style={{fontSize:13,color:"#64748B"}}>{s.label}</div></div>)}
          </div>
          {viewMode==="day"&&(
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:16}}>
              {vehicles.length===0&&<div style={{gridColumn:"1/-1",...S.card,textAlign:"center",padding:"48px",color:"#475569"}}>Aucun véhicule dans la flotte. Ajoutez des véhicules dans l'onglet "Ma flotte".</div>}
              {showPeriodFilter&&availableInPeriod.length===0&&vehicles.length>0?(<div style={{gridColumn:"1/-1",background:"#161B27",borderRadius:16,padding:"48px",textAlign:"center"}}><div style={{fontSize:40,marginBottom:12}}>🔍</div><div style={{fontSize:16,fontWeight:700,color:"#F1F5F9",marginBottom:8}}>Aucun véhicule disponible</div><div style={{fontSize:13,color:"#475569"}}>Tous les véhicules sont réservés du {formatDate(periodStart)} au {formatDate(periodEnd)}</div></div>)
              :displayVehicles.map(vehicle=>{const booking=getBookingForVehicleOnDate(vehicle.id,selectedDate),isBooked=showPeriodFilter?false:!!booking;return(<div key={vehicle.id} onClick={()=>openDetail(vehicle.id,selectedDate)} style={{background:isBooked?"linear-gradient(135deg,"+vehicle.color+"18,"+vehicle.color+"08)":"#161B27",border:"1.5px solid "+(isBooked?vehicle.color+"60":"#1E2535"),borderRadius:16,padding:"20px",cursor:"pointer",transition:"all 0.15s",position:"relative",overflow:"hidden"}}><div style={{position:"absolute",top:16,right:16,width:10,height:10,borderRadius:"50%",background:isBooked?"#F59E0B":"#10B981",boxShadow:"0 0 8px "+(isBooked?"#F59E0B":"#10B981")}}/><div style={{display:"flex",gap:12,alignItems:"flex-start",marginBottom:14}}><div style={{width:42,height:42,borderRadius:12,background:vehicle.color+"30",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>{VEHICLE_EMOJIS[vehicle.type]||"🚗"}</div><div><div style={{fontWeight:700,fontSize:15,color:"#F1F5F9"}}>{vehicle.name}</div><div style={{fontSize:12,color:"#475569",marginTop:2}}>{vehicle.plate} · {vehicle.type}</div></div></div>{isBooked?(<div style={{background:"#0F1117",borderRadius:10,padding:"12px 14px"}}><div style={{fontSize:13,fontWeight:700,color:"#F1F5F9",marginBottom:6}}>👤 {booking.client}</div>{booking.phone&&<div style={{fontSize:12,color:"#64748B",marginBottom:4}}>📞 {booking.phone}</div>}<div style={{fontSize:12,color:"#64748B",marginBottom:8}}>📅 {formatDateShort(booking.start)} → {formatDateShort(booking.end)}</div><div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><span style={{color:"#F59E0B",fontWeight:700,fontSize:16}}>{booking.rate} €<span style={{fontSize:11,fontWeight:400,color:"#64748B"}}>/jour</span></span><span style={{fontSize:11,color:"#475569",background:"#1E2535",padding:"3px 8px",borderRadius:20}}>{getDaysBetween(booking.start,booking.end)}j · {booking.rate*getDaysBetween(booking.start,booking.end)} €</span></div>{booking.notes&&<div style={{fontSize:11,color:"#475569",marginTop:8,fontStyle:"italic"}}>💬 {booking.notes}</div>}</div>):(<div style={{display:"flex",alignItems:"center",gap:8}}><div style={{color:"#10B981",fontSize:13,fontWeight:600}}>✓ Disponible{showPeriodFilter?" sur la période":""}</div><div style={{fontSize:12,color:"#334155",marginLeft:"auto"}}>+ Réserver</div></div>)}</div>);})}
            </div>
          )}
          {viewMode==="week"&&(<div style={{overflowX:"auto"}}><div style={{minWidth:900}}>
            <div style={{display:"grid",gridTemplateColumns:"200px repeat(7,1fr)",gap:1,marginBottom:1}}>
              <div style={{padding:"10px 16px",background:"#161B27",borderRadius:"8px 0 0 0",fontSize:12,color:"#475569",fontWeight:600}}>VÉHICULE</div>
              {weekDates.map(date=>{const d=parseDate(date),isToday=date===today,isSel=date===selectedDate;return(<div key={date} onClick={()=>{setSelectedDate(date);setViewMode("day");}} style={{padding:"10px 12px",background:isSel?"#3B82F620":"#161B27",textAlign:"center",cursor:"pointer",borderBottom:isSel?"2px solid #3B82F6":"2px solid transparent"}}><div style={{fontSize:11,color:"#475569",fontWeight:600}}>{d.toLocaleDateString("fr-FR",{weekday:"short"}).toUpperCase()}</div><div style={{fontSize:16,fontWeight:700,color:isToday?"#3B82F6":"#E2E8F0",marginTop:2}}>{d.getDate()}</div>{isToday&&<div style={{width:4,height:4,borderRadius:"50%",background:"#3B82F6",margin:"4px auto 0"}}/>}</div>);})}
            </div>
            {displayVehicles.map(vehicle=>(<div key={vehicle.id} style={{display:"grid",gridTemplateColumns:"200px repeat(7,1fr)",gap:1,marginBottom:1}}>
              <div style={{background:"#161B27",padding:"10px 16px",display:"flex",alignItems:"center",gap:10}}><div style={{width:8,height:8,borderRadius:"50%",background:vehicle.color,flexShrink:0}}/><div><div style={{fontSize:13,fontWeight:600,color:"#E2E8F0",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",maxWidth:130}}>{vehicle.name}</div><div style={{fontSize:11,color:"#475569"}}>{vehicle.plate}</div></div></div>
              {weekDates.map(date=>{const booking=getBookingForVehicleOnDate(vehicle.id,date),isSel=date===selectedDate;return(<div key={date} onClick={()=>openDetail(vehicle.id,date)} style={{background:booking?vehicle.color+"25":"#161B27",border:"1px solid "+(isSel?"#3B82F650":"transparent"),padding:"8px 10px",cursor:"pointer",minHeight:60,position:"relative"}}>{booking?(<><div style={{fontSize:11,fontWeight:700,color:vehicle.color,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{booking.client}</div><div style={{fontSize:10,color:"#64748B",marginTop:2}}>{booking.rate} €/j</div><div style={{position:"absolute",bottom:0,left:0,right:0,height:3,background:vehicle.color,opacity:.6}}/></>):<div style={{color:"#1E2535",fontSize:18,textAlign:"center",marginTop:8}}>+</div>}</div>);})}
            </div>))}
          </div></div>)}
        </div>
      )}

      {/* ── CONTRATS ── */}
      {page==="contracts"&&(
        <div style={S.page}>
          <div style={{marginBottom:24}}><div style={{fontSize:22,fontWeight:700,color:"#F1F5F9"}}>📄 Contrats de location</div><div style={{fontSize:13,color:"#475569",marginTop:2}}>Créez et exportez vos contrats en PDF</div></div>
          <div style={{display:"grid",gridTemplateColumns:"320px 1fr",gap:20,alignItems:"start"}}>
            <div style={{display:"flex",flexDirection:"column",gap:14}}>
              <div style={S.card}>
                <div style={{fontSize:13,fontWeight:700,color:"#F1F5F9",marginBottom:14}}>🏢 Informations société</div>
                <div style={{display:"flex",flexDirection:"column",gap:9}}>
                  <CField label="Nom" value={contractCompany.name} onChange={v=>setContractCompany({...contractCompany,name:v})} placeholder="Chane-To Location"/>
                  <CField label="Adresse" value={contractCompany.address} onChange={v=>setContractCompany({...contractCompany,address:v})} placeholder="Votre adresse..."/>
                  <CField label="Téléphone" value={contractCompany.phone} onChange={v=>setContractCompany({...contractCompany,phone:v})} placeholder="0693 01 00 94"/>
                  <CField label="Email" value={contractCompany.email} onChange={v=>setContractCompany({...contractCompany,email:v})} placeholder="contact@..."/>
                  <CField label="SIRET" value={contractCompany.siret} onChange={v=>setContractCompany({...contractCompany,siret:v})} placeholder="123 456 789 00012"/>
                  <CField label="RCS" value={contractCompany.rcs} onChange={v=>setContractCompany({...contractCompany,rcs:v})} placeholder="Saint-Denis B 123..."/>
                </div>
              </div>
              <div style={S.card}>
                <div style={{fontSize:13,fontWeight:700,color:"#F1F5F9",marginBottom:14}}>📋 Sélectionner une réservation</div>
                {bookings.length===0?<div style={{color:"#475569",fontSize:13,textAlign:"center",padding:"20px 0"}}>Aucune réservation</div>:
                <div style={{display:"flex",flexDirection:"column",gap:8,maxHeight:400,overflowY:"auto"}}>
                  {bookings.sort((a,b)=>parseDate(b.start)-parseDate(a.start)).map(b=>{const v=vehicles.find(v=>v.id===b.vehicleId),isSel=contractBookingId===b.id;return(<div key={b.id} onClick={()=>{setContractBookingId(b.id);setContractExtra({email:b.email||"",address:b.address||"",licenseNum:b.licenseNum||"",deposit:b.deposit||0});}} style={{background:isSel?"#3B82F620":"#0F1117",border:"1.5px solid "+(isSel?"#3B82F6":"#1E2535"),borderRadius:10,padding:"10px 12px",cursor:"pointer"}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}><div><div style={{fontSize:13,fontWeight:700,color:"#F1F5F9"}}>{b.client}</div><div style={{fontSize:11,color:"#64748B",marginTop:2,display:"flex",alignItems:"center",gap:4}}><span style={{width:6,height:6,borderRadius:"50%",background:v?.color||"#475569",display:"inline-block"}}/>{v?.name||"?"} · {v?.plate||"?"}</div><div style={{fontSize:11,color:"#475569",marginTop:2}}>📅 {formatDate(b.start)} → {formatDate(b.end)}</div></div><div style={{textAlign:"right"}}><div style={{fontSize:13,fontWeight:700,color:"#F59E0B"}}>{b.rate*getDaysBetween(b.start,b.end)} €</div><div style={{fontSize:10,color:"#475569"}}>{getDaysBetween(b.start,b.end)}j</div></div></div>{isSel&&<div style={{marginTop:6,fontSize:11,color:"#3B82F6",fontWeight:600}}>✓ Sélectionné</div>}</div>);})}
                </div>}
              </div>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:14}}>
              {!selectedContractBooking?(<div style={{...S.card,textAlign:"center",padding:"60px 32px"}}><div style={{fontSize:48,marginBottom:16}}>📄</div><div style={{fontSize:16,fontWeight:700,color:"#F1F5F9",marginBottom:8}}>Sélectionnez une réservation</div><div style={{fontSize:13,color:"#475569"}}>Choisissez une réservation dans la liste pour créer le contrat correspondant.</div></div>):(<>
                <div style={S.card}>
                  <div style={{fontSize:13,fontWeight:700,color:"#F1F5F9",marginBottom:14}}>👤 Informations locataire</div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                    <CField label="Nom complet" value={selectedContractBooking.client} onChange={()=>{}} disabled/>
                    <CField label="Téléphone" value={selectedContractBooking.phone} onChange={()=>{}} disabled/>
                    <CField label="Email" value={contractExtra.email} onChange={v=>setContractExtra({...contractExtra,email:v})} placeholder="email@client.fr"/>
                    <CField label="N° Permis" value={contractExtra.licenseNum} onChange={v=>setContractExtra({...contractExtra,licenseNum:v})} placeholder="123456789012"/>
                    <div style={{gridColumn:"1/-1"}}><CField label="Adresse complète" value={contractExtra.address} onChange={v=>setContractExtra({...contractExtra,address:v})} placeholder="12 rue..."/></div>
                  </div>
                </div>
                <div style={{...S.card,background:"linear-gradient(135deg,#1a1a2e15,#3b82f60a)",border:"1.5px solid #3B82F630"}}>
                  <div style={{fontSize:13,fontWeight:700,color:"#F1F5F9",marginBottom:14}}>📋 Récapitulatif</div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                    <div style={{background:"#0F1117",borderRadius:10,padding:"12px"}}><div style={{fontSize:11,color:"#64748B",marginBottom:4}}>VÉHICULE</div><div style={{fontSize:14,fontWeight:700,color:"#F1F5F9"}}>{selectedContractVehicle?.name}</div><div style={{fontSize:12,color:"#475569"}}>{selectedContractVehicle?.plate} · {selectedContractVehicle?.type}</div></div>
                    <div style={{background:"#0F1117",borderRadius:10,padding:"12px"}}><div style={{fontSize:11,color:"#64748B",marginBottom:4}}>LOCATAIRE</div><div style={{fontSize:14,fontWeight:700,color:"#F1F5F9"}}>{selectedContractBooking.client}</div><div style={{fontSize:12,color:"#475569"}}>{selectedContractBooking.phone||"—"}</div></div>
                    <div style={{background:"#0F1117",borderRadius:10,padding:"12px"}}><div style={{fontSize:11,color:"#64748B",marginBottom:4}}>PÉRIODE</div><div style={{fontSize:13,fontWeight:700,color:"#F1F5F9"}}>{formatDate(selectedContractBooking.start)} → {formatDate(selectedContractBooking.end)}</div><div style={{fontSize:12,color:"#475569"}}>{getDaysBetween(selectedContractBooking.start,selectedContractBooking.end)} jour{getDaysBetween(selectedContractBooking.start,selectedContractBooking.end)>1?"s":""}</div></div>
                    <div style={{background:"#0F1117",borderRadius:10,padding:"12px"}}><div style={{fontSize:11,color:"#64748B",marginBottom:4}}>MONTANT TOTAL</div><div style={{fontSize:18,fontWeight:800,color:"#F59E0B"}}>{(selectedContractBooking.rate*getDaysBetween(selectedContractBooking.start,selectedContractBooking.end)).toLocaleString("fr-FR")} €</div><div style={{fontSize:12,color:"#475569"}}>{selectedContractBooking.rate} €/j × {getDaysBetween(selectedContractBooking.start,selectedContractBooking.end)}j</div></div>
                  </div>
                  <div style={{marginTop:10,display:"flex",gap:10}}>
                    <div style={{flex:1,background:"#0F1117",borderRadius:10,padding:"12px"}}><div style={{fontSize:11,color:"#64748B",marginBottom:6}}>CAUTION (€)</div><input type="number" value={contractExtra.deposit||0} onChange={e=>setContractExtra({...contractExtra,deposit:Number(e.target.value)})} style={{width:"100%",background:"transparent",border:"none",color:"#F1F5F9",fontSize:18,fontWeight:800,outline:"none"}}/></div>
                    <div style={{flex:2,background:"#0F1117",borderRadius:10,padding:"12px"}}><div style={{fontSize:11,color:"#64748B",marginBottom:4}}>NOTES</div><div style={{fontSize:13,color:"#94A3B8",fontStyle:selectedContractBooking.notes?"normal":"italic"}}>{selectedContractBooking.notes||"Aucune note"}</div></div>
                  </div>
                </div>
                <button onClick={()=>exportContractPDF({...selectedContractBooking,...contractExtra},selectedContractVehicle)} style={{background:"linear-gradient(135deg,#1a1a2e,#3B82F6)",border:"none",color:"#fff",padding:"16px 24px",borderRadius:12,cursor:"pointer",fontWeight:800,fontSize:15,display:"flex",alignItems:"center",justifyContent:"center",gap:10,boxShadow:"0 4px 20px rgba(59,130,246,0.4)"}}>
                  <span style={{fontSize:18}}>📥</span> Exporter le contrat en PDF
                </button>
              </>)}
            </div>
          </div>
        </div>
      )}

      {/* ── MODALS ── */}
      {modal&&!deleteConfirm?.type?.startsWith("vehicle")&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.75)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:100,padding:20}} onClick={e=>e.target===e.currentTarget&&setModal(null)}>
          <div style={{background:"#161B27",borderRadius:20,width:"100%",maxWidth:500,border:"1px solid #1E2535",boxShadow:"0 20px 60px rgba(0,0,0,0.6)",maxHeight:"92vh",overflowY:"auto"}}>

            {modal.type==="detail"&&modal.booking&&(()=>{const v=vehicles.find(v=>v.id===modal.vehicleId),b=modal.booking;return(<>
              <div style={{padding:"24px 28px",borderBottom:"1px solid #1E2535",display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}><div><div style={{fontSize:12,color:"#475569",fontWeight:600,marginBottom:4}}>RÉSERVATION</div><div style={{fontSize:20,fontWeight:700,color:"#F1F5F9"}}>{b.client}</div></div><button onClick={()=>setModal(null)} style={{background:"#1E2535",border:"none",color:"#64748B",width:32,height:32,borderRadius:8,cursor:"pointer",fontSize:18}}>×</button></div>
              <div style={{padding:"20px 28px",display:"flex",flexDirection:"column",gap:14}}>
                <Row icon="🚗" label="Véhicule" value={(v?.name||"?")+" · "+(v?.plate||"?")}/>
                <Row icon="📞" label="Téléphone" value={b.phone||"—"}/>
                <Row icon="📧" label="Email" value={b.email||"—"}/>
                <Row icon="📅" label="Période" value={formatDate(b.start)+" → "+formatDate(b.end)}/>
                <Row icon="⏱" label="Durée" value={getDaysBetween(b.start,b.end)+" jour(s)"}/>
                <div style={{background:"#0F1117",borderRadius:12,padding:"16px",display:"flex",justifyContent:"space-between",alignItems:"center"}}><div><div style={{fontSize:12,color:"#475569"}}>Tarif journalier</div><div style={{fontSize:24,fontWeight:700,color:"#F59E0B"}}>{b.rate} €</div></div><div style={{textAlign:"right"}}><div style={{fontSize:12,color:"#475569"}}>Total location</div><div style={{fontSize:24,fontWeight:700,color:"#10B981"}}>{b.rate*getDaysBetween(b.start,b.end)} €</div></div></div>
                {b.notes&&<Row icon="💬" label="Notes" value={b.notes}/>}
              </div>
              <div style={{padding:"16px 28px 24px",display:"flex",gap:10,flexWrap:"wrap"}}>
                <button onClick={()=>openEdit(b)} style={{flex:1,background:"#3B82F6",border:"none",color:"#fff",padding:"12px",borderRadius:10,cursor:"pointer",fontWeight:600,fontSize:14}}>✏️ Modifier</button>
                <button onClick={()=>{setPage("contracts");setContractBookingId(b.id);setContractExtra({email:b.email||"",address:b.address||"",licenseNum:b.licenseNum||"",deposit:b.deposit||0});setModal(null);}} style={{flex:1,background:"#1a1a2e30",border:"1px solid #3B82F640",color:"#3B82F6",padding:"12px",borderRadius:10,cursor:"pointer",fontWeight:600,fontSize:14}}>📄 Contrat PDF</button>
                <button onClick={()=>setDeleteConfirm(b.id)} style={{flex:1,background:"#EF444420",border:"1px solid #EF444440",color:"#EF4444",padding:"12px",borderRadius:10,cursor:"pointer",fontWeight:600,fontSize:14}}>🗑 Supprimer</button>
              </div>
              {deleteConfirm===b.id&&(<div style={{padding:"0 28px 24px"}}><div style={{background:"#EF444415",border:"1px solid #EF444430",borderRadius:10,padding:"14px 16px"}}><div style={{fontSize:13,color:"#EF4444",marginBottom:12,fontWeight:600}}>Confirmer la suppression ?</div><div style={{display:"flex",gap:8}}><button onClick={()=>deleteBooking(b.id)} style={{flex:1,background:"#EF4444",border:"none",color:"#fff",padding:"8px",borderRadius:8,cursor:"pointer",fontWeight:600,fontSize:13}}>Oui, supprimer</button><button onClick={()=>setDeleteConfirm(null)} style={{flex:1,background:"#1E2535",border:"none",color:"#94A3B8",padding:"8px",borderRadius:8,cursor:"pointer",fontSize:13}}>Annuler</button></div></div></div>)}
            </>);})()}

            {(modal.type==="add"||modal.type==="edit"||modal.type==="add-global")&&(()=>{const isEdit=modal.type==="edit",isGlobal=modal.type==="add-global",v=vehicles.find(v=>v.id===(Number(form.vehicleId)||modal.vehicleId));return(<>
              <div style={{padding:"24px 28px",borderBottom:"1px solid #1E2535",display:"flex",justifyContent:"space-between",alignItems:"center"}}><div><div style={{fontSize:12,color:"#475569",fontWeight:600}}>{isEdit?"MODIFIER":"NOUVELLE RÉSERVATION"}</div><div style={{fontSize:18,fontWeight:700,color:"#F1F5F9",marginTop:2}}>{isEdit?v?.name:(isGlobal?"Choisir un véhicule":v?.name)}</div></div><button onClick={()=>setModal(null)} style={{background:"#1E2535",border:"none",color:"#64748B",width:32,height:32,borderRadius:8,cursor:"pointer",fontSize:18}}>×</button></div>
              <div style={{padding:"20px 28px",display:"flex",flexDirection:"column",gap:14}}>
                {(isGlobal||isEdit)&&(<div><label style={{fontSize:12,color:"#475569",fontWeight:600,display:"block",marginBottom:6}}>VÉHICULE</label><select value={form.vehicleId||""} onChange={e=>setForm({...form,vehicleId:e.target.value})} style={{width:"100%",background:"#0F1117",border:"1px solid #2D3748",color:form.vehicleId?"#E2E8F0":"#475569",padding:"10px 12px",borderRadius:8,fontSize:14}}><option value="">Sélectionner un véhicule</option>{vehicles.map(v=>{const avail=isVehicleAvailableInRange(v.id,form.start||today,form.end||today,bookings,form.id);return(<option key={v.id} value={v.id} disabled={!avail&&!isEdit}>{v.name} — {v.plate}{(!avail&&!isEdit)?" (non disponible)":""}</option>);})}</select></div>)}
                <Field label="Client" value={form.client} onChange={v=>setForm({...form,client:v})} placeholder="Nom du locataire"/>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}><Field label="Téléphone" value={form.phone} onChange={v=>setForm({...form,phone:v})} placeholder="06 00 00 00 00"/><Field label="Email" value={form.email} onChange={v=>setForm({...form,email:v})} placeholder="client@email.fr"/></div>
                <Field label="Adresse" value={form.address} onChange={v=>setForm({...form,address:v})} placeholder="12 rue de la Paix, 75001 Paris"/>
                <Field label="N° Permis de conduire" value={form.licenseNum} onChange={v=>setForm({...form,licenseNum:v})} placeholder="123456789012"/>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                  <div><label style={{fontSize:12,color:"#475569",fontWeight:600,display:"block",marginBottom:6}}>DATE DE DÉBUT</label><input type="date" value={form.start||""} onChange={e=>setForm({...form,start:e.target.value})} style={{width:"100%",background:"#0F1117",border:"1px solid #2D3748",color:"#E2E8F0",padding:"10px 12px",borderRadius:8,fontSize:14,boxSizing:"border-box"}}/></div>
                  <div><label style={{fontSize:12,color:"#475569",fontWeight:600,display:"block",marginBottom:6}}>DATE DE FIN</label><input type="date" value={form.end||""} onChange={e=>setForm({...form,end:e.target.value})} style={{width:"100%",background:"#0F1117",border:"1px solid #2D3748",color:"#E2E8F0",padding:"10px 12px",borderRadius:8,fontSize:14,boxSizing:"border-box"}}/></div>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}><Field label="Tarif/jour (€)" value={form.rate} onChange={v=>setForm({...form,rate:v})} placeholder="ex: 75" type="number"/><Field label="Caution (€)" value={form.deposit} onChange={v=>setForm({...form,deposit:v})} placeholder="ex: 300" type="number"/></div>
                {form.start&&form.end&&parseDate(form.end)>=parseDate(form.start)&&(<div style={{background:"#10B98115",border:"1px solid #10B98130",borderRadius:10,padding:"10px 14px",fontSize:13}}><span style={{color:"#10B981",fontWeight:700}}>{getDaysBetween(form.start,form.end)} jour(s)</span>{form.rate&&<span style={{color:"#64748B"}}> · Total estimé : <strong style={{color:"#F59E0B"}}>{Number(form.rate)*getDaysBetween(form.start,form.end)} €</strong></span>}</div>)}
                <Field label="Notes (optionnel)" value={form.notes} onChange={v=>setForm({...form,notes:v})} placeholder="Informations complémentaires..." textarea/>
              </div>
              <div style={{padding:"0 28px 24px",display:"flex",gap:10}}>
                <button onClick={()=>setModal(null)} style={{flex:1,background:"#1E2535",border:"none",color:"#94A3B8",padding:"12px",borderRadius:10,cursor:"pointer",fontWeight:600,fontSize:14}}>Annuler</button>
                <button onClick={saveBooking} disabled={!form.client||!form.start||!form.end||!form.rate||(isGlobal&&!form.vehicleId)} style={{flex:2,background:(!form.client||!form.start||!form.end||!form.rate||(isGlobal&&!form.vehicleId))?"#1E2535":"linear-gradient(135deg,#1a1a2e,#3B82F6)",border:"none",color:(!form.client||!form.start||!form.end||!form.rate||(isGlobal&&!form.vehicleId))?"#475569":"#fff",padding:"12px",borderRadius:10,cursor:"pointer",fontWeight:700,fontSize:14}}>{syncing?"Enregistrement…":isEdit?"💾 Enregistrer":"✓ Créer la réservation"}</button>
              </div>
            </>);})()}

            {(modal.type==="add-vehicle"||modal.type==="edit-vehicle")&&(()=>{const isEdit=modal.type==="edit-vehicle",FUELS=["Essence","Diesel","Hybride","Électrique","GPL"];return(<>
              <div style={{padding:"24px 28px",borderBottom:"1px solid #1E2535",display:"flex",justifyContent:"space-between",alignItems:"center"}}><div><div style={{fontSize:12,color:"#475569",fontWeight:600}}>{isEdit?"MODIFIER LE VÉHICULE":"NOUVEAU VÉHICULE"}</div><div style={{fontSize:18,fontWeight:700,color:"#F1F5F9",marginTop:2}}>{isEdit?form.name:"Ajouter à la flotte"}</div></div><button onClick={()=>setModal(null)} style={{background:"#1E2535",border:"none",color:"#64748B",width:32,height:32,borderRadius:8,cursor:"pointer",fontSize:18}}>×</button></div>
              <div style={{padding:"20px 28px",display:"flex",flexDirection:"column",gap:16}}>
                <Field label="Nom du véhicule" value={form.name} onChange={v=>setForm({...form,name:v})} placeholder="ex: Peugeot 308"/>
                <Field label="Plaque d'immatriculation" value={form.plate} onChange={v=>setForm({...form,plate:v})} placeholder="ex: AB-123-CD"/>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}><Field label="Année" value={form.year} onChange={v=>setForm({...form,year:v})} placeholder="ex: 2021" type="number"/><Field label="Kilométrage" value={form.mileage} onChange={v=>setForm({...form,mileage:v})} placeholder="ex: 48500" type="number"/></div>
                <div><label style={{fontSize:12,color:"#475569",fontWeight:600,display:"block",marginBottom:8}}>CARBURANT</label><div style={{display:"flex",flexWrap:"wrap",gap:8}}>{FUELS.map(f=><button key={f} onClick={()=>setForm({...form,fuel:f})} style={{background:form.fuel===f?"#10B981":"#1E2535",border:"1px solid "+(form.fuel===f?"#10B981":"#2D3748"),color:form.fuel===f?"#fff":"#94A3B8",padding:"6px 14px",borderRadius:20,cursor:"pointer",fontSize:13,fontWeight:form.fuel===f?700:400}}>{f}</button>)}</div></div>
                <div><label style={{fontSize:12,color:"#475569",fontWeight:600,display:"block",marginBottom:8}}>TYPE DE VÉHICULE</label><div style={{display:"flex",flexWrap:"wrap",gap:8}}>{VEHICLE_TYPES.map(t=><button key={t} onClick={()=>setForm({...form,type:t})} style={{background:form.type===t?"linear-gradient(135deg,#1a1a2e,#3B82F6)":"#1E2535",border:"1px solid "+(form.type===t?"#3B82F6":"#2D3748"),color:form.type===t?"#fff":"#94A3B8",padding:"6px 14px",borderRadius:20,cursor:"pointer",fontSize:13,fontWeight:form.type===t?700:400}}>{VEHICLE_EMOJIS[t]} {t}</button>)}</div></div>
                <div><label style={{fontSize:12,color:"#475569",fontWeight:600,display:"block",marginBottom:8}}>COULEUR D'IDENTIFICATION</label><div style={{display:"flex",gap:10,flexWrap:"wrap"}}>{VEHICLE_COLORS.map(c=><button key={c} onClick={()=>setForm({...form,color:c})} style={{width:32,height:32,borderRadius:"50%",background:c,border:form.color===c?"3px solid #fff":"3px solid transparent",cursor:"pointer",outline:form.color===c?"2px solid "+c:"none"}}/>)}</div></div>
                {isEdit&&<button onClick={()=>deleteVehicle(form.id)} style={{background:"#EF444415",border:"1px solid #EF444430",color:"#EF4444",padding:"10px",borderRadius:10,cursor:"pointer",fontWeight:600,fontSize:14}}>🗑 Supprimer ce véhicule</button>}
              </div>
              <div style={{padding:"0 28px 24px",display:"flex",gap:10}}>
                <button onClick={()=>setModal(null)} style={{flex:1,background:"#1E2535",border:"none",color:"#94A3B8",padding:"12px",borderRadius:10,cursor:"pointer",fontWeight:600,fontSize:14}}>Annuler</button>
                <button onClick={saveVehicle} disabled={!form.name||!form.plate||!form.type} style={{flex:2,background:(!form.name||!form.plate||!form.type)?"#1E2535":"linear-gradient(135deg,#1a1a2e,#3B82F6)",border:"none",color:(!form.name||!form.plate||!form.type)?"#475569":"#fff",padding:"12px",borderRadius:10,cursor:"pointer",fontWeight:700,fontSize:14}}>{syncing?"Enregistrement…":isEdit?"💾 Enregistrer":"+ Ajouter le véhicule"}</button>
              </div>
            </>);})()}

            {(modal.type==="add-expense"||modal.type==="edit-expense")&&(()=>{const isEdit=modal.type==="edit-expense";return(<>
              <div style={{padding:"24px 28px",borderBottom:"1px solid #1E2535",display:"flex",justifyContent:"space-between",alignItems:"center"}}><div><div style={{fontSize:12,color:"#475569",fontWeight:600}}>{isEdit?"MODIFIER LA DÉPENSE":"NOUVELLE DÉPENSE"}</div><div style={{fontSize:18,fontWeight:700,color:"#F1F5F9",marginTop:2}}>{isEdit?form.category:"Ajouter une dépense"}</div></div><button onClick={()=>setModal(null)} style={{background:"#1E2535",border:"none",color:"#64748B",width:32,height:32,borderRadius:8,cursor:"pointer",fontSize:18}}>×</button></div>
              <div style={{padding:"20px 28px",display:"flex",flexDirection:"column",gap:16}}>
                <div><label style={{fontSize:12,color:"#475569",fontWeight:600,display:"block",marginBottom:6}}>VÉHICULE</label><select value={form.vehicleId||""} onChange={e=>setForm({...form,vehicleId:e.target.value})} style={{width:"100%",background:"#0F1117",border:"1px solid #2D3748",color:form.vehicleId?"#E2E8F0":"#475569",padding:"10px 12px",borderRadius:8,fontSize:14}}><option value="">Sélectionner un véhicule</option>{vehicles.map(v=><option key={v.id} value={v.id}>{v.name} — {v.plate}</option>)}</select></div>
                <div><label style={{fontSize:12,color:"#475569",fontWeight:600,display:"block",marginBottom:8}}>CATÉGORIE</label><div style={{display:"flex",flexWrap:"wrap",gap:8}}>{EXPENSE_CATEGORIES.map(c=><button key={c} onClick={()=>setForm({...form,category:c})} style={{background:form.category===c?"#EF4444":"#1E2535",border:"1px solid "+(form.category===c?"#EF4444":"#2D3748"),color:form.category===c?"#fff":"#94A3B8",padding:"6px 14px",borderRadius:20,cursor:"pointer",fontSize:13,fontWeight:form.category===c?700:400}}>{c}</button>)}</div></div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}><div><label style={{fontSize:12,color:"#475569",fontWeight:600,display:"block",marginBottom:6}}>DATE</label><input type="date" value={form.date||""} onChange={e=>setForm({...form,date:e.target.value})} style={{width:"100%",background:"#0F1117",border:"1px solid #2D3748",color:"#E2E8F0",padding:"10px 12px",borderRadius:8,fontSize:14,boxSizing:"border-box"}}/></div><Field label="Montant (€)" value={form.amount} onChange={v=>setForm({...form,amount:v})} placeholder="ex: 85" type="number"/></div>
                <Field label="Note (optionnel)" value={form.note} onChange={v=>setForm({...form,note:v})} placeholder="Description de la dépense"/>
                {isEdit&&<button onClick={()=>deleteExpense(form.id)} style={{background:"#EF444415",border:"1px solid #EF444430",color:"#EF4444",padding:"10px",borderRadius:10,cursor:"pointer",fontWeight:600,fontSize:14}}>🗑 Supprimer cette dépense</button>}
              </div>
              <div style={{padding:"0 28px 24px",display:"flex",gap:10}}>
                <button onClick={()=>setModal(null)} style={{flex:1,background:"#1E2535",border:"none",color:"#94A3B8",padding:"12px",borderRadius:10,cursor:"pointer",fontWeight:600,fontSize:14}}>Annuler</button>
                <button onClick={saveExpense} disabled={!form.vehicleId||!form.date||!form.amount||!form.category} style={{flex:2,background:(!form.vehicleId||!form.date||!form.amount||!form.category)?"#1E2535":"#EF4444",border:"none",color:(!form.vehicleId||!form.date||!form.amount||!form.category)?"#475569":"#fff",padding:"12px",borderRadius:10,cursor:"pointer",fontWeight:700,fontSize:14}}>{syncing?"Enregistrement…":isEdit?"💾 Enregistrer":"+ Ajouter la dépense"}</button>
              </div>
            </>);})()}
          </div>
        </div>
      )}
    </div>
  );
}
