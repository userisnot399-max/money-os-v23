import React from 'react';

const brands = [
  [/swiggy/i,{label:'S',name:'Swiggy',tone:'swiggy'}], [/blinkit|grofers/i,{label:'b',name:'Blinkit',tone:'blinkit'}], [/zomato/i,{label:'Z',name:'Zomato',tone:'zomato'}], [/zepto/i,{label:'Z',name:'Zepto',tone:'zepto'}], [/instamart/i,{label:'i',name:'Instamart',tone:'instamart'}],
  [/bigbasket/i,{label:'b',name:'BigBasket',tone:'bigbasket'}], [/jiomart/i,{label:'J',name:'JioMart',tone:'jiomart'}], [/dmart/i,{label:'D',name:'DMart',tone:'dmart'}],
  [/amazon/i,{label:'a',name:'Amazon',tone:'amazon'}], [/flipkart/i,{label:'F',name:'Flipkart',tone:'flipkart'}], [/myntra/i,{label:'M',name:'Myntra',tone:'myntra'}], [/meesho/i,{label:'M',name:'Meesho',tone:'meesho'}],
  [/uber/i,{label:'U',name:'Uber',tone:'uber'}], [/ola/i,{label:'O',name:'Ola',tone:'ola'}], [/rapido/i,{label:'R',name:'Rapido',tone:'rapido'}],
  [/netflix/i,{label:'N',name:'Netflix',tone:'netflix'}], [/spotify/i,{label:'S',name:'Spotify',tone:'spotify'}], [/youtube/i,{label:'▶',name:'YouTube',tone:'youtube'}], [/google play|play store/i,{label:'G',name:'Google Play',tone:'google'}], [/apple/i,{label:'A',name:'Apple',tone:'apple'}], [/prime video/i,{label:'P',name:'Prime Video',tone:'prime'}],
  [/indian oil|iocl/i,{label:'IO',name:'Indian Oil',tone:'fuel'}], [/bharat petroleum|bpcl/i,{label:'BP',name:'Bharat Petroleum',tone:'fuel'}], [/hindustan petroleum|hpcl/i,{label:'HP',name:'HP Petrol',tone:'fuel'}], [/shell/i,{label:'S',name:'Shell',tone:'fuel'}],
  [/airtel/i,{label:'A',name:'Airtel',tone:'airtel'}], [/jio/i,{label:'J',name:'Jio',tone:'jio'}], [/vi|vodafone|idea/i,{label:'Vi',name:'Vi',tone:'vi'}]
];
const shapes={
  fuel:<><path d="M5 21V5a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v16"/><path d="M4 21h13M8 7h5v5H8zM16 8h2l2 2v7a2 2 0 0 1-4 0"/></>,
  grocery:<><path d="M4 8h16l-1.5 12h-13z"/><path d="m8 8 4-5 4 5M9 12v4M15 12v4"/></>,
  food:<><path d="M4 11h16a8 8 0 0 1-16 0Z"/><path d="M12 3v3M6 5l2 2M18 5l-2 2"/></>,
  shopping:<><path d="M5 8h14l-1 13H6L5 8Z"/><path d="M9 9V6a3 3 0 0 1 6 0v3"/></>,
  transport:<><path d="M5 16 4 11l2-5h12l2 5-1 5"/><path d="M5 16h14v4H5zM7 11h10M7 17h.01M17 17h.01"/></>,
  health:<><path d="M12 21s-8-4.5-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 6.5-8 11-8 11Z"/><path d="M12 9v6M9 12h6"/></>,
  bills:<><path d="M6 3h12v18l-3-2-3 2-3-2-3 2z"/><path d="M9 8h6M9 12h6M9 16h3"/></>,
  entertainment:<><rect x="3" y="5" width="18" height="14" rx="3"/><path d="m10 9 5 3-5 3z"/></>,
  travel:<><path d="m3 11 18-5-5 18-4-8-9-5Z"/><path d="m12 16 5-6"/></>,
  education:<><path d="m3 9 9-5 9 5-9 5-9-5Z"/><path d="M7 12v5c3 2 7 2 10 0v-5M21 9v6"/></>,
  income:<><path d="M7 7 17 17"/><path d="M7 17h10V7"/></>,
  expense:<><path d="M7 17 17 7"/><path d="M7 7h10v10"/></>,
  transfer:<><path d="M4 8h14l-3-3M20 16H6l3 3"/></>,
  other:<><circle cx="12" cy="12" r="8"/><path d="M12 8v8M8 12h8"/></>
};
function classify(tx){
  const text=`${tx.description||''} ${tx.category||''} ${tx.source||''}`.toLowerCase();
  const brand=brands.find(([re])=>re.test(text));
  if(brand)return {kind:'brand',...brand[1]};
  if(/fuel|petrol|diesel|pump/.test(text))return {kind:'category',icon:'fuel',name:'Fuel'};
  if(/grocery|vegetable|supermarket|kirana|milk|blinkit|zepto/.test(text))return {kind:'category',icon:'grocery',name:'Groceries'};
  if(/food|restaurant|cafe|coffee|dining|pizza|burger/.test(text))return {kind:'category',icon:'food',name:'Food & dining'};
  if(/shopping|store|clothing|fashion/.test(text))return {kind:'category',icon:'shopping',name:'Shopping'};
  if(/uber|ola|cab|taxi|metro|bus|train|transport|rapido/.test(text))return {kind:'category',icon:'transport',name:'Transport'};
  if(/doctor|medical|pharmacy|medicine|hospital|health/.test(text))return {kind:'category',icon:'health',name:'Health'};
  if(/bill|electric|water|recharge|broadband|mobile/.test(text))return {kind:'category',icon:'bills',name:'Bills'};
  if(/movie|cinema|stream|music|game|entertainment/.test(text))return {kind:'category',icon:'entertainment',name:'Entertainment'};
  if(/flight|hotel|travel|booking/.test(text))return {kind:'category',icon:'travel',name:'Travel'};
  if(/school|college|course|book|tuition|education/.test(text))return {kind:'category',icon:'education',name:'Education'};
  return {kind:'category',icon:tx.type==='income'?'income':tx.type==='transfer'?'transfer':tx.type==='expense'?'expense':'other',name:tx.category||'Transaction'};
}
export default function TransactionGlyph({tx}){
  const item=classify(tx);
  if(item.kind==='brand')return <span className={`transaction-glyph brand-glyph brand-${item.tone}`} title={item.name} aria-label={item.name}>{item.label}</span>;
  return <span className={`transaction-glyph category-glyph glyph-${item.icon}`} title={item.name} aria-label={item.name}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{shapes[item.icon]}</svg></span>;
}
