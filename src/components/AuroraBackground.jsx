import React, { useEffect, useRef } from 'react';

const VERT = `
attribute vec2 aPos;
void main() {
  gl_Position = vec4(aPos, 0.0, 1.0);
}
`;

const FRAG = `
precision highp float;
uniform vec2 uRes;
uniform float uTime;

// Simplex noise (Ashima / Ian McEwan, BSD)
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x * 34.0) + 1.0) * x); }
float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                     -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod289(i);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
                        + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy),
                          dot(x12.zw, x12.zw)), 0.0);
  m = m * m; m = m * m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 3; i++) {
    v += a * snoise(p);
    p = p * 2.0 + vec2(1.7, 9.2);
    a *= 0.5;
  }
  return v;
}

void main() {
  vec2 uv = gl_FragCoord.xy / uRes.xy;
  float asp = uRes.x / uRes.y;
  vec2 p = vec2(uv.x * asp, uv.y) * 1.15;
  float t = uTime * 0.05;

  // slow, low-frequency domain warp -> smooth flowing "silk"
  float w1 = fbm(p * 0.8 + vec2(0.0, t));
  float w2 = fbm(p * 0.8 + vec2(t * 0.8, 1.3) + 3.0);
  vec2 warp = vec2(w1, w2) * 0.7;
  float f = fbm(p + warp);
  f = f * 0.5 + 0.5;

  // palette: deep emerald (not black) -> vivid green -> light mint
  vec3 deep = vec3(0.020, 0.150, 0.105);
  vec3 mid  = vec3(0.075, 0.600, 0.400);
  vec3 hi   = vec3(0.560, 1.000, 0.780);

  vec3 col = mix(deep, mid, smoothstep(0.22, 0.78, f));
  col = mix(col, hi, smoothstep(0.72, 1.0, f) * 0.65);

  // soft off-center light
  float light = smoothstep(0.95, 0.0, length((uv - vec2(0.45, 0.55)) * vec2(asp, 1.0)));
  col += light * 0.10 * vec3(0.35, 0.90, 0.60);

  // vignette so edges settle into the page
  float vig = smoothstep(1.35, 0.35, length(uv - 0.5));
  col *= mix(0.45, 1.0, vig);

  // subtle dithering to kill banding
  float dither = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453);
  col += (dither - 0.5) / 255.0;

  gl_FragColor = vec4(col, 1.0);
}
`;

export default function AuroraBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl =
      canvas.getContext('webgl', { antialias: false, alpha: false, powerPreference: 'low-power' }) ||
      canvas.getContext('experimental-webgl');
    if (!gl) return; // CSS fallback gradient shows through

    const compile = (type, src) => {
      const s = gl.createShader(type);
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        console.warn('shader:', gl.getShaderInfoLog(s));
        return null;
      }
      return s;
    };

    const vs = compile(gl.VERTEX_SHADER, VERT);
    const fs = compile(gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return;

    const prog = gl.createProgram();
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.warn('program:', gl.getProgramInfoLog(prog));
      return;
    }
    gl.useProgram(prog);

    // full-screen triangle
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(prog, 'aPos');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, 'uRes');
    const uTime = gl.getUniformLocation(prog, 'uTime');

    const RES_SCALE = 0.6; // render below CSS size; smooth noise hides it
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const start = performance.now();
    let raf = 0;

    const resize = () => {
      const w = Math.max(1, Math.floor(canvas.clientWidth * RES_SCALE));
      const h = Math.max(1, Math.floor(canvas.clientHeight * RES_SCALE));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
      gl.uniform2f(uRes, w, h);
    };

    const draw = (now) => {
      resize();
      gl.uniform1f(uTime, (now - start) / 1000);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const loop = (now) => {
      draw(now);
      raf = requestAnimationFrame(loop);
    };

    draw(start); // paint one frame immediately (no blank flash before rAF)
    if (!reduce) {
      raf = requestAnimationFrame(loop);
    }

    const onResize = () => {
      if (reduce) draw(performance.now());
    };
    const onVis = () => {
      if (reduce) return;
      if (document.hidden) {
        cancelAnimationFrame(raf);
      } else {
        raf = requestAnimationFrame(loop);
      }
    };

    window.addEventListener('resize', onResize);
    document.addEventListener('visibilitychange', onVis);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, []);

  return <canvas ref={canvasRef} className="hero-aurora" aria-hidden="true" />;
}
