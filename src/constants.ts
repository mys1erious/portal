import { Vector3D } from '@/types';

export const FOV = 60;
export const ASPECT_RATIO = 1920 / 1080;

export const DEFAULT_ELEMENT_SIZE = 64;
export const DEFAULT_ELEMENT_DEPTH = 1;
export const DEFAULT_CHARACTER_HEIGHT = 178;
export const DEFAULT_CHARACTER_WIDTH = 48;
export const DEFAULT_CHARACTER_VELOCITY_MULTIPLIER = 100.0;
// export const DEFAULT_CHARACTER_VELOCITY_MULTIPLIER = 10.0;
export const DEFAULT_CHARACTER_RUN_MULTIPLIER = 2.0;
export const CHARACTER_MAX_VELOCITY = 300.0;
export const DEFAULT_WALL_HEIGHT = DEFAULT_CHARACTER_HEIGHT * 1.2;

export const CHARACTER_CAMERA_OFFSET: Vector3D = [
    0,
    DEFAULT_CHARACTER_HEIGHT - 10,
    // DEFAULT_CHARACTER_HEIGHT + 100,
    0,
    // 100,
];

export const INPUT_ACTION_FORWARD = 'forward';
export const INPUT_ACTION_LEFT = 'left';
export const INPUT_ACTION_RIGHT = 'right';
export const INPUT_ACTION_BACKWARD = 'backward';
export const INPUT_ACTION_RUN = 'run';
export const INPUT_ACTION_JUMP = 'jump';
export type InputAction =
    | typeof INPUT_ACTION_FORWARD
    | typeof INPUT_ACTION_LEFT
    | typeof INPUT_ACTION_RIGHT
    | typeof INPUT_ACTION_BACKWARD
    | typeof INPUT_ACTION_RUN
    | typeof INPUT_ACTION_JUMP;

export const IDLE_ANIMATION = 'idle';
export const WALKING_ANIMATION = 'walking';
export const RUNNING_ANIMATION = 'running';
export type AnimationState =
    | typeof IDLE_ANIMATION
    | typeof WALKING_ANIMATION
    | typeof RUNNING_ANIMATION;
