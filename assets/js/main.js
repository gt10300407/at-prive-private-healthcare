(()=>{
  const header=document.getElementById('siteHeader'),scroller=document.querySelector('.snap-shell');
  const onScroll=()=>header?.classList.toggle('scrolled',(scroller?.scrollTop||window.scrollY)>40);scroller?.addEventListener('scroll',onScroll,{passive:true});window.addEventListener('scroll',onScroll,{passive:true});
  const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible')}),{threshold:.1});document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));
  const toggle=document.getElementById('menuToggle'),menu=document.getElementById('mobileMenu');toggle?.addEventListener('click',()=>{const open=!menu.classList.contains('open');menu.classList.toggle('open',open);menu.setAttribute('aria-hidden',String(!open));toggle.setAttribute('aria-expanded',String(open))});menu?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{menu.classList.remove('open');menu.setAttribute('aria-hidden','true');toggle?.setAttribute('aria-expanded','false')}));
  const fab=document.getElementById('conciergeFab'),panel=document.getElementById('conciergePanel'),panelClose=document.getElementById('panelClose');fab?.addEventListener('click',()=>{panel.classList.add('open');panel.setAttribute('aria-hidden','false')});panelClose?.addEventListener('click',()=>{panel.classList.remove('open');panel.setAttribute('aria-hidden','true')});panel?.querySelector('a')?.addEventListener('click',()=>panel.classList.remove('open'));
  const form=document.getElementById('privateForm');form?.addEventListener('submit',e=>{e.preventDefault();const d=new FormData(form);const subject=`[at PRIVÉ Private Inquiry] ${d.get('name')||''} / ${d.get('interest')||''}`;const body=`이름 / 기관명: ${d.get('name')||''}\n국가: ${d.get('country')||''}\n연락처: ${d.get('contact')||''}\n관심 분야: ${d.get('interest')||''}\n\n문의 내용:\n${d.get('message')||''}\n\n※ 초기 문의에는 민감한 의료정보를 포함하지 마세요.`;location.href=`mailto:atinc@atinc.co.kr?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`});
  // V6 fixed geographic globe — actual land destinations, slower sequential illumination.
  // The globe image never rotates. Korea is the origin, and every visible destination is anchored
  // to a real land position on the artwork. Faint horizon routes only appear after the named/land
  // connections have completed, suggesting access beyond the visible hemisphere.
  const canvas=document.getElementById('networkCanvas'); if(!canvas) return;
  const ctx=canvas.getContext('2d');
  const globeImg=new Image(); globeImg.src='assets/img/globe-luxury.png';
  let w=0,h=0,dpr=1;
  const GOLD='217,199,161', GOLD_DEEP='183,150,92', ASSET=1800;

  const HOME={name:'KOREA',px:1118,py:800,home:true,dx:17,dy:-16};
  // Named hubs intentionally kept sparse. CHINA is explicitly represented and placed on East China.
  const HUBS=[
    {name:'CHINA',px:980,py:820,dx:-64,dy:-16,curve:-.14},
    {name:'JAPAN',px:1240,py:842,dx:18,dy:-8,curve:.18},
    {name:'SOUTHEAST ASIA',px:865,py:1235,dx:-8,dy:25,curve:.18},
    {name:'MIDDLE EAST',px:270,py:890,dx:18,dy:-8,curve:-.20},
    {name:'AUSTRALIA',px:1035,py:1585,dx:18,dy:15,curve:.16}
  ];
  // Secondary destinations are also land-anchored: China, India, Vietnam/Thailand, Singapore,
  // Indonesia, Australia and the Gulf. They stay unlabeled to keep the visual premium and quiet.
  const LAND_NODES=[
    {px:905,py:765,curve:-.11},{px:1010,py:900,curve:.10},{px:930,py:995,curve:.13},
    {px:620,py:1080,curve:-.16},{px:790,py:1130,curve:.12},{px:850,py:1280,curve:.16},
    {px:900,py:1390,curve:.17},{px:750,py:1320,curve:.14},{px:1110,py:1515,curve:.13},
    {px:965,py:1630,curve:.17},{px:360,py:835,curve:-.20}
  ];
  // Only a few horizon exits are used, after all land destinations illuminate.
  // These do not pretend to be named countries; they imply continuity to the hidden hemisphere.
  const HORIZON=[
    {a:-2.62,curve:-.24},{a:-2.05,curve:-.20},{a:-1.46,curve:-.15},{a:-.54,curve:.19},{a:.42,curve:.21}
  ];

  function resize(){
    dpr=Math.min(devicePixelRatio||1,2); w=canvas.clientWidth; h=canvas.clientHeight;
    canvas.width=w*dpr; canvas.height=h*dpr; ctx.setTransform(dpr,0,0,dpr,0,0);
  }
  function frameGeom(){const R=Math.min(w,h)*.455; return {cx:w*.735,cy:h*.505,R}}
  function assetPoint(px,py){const {cx,cy,R}=frameGeom();return{x:cx-R+(px/ASSET)*(R*2),y:cy-R+(py/ASSET)*(R*2)}}
  function drawGlobe(){
    const {cx,cy,R}=frameGeom();
    if(globeImg.complete&&globeImg.naturalWidth){ctx.save();ctx.globalAlpha=.89;ctx.drawImage(globeImg,cx-R,cy-R,R*2,R*2);ctx.restore()}
    else{ctx.strokeStyle=`rgba(${GOLD},.22)`;ctx.lineWidth=1;ctx.beginPath();ctx.arc(cx,cy,R,0,Math.PI*2);ctx.stroke()}
    // restrained latitude/longitude jewellery lines
    ctx.save();ctx.strokeStyle=`rgba(${GOLD},.045)`;ctx.lineWidth=.55;
    [-.55,-.28,0,.28,.55].forEach(v=>{ctx.beginPath();ctx.ellipse(cx,cy+v*R,R*Math.sqrt(1-v*v),R*.12,0,0,Math.PI*2);ctx.stroke()});
    [-.50,-.22,.22,.50].forEach(v=>{ctx.beginPath();ctx.ellipse(cx,cy,R*Math.sqrt(1-v*v),R,.08,0,Math.PI*2);ctx.stroke()});
    ctx.restore();
  }
  function bezierPoint(a,b,t,curve=.15){
    const dx=b.x-a.x,dy=b.y-a.y,len=Math.max(1,Math.hypot(dx,dy));
    const nx=-dy/len,ny=dx/len,mx=(a.x+b.x)/2,my=(a.y+b.y)/2,offset=len*curve;
    const cx=mx+nx*offset,cy=my+ny*offset,u=1-t;
    return{x:u*u*a.x+2*u*t*cx+t*t*b.x,y:u*u*a.y+2*u*t*cy+t*t*b.y};
  }
  function drawRoute(a,b,progress,{alpha=.5,width=1.05,curve=.15,particle=true}={}){
    if(progress<=0)return; const steps=64,stop=Math.max(1,Math.floor(steps*Math.min(progress,1)));
    ctx.save();ctx.lineWidth=width;ctx.strokeStyle=`rgba(${GOLD},${alpha})`;ctx.shadowColor=`rgba(${GOLD},${alpha*.28})`;ctx.shadowBlur=5;ctx.beginPath();
    for(let i=0;i<=stop;i++){const t=i/steps,p=bezierPoint(a,b,t,curve);if(i===0)ctx.moveTo(p.x,p.y);else ctx.lineTo(p.x,p.y)}ctx.stroke();ctx.shadowBlur=0;
    if(particle&&progress>0&&progress<1){const p=bezierPoint(a,b,progress,curve);ctx.fillStyle='rgba(255,242,214,.98)';ctx.shadowColor='rgba(255,225,166,.95)';ctx.shadowBlur=16;ctx.beginPath();ctx.arc(p.x,p.y,2.6,0,Math.PI*2);ctx.fill()}
    ctx.restore();
  }
  function drawHub(point,item,active=false){
    const home=!!item.home,pulse=active?8.5+1.5*Math.sin(performance.now()/240):5.4;
    ctx.save();ctx.strokeStyle=active?'rgba(255,235,194,.92)':`rgba(${GOLD_DEEP},.55)`;ctx.fillStyle=home?'rgba(255,238,204,.98)':`rgba(${GOLD},.62)`;ctx.lineWidth=1.1;
    ctx.beginPath();ctx.arc(point.x,point.y,home?3.4:2.3,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(point.x,point.y,pulse,0,Math.PI*2);ctx.stroke();
    if(item.name){ctx.font=`600 ${home?13:10.5}px "Noto Sans KR","Apple SD Gothic Neo",sans-serif`;ctx.fillStyle=active||home?'rgba(244,235,214,.96)':`rgba(${GOLD},.72)`;ctx.fillText(item.name,point.x+(item.dx||13),point.y+(item.dy||-9))}
    ctx.restore();
  }
  function drawSmallNode(point,active=false){ctx.save();ctx.strokeStyle=`rgba(${GOLD_DEEP},${active?.68:.30})`;ctx.fillStyle=`rgba(${GOLD},${active?.16:.06})`;ctx.lineWidth=.9;ctx.beginPath();ctx.arc(point.x,point.y,active?5.4:3.8,0,Math.PI*2);ctx.fill();ctx.stroke();ctx.restore()}
  function ease(t){return t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2}

  function draw(){
    ctx.clearRect(0,0,w,h); drawGlobe();
    const home={item:HOME,p:assetPoint(HOME.px,HOME.py)};
    const named=HUBS.map(item=>({item,p:assetPoint(item.px,item.py),active:false}));
    const total=36000,t=performance.now()%total;

    // Slow named sequence: one connection is deliberately given time to breathe before the next.
    const namedStart=1200, namedGap=3150, namedDuration=2200;
    named.forEach((entry,i)=>{
      const start=namedStart+i*namedGap,raw=(t-start)/namedDuration,progress=ease(Math.max(0,Math.min(1,raw)));
      const complete=raw>=1; drawRoute(home.p,entry.p,progress,{alpha:complete?.32:.76,width:complete?.9:1.35,curve:entry.item.curve,particle:raw>0&&raw<1});
      entry.active=raw>0&&raw<1.12;
    });

    // Secondary real-land destinations follow more slowly, never as a random spray.
    const landStart=namedStart+(HUBS.length-1)*namedGap+namedDuration+1400,landGap=950,landDuration=1900;
    LAND_NODES.forEach((node,i)=>{
      const p=assetPoint(node.px,node.py),raw=(t-(landStart+i*landGap))/landDuration,progress=ease(Math.max(0,Math.min(1,raw)));
      if(raw>0)drawRoute(home.p,p,progress,{alpha:raw>=1?.16:.34,width:.72,curve:node.curve,particle:raw>0&&raw<1});
      if(raw>0)drawSmallNode(p,raw<1.1);
    });

    // A final, quiet outward bloom appears only after every visible land destination is connected.
    const horizonStart=landStart+(LAND_NODES.length-1)*landGap+landDuration+1800,{cx,cy,R}=frameGeom();
    HORIZON.forEach((node,i)=>{
      const raw=(t-(horizonStart+i*1050))/2300,progress=ease(Math.max(0,Math.min(1,raw))); if(raw<=0)return;
      const end={x:cx+Math.cos(node.a)*R*.985,y:cy+Math.sin(node.a)*R*.985};
      drawRoute(home.p,end,progress,{alpha:raw>=1?.075:.16,width:.58,curve:node.curve,particle:false});
    });

    named.forEach(entry=>drawHub(entry.p,entry.item,entry.active)); drawHub(home.p,HOME,true);
    if(t>33800){const fade=(t-33800)/2200;ctx.fillStyle=`rgba(8,8,7,${Math.min(.72,fade*.72)})`;ctx.fillRect(0,0,w,h)}
    requestAnimationFrame(draw);
  }
  window.addEventListener('resize',resize); globeImg.onload=()=>resize(); resize(); draw();
})();
