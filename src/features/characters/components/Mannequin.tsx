import React, { useCallback, useRef, useState } from 'react';
import { useFBX } from '@react-three/drei';
import useCharacter from '@/features/characters/hooks/useCharacter';
import { Vector3D } from '@/types';
import { CapsuleCollider, RigidBody } from '@react-three/rapier';
import { MANNEQUIN_HEIGHT } from '@/constants';
import { RigidBody as TRigidBody } from '@dimforge/rapier3d-compat';
import Portal from '@/features/characters/components/Portal';
import { Group } from 'three';

const MODEL_PATH = '/models/character/mannequin.fbx';

type MannequinProps = {
    position?: Vector3D;
};

export type PortalData = {
    position: { x: number; y: number; z: number };
    velocity: { x: number; y: number; z: number };
};

const Mannequin = ({ position = [0, 1, 0] }: MannequinProps) => {
    const model = useFBX(MODEL_PATH);

    const rb = useRef<TRigidBody>(null);
    const container = useRef<Group>(null);
    const character = useRef<Group>(null);
    const cameraTarget = useRef<Group>(null);
    const cameraPosition = useRef<Group>(null);

    // TODO; should it even be on character ?
    const [portalData, setPortalData] = useState<PortalData | null>(null);

    useCharacter(
        rb,
        container,
        cameraPosition,
        model,
        portalData,
        setPortalData
    );

    const onRemovePortal = useCallback(() => {
        setPortalData(null);
    }, []);

    return (
        <>
            {portalData && (
                <Portal
                    initialPosition={portalData.position}
                    initialVelocity={portalData.velocity}
                    onRemove={onRemovePortal}
                />
            )}
            <RigidBody
                colliders={false}
                lockRotations
                ref={rb}
                position={position}
            >
                <group ref={container}>
                    <group ref={cameraTarget} position-z={1.5} />
                    <group
                        ref={cameraPosition}
                        position-y={MANNEQUIN_HEIGHT - 0.08}
                    />
                    <group ref={character} position-z={-0.015}>
                        {/*<mesh castShadow receiveShadow>*/}
                        {/*    <boxGeometry args={[0.6, MANNEQUIN_HEIGHT, 0.6]} />*/}
                        {/*    <meshStandardMaterial />*/}
                        {/*</mesh>*/}
                        <primitive object={model} scale={[0.01, 0.01, 0.01]} />
                    </group>
                </group>
                <CapsuleCollider
                    args={[MANNEQUIN_HEIGHT / 2 - 0.175, 0.175]}
                    position={[0, MANNEQUIN_HEIGHT / 2, 0]}
                    friction={0}
                    restitution={0}
                />
            </RigidBody>
        </>
    );
};

export default Mannequin;
