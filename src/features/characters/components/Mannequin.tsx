import React from 'react';
import { useFBX } from '@react-three/drei';
import useCharacter from '@/features/characters/hooks/useCharacter';
import { Vector3D } from '@/types';

const MODEL_PATH = '/models/character/mannequin.fbx';

type MannequinProps = {
    position?: Vector3D;
};

const Mannequin = ({ position = [0, 0, 0] }: MannequinProps) => {
    const model = useFBX(MODEL_PATH);
    useCharacter(model);

    return (
        <group position={position}>
            <primitive object={model} />
        </group>
    );
};

export default Mannequin;
