precision highp float;


#define MAX_ITERS 100
#define MAX_DEGREE 10


uniform vec2 uCenter; 
uniform float uScale; 
uniform float uColorScale; 
uniform float uCoeffs[MAX_DEGREE+1]; 
uniform float uTime;


varying vec2 v_position;


vec2 zap(vec2 z, const int n) {
    vec2 zret = vec2(1.0, 1.0);

    float a = z[0];
    float b = z[1];

    float c;
    float d;

    for (int i = 0; i < MAX_DEGREE; i++) {
        if (i < n) {
            c = (a * zret[0]) - (b * zret[1]);
            d = (a * zret[1]) + (b * zret[0]);
            zret[0] = c;
            zret[1] = d;
        }    
    };

    return zret;
}

vec2 baz(vec2 z) {
    vec2 ret = vec2(0.0, 0.0);
    vec2 staging = vec2(0.0, 0.0);
    for (int i = 0; i <= MAX_DEGREE; i++) {
        staging = uCoeffs[i] * abs(2.5*cos(uTime)) * zap(z, i);
        ret += staging;
    };
    return ret;
}


vec2 bar(vec2 z) {
    vec2 zret = vec2(0.0, 0.0);

    vec2 staging = vec2(0.0, 0.0);
    for (int i = 1; i <= MAX_DEGREE; i++) {
        staging = uCoeffs[i] * float(i) * zap(z, i-1);
        zret += staging;
    }
    return zret;
}


vec2 yeet(vec2 v1, vec2 v2) {

    vec2 ret = vec2(0.0, 0.0);
    
    float a_num = (v1[0] * v2[0]) + (v1[1] * v2[1]);
    float b_num = (v1[1] * v2[0]) - (v1[0] * v2[1]);

    float denom = (v2[0] * v2[0]) + (v2[1] * v2[1]);

    ret[0] = a_num / denom;
    ret[1] = b_num / denom;
    return ret; 
}

vec2 rotate(vec2 z, float theta) {
    vec2 col1 = vec2(0.0, 0.0);
    col1[0] = cos(theta);
    col1[1] = sin(theta);

    vec2 col2 = vec2(0.0, 0.0);
    col2[0] = -sin(theta);
    col2[1] = cos(theta);

    mat2 rotation_matrix = mat2(col1, col2);

    return z*rotation_matrix;
}

void main() {
    vec2 z = uScale*v_position - uCenter; 

    z[0] = z[0];
    z[1] = z[1];

    z = rotate(z, uTime);


    vec2 num;
    vec2 denom;
    for (int i = 0; i < MAX_ITERS; i++) {
        num = baz(z);
        denom = bar(z);
        z = z - yeet(num, denom);
    }

    z[0] = z[0] * cos(uTime);
    z[1] = z[1] * sin(uTime);

    z = (z + 1.0)/2.0;
    gl_FragColor = vec4(1.0-z[0], z[1], 0.5*(z[0]+z[1]), 1.0);
}
