/* CLASS OF 2026 — backend (Google Apps Script). Steps: see README.md
   Run setup() once (authorize), then Deploy > New deployment > Web app (Execute as: Me, Access: Anyone). */
const ADMIN_KEY = 'CHANGE_THIS_SECRET';   // your secret; used at  yoursite/#admin  to delete anything
const FOLDER = 'Class2026 Photos';        // Drive folder (created automatically)
const MAX_B64 = 4000000;                  // max photo size (base64 chars)
const COOLDOWN = 15;                      // seconds between posts from the same visitor
const HEAD = {Messages:['id','name','message','date'], Photos:['id','name','category','caption','date','fileId'], Votes:['poll','option','date']};

function tab(n){const ss=SpreadsheetApp.getActive();let t=ss.getSheetByName(n);if(!t){t=ss.insertSheet(n);t.appendRow(HEAD[n])}return t}
function rows(n){const v=tab(n).getDataRange().getValues(),h=v.shift();return v.map(r=>{const o={};h.forEach((k,i)=>o[k]=r[i]);return o})}
function out(o){return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON)}
function folder(){const f=DriveApp.getFoldersByName(FOLDER);return f.hasNext()?f.next():DriveApp.createFolder(FOLDER)}
function clean(x,n){return String(x||'').replace(/[<>]/g,'').trim().slice(0,n)}
function limited(cid){if(!cid)return false;const c=CacheService.getScriptCache(),k='rl_'+cid;if(c.get(k))return true;c.put(k,'1',COOLDOWN);return false}
function setup(){Object.keys(HEAD).forEach(tab);folder();Logger.log('OK: sheets + Drive folder are ready.')}

function doGet(){
  const votes={};rows('Votes').forEach(r=>{const k=r.poll+'_'+r.option;votes[k]=(votes[k]||0)+1});
  return out({ok:1,messages:rows('Messages').reverse().slice(0,200),photos:rows('Photos').reverse().slice(0,300),votes:votes});
}

function doPost(e){
  const lock=LockService.getScriptLock();lock.waitLock(20000);
  try{
    const d=JSON.parse(e.postData.contents),now=new Date().toISOString(),id=Utilities.getUuid().slice(0,8);
    if(d.action==='message'){
      const it={id:id,name:clean(d.name,30),message:clean(d.message,240),date:now};
      if(!it.name||!it.message)return out({ok:0,error:'empty'});
      if(limited(d.cid))return out({ok:0,error:'wait'});
      tab('Messages').appendRow([it.id,it.name,it.message,it.date]);return out({ok:1,item:it});
    }
    if(d.action==='photo'){
      const img=String(d.image||'');if(img.indexOf('data:image/')!==0||img.length>MAX_B64)return out({ok:0,error:'image'});
      if(limited(d.cid))return out({ok:0,error:'wait'});
      const bytes=Utilities.base64Decode(img.split(',')[1]);
      const f=folder().createFile(Utilities.newBlob(bytes,'image/jpeg',id+'.jpg'));
      f.setSharing(DriveApp.Access.ANYONE_WITH_LINK,DriveApp.Permission.VIEW);
      const it={id:id,name:clean(d.name,30)||'Anonymous',category:clean(d.category,40),caption:clean(d.caption,140),date:now,fileId:f.getId()};
      tab('Photos').appendRow([it.id,it.name,it.category,it.caption,it.date,it.fileId]);return out({ok:1,item:it});
    }
    if(d.action==='vote'){tab('Votes').appendRow([Number(d.poll)||0,Number(d.option)||0,now]);return out({ok:1})}
    if(d.action==='delete'){
      if(d.key!==ADMIN_KEY)return out({ok:0,error:'key'});
      const n=d.type==='photo'?'Photos':'Messages',t=tab(n),v=t.getDataRange().getValues();
      for(let i=v.length-1;i>0;i--)if(String(v[i][0])===String(d.id)){
        if(n==='Photos'){try{DriveApp.getFileById(v[i][5]).setTrashed(true)}catch(x){}}
        t.deleteRow(i+1);
      }
      return out({ok:1});
    }
    return out({ok:0,error:'action'});
  }catch(err){return out({ok:0,error:String(err)})}
  finally{lock.releaseLock()}
}
