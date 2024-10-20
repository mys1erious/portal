import { Group } from 'three';
import useCharacterInputController from '@/features/characters/hooks/useCharacterInputController';
import useCharacterAnimations from '@/features/characters/hooks/useCharacterAnimations';
import React, { useEffect } from 'react';
import { setModelShadow } from '@/utils';
import { PortalData } from '@/features/characters/components/Character';
import { RapierRigidBody } from '@react-three/rapier';

const useCharacter = (
    rb: React.RefObject<RapierRigidBody>,
    container: React.RefObject<Group>,
    cameraPosition: React.RefObject<Group>,
    model: Group,
    portalData: PortalData | null,
    setPortalData: React.Dispatch<React.SetStateAction<PortalData | null>>
): void => {
    useCharacterInputController(
        rb,
        container,
        cameraPosition,
        portalData,
        setPortalData
    );
    useCharacterAnimations(model);

    useEffect(() => {
        setModelShadow(model);
    }, [model]);
};

export default useCharacter;
