'use client';

// @ts-ignore
import { Reflector } from 'three/examples/jsm/objects/Reflector';

import { DEFAULT_ELEMENT_DEPTH, DEFAULT_ELEMENT_SIZE } from '@/constants';
import { Vector3D } from '@/types';
import { useEffect, useMemo, useRef } from 'react';
import { Mesh, PlaneGeometry, TextureLoader } from 'three';
import { CuboidCollider, RigidBody } from '@react-three/rapier';

type MirrorProps = {
    position?: Vector3D;
    rotation?: Vector3D;
    width?: number;
    height?: number;
    depth?: number;
    castShadow?: boolean;
    receiveShadow?: boolean;
    baseTextureSrc?: string;
};

const Mirror = ({
    position,
    rotation,
    width = DEFAULT_ELEMENT_SIZE,
    height = DEFAULT_ELEMENT_SIZE,
    depth = DEFAULT_ELEMENT_DEPTH,
    castShadow = true,
    receiveShadow = true,
    baseTextureSrc,
}: MirrorProps) => {
    const meshRef = useRef<Mesh>(null);

    const reflector = useMemo(() => {
        const geometry = new PlaneGeometry(width, height);
        const reflector = new Reflector(geometry, {
            clipBias: 0.003,
            textureWidth: window.innerWidth * window.devicePixelRatio,
            textureHeight: window.innerHeight * window.devicePixelRatio,
            color: 0x889999,
        });
        reflector.rotateY(Math.PI);
        return reflector;
    }, [width, height]);

    useEffect(() => {
        if (meshRef.current) {
            meshRef.current.add(reflector);
        }
    }, [reflector]);

    return (
        <RigidBody position={position} rotation={rotation} type='fixed'>
            <CuboidCollider args={[width / 2, height / 2, depth / 2]} />
            <mesh
                ref={meshRef}
                castShadow={castShadow}
                receiveShadow={receiveShadow}
            >
                <planeGeometry args={[width, height]} />
                <meshStandardMaterial
                    color={baseTextureSrc}
                    map={
                        baseTextureSrc
                            ? new TextureLoader().load(baseTextureSrc)
                            : undefined
                    }
                />
            </mesh>
        </RigidBody>
    );
};


export default Mirror;
