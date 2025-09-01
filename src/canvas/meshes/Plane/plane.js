import {Mesh, Object3D, PlaneGeometry, ShaderMaterial, Vector3,} from 'three';

import {component} from '@/canvas/dispatcher/index.js';
import renderer from '@/canvas/renderer.js';
import vertexShader from './vertex.glsl'
import fragmentShader from './fragment.glsl'


export class Plane extends component(Object3D, {
    raf: {
        renderPriority: 1,
        fps: Infinity,
    },
    noiseTexture: null,
    yOffset: 0,
    cutoff: 0,
    density: 0,
    shelIndex: 0,
    shellCount: 0,
    grassThickness: 1.0,
    maxThickness: 5.0
}) {
    init() {
        renderer.compileAsync(this).then(() => {
            const geometry = new PlaneGeometry(10, 10, 1, 1);

            this.mesh = new Mesh(geometry);
            this.updateMaterial();
            this.mesh.rotation.x = -Math.PI / 2;
            this.mesh.position.y = 0.1 + this.yOffset;
            // this.mesh.position.x += 0.001 * this.shellIndex;
            this.mesh.updateMatrix();
            this.add(this.mesh);
        });
    }

    updateMaterial() {
        const uniforms = {
            uTex : { value: this.noiseTexture },
            cutoff: { value: this.cutoff },
            density: { value: this.density},
            shellIndex: {value: this.shellIndex},
            shellCount: {value: this.shellCount},
            uLightDir: { value: new Vector3(1, 1, 1).normalize() },
            grassThickness: {value: this.grassThickness},
            maxThickness: {value: this.maxThickness}
        }

        this.mesh.material = new ShaderMaterial({
            uniforms,
            vertexShader,
            fragmentShader,
            transparent: true
        })
        this.mesh.updateMatrix()
    }

    update() {
        this.mesh.position.y = 0.1 + this.yOffset;
        this.mesh.updateMatrix()
    }
}
