import { Vector3D } from '@/types';

export const FOV = 60;
export const ASPECT_RATIO = 1920 / 1080;

export const MANNEQUIN_HEIGHT = 1.78;
export const CHARACTER_SPEED = 5;
export const CHARACTER_RUN_SPEED = 10;
export const PROJECTILE_SPEED = 100;

export const DEFAULT_ELEMENT_SIZE = 1;
export const DEFAULT_ELEMENT_DEPTH = 0.2;
export const DEFAULT_WALL_HEIGHT = MANNEQUIN_HEIGHT * 1.3;

export const CHARACTER_CAMERA_OFFSET: Vector3D = [0, MANNEQUIN_HEIGHT, 0];

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
