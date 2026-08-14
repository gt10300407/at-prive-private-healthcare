(()=>{history.scrollRestoration='manual';window.addEventListener('pageshow',()=>window.scrollTo(0,0));
const grid=document.getElementById('programGrid');const tabs=[...document.querySelectorAll('[data-filter]')];const title=document.getElementById('catalogTitle');const summary=document.getElementById('catalogSummary');let programs=[];
const meta={
ALL:['전체 프로그램','at PRIVÉ의 세 서비스 축과 각 프로그램을 모두 확인할 수 있습니다.'],
'PRIVATE HEALTH OFFICE':['Private Health Office','CEO·오너·임원과 고자산가를 위한 연간 건강관리와 가족 단위 의료 일정 관리입니다.'],
'CURATED MEDICAL ACCESS':['Curated Medical Access','고객의 목적과 기존 의료자료를 기준으로 필요한 전문 분야와 의료기관의 상담 접근을 선별합니다.'],
'GLOBAL MEDICAL JOURNEY':['Global Medical Journey','해외 고객이 한국 의료를 이용할 때 필요한 입국 전·체류 중·귀국 후 국제 의료 여정을 조율합니다.']
};
async function init(){try{
  programs=await(await fetch('data/programs.json',{cache:'no-store'})).json();
  document.getElementById('countAll').textContent=programs.length;
  document.getElementById('countOffice').textContent=programs.filter(p=>p.service_axis==='PRIVATE HEALTH OFFICE').length;
  document.getElementById('countMedical').textContent=programs.filter(p=>p.service_axis==='CURATED MEDICAL ACCESS').length;
  document.getElementById('countGlobal').textContent=programs.filter(p=>p.service_axis==='GLOBAL MEDICAL JOURNEY').length;
  render('ALL')
}catch(e){grid.innerHTML='<p class="loading">프로그램 데이터를 불러오지 못했습니다.</p>'}}
function render(filter){
  const list=filter==='ALL'?programs:programs.filter(p=>p.service_axis===filter);
  title.textContent=meta[filter][0];summary.textContent=meta[filter][1];
  grid.classList.add('switching');
  setTimeout(()=>{
    grid.innerHTML=list.map((p,i)=>`<a class="program-tile" href="program.html?id=${encodeURIComponent(p.id)}" style="--delay:${i*35}ms"><span class="type">${p.service_axis}</span><div class="tile-index">${String(i+1).padStart(2,'0')}</div><h2>${p.title}</h2><h3>${p.ko}</h3><p>${p.summary}</p><span class="tile-link">자세히 보기 <i>↗</i></span></a>`).join('');
    grid.classList.remove('switching')
  },120)
}
tabs.forEach(btn=>btn.addEventListener('click',()=>{tabs.forEach(b=>b.classList.remove('active'));btn.classList.add('active');render(btn.dataset.filter);document.getElementById('catalog').scrollIntoView({behavior:'smooth',block:'start'})}));init();})();