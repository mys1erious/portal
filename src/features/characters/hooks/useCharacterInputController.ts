import {
    CHARACTER_CAMERA_OFFSET,
    MANNEQUIN_HEIGHT,
    CHARACTER_RUN_SPEED,
    CHARACTER_SPEED,
    InputAction, PROJECTILE_SPEED,
} from '@/constants';
import { useFrame, useThree } from '@react-three/fiber';
import { Quaternion, Vector3 } from 'three';
import { useKeyboardControls } from '@react-three/drei';
import React, { useCallback, useEffect } from 'react';
import { PortalData } from '@/features/characters/components/Mannequin';

const useCharacterInputController = (
    rigidBodyRef: React.RefObject<any>,
    portalData: PortalData | null,
    setPortalData: React.Dispatch<React.SetStateAction<PortalData | null>>
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

    useEffect(() => {
        document.addEventListener('mousedown', onMouseDown);
        return () => {
            document.removeEventListener('mousedown', onMouseDown);
        };
    }, []);

    const onMouseDown = (e: MouseEvent) => {
        switch (e.button) {
            case 0: {
                shoot();
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

    const shoot = useCallback(() => {
        if (!rigidBodyRef.current) return;

        const direction = new Vector3();
        camera.getWorldDirection(direction);
        direction.normalize();

        const characterPosition = rigidBodyRef.current.translation();
        const position = {
            x: characterPosition.x + direction.x,
            y: characterPosition.y + direction.y + MANNEQUIN_HEIGHT - 0.18,
            z: characterPosition.z + direction.z,
        };

        const velocity = {
            x: direction.x * PROJECTILE_SPEED,
            y: direction.y * PROJECTILE_SPEED,
            z: direction.z * PROJECTILE_SPEED,
        };

        setPortalData(null);
        setPortalData({
            position: position,
            velocity: velocity,
        });
    }, [rigidBodyRef, setPortalData, camera]);

    const updatePosition = (delta: number) => {
        const forward = new Vector3(0, 0, -1)
            .applyQuaternion(camera.quaternion)
            .setY(0)
            .normalize();

        const sideways = new Vector3(1, 0, 0)
            .applyQuaternion(camera.quaternion)
            .setY(0)
            .normalize();

        const moveDirection = new Vector3();

        if (forwardPressed) {
            moveDirection.add(forward);
        }
        if (backwardPressed) {
            moveDirection.add(forward.clone().negate());
        }
        if (leftPressed) {
            moveDirection.add(sideways.clone().negate());
        }
        if (rightPressed) {
            moveDirection.add(sideways);
        }

        if (moveDirection.lengthSq() > 0) {
            moveDirection.normalize();
            const speed = runPressed ? CHARACTER_RUN_SPEED : CHARACTER_SPEED;
            const desiredVelocity = moveDirection.multiplyScalar(speed);

            const currentLinvel = rigidBodyRef.current.linvel();
            rigidBodyRef.current.setLinvel(
                {
                    x: desiredVelocity.x,
                    y: currentLinvel.y,
                    z: desiredVelocity.z,
                },
                true
            );
        } else {
            const currentLinvel = rigidBodyRef.current.linvel();
            rigidBodyRef.current.setLinvel(
                {
                    x: currentLinvel.x * 0.8,
                    y: currentLinvel.y,
                    z: currentLinvel.z * 0.8,
                },
                true
            );
        }
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
    };
};

export default useCharacterInputController;
