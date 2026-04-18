import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'

const vertexShader = `
  varying vec2 vUv;
  varying float vElevation;
  uniform float uTime;
  uniform vec2 uMouse;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  float smoothNoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i), hash(i + vec2(1, 0)), u.x),
      mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x),
      u.y
    );
  }

  float fbm(vec2 p) {
    float val = 0.0;
    float amp = 0.5;
    for (int i = 0; i < 6; i++) {
      val += amp * smoothNoise(p);
      p *= 2.1;
      amp *= 0.48;
    }
    return val;
  }

  void main() {
    vUv = uv;
    vec3 pos = position;

    vec2 toMouse = uv - (uMouse * 0.5 + 0.5);
    float mouseDist = length(toMouse);
    float ripple = sin(mouseDist * 14.0 - uTime * 3.0) * exp(-mouseDist * 4.5) * 0.08;

    float terrain = fbm(uv * 2.2 + uTime * 0.06);
    float detail = fbm(uv * 5.5 - uTime * 0.1) * 0.18;

    pos.z = terrain * 0.35 + detail + ripple;
    vElevation = pos.z;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`

const fragmentShader = `
  varying vec2 vUv;
  varying float vElevation;
  uniform float uTime;
  uniform float uDissolve;
  uniform vec2 uMouse;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  float smoothNoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i), hash(i + vec2(1, 0)), u.x),
      mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x),
      u.y
    );
  }

  float fbm(vec2 p) {
    float val = 0.0;
    float amp = 0.5;
    for (int i = 0; i < 5; i++) {
      val += amp * smoothNoise(p);
      p *= 2.2;
      amp *= 0.5;
    }
    return val;
  }

  void main() {
    vec2 uv = vUv;

    float t1 = fbm(uv * 3.0 + uTime * 0.08);
    float t2 = fbm(uv * 5.5 - uTime * 0.06 + t1 * 0.6);
    float t3 = fbm(uv * 10.0 + uTime * 0.04 + t2 * 0.4);
    float ink = t1 * 0.5 + t2 * 0.3 + t3 * 0.2;

    float dist = length(uv - 0.5);
    float rings = abs(sin(dist * 18.0 - uTime * 0.7 + ink * 4.0));
    rings = pow(rings, 2.4);

    float val = clamp(ink + rings * 0.22 + vElevation * 0.6, 0.0, 1.0);

    vec3 c0 = vec3(0.03, 0.02, 0.04);
    vec3 c1 = vec3(0.18, 0.10, 0.06);
    vec3 c2 = vec3(0.62, 0.36, 0.14);
    vec3 c3 = vec3(0.94, 0.88, 0.76);

    vec3 color;
    if (val < 0.33) {
      color = mix(c0, c1, val / 0.33);
    } else if (val < 0.66) {
      color = mix(c1, c2, (val - 0.33) / 0.33);
    } else {
      color = mix(c2, c3, (val - 0.66) / 0.34);
    }

    float ridge = smoothstep(0.55, 0.65, val) * 0.35;
    color += vec3(0.9, 0.65, 0.25) * ridge;

    vec2 mDist = uv - (uMouse * 0.5 + 0.5);
    float mGlow = exp(-length(mDist) * 5.0) * 0.18;
    color += vec3(0.85, 0.58, 0.18) * mGlow;

    color *= smoothstep(0.85, 0.25, dist);

    float dNoise = fbm(uv * 4.0 + 1.5);
    float alpha = smoothstep(uDissolve - 0.15, uDissolve + 0.05, dNoise) * 0.96;

    gl_FragColor = vec4(color, alpha);
  }
`

const FluidMesh = ({ dissolveRef, mouseRef }) => {
  const matRef = useRef()

  useFrame(({ clock }) => {
    if (!matRef?.current?.uniforms) return
    
    matRef.current.uniforms.uTime.value = clock.elapsedTime
    
    if (dissolveRef?.current !== undefined) {
      matRef.current.uniforms.uDissolve.value = dissolveRef.current
    }
    
    if (mouseRef?.current) {
      matRef.current.uniforms.uMouse.value.x = mouseRef.current.x || 0
      matRef.current.uniforms.uMouse.value.y = mouseRef.current.y || 0
    }
  })

  return (
    <mesh rotation={[-0.12, 0, 0]}>
      <planeGeometry args={[5, 5, 256, 256]} />
      <shaderMaterial
        ref={matRef}
        uniforms={{
          uTime: { value: 0 },
          uDissolve: { value: 0 },
          uMouse: { value: { x: 0, y: 0 } },
        }}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
        depthWrite={false}
      />
    </mesh>
  )
}

const WebGLScene = ({ dissolveRef, mouseRef }) => {
  return (
    <Canvas
      camera={{ position: [0, 0, 2.4], fov: 55 }}
      dpr={[1, 2]}
      gl={{ antialias: false, alpha: true }}
      className="!absolute inset-0 w-full h-full"
    >
      <FluidMesh dissolveRef={dissolveRef} mouseRef={mouseRef} />
    </Canvas>
  )
}

export default WebGLScene