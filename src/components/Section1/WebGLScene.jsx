import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'

const vertexShader = `
  varying vec2 vUv;
  uniform float uTime;

  void main() {
    vUv = uv;
    vec3 pos = position;

    pos.z += sin(pos.x * 2.8 + uTime * 0.55) * 0.16;
    pos.z += cos(pos.y * 2.2 + uTime * 0.45) * 0.12;
    pos.z += sin((pos.x + pos.y) * 3.8 + uTime * 0.8) * 0.07;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`

const fragmentShader = `
  varying vec2 vUv;
  uniform float uTime;

  float noise(vec2 p) {
    float v = 0.0;
    float amp = 0.5;
    for (int i = 0; i < 5; i++) {
      v += amp * sin(dot(p, vec2(1.6, 0.8)) + uTime * 0.35);
      p *= 2.2;
      amp *= 0.48;
    }
    return v;
  }

  void main() {
    vec2 uv = vUv - 0.5;

    float n = noise(uv * 2.8 + uTime * 0.12);
    float dist = length(uv);
    float rings = abs(sin(dist * 10.0 - uTime * 0.6 + n * 2.5));
    float t = clamp(n * 0.5 + rings * 0.35 + vUv.y * 0.25, 0.0, 1.0);

    vec3 dark  = vec3(0.03, 0.02, 0.05);
    vec3 amber = vec3(0.75, 0.44, 0.16);
    vec3 bone  = vec3(0.95, 0.89, 0.78);

    vec3 color = mix(mix(dark, amber, t), bone, t * t * 0.55);

    float vig = smoothstep(0.9, 0.3, dist * 1.4);
    color *= vig;

    gl_FragColor = vec4(color, 0.9);
  }
`

function FluidMesh() {
  const matRef = useRef()

  useFrame(({ clock }) => {
    matRef.current.uniforms.uTime.value = clock.elapsedTime
  })

  return (
    <mesh>
      <planeGeometry args={[5, 5, 200, 200]} />
      <shaderMaterial
        ref={matRef}
        uniforms={{ uTime: { value: 0 } }}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
      />
    </mesh>
  )
}

 function WebGLScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 2] }}
      dpr={[1, 1.5]}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
    >
      <FluidMesh />
    </Canvas>
  )
}
export default WebGLScene