'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
    RigidBody,
    RapierRigidBody,
    BallCollider,
    CollisionEnterPayload,
    CuboidCollider,
} from '@react-three/rapier';
import { PortalData } from '@/features/characters/components/Character';
import { Vector3 } from 'three';
import Mirror from '@/features/core/components/Mirror';
import VideoElement from '@/features/core/components/VideoElement';

type PortalProps = {
    initialPosition: { x: number; y: number; z: number };
    initialVelocity: { x: number; y: number; z: number };
    portalData: PortalData | null;
    setPortalData: React.Dispatch<React.SetStateAction<PortalData | null>>;
};

const Portal = ({
    initialPosition,
    initialVelocity,
    portalData,
    setPortalData,
}: PortalProps) => {
    const rb = useRef<RapierRigidBody>(null);
    const [collisionPosition, setCollisionPosition] = useState<Vector3>(
        new Vector3()
    );

    useEffect(() => {
        if (rb.current) {
            rb.current.setTranslation(initialPosition, true);
            rb.current.setLinvel(initialVelocity, true);
        }
    }, [initialPosition, initialVelocity]);

    const onCollisionEnter = (payload: CollisionEnterPayload) => {
        if (rb.current) {
            rb.current.setLinvel({ x: 0, y: 0, z: 0 }, true);
        }

        // const { manifold } = payload;
        // const contactPoint = manifold.solverContactPoint(0);
        // setCollisionPosition(
        //     new Vector3(contactPoint.x, contactPoint.y, contactPoint.z)
        // );

        if (rb.current) {
            const centerPosition = rb.current.translation();
            setCollisionPosition(new Vector3(centerPosition.x, centerPosition.y, centerPosition.z));
        }
    };

    return (
        <>
            {collisionPosition.x && (
                <VideoElement
                    url={'/videos/infinite_stars.mp4'}
                    position={[
                        collisionPosition.x,
                        collisionPosition.y,
                        collisionPosition.z,
                    ]}
                />
            )}

            <RigidBody
                ref={rb}
                type='dynamic'
                colliders={false}
                gravityScale={0}
                lockRotations
                onCollisionEnter={onCollisionEnter}
                ccd={true}
            >
                <BallCollider args={[0.1]} />
                <mesh castShadow receiveShadow>
                    <boxGeometry args={[0.05, 0.05, 0.05]} />
                    <meshStandardMaterial color='blue' />
                </mesh>
            </RigidBody>
        </>
    );
};

export default Portal;
