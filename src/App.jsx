import { useState, useMemo, useEffect, useCallback, useRef } from "react";

const SUPA_URL="https://lmtgoehaeepigauxeeor.supabase.co";
const SUPA_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxtdGdvZWhhZWVwaWdhdXhlZW9yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE1MDg0NTksImV4cCI6MjA5NzA4NDQ1OX0.c4RvAe0leTvcMHUzYoAeZX8F1-VtAbePaqBV-F89kbc";
const H={"Content-Type":"application/json","apikey":SUPA_KEY,"Authorization":"Bearer "+SUPA_KEY,"Prefer":"return=representation"};
async function dbGet(t){const r=await fetch(SUPA_URL+"/rest/v1/"+t+"?order=id",{headers:H});return r.json();}
async function dbIns(t,o){const r=await fetch(SUPA_URL+"/rest/v1/"+t,{method:"POST",headers:H,body:JSON.stringify(o)});return r.json();}
async function dbUpd(t,id,o){const r=await fetch(SUPA_URL+"/rest/v1/"+t+"?id=eq."+id,{method:"PATCH",headers:H,body:JSON.stringify(o)});return r.json();}
async function dbDel(t,id){await fetch(SUPA_URL+"/rest/v1/"+t+"?id=eq."+id,{method:"DELETE",headers:H});}

const LOGO="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAE4AAABQCAMAAACAqLPEAAABAGlDQ1BpY2MAABiVY2BgPMEABCwGDAy5eSVFQe5OChGRUQrsDxgYgRAMEpOLCxhwA6Cqb9cgai/r4lGHC3CmpBYnA+kPQKxSBLQcaKQIkC2SDmFrgNhJELYNiF1eUlACZAeA2EUhQc5AdgqQrZGOxE5CYicXFIHU9wDZNrk5pckIdzPwpOaFBgNpDiCWYShmCGJwZ3AC+R+iJH8RA4PFVwYG5gkIsaSZDAzbWxkYJG4hxFQWMDDwtzAwbDuPEEOESUFiUSJYiAWImdLSGBg+LWdg4I1kYBC+wMDAFQ0LCBxuUwC7zZ0hHwjTGXIYUoEingx5DMkMekCWEYMBgyGDGQCm1j8/yRb+6wAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAC/VBMVEUAAAADAwMBAQECAgIJCQkSEhJZWVkjIyM1NTU/Pz95eXkGBgYXFxf29vYvLy8sLCxAQEBOTk5ycnKampqjo6N9fX3Ly8sEBARFRUXb29sMDAxdXV0wMDAODg4ICAgrKyuhoaEzMzNBQUGTk5N/f38gICD39/fDw8P///9VVVUHBwd+fn64uLjKyspbW1t2dnZjY2MhISHOzs5zc3OMjIywsLDW1tZSUlIbGxtHR0eFhYWIiIjFxcW+vr4oKCgnJydERETo6Ojp6emvr69DQ0Pu7u5LS0sLCwvHx8dXV1fv7+8YGBicnJySkpI8PDwKCgoTExPa2tpgYGAQEBAFBQUNDQ0RERGBgYEqKioZGRlnZ2esrKwlJSXIyMgWFhYiIiIVFRVlZWXe3t4xMTE5OTm3t7fS0tLk5OTx8fHt7e3h4eGurq57e3s6OjpNTU0fHx/d3d1fX1/7+/tiYmI3NzdoaGidnZ0aGhrJyckyMjKXl5fr6+v6+vqUlJRISEgdHR3CwsKAgID9/f2Ojo4+Pj6YmJhpaWmioqI7Ozs0NDQUFBRkZGRWVlYmJib19fW1tbUeHh5ubm5CQkJsbGybm5vNzc1UVFR8fHx0dHTz8/PX19ctLS3f399qamp4eHjs7OwcHByVlZVhYWGxsbFQUFDY2NiEhISpqamzs7PZ2dmqqqpYWFhxcXEuLi49PT02Njb4+PhcXFzl5eVwcHDw8PCWlpZ3d3fj4+PGxsZaWlrc3NzBwcE4ODhtbW3y8vKQkJDq6uq7u7uKiopGRkbV1dX5+fn8/Py5ubl1dXW6urrT09NJSUlmZma0tLT+/v7g4OBRUVH09PQPDw8pKSnAwMCHh4eysrKCgoJPT09vb2/Pz8+Pj4/n5+dKSkokJCSGhoalpaVMTEx6enqfn5+oqKheXl62tratra3i4uKRkZG/v7/MzMympqaNjY2goKCnp6e8vLyenp7U1NTExMTm5ubQ0NCDg4OZmZmkpKSLi4urq6uJiYm9vb1TU1MPERfC9TAxAAAAAWJLR0T+0gDCUwAAAAd0SU1FB+oGDw0hM5e/kBQAAAucSURBVFjDxVgHVBTXGv7nzhLUFbA8XQRZ0Mj6i6KAWDF2A6IUZcEGKoLBEiGshaiDyqrYwIKJWGJQYi+IXXi2qDuKxtGIxkSTaIIlGjUm7yWa8s55/2wBlrJgknNyz1Fm79z57l+/+/8X4B8cHPtLnzPg/y5JmIykKMWV5bJ7zd7y4s+A8XXq1lOW6segvoMj/Fl1nRpAw0bQ+F+kLw9NmjqBCpybyaAurs3dXhFL7e7RoiV7vRXz1HjKkrbGNuAFbduBirl4t1d2UDOu9mA8+Pj6dQTm3wmgcxfZn127MZKuU3emhoAeAG/0BPCqtdoMekHvPkqo01cB/fpzKvOsYsCbEOgWNJDzDR6kHhwSWivBwsLBGB5DhgJ0bxUxVJ7VRkYFaiFi2PARI+uPigb/phATo4gYqQJWk4ijfTqGMRgzFmLHUZTYx8X7hIx/K2HAhImT/Ca/7eM8BRKT4t4Zk6xzgRFToQYDMnCfpgYlTJ+RwkW8O9Otzax3UB6aAbODBeOTX+qcXr3nwrw0ANkGUUk2I8elaQA4c3wd+blOQAKiPmi+a7xvuEuYy9joBbEL3yLEt9LDYVEiRHiBdvGQJTYkZEuhl2ZZRqaLL4Bn6nLEFUNXVljSc1UPxIn1pmVkrWa+K99736RTlV7gfNcEgjPag102rA3GdfPd5WmO4xlZnDGe54ySTFmEuD55ZdyG0MwPBkLURs/qE9vdDT6cuME+9A3EVE/atxKF8DJi3CjExnFLIDlHxTapkjdUIR8D38mbcxc7R8JH6VsmYsyUaumIJ2G6fIBbp8E72yhVhjrERlYWj3F1t+/YmRO8Mw7qIforbXEbAY7ehZrde/YCBGjy7JZVVpfswntCxL6NDbZhvivUQHSkclvE/TBi14FMcNcqq9y0frwXQBoG9wcV1DCIFpYh7m60PoKg68ZsqmC+sIMNZNbpn9kRD4XWjAZyFCdj/u4wysDDwWtTrKOPZ0cOHT02PzG6QK9/E9ScqhZDAXtwQC8v58J/d62kJ4NpWd3Hdz7+QX5GLSSzjDRsnXfgBLgdbJJVITmU2imBoNyBs+dvfr2WI3XzrJN4qiu8efrj9CzPMrOC+yqyQeSUTRnY5yS+yjjTV4ge5N2NQFxLfcGzs+eODg6FrllbMbdQZxAEQac32ByCSIsEB7HbdOw0jTI85fwFK/+dLUq4eOkTvKwNRr0koWGCpJcHfWUw6CWaon+ijENIenpchzQlYHt2BQcOvzrj08k8X6pr9FK4Fnlt7e5z+n1QXNyz2Gllg+t6Ua8TJJNKMhrhWTTU0S5Hxrj3pJXhMBXbZd447EyRHWmOcJaak1pAD69hkTkZWg5BUdQhils/S715c4JROlG6GFIvfWPaqL5IvyfsNcuiuIJOZK/MlMEdzNTHhze8nOPXMakIPydsXgtfEBCB3WrkbrTHURRJNgMONSGEZ5PgeNGL40lBDrKl2/F5MyM+wUtmWRil3NLpQW2Wf6kwpuMXqBMFnLRf3oxXqdwOSDKcIKVzaopemh0o0W5fGYXh4WvxSqYCGuIWU54xsL/Ti4tKUm3EWbSCh0Qkv+Hl0YRs3C7sgFE6AaebnEe730WNvrFJNwY9MBS+wVxuX3MjoKoYmNbu4PBFUkPSlQ2arae9t0Op4yvC0aKWKEhBJmlU8K3+Qh6GJDX3nGuE5+44yn/nNNOlyESxCAUdNtWW1UmV4BikOEjYzGR4DhbgjrrxlrOdtDs7OyjkZr9kTWe5nNur14livnu5A6oKuIgcxELO/GOs5rTxgZXGXeqxjy+FkoLEoe+hIODC8sddFXAjlkuSt4XiWGfpa74c25qmR0p3QAvXTksUBsPLl4RV2K4/5utLLGEGK6TFVuTNON6Lz8YTdJDMQZ0OY6y4tRKcFu5hPgWGxXiDpc8rHt4q8Mf7oIZtksEg3bBKZwuclM4r6axVMVgjCdJ6S1kqf+laEY6DENxN1clnkiBIbazemuFKs4JPzyffZ1n0U8Ed9LHan5cnT2EB/X+LMgL3WZmiVDr/vAZ5C7ak3UJihtjSJSoIwFxr6RjZY5u8RDsOdZKYWYXtyjOKuPOrsu85SMUM0PI8s8j22qn2wPbgt8ACD6AO85NswAkag/6BupxyHGyXerPyoh192D6e8nohMPV31UqnlzQnT57UEKJouGzHyvUHxzAOPB85B5on1H5NzuzqlomPKbI727DdhdEpo1cuuJ2PIp4vF7fq04bIDQsb5XwfYdpD9aTfpTWpzJBD58911FXr2WWm33kTRA2WFrI8FOP34SWuj1pjT6MUHJSUPH2WBN7YAmCGJBikgGrijmmpylOCDxr061XMYrr9UkjKD07+z5cHGm3EQTfhx9VHwF/fESBd5hNvm1nBcUPIX5a84sCDoviCxyPNc4uJ2E+464E2D/8DUEznlCg62spZilvJQUqzaOByWhg712+jgK6WTkhVKHr/kMj/V+wJzFvSCehRXttK0kEWGqTxJlk42EIubBWTfir3vqmMIjb8eblhVmN4igFAZZZAbDzNBt9R57hOwgS12RMPqMy7tXmiNIVZ6Cvu9jx8cjnKXjwdxRTj9DqdtPVaGV4lRgHwQ1G/QRaP6Fbsq3AqDMEhZXF4/MIvWPjiAnSixIAu5DcdPo4Ei+8q8x38KGkwWd6QUgKHwcsVb+D0Op+Y1KejLKBBn199OsJMceIIRnycT+WCn6O5B6gMpyKqdZBkxuZgijg7MvpRk/xDv95zN2cKYy8WZ7cbefgpvMBFoNIWEdcK6HBjrumtS0U4HmZKIt6SaZfzxlz3UU3aaoRTpc6jSHw/IeZZC/9klxyZZBU7qAigKuDQD67D3RhwCeYwLrOdIgGl/JVEj9mE+ktW3dRDHuWaRxZ293qztr9srgP7sU8SFWg3JNQZDHKx0+enoGMGYzWl0Y0sS6yHuk/FDAYNDPlLwL7k9UeSZ7lI5WGBKD08MtWOwQyMUVB6y20PCg4anbGA0lEZRpS5yiIdB7k0XQS+CbgHYOq9VGxlleUc8T0GfzGa8eog7MQzLUDvu32t6kzxVlvPMn3CEhOv9l/6M5laC2mphY+s2xDGe53DcZlyxZ3SDO9xtIgqpTmtfosZMmnSlc7HHv7efjhUHF7v4h9KmYM5u4qvSN0ANzlHOOh5FHe4gYozZ7iXl+UOoXxXxbyg10UMipA/YdW0SObl9dejnxP1XYxTmQ0iP1l9QfPdDpDxgCv/oRUWZ8rf6YOHLn2OE2Jt3F+Rq5TDEEu0R5YYrVLtoPrprvvmq6pHiDscTa1mldv29kYhHaDo4lxbaBysvQfwtAt11OtR3FwsT1nJyBt1jv8NcV4vKlnbpm9vONoGnlc7NXT7I3H+i6uR9dah+GSOwmw6uYg1Advtboc4aSMMvdduU7bdy/woG1cV6odO91v/trPAt03YoBG/ByNeeZERXdashjnlPqHK7koHO2juAf9bscp7/5FG1V9VMHCcMX/N89CFLZcWHR4G2ozHcgB/99jDv9Xbabef9JADW9Ovt2wDxyIIL3xK7cM1sD3aFsClwc8ugUfD1Vsg2sfjXGkxgZ/6BcyZC7mrqJCC7jtObWwCSttYTMWdLXH+/quSLdz4Fo6nbstTYWMW3I9Nji04uyEc9sbD04Pdn8lxGw2N0vkar90YnD2TCFEfnt/lMqhNP6ZUwaVhxwGaG1/GvvBIe+kCfyygfgNCdylqcecmL1l7v8ODyJUPPhpL2895UGfe3re/jOa0HLu8FM43Pa6NnU/cwkYoagaTg0vFOaa3lzN1spI+e/kN+MfyL+NkfvxsOJ8ddBs2PKnpbqzSCCxpf+K6lwxRrErdD6McKfxgcAGsPvJjxzOrXw2OAhe6HrzZ1SjRJji/F+62kFuY+GNd37vKdSh4RdHKBuXd09WLAB7WJW8y2P1sT20uRaqU0Jyu+0+oGUy1N1MbGC+E/qbB//Vbc87Ut/4T4/9AHz1gbMqauwAAAB50RVh0aWNjOmNvcHlyaWdodABHb29nbGUgSW5jLiAyMDE2rAszOAAAABR0RVh0aWNjOmRlc2NyaXB0aW9uAHNSR0K6kHMHAAAAAElFTkSuQmCC";

const VT=["Berline","Citadine","SUV","Utilitaire","Fourgon","Minibus","Cabriolet","Autre"];
const VC=["#3B82F6","#8B5CF6","#EC4899","#F59E0B","#10B981","#EF4444","#06B6D4","#F97316","#84CC16","#A855F7"];
const VE={Berline:"🚗",Citadine:"🚗",SUV:"🚙",Utilitaire:"🚐",Fourgon:"🚐",Minibus:"🚌",Cabriolet:"🚗",Autre:"🚗"};
const EC=["Carburant","Entretien","Assurance","Réparation","Nettoyage","Péage","Amende","Autres"];
const MFR=["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"];
const CO={name:"Chane-To Location",address:"712 rue de la gare, 97440 Saint-André, La Réunion",phone:"+262693010094",email:"chanetolocation@gmail.com",siret:"89512496400027",rcs:"895 124 964"};

// Identifiant et mot de passe de connexion (modifiable ici directement dans le code)
const APP_USER="Chane To Location";
const APP_PASS="@Chanetolocation7754";

const mv=r=>({id:r.id,name:r.name,plate:r.plate,type:r.type,color:r.color,year:r.year||"",fuel:r.fuel||"Essence"});
const mb=r=>({id:r.id,vehicleId:r.vehicle_id,client:r.client,phone:r.phone||"",email:r.email||"",address:r.address||"",licenseNum:r.license_num||"",licenseDate:r.license_date||"",idNum:r.id_num||"",start:r.start_date,end:r.end_date,rate:r.rate,deposit:r.deposit||0,notes:r.notes||"",pickupLocation:r.pickup_location||"agence",dropLocation:r.drop_location||"agence",extraFees:r.extra_fees||0,extraFeesNote:r.extra_fees_note||"",days:r.days||null});
const me=r=>({id:r.id,vehicleId:r.vehicle_id,date:r.date,amount:r.amount,category:r.category,note:r.note||""});
const mc=r=>({id:r.id,name:r.name,phone:r.phone||"",email:r.email||"",address:r.address||"",licenseNum:r.license_num||"",licenseDate:r.license_date||"",idNum:r.id_num||"",notes:r.notes||"",createdAt:r.created_at});
const mx=r=>({id:r.id,type:r.type,client:r.client,vehicleName:r.vehicle_name||"",vehiclePlate:r.vehicle_plate||"",dateStart:r.date_start||"",dateEnd:r.date_end||"",createdAt:r.created_at,bookingId:r.booking_id,html:r.html_content||""});

