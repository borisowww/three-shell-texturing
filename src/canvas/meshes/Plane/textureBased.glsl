uniform sampler2D uTex;
uniform vec3 topColor;
uniform vec3 bottomColor;
uniform float shellCount;

varying vec2 vUv;
varying vec3 vNormal;

in float vInstanceID;

float hash(float n) {
    return fract(sin(n) * 43758.5453);
}

float hash(vec2 p) {
    return fract(sin(dot(p ,vec2(127.1, 311.7))) * 43758.5453);
}

float normalize01(float v, float minVal, float maxVal) {
    return (v - minVal) / (maxVal - minVal);
}

vec2 randomOffset(vec2 cell) {
    return vec2(sin(hash(cell) * 10.23), sin(hash(cell * 3123.23)));
}

void main() {
    float texColor = texture2D(uTex, vUv).r;

    float opacity = 0.0;

    float cutoff = normalize01(vInstanceID, 0.0, shellCount);
    vec3 shaded = mix(bottomColor, topColor, cutoff);

    if (cutoff > texColor) {
        discard;
    }

    gl_FragColor = vec4(vec3(shaded), 1.0);
}
