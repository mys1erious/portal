import { Group } from 'three';
import useCharacterInputController from '@/features/characters/hooks/useCharacterInputController';
import useCharacterAnimations from '@/features/characters/hooks/useCharacterAnimations';
import { useEffect } from 'react';
import { setModelShadow } from '@/utils';

const useCharacter = (model: Group): void => {
    useCharacterInputController(model);
    useCharacterAnimations(model);

    useEffect(() => {
        setModelShadow(model);
    }, [model]);
};

export default useCharacter;
