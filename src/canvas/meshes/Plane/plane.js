import {
    Color,
    InstancedMesh,
    Object3D,
    PlaneGeometry,
    ShaderMaterial,
} from 'three';
import scene from '@/canvas/scene';
import {component} from '@/canvas/dispatcher/index.js';
import renderer from '@/canvas/renderer.js';
import vertexShader from './vertex.glsl'
import textureBased from './textureBased.glsl'
import noiseBased from './noiseBased.glsl'
import {getNoiseTexture} from "@/canvas/helpers/noise.js";
import loader from "@/canvas/loader.js";

export class Plane extends component(Object3D, {
    raf: {
        renderPriority: 1,
        fps: 120,
    },
}) {
    init() {
        this.config = {
            height: 0.4,
            density: 128,
            shellCount: 64,
            grassThickness: 1.0,
            bladeShape: 0.5,
            jitterAmount: 0.5,
            minHeight: 0.3,
            topColor: new Color(0, 0.8, 0),
            bottomColor: new Color(0, 0.4, 0.0),
            windSpeed: 0.001,
            windAmp: 0.03,
            windFreq: 4,
            windPhase: 0.05,
            variant: 'texture_based'
        }
        this.geometry = new PlaneGeometry(10, 10, 5, 5);

        this.texture = loader.resources.grassTexture.asset;

        const uniforms = {
            uTime: { value: 0 },
            uTex : { value: this.texture },
            density: { value: this.config.density},
            shellCount: {value: this.config.shellCount},
            grassThickness: {value: this.config.grassThickness},
            bladeShape: {value: this.config.bladeShape},
            height: {value: this.config.height},
            jitterAmount: {value: this.config.jitterAmount},
            minHeight: {value: this.config.minHeight},
            bottomColor: {value: this.config.bottomColor},
            topColor: {value: this.config.topColor},
            windSpeed: {value: this.config.windSpeed},
            windAmp: {value: this.config.windAmp},
            windFreq: {value: this.config.windFreq},
            windPhase: {value: this.config.windPhase}
        }

        this.material = new ShaderMaterial({
            uniforms,
            vertexShader,
            fragmentShader: textureBased,
            transparent: true
        })

        this.mesh = new InstancedMesh(this.geometry, this.material, this.config.shellCount);
        this.mesh.rotation.x = -Math.PI / 2;
        this.mesh.position.y  = this.mesh.position.y + 0.1;
        this.mesh.updateMatrix();
        renderer.compileAsync(this.mesh, scene).then(() => {
            this.add(this.mesh);
            scene.add(this);
        });
    }

    onThrottle({delta, elapsedTime}) {
        this.material.uniforms.uTime.value = elapsedTime;
    }

    updateInstanceCount() {
        this.mesh.count = this.config.shellCount;
    }

    onDebug({gui}) {
        this.gui = gui.addFolder('Grass');
        this.gui.add(this.config, 'variant', ['texture_based', 'noise_based'])
            .onChange((val) => {
                if (val === 'texture_based') {
                    this.material.fragmentShader = textureBased;
                    this.material.uniforms.uTex.value = this.texture;
                    this.gui.proceduralGrass.show();
                }
                else {
                    this.material.fragmentShader = noiseBased;
                    this.material.uniforms.uTex.value = getNoiseTexture(this.config.density);
                    this.gui.proceduralGrass.show();
                }
                this.material.needsUpdate = true;
            })
            .name("Variant")
        this.gui.add(this.config, 'shellCount', 3, 256, 1)
            .onChange((val) => {
                this.material.uniforms.shellCount.value = val;
                this.updateInstanceCount();
            })
            .name('Slices');
        this.gui.add(this.config, 'height', 0, 1)
            .onChange((val) => {
                this.material.uniforms.height.value = val;
            })
            .name('Height');

        this.gui.addColor(this.config, "topColor")
            .onChange((val) => {
                console.log(val)
                this.material.uniforms.topColor.value = val;
            })
            .name("Grass Color Top")
        this.gui.addColor(this.config, "bottomColor")
            .onChange((val) => {
                console.log(val)
                this.material.uniforms.bottomColor.value = val;
            })
            .name("Grass Color Bottom")
        this.gui.add(this.config, "windSpeed", 0, 0.005, 0.001)
            .onChange((val) => {
                console.log(val)
                this.material.uniforms.windSpeed.value = val;
            })
            .name("Wind Speed")
        this.gui.add(this.config, "windFreq", 0, 5, 0.01)
            .onChange((val) => {
                console.log(val)
                this.material.uniforms.windFreq.value = val;
            })
            .name("Wind Frequency")
        this.gui.add(this.config, "windAmp", 0, 0.05, 0.001)
            .onChange((val) => {
                console.log(val)
                this.material.uniforms.windAmp.value = val;
            })
            .name("Wind Amplitude")
        this.gui.add(this.config, "windPhase", 0, 0.1, 0.001)
            .onChange((val) => {
                console.log(val)
                this.material.uniforms.windPhase.value = val;
            })
            .name("Wind Phase")

        this.gui.proceduralGrass = gui.addFolder("Procedural").hide();
        this.gui.proceduralGrass.add(this.config, 'density', 1, 1024, 1)
            .onChange((val) => {
                this.material.uniforms.uTex.value = getNoiseTexture(val);
                this.material.uniforms.density.value = val;
            })
            .name('Density');

        this.gui.proceduralGrass.add(this.config, 'grassThickness', 0, 3, 0.01)
            .onChange((val) => {
                this.material.uniforms.grassThickness.value = val;
            })
            .name('GrassThickness');

        this.gui.proceduralGrass.add(this.config, 'bladeShape', 0, 2, 0.01)
            .onChange((val) => {
                this.material.uniforms.bladeShape.value = val;
            })
            .name('Blade shape');

        this.gui.proceduralGrass.add(this.config, 'jitterAmount', 0, 1, 0.01)
            .onChange((val) => {
                this.material.uniforms.jitterAmount.value = val;
            })
            .name('Jitter Amount');

        this.gui.proceduralGrass.add(this.config, 'minHeight', 0, 1, 0.01)
            .onChange((val) => {
                this.material.uniforms.minHeight.value = val;
            })
            .name('minHeight');
    }
    hide}
