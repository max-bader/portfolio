import React, { useEffect, useRef } from 'react';
import { drawBloom } from './blooms';
import './flowers.css';

const TAU = 2 * Math.PI;
const WIDTH = 176;
const HEIGHT = 170;
const TIE = { x: 88, y: 139 };

// Each stem has a fixed place in the bunch. The three tiers leave sightlines
// through the crown as flowers at the back come around to the front.
const flowers = [
  // species, color, head radius, distance from axis, azimuth, height on sheet
  ['lavender', '#a690fa', 7.5, 25, 1.5, 27],
  ['cosmos', '#fa8eaf', 10.5, 15, 3.8, 37],
  ['daisy', '#ffdd91', 8.5, 29, 5.5, 40],
  ['tulip', '#f599a2', 10.5, 43, 3.3, 55],
  ['cosmos', '#faacc8', 10, 41, 1.3, 55],
  ['lavender', '#9bb4fa', 8, 43, 4.6, 53],
  ['daisy', '#fff2ca', 9.5, 45, 0.1, 56],
  ['tulip', '#ef817c', 10.5, 12, 4.8, 64],
  ['cosmos', '#b2adff', 9.5, 54, 2.9, 77],
  ['lavender', '#b2a0ed', 8.5, 53, 0.6, 82],
  ['daisy', '#ffcb74', 9, 42, 4.0, 82],
  ['tulip', '#d39abe', 10, 49, 5.6, 86],
  ['cosmos', '#f4a18f', 10.5, 20, 1.7, 90],
  ['daisy', '#ffe8c7', 8, 39, 2.2, 105],
  ['cosmos', '#eb85ab', 9, 34, 5.0, 106],
  ['lavender', '#b0baff', 7.5, 26, 0.3, 103],
].map(([kind, color, radius, reach, azimuth, height], id) => ({
  kind, color, radius, reach, azimuth, height, id
}));

function grow(time, delay, duration) {
  const n = Math.min(1, Math.max(0, (time - delay) / duration));
  return n * n * (3 - 2 * n);
}

function stemPoint(t, control, end) {
  const s = 1 - t;
  return {
    x: s*s*TIE.x + 2*s*t*control.x + t*t*end.x,
    y: s*s*TIE.y + 2*s*t*control.y + t*t*end.y
  };
}

function strokeStem(g, end, control, amount, color, width) {
  const tip = stemPoint(amount, control, end);
  g.strokeStyle = color;
  g.lineWidth = width;
  g.beginPath();
  g.moveTo(TIE.x, TIE.y);
  g.quadraticCurveTo(TIE.x + (control.x - TIE.x) * amount,
    TIE.y + (control.y - TIE.y) * amount, tip.x, tip.y);
  g.stroke();
}

function drawSprig(g, index, turn, t) {
  const azimuth = index * 2.39996 + turn;
  const reach = 38 + index % 3 * 7;
  const sway = Math.sin(azimuth);
  const end = { x: 88 + reach * sway, y: 48 + (index * 17) % 53 + 7 * Math.cos(azimuth) };
  const control = { x: 88 + reach * sway * .62, y: 100 };
  const amount = grow(t, .85 + index * .12, 2.9);
  strokeStem(g, end, control, amount, '#69846e', .48);
  for (let twig = 0; twig < 5; twig++) {
    const unfurl = grow(t, 2.85 + index * .10 + twig * .11, .95);
    if (!unfurl) continue;
    const joint = stemPoint(.66 + twig * .072, control, end);
    const side = twig % 2 ? -1 : 1;
    const x = joint.x + side * (6 - twig * .65) * unfurl;
    const y = joint.y - (3 + twig % 2) * unfurl;
    g.strokeStyle = '#88a080';
    g.lineWidth = .46;
    g.beginPath();
    g.moveTo(joint.x, joint.y);
    g.lineTo(x, y);
    g.stroke();
    g.fillStyle = twig % 2 ? '#e7debc' : '#f7e6d7';
    for (const [dx, dy] of [[0, 0], [1.6, -1.1], [-1, -1.7]]) {
      g.beginPath();
      g.arc(x + dx, y + dy, .72 * unfurl, 0, TAU);
      g.fill();
    }
  }
}

