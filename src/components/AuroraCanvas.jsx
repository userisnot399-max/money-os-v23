import { useEffect, useRef } from 'react';

const FRAGMENT = `
precision highp float;
uniform vec2 u_resolution;
uniform float u_time;

float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453123); }
float noise(vec2 p){
  vec2 i=floor(p), f=fract(p); f=f*f*(3.0-2.0*f);
  return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),f.x),f.y);
}
float fbm(vec2 p){ float v=0.0,a=.5; for(int i=0;i<4;i++){v+=noise(p)*a;p*=2.03;a*=.5;} return v; }
void main(){
  vec2 uv=gl_FragCoord.xy/u_resolution.xy;
  vec2 p=uv; float t=u_time*.075;
  float n=fbm(vec2(p.x*2.0+t,p.y*3.0-t*.3));
  float wave1=sin(p.x*5.3+t*1.7+n*3.8)*.105+.58;
  float wave2=sin(p.x*3.6-t*1.1+n*4.5)*.12+.72;
  float wave3=sin(p.x*7.0+t*.7+n*2.7)*.075+.43;
  float band1=exp(-pow((p.y-wave1)/.105,2.0));
  float band2=exp(-pow((p.y-wave2)/.13,2.0));
  float band3=exp(-pow((p.y-wave3)/.08,2.0));
  float veil=(band1*.58+band2*.42+band3*.30)*(0.55+0.45*fbm(vec2(p.x*5.0-t,p.y*2.0+t)));
  vec3 emerald=vec3(.0,1.0,.48), cyan=vec3(.0,.78,1.0), violet=vec3(.43,.12,.92), magenta=vec3(1.0,.12,.52);
  float hue=.5+.5*sin(p.x*2.4+t*.6);
  vec3 aurora=mix(mix(emerald,cyan,hue),mix(violet,magenta,1.0-hue),smoothstep(.48,.95,p.x));
  float horizon=smoothstep(.08,.72,p.y)*(1.0-smoothstep(.78,1.0,p.y));
  float glow=veil*horizon;
  vec3 color=vec3(.012,.022,.048)+aurora*glow*.62;
  float stars=step(.9988,hash(floor(uv*vec2(420.,260.))))*(.2+.8*noise(uv*90.));
  color+=stars*.26;
  float vignette=1.0-smoothstep(.25,.95,length((uv-.5)*vec2(.9,1.0)));
  color*=.72+.28*vignette;
  gl_FragColor=vec4(color,1.0);
}`;

const VERTEX = `attribute vec2 a_position; void main(){ gl_Position=vec4(a_position,0.0,1.0); }`;

export default function AuroraCanvas(){
  const canvasRef=useRef(null);
  useEffect(()=>{
    const canvas=canvasRef.current; if(!canvas) return;
    const reduced=window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    let gl=null, program=null, raf=0, resizeObserver=null, start=performance.now(), lastFrame=0, disposed=false;
    const dpr=()=>Math.min(window.devicePixelRatio||1, window.innerWidth<700?1.15:1.5);
    try { gl=canvas.getContext('webgl',{alpha:false,antialias:false,powerPreference:'low-power'}); } catch {}
    if(!gl){ canvas.classList.add('aurora-fallback'); return ()=>{}; }
    const compile=(type,source)=>{const shader=gl.createShader(type);gl.shaderSource(shader,source);gl.compileShader(shader);if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS)){gl.deleteShader(shader);throw new Error('Aurora shader compile failed');}return shader;};
    try {
      const vs=compile(gl.VERTEX_SHADER,VERTEX), fs=compile(gl.FRAGMENT_SHADER,FRAGMENT);
      program=gl.createProgram();gl.attachShader(program,vs);gl.attachShader(program,fs);gl.linkProgram(program);
      if(!gl.getProgramParameter(program,gl.LINK_STATUS)) throw new Error('Aurora shader link failed');
      gl.useProgram(program);
      const buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),gl.STATIC_DRAW);
      const pos=gl.getAttribLocation(program,'a_position');gl.enableVertexAttribArray(pos);gl.vertexAttribPointer(pos,2,gl.FLOAT,false,0,0);
      const resolution=gl.getUniformLocation(program,'u_resolution'), time=gl.getUniformLocation(program,'u_time');
      const resize=()=>{const ratio=dpr(),w=Math.max(1,Math.floor(canvas.clientWidth*ratio)),h=Math.max(1,Math.floor(canvas.clientHeight*ratio));if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;gl.viewport(0,0,w,h);}gl.uniform2f(resolution,w,h);};
      resizeObserver=typeof ResizeObserver!=='undefined'?new ResizeObserver(resize):null;resizeObserver?.observe(canvas);window.addEventListener('resize',resize,{passive:true});resize();
      const draw=now=>{if(disposed)return;raf=requestAnimationFrame(draw);if(document.hidden)return;if(!reduced&&now-lastFrame<16)return;lastFrame=now;gl.uniform1f(time,reduced?0:(now-start)/1000);gl.drawArrays(gl.TRIANGLES,0,6);};
      gl.clearColor(.004,.008,.02,1);gl.clear(gl.COLOR_BUFFER_BIT);raf=requestAnimationFrame(draw);
      return ()=>{disposed=true;cancelAnimationFrame(raf);resizeObserver?.disconnect();window.removeEventListener('resize',resize);if(program)gl.deleteProgram(program);};
    } catch {
      canvas.classList.add('aurora-fallback');
      return ()=>{disposed=true;cancelAnimationFrame(raf);resizeObserver?.disconnect();};
    }
  },[]);
  return <div className="aurora-stage" aria-hidden="true"><canvas ref={canvasRef} className="aurora-canvas" /></div>;
}
