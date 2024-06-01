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
        // updateCameraRotation(state, delta);
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
        console.log(velocity)

        const cameraOffset = new Vector3(
            ...CHARACTER_CAMERA_OFFSET
        ).applyQuaternion(model.quaternion);
        const cameraPosition = model.position.clone().add(cameraOffset);
        camera.position.copy(cameraPosition);
    };

    // handled by PointerLockControls ...
    // const updateCameraRotation = (state: RootState, delta: number) => {
    //     if (!camera) return;
    //
    //     const deltaX = state.pointer.x - prevPointerRef.current.x;
    //     const deltaY = state.pointer.y - prevPointerRef.current.y;
    //
    //     if (deltaX === 0 && deltaY === 0) {
    //         camera.quaternion.copy(cameraRotationRef.current);
    //         return;
    //     }
    //
    //     phiRef.current -= deltaX * CAMERA_SENSITIVITY * delta;
    //     thetaRef.current = clamp(
    //         thetaRef.current + deltaY * CAMERA_SENSITIVITY * delta,
    //         -Math.PI / 3,
    //         Math.PI / 3
    //     );
    //
    //     const rotationX = new Quaternion();
    //     rotationX.setFromAxisAngle(new Vector3(0, 1, 0), phiRef.current);
    //     const rotationZ = new Quaternion();
    //     rotationZ.setFromAxisAngle(new Vector3(1, 0, 0), thetaRef.current);
    //
    //     cameraRotationRef.current = new Quaternion();
    //     cameraRotationRef.current.multiply(rotationX);
    //     cameraRotationRef.current.multiply(rotationZ);
    //     camera.quaternion.copy(cameraRotationRef.current);
    //
    //     prevPointerRef.current.x = state.pointer.x;
    //     prevPointerRef.current.y = state.pointer.y;
    // };

    // const updatePosition = (delta: number) => {
    //     if (!camera) return;
    //
    //     const xh = mouseXDelta / window.innerWidth;
    //     const yh = mouseYDelta / window.innerHeight;
    //
    //     setPhi((prev) => prev + -xh * 0.04);
    //     setTheta((prev) =>
    //         clamp(prev + -yh * 0.04, -Math.PI / 3, Math.PI / 3)
    //     );
    //
    //     const qx = new Quaternion();
    //     qx.setFromAxisAngle(new Vector3(0, 1, 0), phi);
    //     const qz = new Quaternion();
    //     qz.setFromAxisAngle(new Vector3(1, 0, 0), theta);
    //
    //     const q = new Quaternion();
    //     q.multiply(qx);
    //     q.multiply(qz);
    //
    //     camera.quaternion.copy(q);
    //
    //     const cameraOffset = new Vector3(
    //         ...CHARACTER_CAMERA_OFFSET
    //     ).applyQuaternion(model.quaternion);
    //
    //     const cameraPosition = model.position.clone().add(cameraOffset);
    //     camera.position.copy(cameraPosition);
    //
    //     setPreviousMouseX(mouseX);
    //     setPreviousMouseY(mouseY);
    //
    //     const velocity = VELOCITY;
    //     const frameDeceleration = new Vector3(
    //         velocity.x * DECELERATION.x,
    //         velocity.y * DECELERATION.y,
    //         velocity.z * DECELERATION.z
    //     );
    //     frameDeceleration.multiplyScalar(delta);
    //     frameDeceleration.z =
    //         Math.sign(frameDeceleration.z) *
    //         Math.min(Math.abs(frameDeceleration.z), Math.abs(velocity.z));
    //
    //     velocity.add(frameDeceleration);
    //
    //     const _Q = new Quaternion();
    //     const _A = new Vector3();
    //     const _R = model.quaternion.clone();
    //
    //     const acc = ACCELERATION.clone();
    //     if (runPressed) {
    //         acc.multiplyScalar(3.0);
    //     }
    //
    //     if (forwardPressed) {
    //         velocity.z += acc.z * delta;
    //     }
    //     if (backwardPressed) {
    //         velocity.z -= acc.z * delta;
    //     }
    //     if (leftPressed) {
    //         velocity.x += acc.x * delta;
    //         // _A.set(0, 1, 0);
    //         // _Q.setFromAxisAngle(_A, 4.0 * Math.PI * delta * ACCELERATION.y);
    //         // _R.multiply(_Q);
    //     }
    //     if (rightPressed) {
    //         velocity.x -= acc.x * delta;
    //         // _A.set(0, 1, 0);
    //         // _Q.setFromAxisAngle(_A, 4.0 * -Math.PI * delta * ACCELERATION.y);
    //         // _R.multiply(_Q);
    //     }
    //
    //     // model.quaternion.copy(_R);
    //
    //     const oldPosition = new Vector3();
    //     oldPosition.copy(model.position);
    //
    //     const forward = new Vector3(0, 0, 1);
    //     forward.applyQuaternion(model.quaternion);
    //     forward.normalize();
    //
    //     const sideways = new Vector3(1, 0, 0);
    //     sideways.applyQuaternion(model.quaternion);
    //     sideways.normalize();
    //
    //     forward.multiplyScalar(velocity.z * delta);
    //     sideways.multiplyScalar(velocity.x * delta);
    //
    //     if (Math.abs(forward.z) < ACCELERATION_BOTTOM_LIMIT) {
    //         forward.setZ(0);
    //     }
    //     if (Math.abs(sideways.x) < ACCELERATION_BOTTOM_LIMIT) {
    //         sideways.setX(0);
    //     }
    //
    //     model.position.add(forward);
    //     model.position.add(sideways);
    // };
};

export default useCharacterInputController;
