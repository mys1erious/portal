'use client';

import React, { useRef } from 'react';

import { CuboidCollider, RigidBody } from '@react-three/rapier';
import { useLoader } from '@react-three/fiber';
import { Mesh, RepeatWrapping, TextureLoader } from 'three';

const Plane = () => {
    const planeWidth = 1024;
    const planeHeight = 1024;
    const planeTileSize = 16;

    const textureBase = useLoader(TextureLoader, 'textures/tile_wall_base.jpg');
    textureBase.wrapS = textureBase.wrapT = RepeatWrapping;
    textureBase.repeat.set(
        planeWidth / planeTileSize,
        planeHeight / planeTileSize
    );
    textureBase.anisotropy = 16;

    const textureNormal = useLoader(
        TextureLoader,
        'textures/tile_wall_normal.jpg'
    );
    textureNormal.wrapS = textureNormal.wrapT = RepeatWrapping;
    textureNormal.repeat.set(
        planeWidth / planeTileSize,
        planeHeight / planeTileSize
    );
    textureNormal.anisotropy = 16;

    const meshRef = useRef<Mesh>(null);

    return (
        <>
            <RigidBody type='fixed'>
                <CuboidCollider
                    args={[planeWidth/2, 0, planeHeight/2]}
                    position={[0, 0, 0]}
                />
            </RigidBody>
            <mesh
                ref={meshRef}
                rotation={[-Math.PI / 2, 0, 0]}
                receiveShadow
                position={[0, 0, 0]}
            >
                <planeGeometry args={[planeWidth, planeHeight]} />
                <meshStandardMaterial
                    map={textureBase}
                    normalMap={textureNormal}
                />
            </mesh>
        </>
    );
};

export default Plane;
