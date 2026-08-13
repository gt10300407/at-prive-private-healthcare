(()=>{
  const header=document.getElementById('siteHeader'),scroller=document.querySelector('.snap-shell');
  const onScroll=()=>header?.classList.toggle('scrolled',(scroller?.scrollTop||window.scrollY)>40);scroller?.addEventListener('scroll',onScroll,{passive:true});window.addEventListener('scroll',onScroll,{passive:true});
  const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible')}),{threshold:.1});document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));
  const toggle=document.getElementById('menuToggle'),menu=document.getElementById('mobileMenu');toggle?.addEventListener('click',()=>{const open=!menu.classList.contains('open');menu.classList.toggle('open',open);menu.setAttribute('aria-hidden',String(!open));toggle.setAttribute('aria-expanded',String(open))});menu?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{menu.classList.remove('open');menu.setAttribute('aria-hidden','true');toggle?.setAttribute('aria-expanded','false')}));
  const fab=document.getElementById('conciergeFab'),panel=document.getElementById('conciergePanel'),panelClose=document.getElementById('panelClose');fab?.addEventListener('click',()=>{panel.classList.add('open');panel.setAttribute('aria-hidden','false')});panelClose?.addEventListener('click',()=>{panel.classList.remove('open');panel.setAttribute('aria-hidden','true')});panel?.querySelector('a')?.addEventListener('click',()=>panel.classList.remove('open'));
  const form=document.getElementById('privateForm');form?.addEventListener('submit',e=>{e.preventDefault();const d=new FormData(form);const subject=`[at PRIVÉ Private Inquiry] ${d.get('name')||''} / ${d.get('interest')||''}`;const body=`이름 / 기관명: ${d.get('name')||''}\n국가: ${d.get('country')||''}\n연락처: ${d.get('contact')||''}\n관심 분야: ${d.get('interest')||''}\n\n문의 내용:\n${d.get('message')||''}\n\n※ 초기 문의에는 민감한 의료정보를 포함하지 마세요.`;location.href=`mailto:atinc@atinc.co.kr?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`});
  // V7 Private Access Atlas — a quiet, curated network rather than radial routes.
  // The globe stays completely fixed. Connections unfold as a regional access chain,
  // beginning at KOREA and moving through real land-based hubs. No moving projectile dots.
  const canvas=document.getElementById('networkCanvas'); if(!canvas) return;
  const ctx=canvas.getContext('2d');
  const globeImg=new Image(); globeImg.src='assets/img/globe-luxury.png';
  let w=0,h=0,dpr=1;
  const GOLD='217,199,161', GOLD_DEEP='183,150,92', ASSET=1800;

  const NODES={
    KOREA:{name:'KOREA',px:1118,py:800,home:true,dx:19,dy:-18},
    CHINA:{name:'CHINA',px:980,py:820,dx:-62,dy:-15},
    JAPAN:{name:'JAPAN',px:1240,py:842,dx:18,dy:-8},
    INDIA:{px:625,py:1085},
    SEA:{name:'SOUTHEAST ASIA',px:865,py:1235,dx:-18,dy:28},
    SINGAPORE:{px:815,py:1315},
    INDONESIA:{px:900,py:1400},
    MIDDLE:{name:'MIDDLE EAST',px:270,py:890,dx:18,dy:-9},
    AUS_W:{px:875,py:1580},
    AUSTRALIA:{name:'AUSTRALIA',px:1035,py:1585,dx:18,dy:17},
    AUS_E:{px:1165,py:1585},
    N_CHINA:{px:900,py:745},
    S_CHINA:{px:1010,py:930},
    VIETNAM:{px:900,py:1115}
  };

  // Routes form a curated regional network. Only the first two originate directly from Korea;
  // the rest continue from one regional access point to the next, avoiding a starburst effect.
  const ROUTES=[
    {from:'KOREA',to:'CHINA',curve:-.11,label:'CHINA'},
    {from:'KOREA',to:'JAPAN',curve:.15,label:'JAPAN'},
    {from:'CHINA',to:'N_CHINA',curve:-.08},
    {from:'CHINA',to:'S_CHINA',curve:.08},
    {from:'S_CHINA',to:'VIETNAM',curve:.10},
    {from:'VIETNAM',to:'SEA',curve:.08,label:'SOUTHEAST ASIA'},
    {from:'SEA',to:'SINGAPORE',curve:.08},
    {from:'SINGAPORE',to:'INDONESIA',curve:.10},
    {from:'INDONESIA',to:'AUS_W',curve:.10},
    {from:'AUS_W',to:'AUSTRALIA',curve:.07,label:'AUSTRALIA'},
    {from:'AUSTRALIA',to:'AUS_E',curve:.06},
    {from:'CHINA',to:'INDIA',curve:-.14},
    {from:'INDIA',to:'MIDDLE',curve:-.12,label:'MIDDLE EAST'}
  ];

  // After the visible network is complete, just three faint continuation paths leave regional hubs
  // toward the hidden hemisphere. They do not originate from Korea and do not carry labels.
  const CONTINUITY=[
    {from:'MIDDLE',a:-2.88,curve:-.12},
    {from:'N_CHINA',a:-1.80,curve:-.10},
    {from:'AUS_E',a:.54,curve:.12}
  ];

  function resize(){
    dpr=Math.min(devicePixelRatio||1,2); w=canvas.clientWidth; h=canvas.clientHeight;
    canvas.width=w*dpr; canvas.height=h*dpr; ctx.setTransform(dpr,0,0,dpr,0,0);
  }
  function frameGeom(){const R=Math.min(w,h)*.455; return {cx:w*.735,cy:h*.505,R}}
  function assetPoint(item){const {cx,cy,R}=frameGeom();return{x:cx-R+(item.px/ASSET)*(R*2),y:cy-R+(item.py/ASSET)*(R*2)}}
  function drawGlobe(){
    const {cx,cy,R}=frameGeom();
    if(globeImg.complete&&globeImg.naturalWidth){ctx.save();ctx.globalAlpha=.88;ctx.drawImage(globeImg,cx-R,cy-R,R*2,R*2);ctx.restore()}
    else{ctx.strokeStyle=`rgba(${GOLD},.22)`;ctx.lineWidth=1;ctx.beginPath();ctx.arc(cx,cy,R,0,Math.PI*2);ctx.stroke()}
    // very restrained jewellery grid
    ctx.save();ctx.strokeStyle=`rgba(${GOLD},.033)`;ctx.lineWidth=.5;
    [-.55,-.28,0,.28,.55].forEach(v=>{ctx.beginPath();ctx.ellipse(cx,cy+v*R,R*Math.sqrt(1-v*v),R*.12,0,0,Math.PI*2);ctx.stroke()});
    [-.50,-.22,.22,.50].forEach(v=>{ctx.beginPath();ctx.ellipse(cx,cy,R*Math.sqrt(1-v*v),R,.08,0,Math.PI*2);ctx.stroke()});
    ctx.restore();
  }
  function bezierPoint(a,b,t,curve=.12){
    const dx=b.x-a.x,dy=b.y-a.y,len=Math.max(1,Math.hypot(dx,dy));
    const nx=-dy/len,ny=dx/len,mx=(a.x+b.x)/2,my=(a.y+b.y)/2,offset=len*curve;
    const c={x:mx+nx*offset,y:my+ny*offset},u=1-t;
    return{x:u*u*a.x+2*u*t*c.x+t*t*b.x,y:u*u*a.y+2*u*t*c.y+t*t*b.y};
  }
  function ease(t){return t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2}

  function drawFilament(a,b,progress,{curve=.12,active=false,complete=false,alpha=.48}={}){
    if(progress<=0)return;
    const steps=86,stop=Math.max(1,Math.floor(steps*Math.min(1,progress)));
    // soft bloom under the hairline — no travelling particle
    ctx.save();ctx.lineCap='round';
    ctx.beginPath();
    for(let i=0;i<=stop;i++){const p=bezierPoint(a,b,i/steps,curve);i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y)}
    ctx.strokeStyle=`rgba(${GOLD},${active?.10:complete?.035:.06})`;ctx.lineWidth=active?5.2:3.5;ctx.shadowColor=`rgba(${GOLD},${active?.22:.08})`;ctx.shadowBlur=active?13:6;ctx.stroke();
    ctx.shadowBlur=0;ctx.beginPath();
    for(let i=0;i<=stop;i++){const p=bezierPoint(a,b,i/steps,curve);i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y)}
    ctx.strokeStyle=`rgba(${GOLD},${active?alpha:complete?.22:.32})`;ctx.lineWidth=active?1.15:.72;ctx.stroke();ctx.restore();
  }

  function drawNode(item,{active=false,visible=true,home=false,labelAlpha=1}={}){
    if(!visible)return; const p=assetPoint(item),now=performance.now();
    ctx.save();
    if(home){
      const wave=((now%5600)/5600),r=9+wave*18;
      ctx.strokeStyle=`rgba(255,232,188,${.30*(1-wave)})`;ctx.lineWidth=.8;ctx.beginPath();ctx.arc(p.x,p.y,r,0,Math.PI*2);ctx.stroke();
    }
    const pulse=home?7.5:active?6.4:4.6;
    ctx.fillStyle=home?'rgba(255,239,207,.98)':`rgba(${GOLD},${active?.78:.50})`;
    ctx.shadowColor=home?'rgba(255,226,169,.65)':`rgba(${GOLD},${active?.38:.12})`;ctx.shadowBlur=home?17:active?11:4;
    ctx.beginPath();ctx.arc(p.x,p.y,home?3.1:2.1,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;
    ctx.strokeStyle=home?'rgba(255,237,202,.75)':`rgba(${GOLD_DEEP},${active?.62:.38})`;ctx.lineWidth=.9;ctx.beginPath();ctx.arc(p.x,p.y,pulse,0,Math.PI*2);ctx.stroke();
    if(item.name&&labelAlpha>0){ctx.globalAlpha=labelAlpha;ctx.font=`600 ${home?13:10.5}px "Noto Sans KR","Apple SD Gothic Neo",sans-serif`;ctx.fillStyle=home?'rgba(248,240,222,.96)':`rgba(${GOLD},.76)`;ctx.fillText(item.name,p.x+(item.dx||12),p.y+(item.dy||-8))}
    ctx.restore();
  }

  function draw(){
    ctx.clearRect(0,0,w,h); drawGlobe();
    const total=52000,t=performance.now()%total;
    const start=1500,gap=3100,duration=2350;
    const state={};
    Object.keys(NODES).forEach(k=>state[k]={visible:k==='KOREA',active:false,labelAlpha:k==='KOREA'?1:0});

    ROUTES.forEach((route,i)=>{
      const raw=(t-(start+i*gap))/duration,p=ease(Math.max(0,Math.min(1,raw)));
      if(raw<=0)return;
      state[route.from].visible=true;state[route.to].visible=true;
      state[route.to].active=raw<1.15;state[route.to].labelAlpha=Math.max(0,Math.min(1,(raw-.60)/.30));
      drawFilament(assetPoint(NODES[route.from]),assetPoint(NODES[route.to]),p,{curve:route.curve,active:raw>0&&raw<1,complete:raw>=1,alpha:.62});
    });

    // quiet continuity: only after all visible land routes are complete
    const continuityStart=start+(ROUTES.length-1)*gap+duration+1800,{cx,cy,R}=frameGeom();
    CONTINUITY.forEach((route,i)=>{
      const raw=(t-(continuityStart+i*2500))/2600,p=ease(Math.max(0,Math.min(1,raw))); if(raw<=0)return;
      const a=assetPoint(NODES[route.from]),b={x:cx+Math.cos(route.a)*R*.985,y:cy+Math.sin(route.a)*R*.985};
      drawFilament(a,b,p,{curve:route.curve,active:raw<1,complete:raw>=1,alpha:.20});
      if(raw>=.72){const fade=Math.min(1,(raw-.72)/.28);ctx.save();ctx.fillStyle=`rgba(${GOLD},${.22*fade})`;ctx.shadowColor=`rgba(${GOLD},${.15*fade})`;ctx.shadowBlur=8;ctx.beginPath();ctx.arc(b.x,b.y,2.3,0,Math.PI*2);ctx.fill();ctx.restore()}
    });

    // Draw nodes last so the access points sit above the filaments.
    Object.entries(NODES).forEach(([key,item])=>drawNode(item,{...state[key],home:key==='KOREA'}));

    // Once the atlas is complete, the whole network simply breathes rather than firing again.
    const settled=continuityStart+(CONTINUITY.length-1)*2500+3200;
    if(t>settled&&t<settled+7000){const glow=.018+.012*Math.sin((t-settled)/900);const {cx,cy,R}=frameGeom();ctx.save();ctx.strokeStyle=`rgba(${GOLD},${glow})`;ctx.lineWidth=10;ctx.shadowColor=`rgba(${GOLD},${glow})`;ctx.shadowBlur=26;ctx.beginPath();ctx.arc(cx,cy,R*.965,0,Math.PI*2);ctx.stroke();ctx.restore()}
    if(t>50000){const fade=(t-50000)/2000;ctx.fillStyle=`rgba(8,8,7,${Math.min(.56,fade*.56)})`;ctx.fillRect(0,0,w,h)}
    requestAnimationFrame(draw);
  }
  window.addEventListener('resize',resize); globeImg.onload=()=>resize(); resize(); draw();
})();
