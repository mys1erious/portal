'use client';

import React, { useEffect, useRef } from 'react';
import { RigidBody, CuboidCollider } from '@react-three/rapier';

type PortalProps = {
    initialPosition: { x: number; y: number; z: number };
    initialVelocity: { x: number; y: number; z: number };
    onRemove: () => void;
};

const Portal: React.FC<PortalProps> = ({
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
            <CuboidCollider args={[0.01, 0.01, 0.01]} />
            <mesh castShadow receiveShadow>
                <boxGeometry args={[0.02, 0.02, 0.02]} />
                <meshStandardMaterial color='blue' />
            </mesh>
        </RigidBody>
    );
};

export default Portal;
