/* eslint-disable react/no-unknown-property */
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { forwardRef, useRef, useMemo, useLayoutEffect } from 'react';
import { Color } from 'three';

const hexToNormalizedRGB = (hex: string) => {
  hex = hex.replace('#', '');
  return [
    parseInt(hex.slice(0, 2), 16) / 255,
    parseInt(hex.slice(2, 4), 16) / 255,
    parseInt(hex.slice(4, 6), 16) / 255
  ];
};

const vertexShader = `
varying vec2 vUv;
varying vec3 vPosition;

void main() {
  vPosition = position;
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = `
uniform float u_time;
uniform float u_speed;
uniform float u_scale;
uniform vec3 u_color;
uniform float u_noiseIntensity;
uniform float u_rotation;
uniform vec2 u_resolution;

varying vec2 vUv;
varying vec3 vPosition;

float random(vec2 st) {
  return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

float noise(vec2 st) {
  vec2 i = floor(st);
  vec2 f = fract(st);
  
  float a = random(i);
  float b = random(i + vec2(1.0, 0.0));
  float c = random(i + vec2(0.0, 1.0));
  float d = random(i + vec2(1.0, 1.0));
  
  vec2 u = f * f * (3.0 - 2.0 * f);
  
  return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

mat2 rotate2d(float angle) {
  return mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
}

void main() {
  vec2 st = vUv;
  st = (st - 0.5) * u_scale + 0.5;
  st = rotate2d(u_rotation) * (st - 0.5) + 0.5;
  
  float time = u_time * u_speed * 0.1;
  
  vec2 pos = st * 8.0;
  pos += time * 0.5;
  
  float n = 0.0;
  float amplitude = 1.0;
  float frequency = 1.0;
  
  for(int i = 0; i < 4; i++) {
    n += noise(pos * frequency) * amplitude;
    amplitude *= 0.5;
    frequency *= 2.0;
    pos = rotate2d(0.5) * pos;
  }
  
  n = smoothstep(0.2, 0.8, n);
  n *= u_noiseIntensity;
  
  vec3 color = u_color * (0.3 + n * 0.7);
  color = mix(color, vec3(1.0), n * 0.1);
  
  float alpha = 0.1 + n * 0.2;
  
  gl_FragColor = vec4(color, alpha);
}
`;

interface SilkMaterialProps {
  speed: number;
  scale: number;
  color: string;
  noiseIntensity: number;
  rotation: number;
}

const SilkMaterial = forwardRef<any, SilkMaterialProps>(({ speed, scale, color, noiseIntensity, rotation }, ref) => {
  const materialRef = useRef<any>();
  const { size } = useThree();
  
  const uniforms = useMemo(() => ({
    u_time: { value: 0 },
    u_speed: { value: speed },
    u_scale: { value: scale },
    u_color: { value: hexToNormalizedRGB(color) },
    u_noiseIntensity: { value: noiseIntensity },
    u_rotation: { value: rotation },
    u_resolution: { value: [size.width, size.height] }
  }), [speed, scale, color, noiseIntensity, rotation, size]);

  useLayoutEffect(() => {
    if (materialRef.current) {
      materialRef.current.uniforms.u_speed.value = speed;
      materialRef.current.uniforms.u_scale.value = scale;
      materialRef.current.uniforms.u_color.value = hexToNormalizedRGB(color);
      materialRef.current.uniforms.u_noiseIntensity.value = noiseIntensity;
      materialRef.current.uniforms.u_rotation.value = rotation;
      materialRef.current.uniforms.u_resolution.value = [size.width, size.height];
    }
  }, [speed, scale, color, noiseIntensity, rotation, size]);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.u_time.value = state.clock.elapsedTime;
    }
  });

  return (
    <shaderMaterial
      ref={materialRef}
      vertexShader={vertexShader}
      fragmentShader={fragmentShader}
      uniforms={uniforms}
      transparent
      blending={2}
    />
  );
});

SilkMaterial.displayName = 'SilkMaterial';

interface SilkProps {
  speed?: number;
  scale?: number;
  color?: string;
  noiseIntensity?: number;
  rotation?: number;
}

const Silk: React.FC<SilkProps> = ({
  speed = 3,
  scale = 1.2,
  color = '#3b82f6',
  noiseIntensity = 1.8,
  rotation = 0
}) => {
  return (
    <div className="fixed inset-0 -z-10 opacity-30">
      <Canvas camera={{ position: [0, 0, 1] }}>
        <mesh>
          <planeGeometry args={[2, 2]} />
          <SilkMaterial
            speed={speed}
            scale={scale}
            color={color}
            noiseIntensity={noiseIntensity}
            rotation={rotation}
          />
        </mesh>
      </Canvas>
    </div>
  );
};

export default Silk;