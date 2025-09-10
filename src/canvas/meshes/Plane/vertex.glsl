uniform float height;
uniform float uShellIndex;
uniform float shellCount;
uniform float uTime;

uniform float windFreq;
uniform float windSpeed;
uniform float windAmp;
uniform float windPhase;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vWorldPos;

out float vInstanceID;

void main() {
    vUv = uv;
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vec3 pos = position;
    vWorldPos = worldPos.xyz;
    vNormal = normalize(normalMatrix * normal);
    vInstanceID = float(gl_InstanceID);
    float sliceHeight = height / shellCount;

    // Displace layers along the normal.
    vec3 displaced = position + normal * (sliceHeight * float(gl_InstanceID));

    // Wind
    float phase = vInstanceID * windPhase;
    float wave = sin(displaced.x * windFreq + uTime * windSpeed + phase) * windAmp;

    // Add the sin wave wind on top of the vertex position of each layer.
    displaced.x += wave;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
}