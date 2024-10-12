import { CHARACTER_CAMERA_OFFSET, InputAction } from '@/constants';
import { RootState, useFrame, useThree } from '@react-three/fiber';
import { Group, Quaternion, Vector3 } from 'three';
import { useKeyboardControls } from '@react-three/drei';
import { useEffect, useRef } from 'react';

const DECELERATION = new Vector3(-5, -0.0001, -5.0);
const ACCELERATION = new Vector3(175, 0.25, 200.0);
const VELOCITY = new Vector3(0, 0, 0);

const useCharacterInputController = (model: Group): void => {
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
        document.addEventListener(
            'mousedown',
            (e: MouseEvent) => onMouseDown(e),
            false
        );
        document.addEventListener(
            'mouseup',
            (e: MouseEvent) => onMouseUp(e),
            false
        );
        return () => {
            document.removeEventListener('mousedown', onMouseDown, false);
            document.removeEventListener('mouseup', onMouseUp, false);
        };
    }, []);

    const onMouseDown = (e: MouseEvent) => {
        switch (e.button) {
            case 0: {
                leftMousePressed.current = true;
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
        updatePosition(state, delta);
    });

    const updatePosition = (state: RootState, delta: number) => {
        const forward = new Vector3(0, 0, -1).applyQuaternion(
            camera.quaternion
        );
        const sideways = new Vector3(1, 0, 0).applyQuaternion(
            camera.quaternion
        );

        const velocity = VELOCITY.clone();
        const frameDeceleration = new Vector3(
            velocity.x * DECELERATION.x,
            velocity.y * DECELERATION.y,
            velocity.z * DECELERATION.z
        );
        frameDeceleration.multiplyScalar(delta);
        frameDeceleration.z =
            Math.sign(frameDeceleration.z) *
            Math.min(Math.abs(frameDeceleration.z), Math.abs(velocity.z));
        velocity.add(frameDeceleration);

        const acc = ACCELERATION.clone();
        if (runPressed) {
            acc.multiplyScalar(2.0);
        }

        if (forwardPressed) {
            velocity.add(forward.multiplyScalar(acc.z * delta));
        }
        if (backwardPressed) {
            velocity.add(forward.multiplyScalar(-acc.z * delta));
        }
        if (leftPressed) {
            velocity.add(sideways.multiplyScalar(-acc.x * delta));
        }
        if (rightPressed) {
            velocity.add(sideways.multiplyScalar(acc.x * delta));
        }

        // TODO: handle y later
        velocity.setY(0);
        model.position.add(velocity);

        const cameraOffset = new Vector3(
            ...CHARACTER_CAMERA_OFFSET
        ).applyQuaternion(model.quaternion);
        const cameraPosition = model.position.clone().add(cameraOffset);
        camera.position.copy(cameraPosition);
    };
};

export default useCharacterInputController;
