import React, { useEffect, useRef } from 'react';
import { useFBX } from '@react-three/drei';
import useCharacter from '@/features/characters/hooks/useCharacter';
import { Vector3D } from '@/types';
import { CapsuleCollider, CylinderCollider, RigidBody } from '@react-three/rapier';
import { DEFAULT_CHARACTER_HEIGHT, DEFAULT_CHARACTER_WIDTH } from '@/constants';
import { RigidBody as TRigidBody } from '@dimforge/rapier3d-compat';

const MODEL_PATH = '/models/character/mannequin.fbx';

type MannequinProps = {
    position?: Vector3D;
};

const Mannequin = ({ position = [0, 0, 0] }: MannequinProps) => {
    const model = useFBX(MODEL_PATH);
    const rigidBodyRef = useRef<TRigidBody | null>(null);
    useCharacter(rigidBodyRef, model);
    console.log(position);

    useEffect(() => {
        if (rigidBodyRef.current) {
            rigidBodyRef.current.setTranslation(
                { x: position[0], y: position[1], z: position[2] },
                true
            );
        }
    }, []);

    return (
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
    );
};

export default Mannequin;
