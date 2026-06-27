import { useEffect, useRef } from 'react';

/**
 * Fullscreen WebGL shader canvas — the animated graph-particle background used on the Home page.
 * Renders a subtle teal node-pulse effect. Falls back gracefully if WebGL is unavailable.
 */
export default function ShaderCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext('webgl') ?? canvas.getContext('experimental-webgl') as WebGLRenderingContext | null;
    if (!gl) return;

    const vert = `
      attribute vec2 a_pos;
      void main() { gl_Position = vec4(a_pos, 0, 1); }
    `;
    const frag = `
      precision mediump float;
      uniform float u_time;
      uniform vec2  u_res;

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

        vec2 n1 = vec2(sin(t) * 0.3,          cos(t * 0.7) * 0.3);
        vec2 n2 = vec2(cos(t * 1.3) * 0.55,   sin(t * 0.9) * 0.4);
        vec2 n3 = vec2(sin(t * 0.8 + 1.0) * 0.4, cos(t * 1.1) * 0.5);
        vec2 n4 = vec2(-0.5 + sin(t * 0.6) * 0.2, sin(t * 1.4) * 0.2);
        vec2 n5 = vec2(0.6 + cos(t) * 0.1,        0.0 + sin(t * 1.2) * 0.3);

        vec3 col = vec3(0.075, 0.075, 0.088);

        float pulse = 0.5 + 0.5 * sin(u_time * 2.0);
        vec3 teal   = vec3(0.765, 0.961, 1.0);
        vec3 purple = vec3(0.867, 0.722, 1.0);
        vec3 mint   = vec3(0.659, 1.0,   0.824);

        col += teal   * node(uv, n1, 0.04 + 0.015 * pulse) * 0.25;
        col += purple * node(uv, n2, 0.03) * 0.2;
        col += mint   * node(uv, n3, 0.035) * 0.2;
        col += teal   * node(uv, n4, 0.025) * 0.18;
        col += purple * node(uv, n5, 0.030) * 0.18;

        col += teal   * line(uv, n1, n2, 0.003) * 0.12;
        col += teal   * line(uv, n1, n3, 0.003) * 0.10;
        col += purple * line(uv, n2, n5, 0.003) * 0.10;
        col += mint   * line(uv, n3, n4, 0.003) * 0.09;
        col += teal   * line(uv, n4, n1, 0.003) * 0.09;

        float vignette = smoothstep(1.4, 0.5, length(uv));
        col *= vignette;

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

    let raf = 0;
    let start = performance.now();

    function resize() {
      canvas!.width  = window.innerWidth;
      canvas!.height = window.innerHeight;
      gl!.viewport(0, 0, canvas!.width, canvas!.height);
    }

    function draw() {
      const t = (performance.now() - start) / 1000;
      gl!.uniform1f(uTime, t);
      gl!.uniform2f(uRes, canvas!.width, canvas!.height);
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
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      aria-hidden="true"
    />
  );
}
