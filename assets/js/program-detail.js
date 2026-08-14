(async()=>{
  history.scrollRestoration='manual';
  window.addEventListener('pageshow',()=>window.scrollTo(0,0));
  const root=document.getElementById('programDetail');
  const id=new URLSearchParams(location.search).get('id');
  const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  const list=(arr,cls='editorial-list')=>arr?.length?`<ul class="${cls}">${arr.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>`:'';
  const section=(eyebrow,title,body,cls='')=>`<section class="deep-section ${cls}"><div class="deep-section-head"><p>${esc(eyebrow)}</p><h2>${esc(title)}</h2></div><div class="deep-section-body">${body}</div></section>`;
  try{
    const items=await(await fetch('data/programs.json',{cache:'no-store'})).json();
    const p=items.find(x=>x.id===id);
    if(!p){root.innerHTML='<section class="not-found"><div><h1>프로그램을 찾을 수 없습니다.</h1><a href="programs.html">전체 프로그램 보기</a></div></section>';return;}
    document.title=`${p.ko} | at PRIVÉ`;

    let deep='';
    if(p.overview){
      deep+=section('PRIVATE APPROACH','한 사람에게 맞는 기준부터 정리합니다.',`<p class="deep-lead">${esc(p.overview)}</p>`,'deep-intro-section');
    }
    const scope=(p.service_scope?.length?p.service_scope:p.steps)||[];
    if(scope.length){
      deep+=section('SERVICE SCOPE','보이지 않는 곳까지 이어지는 전담 조율',`<ol class="numbered-editorial">${scope.map((x,i)=>`<li><span>${String(i+1).padStart(2,'0')}</span><p>${esc(x)}</p></li>`).join('')}</ol>`,'deep-service-section');
    }
    if(p.phases?.length){
      deep+=section('PRIVATE JOURNEY','과정마다 필요한 역할을 분리해 조율합니다.',`<div class="phase-editorial">${p.phases.map((ph,i)=>`<article><span>${String(i+1).padStart(2,'0')}</span><small>${esc(ph.name)}</small><h3>${esc(ph.ko)}</h3>${list(ph.items,'phase-items')}</article>`).join('')}</div>`,'deep-journey-section');
    }
    if(p.medical_fields?.length){
      const fieldEyebrow=p.type==='MEDICAL ACCESS'?'CONSULTATION FOCUS':'SELECTED FIELDS';
      const fieldTitle=p.type==='MEDICAL ACCESS'?'전문의 상담 전, 필요한 영역부터 정리합니다.':'상담 목적에 따라 필요한 영역만 선별합니다.';
      deep+=section(fieldEyebrow,fieldTitle,`<div class="field-index">${p.medical_fields.map((x,i)=>`<div><span>${String(i+1).padStart(2,'0')}</span><strong>${esc(x)}</strong></div>`).join('')}</div>`,'deep-fields-section');
    }
    if(p.tiers?.length){
      deep+=section('PRIVATE SERVICE LEVELS','시그니처 프로그램은 관리 범위를 단계별로 확장할 수 있습니다.',`<div class="tier-editorial">${p.tiers.map(t=>`<article><small>${esc(t.name)}</small><h3>${esc(t.copy)}</h3><p>${esc(t.fit)}</p></article>`).join('')}</div>`,'deep-tier-section');
    }
    if(p.specialized_journeys?.length){
      deep+=section('SELECTED JOURNEYS','의료 목적에 따라 별도의 여정으로 확장할 수 있습니다.',`<div class="journey-index">${p.specialized_journeys.map((x,i)=>`<div><span>${String(i+1).padStart(2,'0')}</span><strong>${esc(x)}</strong></div>`).join('')}</div>`,'deep-specialized-section');
    }
    if(p.deliverables?.length){
      deep+=section('PRIVATE JOURNEY FILE','고객에게 필요한 정보를 하나의 흐름으로 정리합니다.',`<div class="deliverable-grid">${p.deliverables.map(x=>`<div>${esc(x)}</div>`).join('')}</div>`,'deliverables-section');
    }

    const statement=p.statement||p.summary;
    root.innerHTML=`
      <section class="detail-hero luxury-detail-hero">
        <div class="detail-hero-inner">
          <span class="type">${esc(p.type)}</span>
          <p class="detail-en">${esc(p.title)}</p>
          <h1>${esc(statement)}</h1>
          <p>${esc(p.summary)}</p>
        </div>
      </section>
      <section class="detail-body detail-body-lux">
        <div class="detail-columns detail-columns-lux">
          <div class="detail-intro detail-intro-lux">
            <p class="kicker gold">${p.type==='MEDICAL ACCESS'?'PRIVATE MEDICAL ACCESS':'PRIVATE PROGRAM DESIGN'}</p>
            <h2>${esc(p.ko)}</h2>
            <p>${p.type==='MEDICAL ACCESS'?'특정 치료를 먼저 정하지 않습니다. 고객의 목적과 기존 의료자료를 정리한 뒤 관련 전문 분야와 의료기관의 상담 가능 범위를 확인하고, 필요한 진료·검사·체류 일정을 조율합니다.':'at PRIVÉ는 정해진 패키지를 일괄적으로 제안하지 않습니다. 고객의 목적과 기존 정보, 일정과 프라이버시를 먼저 확인하고 필요한 의료 접근과 컨시어지 범위를 조율합니다.'}</p>
            <div class="detail-cta"><a class="button luxury-cta ink" href="index.html#contact"><span>PRIVATE CONSULTATION</span><b>프라이빗 상담</b></a><a class="detail-back" href="programs.html">전체 프로그램 <i>↗</i></a></div>
          </div>
          <div class="detail-list luxury-audience">
            <h3>SELECTED FOR</h3>
            <ul>${p.for.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>
          </div>
        </div>
      </section>
      <div class="deep-content">${deep}</div>
      <section class="closing-notice">
        <div><p>MEDICAL NOTICE</p><h2>의학적 판단과 의료행위는 의료진이 담당합니다.</h2></div>
        <p>${esc(p.notice||'at PRIVÉ는 직접 진단·치료를 제공하는 의료기관이 아닙니다. 전문 의료기관 연결, 상담·예약 지원, 통역·의전·체류 지원과 사후관리 등 비의료 컨시어지 서비스를 제공합니다. 모든 검사, 진단, 처방, 시술 및 치료는 해당 의료기관과 담당 의료진의 판단에 따라 진행됩니다.')}</p>
      </section>
    `;
  }catch(e){
    root.innerHTML='<section class="not-found"><div><h1>프로그램을 불러오지 못했습니다.</h1><a href="programs.html">전체 프로그램 보기</a></div></section>';
  }
})();