import { Group } from 'three';
import useCharacterInputController from '@/features/characters/hooks/useCharacterInputController';
import useCharacterAnimations from '@/features/characters/hooks/useCharacterAnimations';
import React, { useEffect } from 'react';
import { setModelShadow } from '@/utils';

const useCharacter = (
    rigidBodyRef: React.RefObject<any>,
    // model?: Group,
    model: Group,
): void => {
    useCharacterInputController(rigidBodyRef);
    useCharacterAnimations(model);

    useEffect(() => {
        setModelShadow(model);
    }, [model]);
};

export default useCharacter;
