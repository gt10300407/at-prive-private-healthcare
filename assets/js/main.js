(()=>{
  const header=document.getElementById('siteHeader'),scroller=document.querySelector('.snap-shell');
  const onScroll=()=>header?.classList.toggle('scrolled',(scroller?.scrollTop||window.scrollY)>40);scroller?.addEventListener('scroll',onScroll,{passive:true});window.addEventListener('scroll',onScroll,{passive:true});
  const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible')}),{threshold:.1});document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));
  const toggle=document.getElementById('menuToggle'),menu=document.getElementById('mobileMenu');toggle?.addEventListener('click',()=>{const open=!menu.classList.contains('open');menu.classList.toggle('open',open);menu.setAttribute('aria-hidden',String(!open));toggle.setAttribute('aria-expanded',String(open))});menu?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{menu.classList.remove('open');menu.setAttribute('aria-hidden','true');toggle?.setAttribute('aria-expanded','false')}));
  const fab=document.getElementById('conciergeFab'),panel=document.getElementById('conciergePanel'),panelClose=document.getElementById('panelClose');fab?.addEventListener('click',()=>{panel.classList.add('open');panel.setAttribute('aria-hidden','false')});panelClose?.addEventListener('click',()=>{panel.classList.remove('open');panel.setAttribute('aria-hidden','true')});panel?.querySelector('a')?.addEventListener('click',()=>panel.classList.remove('open'));
  const form=document.getElementById('privateForm');form?.addEventListener('submit',e=>{e.preventDefault();const d=new FormData(form);const subject=`[at PRIVÉ Private Inquiry] ${d.get('name')||''} / ${d.get('interest')||''}`;const body=`이름 / 기관명: ${d.get('name')||''}\n국가: ${d.get('country')||''}\n연락처: ${d.get('contact')||''}\n관심 분야: ${d.get('interest')||''}\n\n문의 내용:\n${d.get('message')||''}\n\n※ 초기 문의에는 민감한 의료정보를 포함하지 마세요.`;location.href=`mailto:atinc@atinc.co.kr?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`});
  // V4 fixed geographic globe.
  // The landmass never rotates. Korea connects to selected hubs in sequence,
  // then a final global wave extends toward additional unlabelled destinations.
  const canvas=document.getElementById('networkCanvas'); if(!canvas) return;
  const ctx=canvas.getContext('2d');
  const globeImg=new Image(); globeImg.src='assets/img/globe-luxury.png';
  let w=0,h=0,dpr=1;
  const VIEW={lat0:18*Math.PI/180,lon0:112*Math.PI/180};
  const GOLD='217,199,161', GOLD_DEEP='183,150,92';
  const PRIMARY=[
    {name:'KOREA',lat:37.5665,lon:126.978,home:true},
    {name:'JAPAN',lat:35.6762,lon:139.6503},
    {name:'ASIA PACIFIC',lat:1.3521,lon:103.8198},
    {name:'MIDDLE EAST',lat:25.2048,lon:55.2708},
    {name:'EUROPE',lat:48.8566,lon:2.3522}
  ];
  const GLOBAL=[
    {lat:-33.8688,lon:151.2093},{lat:13.7563,lon:100.5018},{lat:21.0285,lon:105.8542},
    {lat:-6.2088,lon:106.8456},{lat:24.7136,lon:46.6753},{lat:41.0082,lon:28.9784},
    {lat:51.5072,lon:-.1276},{lat:46.2044,lon:6.1432},{lat:52.52,lon:13.405},
    {lat:31.2304,lon:121.4737},{lat:22.3193,lon:114.1694},{lat:25.033,lon:121.5654}
  ];
  const RIM_RAYS=[-.82,-.48,-.12,.22,.55,.88,1.17,1.47,1.82,2.18];
  const rad=v=>v*Math.PI/180;

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

  function project(latDeg,lonDeg){
    const lat=rad(latDeg),lon=rad(lonDeg),lat0=VIEW.lat0,lon0=VIEW.lon0;
    const dlon=lon-lon0;
    const cosc=Math.sin(lat0)*Math.sin(lat)+Math.cos(lat0)*Math.cos(lat)*Math.cos(dlon);
    const {cx,cy,R}=frameGeom();
    const x=R*Math.cos(lat)*Math.sin(dlon);
    const y=R*(Math.cos(lat0)*Math.sin(lat)-Math.sin(lat0)*Math.cos(lat)*Math.cos(dlon));
    return {x:cx+x,y:cy-y,visible:cosc>-.02,depth:cosc};
  }

  function drawGlobe(){
    const {cx,cy,R}=frameGeom();
    if(globeImg.complete && globeImg.naturalWidth){
      ctx.save();
      ctx.globalAlpha=.84;
      ctx.drawImage(globeImg,cx-R,cy-R,R*2,R*2);
      ctx.restore();
    }else{
      ctx.strokeStyle=`rgba(${GOLD},.24)`;ctx.lineWidth=1;
      ctx.beginPath();ctx.arc(cx,cy,R,0,Math.PI*2);ctx.stroke();
    }

    // Fine longitude / latitude jewellery lines.
    ctx.save();ctx.lineWidth=.55;ctx.strokeStyle=`rgba(${GOLD},.075)`;
    const meridians=[-90,-60,-30,0,30,60,90,120,150];
    meridians.forEach(lon=>{
      let started=false;ctx.beginPath();
      for(let lat=-75;lat<=75;lat+=3){
        const p=project(lat,lon); if(!p.visible){started=false;continue}
        if(!started){ctx.moveTo(p.x,p.y);started=true}else ctx.lineTo(p.x,p.y)
      }ctx.stroke();
    });
    [-60,-30,0,30,60].forEach(lat=>{
      let started=false;ctx.beginPath();
      for(let lon=-180;lon<=180;lon+=3){
        const p=project(lat,lon);if(!p.visible){started=false;continue}
        if(!started){ctx.moveTo(p.x,p.y);started=true}else ctx.lineTo(p.x,p.y)
      }ctx.stroke();
    });
    ctx.restore();
  }

  function quadPoint(a,b,t,lift){
    const mx=(a.x+b.x)/2, my=Math.min(a.y,b.y)-lift;
    const u=1-t;
    return {x:u*u*a.x+2*u*t*mx+t*t*b.x,y:u*u*a.y+2*u*t*my+t*t*b.y};
  }
  function drawArc(a,b,progress,alpha=.55,width=1.1,lift=75,particle=false){
    if(progress<=0)return;
    const steps=42,stop=Math.max(1,Math.floor(steps*Math.min(progress,1)));
    ctx.save();ctx.lineWidth=width;ctx.strokeStyle=`rgba(${GOLD},${alpha})`;
    ctx.shadowColor=`rgba(${GOLD},${alpha*.45})`;ctx.shadowBlur=5;
    ctx.beginPath();
    for(let i=0;i<=stop;i++){
      const t=i/steps,p=quadPoint(a,b,t,lift);
      if(i===0)ctx.moveTo(p.x,p.y);else ctx.lineTo(p.x,p.y);
    }
    ctx.stroke();ctx.shadowBlur=0;
    if(particle && progress>0 && progress<1.03){
      const p=quadPoint(a,b,Math.min(progress,1),lift);
      ctx.fillStyle='rgba(255,238,201,.98)';ctx.shadowColor='rgba(255,225,166,.95)';ctx.shadowBlur=16;
      ctx.beginPath();ctx.arc(p.x,p.y,2.8,0,Math.PI*2);ctx.fill();
    }
    ctx.restore();
  }
  function hub(p,label,active=false,home=false){
    if(!p.visible)return;
    const pulse=active?9+2*Math.sin(performance.now()/180):6;
    ctx.save();
    ctx.strokeStyle=active?'rgba(255,235,194,.9)':`rgba(${GOLD_DEEP},.55)`;
    ctx.fillStyle=home?'rgba(255,235,194,.96)':`rgba(${GOLD},${active?.85:.58})`;
    ctx.lineWidth=1.2;
    ctx.beginPath();ctx.arc(p.x,p.y,home?3.3:2.5,0,Math.PI*2);ctx.fill();
    ctx.beginPath();ctx.arc(p.x,p.y,pulse,0,Math.PI*2);ctx.stroke();
    if(label){
      ctx.font=`600 ${home?13:11}px "Noto Sans KR","Apple SD Gothic Neo",sans-serif`;
      ctx.fillStyle=active||home?'rgba(244,235,214,.96)':`rgba(${GOLD},.68)`;
      ctx.fillText(label,p.x+13,p.y-9);
    }
    ctx.restore();
  }

  function draw(){
    ctx.clearRect(0,0,w,h);
    drawGlobe();
    const projected=PRIMARY.map(h=>({...h,p:project(h.lat,h.lon)}));
    const home=projected[0];
    const total=19000,t=performance.now()%total;
    const primaryStart=900,seg=1450;
    // Primary paths stay visible once completed.
    projected.slice(1).forEach((hub,i)=>{
      if(!home.p.visible||!hub.p.visible)return;
      const start=primaryStart+i*seg;
      const progress=Math.max(0,Math.min(1,(t-start)/1050));
      const complete=t>start+1050;
      drawArc(home.p,hub.p,progress,complete?.34:.72,complete?1:1.35,78+i*13,!complete&&progress>0);
      hub._active=progress>0&&progress<1;
    });

    // Unlabelled global wave after the named hubs.
    const globalStart=primaryStart+(projected.length-1)*seg+600;
    GLOBAL.forEach((g,i)=>{
      const p=project(g.lat,g.lon);if(!p.visible||!home.p.visible)return;
      const start=globalStart+i*150;
      const progress=Math.max(0,Math.min(1,(t-start)/850));
      if(progress>0)drawArc(home.p,p,progress,.19,.72,52+(i%4)*16,progress<1);
      if(progress>=1)hub(p,null,false,false);
    });

    // Final outward rays imply access beyond the labelled visible network.
    const rayStart=globalStart+GLOBAL.length*150+900;
    const {cx,cy,R}=frameGeom();
    RIM_RAYS.forEach((ang,i)=>{
      const start=rayStart+i*85,progress=Math.max(0,Math.min(1,(t-start)/780));
      if(progress<=0)return;
      const end={x:cx+Math.cos(ang)*R*.97,y:cy+Math.sin(ang)*R*.97};
      drawArc(home.p,end,progress,.12,.65,90+(i%3)*22,progress<1);
    });

    projected.forEach((h,i)=>hub(h.p,h.name,i===0||h._active,i===0));
    // Soft fade before restart.
    if(t>17500){
      const fade=(t-17500)/1500;
      ctx.fillStyle=`rgba(8,8,7,${Math.min(.85,fade*.85)})`;ctx.fillRect(0,0,w,h);
    }
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize',resize);
  globeImg.onload=()=>{resize();};
  resize();draw();
})();