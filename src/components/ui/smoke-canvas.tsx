"use client";

import { useEffect, useRef } from "react";
import { MotionValue } from "framer-motion";
import { BLACK_PATHS, GREY_PATHS } from "./heading-svg-data";

interface SmokeCanvasProps {
    smokeOpacity: MotionValue<number>;
    fillValue: MotionValue<string>;
    distortionAmount: MotionValue<number>;
}

const vsSource = `
    attribute vec2 a_position;
    attribute vec2 a_texCoord;
    varying vec2 v_texCoord;
    void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
        v_texCoord = a_texCoord;
    }
`;

const fsSource = `
    precision mediump float;
    varying vec2 v_texCoord;
    
    uniform sampler2D u_mask;
    uniform float u_time;
    uniform float u_opacity;
    uniform float u_hover;
    uniform float u_distortion;
    
    // Simplex 2D noise helpers
    vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
    float snoise(vec2 v){
      const vec4 C = vec4(0.211324865405187, 0.366025403784439,
               -0.577350269189626, 0.024390243902439);
      vec2 i  = floor(v + dot(v, C.yy) );
      vec2 x0 = v -   i + dot(i, C.xx);
      vec2 i1;
      i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
      vec4 x12 = x0.xyxy + C.xxzz;
      x12.xy -= i1;
      i = mod(i, 289.0);
      vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
      + i.x + vec3(0.0, i1.x, 1.0 ));
      vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
        dot(x12.zw,x12.zw)), 0.0);
      m = m*m;
      m = m*m;
      vec3 x = 2.0 * fract(p * C.www) - 1.0;
      vec3 h = abs(x) - 0.5;
      vec3 ox = floor(x + 0.5);
      vec3 a0 = x - ox;
      m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
      vec3 g;
      g.x  = a0.x  * x0.x  + h.x  * x0.y;
      g.yz = a0.yz * x12.xz + h.yz * x12.yw;
      return 130.0 * dot(m, g);
    }
    float fbm(vec2 uv) {
        float f = 0.0;
        float w = 0.5;
        for (int i = 0; i < 4; i++) {
            f += w * snoise(uv);
            uv *= 2.0;
            w *= 0.5;
        }
        return f;
    }

    void main() {
        vec2 maskCoord = vec2(v_texCoord.x, 1.0 - v_texCoord.y);
        float t = u_time * 1.5;
        
        // Simplex noise for wavy distortion
        vec2 nUV = v_texCoord * 4.0 - vec2(0.0, t * 0.5);
        float n = fbm(nUV);
        
        // Base distortion for the "weavy feel" right out of the text
        vec2 distCoord = maskCoord;
        float dispAmount = u_distortion * 0.04;
        distCoord.y += n * dispAmount;
        distCoord.x += (n - 0.5) * dispAmount;
        
        // Sample mask with distortion
        vec4 sampledMask = texture2D(u_mask, distCoord);
        float greyMask = sampledMask.r;
        float blackMask = sampledMask.g;
        
        // Thresholding to remove "mild blue bg" / faint anti-aliasing artifacts
        float totalMask = clamp(greyMask + blackMask, 0.0, 1.0);
        if (totalMask < 0.1) discard; 
        
        // Exact text colors
        vec3 greyColor = vec3(186.0/255.0, 186.0/255.0, 186.0/255.0);
        vec3 darkColor = vec3(81.0/255.0, 80.0/255.0, 85.0/255.0);
        vec3 blackPathsColor = mix(greyColor, darkColor, u_hover);
        vec3 baseColor = (greyMask * greyColor) + (blackMask * blackPathsColor);
        
        // Generate internal smoky noise that flows upwards and swirls
        vec2 smokeUV = v_texCoord * 6.0 - vec2(t * 0.1, t * 0.8);
        float internalSmoke = fbm(smokeUV);
        // Add deeper detail
        internalSmoke += fbm(smokeUV * 2.0 + vec2(t * 0.4, -t * 0.2)) * 0.5;
        // Normalize and contrast
        internalSmoke = smoothstep(0.2, 0.9, internalSmoke * 0.7);
        
        vec3 blueSmokeColor = vec3(0.0, 0.015, 0.85); // Intense blue
        
        // The smoke intensity is tied to u_opacity so it fades in naturally
        float smokeMix = internalSmoke * 0.75 * u_opacity;
        
        // Blend base color with blue smoke
        vec3 finalColor = mix(baseColor, blueSmokeColor, smokeMix);
        // Add slight additive glow for the smoke highlights
        finalColor += blueSmokeColor * (smokeMix * 0.3);
        
        // Vanishing logic: text dissolves out
        float alpha = totalMask * u_opacity;
        
        // Premultiply alpha for WebGL
        gl_FragColor = vec4(finalColor * alpha, alpha);
    }
`;

