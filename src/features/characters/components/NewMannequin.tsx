import React, { useRef } from 'react';
import { useFBX } from '@react-three/drei';

const MODEL_PATH = '/models/character/mannequin.fbx';
const IDLE_ANIM_PATH = '/models/character/idle.fbx';
const WALKING_ANIM_PATH = '/models/character/walking.fbx';
const RUNNING_ANIM_PATH = '/models/character/running.fbx';

const NewMannequin = () => {
    const model = useFBX(MODEL_PATH);
    const modelRef = useRef();

    return <primitive object={model} ref={modelRef} />;
};

export default NewMannequin;
