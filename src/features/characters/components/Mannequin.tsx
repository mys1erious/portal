import React, { useEffect, useRef, useState } from 'react';
import { useFBX } from '@react-three/drei';
import useCharacter from '@/features/characters/hooks/useCharacter';
import { Vector3D } from '@/types';
import {
    CapsuleCollider,
    CylinderCollider,
    RigidBody,
} from '@react-three/rapier';
import { DEFAULT_CHARACTER_HEIGHT, DEFAULT_CHARACTER_WIDTH } from '@/constants';
import { RigidBody as TRigidBody } from '@dimforge/rapier3d-compat';
import Portal from '@/features/characters/components/Portal';

const MODEL_PATH = '/models/character/mannequin.fbx';

type MannequinProps = {
    position?: Vector3D;
};

export type PortalData = {
    id: string;
    position: { x: number; y: number; z: number };
    velocity: { x: number; y: number; z: number };
};

const Mannequin = ({ position = [0, 0, 0] }: MannequinProps) => {
    const model = useFBX(MODEL_PATH);
    const rigidBodyRef = useRef<TRigidBody | null>(null);

    const [portals, setPortals] = useState<PortalData[]>([]);

    useCharacter(rigidBodyRef, model, portals, setPortals);

    useEffect(() => {
        if (rigidBodyRef.current) {
            rigidBodyRef.current.setTranslation(
                { x: position[0], y: position[1], z: position[2] },
                true
            );
        }
    }, []);

    return (
        <>
            {portals.map((portal) => (
                <Portal
                    key={portal.id}
                    id={portal.id}
                    initialPosition={portal.position}
                    initialVelocity={portal.velocity}
                    onRemove={() => {
                        setPortals((prevPortals) =>
                            prevPortals.filter((p) => p.id !== portal.id)
                        );
                    }}
                />
            ))}
            <RigidBody
                ref={rigidBodyRef}
                type='dynamic'
                colliders={false}
                gravityScale={0}
            >
                {/*<CapsuleCollider*/}
                <CylinderCollider
                    args={[DEFAULT_CHARACTER_HEIGHT / 2 - 1, 16]}
                    position={[0, DEFAULT_CHARACTER_HEIGHT / 2, 0]}
                    friction={0}
                    restitution={0}
                />
                <primitive object={model} />
            </RigidBody>
        </>
    );
};

export default Mannequin;
