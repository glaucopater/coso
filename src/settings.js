
export const MAX_AREA_SIZE = 10;
export const MAX_PLANE_SIZE = MAX_AREA_SIZE / 2 - 1;

export const GAME_SETTINGS = {
    plane: {
        color: "#ccc",
        dimensions: [MAX_AREA_SIZE, 1, MAX_AREA_SIZE]
    },
    player: {
        color: "#45f",
        clickable: true
    },
    tile: {
        color: "#33ff33",
        dimensions: [1, 0, 1]
    }
};