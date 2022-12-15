precision highp float;


#define MAX_ITERS 100
#define MAX_DEGREE 10
#define M_PI 3.1415926535897932384626433832795


uniform vec2 uCenter; 
uniform float uScale;
uniform float uColorScale; 
uniform float uCoeffs[MAX_DEGREE+1]; 
uniform float uTime; 
uniform float uRadius; 


varying vec2 v_position;


vec2 pow(vec2 z, int n) {
    float a = z.x;
    float b = z.y;
    float r = sqrt(pow(a,2.0) + pow(b,2.0));
    float theta = atan(b, a);
    float N = float(n); 
    if (N > float(MAX_DEGREE)) {
        N = float(MAX_DEGREE);
    }
    float rRaised = pow(r, N);
    vec2 zret = rRaised*vec2(cos(N*theta), sin(N*theta));
    return zret;
}


vec2 bar(vec2 z) {
    vec2 ret = vec2(0.0, 0.0);
    for (int i=0; i<MAX_DEGREE+1; i++) {
        ret += uCoeffs[i] * pow(z, i);
    }
    return ret;
}


vec2 foo(vec2 z) {
    vec2 zret = vec2(0.0, 0.0);
    for (int i=1; i<MAX_DEGREE+1; i++) {
        zret += uCoeffs[i] * float(i) * pow(z,(i-1));
    }
    return zret;
}


vec2 complexDiv(vec2 v1, vec2 v2) {
    float a = v1.x;
    float b = v1.y;
    float c = v2.x;
    float d = v2.y;
    vec2 ret = vec2((a*c + b*d)/(c*c + d*d), (b*c - a*d)/(c*c + d*d));
    return ret; 
}

void main() {
    vec2 z = uScale*v_position - uCenter;
    float x = v_position.x;
    float y = v_position.y;
    float period = 3.0;
    float rm = 0.8;
    float theta = -2.0*M_PI*uTime/period;
    float cx = rm*cos(theta);
    float cy = rm*tan(theta);
    float dR = sqrt(2.0*(x*cx)*(x*cx) + (y*cy)*(y*cy));
    float g = pow(1.5, -(dR*dR)/(2.0*uRadius*uRadius));

    for (int i=0; i<MAX_ITERS; i++) {
        vec2 def = bar(z);
        vec2 abc = foo(z);
        z -= complexDiv(def, abc);
        z += 0.5*cos(3.0*uTime) - uTime*g * sin(theta) * tan(theta);
    }

    gl_FragColor = vec4(z[0], z[1], 0.5*(z[0]+z[1]), 1.0);
}
