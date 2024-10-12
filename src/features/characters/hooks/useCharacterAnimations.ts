import {
    AnimationAction,
    AnimationMixer,
    Group,
    Object3DEventMap,
} from 'three';
import { useFBX, useKeyboardControls } from '@react-three/drei';
import { useEffect, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import {
    AnimationState,
    IDLE_ANIMATION,
    InputAction,
    RUNNING_ANIMATION,
    WALKING_ANIMATION,
} from '@/constants';
import { getActionFromAnimation } from '@/utils';

const IDLE_ANIM_PATH = '/models/character/idle.fbx';
const WALKING_ANIM_PATH = '/models/character/walking.fbx';
const RUNNING_ANIM_PATH = '/models/character/running.fbx';

type Action = { [k in AnimationState]?: AnimationAction };

class State {
    enter(
        state: AnimationState,
        action: AnimationAction,
        prevState: AnimationState,
        prevAction: AnimationAction
    ) {}

    exit() {}
}

class IdleState extends State {
    enter(
        state: AnimationState,
        action: AnimationAction,
        prevState: AnimationState,
        prevAction: AnimationAction
    ) {
        action.time = 0.0;
        action.enabled = true;
        action.setEffectiveTimeScale(1.0);
        action.setEffectiveWeight(1.0);
        action.crossFadeFrom(prevAction, 0.5, true);
        action.play();
    }

    exit() {}
}

class WalkingState extends State {
    enter(
        state: AnimationState,
        action: AnimationAction,
        prevState: AnimationState,
        prevAction: AnimationAction
    ) {
        action.enabled = true;
        if (prevState === RUNNING_ANIMATION) {
            const ratio =
                action.getClip().duration / prevAction.getClip().duration;
            action.time = prevAction.time * ratio;
        } else {
            action.time = 0.0;
            action.setEffectiveTimeScale(1.0);
            action.setEffectiveWeight(1.0);
        }
        action.crossFadeFrom(prevAction, 0.5, true);
        action.play();
    }

    exit() {}
}

class RunningState extends State {
    enter(
        state: AnimationState,
        action: AnimationAction,
        prevState: AnimationState,
        prevAction: AnimationAction
    ) {
        action.enabled = true;
        if (prevState === WALKING_ANIMATION) {
            const ratio =
                action.getClip().duration / prevAction.getClip().duration;
            action.time = prevAction.time * ratio;
        } else {
            action.time = 0.0;
            action.setEffectiveTimeScale(1.0);
            action.setEffectiveWeight(1.0);
        }
        action.crossFadeFrom(prevAction, 0.5, true);
        action.play();
    }

    exit() {}
}

const stateClassesMap = {
    [IDLE_ANIMATION]: IdleState,
    [WALKING_ANIMATION]: WalkingState,
    [RUNNING_ANIMATION]: RunningState,
};

const useCharacterAnimations = (model: Group<Object3DEventMap>): void => {
    const idleAnimation = useFBX(IDLE_ANIM_PATH);
    const walkingAnimation = useFBX(WALKING_ANIM_PATH);
    const runningAnimation = useFBX(RUNNING_ANIM_PATH);
    const mixerRef = useRef(new AnimationMixer(model));

    const actions = useRef<Action>({});
    const [currentState, setCurrentState] =
        useState<AnimationState>(IDLE_ANIMATION);

    const forwardPressed = useKeyboardControls<InputAction>(
        (state) => state.forward
    );
    const leftPressed = useKeyboardControls<InputAction>((state) => state.left);
    const rightPressed = useKeyboardControls<InputAction>(
        (state) => state.right
    );
    const backwardPressed = useKeyboardControls<InputAction>(
        (state) => state.backward
    );
    const runPressed = useKeyboardControls<InputAction>((state) => state.run);
    // const jumpPressed = useKeyboardControls<InputAction>((state) => state.jump);

    useEffect(() => {
        actions.current = {
            [IDLE_ANIMATION]: getActionFromAnimation(
                mixerRef.current,
                idleAnimation,
                model
            ),
            [WALKING_ANIMATION]: getActionFromAnimation(
                mixerRef.current,
                walkingAnimation,
                model
            ),
            [RUNNING_ANIMATION]: getActionFromAnimation(
                mixerRef.current,
                runningAnimation,
                model
            ),
        };
        actions.current.idle?.play();
        return () => {
            mixerRef.current.stopAllAction();
        };
    }, [idleAnimation, walkingAnimation, runningAnimation, model]);

    useEffect(() => {
        handleAnimations();
    }, [
        runPressed,
        forwardPressed,
        backwardPressed,
        leftPressed,
        rightPressed,
    ]);

    useFrame((state, delta) => {
        mixerRef.current.update(delta);
    });

    const handleAnimations = () => {
        const isWalking = forwardPressed || backwardPressed;
        if (isWalking && runPressed) {
            changeAction(RUNNING_ANIMATION);
        } else if (isWalking) {
            changeAction(WALKING_ANIMATION);
        } else {
            changeAction(IDLE_ANIMATION);
        }
    };

    const changeAction = (toState: AnimationState) => {
        if (currentState === toState) return;

        const currentAction = actions.current[currentState];
        const toAction = actions.current[toState];

        const stateClass = new stateClassesMap[currentState]();

        if (currentAction && toAction) {
            stateClass.exit();
            stateClass.enter(toState, toAction, currentState, currentAction);
            setCurrentState(toState);
        }
    };
};

export default useCharacterAnimations;
