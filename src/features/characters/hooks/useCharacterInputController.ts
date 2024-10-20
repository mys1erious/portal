import {
    CHARACTER_RUN_SPEED,
    CHARACTER_SPEED,
    InputAction,
    MANNEQUIN_HEIGHT,
    PROJECTILE_SPEED,
} from '@/constants';
import { Camera, useFrame, useThree } from '@react-three/fiber';
import { Group, MathUtils, Vector3 } from 'three';
import { useKeyboardControls } from '@react-three/drei';
import React, { useCallback, useEffect, useRef } from 'react';
import { PortalData } from '@/features/characters/components/Mannequin';
import { RigidBody as TRigidBody } from '@dimforge/rapier3d-compat';

const useCharacterInputController = (
    rb: React.RefObject<TRigidBody>,
    container: React.RefObject<Group>,
    cameraPosition: React.RefObject<Group>,
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
    const jumpPressed = useKeyboardControls<InputAction>((state) => state.jump);

    const matrixWorldX = useRef(new Vector3());
    const matrixWorldY = useRef(new Vector3());
    const matrixWorldZ = useRef(new Vector3());
    const rotationTarget = useRef(0);
    const cameraWorldPosition = useRef(new Vector3());
    const cameraWorldDirection = useRef(new Vector3());

    useEffect(() => {
        document.addEventListener('mousedown', onMouseDown);
        return () => {
            document.removeEventListener('mousedown', onMouseDown);
        };
    }, []);

    useFrame(({ camera }) => {
        handleControls(camera);
        handleRotation(camera);
        handleCamera(camera);
    });

    const onMouseDown = (e: MouseEvent) => {
        switch (e.button) {
            case 0: {
                shoot();
                break;
            }
        }
    };

    const shoot = useCallback(() => {
        if (!rb.current) return;

        const direction = new Vector3();
        camera.getWorldDirection(direction);
        direction.normalize();

        const characterPosition = rb.current.translation();
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
    }, [rb, setPortalData, camera]);

    const handleControls = (camera: Camera) => {
        if (!rb.current) return;

        const vel = rb.current.linvel();

        camera.matrixWorld.extractBasis(
            matrixWorldX.current,
            matrixWorldY.current,
            matrixWorldZ.current
        );

        matrixWorldZ.current.negate();
        matrixWorldZ.current.y = 0;
        matrixWorldZ.current.normalize();

        matrixWorldX.current.y = 0;
        matrixWorldX.current.normalize();

        matrixWorldY.current.x = 0;
        matrixWorldY.current.z = 0;
        matrixWorldY.current.normalize();

        const moveDir = new Vector3();
        if (forwardPressed) {
            moveDir.add(matrixWorldZ.current);
        }
        if (backwardPressed) {
            moveDir.sub(matrixWorldZ.current);
        }
        if (leftPressed) {
            moveDir.sub(matrixWorldX.current);
        }
        if (rightPressed) {
            moveDir.add(matrixWorldX.current);
        }
        // if (jumpPressed) {
        //     moveDir.add(matrixWorldY.current);
        // }

        moveDir.normalize();

        let speed = runPressed ? CHARACTER_RUN_SPEED : CHARACTER_SPEED;
        if (moveDir.lengthSq() > 0) {
            // Face movement direction
            // rotationTarget.current = Math.atan2(moveDir.x, moveDir.z);
            vel.x = moveDir.x * speed;
            vel.z = moveDir.z * speed;
            // vel.y = moveDir.y * speed;
        } else {
            vel.x = 0;
            vel.z = 0;
        }

        rb.current.setLinvel(vel, true);
    };

    const handleRotation = (camera: Camera) => {
        if (!container.current) return;

        // Face camera direction
        camera.getWorldDirection(cameraWorldDirection.current);
        rotationTarget.current = Math.atan2(
            cameraWorldDirection.current.x,
            cameraWorldDirection.current.z
        );

        container.current.rotation.y = MathUtils.lerp(
            container.current.rotation.y,
            rotationTarget.current,
            0.1
        );
    };

    const handleCamera = (camera: Camera) => {
        if (!cameraPosition.current) return;
        cameraPosition.current.getWorldPosition(cameraWorldPosition.current);
        camera.position.lerp(cameraWorldPosition.current, 0.1);
    };
};

export default useCharacterInputController;
