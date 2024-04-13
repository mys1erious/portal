export const FOV = 60;
export const ASPECT_RATIO = 1920 / 1080;

export const DEFAULT_ELEMENT_SIZE = 64;
export const DEFAULT_ELEMENT_DEPTH = 1;
export const DEFAULT_CHARACTER_HEIGHT = 178;
export const DEFAULT_WALL_HEIGHT = DEFAULT_CHARACTER_HEIGHT * 1.2;

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
