import { useEffect, useState } from 'react';

export default function CinematicIntro({onComplete}){
  const [leaving,setLeaving]=useState(false);
  useEffect(()=>{
    const finish=()=>{setLeaving(true);window.setTimeout(onComplete,420);};
    const timer=window.setTimeout(finish,2860);
    return ()=>window.clearTimeout(timer);
  },[onComplete]);
  const skip=()=>{setLeaving(true);window.setTimeout(onComplete,120);};
  return <div className={`cinematic-intro${leaving?' is-leaving':''}`} role="status" aria-label="Entering Money OS">
    <div className="intro-beam"/><div className="intro-aura intro-aura-one"/><div className="intro-aura intro-aura-two"/>
    <div className="intro-brand"><span className="intro-mark">M</span><span className="intro-name">MONEY<span>OS</span></span><small>YOUR FINANCIAL UNIVERSE</small></div>
    <button className="intro-skip" onClick={skip}>SKIP INTRO <span>↗</span></button>
  </div>;
}
