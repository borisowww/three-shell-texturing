uniform sampler2D uTex;
uniform float density;
uniform float shellCount;
uniform float grassThickness;
uniform float bladeShape;
uniform float height;
uniform vec3 topColor;
uniform vec3 bottomColor;
uniform float jitterAmount;
uniform float minHeight;

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
    float n = texture2D(uTex, vUv).r;

    float opacity = 0.0;

    vec3 baseColor = vec3(0.5, 1.0, 0.0);
    float cutoff = normalize01(vInstanceID, 0.0, shellCount);

    vec3 shaded = mix(bottomColor, topColor, cutoff);

    if(vInstanceID == 1.0) {
        gl_FragColor = vec4(0.537, 0.318, 0.161, 1.0);
        return;
    }

    // Tile UVs
    vec2 newUV = vUv * density;
    vec2 cell = floor(newUV);

    vec2 offset = (randomOffset(cell)) * jitterAmount;

    vec2 local = fract(newUV);
    vec2 local_space = (local - 0.5) * 2.0;

    float localDistanceFromCenter = length(local_space - offset);

    float hNorm = vInstanceID / shellCount;

    float N = mix(minHeight, 1.0, n); // 0..1

    float bladeHeight = max(N, 0.001);  // avoid div by 0
    float hBlade = hNorm / bladeHeight;

    if (hBlade > 1.0) {
        discard;
    }

    float radiusProfile = grassThickness * pow(1.0 - hBlade, bladeShape);
    bool outsideThickness = localDistanceFromCenter > radiusProfile;

    if (!outsideThickness) {
        opacity = 1.0;
    }

    gl_FragColor = vec4(shaded, opacity);
}
