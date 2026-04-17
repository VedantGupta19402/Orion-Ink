import { Canvas, useFrame } from '@react-three/fiber'
import { useRef } from 'react'

const vert = `
  varying vec2 vUv;
  uniform float uTime;
  void main() {
    vUv = uv;
    vec3 p = position;
    p.z += sin(p.x * 3.0 + uTime * 0.6) * 0.14
         + cos(p.y * 2.5 + uTime * 0.5) * 0.10
         + sin((p.x + p.y) * 4.0 + uTime * 0.9) * 0.06;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`

const frag = `
  varying vec2 vUv;
  uniform float uTime;

  float fbm(vec2 p) {
    float v = 0.0, a = 0.5;
    for (int i = 0; i < 4; i++) {
      v += a * sin(dot(p, vec2(1.7, 0.9)) + uTime * 0.4);
      p *= 2.1; a *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 uv = vUv - 0.5;
    float n = fbm(uv * 3.0 + uTime * 0.15);
    float ring = smoothstep(0.0, 0.3, abs(sin(length(uv) * 8.0 - uTime * 0.5 + n * 2.0)));

    // ink palette: deep black → amber → cream
    vec3 a = vec3(0.04, 0.03, 0.06);
    vec3 b = vec3(0.72, 0.42, 0.18);
    vec3 c = vec3(0.96, 0.90, 0.80);

    float t = clamp(n + ring * 0.4 + vUv.y * 0.3, 0.0, 1.0);
    vec3 col = mix(mix(a, b, t), c, t * t * 0.6);

    gl_FragColor = vec4(col, 0.92);
  }
`

const Fluid = () => {
  const mat = useRef()
  useFrame(({ clock }) => { mat.current.uniforms.uTime.value = clock.elapsedTime })

  return (
    <mesh>
      <planeGeometry args={[4, 4, 160, 160]} />
      <shaderMaterial
        ref={mat}
        uniforms={{ uTime: { value: 0 } }}
        vertexShader={vert}
        fragmentShader={frag}
        transparent
      />
    </mesh>
  )
}

export default function WebGLScene() {
  return (
    <Canvas
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
      camera={{ position: [0, 0, 2] }}
      dpr={[1, 1.5]}
    >
      <Fluid />
    </Canvas>
  )
}