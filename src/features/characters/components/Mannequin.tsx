'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useAnimations, useFBX } from '@react-three/drei';
import { Vector3D } from '@/types';
import { setModelShadow } from '@/utils';
import {
    AnimationAction,
    AnimationClip,
    AnimationMixer,
    Group,
    Object3DEventMap,
    Quaternion,
    Vector3,
} from 'three';
import { useFrame } from '@react-three/fiber';
import Element from '@/features/core/components/Element';
import {
    CharacterControlInputKey,
    InputActions,
    keyCodeActionMap,
} from '@/constants';
import {
    BasicCharacterControllerInput,
    CharacterFSM,
} from '@/features/characters/CharacterController';
import { RigidBody } from '@react-three/rapier';

// const SCALE_FACTOR_3K_POLY = 39;
// const SCALE_FACTOR_500_POLY = 100;
const MODEL_PATH = '/models/character/mannequin2.fbx';
const IDLE_ANIM_PATH = '/models/character/idle.fbx';
const WALKING_ANIM_PATH = '/models/character/walking.fbx';
const RUNNING_ANIM_PATH = '/models/character/running.fbx';

type MannequinProps = {
    position: Vector3D;
};

type AnimationStates = 'idle' | 'walk' | 'run';

type AnimationEntry = {
    clip: AnimationClip;
    action: AnimationAction;
};

type Animations = {
    [animName in AnimationStates]: AnimationEntry | undefined;
};

type InputKeys = {
    [action in InputActions]: boolean;
};

const DECELERATION = new Vector3(-0.0005, -0.0001, -5.0);
const ACCELERATION = new Vector3(5, 0.25, 500.0);
const VELOCITY = new Vector3(0, 0, 0);

const Mannequin = ({ position }: MannequinProps) => {
    const legPos: Vector3D = [...position];
    legPos[1] = 1;
    legPos[0] = position[0] - 16;
    legPos[2] = position[2] + 8;

    const model = useFBX(MODEL_PATH);
    const modelRef = useRef();

    const idleAnimation = useFBX(IDLE_ANIM_PATH);
    const walkAnimation = useFBX(WALKING_ANIM_PATH);
    const runAnimation = useFBX(RUNNING_ANIM_PATH);

    // const [animations, setAnimations] = useState<Animations>({
    //     idle: undefined,
    //     run: undefined,
    //     walk: undefined,
    // });

    const [inputKeys, setInputKeys] = useState<InputKeys>({
        backward: false,
        forward: false,
        left: false,
        right: false,
        shift: false,
        space: false,
    });
    const fsm = new CharacterFSM({});
    const input = new BasicCharacterControllerInput();

    idleAnimation.animations[0].name = 'idle';
    walkAnimation.animations[0].name = 'walk';
    runAnimation.animations[0].name = 'run';
    const _animations = [
        idleAnimation.animations[0],
        walkAnimation.animations[0],
        runAnimation.animations[0],
        // danceAnimation.animations[0]
    ];
    const {actions} = useAnimations(_animations, modelRef);

    useEffect(() => {
        // document.addEventListener('keydown', (e) => onKeyDown(e), false);
        // document.addEventListener('keyup', (e) => onKeyUp(e), false);
        //
        // return () => {
        //     window.removeEventListener('keydown', onKeyDown);
        //     window.removeEventListener('keydown', onKeyUp);
        // };
    }, []);

    useEffect(() => {
        setModelShadow(model);
        // mixerRef.current = new AnimationMixer(model);
    }, [model]);

    useEffect(() => {
        // onAnimationLoad('idle', idleAnimation);
        // onAnimationLoad('walk', walkAnimation);
        // onAnimationLoad('run', runAnimation);
        // setCurState('idle');

        fsm._animations['idle'] = {
            action: actions['idle']
        }
        fsm._animations['walk'] = {
            action: actions['walk']
        }
        fsm._animations['run'] = {
            action: actions['run']
        }
        fsm.setState('idle');
    }, [idleAnimation, walkAnimation, runAnimation]);

    // useEffect(() => {
    //     if (curState) {
    //         animations[curState]?.action.play();
    //     }
    // }, [curState, animations]);

    useFrame((state, delta) => {
        fsm.update(delta, input);
        update(delta);
    });

    const update = (timeInSeconds: any) => {
        if (!model) return;

        fsm.update(timeInSeconds, input);

        const velocity = VELOCITY;
        const frameDecceleration = new Vector3(
            velocity.x * DECELERATION.x,
            velocity.y * DECELERATION.y,
            velocity.z * DECELERATION.z
        );
        frameDecceleration.multiplyScalar(timeInSeconds);
        frameDecceleration.z =
            Math.sign(frameDecceleration.z) *
            Math.min(Math.abs(frameDecceleration.z), Math.abs(velocity.z));

        velocity.add(frameDecceleration);

        const controlObject = model;
        const _Q = new Quaternion();
        const _A = new Vector3();
        const _R = controlObject.quaternion.clone();

        const acc = ACCELERATION.clone();
        if (input._keys.shift) {
            acc.multiplyScalar(3.0);
        }

        if (input._keys.forward) {
            velocity.z += acc.z * timeInSeconds;
        }
        if (input._keys.backward) {
            velocity.z -= acc.z * timeInSeconds;
        }
        if (input._keys.left) {
            _A.set(0, 1, 0);
            _Q.setFromAxisAngle(
                _A,
                4.0 * Math.PI * timeInSeconds * ACCELERATION.y
            );
            _R.multiply(_Q);
        }
        if (input._keys.right) {
            _A.set(0, 1, 0);
            _Q.setFromAxisAngle(
                _A,
                4.0 * -Math.PI * timeInSeconds * ACCELERATION.y
            );
            _R.multiply(_Q);
        }

        controlObject.quaternion.copy(_R);

        const oldPosition = new Vector3();
        oldPosition.copy(controlObject.position);

        const forward = new Vector3(0, 0, 1);
        forward.applyQuaternion(controlObject.quaternion);
        forward.normalize();

        const sideways = new Vector3(1, 0, 0);
        sideways.applyQuaternion(controlObject.quaternion);
        sideways.normalize();

        sideways.multiplyScalar(velocity.x * timeInSeconds);
        forward.multiplyScalar(velocity.z * timeInSeconds);

        controlObject.position.add(forward);
        controlObject.position.add(sideways);

        oldPosition.copy(controlObject.position);
    };

    // const onAnimationLoad = (
    //     name: AnimationStates,
    //     anim: Group<Object3DEventMap>
    // ) => {
    //     anim.animations[0].name = name;
    //
    //     const clip = anim.animations[0];
    //     const action = mixerRef.current?.clipAction(clip);
    //     if (action) {
    //         setAnimations((prev) => ({
    //             ...prev,
    //             [name]: { clip: clip, action: action },
    //         }));
    //         fsm._animations[name] = {
    //             action: action,
    //         };
    //     }
    // };

    // const onKeyDown = (event: KeyboardEvent) => {
    //     const action = keyCodeActionMap[event.key as CharacterControlInputKey];
    //     if (action) {
    //         setInputKeys((prev) => ({ ...prev, [action]: true }));
    //         console.log('keydown', action);
    //     }
    // };
    //
    // const onKeyUp = (event: KeyboardEvent) => {
    //     const action = keyCodeActionMap[event.key as CharacterControlInputKey];
    //     if (action) {
    //         setInputKeys((prev) => ({ ...prev, [action]: false }));
    //         console.log('keyup', action);
    //     }
    // };

    return <primitive object={model} ref={modelRef} />;
};

export default Mannequin;
