import React from 'react';

const paths={
  dashboard:<><path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z"/></>,
  activity:<><path d="M4 7h13"/><path d="m13 3 4 4-4 4"/><path d="M20 17H7"/><path d="m11 13-4 4 4 4"/></>,
  insights:<><path d="M4 19V5"/><path d="M4 19h17"/><path d="m7 15 4-4 3 2 5-7"/><path d="M16 6h3v3"/></>,
  accounts:<><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 10h18"/><path d="M7 15h4"/></>,
  settings:<><circle cx="12" cy="12" r="3"/><path d="m19.4 15 .1.1 1.4 1.1-1.4 2.4-1.7-.6a8 8 0 0 1-1.5.9l-.3 1.8h-2.8l-.3-1.8a8 8 0 0 1-1.5-.9l-1.7.6-1.4-2.4 1.4-1.1a7 7 0 0 1 0-1.8l-1.4-1.1 1.4-2.4 1.7.6a8 8 0 0 1 1.5-.9l.3-1.8h2.8l.3 1.8a8 8 0 0 1 1.5.9l1.7-.6 1.4 2.4-1.4 1.1a7 7 0 0 1 0 1.7Z"/></>,
  income:<><path d="M7 17 17 7"/><path d="M7 7h10v10"/></>,
  expense:<><path d="M7 7 17 17"/><path d="M7 17h10V7"/></>,
  transfer:<><path d="M4 8h14"/><path d="m14 4 4 4-4 4"/><path d="M20 16H6"/><path d="m10 12-4 4 4 4"/></>,
  close:<><path d="m18 6-12 12M6 6l12 12"/></>,
  arrow:<><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></>,
  bank:<><path d="m3 9 9-6 9 6"/><path d="M4 10h16M5 10v9M9 10v9M15 10v9M19 10v9M3 21h18"/></>,
  creditCard:<><rect x="2.5" y="5" width="19" height="14" rx="2.5"/><path d="M3 10h18M7 15h4"/></>,
  wallet:<><path d="M4 7.5A2.5 2.5 0 0 1 6.5 5H20v15H6.5A2.5 2.5 0 0 1 4 17.5z"/><path d="M4 8h16M15 13h5"/><path d="M17 13h.01"/></>,
  receipt:<><path d="M5 3 7 4.5 9 3l3 1.5L15 3l2 1.5L19 3v18l-2-1.5L15 21l-3-1.5L9 21l-2-1.5L5 21z"/><path d="M8 9h8M8 13h8M8 17h5"/></>,
  cash:<><rect x="2.5" y="5" width="19" height="14" rx="2"/><circle cx="12" cy="12" r="3"/><path d="M6 9h.01M18 15h.01"/></>,
  shield:<><path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z"/><path d="m9 12 2 2 4-4"/></>,
  calendar:<><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/></>,
  plus:<><path d="M12 5v14M5 12h14"/></>,
  search:<><circle cx="10.8" cy="10.8" r="6.8"/><path d="m16 16 5 5"/></>,
  filter:<><path d="M4 6h16M7 12h10M10 18h4"/></>
};
export default function Icon({name,size=18,className='',strokeWidth=1.7}){return <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]||paths.arrow}</svg>;}
