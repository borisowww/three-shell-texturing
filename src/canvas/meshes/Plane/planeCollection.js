import {component} from "@/canvas/dispatcher/index.js";
import {Plane} from "@/canvas/meshes/Plane/plane.js";
import scene from "@/canvas/scene.js";
import {DataTexture, LinearFilter, LinearMipMapLinearFilter, RedFormat} from "three";
import renderer from '@/canvas/renderer';


export class PlaneCollection extends component(null, {

}) {
    init() {
        this.height = 0.2;
        this.slices = 32;
        this.density = 256;
        this.grassThickness = 1.3;
        this.maxThickness = 1.0;

        this.planes = []

        const noiseTexture = this.getNoiseTexture(this.density)
        for (let i = 0; i < this.slices; i++) {
            const plane = new Plane()
            plane.yOffset = (this.height / this.slices) * i;
            plane.noiseTexture = noiseTexture
            plane.cutoff = this.normalize(i, 0, this.slices);
            plane.density = this.density;
            plane.shellIndex = i;
            plane.shellCount = this.slices;
            plane.grassThickness = this.grassThickness;
            plane.maxThickness = this.maxThickness;
            this.planes.push(plane)
            scene.add(plane)
        }
    }

    normalize(value, min, max) {
        return (value - min) / (max - min);
    }

    getNoiseTexture(size = 512) {4
        const data = new Uint8Array(size * size);
        for (let i = 0; i < size * size; i++) {
            data[i] = Math.min(Math.random() + 0.1, 1.0)  * 255;
        }
        const texture = new DataTexture(data, size, size, RedFormat)
        // texture.minFilter = LinearMipMapLinearFilter;
        // texture.magFilter = LinearFilter;
        // texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
        texture.needsUpdate = true;

        return texture;
    }

    onDebug({gui}) {
        this.gui = gui.addFolder('Grass');
        this.gui.add(this, 'height', 0, 1)
            .onChange((val) => {
                this.planes.forEach(( plane, i ) => {
                    plane.yOffset = (this.height / this.slices) * i;
                    plane.update();
                })
            })
            .name('Height');
        this.gui.add(this, 'density', 1, 1024, 1)
            .onChange((val) => {
                const noiseTexture = this.getNoiseTexture(this.density)
                this.planes.forEach(( plane, i ) => {
                    plane.density = this.density
                    plane.noiseTexture = noiseTexture;
                    plane.updateMaterial();
                })
            })
            .name('Density');

        this.gui.add(this, 'grassThickness', 0, 3, 0.01)
            .onChange((val) => {
                this.planes.forEach(( plane, i ) => {
                    plane.grassThickness = this.grassThickness;
                    plane.updateMaterial();
                })
            })
            .name('GrassThickness');

        this.gui.add(this, 'maxThickness', 0, 1, 0.01)
            .onChange((val) => {
                this.planes.forEach(( plane, i ) => {
                    plane.maxThickness = this.maxThickness;
                    plane.updateMaterial();
                })
            })
            .name('maxThicknesss');
    }
}
