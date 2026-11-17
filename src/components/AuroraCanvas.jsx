import { useEffect, useRef } from 'react';

const VERTEX = `attribute vec2 a_position; void main(){ gl_Position=vec4(a_position,0.0,1.0); }`;
const FRAGMENT = `
precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;
float hash(vec2 p){ return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453); }
float noise(vec2 p){ vec2 i=floor(p),f=fract(p); f=f*f*(3.0-2.0*f); return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),f.x),f.y); }
float fbm(vec2 p){ float v=0.0,a=.5; for(int i=0;i<4;i++){v+=a*noise(p);p*=2.02;a*=.5;} return v; }
void main(){
  vec2 uv=gl_FragCoord.xy/u_resolution.xy;
  float t=u_time;
  float n=fbm(vec2(uv.x*2.6+t*.16,uv.y*3.2-t*.08));
  float x=uv.x;
  float w1=.58+sin(x*5.2+t*.62+n*3.6)*.12+sin(x*10.0-t*.23)*.025;
  float w2=.76+sin(x*3.8-t*.48+n*4.0)*.105;
  float w3=.39+sin(x*6.8+t*.34+n*3.0)*.085;
  float strands=exp(-pow((uv.y-w1)/.105,2.0))*0.9+exp(-pow((uv.y-w2)/.13,2.0))*.62+exp(-pow((uv.y-w3)/.085,2.0))*.42;
  float curtains=.58+.42*fbm(vec2(x*7.0-t*.22,uv.y*2.2+t*.12));
  float veil=strands*curtains*smoothstep(.05,.36,uv.y)*(1.0-smoothstep(.87,1.0,uv.y));
  vec3 emerald=vec3(.0,1.0,.48),cyan=vec3(.0,.78,1.0),violet=vec3(.48,.16,1.0),magenta=vec3(1.0,.12,.52);
  float hue=.5+.5*sin(x*3.4+t*.18);
  vec3 color=mix(mix(emerald,cyan,hue),mix(violet,magenta,1.0-hue),smoothstep(.38,.96,x));
  float shimmer=.78+.22*sin(x*24.0+t*1.4+n*7.0);
  vec3 base=vec3(.006,.012,.03);
  vec3 outColor=base+color*veil*shimmer*.68;
  float glow=exp(-pow((uv.y-(w1+.015))/.22,2.0))*0.12;
  outColor+=mix(emerald,cyan,hue)*glow;
  float vignette=1.0-.28*smoothstep(.2,.85,length((uv-.5)*vec2(.9,1.0)));
  gl_FragColor=vec4(outColor*vignette,1.0);
}`;

export default function AuroraCanvas(){
  const canvasRef=useRef(null);
  useEffect(()=>{
    const canvas=canvasRef.current;
    if(!canvas) return;
    let gl=null,program=null,buffer=null,raf=0,observer=null,disposed=false,lastFrame=0;
    const reduced=window.matchMedia?.('(prefers-reduced-motion: reduce)').matches || false;
    const pixelRatio=()=>Math.min(window.devicePixelRatio||1,window.innerWidth<760?1.2:1.5);
    try{ gl=canvas.getContext('webgl',{alpha:true,antialias:false,powerPreference:'low-power',preserveDrawingBuffer:false}) || canvas.getContext('experimental-webgl'); }catch{}
    if(!gl){canvas.classList.add('webgl-unavailable');return ()=>{};}
    const compile=(type,source)=>{
      const shader=gl.createShader(type);gl.shaderSource(shader,source);gl.compileShader(shader);
      if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS)){const info=gl.getShaderInfoLog(shader);gl.deleteShader(shader);throw new Error(info||'Shader compile failed');}
      return shader;
    };
    try{
      const vs=compile(gl.VERTEX_SHADER,VERTEX),fs=compile(gl.FRAGMENT_SHADER,FRAGMENT);
      program=gl.createProgram();gl.attachShader(program,vs);gl.attachShader(program,fs);gl.linkProgram(program);
      if(!gl.getProgramParameter(program,gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program)||'Shader link failed');
      gl.useProgram(program);
      buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);
      gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),gl.STATIC_DRAW);
      const position=gl.getAttribLocation(program,'a_position');gl.enableVertexAttribArray(position);gl.vertexAttribPointer(position,2,gl.FLOAT,false,0,0);
      const resolution=gl.getUniformLocation(program,'u_resolution'),time=gl.getUniformLocation(program,'u_time');
      const resize=()=>{
        const ratio=pixelRatio(),w=Math.max(1,Math.floor(canvas.clientWidth*ratio)),h=Math.max(1,Math.floor(canvas.clientHeight*ratio));
        if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;gl.viewport(0,0,w,h);}
        gl.useProgram(program);gl.uniform2f(resolution,w,h);
      };
      observer=typeof ResizeObserver!=='undefined'?new ResizeObserver(resize):null;observer?.observe(canvas);
      window.addEventListener('resize',resize,{passive:true});resize();
      const start=performance.now();
      const draw=now=>{
        if(disposed)return;
        raf=requestAnimationFrame(draw);
        if(document.hidden || now-lastFrame<15)return;
        lastFrame=now;
        gl.useProgram(program);
        // Reduced-motion users still get a slow living aurora rather than a frozen frame.
        gl.uniform1f(time,((now-start)/1000)*(reduced?.22:.72));
        gl.drawArrays(gl.TRIANGLES,0,6);
      };
      raf=requestAnimationFrame(draw);
      const onContextLost=e=>{e.preventDefault();cancelAnimationFrame(raf);canvas.classList.add('webgl-unavailable');};
      canvas.addEventListener('webglcontextlost',onContextLost);
      return ()=>{disposed=true;cancelAnimationFrame(raf);observer?.disconnect();window.removeEventListener('resize',resize);canvas.removeEventListener('webglcontextlost',onContextLost);if(buffer)gl.deleteBuffer(buffer);if(program)gl.deleteProgram(program);};
    }catch(error){
      console.warn('Money OS aurora shader unavailable; CSS aurora ribbons remain active.',error);
      canvas.classList.add('webgl-unavailable');
      return ()=>{disposed=true;cancelAnimationFrame(raf);observer?.disconnect();if(buffer)gl.deleteBuffer(buffer);if(program)gl.deleteProgram(program);};
    }
  },[]);
  return <div className="aurora-stage" aria-hidden="true">
    <canvas ref={canvasRef} className="aurora-canvas" />
    <div className="aurora-ribbon aurora-ribbon--emerald" />
    <div className="aurora-ribbon aurora-ribbon--cyan" />
    <div className="aurora-ribbon aurora-ribbon--violet" />
    <div className="aurora-ribbon aurora-ribbon--magenta" />
  </div>;
}
