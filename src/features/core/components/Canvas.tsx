'use client';

import React, { Suspense, useMemo } from 'react';

import { Canvas as BaseCanvas } from '@react-three/fiber';
import {
    KeyboardControls,
    KeyboardControlsEntry,
    PointerLockControls,
    Preload,
    Stats,
} from '@react-three/drei';
import { Perf } from 'r3f-perf';
import {
    ASPECT_RATIO,
    FOV,
    INPUT_ACTION_BACKWARD,
    INPUT_ACTION_FORWARD,
    INPUT_ACTION_JUMP,
    INPUT_ACTION_LEFT,
    INPUT_ACTION_RIGHT,
    INPUT_ACTION_RUN,
} from '@/constants';
import AmbientLight from '@/features/core/components/AmbientLight';
import { Physics } from '@react-three/rapier';
import { Color } from 'three';
import Room1 from '@/features/rooms/components/Room1';
import Element from '@/features/core/components/Element';

const Canvas = () => {
    const controlsMap = useMemo<KeyboardControlsEntry[]>(
        () => [
            { name: INPUT_ACTION_FORWARD, keys: ['KeyW'] },
            { name: INPUT_ACTION_LEFT, keys: ['KeyA'] },
            { name: INPUT_ACTION_RIGHT, keys: ['KeyD'] },
            { name: INPUT_ACTION_BACKWARD, keys: ['KeyS'] },
            { name: INPUT_ACTION_RUN, keys: ['Shift'] },
            { name: INPUT_ACTION_JUMP, keys: ['Space'] },
        ],
        []
    );

    return (
        <BaseCanvas
            gl={{ powerPreference: 'high-performance' }}
            shadows={true}
            onCreated={({ scene }) =>
                (scene.background = new Color('lightblue'))
            }
            camera={{
                fov: FOV,
                aspect: ASPECT_RATIO,
                near: 1,
                far: 3500,
            }}
        >
            <PointerLockControls />
            <AmbientLight />

            <Suspense>
                <Preload all />
                <Physics debug gravity={[0, -9.81 * 10, 0]}>
                    <KeyboardControls map={controlsMap}>
                        <Room1 />

                        <Element
                            rotation={[Math.PI / 2, 0, 0]}
                            position={[-500, 10, 100]}
                        />
                        <Element
                            rotation={[Math.PI / 2, 0, 0]}
                            position={[-490, 20, 110]}
                        />
                        <Element
                            position={[-10, 101, 500]}
                            width={200}
                            height={200}
                            depth={200}
                        />
                    </KeyboardControls>
                </Physics>
            </Suspense>

            <Perf />
            <Stats />
        </BaseCanvas>
    );
};

export default Canvas;
