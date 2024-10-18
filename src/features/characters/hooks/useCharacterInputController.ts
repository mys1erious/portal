import { v4 as uuidv4 } from 'uuid';

import {
    CHARACTER_CAMERA_OFFSET,
    CHARACTER_MAX_VELOCITY,
    DEFAULT_CHARACTER_HEIGHT,
    DEFAULT_CHARACTER_RUN_MULTIPLIER,
    DEFAULT_CHARACTER_VELOCITY_MULTIPLIER,
    InputAction,
} from '@/constants';
import { RootState, useFrame, useThree } from '@react-three/fiber';
import { Group, Quaternion, Vector3 } from 'three';
import { useKeyboardControls } from '@react-three/drei';
import React, { useEffect, useRef } from 'react';
import { lerp } from '@/utils';
import { PortalData } from '@/features/characters/components/Mannequin';

const DECELERATION = new Vector3(-5, -0.0001, -5.0);
const ACCELERATION = new Vector3(175, 0.25, 200.0);
const VELOCITY = new Vector3(0, 0, 0);

const useCharacterInputController = (
    rigidBodyRef: React.RefObject<any>,
    portals: PortalData[],
    setPortals: React.Dispatch<React.SetStateAction<PortalData[]>>
): void => {
    const { camera } = useThree();

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
    // const jumpPressed = useKeyboardControls<InputAction>(
    //     (state) => state.jump
    // );

    const leftMousePressed = useRef(false);
    const rightMousePressed = useRef(false);

    useEffect(() => {
        document.addEventListener('mousedown', onMouseDown);
        // document.addEventListener(
        //     'mouseup',
        //     (e: MouseEvent) => onMouseUp(e),
        //     false
        // );
        return () => {
            document.removeEventListener('mousedown', onMouseDown);
            // document.removeEventListener('mouseup', onMouseUp);
        };
    }, []);

    const onMouseDown = (e: MouseEvent) => {
        switch (e.button) {
            case 0: {
                shoot();

                // leftMousePressed.current = true;
                break;
            }
            case 2: {
                rightMousePressed.current = true;
                break;
            }
        }
    };
    const onMouseUp = (e: MouseEvent) => {
        switch (e.button) {
            case 0: {
                leftMousePressed.current = false;
                break;
            }
            case 2: {
                rightMousePressed.current = false;
                break;
            }
        }
    };

    useFrame((state, delta) => {
        if (rigidBodyRef.current) {
            updatePosition(delta);
            updateRotation(delta);
            updateCamera(delta);
        }
    });

    const shoot = () => {
        if (!rigidBodyRef.current) return;

        const characterPosition = rigidBodyRef.current.translation();
        const position = {
            x: characterPosition.x + 10,
            y: characterPosition.y + CHARACTER_CAMERA_OFFSET[1],
            z: characterPosition.z,
        };

        const direction = new Vector3();
        camera.getWorldDirection(direction);
        direction.normalize();

        const speed = 500;
        const velocity = {
            x: direction.x * speed,
            y: direction.y * speed,
            z: direction.z * speed,
        };
        const portalId = uuidv4();

        setPortals((prevPortals) => [
            ...prevPortals,
            {
                id: portalId,
                position: position,
                velocity: velocity,
            },
        ]);
    };

    const updatePosition = (delta: number) => {
        const forward = new Vector3(0, 0, -1)
            .applyQuaternion(camera.quaternion)
            .setY(0)
            .normalize();

        const sideways = new Vector3(1, 0, 0)
            .applyQuaternion(camera.quaternion)
            .setY(0)
            .normalize();

        const velocity = VELOCITY.clone();

        const frameDeceleration = new Vector3(
            velocity.x * DECELERATION.x,
            velocity.y * DECELERATION.y,
            velocity.z * DECELERATION.z
            // ).multiplyScalar(DEFAULT_CHARACTER_VELOCITY_MULTIPLIER * delta);
        );
        frameDeceleration.z =
            Math.sign(frameDeceleration.z) *
            Math.min(Math.abs(frameDeceleration.z), Math.abs(velocity.z));
        velocity.add(frameDeceleration);

        const acc = ACCELERATION.clone();
        // const acc = ACCELERATION.clone().multiplyScalar(
        //     DEFAULT_CHARACTER_VELOCITY_MULTIPLIER * delta
        // );
        if (runPressed) {
            acc.multiplyScalar(DEFAULT_CHARACTER_RUN_MULTIPLIER);
        }

        if (forwardPressed) {
            velocity.add(forward.multiplyScalar(acc.z));
        }
        if (backwardPressed) {
            velocity.add(forward.multiplyScalar(-acc.z));
        }
        if (leftPressed) {
            velocity.add(sideways.multiplyScalar(-acc.x));
        }
        if (rightPressed) {
            velocity.add(sideways.multiplyScalar(acc.x));
        }

        if (velocity.length() > CHARACTER_MAX_VELOCITY) {
            velocity.normalize().multiplyScalar(CHARACTER_MAX_VELOCITY);
        }

        // TODO: handle y later
        velocity.setY(0);

        const currentPosition = rigidBodyRef.current.translation();
        const newPosition = new Vector3(
            lerp(
                currentPosition.x,
                currentPosition.x + velocity.x * delta,
                0.8
            ),
            currentPosition.y,
            lerp(currentPosition.z, currentPosition.z + velocity.z * delta, 0.8)
        );
        rigidBodyRef.current.setTranslation(
            { x: newPosition.x, y: newPosition.y, z: newPosition.z },
            true
        );

        // rigidBodyRef.current.setLinvel(velocity, true);
    };

    const updateRotation = (delta: number) => {
        const cameraDirection = new Vector3();
        camera.getWorldDirection(cameraDirection);
        cameraDirection.setY(0).normalize();

        const flipQuaternion = new Quaternion().setFromAxisAngle(
            new Vector3(0, 1, 0),
            Math.PI
        );
        const targetQuaternion = new Quaternion()
            .setFromUnitVectors(new Vector3(0, 0, -1), cameraDirection)
            .multiply(flipQuaternion);

        const currentRotation = rigidBodyRef.current.rotation();
        const smoothFactor = 5.0;
        const newRotation = new Quaternion();
        newRotation.slerpQuaternions(
            currentRotation,
            targetQuaternion,
            delta * smoothFactor
        );
        rigidBodyRef.current.setRotation(newRotation);
    };

    const updateCamera = (delta: number) => {
        const characterPosition = rigidBodyRef.current.translation();
        const newCameraPosition = new Vector3(
            characterPosition.x + CHARACTER_CAMERA_OFFSET[0],
            characterPosition.y + CHARACTER_CAMERA_OFFSET[1],
            characterPosition.z + CHARACTER_CAMERA_OFFSET[2]
        );
        camera.position.copy(newCameraPosition);
        // camera.lookAt(characterPosition);
    };
};

export default useCharacterInputController;
