// General
export const FOV = 60;
export const ASPECT_RATIO = 1920 / 1080;

// Elements
export const DEFAULT_ELEMENT_SIZE = 64;
export const DEFAULT_ELEMENT_DEPTH = 1;
export const DEFAULT_CHARACTER_HEIGHT = 178;
export const DEFAULT_WALL_HEIGHT = DEFAULT_CHARACTER_HEIGHT * 1.2;

// Input Keys
export const W_KEY = 'w';
export const A_KEY = 'a';
export const S_KEY = 's';
export const D_KEY = 'd';
export const SPACE_KEY = ' ';
export const SHIFT_KEY = 'Shift';
export type CharacterControlInputKey =
    | typeof W_KEY
    | typeof A_KEY
    | typeof S_KEY
    | typeof D_KEY
    | typeof SPACE_KEY
    | typeof SHIFT_KEY;
export type InputKey = CharacterControlInputKey;

// Control
export const INPUT_ACTION_FORWARD = 'forward';
export const INPUT_ACTION_BACKWARD = 'backward';
export const INPUT_ACTION_LEFT = 'left';
export const INPUT_ACTION_RIGHT = 'right';
export const INPUT_ACTION_SPACE = 'space';
export const INPUT_ACTION_SHIFT = 'shift';
export type InputActions =
    | typeof INPUT_ACTION_FORWARD
    | typeof INPUT_ACTION_LEFT
    | typeof INPUT_ACTION_RIGHT
    | typeof INPUT_ACTION_SPACE
    | typeof INPUT_ACTION_SHIFT
    | typeof INPUT_ACTION_BACKWARD;

type KeyCodeActionMap = {
    [k in InputKey]?: InputActions;
};
export const keyCodeActionMap: KeyCodeActionMap = {
    [W_KEY]: INPUT_ACTION_FORWARD,
    [A_KEY]: INPUT_ACTION_LEFT,
    [D_KEY]: INPUT_ACTION_RIGHT,
    [S_KEY]: INPUT_ACTION_BACKWARD,
    [SHIFT_KEY]: INPUT_ACTION_SHIFT,
    [SPACE_KEY]: INPUT_ACTION_SPACE,
};
