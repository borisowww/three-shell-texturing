import {DataTexture, RedFormat} from "three";

export const getNoiseTexture = (size = 512) => {
    const data = new Uint8Array(size * size);
    for (let i = 0; i < size * size; i++) {
        data[i] = Math.min(Math.random() + 0.1, 1.0)  * 255;
    }
    const texture = new DataTexture(data, size, size, RedFormat);
    texture.needsUpdate = true;

    return texture;
}