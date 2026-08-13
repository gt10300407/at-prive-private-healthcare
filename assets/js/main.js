(() => {
  const header = document.getElementById('siteHeader');
  const scroller = document.querySelector('.snap-shell');
  const onScroll = () => header?.classList.toggle('scrolled', (scroller?.scrollTop || window.scrollY) > 40);
  scroller?.addEventListener('scroll', onScroll, {passive:true}); window.addEventListener('scroll', onScroll, {passive:true});

  const observer = new IntersectionObserver(entries => entries.forEach(e => { if(e.isIntersecting) e.target.classList.add('visible'); }), {threshold:.12});
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  const toggle = document.getElementById('menuToggle'), menu = document.getElementById('mobileMenu');
  toggle?.addEventListener('click', () => { const open = !menu.classList.contains('open'); menu.classList.toggle('open', open); menu.setAttribute('aria-hidden', String(!open)); toggle.setAttribute('aria-expanded', String(open)); });
  menu?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {menu.classList.remove('open'); menu.setAttribute('aria-hidden','true'); toggle?.setAttribute('aria-expanded','false');}));

  const fab = document.getElementById('conciergeFab'), panel = document.getElementById('conciergePanel'), panelClose = document.getElementById('panelClose');
  fab?.addEventListener('click', () => {panel.classList.add('open'); panel.setAttribute('aria-hidden','false');});
  panelClose?.addEventListener('click', () => {panel.classList.remove('open'); panel.setAttribute('aria-hidden','true');});
  panel?.querySelector('a')?.addEventListener('click', () => panel.classList.remove('open'));

  const form = document.getElementById('privateForm');
  form?.addEventListener('submit', e => {
    e.preventDefault(); const d = new FormData(form);
    const subject = `[at PRIVÉ Private Inquiry] ${d.get('name') || ''} / ${d.get('interest') || ''}`;
    const body = `Name / Organization: ${d.get('name') || ''}\nCountry: ${d.get('country') || ''}\nContact: ${d.get('contact') || ''}\nInterest: ${d.get('interest') || ''}\n\nMessage:\n${d.get('message') || ''}\n\n※ Initial inquiry only. Sensitive medical data should not be included.`;
    location.href = `mailto:atinc@atinc.co.kr?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });

  // Abstract interactive global network: no partnership counts or hospital names are claimed.
  const canvas = document.getElementById('networkCanvas'); if(!canvas) return;
  const ctx = canvas.getContext('2d'); let w=0,h=0,dpr=1, mx=0,my=0,t=0;
  const pts = Array.from({length:520}, () => ({lat:(Math.random()-.5)*Math.PI, lon:(Math.random()*2-1)*Math.PI, s:Math.random()*.8+.2}));
  const hubs = [
    {name:'KOREA',lat:37.56,lon:126.98,a:true}, {name:'JAPAN',lat:35.68,lon:139.76}, {name:'ASIA PACIFIC',lat:1.35,lon:103.82},
    {name:'NORTH AMERICA',lat:34.05,lon:-118.24}, {name:'GLOBAL',lat:25.2,lon:55.27}
  ];
  const rad = v => v*Math.PI/180;
  function resize(){ dpr=Math.min(devicePixelRatio||1,2); w=canvas.clientWidth; h=canvas.clientHeight; canvas.width=w*dpr; canvas.height=h*dpr; ctx.setTransform(dpr,0,0,dpr,0,0); }
  function project(lat,lon,rot){ const cl=Math.cos(lat), x=cl*Math.cos(lon+rot), y=Math.sin(lat), z=cl*Math.sin(lon+rot); const R=Math.min(w,h)*.36; return {x:w*.68+x*R,y:h*.51-y*R,z,R}; }
  function draw(){ t+=.0016; ctx.clearRect(0,0,w,h); const rot=t+mx*.00005;
    const glow=ctx.createRadialGradient(w*.68,h*.51,10,w*.68,h*.51,Math.min(w,h)*.42); glow.addColorStop(0,'rgba(185,154,97,.10)');glow.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=glow;ctx.fillRect(0,0,w,h);
    pts.forEach(p=>{const q=project(p.lat,p.lon,rot); if(q.z<-.15)return; const a=.08+.3*((q.z+1)/2)*p.s; ctx.fillStyle=`rgba(216,198,160,${a})`;ctx.beginPath();ctx.arc(q.x,q.y,.5+p.s*.9,0,Math.PI*2);ctx.fill();});
    const projected=hubs.map(k=>({...k,p:project(rad(k.lat),rad(k.lon),rot)})); const kr=projected[0];
    projected.slice(1).forEach((hub,i)=>{if(hub.p.z<-.3||kr.p.z<-.3)return; ctx.strokeStyle=`rgba(185,154,97,${.10+.07*Math.sin(t*100+i)})`;ctx.lineWidth=1;ctx.beginPath();const cx=(kr.p.x+hub.p.x)/2, cy=Math.min(kr.p.y,hub.p.y)-80-i*12;ctx.moveTo(kr.p.x,kr.p.y);ctx.quadraticCurveTo(cx,cy,hub.p.x,hub.p.y);ctx.stroke();});
    projected.forEach(h=>{if(h.p.z<-.35)return;const pulse=4+2*Math.sin(t*120+(h.lon||0));ctx.strokeStyle=h.a?'rgba(255,232,183,.9)':'rgba(185,154,97,.75)';ctx.fillStyle=h.a?'rgba(255,232,183,.9)':'rgba(185,154,97,.8)';ctx.beginPath();ctx.arc(h.p.x,h.p.y,2.5,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(h.p.x,h.p.y,pulse,0,Math.PI*2);ctx.stroke();ctx.font='700 8px '+getComputedStyle(document.body).fontFamily;ctx.fillText(h.name,h.p.x+10,h.p.y-8);});
    requestAnimationFrame(draw);
  }
  canvas.addEventListener('pointermove',e=>{const r=canvas.getBoundingClientRect();mx=e.clientX-r.left-w/2;my=e.clientY-r.top-h/2;});
  window.addEventListener('resize',resize);resize();draw();
})();