function drawBunch(g, time, turn) {
  const stems = flowers.map(flower => {
    const bearing = flower.azimuth + turn;
    const depth = flower.reach * Math.cos(bearing);
    const x = TIE.x + flower.reach * Math.sin(bearing);
    return { flower, bearing, depth, x, y: flower.height + depth * .24 };
  }).sort((a, b) => a.depth - b.depth);

  // Vary the cut ends and gather them into the same tie as the long stems.
  for (let i = 0; i < 7; i++) {
    const spread = Math.sin(turn + i * 2.4);
    const length = (14 + i % 4 * 2.3) * grow(time, .1 + i * .04, 1);
    g.strokeStyle = i % 2 ? '#638962' : '#89a97b';
    g.lineWidth = .9;
    g.beginPath();
    g.moveTo(TIE.x + spread * 1.7, TIE.y);
    g.lineTo(TIE.x + spread * length * .23, TIE.y + length);
    g.stroke();
  }

  for (const { flower, x, y, depth } of stems) {
    const control = { x: TIE.x + (x - TIE.x) * .42, y: 109 };
    const start = .36 + flower.id % 5 * .14;
    const amount = grow(time, start, 2.7);
    strokeStem(g, { x, y }, control, amount, depth > 0 ? '#8aa980' : '#5b876e', depth > 0 ? .85 : .68);
    const leaf = grow(time, start + 1.65, .9);
    if (leaf && flower.id % 2 === 0) {
      const joint = stemPoint(.50 + .08 * (flower.id % 3), control, { x, y });
      const side = x > TIE.x ? 1 : -1;
      g.save();
      g.translate(joint.x, joint.y);
      g.scale(side * leaf, leaf);
      g.fillStyle = '#79997a';
      g.beginPath();
      g.moveTo(0, 0);
      g.quadraticCurveTo(2, -5, 8.5, -8.5);
      g.quadraticCurveTo(6, -3.3, 0, 0);
      g.fill();
      g.restore();
    }
  }
  for (let i = 0; i < 7; i++) drawSprig(g, i, turn, time);

  for (const { flower, x, y, depth, bearing } of stems) {
    g.save();
    g.translate(x, y);
    g.rotate(.16 * Math.sin(bearing));
    drawBloom(g, {
      ...flower,
      radius: flower.radius * (1 + depth * .0014),
      bloom: grow(time, 3.25 + flower.id % 5 * .14 + flower.id * .056, 1.45),
      yaw: bearing,
      seed: flower.id
    });
    g.restore();
  }

  // A small blush ribbon gives the base a visible finishing detail.
  g.save();
  g.translate(TIE.x, TIE.y);
  const knot = grow(time, 2.65, .85);
  g.scale(knot, knot);
  g.lineWidth = 1.2;
  g.strokeStyle = '#da9caa';
  g.beginPath();
  g.moveTo(0, 0);
  g.bezierCurveTo(-11, -6, -11, 4, 0, 0);
  g.bezierCurveTo(9, -7, 12, .5, 0, 0);
  g.moveTo(0, 0);
  g.quadraticCurveTo(-1, 5, -8, 8);
  g.moveTo(0, 0);
  g.quadraticCurveTo(3, 2, 5, 8);
  g.stroke();
  g.restore();
}

// One wing of each butterfly, from its body out to the tip. The mirrored
// halves move on the same hinge; the lettering itself stays crisp.
const butterflies = [
  {
    side: -1, height: .32, wingbeat: 3.1, colors: ['#e9b278', '#f7d6a2', '#d49077'],
    wing: ['   .:', '  +o*', ' +*x:', ':xo.', ' +x:', '  +.']
  },
  {
    side: 1, height: .62, wingbeat: 3.8, colors: ['#93b5da', '#d6d9ff', '#a795ce'],
    wing: ['   .+', '  :xo', ' +oo:', ':x*.', ' *x:', '  +:', '   .']
  }
];

function drawButterflies(ctx, width, height, time, scale) {
  // Use the available side margins so the flight paths frame the flowers on
  // both portrait and landscape screens.
  const margin = Math.max(width * .09, width / 2 - scale * 60);
  const pitch = Math.min(5.3, Math.max(2.1, margin / 16), height / 96);
  for (const butterfly of butterflies) {
    const { side, wing, colors } = butterfly;
    const beat = time * butterfly.wingbeat;
    const flight = time * .22 + side;
    const inset = margin * (.53 + .20 * Math.sin(flight));
    const x = side < 0 ? inset : width - inset;
    const y = height * (butterfly.height + .075 * Math.sin(flight * .8)) + pitch * Math.sin(beat);
    const spread = .63 + .35 * Math.cos(beat);
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(-side * .28 + .16 * Math.sin(flight));
    ctx.globalAlpha = .88 * grow(time, 2.1 + (side + 1) * .65, 1.4);
    ctx.font = `600 ${pitch * 1.44}px ui-monospace, Menlo, monospace`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    for (let row = 0; row < wing.length; row++) {
      for (let col = 0; col < wing[row].length; col++) {
        const glyph = wing[row][col];
        if (glyph === ' ') continue;
        const offset = (col + .8) * pitch * spread;
        const rise = (row - 2.7) * pitch * .9 - col * pitch * (1 - spread) * .42;
        ctx.fillStyle = colors[(row + col) % colors.length];
        ctx.fillText(glyph, -offset, rise);
        ctx.fillText(glyph, offset, rise);
      }
    }
    ctx.fillStyle = colors[1];
    ctx.fillText('v', 0, -pitch * 1.2);
    ctx.fillText(':', 0, 0);
    ctx.fillText("'", 0, pitch);
    ctx.restore();
  }
}

