(()=>{
  const header=document.getElementById('siteHeader'),scroller=document.querySelector('.snap-shell');
  const onScroll=()=>header?.classList.toggle('scrolled',(scroller?.scrollTop||window.scrollY)>40);scroller?.addEventListener('scroll',onScroll,{passive:true});window.addEventListener('scroll',onScroll,{passive:true});
  const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible')}),{threshold:.1});document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));
  const toggle=document.getElementById('menuToggle'),menu=document.getElementById('mobileMenu');toggle?.addEventListener('click',()=>{const open=!menu.classList.contains('open');menu.classList.toggle('open',open);menu.setAttribute('aria-hidden',String(!open));toggle.setAttribute('aria-expanded',String(open))});menu?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{menu.classList.remove('open');menu.setAttribute('aria-hidden','true');toggle?.setAttribute('aria-expanded','false')}));
  const fab=document.getElementById('conciergeFab'),panel=document.getElementById('conciergePanel'),panelClose=document.getElementById('panelClose');fab?.addEventListener('click',()=>{panel.classList.add('open');panel.setAttribute('aria-hidden','false')});panelClose?.addEventListener('click',()=>{panel.classList.remove('open');panel.setAttribute('aria-hidden','true')});panel?.querySelector('a')?.addEventListener('click',()=>panel.classList.remove('open'));
  const form=document.getElementById('privateForm');form?.addEventListener('submit',e=>{e.preventDefault();const d=new FormData(form);const subject=`[at PRIVÉ Private Inquiry] ${d.get('name')||''} / ${d.get('interest')||''}`;const body=`이름 / 기관명: ${d.get('name')||''}\n국가: ${d.get('country')||''}\n연락처: ${d.get('contact')||''}\n관심 분야: ${d.get('interest')||''}\n\n문의 내용:\n${d.get('message')||''}\n\n※ 초기 문의에는 민감한 의료정보를 포함하지 마세요.`;location.href=`mailto:atinc@atinc.co.kr?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`});
  // Fixed luxury globe: the globe itself never rotates. Hubs and routes illuminate in sequence.
  const canvas = document.getElementById('networkCanvas'); if(!canvas) return;
  const ctx = canvas.getContext('2d');
  let w=0,h=0,dpr=1,frame=0;
  const GOLD=[217,199,161], GOLD_DEEP=[183,150,92];
  const HUBS=[
    {name:'KOREA',lat:37.56,lon:126.98,home:true},
    {name:'JAPAN',lat:35.68,lon:139.76},
    {name:'ASIA PACIFIC',lat:1.35,lon:103.82},
    {name:'MIDDLE EAST',lat:25.2,lon:55.27},
    {name:'EUROPE',lat:48.85,lon:2.35},
    {name:'NORTH AMERICA',lat:34.05,lon:-118.24}
  ];
  const rad=v=>v*Math.PI/180;
  // Deterministic spherical points. No random movement, no rotation.
  const pts=Array.from({length:920},(_,i)=>{
    const y=1-(i/(919))*2;
    const r=Math.sqrt(Math.max(0,1-y*y));
    const theta=Math.PI*(3-Math.sqrt(5))*i;
    return {x:Math.cos(theta)*r,y,z:Math.sin(theta)*r,s:.55+((i*37)%100)/120};
  });
  const fixedYaw=-.63, fixedPitch=.10;
  function resize(){dpr=Math.min(devicePixelRatio||1,2);w=canvas.clientWidth;h=canvas.clientHeight;canvas.width=w*dpr;canvas.height=h*dpr;ctx.setTransform(dpr,0,0,dpr,0,0)}
  function rotateXYZ(x,y,z){
    const cy=Math.cos(fixedYaw),sy=Math.sin(fixedYaw);let x1=x*cy-z*sy,z1=x*sy+z*cy;
    const cp=Math.cos(fixedPitch),sp=Math.sin(fixedPitch);let y1=y*cp-z1*sp,z2=y*sp+z1*cp;
    return {x:x1,y:y1,z:z2};
  }
  function projectXYZ(x,y,z){const q=rotateXYZ(x,y,z);const R=Math.min(w,h)*.43;return{x:w*.72+q.x*R,y:h*.51-q.y*R,z:q.z,R}}
  function projectLatLon(lat,lon){const la=rad(lat),lo=rad(lon);return projectXYZ(Math.cos(la)*Math.cos(lo),Math.sin(la),Math.cos(la)*Math.sin(lo))}
  function bezier(a,b,t,arch=105){const mx=(a.x+b.x)/2,my=Math.min(a.y,b.y)-arch;const u=1-t;return{x:u*u*a.x+2*u*t*mx+t*t*b.x,y:u*u*a.y+2*u*t*my+t*t*b.y}}
  function draw(){
    frame++;
    ctx.clearRect(0,0,w,h);
    const center=projectXYZ(0,0,0), R=Math.min(w,h)*.43;
    const glow=ctx.createRadialGradient(w*.72,h*.51,R*.06,w*.72,h*.51,R*1.15);glow.addColorStop(0,'rgba(185,150,92,.16)');glow.addColorStop(.62,'rgba(185,150,92,.045)');glow.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=glow;ctx.fillRect(0,0,w,h);
    // sphere silhouette / rim
    ctx.strokeStyle='rgba(217,199,161,.17)';ctx.lineWidth=1;ctx.beginPath();ctx.arc(w*.72,h*.51,R,0,Math.PI*2);ctx.stroke();
    pts.forEach((p,i)=>{const q=projectXYZ(p.x,p.y,p.z);if(q.z<-.13)return;const depth=(q.z+1)/2;const a=.11+.42*depth*p.s;ctx.fillStyle=`rgba(${GOLD[0]},${GOLD[1]},${GOLD[2]},${a})`;ctx.beginPath();ctx.arc(q.x,q.y,.75+1.05*depth*p.s,0,Math.PI*2);ctx.fill()});
    const projected=HUBS.map(h=>({...h,p:projectLatLon(h.lat,h.lon)}));
    const home=projected[0];
    // sequence: each target gets ~2.2 sec. No globe rotation.
    const seq=((performance.now()/2200)|0)%(projected.length-1)+1;
    projected.slice(1).forEach((hub,i)=>{if(home.p.z<-.25||hub.p.z<-.25)return;const active=i+1===seq;ctx.strokeStyle=active?'rgba(217,199,161,.66)':'rgba(217,199,161,.10)';ctx.lineWidth=active?1.35:.8;ctx.setLineDash(active?[5,7]:[2,9]);ctx.beginPath();const mx=(home.p.x+hub.p.x)/2,my=Math.min(home.p.y,hub.p.y)-95-(i%2)*28;ctx.moveTo(home.p.x,home.p.y);ctx.quadraticCurveTo(mx,my,hub.p.x,hub.p.y);ctx.stroke();ctx.setLineDash([]);
      if(active){const tt=(performance.now()%2200)/2200;const b=bezier(home.p,hub.p,tt,95+(i%2)*28);ctx.fillStyle='rgba(255,235,192,.95)';ctx.shadowColor='rgba(217,199,161,.9)';ctx.shadowBlur=18;ctx.beginPath();ctx.arc(b.x,b.y,3.4,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;}
    });
    projected.forEach((hub,i)=>{if(hub.p.z<-.28)return;const active=i===0||i===seq;const pulse=active?8+3*Math.sin(performance.now()/220):6;ctx.strokeStyle=active?'rgba(255,232,185,.9)':'rgba(183,150,92,.45)';ctx.fillStyle=active?'rgba(255,232,185,.96)':'rgba(183,150,92,.68)';ctx.lineWidth=1.2;ctx.beginPath();ctx.arc(hub.p.x,hub.p.y,active?3.2:2.4,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(hub.p.x,hub.p.y,pulse,0,Math.PI*2);ctx.stroke();ctx.font=`600 ${i===0?13:12}px "Noto Sans KR", sans-serif`;ctx.fillStyle=active?'rgba(244,235,214,.96)':'rgba(217,199,161,.68)';ctx.fillText(hub.name,hub.p.x+13,hub.p.y-10)});
    requestAnimationFrame(draw);
  }
  window.addEventListener('resize',resize);resize();draw();
})();