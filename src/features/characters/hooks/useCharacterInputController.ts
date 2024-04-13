import { InputAction } from '@/constants';
import { useFrame } from '@react-three/fiber';
import { Group, Object3DEventMap, Quaternion, Vector3 } from 'three';
import { useKeyboardControls } from '@react-three/drei';

const DECELERATION = new Vector3(-0.0005, -0.0001, -5.0);
const ACCELERATION = new Vector3(5, 0.25, 850.0);
const VELOCITY = new Vector3(0, 0, 0);

const useCharacterInputController = (model: Group<Object3DEventMap>): void => {
    const forwardPressed = useKeyboardControls<InputAction>(
        (state) => state.forward
    );
    const leftPressed = useKeyboardControls<InputAction>(
        (state) => state.left
    );
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

    useFrame((state, delta) => {
        updateModelPosition(delta);
    });

    const updateModelPosition = (delta: number) => {
        const velocity = VELOCITY;
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

        const _Q = new Quaternion();
        const _A = new Vector3();
        const _R = model.quaternion.clone();

        const acc = ACCELERATION.clone();
        if (runPressed) {
            acc.multiplyScalar(3.0);
        }

        if (forwardPressed) {
            velocity.z += acc.z * delta;
        }
        if (backwardPressed) {
            velocity.z -= acc.z * delta;
        }
        if (leftPressed) {
            _A.set(0, 1, 0);
            _Q.setFromAxisAngle(_A, 4.0 * Math.PI * delta * ACCELERATION.y);
            _R.multiply(_Q);
        }
        if (rightPressed) {
            _A.set(0, 1, 0);
            _Q.setFromAxisAngle(_A, 4.0 * -Math.PI * delta * ACCELERATION.y);
            _R.multiply(_Q);
        }

        model.quaternion.copy(_R);

        const oldPosition = new Vector3();
        oldPosition.copy(model.position);

        const forward = new Vector3(0, 0, 1);
        forward.applyQuaternion(model.quaternion);
        forward.normalize();

        const sideways = new Vector3(1, 0, 0);
        sideways.applyQuaternion(model.quaternion);
        sideways.normalize();

        sideways.multiplyScalar(velocity.x * delta);
        forward.multiplyScalar(velocity.z * delta);

        model.position.add(forward);
        model.position.add(sideways);

        oldPosition.copy(model.position);
    };
};

export default useCharacterInputController;
