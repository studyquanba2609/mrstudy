(function(root){'use strict';
const iso=s=>typeof s==='string'&&Number.isFinite(Date.parse(s));
const https=s=>{try{const u=new URL(s);return u.protocol==='https:'&&!u.username&&!u.password?u:null}catch{return null}};
const source=s=>{const u=https(s);return u&&(u.hostname==='appraven.net'&&/^\/app\/\d+\/?$/.test(u.pathname)||u.hostname==='t.me'&&/^\/(?:s\/)?dealraven\/\d+\/?$/i.test(u.pathname)||['www.reddit.com','reddit.com'].includes(u.hostname)&&/^\/r\/AppHookup\/comments\/[a-z0-9]+\/[^/]+\/?$/i.test(u.pathname)||u.hostname==='apphunt.app'&&(/^\/app\/[a-z0-9-]+\/?$/i.test(u.pathname)||/^\/deal\/\d+\/?$/.test(u.pathname))||u.hostname==='appdrop.rs'&&/^\/en\/.+/.test(u.pathname))};
function valid(d,now=Date.now()){
 if(!d||!/^deal-[a-z0-9-]+$/.test(d.id)||!['download','upgrade'].includes(d.kind)||!source(d.sourceUrl)||!iso(d.checkedAt)||now-Date.parse(d.checkedAt)>172800000||Date.parse(d.checkedAt)>now+300000)return false;
 if(d.expiresAt&&(!iso(d.expiresAt)||Date.parse(d.expiresAt)<=now))return false;
 if(!['name','summary'].every(k=>typeof d[k]==='string'&&d[k].trim())||!/^\d{4}-\d{2}-\d{2}$/.test(d.topicDate)||!iso(d.topicDate+'T00:00:00Z')||Date.parse(d.topicDate+'T00:00:00Z')>now+86400000)return false;
 if(!Array.isArray(d.regions)||!d.regions.length||!d.regions.every(r=>{const u=https(r.url);return /^[a-z]{2}$/.test(r.code)&&typeof r.name==='string'&&r.name.trim()&&u?.hostname==='apps.apple.com'&&u.pathname.startsWith('/'+r.code+'/app/')&&/\/id\d+/.test(u.pathname)&&r.downloadPrice===0&&typeof r.currency==='string'&&iso(r.checkedAt)&&now-Date.parse(r.checkedAt)<=172800000&&Date.parse(r.checkedAt)<=now+300000}))return false;
 if(d.kind==='upgrade'&&d.lifetimeVerified!==true)return false;
 if(d.kind==='upgrade'&&d.lifetimeVerified&&(!https(d.lifetimeEvidence?.url)||!iso(d.lifetimeEvidence?.checkedAt)||now-Date.parse(d.lifetimeEvidence.checkedAt)>172800000||Date.parse(d.lifetimeEvidence.checkedAt)>now+300000||typeof d.lifetimeEvidence.description!=='string'||!d.lifetimeEvidence.description.trim()))return false;
 return true;
}
function validReport(d,now=Date.now()){
 const u=https(d?.url);
 return /^deal-[a-z0-9-]+$/.test(d?.id)&&['name','summary','regionName'].every(k=>typeof d[k]==='string'&&d[k].trim())&&/^\d{4}-\d{2}-\d{2}$/.test(d.topicDate)&&iso(d.reportedAt)&&Date.parse(d.reportedAt)<=now&&now-Date.parse(d.reportedAt)<172800000&&u?.hostname==='apps.apple.com'&&/^\/[a-z]{2}\/app\/(?:[^/]+\/)?id\d+$/.test(u.pathname);
}
const api={valid,source,validReport};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.MRSTUDY_DEAL_RULES=api;
})(typeof window!=='undefined'?window:this);
