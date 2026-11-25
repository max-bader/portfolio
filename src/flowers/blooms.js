const TAU = Math.PI * 2;
const palettes = new Map();

function palette(color) {
  if (palettes.has(color)) return palettes.get(color);
  const rgb = [1, 3, 5].map(offset => parseInt(color.slice(offset, offset + 2), 16));
  const tint = (target, amount) => {
    const channels = rgb.map((value, i) => Math.round(value + (target[i] - value) * amount));
    return `rgb(${channels.join(',')})`;
  };
  const shades = {
    color,
    shadow: tint([44, 15, 68], .66),
    fold: tint([72, 31, 90], .34),
    light: tint([255, 246, 226], .40),
    rim: tint([255, 249, 235], .72),
  };
  palettes.set(color, shades);
  return shades;
}

// All paths are in bloom radii. Keep tonal changes broad enough to survive
// sampling back onto the character grid.
function silk(g, shades, lightFromLeft) {
  const direction = lightFromLeft ? 1 : -1;
  const paint = g.createLinearGradient(-.3 * direction, -.85, .32 * direction, -.25);
  paint.addColorStop(0, shades.light);
  paint.addColorStop(.38, shades.color);
  paint.addColorStop(1, shades.shadow);
  return paint;
}

function petal(g, broad) {
  g.beginPath();
  g.moveTo(0, -.04);
  if (broad) {
    // A shallow cleft in the rim and a pinched base distinguish cosmos.
    g.bezierCurveTo(-.18, -.13, -.48, -.7, -.39, -.93);
    g.bezierCurveTo(-.31, -1.13, -.11, -1.1, -.035, -1.025);
    g.bezierCurveTo(.05, -1.13, .25, -1.09, .35, -.97);
    g.bezierCurveTo(.52, -.7, .17, -.19, 0, -.04);
  } else {
    g.bezierCurveTo(-.13, -.28, -.19, -.76, -.115, -.97);
    g.bezierCurveTo(-.05, -1.18, .12, -1.12, .15, -.91);
    g.bezierCurveTo(.19, -.56, .105, -.2, 0, -.04);
  }
  g.closePath();
  g.fill();
}

function drawDiskFlower(g, shades, broad, bloom, yaw, seed) {
  const count = broad ? 7 : 12;
  const phase = seed * 2.4 + .12 * Math.sin(yaw);
  g.save();
  g.transform(.86 + .12 * Math.cos(yaw), .065 * Math.sin(yaw), -.09 * Math.sin(yaw), 1, 0, 0);
  for (let index = 0; index < count; index++) {
    const angle = phase + index * TAU / count;
    g.save();
    g.rotate(angle);
    g.scale(.78 + .22 * bloom, (.91 + .09 * Math.sin(index * 5 + seed)) * (.72 + .28 * bloom));
    g.fillStyle = silk(g, shades, Math.cos(angle + yaw * .25) > 0);
    petal(g, broad);
    if (broad) {
      g.strokeStyle = shades.fold;
      g.lineWidth = .045;
      g.beginPath();
      g.moveTo(0, -.18);
      g.quadraticCurveTo(-.065, -.55, -.025, -.85);
      g.stroke();
    }
    g.restore();
  }
  g.restore();

  const radius = broad ? .225 : .295;
  const gold = g.createRadialGradient(-.07, -.07, .025, .025, .035, radius);
  gold.addColorStop(0, '#ffeaae');
  gold.addColorStop(.53, '#edbc58');
  gold.addColorStop(1, '#a86126');
  g.fillStyle = gold;
  g.beginPath();
  g.ellipse(0, .025, radius, radius * .87, 0, 0, TAU);
  g.fill();
}

function drawTulip(g, shades, yaw) {
  const lean = .24 * Math.sin(yaw);
  g.rotate(lean);
  g.translate(0, .20);

  // Inner goblet and overlapping outer petals each have their own rim.
  g.fillStyle = shades.fold;
  g.beginPath();
  g.moveTo(-.67, -.71);
  g.quadraticCurveTo(-.22, -1.01, -.13, -1.19);
  g.quadraticCurveTo(.10, -1.14, .30, -.89);
  g.lineTo(.59, -1.06);
  g.quadraticCurveTo(.90, -.03, 0, .25);
  g.quadraticCurveTo(-.59, .05, -.67, -.71);
  g.fill();

  g.fillStyle = silk(g, shades, true);
  g.beginPath();
  g.moveTo(-.78, -1.05);
  g.bezierCurveTo(-.30, -.85, .06, -.78, .36, -.26);
  g.quadraticCurveTo(.38, .08, 0, .22);
  g.bezierCurveTo(-.62, .23, -.79, -.24, -.78, -1.05);
  g.fill();

  const outer = g.createLinearGradient(-.17, -.10, .73, -.68);
  outer.addColorStop(0, shades.shadow);
  outer.addColorStop(.55, shades.color);
  outer.addColorStop(1, shades.rim);
  g.fillStyle = outer;
  g.beginPath();
  g.moveTo(.76, -.98);
  g.bezierCurveTo(.37, -.73, -.03, -.49, -.25, -.08);
  g.quadraticCurveTo(-.12, .34, .28, .19);
  g.quadraticCurveTo(.79, .03, .76, -.98);
  g.fill();
}

function drawLavender(g, shades, yaw, seed) {
  const bend = .32 * Math.sin(yaw + seed * 1.8);
  g.strokeStyle = '#95aa75';
  g.lineWidth = .07;
  g.beginPath();
  g.moveTo(0, .25);
  g.quadraticCurveTo(bend * .1, -.43, bend, -1.40);
  g.stroke();

  for (let row = 0; row < 5; row++) {
    const height = row / 4;
    const center = bend * height * height;
    const size = .38 - height * .17;
    for (const side of [-1, 1]) {
      const x = center + side * size * .56;
      const y = -.07 - height * 1.28 - (side > 0 ? .07 : 0);
      g.fillStyle = side < 0 ? shades.color : shades.fold;
      g.beginPath();
      g.ellipse(x, y, size, size * .62, -side * .55, 0, TAU);
      g.fill();
      g.fillStyle = shades.light;
      g.beginPath();
      g.ellipse(x + side * size * .5, y - size * .31, size * .36, size * .22, -side * .55, 0, TAU);
      g.fill();
    }
  }
}

export function drawBloom(g, { kind, color, radius, bloom, yaw, seed }) {
  if (bloom <= 0) return;
  const shades = palette(color);
  g.save();
  g.scale(radius * bloom, radius * bloom);
  if (kind === 'tulip') drawTulip(g, shades, yaw + seed);
  else if (kind === 'lavender') drawLavender(g, shades, yaw, seed);
  else drawDiskFlower(g, shades, kind === 'cosmos', bloom, yaw + seed, seed);
  g.restore();
}
