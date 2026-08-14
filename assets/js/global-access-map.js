import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm";
import { feature } from "https://cdn.jsdelivr.net/npm/topojson-client@3.1.0/+esm";
import world from "https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/countries-110m.json/+esm";

const svg = d3.select('#globalAccessMap');

if (!svg.empty()) {
  const W = 1000, H = 760;
  const countries = feature(world, world.objects.countries);
  const projection = d3.geoNaturalEarth1().fitExtent([[58, 48], [W - 92, H - 62]], countries);
  const geoPath = d3.geoPath(projection);

  const worldG = svg.select('#gaWorld');
  const gridG = svg.select('#gaGrid');
  const routeG = svg.select('#gaRoutes');
  const nodeG = svg.select('#gaNodes');
  const labelG = svg.select('#gaLabels');
  const rings = svg.select('#gaRings');

  worldG.selectAll('path')
    .data(countries.features)
    .join('path')
    .attr('class', d => String(d.id) === '410' ? 'ga-country is-korea' : 'ga-country')
    .attr('d', geoPath);

  gridG.append('path')
    .attr('class', 'ga-grid')
    .attr('d', geoPath(d3.geoGraticule10()));

  const raw = [
    { id: 'KOREA', coord: [127.7669, 35.9078], home: true },
    { id: 'CHINA', label: 'CHINA', coord: [116.4074, 39.9042], dx: -24, dy: -12, bend: -14, anchor: 'end' },
    { id: 'JAPAN', label: 'JAPAN', coord: [139.6503, 35.6762], dx: 13, dy: -7, bend: -10, anchor: 'start' },
    { id: 'SEA', label: 'SOUTHEAST ASIA', coord: [103.8198, 1.3521], dx: 12, dy: 17, bend: 38, anchor: 'start' },
    { id: 'MIDDLE', label: 'MIDDLE EAST', coord: [55.2708, 25.2048], dx: -22, dy: -9, bend: -42, anchor: 'end' },
    { id: 'EUROPE', label: 'EUROPE', coord: [2.3522, 48.8566], dx: -18, dy: -10, bend: -48, anchor: 'end' },
    { id: 'NA', label: 'NORTH AMERICA', coord: [-74.0060, 40.7128], dx: 12, dy: -5, bend: -72, anchor: 'start' },
    { id: 'OCEANIA', label: 'OCEANIA', coord: [151.2093, -33.8688], dx: -12, dy: 18, bend: 46, anchor: 'end' }
  ];

  const pts = raw.map(d => {
    const [x, y] = projection(d.coord);
    return { ...d, x, y };
  });
  const home = pts[0];
  const dest = pts.slice(1);

  function curve(a, b) {
    const mx = (a.x + b.x) / 2;
    const my = (a.y + b.y) / 2;
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const len = Math.hypot(dx, dy) || 1;
    const nx = -dy / len;
    const ny = dx / len;
    const bend = b.bend || 0;
    return `M ${a.x},${a.y} Q ${mx + nx * bend},${my + ny * bend} ${b.x},${b.y}`;
  }

  const routes = routeG.selectAll('path')
    .data(dest)
    .join('path')
    .attr('class', 'ga-route')
    .attr('d', d => curve(home, d))
    .attr('opacity', 0);

  const nodes = nodeG.selectAll('g')
    .data(dest)
    .join('g')
    .attr('transform', d => `translate(${d.x},${d.y})`)
    .attr('opacity', 0);

  nodes.each(function() {
    const g = d3.select(this);
    g.append('circle').attr('class', 'ga-node-ring').attr('r', 5.2);
    g.append('circle').attr('class', 'ga-node-core').attr('r', 2.05);
  });

  const homeNode = nodeG.append('g')
    .attr('class', 'ga-home-node')
    .attr('transform', `translate(${home.x},${home.y})`)
    .attr('opacity', 0);
  homeNode.append('circle').attr('class', 'ga-node-ring').attr('r', 10.5);
  homeNode.append('circle').attr('class', 'ga-node-core').attr('r', 4.1);

  const labels = labelG.selectAll('text.ga-label')
    .data(dest)
    .join('text')
    .attr('class', 'ga-label')
    .attr('x', d => d.x + d.dx)
    .attr('y', d => d.y + d.dy)
    .attr('text-anchor', d => d.anchor || (d.dx < 0 ? 'end' : 'start'))
    .attr('opacity', 0)
    .text(d => d.label);

  const homeBrand = labelG.append('g')
    .attr('class', 'ga-home-lockup')
    .attr('transform', `translate(${home.x + 16},${home.y - 19})`)
    .attr('opacity', 0);

  homeBrand.append('text')
    .attr('class', 'ga-home-brand')
    .attr('x', 0)
    .attr('y', 0)
    .text('at PRIVÉ');

  homeBrand.append('text')
    .attr('class', 'ga-home-country')
    .attr('x', 1)
    .attr('y', 16)
    .text('KOREA · PRIVATE ACCESS');

  rings
    .attr('transform', `translate(${home.x},${home.y})`)
    .attr('opacity', 0);

  const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

  function resetVisuals() {
    routes.interrupt().attr('opacity', 0).attr('stroke-dasharray', null).attr('stroke-dashoffset', null);
    nodes.interrupt().attr('opacity', 0);
    labels.interrupt().attr('opacity', 0);
    homeNode.interrupt().attr('opacity', 0);
    homeBrand.interrupt().attr('opacity', 0).attr('transform', `translate(${home.x + 16},${home.y - 13})`);
    rings.interrupt().attr('opacity', 0);
    rings.selectAll('circle').interrupt().attr('opacity', 0);
  }

  function revealCore() {
    homeNode
      .attr('opacity', 0)
      .transition().duration(520).ease(d3.easeCubicOut)
      .attr('opacity', 1);

    homeBrand
      .attr('opacity', 0)
      .attr('transform', `translate(${home.x + 16},${home.y - 13})`)
      .transition().duration(650).ease(d3.easeCubicOut)
      .attr('opacity', 1)
      .attr('transform', `translate(${home.x + 16},${home.y - 19})`);

    rings.attr('opacity', 1);
    rings.selectAll('circle').each(function(_, i) {
      d3.select(this)
        .attr('r', [16, 28, 42][i])
        .attr('opacity', 0)
        .transition().delay(160 + i * 90).duration(1100).ease(d3.easeCubicOut)
        .attr('r', [31, 50, 72][i])
        .attr('opacity', [0.19, 0.10, 0.045][i])
        .transition().duration(900)
        .attr('r', [38, 62, 88][i])
        .attr('opacity', 0);
    });
  }

  function drawAllRoutes() {
    routes.each(function() {
      const path = d3.select(this);
      const len = this.getTotalLength();
      path
        .interrupt()
        .attr('opacity', 0.82)
        .attr('stroke-dasharray', `${len} ${len}`)
        .attr('stroke-dashoffset', len)
        .transition()
        .duration(2300)
        .ease(d3.easeCubicInOut)
        .attr('stroke-dashoffset', 0)
        .on('end', () => path.attr('stroke-dasharray', null).attr('stroke-dashoffset', null));
    });

    nodes
      .transition().delay(1420).duration(620).ease(d3.easeCubicOut)
      .attr('opacity', 1);

    labels
      .transition().delay(1500).duration(720).ease(d3.easeCubicOut)
      .attr('opacity', 0.76);

    nodes.select('.ga-node-ring')
      .transition().delay(1760).duration(300).attr('r', 8.2)
      .transition().duration(520).attr('r', 5.2);
  }

  function settleNetwork() {
    routes
      .transition().duration(820).ease(d3.easeCubicOut)
      .attr('opacity', 0.34);

    labels
      .transition().duration(820)
      .attr('opacity', 0.58);

    nodes
      .transition().duration(820)
      .attr('opacity', 0.78);

    homeNode.select('.ga-node-ring')
      .transition().duration(480).attr('r', 13)
      .transition().duration(760).attr('r', 10.5);

    rings.attr('opacity', 1);
    rings.selectAll('circle').each(function(_, i) {
      d3.select(this)
        .attr('r', [22, 38, 55][i])
        .attr('opacity', [0.12, 0.06, 0.025][i])
        .transition().duration(1800).ease(d3.easeSinInOut)
        .attr('r', [28, 48, 68][i])
        .attr('opacity', 0);
    });
  }

  async function play() {
    resetVisuals();
    await wait(420);
    revealCore();
    await wait(1050);
    drawAllRoutes();
    await wait(2650);
    settleNetwork();
    await wait(3300);

    // Quiet close: the network recedes, at PRIVÉ remains as the visual anchor.
    routes.transition().duration(900).attr('opacity', 0.10);
    labels.transition().duration(900).attr('opacity', 0.18);
    nodes.transition().duration(900).attr('opacity', 0.28);
    await wait(1450);

    play();
  }

  if (matchMedia('(prefers-reduced-motion:reduce)').matches) {
    homeNode.attr('opacity', 1);
    homeBrand.attr('opacity', 1);
    routes.attr('opacity', 0.28);
    nodes.attr('opacity', 0.72);
    labels.attr('opacity', 0.58);
  } else {
    play();
  }
}
