(()=>{
  const header=document.getElementById('siteHeader'),scroller=document.querySelector('.snap-shell');
  const onScroll=()=>header?.classList.toggle('scrolled',(scroller?.scrollTop||window.scrollY)>40);scroller?.addEventListener('scroll',onScroll,{passive:true});window.addEventListener('scroll',onScroll,{passive:true});
  const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible')}),{threshold:.1});document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));
  const toggle=document.getElementById('menuToggle'),menu=document.getElementById('mobileMenu');toggle?.addEventListener('click',()=>{const open=!menu.classList.contains('open');menu.classList.toggle('open',open);menu.setAttribute('aria-hidden',String(!open));toggle.setAttribute('aria-expanded',String(open))});menu?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{menu.classList.remove('open');menu.setAttribute('aria-hidden','true');toggle?.setAttribute('aria-expanded','false')}));
  const fab=document.getElementById('conciergeFab'),panel=document.getElementById('conciergePanel'),panelClose=document.getElementById('panelClose');fab?.addEventListener('click',()=>{panel.classList.add('open');panel.setAttribute('aria-hidden','false')});panelClose?.addEventListener('click',()=>{panel.classList.remove('open');panel.setAttribute('aria-hidden','true')});panel?.querySelector('a')?.addEventListener('click',()=>panel.classList.remove('open'));
  const form=document.getElementById('privateForm');form?.addEventListener('submit',e=>{e.preventDefault();const d=new FormData(form);const subject=`[at PRIVÉ Private Inquiry] ${d.get('name')||''} / ${d.get('interest')||''}`;const body=`이름 / 기관명: ${d.get('name')||''}\n국가: ${d.get('country')||''}\n연락처: ${d.get('contact')||''}\n관심 분야: ${d.get('interest')||''}\n\n문의 내용:\n${d.get('message')||''}\n\n※ 초기 문의에는 민감한 의료정보를 포함하지 마세요.`;location.href=`mailto:atinc@atinc.co.kr?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`});
  // V5 fixed geographic globe.
  // Network hubs are anchored directly to the globe artwork coordinates so labels and dots
  // remain aligned with the actual landmass. The globe never rotates.
  const canvas=document.getElementById('networkCanvas'); if(!canvas) return;
  const ctx=canvas.getContext('2d');
  const globeImg=new Image(); globeImg.src='assets/img/globe-luxury.png';
  let w=0,h=0,dpr=1;
  const GOLD='217,199,161',GOLD_DEEP='183,150,92';
  const ASSET=1800;

  // Coordinates below are positions on the rendered globe artwork itself (1800×1800).
  // South Korea is deliberately placed around Seoul, not on the northern half of the peninsula.
  const PRIMARY=[
    {name:'KOREA',px:1118,py:798,home:true,dx:17,dy:-18},
    {name:'JAPAN',px:1250,py:822,dx:18,dy:-8},
    {name:'ASIA PACIFIC',px:785,py:1360,dx:18,dy:-10},
    {name:'MIDDLE EAST',px:185,py:830,dx:18,dy:-8},
    {name:'EUROPE',px:330,py:470,dx:18,dy:-8}
  ];
  const GLOBAL=[
    {px:1085,py:1010},{px:1045,py:930},{px:910,py:1110},{px:800,py:1185},
    {px:900,py:1405},{px:1190,py:1585},{px:260,py:710},{px:420,py:840},
    {px:560,py:1035},{px:1015,py:905},{px:1125,py:965},{px:1150,py:1120},
    {px:700,py:1245},{px:980,py:1310}
  ];
  const RIM_RAYS=[-.92,-.65,-.38,-.10,.18,.46,.76,1.04,1.31,1.62,1.94,2.27,2.55];

  function resize(){
    dpr=Math.min(devicePixelRatio||1,2);
    w=canvas.clientWidth;h=canvas.clientHeight;
    canvas.width=w*dpr;canvas.height=h*dpr;
    ctx.setTransform(dpr,0,0,dpr,0,0);
  }
  function frameGeom(){
    const R=Math.min(w,h)*.455;
    return {cx:w*.735,cy:h*.505,R};
  }
  function assetPoint(px,py){
    const {cx,cy,R}=frameGeom();
    return {x:cx-R+(px/ASSET)*(R*2),y:cy-R+(py/ASSET)*(R*2),visible:true};
  }
  function drawGlobe(){
    const {cx,cy,R}=frameGeom();
    if(globeImg.complete&&globeImg.naturalWidth){
      ctx.save();ctx.globalAlpha=.87;ctx.drawImage(globeImg,cx-R,cy-R,R*2,R*2);ctx.restore();
    }else{
      ctx.strokeStyle=`rgba(${GOLD},.24)`;ctx.lineWidth=1;ctx.beginPath();ctx.arc(cx,cy,R,0,Math.PI*2);ctx.stroke();
    }
    // Jewellery-like graticule: decorative only, intentionally independent of location markers.
    ctx.save();ctx.strokeStyle=`rgba(${GOLD},.07)`;ctx.lineWidth=.6;
    [-.72,-.46,-.22,0,.22,.46,.72].forEach(v=>{
      ctx.beginPath();ctx.ellipse(cx,cy,R*Math.sqrt(1-v*v),R,.12,0,Math.PI*2);ctx.stroke();
    });
    [-.58,-.3,0,.3,.58].forEach(v=>{
      ctx.beginPath();ctx.ellipse(cx,cy+v*R,R*Math.sqrt(1-v*v),R*.15,0,0,Math.PI*2);ctx.stroke();
    });
    ctx.restore();
  }
  function quadPoint(a,b,t,lift){
    const mx=(a.x+b.x)/2,my=Math.min(a.y,b.y)-lift,u=1-t;
    return {x:u*u*a.x+2*u*t*mx+t*t*b.x,y:u*u*a.y+2*u*t*my+t*t*b.y};
  }
  function drawArc(a,b,progress,alpha=.55,width=1.1,lift=75,particle=false){
    if(progress<=0)return;
    const steps=48,stop=Math.max(1,Math.floor(steps*Math.min(progress,1)));
    ctx.save();ctx.lineWidth=width;ctx.strokeStyle=`rgba(${GOLD},${alpha})`;
    ctx.shadowColor=`rgba(${GOLD},${alpha*.42})`;ctx.shadowBlur=6;ctx.beginPath();
    for(let i=0;i<=stop;i++){
      const t=i/steps,p=quadPoint(a,b,t,lift);
      if(i===0)ctx.moveTo(p.x,p.y);else ctx.lineTo(p.x,p.y);
    }
    ctx.stroke();ctx.shadowBlur=0;
    if(particle&&progress>0&&progress<1.03){
      const p=quadPoint(a,b,Math.min(progress,1),lift);
      ctx.fillStyle='rgba(255,239,205,.98)';ctx.shadowColor='rgba(255,225,166,.98)';ctx.shadowBlur=18;
      ctx.beginPath();ctx.arc(p.x,p.y,2.9,0,Math.PI*2);ctx.fill();
    }
    ctx.restore();
  }
  function drawHub(point,item,active=false){
    const home=!!item.home,pulse=active?9+2*Math.sin(performance.now()/180):6;
    ctx.save();ctx.strokeStyle=active?'rgba(255,235,194,.92)':`rgba(${GOLD_DEEP},.62)`;
    ctx.fillStyle=home?'rgba(255,235,194,.98)':`rgba(${GOLD},.64)`;ctx.lineWidth=1.25;
    ctx.beginPath();ctx.arc(point.x,point.y,home?3.5:2.5,0,Math.PI*2);ctx.fill();
    ctx.beginPath();ctx.arc(point.x,point.y,pulse,0,Math.PI*2);ctx.stroke();
    if(item.name){
      ctx.font=`600 ${home?13:11}px "Noto Sans KR","Apple SD Gothic Neo",sans-serif`;
      ctx.fillStyle=active||home?'rgba(244,235,214,.97)':`rgba(${GOLD},.74)`;
      ctx.fillText(item.name,point.x+(item.dx||13),point.y+(item.dy||-9));
    }
    ctx.restore();
  }
  function drawUnlabelled(point,active=false){
    ctx.save();ctx.strokeStyle=`rgba(${GOLD_DEEP},${active?.72:.38})`;ctx.lineWidth=1;
    ctx.beginPath();ctx.arc(point.x,point.y,active?6:4.5,0,Math.PI*2);ctx.stroke();ctx.restore();
  }
  function draw(){
    ctx.clearRect(0,0,w,h);drawGlobe();
    const projected=PRIMARY.map(item=>({item,p:assetPoint(item.px,item.py)}));
    const home=projected[0];
    const total=20500,t=performance.now()%total;
    const primaryStart=850,seg=1500;
    projected.slice(1).forEach((entry,i)=>{
      const start=primaryStart+i*seg,progress=Math.max(0,Math.min(1,(t-start)/1080)),complete=t>start+1080;
      drawArc(home.p,entry.p,progress,complete?.38:.82,complete?1.05:1.45,76+i*15,!complete&&progress>0);
      entry.active=progress>0&&progress<1;
    });

    const globalStart=primaryStart+(projected.length-1)*seg+650;
    GLOBAL.forEach((g,i)=>{
      const p=assetPoint(g.px,g.py),start=globalStart+i*145;
      const progress=Math.max(0,Math.min(1,(t-start)/840));
      if(progress>0)drawArc(home.p,p,progress,.23,.78,55+(i%5)*14,progress<1);
      if(progress>=1)drawUnlabelled(p,false);else if(progress>0)drawUnlabelled(p,true);
    });

    // Final global bloom: after visible destinations are illuminated, fine rays extend to the rim
    // and suggest additional destinations outside the named network.
    const rayStart=globalStart+GLOBAL.length*145+950,{cx,cy,R}=frameGeom();
    RIM_RAYS.forEach((ang,i)=>{
      const start=rayStart+i*90,progress=Math.max(0,Math.min(1,(t-start)/820));
      if(progress<=0)return;
      const end={x:cx+Math.cos(ang)*R*.965,y:cy+Math.sin(ang)*R*.965};
      drawArc(home.p,end,progress,.14,.68,88+(i%4)*16,progress<1);
    });

    projected.forEach((entry,i)=>drawHub(entry.p,entry.item,i===0||entry.active));
    if(t>18800){
      const fade=(t-18800)/1700;ctx.fillStyle=`rgba(8,8,7,${Math.min(.82,fade*.82)})`;ctx.fillRect(0,0,w,h);
    }
    requestAnimationFrame(draw);
  }
  window.addEventListener('resize',resize);
  globeImg.onload=()=>resize();
  resize();draw();
})();