function drawSky(ctx, width, height, t) {
  ctx.font = '10px monospace';
  for (let i = 0; i < 114; i++) {
    const x = ((i * 7919) % 997) / 997 * width;
    const y = ((i * 3571) % 991) / 991 * height;
    const alpha = (.30 + .13 * Math.sin(t * .7 + i)) * grow(t, i % 19 * .05, .9);
    ctx.fillStyle = `rgba(216,213,215,${alpha})`;
    if (i % 21 === 0) ctx.fillText('+', x, y);
    else ctx.fillRect(x, y, i % 5 === 0 ? 1.4 : .85, 1);
  }
}

export default function Flowers() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { alpha: false });
    const source = document.createElement('canvas');
    const ink = source.getContext('2d', { willReadFrequently: true });
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const start = performance.now();
    let request, last = -Infinity;
    let w, h, scale, cellW, cellH, ox, oy;

    function resize() {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      scale = Math.min(w / 157, h / 178, 5.5);
      ox = (w - WIDTH * scale) / 2;
      oy = (h - HEIGHT * scale) / 2;
      // Each sample covers the real proportions of a monospace type cell.
      // Flowers stay round and the lettering stays visible on small screens.
      const columns = Math.max(120, Math.min(208, Math.round(WIDTH * scale / 3.4)));
      source.width = columns;
      source.height = Math.round(columns / WIDTH * HEIGHT / 1.37);
      cellW = WIDTH * scale / source.width;
      cellH = HEIGHT * scale / source.height;
      ink.setTransform(source.width / WIDTH, 0, 0, source.height / HEIGHT, 0, 0);
      last = -Infinity;
    }

    function paint(now) {
      const t = reduced.matches ? 9 : Math.max(0, (now - start) / 1000);
      ink.clearRect(0, 0, WIDTH, HEIGHT);
      ink.lineCap = 'round';
      drawBunch(ink, t, reduced.matches ? 0 : t * .16);
      ctx.fillStyle = '#050506';
      ctx.fillRect(0, 0, w, h);
      ctx.textBaseline = 'top';
      drawSky(ctx, w, h, t);
      drawButterflies(ctx, w, h, t, scale);
      ctx.font = `600 ${cellW * 1.65}px ui-monospace, Menlo, monospace`;
      const pixels = ink.getImageData(0, 0, source.width, source.height).data;
      const glyphs = '.,:;+ox*O%@';
      for (let row = 0; row < source.height; row++) {
        for (let col = 0; col < source.width; col++) {
          const j = 4 * (row * source.width + col);
          if (pixels[j+3] < 26) continue;
          const r = pixels[j], g = pixels[j+1], b = pixels[j+2];
          const light = (.30*r + .57*g + .13*b) / 255;
          const coverage = pixels[j+3] / 255;
          const index = Math.min(glyphs.length - 1, Math.floor((.13 + .87 * light) * Math.sqrt(coverage) * glyphs.length));
          ctx.fillStyle = `rgba(${r},${g},${b},${Math.min(1, coverage * 1.6)})`;
          ctx.fillText(glyphs[index], ox + col * cellW, oy + row * cellH);
        }
      }
    }
    function animate(now) {
      if (now - last >= 1000 / 30 - 1) {
        paint(now);
        last = now;
      }
      if (!reduced.matches) request = requestAnimationFrame(animate);
    }
    function refresh() {
      cancelAnimationFrame(request);
      resize();
      request = requestAnimationFrame(animate);
    }
    refresh();
    window.addEventListener('resize', refresh);
    reduced.addEventListener('change', refresh);
    return () => {
      cancelAnimationFrame(request);
      window.removeEventListener('resize', refresh);
      reduced.removeEventListener('change', refresh);
    };
  }, []);
  return (
    <main className="flower-scene">
      <canvas ref={canvasRef} role="img" aria-label="A slowly turning ASCII wildflower bouquet tied with a pink ribbon. Two tiny butterflies flutter on either side." />
    </main>
  );
}