const pd=s=>{const[y,m,d]=s.split("-").map(Number);return new Date(y,m-1,d);};
const fd=s=>pd(s).toLocaleDateString("fr-FR",{day:"2-digit",month:"2-digit",year:"numeric"});
const fdl=s=>pd(s).toLocaleDateString("fr-FR",{day:"2-digit",month:"long",year:"numeric"});
const fds=s=>pd(s).toLocaleDateString("fr-FR",{day:"2-digit",month:"short"});
const ad=(ds,n)=>{const d=pd(ds);d.setDate(d.getDate()+n);const y=d.getFullYear(),m=String(d.getMonth()+1).padStart(2,"0"),dd=String(d.getDate()).padStart(2,"0");return y+"-"+m+"-"+dd;};
const dir=(date,s,e)=>{const d=pd(date),a=pd(s),b=pd(e);return d>=a&&d<=b;};
const gdb=(s,e)=>Math.round((pd(e).getTime()-pd(s).getTime())/(864e5))+1;
const gym=ds=>{const d=pd(ds);return{y:d.getFullYear(),m:d.getMonth()};};
const br=b=>b.rate*(b.days||gdb(b.start,b.end));
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
  const days=Number(b.days)||gdb(b.start,b.end),total=Number(b.rate)*days;
  const extraFees=Number(b.extraFees)||0;
  const grandTotal=total+extraFees;
  const tw=n2w(grandTotal);
  const cn="CTR-"+new Date().getFullYear()+"-"+String(b.id).padStart(4,"0");
  const ts=new Date().toLocaleDateString("fr-FR",{day:"2-digit",month:"long",year:"numeric"});
  const pickupLabel=(b.pickupLocation==="aeroport")?"✈️ Aéroport":"🏢 Agence";
  const dropLabel=(b.dropLocation==="aeroport")?"✈️ Aéroport":"🏢 Agence";
  const css=`*{margin:0;padding:0;box-sizing:border-box;}body{font-family:Arial,sans-serif;font-size:10pt;color:#1a1a1a;}
.page{width:210mm;min-height:297mm;padding:13mm 15mm;margin:0 auto;page-break-after:always;}
.cgv-page{width:210mm;min-height:297mm;padding:13mm 15mm;margin:0 auto;}
.hd{display:flex;justify-content:space-between;align-items:flex-start;border-bottom:3px solid #0F1117;padding-bottom:10px;margin-bottom:12px;}
.cn{font-size:17pt;font-weight:900;color:#0F1117;}.bg{background:#0F1117;color:white;padding:4px 12px;border-radius:4px;font-size:7pt;font-weight:700;letter-spacing:1px;text-align:center;margin-bottom:4px;}
.g2{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:10px;}
.g3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:7px;}
.s{border:1px solid #d1d5db;border-radius:5px;overflow:hidden;margin-bottom:10px;}
.sh{background:#0F1117;color:white;padding:5px 10px;font-size:8pt;font-weight:700;}
.sb{padding:9px 10px;}
.fr{display:flex;justify-content:space-between;border-bottom:1px solid #f3f4f6;padding:3px 0;}
.fr:last-child{border:none;}.fl{font-size:8pt;color:#6b7280;font-weight:600;min-width:120px;}.fv{font-size:9pt;color:#111827;font-weight:600;text-align:right;}
.am{background:linear-gradient(135deg,#0F1117,#3b82f6);color:white;border-radius:7px;padding:12px 16px;margin-bottom:10px;}
.ag{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;text-align:center;}
.al{font-size:7pt;opacity:.75;margin-bottom:2px;}.av{font-size:12pt;font-weight:900;}
.at{text-align:center;margin-top:7px;border-top:1px solid rgba(255,255,255,.3);padding-top:7px;}
.sg{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:10px;}
.si{border:1px solid #d1d5db;border-radius:5px;padding:9px 10px;}
.st{font-size:8pt;font-weight:700;margin-bottom:5px;}.sl{border-bottom:1.5px solid #374151;height:42px;margin-bottom:5px;}.sm{font-size:7pt;color:#6b7280;}
.cgv-title{font-size:14pt;font-weight:900;color:#0F1117;text-align:center;margin-bottom:16px;padding-bottom:8px;border-bottom:3px solid #0F1117;}
.cgv-art{margin-bottom:10px;}.cgv-at{font-size:9pt;font-weight:700;color:#0F1117;margin-bottom:4px;}
.cgv-txt{font-size:7.5pt;color:#374151;line-height:1.6;text-align:justify;}
.cgv-sub{font-size:8pt;font-weight:700;color:#374151;margin:6px 0 3px;}
.ft{font-size:7pt;color:#9ca3af;text-align:center;border-top:1px solid #e5e7eb;padding-top:7px;margin-top:10px;}
@media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact;}.page{page-break-after:always;}}`;

  const contractPage = `<div class="page">
<div class="hd"><div><div class="cn">${co.name}</div><div style="font-size:8pt;color:#64748b;">Location de véhicules — Île de la Réunion</div>
<div style="margin-top:5px;font-size:7.5pt;color:#374151;line-height:1.5;">${co.address||"6 Chemin Bancalin Pierre Marc, Sainte Suzanne, Île de la Réunion"}<br>Tél : ${co.phone}${co.email?" · "+co.email:""}<br>${co.siret?"SIRET : "+co.siret+" · ":""}RCS 895 124 964</div></div>
<div><div class="bg">CONTRAT DE LOCATION</div><div style="font-size:9pt;font-weight:700;text-align:center;">${cn}</div><div style="font-size:7.5pt;color:#6b7280;text-align:center;margin-top:3px;">Établi le ${ts}</div></div></div>
<div class="g2">
<div class="s"><div class="sh">🏢 LE LOUEUR</div><div class="sb">
<div class="fr"><span class="fl">Société</span><span class="fv">${co.name}</span></div>
<div class="fr"><span class="fl">Adresse</span><span class="fv">${co.address||"6 Chemin Bancalin Pierre Marc"}</span></div>
<div class="fr"><span class="fl">Téléphone</span><span class="fv">${co.phone}</span></div>
<div class="fr"><span class="fl">Email</span><span class="fv">${co.email||"chanetolocation@gmail.com"}</span></div>
<div class="fr"><span class="fl">RCS</span><span class="fv">Saint Denis 895 124 964</span></div>
</div></div>
<div class="s"><div class="sh">👤 LE LOCATAIRE</div><div class="sb">
<div class="fr"><span class="fl">Nom complet</span><span class="fv">${b.client}</span></div>
<div class="fr"><span class="fl">Adresse</span><span class="fv">${b.address||"—"}</span></div>
<div class="fr"><span class="fl">Téléphone</span><span class="fv">${b.phone||"—"}</span></div>
<div class="fr"><span class="fl">Email</span><span class="fv">${b.email||"—"}</span></div>
<div class="fr"><span class="fl">N° Permis</span><span class="fv">${b.licenseNum||"—"}</span></div>
</div></div></div>
<div class="s"><div class="sh">🚗 VÉHICULE LOUÉ</div><div class="sb"><div class="g3">
<div class="fr"><span class="fl">Désignation</span><span class="fv">${v.name}</span></div>
<div class="fr"><span class="fl">Immatriculation</span><span class="fv">${v.plate}</span></div>
<div class="fr"><span class="fl">Type</span><span class="fv">${v.type}</span></div>
<div class="fr"><span class="fl">Année</span><span class="fv">${v.year||"—"}</span></div>
<div class="fr"><span class="fl">Carburant</span><span class="fv">${v.fuel||"—"}</span></div>
</div></div></div>
<div class="s"><div class="sh">📅 PÉRIODE & LIEUX</div><div class="sb"><div class="g3">
<div class="fr"><span class="fl">Départ</span><span class="fv">${fdl(b.start)}</span></div>
<div class="fr"><span class="fl">Retour</span><span class="fv">${fdl(b.end)}</span></div>
<div class="fr"><span class="fl">Durée</span><span class="fv">${days} jour${days>1?"s":""}</span></div>
<div class="fr"><span class="fl">Récupération</span><span class="fv">${pickupLabel}</span></div>
<div class="fr"><span class="fl">Dépose</span><span class="fv">${dropLabel}</span></div>
</div></div></div>
<div class="am">
<div style="font-size:8pt;opacity:.8;font-weight:600;margin-bottom:5px;">💰 RÉCAPITULATIF FINANCIER</div>
<div class="ag">
<div><div class="al">TARIF/JOUR</div><div class="av">${b.rate} €</div></div>
<div><div class="al">DURÉE</div><div class="av">${days}j</div></div>
<div><div class="al">CAUTION</div><div class="av">${b.deposit||0} €</div></div>
<div><div class="al">FRAIS SUPPL.</div><div class="av">${extraFees} €</div></div>
</div>
<div class="at">
<div style="font-size:8pt;opacity:.8;">MONTANT TOTAL (location + frais)</div>
<div style="font-size:17pt;font-weight:900;">${grandTotal.toLocaleString("fr-FR")} €</div>
<div style="font-size:8pt;opacity:.85;font-style:italic;margin-top:2px;">Soit : ${tw} euros</div>
</div></div>
${extraFees>0?"<div style='background:#fef3c7;border:1px solid #f59e0b;border-radius:5px;padding:7px 10px;margin-bottom:10px;font-size:7.5pt;color:#92400e;'><strong>Détail frais additionnels :</strong> "+b.extraFeesNote+" — "+extraFees+" €</div>":""}
${b.notes?"<div style='background:#f0f9ff;border:1px solid #0ea5e9;border-radius:5px;padding:7px 10px;margin-bottom:10px;font-size:7.5pt;color:#0369a1;text-align:center;font-weight:600;'>📋 "+b.notes+"</div>":""}
<div class="sg">
<div class="si"><div class="st">SIGNATURE DU LOUEUR</div>${b.sigLoueur?`<img src="${b.sigLoueur}" style="max-height:60px;display:block;margin:4px 0;"/>`:"<div class='sl'></div>"}<div class="sm">Lu et approuvé — ${co.name}</div><div class="sm">Cachet et signature</div></div>
<div class="si"><div class="st">SIGNATURE DU LOCATAIRE</div>${b.sigLocataire?`<img src="${b.sigLocataire}" style="max-height:60px;display:block;margin:4px 0;"/>`:"<div class='sl'></div>"}<div class="sm">Lu et approuvé — ${b.client}</div><div class="sm">Précéder de la mention manuscrite « Lu et approuvé »</div></div>
</div>
<div class="ft">${co.name} — ${co.phone} — chanetolocation@gmail.com | Contrat ${cn} — ${ts} | Les Conditions Générales figurent en page suivante</div>
</div>`;

  const cgvPage = `<div class="cgv-page">
<div class="cgv-title">CONDITIONS GÉNÉRALES DE LOCATION — CHANE-TO LOCATION</div>
<div style="font-size:7.5pt;color:#374151;margin-bottom:10px;text-align:center;font-style:italic;">CHANE TO LOCATION — RCS Saint Denis 895 124 964 — 6 Chemin Bancalin Pierre Marc, Sainte Suzanne, Île de la Réunion — 0693 01 00 94 — chanetolocation@gmail.com</div>

<div class="cgv-art"><div class="cgv-at">A. MENTIONS LÉGALES</div><div class="cgv-txt">CHANE TO LOCATION est une entreprise individuelle immatriculée au RCS de Saint Denis sous le numéro 895 124 964, dont le siège est situé 6 Chemin Bancalin Pierre Marc, Sainte Suzanne, Île de la Réunion. Directeur de la publication : Monsieur Romain Chane-To. Tél : 06 93 01 00 94 — chanetolocation@gmail.com. La Société se réserve le droit de modifier les présentes Conditions Générales à tout moment.</div></div>

<div class="cgv-art"><div class="cgv-at">ARTICLE 1 — DÉFINITIONS</div><div class="cgv-txt">« Véhicule(s) » désigne des véhicules terrestres automobiles motorisés à quatre (4) roues proposés à la location. « Demande de Réservation » désigne une demande formulée par un Membre quant à la location d'un Véhicule. « Parties » désigne CHANE TO LOCATION et les Membres.</div></div>

<div class="cgv-art"><div class="cgv-at">ARTICLE 3 — ÉTAT DES LIEUX</div>
<div class="cgv-sub">3.1 État des lieux d'entrée (début de location)</div>
<div class="cgv-txt">Préalablement à la mise à disposition du Véhicule, un état des lieux d'entrée sera établi contradictoirement et signé par les deux parties. Il indiquera le niveau de carburant, le kilométrage et l'état général du véhicule. CHANE TO LOCATION s'engage à : vérifier la validité du permis du locataire (original, plus de 2 ans, 22 ans minimum) ; remplir et faire signer l'état des lieux ; fournir une copie de la carte grise. Le Locataire s'engage à : envoyer une copie de son permis au minimum 24h avant le début de la location ; remplir et signer l'état des lieux. Des photos du véhicule sont fortement recommandées.</div>
<div class="cgv-sub">3.2 État des lieux de sortie (fin de location)</div>
<div class="cgv-txt">À terme de la location, un état des lieux de sortie sera réalisé. Le Locataire restitue le Véhicule dans le même état qu'à la prise en charge. CHANE TO LOCATION peut signaler des dommages dans un délai de 4 mois suivant la date de fin de location.</div></div>

<div class="cgv-art"><div class="cgv-at">ARTICLE 4 — ENGAGEMENTS DU LOCATAIRE</div>
<div class="cgv-sub">4.1 Engagements généraux</div>
<div class="cgv-txt">Le Locataire doit être âgé d'au moins 22 ans, titulaire d'un permis de catégorie B valable depuis 2 ans au minimum, sans suspension au cours des 24 derniers mois. Le Locataire s'interdit de sous-louer le Véhicule ou de le mettre à disposition d'un tiers sans accord écrit préalable.</div>
<div class="cgv-sub">4.2 Interdictions d'utilisation</div>
<div class="cgv-txt">Le Véhicule ne doit pas être utilisé : pour le transport commercial de personnes ou de biens ; pour des courses ou rallyes ; sous l'influence de l'alcool ou de stupéfiants ; dans un but illégal ; hors de l'Île de la Réunion. Le Locataire ne doit pas réviser, réparer ou remplacer une pièce sans accord écrit préalable.</div>
<div class="cgv-sub">4.3 Frais annexes applicables</div>
<div class="cgv-txt">• Kilométrage : 0,30 €/km (ou option illimitée : 5 €/jour) • Carburant manquant : 30 €/quart de plein • Véhicule anormalement sale : 60 € • Non-respect non-fumeur : 40 € • Frais de contravention : 20 € • Retard de restitution : 5 €/demi-heure • Restitution lieu différent : majoration 100 €</div></div>

<div class="cgv-art"><div class="cgv-at">ARTICLE 5 — BARÈME DES DOMMAGES (extrait)</div>
<div class="cgv-txt">Un barème forfaitaire s'applique selon la catégorie du véhicule : Aile enfoncée (390–507 €) · Pare-choc éraflé (360–468 €) · Porte enfoncée (390–507 €) · Capot/coffre enfoncé (490–637 €) · Toit enfoncé (690–897 €) · Franchise bris de glace : 80 € · Jante endommagée (250–520 €) · Brûlure de cigarette (250–325 €) · Volant endommagé (500–650 €). Clés/Néman : sur devis.</div></div>

<div class="cgv-art"><div class="cgv-at">ARTICLE 6 — RÉSERVATION ET RÈGLEMENT</div>
<div class="cgv-txt">Un acompte de 10% est exigé à la réservation. Le solde est dû avant la prise du véhicule. Toute demande de réservation est soumise à acceptation. Le devis est valable 48 heures. Options possibles : dépôt à l'aéroport, siège auto/réhausseur.</div></div>

<div class="cgv-art"><div class="cgv-at">ARTICLE 7 — DÉPÔT DE GARANTIE ET ASSURANCE</div>
<div class="cgv-txt">Le dépôt de garantie est fixé à 1 000 € par principe, géré par SMILE & PAY. Franchises applicables : contractuelle 1 000 € · jeune conducteur (cumulable) 1 000 € · bris de glace 80 € · alcoolémie/stupéfiants 5 000 € · catastrophes naturelles 380 €. Les dommages intérieurs, mécaniques et cas de négligence ne sont pas couverts par l'assurance.</div></div>

<div class="cgv-art"><div class="cgv-at">ARTICLE 8 — ANNULATION</div>
<div class="cgv-txt">• Annulation avant le début de la location : remboursement à hauteur de 90% du prix. Les 10% restants sont conservés au titre des frais d'annulation. • Annulation pendant la période de location : aucun remboursement. Contact : chanetolocation@gmail.com</div></div>

<div class="ft">${co.name} — RCS Saint Denis 895 124 964 — 0693 01 00 94 | Contrat ${cn} — Page CGV</div>
</div>`;

  return `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><title>Contrat ${cn}</title><style>${css}</style></head><body>${contractPage}${cgvPage}</body></html>`;
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

