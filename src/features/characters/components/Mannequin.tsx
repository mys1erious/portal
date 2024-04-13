import React from 'react';
import { useFBX } from '@react-three/drei';
import useCharacter from '@/features/characters/hooks/useCharacter';

const MODEL_PATH = '/models/character/mannequin.fbx';

const Mannequin = () => {
    const model = useFBX(MODEL_PATH);
    useCharacter(model);

    return <primitive object={model} />;
};

export default Mannequin;
