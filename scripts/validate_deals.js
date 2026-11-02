'use strict';
const fs=require('node:fs'),path=require('node:path'),{valid}=require('../deal-rules.js');
const data=JSON.parse(fs.readFileSync(path.join(__dirname,'../data/deals.json'),'utf8'));
if(!Array.isArray(data.items)||data.updatedAt!==null&&!Number.isFinite(Date.parse(data.updatedAt)))throw Error('Invalid deal dataset');
const ids=new Set();for(const d of data.items){if(ids.has(d.id)||!valid(d))throw Error('Invalid, expired or duplicate deal: '+d.id);ids.add(d.id)}
console.log('Validated '+data.items.length+' deal articles');
