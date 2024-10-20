import { Group } from 'three';
import useCharacterInputController from '@/features/characters/hooks/useCharacterInputController';
import useCharacterAnimations from '@/features/characters/hooks/useCharacterAnimations';
import React, { useEffect } from 'react';
import { setModelShadow } from '@/utils';
import { PortalData } from '@/features/characters/components/Mannequin';
import { RigidBody as TRigidBody } from '@dimforge/rapier3d-compat/dynamics/rigid_body';

const useCharacter = (
    rb: React.RefObject<TRigidBody>,
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
