import { Group } from 'three';
import useCharacterInputController from '@/features/characters/hooks/useCharacterInputController';
import useCharacterAnimations from '@/features/characters/hooks/useCharacterAnimations';
import React, { useEffect } from 'react';
import { setModelShadow } from '@/utils';
import { PortalData } from '@/features/characters/components/Mannequin';

const useCharacter = (
    rigidBodyRef: React.RefObject<any>,
    model: Group,
    portalData: PortalData | null,
    setPortalData: React.Dispatch<React.SetStateAction<PortalData | null>>
): void => {
    useCharacterInputController(rigidBodyRef, portalData, setPortalData);
    // useCharacterAnimations(model);
    //
    // useEffect(() => {
    //     setModelShadow(model);
    // }, [model]);
};

export default useCharacter;