// ── ÉTAT DES LIEUX COMPONENT ────────────────────────────────────────────────
function GaugeSelector({label,value,onChange,color="#3B82F6"}){
  const levels=[
    {v:0,l:"0",icon:"▪"},
    {v:1,l:"1/4",icon:"▪"},
    {v:2,l:"1/2",icon:"▪"},
    {v:3,l:"3/4",icon:"▪"},
    {v:4,l:"Plein",icon:"▪"},
  ];
  return(
    <div style={{marginBottom:8}}>
      <div style={{fontSize:11,color:"#94A3B8",fontWeight:600,marginBottom:6}}>{label}</div>
      <div style={{display:"flex",gap:4,alignItems:"center"}}>
        {levels.map(l=>(
          <button key={l.v} onClick={()=>onChange(l.v)} style={{flex:1,padding:"8px 4px",borderRadius:8,border:"none",background:value>=l.v?color+"90":"#1E2535",color:value>=l.v?"#fff":"#475569",cursor:"pointer",fontSize:10,fontWeight:700,transition:"all .15s"}}>
            {l.l}
          </button>
        ))}
      </div>
    </div>
  );
}

function CarSchema({damages,onToggle,title}){
  // Zones cliquables sur le schéma voiture (coordonnées en %)
  const zones=[
    {id:"front",label:"Avant",x:50,y:10,w:30,h:12},
    {id:"front-left",label:"Aile Av G",x:22,y:18,w:20,h:10},
    {id:"front-right",label:"Aile Av D",x:58,y:18,w:20,h:10},
    {id:"hood",label:"Capot",x:50,y:22,w:28,h:10},
    {id:"windshield",label:"Pare-brise",x:50,y:31,w:26,h:8},
    {id:"roof",label:"Toit",x:50,y:42,w:26,h:10},
    {id:"door-left-front",label:"Porte Av G",x:20,y:42,w:18,h:12},
    {id:"door-right-front",label:"Porte Av D",x:80,y:42,w:18,h:12},
    {id:"door-left-rear",label:"Porte Ar G",x:20,y:56,w:18,h:12},
    {id:"door-right-rear",label:"Porte Ar D",x:80,y:56,w:18,h:12},
    {id:"rear-windshield",label:"Lunette Ar",x:50,y:63,w:26,h:8},
    {id:"rear-left",label:"Aile Ar G",x:22,y:68,w:20,h:10},
    {id:"rear-right",label:"Aile Ar D",x:58,y:68,w:20,h:10},
    {id:"rear",label:"Arrière",x:50,y:80,w:30,h:12},
    {id:"underbody",label:"Dessous",x:50,y:93,w:22,h:8},
  ];
  return(
    <div>
      <div style={{fontSize:12,fontWeight:700,color:"#F1F5F9",marginBottom:10}}>{title}</div>
      <div style={{position:"relative",width:"100%",paddingBottom:"120%",background:"#0F1117",borderRadius:12,border:"1px solid #1E2535",overflow:"hidden"}}>
        {/* Silhouette SVG voiture */}
        <svg viewBox="0 0 200 280" style={{position:"absolute",inset:0,width:"100%",height:"100%"}} xmlns="http://www.w3.org/2000/svg">
          {/* Corps principal */}
          <rect x="60" y="60" width="80" height="160" rx="8" fill="#1E2535" stroke="#2D3748" strokeWidth="1.5"/>
          {/* Toit */}
          <rect x="70" y="100" width="60" height="60" rx="6" fill="#161B27" stroke="#2D3748" strokeWidth="1"/>
          {/* Avant */}
          <rect x="65" y="35" width="70" height="30" rx="6" fill="#1E2535" stroke="#2D3748" strokeWidth="1.5"/>
          {/* Arrière */}
          <rect x="65" y="215" width="70" height="30" rx="6" fill="#1E2535" stroke="#2D3748" strokeWidth="1.5"/>
          {/* Roues */}
          <circle cx="60" cy="90" r="14" fill="#0F1117" stroke="#3B82F6" strokeWidth="2"/>
          <circle cx="140" cy="90" r="14" fill="#0F1117" stroke="#3B82F6" strokeWidth="2"/>
          <circle cx="60" cy="190" r="14" fill="#0F1117" stroke="#3B82F6" strokeWidth="2"/>
          <circle cx="140" cy="190" r="14" fill="#0F1117" stroke="#3B82F6" strokeWidth="2"/>
          {/* Vitres */}
          <rect x="73" y="103" width="24" height="25" rx="3" fill="#2D3748" opacity="0.7"/>
          <rect x="103" y="103" width="24" height="25" rx="3" fill="#2D3748" opacity="0.7"/>
          <rect x="73" y="133" width="24" height="22" rx="3" fill="#2D3748" opacity="0.7"/>
          <rect x="103" y="133" width="24" height="22" rx="3" fill="#2D3748" opacity="0.7"/>
          {/* Labels */}
          <text x="100" y="52" textAnchor="middle" fontSize="7" fill="#64748B">AVANT</text>
          <text x="100" y="235" textAnchor="middle" fontSize="7" fill="#64748B">ARRIÈRE</text>
          <text x="40" y="142" textAnchor="middle" fontSize="6" fill="#64748B" transform="rotate(-90,40,142)">GAUCHE</text>
          <text x="160" y="142" textAnchor="middle" fontSize="6" fill="#64748B" transform="rotate(90,160,142)">DROITE</text>
          {/* Zones de dommages */}
          {zones.map(z=>{
            const isDmg=damages.includes(z.id);
            const px=z.x/100*200-z.w/100*200/2;
            const py=z.y/100*280-z.h/100*280/2;
            const pw=z.w/100*200;
            const ph=z.h/100*280;
            return(
              <g key={z.id} onClick={()=>onToggle(z.id)} style={{cursor:"pointer"}}>
                <rect x={px} y={py} width={pw} height={ph} rx="3" fill={isDmg?"#EF4444":"transparent"} fillOpacity={isDmg?0.4:0} stroke={isDmg?"#EF4444":"transparent"} strokeWidth="1.5"/>
                {isDmg&&<text x={px+pw/2} y={py+ph/2+3} textAnchor="middle" fontSize="7" fill="#EF4444" fontWeight="bold">✕</text>}
              </g>
            );
          })}
        </svg>
      </div>
      {/* Légende des zones endommagées */}
      {damages.length>0&&(
        <div style={{marginTop:8,display:"flex",flexWrap:"wrap",gap:4}}>
          {damages.map(d=>{
            const zone=zones.find(z=>z.id===d);
            return zone?(<span key={d} style={{background:"#EF444420",border:"1px solid #EF444440",borderRadius:20,padding:"2px 8px",fontSize:10,color:"#EF4444",fontWeight:600}}>{zone.label}</span>):null;
          })}
        </div>
      )}
      <div style={{marginTop:6,fontSize:10,color:"#475569",fontStyle:"italic"}}>Appuyez sur une zone du véhicule pour noter un dommage</div>
    </div>
  );
}

