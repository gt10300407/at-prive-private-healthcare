import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm";
import { feature } from "https://cdn.jsdelivr.net/npm/topojson-client@3.1.0/+esm";
import world from "https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/countries-110m.json/+esm";

const svg=d3.select('#globalAccessMap');
if(!svg.empty()){
  const W=1000,H=760;
  const countries=feature(world,world.objects.countries);
  const projection=d3.geoNaturalEarth1().fitExtent([[58,48],[W-92,H-62]],countries);
  const geoPath=d3.geoPath(projection);
  const worldG=svg.select('#gaWorld'),gridG=svg.select('#gaGrid'),routeG=svg.select('#gaRoutes'),nodeG=svg.select('#gaNodes'),labelG=svg.select('#gaLabels'),rings=svg.select('#gaRings');

  worldG.selectAll('path').data(countries.features).join('path')
    .attr('class',d=>String(d.id)==='410'?'ga-country is-korea':'ga-country').attr('d',geoPath);
  gridG.append('path').attr('class','ga-grid').attr('d',geoPath(d3.geoGraticule10()));

  const raw=[
    {id:'KOREA',label:'KOREA',coord:[127.7669,35.9078],home:true,dx:13,dy:-14,anchor:'start'},
    {id:'CHINA',label:'CHINA',coord:[116.4074,39.9042],dx:-24,dy:-12,bend:-14,anchor:'end'},
    {id:'JAPAN',label:'JAPAN',coord:[139.6503,35.6762],dx:13,dy:-7,bend:-10,anchor:'start'},
    {id:'SEA',label:'SOUTHEAST ASIA',coord:[103.8198,1.3521],dx:12,dy:17,bend:38,anchor:'start'},
    {id:'MIDDLE',label:'MIDDLE EAST',coord:[55.2708,25.2048],dx:-22,dy:-9,bend:-42,anchor:'end'},
    {id:'EUROPE',label:'EUROPE',coord:[2.3522,48.8566],dx:-18,dy:-10,bend:-48,anchor:'end'},
    {id:'NA',label:'NORTH AMERICA',coord:[-74.0060,40.7128],dx:12,dy:-5,bend:-72,anchor:'start'},
    {id:'OCEANIA',label:'OCEANIA',coord:[151.2093,-33.8688],dx:-12,dy:18,bend:46,anchor:'end'}
  ];
  const pts=raw.map(d=>{const [x,y]=projection(d.coord);return {...d,x,y}}),home=pts[0],dest=pts.slice(1);

  function curve(a,b){
    const mx=(a.x+b.x)/2,my=(a.y+b.y)/2,dx=b.x-a.x,dy=b.y-a.y,len=Math.hypot(dx,dy)||1,nx=-dy/len,ny=dx/len,bend=b.bend||0;
    return `M ${a.x},${a.y} Q ${mx+nx*bend},${my+ny*bend} ${b.x},${b.y}`;
  }

  const routes=routeG.selectAll('path').data(dest).join('path').attr('class','ga-route').attr('d',d=>curve(home,d)).attr('opacity',0);
  const nodes=nodeG.selectAll('g').data(pts).join('g').attr('transform',d=>`translate(${d.x},${d.y})`).attr('opacity',d=>d.home?1:0);
  nodes.each(function(d){const g=d3.select(this);g.append('circle').attr('class','ga-node-ring').attr('r',d.home?10:5.5);g.append('circle').attr('class','ga-node-core').attr('r',d.home?4:2.2)});
  const labels=labelG.selectAll('text').data(pts).join('text').attr('class',d=>d.home?'ga-label home':'ga-label').attr('x',d=>d.x+d.dx).attr('y',d=>d.y+d.dy).attr('text-anchor',d=>d.anchor|| (d.dx<0?'end':'start')).attr('opacity',d=>d.home?1:0).text(d=>d.label);
  rings.attr('transform',`translate(${home.x},${home.y})`).attr('opacity',1);

  function breathe(){rings.selectAll('circle').each(function(_,i){d3.select(this).attr('r',[21,39,59][i]).attr('opacity',.14).transition().duration(2300).ease(d3.easeCubicOut).attr('r',[29,51,76][i]).attr('opacity',0).on('end',i===2?breathe:null)})}
  breathe();

  const wait=ms=>new Promise(r=>setTimeout(r,ms));
  function reset(){
    routes.interrupt().attr('opacity',0).attr('stroke-dasharray',null).attr('stroke-dashoffset',null);
    nodes.filter(d=>!d.home).interrupt().attr('opacity',0);
    labels.filter(d=>!d.home).interrupt().attr('opacity',0);
  }
  function reveal(d){
    const n=nodes.filter(x=>x.id===d.id),l=labels.filter(x=>x.id===d.id),r=routes.filter(x=>x.id===d.id);
    r.each(function(){
      const path=d3.select(this);
      const len=this.getTotalLength();
      path
        .interrupt()
        .attr('opacity',1)
        .attr('stroke-dasharray',`${len} ${len}`)
        .attr('stroke-dashoffset',len)
        .transition()
        .duration(440)
        .ease(d3.easeCubicOut)
        .attr('stroke-dashoffset',0)
        .on('end',()=>path.attr('stroke-dasharray',null).attr('stroke-dashoffset',null));
    });
    n.interrupt().transition().delay(240).duration(120).attr('opacity',1);
    n.select('.ga-node-ring')
      .attr('r',5.5)
      .transition().delay(240).duration(160).attr('r',9.2)
      .transition().duration(320).attr('r',5.5);
    l.interrupt().transition().delay(260).duration(160).attr('opacity',1);
  }

  async function play(){
    reset();
    for(const d of dest){
      reveal(d);
      await wait(410);
    }
    routes.transition().duration(260).attr('opacity',.82);
    await wait(2300);
    play();
  }
  if(matchMedia('(prefers-reduced-motion:reduce)').matches){
    routes.attr('opacity',.52);nodes.attr('opacity',1);labels.attr('opacity',1)
  }else play();
}
