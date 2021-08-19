import * as THREE from 'three';
import React, { Suspense, useState, useMemo, useRef } from 'react';
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber';
import { animated, useSpring } from '@react-spring/three';
import data from './data';
import BlinkText from './BlinkText';

function Image({ url, index, camera }) {
  const [Active, setActive] = useState(0);
  const mesh = useRef();
  let speed = 1.5;
  let positionX = 0;
  let plus = 0;

  window.addEventListener('wheel', e => {
    speed += e.deltaY * 0.0005;
  });

  const { spring } = useSpring({
    spring: Number(Active),
    config: { mass: 5, tension: 400, friction: 50, precision: 0.0001 },
  });
  const scale = spring.to([0, 1], [1, 1.2]);
  const rotation = spring.to([0, 1], [0, Math.PI * 2]);
  const position = useMemo(() => {
    return [index * 1.2, -0.5, 3.5];
  }, []);

  const texture = useLoader(THREE.TextureLoader, url);
  useFrame(() => {
    positionX += speed - plus;
    speed *= 0.95;
    plus *= 0.95;
    Active ? (mesh.current.position.y = -0.5) : (mesh.current.position.y = -1);
    camera.position.x = positionX * 1.2;

    if (camera.position.x > 42) {
      plus = camera.position.x - 42;
    } else if (camera.position.x < 0) {
      plus = camera.position.x;
    }
  });

  return (
    <animated.mesh
      ref={mesh}
      position={position}
      rotation-y={rotation}
      scale-x={scale}
      scale-y={scale}
      onClick={() => {
        setActive(!Active);
      }}
    >
      <planeBufferGeometry attach="geometry" args={[1, 1.2]} />
      <meshBasicMaterial
        attach="material"
        map={texture}
        side={THREE.DoubleSide}
      />
    </animated.mesh>
  );
}

function Images() {
  const { camera } = useThree();
  return data.map((el, index) => (
    <Suspense fallback={null}>
      <Image key={el} url={el} index={index} camera={camera} />
    </Suspense>
  ));
}

function LandingInteraction() {
  return (
    <div className="landinginteractioncontainer">
      <div className="textwrapper stopdragging">
        <div className="description">
          <div className="sm-only">
            개발하는 당신을 위한
            <br />
            얕고 넓은 지식을 담은 매거진
          </div>
          <div className="sm-hidden">
            개발하는 당신을 위한 얕고 넓은 지식을 담은 매거진
          </div>
        </div>
        <div className="subject">DEVzine</div>
      </div>
      <BlinkText />
      <Canvas>
        <Images />
      </Canvas>
    </div>
  );
}

export default LandingInteraction;
