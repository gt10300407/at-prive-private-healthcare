import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm";
import { feature } from "https://cdn.jsdelivr.net/npm/topojson-client@3.1.0/+esm";
import world from "https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/countries-110m.json/+esm";

const svg=d3.select('#globalAccessMap');
if(!svg.empty()){
  const W=1000,H=760;
  const countries=feature(world,world.objects.countries);
  const projection=d3.geoNaturalEarth1().fitExtent([[18,26],[W-18,H-24]],countries);
  const geoPath=d3.geoPath(projection);
  const worldG=svg.select('#gaWorld'),gridG=svg.select('#gaGrid'),routeG=svg.select('#gaRoutes'),nodeG=svg.select('#gaNodes'),labelG=svg.select('#gaLabels'),rings=svg.select('#gaRings');

  worldG.selectAll('path').data(countries.features).join('path')
    .attr('class',d=>String(d.id)==='410'?'ga-country is-korea':'ga-country').attr('d',geoPath);
  gridG.append('path').attr('class','ga-grid').attr('d',geoPath(d3.geoGraticule10()));

  const raw=[
    {id:'SEOUL',label:'SEOUL',coord:[126.9780,37.5665],home:true,dx:15,dy:-13},
    {id:'CHINA',label:'CHINA',coord:[116.4074,39.9042],dx:-34,dy:-10,bend:-14},
    {id:'JAPAN',label:'JAPAN',coord:[139.6503,35.6762],dx:12,dy:-7,bend:-10},
    {id:'SEA',label:'SOUTHEAST ASIA',coord:[103.8198,1.3521],dx:10,dy:18,bend:38},
    {id:'MIDDLE',label:'MIDDLE EAST',coord:[55.2708,25.2048],dx:-46,dy:-8,bend:-42},
    {id:'EUROPE',label:'EUROPE',coord:[2.3522,48.8566],dx:-30,dy:-9,bend:-48},
    {id:'NA',label:'NORTH AMERICA',coord:[-74.0060,40.7128],dx:10,dy:-5,bend:-72},
    {id:'OCEANIA',label:'OCEANIA',coord:[151.2093,-33.8688],dx:10,dy:16,bend:46}
  ];
  const pts=raw.map(d=>{const [x,y]=projection(d.coord);return {...d,x,y}}),home=pts[0],dest=pts.slice(1);

  function curve(a,b){
    const mx=(a.x+b.x)/2,my=(a.y+b.y)/2,dx=b.x-a.x,dy=b.y-a.y,len=Math.hypot(dx,dy)||1,nx=-dy/len,ny=dx/len,bend=b.bend||0;
    return `M ${a.x},${a.y} Q ${mx+nx*bend},${my+ny*bend} ${b.x},${b.y}`;
  }

  const routes=routeG.selectAll('path').data(dest).join('path').attr('class','ga-route').attr('d',d=>curve(home,d)).attr('opacity',0);
  const nodes=nodeG.selectAll('g').data(pts).join('g').attr('transform',d=>`translate(${d.x},${d.y})`).attr('opacity',d=>d.home?1:0);
  nodes.each(function(d){const g=d3.select(this);g.append('circle').attr('class','ga-node-ring').attr('r',d.home?10:5.5);g.append('circle').attr('class','ga-node-core').attr('r',d.home?4:2.2)});
  const labels=labelG.selectAll('text').data(pts).join('text').attr('class',d=>d.home?'ga-label home':'ga-label').attr('x',d=>d.x+d.dx).attr('y',d=>d.y+d.dy).attr('text-anchor',d=>d.dx<0?'end':'start').attr('opacity',d=>d.home?1:0).text(d=>d.label);
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
    r.attr('opacity',0).transition().duration(220).ease(d3.easeCubicOut).attr('opacity',0.9);
    n.attr('opacity',1);
    n.select('.ga-node-ring')
      .attr('r',5.5)
      .transition().duration(170).attr('r',9.2)
      .transition().duration(360).attr('r',5.5);
    l.interrupt().transition().duration(220).attr('opacity',1);
  }

  async function play(){
    reset();
    for(const d of dest){
      reveal(d);
      await wait(520);
    }
    routes.transition().duration(240).attr('opacity',.82);
    await wait(2800);
    play();
  }
  if(matchMedia('(prefers-reduced-motion:reduce)').matches){
    routes.attr('opacity',.52);nodes.attr('opacity',1);labels.attr('opacity',1)
  }else play();
}
