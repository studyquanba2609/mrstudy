'use strict';
const fs=require('node:fs'),path=require('node:path'),{valid}=require('../deal-rules.js');
const data=JSON.parse(fs.readFileSync(path.join(__dirname,'../data/deals.json'),'utf8'));
if(!Array.isArray(data.items)||data.updatedAt!==null&&!Number.isFinite(Date.parse(data.updatedAt)))throw Error('Invalid deal dataset');
const now=Date.now(),ids=new Set();let historical=0;
for(const d of data.items){
 const checked=Date.parse(d.checkedAt);
 // Keep historical records without refreshing them; live visibility still uses valid(d).
 const archived=Number.isFinite(checked)&&checked<=now&&now-checked>172800000;
 if(ids.has(d.id)||!valid(d,archived?checked:now))throw Error('Invalid or duplicate deal: '+d.id);
 if(archived)historical++;ids.add(d.id);
}
console.log('Validated '+data.items.length+' deal records ('+historical+' historical)');
