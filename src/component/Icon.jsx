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
  arrow:<><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></>
};
export default function Icon({name,size=18,className='',strokeWidth=1.7}){return <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]||paths.arrow}</svg>;}
