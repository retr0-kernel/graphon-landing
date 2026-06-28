import { useEffect, useRef } from 'react';
import { useTheme } from '../../context/ThemeContext';

/**
 * Fullscreen WebGL shader canvas — the animated graph-particle background used on the Home page.
 * Renders a subtle teal node-pulse effect. Falls back gracefully if WebGL is unavailable.
 * Responds to dark/light theme via the u_dark uniform (1.0 = dark, 0.0 = light).
 */
interface ShaderCanvasProps {
  className?: string;
}

export default function ShaderCanvas({
  className = 'absolute inset-0 w-full h-full bg-background pointer-events-none',
}: ShaderCanvasProps) {
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const { resolved } = useTheme();
  const initialDark = resolved === 'dark' ? 1.0 : 0.0;
  // Live refs let the draw loop animate theme changes without re-running the WebGL setup.
  const darkRef = useRef(initialDark);
  const darkTransitionRef = useRef({
    from: initialDark,
    to: initialDark,
    start: 0,
    duration: 0,
  });

  // Smoothly blend the shader palette whenever theme changes.
  useEffect(() => {
    const nextDark = resolved === 'dark' ? 1.0 : 0.0;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduceMotion) {
      darkRef.current = nextDark;
      darkTransitionRef.current = {
        from: nextDark,
        to: nextDark,
        start: performance.now(),
        duration: 0,
      };
      return;
    }

    darkTransitionRef.current = {
      from: darkRef.current,
      to: nextDark,
      start: performance.now(),
      duration: 1100,
    };
  }, [resolved]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = (canvas.getContext('webgl') ?? canvas.getContext('experimental-webgl')) as WebGLRenderingContext | null;
    if (!gl) return;

    const vert = `
      attribute vec2 a_pos;
      void main() { gl_Position = vec4(a_pos, 0, 1); }
    `;
    const frag = `
      precision mediump float;
      uniform float u_time;
      uniform vec2  u_res;
      uniform float u_dark;   /* 1.0 = dark mode, 0.0 = light mode */

      float node(vec2 uv, vec2 pos, float r) {
        return smoothstep(r, r * 0.6, length(uv - pos));
      }

      float line(vec2 uv, vec2 a, vec2 b, float w) {
        vec2 ab = b - a, ap = uv - a;
        float t = clamp(dot(ap, ab) / dot(ab, ab), 0.0, 1.0);
        return smoothstep(w, w * 0.3, length(ap - t * ab));
      }

      void main() {
        vec2 uv = (gl_FragCoord.xy / u_res) * 2.0 - 1.0;
        uv.x *= u_res.x / u_res.y;

        float t = u_time * 0.4;

        vec2 n1 = vec2(sin(t) * 0.30,              cos(t * 0.7) * 0.30);
        vec2 n2 = vec2(cos(t * 1.3) * 0.55,        sin(t * 0.9) * 0.40);
        vec2 n3 = vec2(sin(t * 0.8 + 1.0) * 0.40,  cos(t * 1.1) * 0.50);
        vec2 n4 = vec2(-0.58 + sin(t * 0.6) * 0.2, sin(t * 1.4) * 0.22);
        vec2 n5 = vec2(0.62 + cos(t) * 0.12,       sin(t * 1.2) * 0.30);
        vec2 n6 = vec2(-0.18 + cos(t * 0.9) * 0.18, -0.58 + sin(t * 0.8) * 0.12);
        vec2 n7 = vec2(0.28 + sin(t * 1.1) * 0.18,  -0.42 + cos(t * 0.7) * 0.18);
        vec2 n8 = vec2(-0.72 + cos(t * 0.75) * 0.12, 0.42 + sin(t * 1.05) * 0.12);
        vec2 n9 = vec2(0.76 + sin(t * 0.65) * 0.12,  0.46 + cos(t * 0.95) * 0.14);

        /* ── Background: dark = near-black, light = near-white ── */
        vec3 bgDark  = vec3(0.075, 0.075, 0.088);
        vec3 bgLight = vec3(0.957, 0.957, 0.972);
        vec3 col     = mix(bgLight, bgDark, u_dark);

        float pulse = 0.5 + 0.5 * sin(u_time * 2.0);

        /* ── Node / line colours: bright on dark, deep on light ── */
        vec3 tealD   = vec3(0.765, 0.961, 1.0);
        vec3 purpleD = vec3(0.867, 0.722, 1.0);
        vec3 mintD   = vec3(0.659, 1.0,   0.824);

        vec3 tealL   = vec3(0.0,  0.408, 0.459);   /* --c-primary light */
        vec3 purpleL = vec3(0.408, 0.0,  0.706);   /* --c-secondary light */
        vec3 mintL   = vec3(0.0,  0.322, 0.165);   /* --c-tertiary light */

        vec3 teal   = mix(tealL,   tealD,   u_dark);
        vec3 purple = mix(purpleL, purpleD, u_dark);
        vec3 mint   = mix(mintL,   mintD,   u_dark);

        /* Glow brightness: stronger on light bg to stay visible */
        float glow = mix(0.55, 0.25, u_dark);

        col += teal   * node(uv, n1, 0.04 + 0.015 * pulse) * glow;
        col += purple * node(uv, n2, 0.03) * glow * 0.85;
        col += mint   * node(uv, n3, 0.035) * glow * 0.85;
        col += teal   * node(uv, n4, 0.025) * glow * 0.75;
        col += purple * node(uv, n5, 0.030) * glow * 0.75;
        col += mint   * node(uv, n6, 0.024) * glow * 0.65;
        col += teal   * node(uv, n7, 0.026) * glow * 0.7;
        col += purple * node(uv, n8, 0.023) * glow * 0.58;
        col += mint   * node(uv, n9, 0.023) * glow * 0.58;

        float lineStr = mix(0.42, 0.15, u_dark);
        col += teal   * line(uv, n1, n2, 0.0024) * lineStr;
        col += teal   * line(uv, n1, n3, 0.0024) * lineStr * 0.85;
        col += purple * line(uv, n2, n5, 0.0024) * lineStr * 0.85;
        col += mint   * line(uv, n3, n4, 0.0024) * lineStr * 0.75;
        col += teal   * line(uv, n4, n1, 0.0024) * lineStr * 0.75;
        col += mint   * line(uv, n1, n6, 0.0022) * lineStr * 0.72;
        col += teal   * line(uv, n6, n7, 0.0022) * lineStr * 0.7;
        col += purple * line(uv, n7, n5, 0.0022) * lineStr * 0.72;
        col += teal   * line(uv, n8, n1, 0.0020) * lineStr * 0.58;
        col += purple * line(uv, n3, n9, 0.0020) * lineStr * 0.58;
        col += mint   * line(uv, n8, n6, 0.0018) * lineStr * 0.45;
        col += teal   * line(uv, n7, n9, 0.0018) * lineStr * 0.45;

        /* Vignette: blend toward bg colour instead of black so light mode stays light */
        float vignette = smoothstep(1.4, 0.5, length(uv));
        col = mix(col, bgLight, (1.0 - vignette) * (1.0 - u_dark));
        col = mix(col, bgDark,  (1.0 - vignette) * u_dark);

        gl_FragColor = vec4(col, 1.0);
      }
    `;

    function createShader(type: number, src: string) {
      const s = gl!.createShader(type)!;
      gl!.shaderSource(s, src);
      gl!.compileShader(s);
      return s;
    }

    const prog = gl.createProgram()!;
    gl.attachShader(prog, createShader(gl.VERTEX_SHADER, vert));
    gl.attachShader(prog, createShader(gl.FRAGMENT_SHADER, frag));
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);

    const pos = gl.getAttribLocation(prog, 'a_pos');
    gl.enableVertexAttribArray(pos);
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(prog, 'u_time');
    const uRes  = gl.getUniformLocation(prog, 'u_res');
    const uDark = gl.getUniformLocation(prog, 'u_dark');

    let raf = 0;
    const start = performance.now();

    function resize() {
      canvas!.width  = window.innerWidth;
      canvas!.height = window.innerHeight;
      gl!.viewport(0, 0, canvas!.width, canvas!.height);
    }

    function draw() {
      const now = performance.now();
      const elapsed = (now - start) / 1000;
      const transition = darkTransitionRef.current;

      if (transition.duration > 0) {
        const progress = Math.min((now - transition.start) / transition.duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        darkRef.current = transition.from + (transition.to - transition.from) * eased;

        if (progress === 1) {
          darkTransitionRef.current = {
            ...transition,
            from: transition.to,
            duration: 0,
          };
        }
      }

      gl!.uniform1f(uTime, elapsed);
      gl!.uniform2f(uRes, canvas!.width, canvas!.height);
      gl!.uniform1f(uDark, darkRef.current);
      gl!.drawArrays(gl!.TRIANGLE_STRIP, 0, 4);
      raf = requestAnimationFrame(draw);
    }

    resize();
    draw();
    window.addEventListener('resize', resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ animation: 'fadeIn 1.4s cubic-bezier(0.16, 1, 0.3, 1) 0.1s both' }}
      aria-hidden="true"
    />
  );
}
