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
    const axis=p.service_axis||'CURATED MEDICAL ACCESS';
    const isMedical=axis==='CURATED MEDICAL ACCESS';
    const isOffice=axis==='PRIVATE HEALTH OFFICE';
    const isGlobal=axis==='GLOBAL MEDICAL JOURNEY';

    let deep='';
    if(p.overview){
      deep+=section(
        isMedical?'WHAT THIS ACCESS IS FOR':isOffice?'PRIVATE HEALTH OFFICE':'PRIVATE APPROACH',
        isMedical?'이 의료 접근이 필요한 이유부터 정리합니다.':isOffice?'건강의 흐름을 연간 단위로 관리합니다.':'고객의 목적에서 여정을 시작합니다.',
        `<p class="deep-lead">${esc(p.overview)}</p>`,
        'deep-intro-section'
      );
    }

    const scope=(p.service_scope?.length?p.service_scope:p.steps)||[];
    if(scope.length){
      deep+=section(
        isMedical?'WHAT WE REVIEW':isOffice?'ANNUAL MANAGEMENT SCOPE':isGlobal?'GLOBAL SERVICE SCOPE':'SERVICE SCOPE',
        isMedical?'전문의 상담 전에 필요한 정보와 판단 지점을 정리합니다.':isOffice?'연간 관리에서 놓치지 않아야 할 항목을 이어갑니다.':isGlobal?'국제 의료 여정에 필요한 범위를 단계별로 정리합니다.':'프로그램의 핵심 관리 범위를 정리합니다.',
        `<ol class="numbered-editorial">${scope.map((x,i)=>`<li><span>${String(i+1).padStart(2,'0')}</span><p>${esc(x)}</p></li>`).join('')}</ol>`,
        'deep-service-section'
      );
    }

    if(p.medical_fields?.length){
      deep+=section(
        'CONSULTATION FOCUS',
        '의료진과 확인해야 할 전문 영역을 먼저 정리합니다.',
        `<div class="field-index">${p.medical_fields.map((x,i)=>`<div><span>${String(i+1).padStart(2,'0')}</span><strong>${esc(x)}</strong></div>`).join('')}</div>`,
        'deep-fields-section'
      );
    }

    if(p.phases?.length){
      deep+=section(
        isMedical?'SPECIALIST ACCESS JOURNEY':isOffice?'PRIVATE HEALTH OFFICE FLOW':isGlobal?'BEFORE · IN · AFTER KOREA':'PRIVATE JOURNEY',
        isMedical?'의료진의 판단이 필요한 단계에 맞춰 접근을 연결합니다.':isOffice?'연간 기준 설정부터 지속 관리까지 하나의 체계로 이어갑니다.':isGlobal?'한국 의료 이용의 전후를 세 단계로 연결합니다.':'프로그램의 흐름을 단계별로 정리합니다.',
        `<div class="phase-editorial">${p.phases.map((ph,i)=>`<article><span>${String(i+1).padStart(2,'0')}</span><small>${esc(ph.name)}</small><h3>${esc(ph.ko)}</h3>${list(ph.items,'phase-items')}</article>`).join('')}</div>`,
        'deep-journey-section'
      );
    }

    if(p.tiers?.length){
      deep+=section(
        'PRIVATE SERVICE LEVELS',
        isOffice?'관리 범위에 따라 연간 헬스 오피스를 확장할 수 있습니다.':'시그니처 프로그램은 관리 범위를 단계별로 확장할 수 있습니다.',
        `<div class="tier-editorial">${p.tiers.map(t=>`<article><small>${esc(t.name)}</small><h3>${esc(t.copy)}</h3><p>${esc(t.fit)}</p></article>`).join('')}</div>`,
        'deep-tier-section'
      );
    }

    if(p.specialized_journeys?.length){
      deep+=section('SELECTED JOURNEYS','의료 목적에 따라 국제 의료 여정을 별도로 구성할 수 있습니다.',`<div class="journey-index">${p.specialized_journeys.map((x,i)=>`<div><span>${String(i+1).padStart(2,'0')}</span><strong>${esc(x)}</strong></div>`).join('')}</div>`,'deep-specialized-section');
    }

    if(p.deliverables?.length){
      deep+=section(
        isMedical?'CONSULTATION FILE':isOffice?'PRIVATE HEALTH OFFICE FILE':'PRIVATE JOURNEY FILE',
        isMedical?'상담에 필요한 자료와 다음 단계를 하나의 흐름으로 정리합니다.':isOffice?'한 해의 건강 일정과 관리 기록을 이어갑니다.':'고객에게 필요한 정보를 하나의 흐름으로 정리합니다.',
        `<div class="deliverable-grid">${p.deliverables.map(x=>`<div>${esc(x)}</div>`).join('')}</div>`,
        'deliverables-section'
      );
    }

    const statement=p.statement||p.summary;
    const axisLabel=isOffice?'PRIVATE HEALTH OFFICE':isGlobal?'GLOBAL MEDICAL JOURNEY':'CURATED MEDICAL ACCESS';
    const introCopy=isMedical
      ? 'at PRIVÉ가 진단이나 치료방법을 결정하지 않습니다. 고객의 목적과 기존 의료자료를 정리한 뒤 관련 전문 분야와 의료기관의 상담 가능 범위를 확인하고, 의료진의 판단이 필요한 단계에 맞춰 접근을 연결합니다.'
      : isOffice
        ? '연간 건강관리 캘린더, 검사결과와 재검 일정, 전문의 상담과 가족의 의료 일정을 하나의 전담 체계로 이어가는 장기 관리 서비스입니다.'
        : '해외 고객이 한국 의료를 이용할 때 필요한 의료 일정과 국제 컨시어지 범위를 입국 전·체류 중·귀국 후로 구분해 조율합니다.';

    root.innerHTML=`
      <section class="detail-hero luxury-detail-hero">
        <div class="detail-hero-inner">
          <span class="type">${esc(axisLabel)}</span>
          <p class="detail-en">${esc(p.title)}</p>
          <h1>${esc(statement)}</h1>
          <p>${esc(p.summary)}</p>
        </div>
      </section>
      <section class="detail-body detail-body-lux">
        <div class="detail-columns detail-columns-lux">
          <div class="detail-intro detail-intro-lux">
            <p class="kicker gold">${esc(axisLabel)}</p>
            <h2>${esc(p.ko)}</h2>
            <p>${esc(introCopy)}</p>
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
        <p>${esc(p.notice||'at PRIVÉ는 직접 진단·치료를 제공하는 의료기관이 아닙니다. 전문 의료기관의 상담 접근, 예약과 일정 커뮤니케이션 및 필요한 비의료 지원을 조율합니다. 모든 검사, 진단, 처방, 시술 및 치료는 해당 의료기관과 담당 의료진의 판단에 따라 진행됩니다.')}</p>
      </section>
    `;
  }catch(e){
    root.innerHTML='<section class="not-found"><div><h1>프로그램을 불러오지 못했습니다.</h1><a href="programs.html">전체 프로그램 보기</a></div></section>';
  }
})();