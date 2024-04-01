'use client';

import React, { Suspense } from 'react';

import { Canvas as BaseCanvas } from '@react-three/fiber';
import { OrbitControls, Stats, Torus } from '@react-three/drei';
import { Perf } from 'r3f-perf';
import { ASPECT_RATIO, FOV } from '@/constants';
import AmbientLight from '@/features/core/components/AmbientLight';
import DirectionalLight from '@/features/core/components/DirectionalLight';
import { Physics, RigidBody } from '@react-three/rapier';
import Plane from '@/features/core/components/Plane';
import { Color } from 'three';
import Room1 from '@/features/rooms/components/Room1';
import Element from '@/features/core/components/Element';
import Mannequin from '@/features/characters/components/Mannequin';

const Canvas = () => {
    return (
        <BaseCanvas
            gl={{ powerPreference: 'high-performance' }}
            shadows={true}
            camera={{
                fov: FOV,
                aspect: ASPECT_RATIO,
                near: 1.0,
                far: 10000.0,
                position: [0, 500, -700],
            }}
            onCreated={({ scene }) =>
                (scene.background = new Color('lightblue'))
            }
        >
            <AmbientLight />
            <OrbitControls />

            <Suspense>
                <Physics debug gravity={[0, -9.81*10, 0]}>
                    <Room1 />

                    {/*<RigidBody*/}
                    {/*    colliders={'hull'}*/}
                    {/*    restitution={0.5}*/}
                    {/*    position={[0, 200, 0]}*/}
                    {/*>*/}
                    {/*    <Torus args={[10, 3, 16, 100]} />*/}
                    {/*</RigidBody>*/}
                    <Element rotation={[Math.PI / 2, 0, 0]} position={[-500, 10, 100]}/>
                    <Element rotation={[Math.PI / 2, 0, 0]} position={[-490, 20, 110]}/>
                    <Element position={[-10, 101, 500]} width={200} height={200} depth={200}/>
                </Physics>
            </Suspense>

            <Perf />
            <Stats />
        </BaseCanvas>
    );
};

export default Canvas;
