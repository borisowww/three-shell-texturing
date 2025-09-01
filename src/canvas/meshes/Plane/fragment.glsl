// fragment.glsl
uniform sampler2D uTex;
uniform float cutoff;
uniform float density;
uniform float shellIndex;
uniform float shellCount;
uniform float grassThickness;
uniform float maxThickness;

varying vec2 vUv;
varying vec3 vNormal;
uniform vec3 uLightDir;
float noiseMin = 2.0f;
float noiseMax = 5.0;
float thickness = 1.0f;


float hash(float n) {
    return fract(sin(n) * 43758.5453);
}

void main() {

    float n = texture2D(uTex, vUv).r;

    float opacity = 0.0;

    vec3 N = normalize(vNormal);
    vec3 L = normalize(uLightDir);
    float diff = max(dot(N, L), 0.0);

    vec3 baseColor = vec3(0.5, 1.0, 0.0);

    vec3 shaded = baseColor * cutoff;

    if(shellIndex == 1.0) {
        gl_FragColor = vec4(0.537,0.318,0.161, 1.0);
        return;
    }

    vec2 newUV = vUv * density;
    vec2 local_space = fract(newUV);
    local_space = local_space * vec2(2.0, 2.0) - vec2(1.0, 1.0);


    float h = shellIndex / shellCount;
    float seed = newUV.x + 100.0 * newUV.y + 100.0 * 10.0;
    float rand = mix(noiseMin, noiseMax, hash(seed));

    float localDistanceFromCenter = length(local_space);
    bool outSideThickness = (localDistanceFromCenter)  > (maxThickness * (grassThickness - h));

    if (n > cutoff && !outSideThickness) {
        opacity = 1.0;
    }

//    gl_FragColor = vec4(rand, 1.0, 1.0, 1.0);
    gl_FragColor = vec4(shaded, opacity);
//    gl_FragColor = vec4(n, n, n, 1.0)
}