function createShader(gl: WebGLRenderingContext, type: number, source: string): WebGLShader | null {
    const shader = gl.createShader(type);
    if (!shader) return null;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) return null;
    return shader;
}

export default function SmokeCanvas({ smokeOpacity, fillValue, distortionAmount }: SmokeCanvasProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        // --- Render clear precise path mask, NO white background --- 
        const maskCanvas = document.createElement("canvas");
        maskCanvas.width = 1751;
        maskCanvas.height = 336;
        const maskCtx = maskCanvas.getContext("2d", { willReadFrequently: true });
        if (!maskCtx) return;

        maskCtx.clearRect(0, 0, 1751, 336);

        // Grey to Red
        maskCtx.fillStyle = "rgba(255, 0, 0, 1)";
        GREY_PATHS.forEach(d => maskCtx.fill(new Path2D(d)));

        // Black to Green
        maskCtx.fillStyle = "rgba(0, 255, 0, 1)";
        BLACK_PATHS.forEach(d => maskCtx.fill(new Path2D(d)));

        const gl = canvas.getContext("webgl", { alpha: true, premultipliedAlpha: true });
        if (!gl) return;

        const vertexShader = createShader(gl, gl.VERTEX_SHADER, vsSource);
        const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fsSource);
        if (!vertexShader || !fragmentShader) return;

        const program = gl.createProgram();
        if (!program) return;
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);
        gl.useProgram(program);

        const positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);

        const texCoordBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1]), gl.STATIC_DRAW);

        const posLocation = gl.getAttribLocation(program, "a_position");
        const texCoordLocation = gl.getAttribLocation(program, "a_texCoord");

        gl.enableVertexAttribArray(posLocation);
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.vertexAttribPointer(posLocation, 2, gl.FLOAT, false, 0, 0);

        gl.enableVertexAttribArray(texCoordLocation);
        gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
        gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, 0, 0);

        const maskTexture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, maskTexture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, maskCanvas);

        const maskLoc = gl.getUniformLocation(program, "u_mask");
        const timeLoc = gl.getUniformLocation(program, "u_time");
        const opLoc = gl.getUniformLocation(program, "u_opacity");
        const hoverLoc = gl.getUniformLocation(program, "u_hover");
        const distLoc = gl.getUniformLocation(program, "u_distortion");

        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

        let reqId: number;
        let startTime = performance.now();

        const render = (now: number) => {
            reqId = requestAnimationFrame(render);
            const elapsed = (now - startTime) / 1000;
            const currentOpacity = smokeOpacity.get();
            const currentFill = fillValue.get();
            const isHover = currentFill === "#515055" || currentFill === "rgba(81, 80, 85, 1)" ? 1.0 : 0.0;

            gl.clearColor(0, 0, 0, 0); // Perfectly transparent background
            gl.clear(gl.COLOR_BUFFER_BIT);

            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, maskTexture);
            gl.uniform1i(maskLoc, 0);
            gl.uniform1f(timeLoc, elapsed);
            gl.uniform1f(opLoc, currentOpacity);
            gl.uniform1f(hoverLoc, isHover);
            gl.uniform1f(distLoc, distortionAmount.get());

            gl.drawArrays(gl.TRIANGLES, 0, 6);
        };

        render(performance.now());

        return () => {
            cancelAnimationFrame(reqId);
            gl.deleteProgram(program);
            if (vertexShader) gl.deleteShader(vertexShader);
            if (fragmentShader) gl.deleteShader(fragmentShader);
            gl.deleteTexture(maskTexture);
        };
    }, [smokeOpacity, fillValue]);

    return (
        <canvas
            ref={canvasRef}
            width={1751}
            height={336}
            className="absolute top-0 left-0 w-full h-full pointer-events-none"
            style={{ transform: "translateZ(0)" }}
        />
    );
}
