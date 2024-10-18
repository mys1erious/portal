'use client';

import React, { forwardRef, useEffect, useRef } from 'react';
import { Mesh, MeshStandardMaterial, BoxGeometry } from 'three';
import { RigidBody, CuboidCollider } from '@react-three/rapier';
import { useThree } from '@react-three/fiber';

type PortalProps = {
    id: string;
    initialPosition: { x: number; y: number; z: number };
    initialVelocity: { x: number; y: number; z: number };
    onRemove: () => void;
};

const Portal: React.FC<PortalProps> = ({
    id,
    initialPosition,
    initialVelocity,
    onRemove,
}) => {
    const rigidBodyRef = useRef<any>(null);

    useEffect(() => {
        if (rigidBodyRef.current) {
            rigidBodyRef.current.setTranslation(initialPosition, true);
            rigidBodyRef.current.setLinvel(initialVelocity, true);

            const timeoutId = setTimeout(() => {
                onRemove();
            }, 5000);

            return () => {
                clearTimeout(timeoutId);
            };
        }
    }, [initialPosition, initialVelocity, onRemove]);

    return (
        <RigidBody
            ref={rigidBodyRef}
            type='dynamic'
            colliders={false}
            gravityScale={0}
        >
            <CuboidCollider args={[5, 8, 5]} />
            <mesh castShadow receiveShadow>
                <boxGeometry args={[10, 16, 10]} />
                <meshStandardMaterial color='blue' />
            </mesh>
        </RigidBody>
    );
};

export default Portal;