function PhotoUpload({photos,onAdd,onRemove,label}){
  const handleFile=e=>{
    const files=Array.from(e.target.files);
    files.forEach(file=>{
      const reader=new FileReader();
      reader.onload=ev=>onAdd({url:ev.target.result,name:file.name,date:new Date().toLocaleTimeString("fr-FR")});
      reader.readAsDataURL(file);
    });
    e.target.value="";
  };
  return(
    <div>
      <div style={{fontSize:11,color:"#94A3B8",fontWeight:600,marginBottom:8}}>{label}</div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(80px,1fr))",gap:8,marginBottom:8}}>
        {photos.map((p,i)=>(
          <div key={i} style={{position:"relative",borderRadius:8,overflow:"hidden",aspectRatio:"1",background:"#0F1117"}}>
            <img src={p.url} alt={p.name} style={{width:"100%",height:"100%",objectFit:"cover"}}/>
            <button onClick={()=>onRemove(i)} style={{position:"absolute",top:2,right:2,background:"#EF4444",border:"none",color:"#fff",width:18,height:18,borderRadius:"50%",cursor:"pointer",fontSize:10,display:"flex",alignItems:"center",justifyContent:"center"}}>×</button>
          </div>
        ))}
        <label style={{borderRadius:8,border:"1.5px dashed #2D3748",aspectRatio:"1",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",cursor:"pointer",background:"#0F1117",gap:4}}>
          <span style={{fontSize:20,color:"#475569"}}>📷</span>
          <span style={{fontSize:9,color:"#475569"}}>Ajouter</span>
          <input type="file" accept="image/*" multiple onChange={handleFile} style={{display:"none"}}/>
        </label>
      </div>
    </div>
  );
}


function SignatureCanvas({label,value,onChange,color="#3B82F6"}){
  const canvasRef=useRef(null);
  const drawing=useRef(false);
  const lastPos=useRef(null);

  function getPos(e,canvas){
    const r=canvas.getBoundingClientRect();
    if(e.touches){
      return{x:(e.touches[0].clientX-r.left)*(canvas.width/r.width),y:(e.touches[0].clientY-r.top)*(canvas.height/r.height)};
    }
    return{x:(e.clientX-r.left)*(canvas.width/r.width),y:(e.clientY-r.top)*(canvas.height/r.height)};
  }

  function startDraw(e){
    e.preventDefault();
    const canvas=canvasRef.current;
    if(!canvas)return;
    drawing.current=true;
    lastPos.current=getPos(e,canvas);
  }

  function draw(e){
    e.preventDefault();
    if(!drawing.current)return;
    const canvas=canvasRef.current;
    if(!canvas)return;
    const ctx=canvas.getContext("2d");
    const pos=getPos(e,canvas);
    ctx.beginPath();
    ctx.moveTo(lastPos.current.x,lastPos.current.y);
    ctx.lineTo(pos.x,pos.y);
    ctx.strokeStyle=color;
    ctx.lineWidth=2.5;
    ctx.lineCap="round";
    ctx.lineJoin="round";
    ctx.stroke();
    lastPos.current=pos;
    onChange(canvas.toDataURL());
  }

  function endDraw(){
    drawing.current=false;
    lastPos.current=null;
  }

  function clear(){
    const canvas=canvasRef.current;
    if(!canvas)return;
    const ctx=canvas.getContext("2d");
    ctx.clearRect(0,0,canvas.width,canvas.height);
    onChange(null);
  }

  return(
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
        <div style={{fontSize:11,color:"#94A3B8",fontWeight:600}}>{label}</div>
        {value&&<button onClick={clear} style={{background:"#EF444420",border:"1px solid #EF444430",color:"#EF4444",padding:"3px 10px",borderRadius:6,cursor:"pointer",fontSize:10,fontWeight:600}}>✕ Effacer</button>}
      </div>
      <div style={{border:"1.5px solid "+(value?"#3B82F6":"#2D3748"),borderRadius:8,background:"#0F1117",overflow:"hidden",position:"relative"}}>
        <canvas
          ref={canvasRef}
          width={400} height={120}
          style={{display:"block",width:"100%",height:120,cursor:"crosshair",touchAction:"none"}}
          onMouseDown={startDraw} onMouseMove={draw} onMouseUp={endDraw} onMouseLeave={endDraw}
          onTouchStart={startDraw} onTouchMove={draw} onTouchEnd={endDraw}
        />
        {!value&&<div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",pointerEvents:"none"}}>
          <span style={{fontSize:12,color:"#334155",fontStyle:"italic"}}>✍️ Signez ici</span>
        </div>}
      </div>
    </div>
  );
}

function EdlSection({title,icon,data,onChange,mob,BG,S1,S2}){
  const toggleDamage=zone=>{
    const cur=data.damages||[];
    onChange({...data,damages:cur.includes(zone)?cur.filter(z=>z!==zone):[...cur,zone]});
  };
  return(
    <div style={{background:S1,border:"1px solid "+S2,borderRadius:14,padding:mob?14:20,display:"flex",flexDirection:"column",gap:16}}>
      <div style={{fontSize:14,fontWeight:700,color:"#F1F5F9",display:"flex",alignItems:"center",gap:8}}>
        <span style={{fontSize:18}}>{icon}</span>{title}
      </div>
      <div style={{display:"grid",gridTemplateColumns:mob?"1fr":"1fr 1fr",gap:16}}>
        <div>
          <GaugeSelector label="⛽ Niveau de carburant" value={data.fuel??2} onChange={v=>onChange({...data,fuel:v})} color="#F59E0B"/>
          <GaugeSelector label="✨ Propreté intérieure" value={data.cleanIn??4} onChange={v=>onChange({...data,cleanIn:v})} color="#10B981"/>
          <GaugeSelector label="🚗 Propreté extérieure" value={data.cleanOut??4} onChange={v=>onChange({...data,cleanOut:v})} color="#3B82F6"/>
          <div style={{marginTop:12}}>
            <div style={{fontSize:11,color:"#94A3B8",fontWeight:600,marginBottom:6}}>📊 Kilométrage</div>
            <input type="number" value={data.mileage||""} onChange={e=>onChange({...data,mileage:e.target.value})} placeholder="Ex: 48500" style={{width:"100%",background:"#0F1117",border:"1px solid #2D3748",color:"#E2E8F0",padding:"9px 12px",borderRadius:8,fontSize:14,fontWeight:600,outline:"none"}}/>
          </div>
          <div style={{marginTop:10}}>
            <div style={{fontSize:11,color:"#94A3B8",fontWeight:600,marginBottom:6}}>📝 Observations</div>
            <textarea value={data.notes||""} onChange={e=>onChange({...data,notes:e.target.value})} placeholder="Notes, remarques particulières..." rows={3} style={{width:"100%",background:"#0F1117",border:"1px solid #2D3748",color:"#E2E8F0",padding:"9px 12px",borderRadius:8,fontSize:12,outline:"none",resize:"vertical",fontFamily:"inherit"}}/>
          </div>
        </div>
        <div>
          <CarSchema damages={data.damages||[]} onToggle={toggleDamage} title="🗺 Schéma dommages (cliquez les zones)"/>
        </div>
      </div>
      <PhotoUpload photos={data.photos||[]} label="📷 Photos" onAdd={p=>onChange({...data,photos:[...(data.photos||[]),p]})} onRemove={i=>onChange({...data,photos:(data.photos||[]).filter((_,idx)=>idx!==i)})}/>
      <div style={{display:"grid",gridTemplateColumns:mob?"1fr":"1fr 1fr",gap:12,marginTop:8}}>
        <SignatureCanvas label="✍️ Signature du loueur" value={data.sigLoueur||null} onChange={v=>onChange({...data,sigLoueur:v})} color="#3B82F6"/>
        <SignatureCanvas label="✍️ Signature du locataire" value={data.sigLocataire||null} onChange={v=>onChange({...data,sigLocataire:v})} color="#10B981"/>
      </div>
    </div>
  );
}

// ── ÉCRAN DE CONNEXION ───────────────────────────────────────────────────
function LoginScreen({onLogin}){
  const[user,setUser]=useState("");
  const[pass,setPass]=useState("");
  const[err,setErr]=useState("");
  const[show,setShow]=useState(false);
  const mob=useIsMobile();
  const submit=e=>{
    e.preventDefault();
    if(user.trim()===APP_USER&&pass===APP_PASS){
      localStorage.setItem("ctl_auth","1");
      setErr("");
      onLogin();
    }else{
      setErr("Identifiant ou mot de passe incorrect");
    }
  };
  return(
    <div style={{minHeight:"100dvh",width:"100%",background:"#0F1117",display:"flex",alignItems:"center",justifyContent:"center",padding:16,fontFamily:"'Inter',system-ui,sans-serif"}}>
      <form onSubmit={submit} style={{width:"100%",maxWidth:380,background:"#161B27",border:"1px solid #1E2535",borderRadius:18,padding:mob?"28px 24px":"36px 32px",boxShadow:"0 20px 60px rgba(0,0,0,.5)"}}>
        <div style={{display:"flex",flexDirection:"column",alignItems:"center",marginBottom:26}}>
          <img src={LOGO} alt="" style={{width:56,height:56,objectFit:"contain",filter:"brightness(10)",marginBottom:12}}/>
          <div style={{fontWeight:800,fontSize:18,color:"#F1F5F9"}}>Chane-To Location</div>
          <div style={{fontSize:11,color:"#64748B",marginTop:2}}>Espace de gestion privé</div>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          <div>
            <label style={{fontSize:11,color:"#475569",fontWeight:600,display:"block",marginBottom:6}}>IDENTIFIANT</label>
            <input value={user} onChange={e=>setUser(e.target.value)} autoCapitalize="none" autoCorrect="off" placeholder="Votre identifiant" style={{width:"100%",boxSizing:"border-box",background:"#0F1117",border:"1px solid #2D3748",color:"#E2E8F0",padding:"11px 13px",borderRadius:9,fontSize:14,outline:"none"}}/>
          </div>
          <div>
            <label style={{fontSize:11,color:"#475569",fontWeight:600,display:"block",marginBottom:6}}>MOT DE PASSE</label>
            <div style={{position:"relative"}}>
              <input type={show?"text":"password"} value={pass} onChange={e=>setPass(e.target.value)} placeholder="Votre mot de passe" style={{width:"100%",boxSizing:"border-box",background:"#0F1117",border:"1px solid #2D3748",color:"#E2E8F0",padding:"11px 40px 11px 13px",borderRadius:9,fontSize:14,outline:"none"}}/>
              <button type="button" onClick={()=>setShow(s=>!s)} style={{position:"absolute",right:10,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",color:"#475569",cursor:"pointer",fontSize:15}}>{show?"🙈":"👁"}</button>
            </div>
          </div>
          {err&&<div style={{background:"#EF444415",border:"1px solid #EF444430",color:"#EF4444",borderRadius:8,padding:"9px 12px",fontSize:12,fontWeight:600}}>{err}</div>}
          <button type="submit" style={{width:"100%",background:"linear-gradient(135deg,#1a1a2e,#3B82F6)",border:"none",color:"#fff",padding:"13px",borderRadius:10,cursor:"pointer",fontWeight:800,fontSize:14,marginTop:6,boxShadow:"0 4px 20px rgba(59,130,246,.4)"}}>Se connecter</button>
        </div>
      </form>
    </div>
  );
}

function EdlPage({vehicles,bookings,mob,BG,S1,S2,S3,card,btnP,fd,fds,logExport}){
  const isPWA=()=>window.matchMedia("(display-mode: standalone)").matches||window.navigator.standalone===true;
  const openPDFBlob=(html,filename)=>{
    if(isPWA()){
      const blob=new Blob([html],{type:"text/html;charset=utf-8"});
      const url=URL.createObjectURL(blob);
      const a=document.createElement("a");
      a.href=url;a.target="_blank";a.rel="noopener noreferrer";
      document.body.appendChild(a);a.click();
      setTimeout(()=>{document.body.removeChild(a);URL.revokeObjectURL(url);},3000);
    } else {
      const w=window.open("","_blank","width=950,height=1100");
      if(!w)return;w.document.write(html);w.document.close();setTimeout(()=>w.print(),600);
    }
  };
  const[selBookingId,setSelBookingId]=useState(null);
  const[edlIn,setEdlIn]=useState({fuel:2,cleanIn:4,cleanOut:4,mileage:"",notes:"",damages:[],photos:[],sigLoueur:null,sigLocataire:null});
  const[edlOut,setEdlOut]=useState({fuel:2,cleanIn:4,cleanOut:4,mileage:"",notes:"",damages:[],photos:[],sigLoueur:null,sigLocataire:null});

  const selBooking=bookings.find(b=>b.id===selBookingId);
  const selVehicle=selBooking?vehicles.find(v=>v.id===selBooking.vehicleId):null;

  const FL=["Vide","1/4","1/2","3/4","Plein"];
  const CL=["Très sale","Sale","Moyen","Propre","Très propre"];

  const CSS="*{margin:0;padding:0;box-sizing:border-box;}body{font-family:Arial,sans-serif;font-size:10pt;}"+
    ".page{width:210mm;min-height:297mm;padding:13mm 15mm;margin:0 auto;}"+
    ".hd{border-bottom:3px solid #0F1117;padding-bottom:10px;margin-bottom:12px;}"+
    ".title{font-size:16pt;font-weight:900;color:#0F1117;}"+
    ".sub{font-size:8pt;color:#64748b;margin-top:4px;}"+
    ".g2{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:12px;}"+
    ".s{border:1px solid #d1d5db;border-radius:6px;overflow:hidden;margin-bottom:10px;}"+
    ".sh{background:#0F1117;color:white;padding:5px 10px;font-size:8pt;font-weight:700;}"+
    ".sb{padding:10px;}"+
    ".fr{display:flex;justify-content:space-between;border-bottom:1px solid #f3f4f6;padding:3px 0;}"+
    ".fr:last-child{border:none;}.fl{font-size:8pt;color:#6b7280;font-weight:600;}.fv{font-size:9pt;color:#111827;font-weight:600;}"+
    ".gauge{display:flex;gap:3px;margin-top:4px;}.gc{flex:1;height:16px;border-radius:3px;border:1px solid #d1d5db;}"+
    ".gf{background:#3B82F6;}.ge{background:#f3f4f6;}"+
    ".sig{border:1px solid #d1d5db;border-radius:5px;padding:10px;margin-top:10px;}"+
    ".sl{border-bottom:1px solid #374151;height:40px;margin-bottom:5px;}"+
    ".ft{font-size:7pt;color:#9ca3af;text-align:center;margin-top:10px;}"+
    ".dl{display:flex;flex-wrap:wrap;gap:4px;margin-top:6px;}"+
    ".dt{background:#fee2e2;border:1px solid #fca5a5;border-radius:10px;padding:2px 8px;font-size:8pt;color:#dc2626;}"+
    ".ph{display:grid;grid-template-columns:repeat(4,1fr);gap:6px;margin-top:8px;}"+
    ".pi{width:100%;aspect-ratio:1;object-fit:cover;border-radius:4px;border:1px solid #d1d5db;}"+
    "@media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact;}}";

  function buildGauge(val){
    return "<div class='gauge'>"+Array(5).fill(0).map((_,i)=>"<div class='gc "+(i<=val?"gf":"ge")+"'></div>").join("")+"</div>";
  }

  function buildPDF(title,dateLabel,dateVal,bk,v,data,dataIn){
    const dmgHTML=(data.damages||[]).length===0
      ?"<div style='color:#6b7280;font-size:9pt;'>Aucun dommage constaté</div>"
      :"<div class='dl'>"+data.damages.map(d=>"<span class='dt'>"+d+"</span>").join("")+"</div>";
    const notesHTML=data.notes?"<div class='s'><div class='sh'>📝 OBSERVATIONS</div><div class='sb'><div style='font-size:9pt;'>"+data.notes+"</div></div></div>":"";
    const photosHTML=(data.photos||[]).length>0
      ?"<div class='s'><div class='sh'>📷 PHOTOS</div><div class='sb'><div class='ph'>"+data.photos.map(p=>"<img class='pi' src='"+p.url+"' alt=''/>").join("")+"</div></div></div>"
      :"";
    const kmHTML=dataIn&&dataIn.mileage&&data.mileage
      ?"<div class='fr'><span class='fl'>Km parcourus</span><span class='fv'>"+(Number(data.mileage)-Number(dataIn.mileage))+" km</span></div>"
      :"";
    return "<!DOCTYPE html><html lang='fr'><head><meta charset='UTF-8'><title>"+title+" — "+bk.client+"</title>"+
      "<style>"+CSS+"</style></head><body>"+
      "<div class='page'>"+
      "<div class='hd'><div class='title'>"+title+"</div>"+
      "<div class='sub'>CHANE-TO LOCATION · 0693 01 00 94 · chanetolocation@gmail.com</div></div>"+
      "<div class='g2'>"+
      "<div class='s'><div class='sh'>🚗 VÉHICULE</div><div class='sb'>"+
      "<div class='fr'><span class='fl'>Désignation</span><span class='fv'>"+v.name+"</span></div>"+
      "<div class='fr'><span class='fl'>Immatriculation</span><span class='fv'>"+v.plate+"</span></div>"+
      "<div class='fr'><span class='fl'>Kilométrage</span><span class='fv'>"+(data.mileage||"—")+" km</span></div>"+
      kmHTML+
      "</div></div>"+
      "<div class='s'><div class='sh'>👤 LOCATAIRE</div><div class='sb'>"+
      "<div class='fr'><span class='fl'>Nom</span><span class='fv'>"+bk.client+"</span></div>"+
      "<div class='fr'><span class='fl'>Téléphone</span><span class='fv'>"+(bk.phone||"—")+"</span></div>"+
      "<div class='fr'><span class='fl'>"+dateLabel+"</span><span class='fv'>"+dateVal+"</span></div>"+
      "</div></div></div>"+
      "<div class='s'><div class='sh'>📊 NIVEAUX & PROPRETÉ</div><div class='sb'>"+
      "<div class='fr'><span class='fl'>Carburant</span><span class='fv'>"+FL[data.fuel??2]+"</span></div>"+
      buildGauge(data.fuel??2)+
      "<div class='fr' style='margin-top:6px;'><span class='fl'>Propreté intérieure</span><span class='fv'>"+CL[data.cleanIn??4]+"</span></div>"+
      "<div class='fr'><span class='fl'>Propreté extérieure</span><span class='fv'>"+CL[data.cleanOut??4]+"</span></div>"+
      "</div></div>"+
      "<div class='s'><div class='sh'>🗺 DOMMAGES CONSTATÉS</div><div class='sb'>"+dmgHTML+"</div></div>"+
      notesHTML+photosHTML+
      "<div class='g2'>"+
      "<div class='sig'><div style='font-size:8pt;font-weight:700;margin-bottom:5px;'>SIGNATURE LOUEUR</div>"+(data.sigLoueur?"<img src='"+data.sigLoueur+"' style='max-height:60px;display:block;margin:4px 0;'/>":"<div class='sl'></div>")+"<div style='font-size:7pt;color:#6b7280;'>CHANE-TO LOCATION</div></div>"+
      "<div class='sig'><div style='font-size:8pt;font-weight:700;margin-bottom:5px;'>SIGNATURE LOCATAIRE</div>"+(data.sigLocataire?"<img src='"+data.sigLocataire+"' style='max-height:60px;display:block;margin:4px 0;'/>":"<div class='sl'></div>")+"<div style='font-size:7pt;color:#6b7280;'>"+bk.client+" — Lu et approuvé</div></div>"+
      "</div>"+
      "<div class='ft'>CHANE-TO LOCATION · "+title+" · "+bk.client+" · "+dateVal+"</div>"+
      "</div></body></html>";
  }

  async function printIn(){
    if(!selBooking||!selVehicle)return;
    const html=buildPDF("ÉTAT DES LIEUX — À LA RÉCUPÉRATION","Début location",fd(selBooking.start),selBooking,selVehicle,edlIn,null);
    if(logExport)await logExport("edl_in",selBooking,selVehicle,html);
    openPDFBlob(html,"EDL_Recuperation_"+selBooking.client.replace(/ /g,"_")+".html");
  }

  async function printOut(){
    if(!selBooking||!selVehicle)return;
    const html=buildPDF("ÉTAT DES LIEUX — À LA DÉPOSE","Fin location",fd(selBooking.end),selBooking,selVehicle,edlOut,edlIn);
    if(logExport)await logExport("edl_out",selBooking,selVehicle,html);
    openPDFBlob(html,"EDL_Depose_"+selBooking.client.replace(/ /g,"_")+".html");
  }

  return(
    <div>
      <div style={{marginBottom:16}}>
        <div style={{fontSize:mob?18:22,fontWeight:700,color:"#F1F5F9"}}>🔍 État des lieux</div>
        <div style={{fontSize:12,color:"#475569",marginTop:2}}>Récupération et dépose du véhicule</div>
      </div>

      {/* Sélection réservation */}
      <div style={{background:S1,border:"1px solid "+S2,borderRadius:14,padding:mob?14:18,marginBottom:16}}>
        <div style={{fontSize:13,fontWeight:700,color:"#F1F5F9",marginBottom:12}}>📋 Sélectionner une réservation</div>
        {bookings.length===0
          ?<div style={{color:"#475569",fontSize:12,textAlign:"center",padding:"16px 0"}}>Aucune réservation</div>
          :<div style={{display:"flex",flexDirection:"column",gap:7,maxHeight:220,overflowY:"auto"}}>
            {[...bookings].sort((a,b)=>new Date(b.start)-new Date(a.start)).map(b=>{
              const vv=vehicles.find(v=>v.id===b.vehicleId),isSel=selBookingId===b.id;
              return(
                <div key={b.id} onClick={()=>{setSelBookingId(b.id);setEdlIn({fuel:2,cleanIn:4,cleanOut:4,mileage:vv?.mileage||"",notes:"",damages:[],photos:[]});setEdlOut({fuel:2,cleanIn:4,cleanOut:4,mileage:"",notes:"",damages:[],photos:[]});}}
                  style={{background:isSel?"#3B82F620":BG,border:"1.5px solid "+(isSel?"#3B82F6":S2),borderRadius:9,padding:"9px 11px",cursor:"pointer"}}>
                  <div style={{fontSize:12,fontWeight:700,color:"#F1F5F9"}}>{b.client}</div>
                  <div style={{fontSize:10,color:"#64748B",marginTop:1,display:"flex",alignItems:"center",gap:6}}>
                    <span style={{width:6,height:6,borderRadius:"50%",background:vv?.color||"#475569",display:"inline-block",flexShrink:0}}/>
                    {vv?.name||"?"} · {vv?.plate||"?"}
                  </div>
                  <div style={{fontSize:10,color:"#475569",marginTop:1}}>📅 {fd(b.start)} → {fd(b.end)}</div>
                  {isSel&&<div style={{fontSize:10,color:"#3B82F6",fontWeight:600,marginTop:4}}>✓ Sélectionné</div>}
                </div>
              );
            })}
          </div>
        }
      </div>

      {selBooking&&selVehicle&&(<>
        {/* Bandeau véhicule */}
        <div style={{background:"linear-gradient(135deg,"+selVehicle.color+"15,"+selVehicle.color+"05)",border:"1.5px solid "+selVehicle.color+"40",borderRadius:12,padding:"12px 16px",marginBottom:20,display:"flex",alignItems:"center",gap:12}}>
          <div style={{width:44,height:44,borderRadius:10,background:selVehicle.color+"30",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>🚗</div>
          <div>
            <div style={{fontWeight:700,fontSize:14,color:"#F1F5F9"}}>{selVehicle.name} · {selVehicle.plate}</div>
            <div style={{fontSize:11,color:"#475569"}}>{selBooking.client} · {fd(selBooking.start)} → {fd(selBooking.end)}</div>
          </div>
        </div>

        {/* ── PARTIE 1 : RÉCUPÉRATION ── */}
        <div style={{background:"#10B98108",border:"2px solid #10B98140",borderRadius:14,padding:mob?14:20,marginBottom:20}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16,flexWrap:"wrap",gap:8}}>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <div style={{width:10,height:10,borderRadius:"50%",background:"#10B981"}}/>
              <div style={{fontSize:15,fontWeight:800,color:"#10B981"}}>À LA RÉCUPÉRATION</div>
              <div style={{fontSize:11,color:"#64748B"}}>Début — {fd(selBooking.start)}</div>
            </div>
            <button onClick={printIn} style={{background:"linear-gradient(135deg,#10B981,#059669)",border:"none",color:"#fff",padding:"8px 16px",borderRadius:9,cursor:"pointer",fontWeight:700,fontSize:12,display:"flex",alignItems:"center",gap:6}}>
              <span>📥</span> PDF Récupération
            </button>
          </div>
          <EdlSection title="" icon="" data={edlIn} onChange={setEdlIn} mob={mob} BG={BG} S1={S1} S2={S2}/>
        </div>

        {/* ── PARTIE 2 : DÉPOSE ── */}
        <div style={{background:"#EF444408",border:"2px solid #EF444440",borderRadius:14,padding:mob?14:20,marginBottom:16}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16,flexWrap:"wrap",gap:8}}>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <div style={{width:10,height:10,borderRadius:"50%",background:"#EF4444"}}/>
              <div style={{fontSize:15,fontWeight:800,color:"#EF4444"}}>À LA DÉPOSE</div>
              <div style={{fontSize:11,color:"#64748B"}}>Fin — {fd(selBooking.end)}</div>
            </div>
            <button onClick={printOut} style={{background:"linear-gradient(135deg,#EF4444,#DC2626)",border:"none",color:"#fff",padding:"8px 16px",borderRadius:9,cursor:"pointer",fontWeight:700,fontSize:12,display:"flex",alignItems:"center",gap:6}}>
              <span>📥</span> PDF Dépose
            </button>
          </div>
          <EdlSection title="" icon="" data={edlOut} onChange={setEdlOut} mob={mob} BG={BG} S1={S1} S2={S2}/>
        </div>

        {/* Récap comparatif */}
        {edlIn.mileage&&edlOut.mileage&&(
          <div style={{background:S1,border:"1px solid "+S2,borderRadius:12,padding:"14px 16px"}}>
            <div style={{fontSize:12,fontWeight:700,color:"#F1F5F9",marginBottom:10}}>📊 Comparatif récupération / dépose</div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10}}>
              <div style={{background:BG,borderRadius:8,padding:"10px",textAlign:"center"}}>
                <div style={{fontSize:10,color:"#64748B",marginBottom:3}}>KM PARCOURUS</div>
                <div style={{fontSize:18,fontWeight:800,color:"#F59E0B"}}>{Number(edlOut.mileage)-Number(edlIn.mileage)} km</div>
              </div>
              <div style={{background:BG,borderRadius:8,padding:"10px",textAlign:"center"}}>
                <div style={{fontSize:10,color:"#64748B",marginBottom:3}}>CARBURANT</div>
                <div style={{fontSize:13,fontWeight:700,color:edlOut.fuel>=(edlIn.fuel??2)?"#10B981":"#EF4444"}}>{FL[edlIn.fuel??2]} → {FL[edlOut.fuel??2]}</div>
              </div>
              <div style={{background:BG,borderRadius:8,padding:"10px",textAlign:"center"}}>
                <div style={{fontSize:10,color:"#64748B",marginBottom:3}}>DOMMAGES</div>
                <div style={{fontSize:18,fontWeight:800,color:(edlOut.damages||[]).length>0?"#EF4444":"#10B981"}}>{(edlOut.damages||[]).length} zone{(edlOut.damages||[]).length>1?"s":""}</div>
              </div>
            </div>
          </div>
        )}
      </>)}
    </div>
  );
}


function MainApp(){
  const today=(()=>{const d=new Date();return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0");})();
  const TY=new Date().getFullYear(),TM=new Date().getMonth();
  const mob=useIsMobile();
  const BG="#0F1117",S1="#161B27",S2="#1E2535",S3="#2D3748";
  const HH=mob?54:64;
  const HEADER_H=mob?`calc(${HH}px + env(safe-area-inset-top, 0px))`:HH+"px";

  const[vehicles,setVehicles]=useState([]);
  const[clients,setClients]=useState([]);
  const[exportsLog,setExportsLog]=useState([]);
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
  const[logoMenu,setLogoMenu]=useState(false);
  const[selClient,setSelClient]=useState(null);
  const[clientSuggest,setClientSuggest]=useState(false);
  const[clientSort,setClientSort]=useState("az");
  const[docSort,setDocSort]=useState("desc");
  const[dcClient,setDcClient]=useState(null);
  const[dcExport,setDcExport]=useState(null);
  const[clientForm,setClientForm]=useState({phone:"",email:"",address:"",licenseNum:"",licenseDate:"",idNum:""});

  const[tYear,setTYear]=useState(TY);
  const[tMonth,setTMonth]=useState(TM);
  const[tFilter,setTFilter]=useState("month");
  const[evf,setEvf]=useState("all");
  const[ps,setPs]=useState(today);
  const[pe,setPe]=useState(ad(today,1));
  const[spf,setSpf]=useState(false);
  const[statusFilter,setStatusFilter]=useState("all"); // "all"|"loue"|"dispo"
  const[cbid,setCbid]=useState(null);
  const[cco,setCco]=useState({...CO});
  const[cex,setCex]=useState({email:"",address:"",licenseNum:"",deposit:0,extraFees:0,extraFeesNote:"",sigLoueur:null,sigLocataire:null});

  const loadAll=useCallback(async()=>{
    setLoading(true);
    try{
      const[vR,bR,eR]=await Promise.all([dbGet("vehicles"),dbGet("bookings"),dbGet("expenses")]);
      setVehicles((vR||[]).map(mv));
      setBookings((bR||[]).map(mb));
      setExpenses((eR||[]).map(me));
      try{const cR=await dbGet("clients");setClients((cR||[]).map(mc));}catch(e){setClients([]);}
      try{const xR=await dbGet("document_exports");setExportsLog((xR||[]).map(mx));}catch(e){setExportsLog([]);}
    }catch(e){showT("Erreur de connexion","error");}
    setLoading(false);
  },[]);
  useEffect(()=>{loadAll();},[loadAll]);

  const showT=(msg,type="success")=>{setToast({msg,type});setTimeout(()=>setToast(null),3000);};
  const gbod=(vid,date)=>bookings.find(b=>b.vehicleId===vid&&dir(date,b.start,b.end));

  const openDetail=(vid,date)=>{
    const bk=gbod(vid,date);
    if(bk){setModal({type:"detail",vehicleId:vid,booking:bk,date});}
    else{setForm({vehicleId:vid,start:spf?ps:date,end:spf?pe:date,client:"",phone:"",email:"",address:"",licenseNum:"",rate:"",deposit:"",notes:"",pickupLocation:"agence",dropLocation:"agence"});setModal({type:"add",vehicleId:vid,date});}
  };
  const openEdit=bk=>{setForm({...bk});setModal({type:"edit",booking:bk});};
  const saveBk=async()=>{
    if(!form.client||!form.start||!form.end||!form.rate)return;
    if(pd(form.end)<pd(form.start))return;
    setSyncing(true);
    const p={vehicle_id:Number(form.vehicleId),client:form.client,phone:form.phone||"",email:form.email||"",address:form.address||"",license_num:form.licenseNum||"",license_date:form.licenseDate||null,id_num:form.idNum||"",start_date:form.start,end_date:form.end,rate:Number(form.rate),deposit:Number(form.deposit)||0,notes:form.notes||"",extra_fees:Number(form.extraFees)||0,extra_fees_note:form.extraFeesNote||"",days:form.days?Number(form.days):null};
    try{
      if(modal.type==="add"||modal.type==="add-g"){
        const res=await dbIns("bookings",p);
        if(!Array.isArray(res))throw new Error(res?.message||"Réponse invalide du serveur");
        const r=res[0];
        setBookings(prev=>[...prev,mb(r)]);showT("Réservation ajoutée ✓");
      }
      else{
        const res=await dbUpd("bookings",form.id,p);
        if(Array.isArray(res)&&res[0]){setBookings(prev=>prev.map(b=>b.id===form.id?mb(res[0]):b));}
        else{setBookings(prev=>prev.map(b=>b.id===form.id?mb({...p,id:form.id}):b));}
        showT("Réservation modifiée ✓");
      }
      upsertClient(form.client,{phone:form.phone,email:form.email,address:form.address,licenseNum:form.licenseNum,licenseDate:form.licenseDate,idNum:form.idNum});
    }catch(e){showT("Erreur : "+String(e?.message||e),"error");}
    setSyncing(false);setModal(null);
  };
  const delBk=async id=>{setSyncing(true);await dbDel("bookings",id);setBookings(prev=>prev.filter(b=>b.id!==id));setModal(null);setDc(null);showT("Supprimée","info");setSyncing(false);};

  const openAddV=()=>{setForm({name:"",plate:"",type:"Berline",color:VC[Math.floor(Math.random()*VC.length)],year:"",fuel:"Essence"});setModal({type:"add-v"});};
  const openEditV=v=>{setForm({...v});setModal({type:"edit-v"});};
  const saveV=async()=>{
    if(!form.name||!form.plate||!form.type)return;
    setSyncing(true);
    const p={name:form.name,plate:form.plate,type:form.type,color:form.color,year:form.year||"",fuel:form.fuel||"Essence"};
    try{
      if(modal.type==="add-v"){
        const res=await dbIns("vehicles",p);
        if(!Array.isArray(res))throw new Error(res?.message||"Réponse invalide du serveur");
        const r=res[0];
        setVehicles(prev=>[...prev,mv(r)]);showT("Véhicule ajouté ✓");
      }
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
      if(modal.type==="add-e"){
        const res=await dbIns("expenses",p);
        if(!Array.isArray(res))throw new Error(res?.message||"Réponse invalide du serveur");
        const r=res[0];
        setExpenses(prev=>[...prev,me(r)]);showT("Dépense ajoutée ✓");
      }
      else{await dbUpd("expenses",form.id,p);setExpenses(prev=>prev.map(e=>e.id===form.id?me({...p,id:form.id}):e));showT("Modifiée ✓");}
    }catch(e){showT("Erreur","error");}
    setSyncing(false);setModal(null);
  };
  const delE=async id=>{setSyncing(true);await dbDel("expenses",id);setExpenses(prev=>prev.filter(e=>e.id!==id));setModal(null);showT("Supprimée","info");setSyncing(false);};
  const openNewR=()=>{setForm({vehicleId:vehicles[0]?.id||"",start:spf?ps:today,end:spf?pe:ad(today,1),client:"",phone:"",email:"",address:"",licenseNum:"",rate:"",deposit:"",notes:"",pickupLocation:"agence",dropLocation:"agence"});setModal({type:"add-g"});};
  const isPWA=()=>window.matchMedia("(display-mode: standalone)").matches||window.navigator.standalone===true;
  const openPDF=(html,filename)=>{
    if(isPWA()){
      // Sur app iPhone : télécharger en blob et ouvrir dans Safari
      const blob=new Blob([html],{type:"text/html;charset=utf-8"});
      const url=URL.createObjectURL(blob);
      const a=document.createElement("a");
      a.href=url;a.target="_blank";a.rel="noopener noreferrer";
      document.body.appendChild(a);a.click();
      setTimeout(()=>{document.body.removeChild(a);URL.revokeObjectURL(url);},3000);
    } else {
      // Sur navigateur : popup classique
      const w=window.open("","_blank","width=950,height=1100");
      if(!w)return;w.document.write(html);w.document.close();setTimeout(()=>w.print(),600);
    }
  };
  const upsertClient=async(name,info)=>{
    try{
      const existing=clients.find(c=>c.name.toLowerCase()===name.toLowerCase());
      const payload={name,phone:info.phone||"",email:info.email||"",address:info.address||"",license_num:info.licenseNum||"",license_date:info.licenseDate||null,id_num:info.idNum||""};
      if(existing){await dbUpd("clients",existing.id,payload);setClients(prev=>prev.map(c=>c.id===existing.id?{...c,...mc({...payload,id:existing.id})}:c));}
      else{
        const res=await dbIns("clients",payload);
        if(Array.isArray(res)&&res[0])setClients(prev=>[...prev,mc(res[0])]);
      }
    }catch(e){/* table clients absente ou erreur silencieuse */}
  };
  const logExport=async(type,b,v,html)=>{
    try{
      const payload={type,client:b.client,vehicle_name:v?.name||"",vehicle_plate:v?.plate||"",date_start:b.start,date_end:b.end,booking_id:b.id,html_content:html||""};
      const res=await dbIns("document_exports",payload);
      if(Array.isArray(res)&&res[0])setExportsLog(prev=>[mx(res[0]),...prev]);
    }catch(e){/* table document_exports absente ou erreur silencieuse */}
  };
  const deleteExport=async id=>{
    try{await dbDel("document_exports",id);setExportsLog(prev=>prev.filter(x=>x.id!==id));showT("Export supprimé","info");}catch(e){showT("Erreur","error");}
  };
  const deleteClient=async id=>{
    try{await dbDel("clients",id);setClients(prev=>prev.filter(c=>c.id!==id));showT("Client supprimé","info");}catch(e){showT("Erreur","error");}
  };
  const viewExport=html=>{
    if(!html)return;
    if(isPWA()){
      const blob=new Blob([html],{type:"text/html;charset=utf-8"});
      const url=URL.createObjectURL(blob);
      const a=document.createElement("a");
      a.href=url;a.target="_blank";a.rel="noopener noreferrer";
      document.body.appendChild(a);a.click();
      setTimeout(()=>{document.body.removeChild(a);URL.revokeObjectURL(url);},3000);
    }else{
      const w=window.open("","_blank","width=950,height=1100");
      if(!w)return;w.document.write(html);w.document.close();
    }
  };
  const exportPDF=async(b,v)=>{
    const bm={...b,...cex};
    const html=cHTML(bm,v,cco);
    const cn="Contrat_CTR-"+new Date().getFullYear()+"-"+String(b.id).padStart(4,"0")+"_"+b.client.replace(/\s+/g,"_")+".html";
    await upsertClient(b.client,{phone:bm.phone,email:bm.email,address:bm.address,licenseNum:bm.licenseNum});
    await logExport("contract",b,v,html);
    openPDF(html,cn);
  };


  const aip=useMemo(()=>{if(!spf||!ps||!pe)return vehicles;return vehicles.filter(v=>avail(v.id,ps,pe,bookings,undefined));},[vehicles,bookings,spf,ps,pe]);

  // Liste des clients dérivée des réservations (déduplication par nom, infos les plus récentes, ordre alphabétique)
  const clientsList=useMemo(()=>{
    const map={};
    [...bookings].sort((a,b)=>pd(a.start)-pd(b.start)).forEach(b=>{
      map[b.client]={name:b.client,phone:b.phone||"",email:b.email||"",address:b.address||"",licenseNum:b.licenseNum||"",licenseDate:b.licenseDate||"",idNum:b.idNum||"",bookingsCount:(map[b.client]?.bookingsCount||0)+1,lastBooking:b.start};
    });
    // Les infos enregistrées manuellement dans la fiche client (table clients) priment sur celles dérivées des réservations
    clients.forEach(c=>{
      if(map[c.name]){map[c.name]={...map[c.name],phone:c.phone||map[c.name].phone,email:c.email||map[c.name].email,address:c.address||map[c.name].address,licenseNum:c.licenseNum||map[c.name].licenseNum,licenseDate:c.licenseDate||map[c.name].licenseDate,idNum:c.idNum||map[c.name].idNum};}
      else{map[c.name]={name:c.name,phone:c.phone,email:c.email,address:c.address,licenseNum:c.licenseNum,licenseDate:c.licenseDate,idNum:c.idNum,bookingsCount:0};}
    });
    return Object.values(map).sort((a,b)=>a.name.localeCompare(b.name,"fr"));
  },[bookings,clients]);
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
  const pg={padding:mob?"12px 14px 88px":"20px 32px 40px",maxWidth:mob?undefined:1240,margin:mob?undefined:"0 auto",paddingTop:mob?16:20};

  const TABS=[{id:"calendar",icon:"📅",label:"Calendrier"},{id:"fleet",icon:"🚗",label:"Flotte"},{id:"treasury",icon:"💰",label:"Trésorerie"},{id:"contracts",icon:"📄",label:"Contrats"},{id:"edl",icon:"🔍",label:"État des lieux"}];

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
      <style>{"@keyframes spin{to{transform:rotate(360deg)}}input[type='date']::-webkit-calendar-picker-indicator{filter:invert(.5);cursor:pointer;}input[type='date']{text-align:left;}input[type='date']::-webkit-date-and-time-value{text-align:left;}*{box-sizing:border-box;}"}</style>


      {/* TOASTS */}
      {toast&&<div style={{position:"fixed",top:mob?8:16,right:mob?8:16,zIndex:3000,background:toast.type==="success"?"#10B981":toast.type==="error"?"#EF4444":"#64748B",color:"#fff",padding:"9px 14px",borderRadius:9,fontWeight:600,fontSize:13,boxShadow:"0 4px 20px rgba(0,0,0,.5)"}}>{toast.msg}</div>}
      {syncing&&<div style={{position:"fixed",top:mob?8:16,left:"50%",transform:"translateX(-50%)",zIndex:3000,background:S1,border:"1px solid "+S3,color:"#94A3B8",padding:"5px 14px",borderRadius:20,fontSize:11,display:"flex",alignItems:"center",gap:6}}><div style={{width:11,height:11,border:"2px solid "+S2,borderTopColor:"#3B82F6",borderRadius:"50%",animation:"spin .8s linear infinite"}}/>Sync…</div>}

      {/* HEADER FIXE */}
      <header style={{background:S1,borderBottom:"1px solid "+S2,padding:mob?"0 12px":"0 32px",position:"fixed",top:0,left:0,right:0,zIndex:200,paddingTop:mob?"env(safe-area-inset-top,0px)":0,height:mob?"calc("+HH+"px + env(safe-area-inset-top, 0px))":HH}}>
        <div style={{maxWidth:1240,margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"space-between",height:HH,gap:8}}>
          <div style={{position:"relative"}}>
            <div onClick={()=>setLogoMenu(p=>!p)} style={{display:"flex",alignItems:"center",gap:mob?8:10,flexShrink:0,cursor:"pointer"}}>
              <img src={LOGO} alt="" style={{width:mob?34:42,height:mob?34:42,objectFit:"contain",filter:"brightness(10)"}}/>
              {!mob&&<div><div style={{fontWeight:800,fontSize:15,color:"#F1F5F9"}}>Chane-To Location</div><div style={{fontSize:10,color:"#64748B"}}>Gestion de flotte · 0693 01 00 94</div></div>}
              <span style={{fontSize:10,color:"#64748B",marginLeft:2,transform:logoMenu?"rotate(180deg)":"none",transition:"transform .2s"}}>▾</span>
            </div>
            {logoMenu&&<>
              <div onClick={()=>setLogoMenu(false)} style={{position:"fixed",inset:0,zIndex:299}}/>
              <div style={{position:"absolute",top:"calc(100% + 8px)",left:0,background:S1,border:"1px solid "+S2,borderRadius:12,boxShadow:"0 8px 30px rgba(0,0,0,.5)",zIndex:300,minWidth:200,overflow:"hidden"}}>
                {[
                  {id:"clients",icon:"👥",label:"Clients",count:clientsList.length},
                  {id:"contractsDB",icon:"📄",label:"Contrats",count:bookings.length},
                  {id:"edlDB",icon:"🔍",label:"États des lieux",count:bookings.length},
                ].map(item=>(
                  <button key={item.id} onClick={()=>{setPage(item.id);setLogoMenu(false);}} style={{width:"100%",background:page===item.id?S2:"transparent",border:"none",borderBottom:"1px solid "+S2,color:"#E2E8F0",padding:"11px 14px",cursor:"pointer",display:"flex",alignItems:"center",gap:10,fontSize:13,fontWeight:600,textAlign:"left"}}>
                    <span style={{fontSize:16}}>{item.icon}</span>
                    <span style={{flex:1}}>{item.label}</span>
                    <span style={{fontSize:10,color:"#475569",background:BG,padding:"2px 7px",borderRadius:10}}>{item.count}</span>
                  </button>
                ))}
                <button onClick={()=>{localStorage.removeItem("ctl_auth");window.location.reload();}} style={{width:"100%",background:"transparent",border:"none",color:"#EF4444",padding:"11px 14px",cursor:"pointer",display:"flex",alignItems:"center",gap:10,fontSize:13,fontWeight:600,textAlign:"left"}}>
                  <span style={{fontSize:16}}>🚪</span>
                  <span style={{flex:1}}>Se déconnecter</span>
                </button>
              </div>
            </>}
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

      {/* SPACER — pousse le contenu sous le header fixe */}
      <div style={{height:mob?"calc("+HH+"px + env(safe-area-inset-top, 0px))":HH}}/>

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
          <button onClick={()=>setSelDate(ad(selDate,vm==="week"?-7:-1))} style={{background:S2,border:"none",color:"#E2E8F0",width:36,height:36,borderRadius:8,cursor:"pointer",fontSize:20,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>‹</button>
          <input type="date" value={selDate} onChange={e=>setSelDate(e.target.value)} style={{background:S2,border:"1px solid "+S3,color:"#E2E8F0",padding:"7px 12px",borderRadius:8,fontSize:14,fontWeight:600,cursor:"pointer",flexShrink:0}}/>
          <button onClick={()=>setSelDate(ad(selDate,vm==="week"?7:1))} style={{background:S2,border:"none",color:"#E2E8F0",width:36,height:36,borderRadius:8,cursor:"pointer",fontSize:20,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>›</button>
          <button onClick={()=>setSelDate(today)} style={{background:selDate===today?"linear-gradient(135deg,#1a1a2e,#3B82F6)":S2,border:"none",color:"#fff",padding:"7px 14px",borderRadius:8,cursor:"pointer",fontSize:13,fontWeight:600,flexShrink:0}}>Aujourd'hui</button>
          <button onClick={openNewR} style={{background:"linear-gradient(135deg,#10B981,#3B82F6)",border:"none",color:"#fff",padding:"8px 14px",borderRadius:8,cursor:"pointer",fontSize:13,fontWeight:700,flexShrink:0}}>＋ Nouvelle réservation</button>
          <div style={{marginLeft:"auto",display:"flex",gap:3,background:S2,borderRadius:10,padding:4,flexShrink:0}}>
            <button onClick={()=>{setVm("day");setStatusFilter("all");}} style={{background:vm==="day"?"linear-gradient(135deg,#1a1a2e,#3B82F6)":"transparent",border:"none",color:vm==="day"?"#fff":"#94A3B8",padding:"7px 20px",borderRadius:7,cursor:"pointer",fontSize:13,fontWeight:700}}>📅 Jour</button>
            <button onClick={()=>setVm("week")} style={{background:vm==="week"?"linear-gradient(135deg,#1a1a2e,#3B82F6)":"transparent",border:"none",color:vm==="week"?"#fff":"#94A3B8",padding:"7px 20px",borderRadius:7,cursor:"pointer",fontSize:13,fontWeight:700}}>📆 Semaine</button>
          </div>
        </div>}

        {/* CONTROLES MOBILE */}
        {mob&&<div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:14}}>
          {/* Ligne 1 : navigation date */}
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <button onClick={()=>setSelDate(ad(selDate,vm==="week"?-7:-1))} style={{background:S2,border:"none",color:"#E2E8F0",width:44,height:44,borderRadius:10,cursor:"pointer",fontSize:22,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>‹</button>
            <input type="date" value={selDate} onChange={e=>setSelDate(e.target.value)} style={{flex:1,background:S2,border:"1px solid "+S3,color:"#E2E8F0",padding:"11px 12px",borderRadius:10,fontSize:15,fontWeight:700,cursor:"pointer",textAlign:"center"}}/>
            <button onClick={()=>setSelDate(ad(selDate,vm==="week"?7:1))} style={{background:S2,border:"none",color:"#E2E8F0",width:44,height:44,borderRadius:10,cursor:"pointer",fontSize:22,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>›</button>
          </div>
          {/* Ligne 2 : Aujourd'hui + Nouvelle réservation */}
          <div style={{display:"flex",gap:8}}>
            <button onClick={()=>setSelDate(today)} style={{flex:1,background:selDate===today?"linear-gradient(135deg,#1a1a2e,#3B82F6)":S2,border:"none",color:"#fff",padding:"12px 0",borderRadius:10,cursor:"pointer",fontSize:14,fontWeight:700,textAlign:"center"}}>Aujourd'hui</button>
            <button onClick={openNewR} style={{flex:2,background:"linear-gradient(135deg,#10B981,#3B82F6)",border:"none",color:"#fff",padding:"12px 0",borderRadius:10,cursor:"pointer",fontSize:14,fontWeight:700,textAlign:"center"}}>＋ Nouvelle réservation</button>
          </div>
          {/* Ligne 3 : Jour / Semaine */}
          <div style={{display:"flex",gap:0,background:S2,borderRadius:10,padding:4}}>
            <button onClick={()=>{setVm("day");setStatusFilter("all");}} style={{flex:1,background:vm==="day"?"linear-gradient(135deg,#1a1a2e,#3B82F6)":"transparent",border:"none",color:vm==="day"?"#fff":"#64748B",padding:"10px 0",borderRadius:8,cursor:"pointer",fontSize:14,fontWeight:700}}>📅 Jour</button>
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
          {si.map((s,i)=>{
            const filterKey=!spf&&vm==="day"?(i===0?"dispo":i===1?"loue":null):null;
            const isActive=filterKey&&statusFilter===filterKey;
            return(
              <div key={s.l} onClick={()=>{if(filterKey)setStatusFilter(statusFilter===filterKey?"all":filterKey);}}
                style={{background:isActive?s.c+"25":s.bg,border:"2px solid "+(isActive?s.c:s.c+"30"),borderRadius:10,padding:mob?"10px 8px":"12px 14px",textAlign:"center",cursor:filterKey?"pointer":"default",transition:"all .15s",userSelect:"none"}}>
                <div style={{fontSize:mob?18:22,fontWeight:700,color:s.c,lineHeight:1}}>{s.v}</div>
                <div style={{fontSize:mob?9:11,color:"#64748B",marginTop:3,lineHeight:1.2}}>{s.l}</div>
                {filterKey&&<div style={{fontSize:8,color:s.c,fontWeight:700,marginTop:3,opacity:isActive?1:.6}}>{isActive?"✓ Actif":"Filtrer"}</div>}
              </div>
            );
          })}
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
            {[...vehicles]
              .sort((a,b)=>{const aB=!!gbod(a.id,selDate),bB=!!gbod(b.id,selDate);return aB===bB?0:aB?-1:1;})
              .filter(v=>statusFilter==="all"||( statusFilter==="loue"&&!!gbod(v.id,selDate))||(statusFilter==="dispo"&&!gbod(v.id,selDate)))
              .map(vehicle=>{
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
                        <span style={{fontSize:9,color:"#475569",background:S2,padding:"2px 6px",borderRadius:10}}>{bk.days||gdb(bk.start,bk.end)}j · {bk.rate*(bk.days||gdb(bk.start,bk.end))} €</span>
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
              <div style={{fontSize:11,fontWeight:700,color:"#F1F5F9",marginBottom:12}}>🏢 Ma société</div>
              <div style={{display:"flex",flexDirection:"column",gap:0}}>
                {[
                  {l:"Nom",v:CO.name},
                  {l:"Adresse",v:CO.address},
                  {l:"Téléphone",v:CO.phone},
                  {l:"Email",v:CO.email},
                  {l:"SIRET",v:CO.siret},
                  {l:"RCS",v:CO.rcs},
                ].map(r=>(
                  <div key={r.l} style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",padding:"6px 0",borderBottom:"1px solid #1E2535"}}>
                    <span style={{fontSize:10,color:"#475569",fontWeight:600,flexShrink:0,marginRight:8}}>{r.l}</span>
                    <span style={{fontSize:11,color:"#E2E8F0",fontWeight:600,textAlign:"right"}}>{r.v}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={card}>
              <div style={{fontSize:11,fontWeight:700,color:"#F1F5F9",marginBottom:10}}>📋 Réservation</div>
              {bookings.length===0?<div style={{color:"#475569",fontSize:11,textAlign:"center",padding:"14px 0"}}>Aucune réservation</div>:(
                <div style={{display:"flex",flexDirection:"column",gap:6,maxHeight:mob?180:360,overflowY:"auto"}}>
                  {[...bookings].sort((a,b)=>pd(b.start)-pd(a.start)).map(b=>{
                    const v=vehicles.find(v=>v.id===b.vehicleId),isSel=cbid===b.id;
                    return(
                      <div key={b.id} onClick={()=>{setCbid(b.id);setCex({email:b.email||"",address:b.address||"",licenseNum:b.licenseNum||"",deposit:b.deposit||0,extraFees:b.extraFees||0,extraFeesNote:b.extraFeesNote||"",pickupLocation:b.pickupLocation||"agence",dropLocation:b.dropLocation||"agence",rate:b.rate,days:b.days||null});}} style={{background:isSel?"#3B82F620":BG,border:"1.5px solid "+(isSel?"#3B82F6":S2),borderRadius:8,padding:"8px 10px",cursor:"pointer"}}>
                        <div style={{fontSize:11,fontWeight:700,color:"#F1F5F9"}}>{b.client}</div>
                        <div style={{fontSize:9,color:"#64748B",marginTop:1}}>{v?.name||"?"} · {fd(b.start)} → {fd(b.end)}</div>
                        <div style={{fontSize:11,fontWeight:700,color:"#F59E0B",marginTop:1}}>{b.rate*(b.days||gdb(b.start,b.end))} €</div>
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
                    <div style={{background:BG,borderRadius:8,padding:"9px"}}><div style={{fontSize:9,color:"#64748B",marginBottom:2}}>TARIF (€)</div><input type="number" value={cex.rate??scb.rate} onChange={e=>setCex({...cex,rate:e.target.value})} style={{width:"100%",background:"transparent",border:"none",color:"#F1F5F9",fontSize:15,fontWeight:800,outline:"none"}}/></div>
                    <div style={{background:BG,borderRadius:8,padding:"9px"}}><div style={{fontSize:9,color:"#64748B",marginBottom:2}}>NOMBRE DE JOURS</div><input type="number" value={cex.days??gdb(scb.start,scb.end)} onChange={e=>setCex({...cex,days:e.target.value})} style={{width:"100%",background:"transparent",border:"none",color:"#F1F5F9",fontSize:15,fontWeight:800,outline:"none"}}/></div>
                    <div style={{background:BG,borderRadius:8,padding:"9px"}}><div style={{fontSize:9,color:"#64748B",marginBottom:2}}>LOCATION</div><div style={{fontSize:15,fontWeight:800,color:"#F59E0B"}}>{(Number(cex.rate??scb.rate)*Number(cex.days??gdb(scb.start,scb.end))).toLocaleString("fr-FR")} €</div></div>
                    <div style={{background:BG,borderRadius:8,padding:"9px"}}><div style={{fontSize:9,color:"#64748B",marginBottom:2}}>CAUTION (€)</div><input type="number" value={cex.deposit||0} onChange={e=>setCex({...cex,deposit:Number(e.target.value)})} style={{width:"100%",background:"transparent",border:"none",color:"#F1F5F9",fontSize:15,fontWeight:800,outline:"none"}}/></div>
                    <div style={{background:BG,borderRadius:8,padding:"9px",gridColumn:"1/-1"}}><div style={{fontSize:9,color:"#F59E0B",marginBottom:4,fontWeight:700}}>FRAIS SUPPLÉMENTAIRE — LIBELLÉ</div><input value={cex.extraFeesNote||""} onChange={e=>setCex({...cex,extraFeesNote:e.target.value})} placeholder="Ex: Dépôt aéroport, nettoyage, retard..." style={{width:"100%",background:"transparent",border:"none",color:"#E2E8F0",fontSize:12,outline:"none"}}/></div>
                    <div style={{background:BG,borderRadius:8,padding:"9px",gridColumn:"1/-1"}}><div style={{fontSize:9,color:"#F59E0B",marginBottom:2,fontWeight:700}}>FRAIS SUPPLÉMENTAIRE — TARIF (€)</div><input type="number" value={cex.extraFees||0} onChange={e=>setCex({...cex,extraFees:Number(e.target.value)})} style={{width:"100%",background:"transparent",border:"none",color:"#F59E0B",fontSize:15,fontWeight:800,outline:"none"}}/></div>
                    <div style={{background:"linear-gradient(135deg,#1a1a2e,#3B82F6)",borderRadius:8,padding:"9px",gridColumn:"1/-1",textAlign:"center"}}><div style={{fontSize:9,color:"rgba(255,255,255,0.7)",marginBottom:2}}>TOTAL GÉNÉRAL (location + frais)</div><div style={{fontSize:18,fontWeight:900,color:"#fff"}}>{((Number(cex.rate??scb.rate)*Number(cex.days??gdb(scb.start,scb.end)))+(Number(cex.extraFees)||0)).toLocaleString("fr-FR")} €</div></div>
                  </div>
                </div>
                <div style={{background:"#0F1117",border:"1px solid #1E2535",borderRadius:12,padding:"14px 16px"}}>
                  <div style={{fontSize:11,fontWeight:700,color:"#F1F5F9",marginBottom:10}}>✍️ Signatures</div>
                  <div style={{display:"grid",gridTemplateColumns:mob?"1fr":"1fr 1fr",gap:12}}>
                    <SignatureCanvas label="Signature du loueur" value={cex.sigLoueur||null} onChange={v=>setCex({...cex,sigLoueur:v})} color="#3B82F6"/>
                    <SignatureCanvas label="Signature du locataire" value={cex.sigLocataire||null} onChange={v=>setCex({...cex,sigLocataire:v})} color="#10B981"/>
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

      {/* ── ÉTAT DES LIEUX ── */}
      {page==="edl"&&<div style={pg}>
        <EdlPage vehicles={vehicles} bookings={bookings} mob={mob} BG={BG} S1={S1} S2={S2} S3={S3} card={card} btnP={btnP} fd={fd} fds={fds} logExport={logExport}/>
      </div>}

      {/* ── BASE CLIENTS ── */}
      {page==="clients"&&<div style={pg}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14,flexWrap:"wrap",gap:8}}>
          <div>
            <div style={{fontSize:mob?17:20,fontWeight:700,color:"#F1F5F9"}}>👥 Clients</div>
            <div style={{fontSize:11,color:"#475569"}}>{clientsList.length} client{clientsList.length>1?"s":""}</div>
          </div>
          <div style={{display:"flex",gap:3,background:S2,borderRadius:9,padding:3}}>
            <button onClick={()=>setClientSort(clientSort==="az"?"za":"az")} style={{background:clientSort==="az"||clientSort==="za"?"linear-gradient(135deg,#1a1a2e,#3B82F6)":"transparent",border:"none",color:"#fff",padding:"6px 12px",borderRadius:7,cursor:"pointer",fontSize:11,fontWeight:600}}>{clientSort==="za"?"Z → A":"A → Z"}</button>
          </div>
        </div>
        {clientsList.length===0?<div style={{...card,textAlign:"center",padding:"36px",color:"#475569"}}>Aucun client. Les clients apparaissent ici après une première réservation ou génération de contrat.</div>:
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          {[...clientsList].sort((a,b)=>clientSort==="za"?b.name.localeCompare(a.name,"fr"):a.name.localeCompare(b.name,"fr")).map(c=>{
            const dbRecord=clients.find(cl=>cl.name===c.name);
            return(
            <div key={c.name} style={{background:S1,border:"1px solid "+S2,borderRadius:12,padding:mob?13:16,display:"flex",alignItems:"center",gap:12}}>
              <div onClick={()=>{setSelClient(c.name);setClientForm({phone:c.phone,email:c.email,address:c.address,licenseNum:c.licenseNum,licenseDate:c.licenseDate||"",idNum:c.idNum||""});}} style={{display:"flex",alignItems:"center",gap:12,flex:1,minWidth:0,cursor:"pointer"}}>
                <div style={{width:40,height:40,borderRadius:"50%",background:"#3B82F625",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,fontWeight:700,color:"#3B82F6",flexShrink:0}}>{c.name.charAt(0).toUpperCase()}</div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontWeight:700,fontSize:13,color:"#F1F5F9"}}>{c.name}</div>
                  <div style={{fontSize:11,color:"#64748B",marginTop:2,display:"flex",gap:10,flexWrap:"wrap"}}>
                    {c.phone&&<span>📞 {c.phone}</span>}
                    {c.email&&<span>📧 {c.email}</span>}
                  </div>
                </div>
              </div>
              <div style={{background:"#3B82F620",color:"#3B82F6",padding:"3px 10px",borderRadius:20,fontSize:11,fontWeight:700,flexShrink:0}}>{c.bookingsCount} résa{c.bookingsCount>1?"s":""}</div>
              {dbRecord&&<button onClick={()=>setDcClient(dbRecord.id)} style={{background:"#EF444415",border:"1px solid #EF444430",color:"#EF4444",width:30,height:30,borderRadius:7,cursor:"pointer",fontSize:13,flexShrink:0}}>🗑</button>}
            </div>
          );})}
        </div>}

        {/* CONFIRMATION SUPPRESSION CLIENT */}
        {dcClient&&<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.8)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:300,padding:16}}><div style={{background:S1,borderRadius:15,width:"100%",maxWidth:360,border:"1px solid "+S2,padding:22}}><div style={{fontSize:15,fontWeight:700,color:"#EF4444",marginBottom:10}}>🗑 Supprimer ce client ?</div><div style={{fontSize:12,color:"#94A3B8",marginBottom:14}}>Ses réservations resteront, mais sa fiche client sera supprimée.</div><div style={{display:"flex",gap:7}}><button onClick={()=>setDcClient(null)} style={{flex:1,background:S2,border:"none",color:"#94A3B8",padding:"9px",borderRadius:7,cursor:"pointer",fontWeight:600,fontSize:12}}>Annuler</button><button onClick={async()=>{await deleteClient(dcClient);setDcClient(null);}} style={{flex:1,background:"#EF4444",border:"none",color:"#fff",padding:"9px",borderRadius:7,cursor:"pointer",fontWeight:700,fontSize:12}}>Supprimer</button></div></div></div>}

        {/* FICHE CLIENT (panneau détail) */}
        {selClient&&<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.82)",display:"flex",alignItems:mob?"flex-end":"center",justifyContent:"center",zIndex:250,padding:mob?0:16}} onClick={e=>e.target===e.currentTarget&&setSelClient(null)}>
          <div style={{background:S1,borderRadius:mob?"18px 18px 0 0":"18px",width:"100%",maxWidth:mob?"100%":460,border:"1px solid "+S2,maxHeight:mob?"90vh":"85vh",overflowY:"auto"}}>
            <div style={{padding:"18px 22px",borderBottom:"1px solid "+S2,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div>
                <div style={{fontSize:10,color:"#475569",fontWeight:600}}>FICHE CLIENT</div>
                <div style={{fontSize:17,fontWeight:700,color:"#F1F5F9",marginTop:2}}>{selClient}</div>
              </div>
              <button onClick={()=>setSelClient(null)} style={{background:S2,border:"none",color:"#64748B",width:28,height:28,borderRadius:6,cursor:"pointer",fontSize:15}}>×</button>
            </div>
            <div style={{padding:"16px 22px",display:"flex",flexDirection:"column",gap:12}}>
              <Fld label="Téléphone" value={clientForm.phone} onChange={v=>setClientForm({...clientForm,phone:v})} placeholder="06 00 00 00 00"/>
              <Fld label="Email" value={clientForm.email} onChange={v=>setClientForm({...clientForm,email:v})} placeholder="client@email.fr"/>
              <Fld label="Adresse" value={clientForm.address} onChange={v=>setClientForm({...clientForm,address:v})} placeholder="12 rue de la Paix..."/>
              <Fld label="N° Permis" value={clientForm.licenseNum} onChange={v=>setClientForm({...clientForm,licenseNum:v})} placeholder="123456789012"/>
              <div style={{width:"100%",minWidth:0,maxWidth:"100%",overflow:"hidden"}}><label style={{fontSize:11,color:"#475569",fontWeight:600,display:"block",marginBottom:5}}>DATE OBTENTION PERMIS</label><input type="date" value={clientForm.licenseDate||""} onChange={e=>setClientForm({...clientForm,licenseDate:e.target.value})} style={{width:"100%",maxWidth:"100%",minWidth:0,background:BG,border:"1px solid "+S3,color:"#E2E8F0",padding:"9px 11px",borderRadius:7,fontSize:13,boxSizing:"border-box",display:"block",WebkitAppearance:"none",appearance:"none"}}/></div>
              <Fld label="N° Pièce d'identité" value={clientForm.idNum} onChange={v=>setClientForm({...clientForm,idNum:v})} placeholder="CNI / Passeport..."/>
              <div style={{background:BG,borderRadius:8,padding:"10px 12px",fontSize:11,color:"#64748B"}}>
                📋 {(clientsList.find(c=>c.name===selClient)?.bookingsCount)||0} réservation(s) enregistrée(s)
              </div>
            </div>
            <div style={{padding:"0 22px 22px",display:"flex",gap:7}}>
              <button onClick={()=>setSelClient(null)} style={{flex:1,background:S2,border:"none",color:"#94A3B8",padding:"10px",borderRadius:8,cursor:"pointer",fontWeight:600,fontSize:12}}>Fermer</button>
              <button onClick={async()=>{await upsertClient(selClient,clientForm);showT("Client enregistré ✓");setSelClient(null);}} style={{flex:2,background:"linear-gradient(135deg,#1a1a2e,#3B82F6)",border:"none",color:"#fff",padding:"10px",borderRadius:8,cursor:"pointer",fontWeight:700,fontSize:12}}>💾 Enregistrer</button>
            </div>
          </div>
        </div>}
      </div>}

      {/* ── BASE CONTRATS (uniquement PDF exportés) ── */}
      {page==="contractsDB"&&<div style={pg}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14,flexWrap:"wrap",gap:8}}>
          <div>
            <div style={{fontSize:mob?17:20,fontWeight:700,color:"#F1F5F9"}}>📄 Contrats exportés</div>
            <div style={{fontSize:11,color:"#475569"}}>{exportsLog.filter(x=>x.type==="contract").length} export{exportsLog.filter(x=>x.type==="contract").length>1?"s":""}</div>
          </div>
          <div style={{display:"flex",gap:3,background:S2,borderRadius:9,padding:3}}>
            <button onClick={()=>setDocSort(docSort==="desc"?"asc":"desc")} style={{background:"linear-gradient(135deg,#1a1a2e,#3B82F6)",border:"none",color:"#fff",padding:"6px 12px",borderRadius:7,cursor:"pointer",fontSize:11,fontWeight:600}}>{docSort==="desc"?"Plus récent":"Plus ancien"}</button>
          </div>
        </div>
        {exportsLog.filter(x=>x.type==="contract").length===0?<div style={{...card,textAlign:"center",padding:"36px",color:"#475569"}}>Aucun contrat exporté. Générez un PDF depuis l'onglet "Contrats" pour qu'il apparaisse ici.</div>:
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          {[...exportsLog].filter(x=>x.type==="contract").sort((a,b)=>docSort==="desc"?new Date(b.createdAt)-new Date(a.createdAt):new Date(a.createdAt)-new Date(b.createdAt)).map(x=>{
            const cn="CTR-"+new Date(x.dateStart).getFullYear()+"-"+String(x.bookingId).padStart(4,"0");
            return(
              <div key={x.id} style={{background:S1,border:"1px solid "+S2,borderRadius:12,padding:mob?13:16,display:"flex",alignItems:"center",gap:12}}>
                <div onClick={()=>viewExport(x.html)} style={{width:40,height:40,borderRadius:10,background:"#8B5CF625",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0,cursor:x.html?"pointer":"default"}}>📄</div>
                <div onClick={()=>viewExport(x.html)} style={{flex:1,minWidth:0,cursor:x.html?"pointer":"default"}}>
                  <div style={{fontWeight:700,fontSize:13,color:"#F1F5F9"}}>{cn} — {x.client}</div>
                  <div style={{fontSize:11,color:"#64748B",marginTop:2}}>{x.vehicleName||"?"} ({x.vehiclePlate||"?"}) · {x.dateStart?fd(x.dateStart):"?"} → {x.dateEnd?fd(x.dateEnd):"?"}</div>
                  {x.html&&<div style={{fontSize:10,color:"#3B82F6",marginTop:2,fontWeight:600}}>👁 Cliquer pour consulter le PDF</div>}
                </div>
                <div style={{flexShrink:0,fontSize:10,color:"#475569",textAlign:"right"}}>{x.createdAt?new Date(x.createdAt).toLocaleDateString("fr-FR"):""}</div>
                <button onClick={()=>setDcExport(x.id)} style={{background:"#EF444415",border:"1px solid #EF444430",color:"#EF4444",width:30,height:30,borderRadius:7,cursor:"pointer",fontSize:13,flexShrink:0}}>🗑</button>
              </div>
            );
          })}
        </div>}

        {/* CONFIRMATION SUPPRESSION EXPORT */}
        {dcExport&&<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.8)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:300,padding:16}}><div style={{background:S1,borderRadius:15,width:"100%",maxWidth:360,border:"1px solid "+S2,padding:22}}><div style={{fontSize:15,fontWeight:700,color:"#EF4444",marginBottom:10}}>🗑 Supprimer cet export ?</div><div style={{fontSize:12,color:"#94A3B8",marginBottom:14}}>Cette action est irréversible.</div><div style={{display:"flex",gap:7}}><button onClick={()=>setDcExport(null)} style={{flex:1,background:S2,border:"none",color:"#94A3B8",padding:"9px",borderRadius:7,cursor:"pointer",fontWeight:600,fontSize:12}}>Annuler</button><button onClick={async()=>{await deleteExport(dcExport);setDcExport(null);}} style={{flex:1,background:"#EF4444",border:"none",color:"#fff",padding:"9px",borderRadius:7,cursor:"pointer",fontWeight:700,fontSize:12}}>Supprimer</button></div></div></div>}
      </div>}

      {/* ── BASE ÉTATS DES LIEUX (uniquement PDF exportés) ── */}
      {page==="edlDB"&&<div style={pg}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14,flexWrap:"wrap",gap:8}}>
          <div>
            <div style={{fontSize:mob?17:20,fontWeight:700,color:"#F1F5F9"}}>🔍 États des lieux exportés</div>
            <div style={{fontSize:11,color:"#475569"}}>{exportsLog.filter(x=>x.type==="edl_in"||x.type==="edl_out").length} export{exportsLog.filter(x=>x.type==="edl_in"||x.type==="edl_out").length>1?"s":""}</div>
          </div>
          <div style={{display:"flex",gap:3,background:S2,borderRadius:9,padding:3}}>
            <button onClick={()=>setDocSort(docSort==="desc"?"asc":"desc")} style={{background:"linear-gradient(135deg,#1a1a2e,#3B82F6)",border:"none",color:"#fff",padding:"6px 12px",borderRadius:7,cursor:"pointer",fontSize:11,fontWeight:600}}>{docSort==="desc"?"Plus récent":"Plus ancien"}</button>
          </div>
        </div>
        {exportsLog.filter(x=>x.type==="edl_in"||x.type==="edl_out").length===0?<div style={{...card,textAlign:"center",padding:"36px",color:"#475569"}}>Aucun état des lieux exporté. Générez un PDF depuis l'onglet "État des lieux" pour qu'il apparaisse ici.</div>:
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          {[...exportsLog].filter(x=>x.type==="edl_in"||x.type==="edl_out").sort((a,b)=>docSort==="desc"?new Date(b.createdAt)-new Date(a.createdAt):new Date(a.createdAt)-new Date(b.createdAt)).map(x=>(
            <div key={x.id} style={{background:S1,border:"1px solid "+S2,borderRadius:12,padding:mob?13:16,display:"flex",alignItems:"center",gap:12}}>
              <div onClick={()=>viewExport(x.html)} style={{width:40,height:40,borderRadius:10,background:(x.type==="edl_in"?"#10B981":"#EF4444")+"25",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0,cursor:x.html?"pointer":"default"}}>🔍</div>
              <div onClick={()=>viewExport(x.html)} style={{flex:1,minWidth:0,cursor:x.html?"pointer":"default"}}>
                <div style={{fontWeight:700,fontSize:13,color:"#F1F5F9"}}>{x.client}</div>
                <div style={{fontSize:11,color:"#64748B",marginTop:2}}>{x.vehicleName||"?"} ({x.vehiclePlate||"?"}) · {x.dateStart?fd(x.dateStart):"?"} → {x.dateEnd?fd(x.dateEnd):"?"}</div>
                {x.html&&<div style={{fontSize:10,color:"#3B82F6",marginTop:2,fontWeight:600}}>👁 Cliquer pour consulter le PDF</div>}
              </div>
              <span style={{background:(x.type==="edl_in"?"#10B981":"#EF4444")+"20",color:x.type==="edl_in"?"#10B981":"#EF4444",padding:"3px 8px",borderRadius:20,fontSize:10,fontWeight:600,flexShrink:0}}>{x.type==="edl_in"?"Récupération":"Dépose"}</span>
              <button onClick={()=>setDcExport(x.id)} style={{background:"#EF444415",border:"1px solid #EF444430",color:"#EF4444",width:30,height:30,borderRadius:7,cursor:"pointer",fontSize:13,flexShrink:0}}>🗑</button>
            </div>
          ))}
        </div>}

        {/* CONFIRMATION SUPPRESSION EXPORT (commune contrats + edl) */}
        {dcExport&&<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.8)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:300,padding:16}}><div style={{background:S1,borderRadius:15,width:"100%",maxWidth:360,border:"1px solid "+S2,padding:22}}><div style={{fontSize:15,fontWeight:700,color:"#EF4444",marginBottom:10}}>🗑 Supprimer cet export ?</div><div style={{fontSize:12,color:"#94A3B8",marginBottom:14}}>Cette action est irréversible.</div><div style={{display:"flex",gap:7}}><button onClick={()=>setDcExport(null)} style={{flex:1,background:S2,border:"none",color:"#94A3B8",padding:"9px",borderRadius:7,cursor:"pointer",fontWeight:600,fontSize:12}}>Annuler</button><button onClick={async()=>{await deleteExport(dcExport);setDcExport(null);}} style={{flex:1,background:"#EF4444",border:"none",color:"#fff",padding:"9px",borderRadius:7,cursor:"pointer",fontWeight:700,fontSize:12}}>Supprimer</button></div></div></div>}
      </div>}

      {/* ── MODALS ── */}
      {modal&&!dc?.type?.startsWith("v")&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.82)",display:"flex",alignItems:mob?"flex-end":"center",justifyContent:"center",zIndex:250,padding:mob?0:16}} onClick={e=>e.target===e.currentTarget&&setModal(null)}>
          <div style={{background:S1,borderRadius:mob?"18px 18px 0 0":"18px",width:"100%",maxWidth:mob?"100%":490,border:"1px solid "+S2,boxShadow:"0 20px 60px rgba(0,0,0,.7)",maxHeight:mob?"92vh":"88vh",overflowY:"auto",overflowX:"hidden",boxSizing:"border-box"}}>

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
                    <Row icon="⏱" label="Durée facturée" value={(b.days||gdb(b.start,b.end))+" jour(s)"}/>
                    <div style={{background:BG,borderRadius:9,padding:"12px",display:"flex",justifyContent:"space-between"}}>
                      <div><div style={{fontSize:10,color:"#475569"}}>Tarif/jour</div><div style={{fontSize:20,fontWeight:700,color:"#F59E0B"}}>{b.rate} €</div></div>
                      <div style={{textAlign:"right"}}><div style={{fontSize:10,color:"#475569"}}>Total</div><div style={{fontSize:20,fontWeight:700,color:"#10B981"}}>{(b.rate*(b.days||gdb(b.start,b.end)))+(Number(b.extraFees)||0)} €</div></div>
                    </div>
                    {b.notes&&<Row icon="💬" label="Notes" value={b.notes}/>}
                  </div>
                  <div style={{padding:"10px 22px 22px",display:"flex",gap:7,flexWrap:"wrap"}}>
                    <button onClick={()=>openEdit(b)} style={{flex:1,background:"#3B82F6",border:"none",color:"#fff",padding:"10px",borderRadius:8,cursor:"pointer",fontWeight:600,fontSize:12}}>✏️ Modifier</button>
                    <button onClick={()=>{setPage("contracts");setCbid(b.id);setCex({email:b.email||"",address:b.address||"",licenseNum:b.licenseNum||"",deposit:b.deposit||0,extraFees:b.extraFees||0,extraFeesNote:b.extraFeesNote||"",pickupLocation:b.pickupLocation||"agence",dropLocation:b.dropLocation||"agence",rate:b.rate,days:b.days||null});setModal(null);}} style={{flex:1,background:"#1a1a2e30",border:"1px solid #3B82F640",color:"#3B82F6",padding:"10px",borderRadius:8,cursor:"pointer",fontWeight:600,fontSize:12}}>📄 Contrat</button>
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
                    <div style={{position:"relative"}}>
                      <label style={{fontSize:11,color:"#475569",fontWeight:600,display:"block",marginBottom:5}}>CLIENT</label>
                      <input
                        value={form.client||""}
                        onChange={e=>{setForm({...form,client:e.target.value});setClientSuggest(true);}}
                        onFocus={()=>setClientSuggest(true)}
                        onBlur={()=>setTimeout(()=>setClientSuggest(false),150)}
                        placeholder="Nom du locataire — créer ou rechercher"
                        style={{width:"100%",background:BG,border:"1px solid "+S3,color:"#E2E8F0",padding:"9px 11px",borderRadius:7,fontSize:13,outline:"none"}}
                      />
                      {clientSuggest&&form.client&&(()=>{
                        const matches=clientsList.filter(c=>c.name.toLowerCase().includes(form.client.toLowerCase())&&c.name.toLowerCase()!==form.client.toLowerCase());
                        const exactMatch=clientsList.find(c=>c.name.toLowerCase()===form.client.toLowerCase());
                        if(matches.length===0&&exactMatch)return null;
                        return(
                          <div style={{position:"absolute",top:"100%",left:0,right:0,marginTop:4,background:S1,border:"1px solid "+S3,borderRadius:9,boxShadow:"0 8px 24px rgba(0,0,0,.5)",zIndex:50,maxHeight:180,overflowY:"auto"}}>
                            {matches.map(c=>(
                              <div key={c.name} onMouseDown={()=>{setForm({...form,client:c.name,phone:c.phone||form.phone,email:c.email||form.email,address:c.address||form.address,licenseNum:c.licenseNum||form.licenseNum,licenseDate:c.licenseDate||form.licenseDate,idNum:c.idNum||form.idNum});setClientSuggest(false);}}
                                style={{padding:"9px 11px",cursor:"pointer",borderBottom:"1px solid "+S2,display:"flex",alignItems:"center",gap:8}}>
                                <span style={{width:24,height:24,borderRadius:"50%",background:"#3B82F625",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:"#3B82F6",flexShrink:0}}>{c.name.charAt(0).toUpperCase()}</span>
                                <div style={{flex:1,minWidth:0}}>
                                  <div style={{fontSize:12,fontWeight:600,color:"#E2E8F0"}}>{c.name}</div>
                                  {c.phone&&<div style={{fontSize:10,color:"#64748B"}}>{c.phone}</div>}
                                </div>
                              </div>
                            ))}
                            {!exactMatch&&<div onMouseDown={()=>setClientSuggest(false)} style={{padding:"8px 11px",fontSize:11,color:"#3B82F6",fontWeight:600,background:"#3B82F610"}}>＋ Créer "{form.client}" comme nouveau client</div>}
                          </div>
                        );
                      })()}
                    </div>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:9}}><Fld label="Téléphone" value={form.phone} onChange={val=>setForm({...form,phone:val})} placeholder="06 00 00 00 00"/><Fld label="Email" value={form.email} onChange={val=>setForm({...form,email:val})} placeholder="client@email.fr"/></div>
                    <Fld label="Adresse" value={form.address} onChange={val=>setForm({...form,address:val})} placeholder="12 rue de la Paix..."/>
                    <Fld label="N° Permis" value={form.licenseNum} onChange={val=>setForm({...form,licenseNum:val})} placeholder="123456789012"/>
                    <div style={{width:"100%",minWidth:0,maxWidth:"100%",overflow:"hidden"}}><label style={{fontSize:11,color:"#475569",fontWeight:600,display:"block",marginBottom:5}}>DATE OBTENTION PERMIS</label><input type="date" value={form.licenseDate||""} onChange={e=>setForm({...form,licenseDate:e.target.value})} style={{width:"100%",maxWidth:"100%",minWidth:0,boxSizing:"border-box",display:"block",background:"#0F1117",border:"1px solid #2D3748",color:"#E2E8F0",padding:"9px 11px",borderRadius:7,fontSize:13,outline:"none",fontFamily:"inherit",WebkitAppearance:"none",appearance:"none"}}/></div>
                    <Fld label="N° Pièce d'identité" value={form.idNum} onChange={val=>setForm({...form,idNum:val})} placeholder="CNI / Passeport..."/>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:9}}>
                      <div><label style={{fontSize:10,color:"#475569",fontWeight:600,display:"block",marginBottom:6}}>🏁 LIEU DE RÉCUPÉRATION</label><div style={{display:"flex",gap:5}}><button type="button" onClick={()=>setForm({...form,pickupLocation:"agence"})} style={{flex:1,background:(form.pickupLocation||"agence")==="agence"?"linear-gradient(135deg,#1a1a2e,#3B82F6)":S2,border:"none",color:"#fff",padding:"7px 4px",borderRadius:7,cursor:"pointer",fontSize:11,fontWeight:600}}>🏢 Agence</button><button type="button" onClick={()=>setForm({...form,pickupLocation:"aeroport"})} style={{flex:1,background:form.pickupLocation==="aeroport"?"linear-gradient(135deg,#1a1a2e,#3B82F6)":S2,border:"none",color:"#fff",padding:"7px 4px",borderRadius:7,cursor:"pointer",fontSize:11,fontWeight:600}}>✈️ Aéroport</button></div></div>
                      <div><label style={{fontSize:10,color:"#475569",fontWeight:600,display:"block",marginBottom:6}}>🏁 LIEU DE DÉPOSE</label><div style={{display:"flex",gap:5}}><button type="button" onClick={()=>setForm({...form,dropLocation:"agence"})} style={{flex:1,background:(form.dropLocation||"agence")==="agence"?"linear-gradient(135deg,#1a1a2e,#3B82F6)":S2,border:"none",color:"#fff",padding:"7px 4px",borderRadius:7,cursor:"pointer",fontSize:11,fontWeight:600}}>🏢 Agence</button><button type="button" onClick={()=>setForm({...form,dropLocation:"aeroport"})} style={{flex:1,background:form.dropLocation==="aeroport"?"linear-gradient(135deg,#1a1a2e,#3B82F6)":S2,border:"none",color:"#fff",padding:"7px 4px",borderRadius:7,cursor:"pointer",fontSize:11,fontWeight:600}}>✈️ Aéroport</button></div></div>
                    </div>
                    <div style={{display:"grid",gridTemplateColumns:mob?"1fr":"1fr 1fr",gap:9}}>
                      <div style={{width:"100%",minWidth:0,maxWidth:"100%",overflow:"hidden"}}><label style={{fontSize:11,color:"#475569",fontWeight:600,display:"block",marginBottom:5}}>DÉBUT</label><input type="date" value={form.start||""} onChange={e=>setForm({...form,start:e.target.value})} style={{width:"100%",maxWidth:"100%",minWidth:0,boxSizing:"border-box",display:"block",background:"#0F1117",border:"1px solid #2D3748",color:"#E2E8F0",padding:"9px 11px",borderRadius:7,fontSize:13,outline:"none",fontFamily:"inherit",WebkitAppearance:"none",appearance:"none"}}/></div>
                      <div style={{width:"100%",minWidth:0,maxWidth:"100%",overflow:"hidden"}}><label style={{fontSize:11,color:"#475569",fontWeight:600,display:"block",marginBottom:5}}>FIN</label><input type="date" value={form.end||""} onChange={e=>setForm({...form,end:e.target.value})} style={{width:"100%",maxWidth:"100%",minWidth:0,boxSizing:"border-box",display:"block",background:"#0F1117",border:"1px solid #2D3748",color:"#E2E8F0",padding:"9px 11px",borderRadius:7,fontSize:13,outline:"none",fontFamily:"inherit",WebkitAppearance:"none",appearance:"none"}}/></div>
                    </div>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:9}}>
                      <Fld label="Tarif (€)" value={form.rate} onChange={val=>setForm({...form,rate:val})} placeholder="75" type="number"/>
                      <Fld label="Nombre de jours" value={form.days??(form.start&&form.end&&pd(form.end)>=pd(form.start)?gdb(form.start,form.end):"")} onChange={val=>setForm({...form,days:val})} placeholder="1" type="number"/>
                    </div>
                    <Fld label="Caution (€)" value={form.deposit} onChange={val=>setForm({...form,deposit:val})} placeholder="300" type="number"/>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:9}}>
                      <Fld label="Frais — Libellé" value={form.extraFeesNote} onChange={val=>setForm({...form,extraFeesNote:val})} placeholder="Ex: Dépôt aéroport..."/>
                      <Fld label="Frais — Montant (€)" value={form.extraFees} onChange={val=>setForm({...form,extraFees:val})} placeholder="0" type="number"/>
                    </div>
                    {form.start&&form.end&&pd(form.end)>=pd(form.start)&&<div style={{background:"#10B98115",border:"1px solid #10B98130",borderRadius:7,padding:"7px 10px",fontSize:11}}><span style={{color:"#10B981",fontWeight:700}}>{form.days??gdb(form.start,form.end)} jour(s) facturé(s)</span>{form.rate&&<span style={{color:"#64748B"}}> · Total : <strong style={{color:"#F59E0B"}}>{(Number(form.rate)*Number(form.days??gdb(form.start,form.end)))+(Number(form.extraFees)||0)} €</strong></span>}</div>}
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
                    <Fld label="Année" value={form.year} onChange={val=>setForm({...form,year:val})} placeholder="2021" type="number"/>
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

export default function App(){
  const[authed,setAuthed]=useState(()=>{
    try{return localStorage.getItem("ctl_auth")==="1";}catch(e){return false;}
  });
  if(!authed)return <LoginScreen onLogin={()=>setAuthed(true)}/>;
  return <MainApp/>;
}
