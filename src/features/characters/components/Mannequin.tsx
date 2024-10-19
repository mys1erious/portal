import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useFBX } from '@react-three/drei';
import useCharacter from '@/features/characters/hooks/useCharacter';
import { Vector3D } from '@/types';
import {
    CapsuleCollider,
    CylinderCollider,
    RigidBody,
} from '@react-three/rapier';
import { MANNEQUIN_HEIGHT } from '@/constants';
import { RigidBody as TRigidBody } from '@dimforge/rapier3d-compat';
import Portal from '@/features/characters/components/Portal';

const MODEL_PATH = '/models/character/mannequin.fbx';

type MannequinProps = {
    position?: Vector3D;
};

export type PortalData = {
    position: { x: number; y: number; z: number };
    velocity: { x: number; y: number; z: number };
};

const Mannequin = ({ position = [0, 0, 0] }: MannequinProps) => {
    const model = useFBX(MODEL_PATH);
    const rigidBodyRef = useRef<TRigidBody | null>(null);

    const [portalData, setPortalData] = useState<PortalData | null>(null);

    useCharacter(rigidBodyRef, model, portalData, setPortalData);

    useEffect(() => {
        if (rigidBodyRef.current) {
            rigidBodyRef.current.setTranslation(
                { x: position[0], y: position[1], z: position[2] },
                true
            );
        }
    }, []);

    const onRemove = useCallback(() => {
        setPortalData(null);
    }, []);

    return (
        <>
            {portalData && (
                <Portal
                    initialPosition={portalData.position}
                    initialVelocity={portalData.velocity}
                    onRemove={onRemove}
                />
            )}
            <RigidBody
                ref={rigidBodyRef}
                type='dynamic'
                colliders={false}
                enabledRotations={[false, false, false]}
            >
                {/*<CapsuleCollider*/}
                <CylinderCollider
                    args={[MANNEQUIN_HEIGHT / 2 - 0.1, 0.3]}
                    position={[0, MANNEQUIN_HEIGHT / 2, 0]}
                    friction={1}
                    restitution={0}
                />
                {/*<primitive object={model} />*/}
            </RigidBody>
        </>
    );
};

export default Mannequin;
