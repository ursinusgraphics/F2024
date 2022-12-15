precision highp float;

#define MAX_ITERS_FLOAT 100.0
#define MAX_ITERS 100
#define MAX_DEGREE 10
#define M_PI 3.1415926545

uniform float uColorScale; // Amount by which to scale color
uniform float uCoeffs[MAX_DEGREE+1]; // Coefficients of polynomial
uniform float uTime;
uniform vec2 uCenter; // Where the origin (0, 0) is on the canvas
uniform vec2 uC; // z -> z^2 + uC
uniform float uScale; // Scale of fractal
varying vec2 v_position;
uniform float uEscape; // Escape distance
uniform vec3 uPows;

// The maximum number of iterations before escape should be
// included here (You can change this)


/*
// Uniforms set from Javascript that are constant
// over all fragments
uniform vec2 uCenter; // Where the origin (0, 0) is on the canvas
uniform vec2 uC; // z -> z^2 + uC
uniform float uScale; // Scale of fractal
uniform float uEscape; // Escape distance
uniform vec3 uPows; /* Final color will be R = uPows.x^(-count/MAX_ITERS)
                    *                      G = uPows.y^(-count/MAX_ITERS)
                    *                      B = uPows.z^(-count/MAX_ITERS) /

// The 2D position of the pixel in this fragment, interpolated via
// barycentric coordinates from positions of triangle vertices
varying vec2 v_position;

vec2 complexMultiply(vec2 x, vec2 y){
    vec2 res = vec2(0.0, 0.0);
    float a = x[0];
    float b = x[1];
    float c = y[0];
    float d = y[1];

    res[0] = a*c - b*d;
    res[1] = a*d + c*b;

    return res;
}

void main() {
    vec2 z = uScale*v_position - uCenter;
    //TODO: Fill this in
    float zN_mag = dot(z, z);
    float uEscape_sqr = uEscape*uEscape;
    if(zN_mag > uEscape_sqr){
        gl_FragColor = vec4(pow(uPows.x, -0.0/MAX_ITERS), pow(uPows.y, -0.0/MAX_ITERS), pow(uPows.z, -0.0/MAX_ITERS), 1);
        return;
    }
    vec2 zN = complexMultiply(z, z) + uC;
    zN_mag = dot(zN, zN);
    float iters = 1.0;
    for(float i = 0.0; i < MAX_ITERS; i++){
        if(zN_mag > uEscape_sqr){
            break;
        }
        zN = complexMultiply(zN, zN) + uC;
        zN_mag = dot(zN, zN);

        iters += 1.0;
    }

    float R = pow(uPows.x, -iters/MAX_ITERS);
    float G = pow(uPows.y, -iters/MAX_ITERS);
    float B = pow(uPows.z, -iters/MAX_ITERS);

    gl_FragColor = vec4(R, G, B, 1);
}
*/



vec2 complexMultiply(vec2 x, vec2 y){
    vec2 res = vec2(0.0, 0.0);
    float a = x[0];
    float b = x[1];
    float c = y[0];
    float d = y[1];

    res[0] = a*c - b*d;
    res[1] = a*d + c*b;

    return res;
}
vec2 pow(vec2 z, int n) {
    vec2 zret = vec2(0.0, 0.0);
    if(n < 2){
        return z;
    }
    zret[0] += z[0]*z[0] - (z[1]*z[1]);
    zret[1] += 2.0*z[0]*z[1];
    
    for(int i = 3; i <= MAX_DEGREE; i++){
        if(i > n){
            break;
        }
        vec2 temp = vec2(0.0, 0.0);
        temp[0] = zret[0]*z[0] - zret[1]*z[1];
        temp[1] = zret[0]*z[1] + zret[1]*z[0];
        zret = temp;
    }


    // TODO: Fill this in
    return zret;
}
//(a+ib)N=rN(cos(Nθ)+isin(Nθ)).

/*
 * Evaluate the complex polynomial at z, based on 
 * the coefficients in uCoeffs
 * That is, you should have uCoeffs[0] + uCoeffs[1]*z + uCoeffs[2]*z^2 + ...
 * @param z The complex number to evaluate
*/
vec2 polynomial(vec2 z) {
    vec2 ret = vec2(0.0, 0.0);
    // TODO: Fill this in with the help of pow()
    for(int i = 0; i <= MAX_DEGREE; i++){
        if(i < 2){
            if(i == 0){
                ret += uCoeffs[i];
            }
            else{
                ret += uCoeffs[i]*z;
            }
        }
        else{
            ret += uCoeffs[i]*pow(z, i);
        }
    }


    return ret;
}

/*
 * Evaluate the derivative complex polynomial at z, based on 
 * the coefficients in uCoeffs, using the power rule
 * That is, you should have uCoeffs[1] + uCoeffs[2]*2z + uCoeffs[3]*3z^2 + ...
 * @param z The complex number to evaluate
*/
vec2 polynomialDeriv(vec2 z) {
    vec2 zret = vec2(0.0, 0.0);
    // TODO: Fill this in with the help of pow
    for(int i = 1; i <= MAX_DEGREE; i++){
        if(i < 3){
            if(i == 1){
                zret += uCoeffs[i];
            }
            else{
                zret += uCoeffs[i]*float(i)*z;
            }
        }
        else{
            zret += uCoeffs[i]*pow(z, i-1)*float(i);
        }
    }
    return zret;
}

/*
 * Perform the complex-number division between two numbers
 * @param z1 The numerator
 * @param z2 The denominator
 */
vec2 complexDiv(vec2 v1, vec2 v2) {
    // TODO: Fill this in
    // See https://mathworld.wolfram.com/ComplexDivision.html
    vec2 res = vec2(0.0, 0.0);
    res[0] = (v1[0]*v2[0] + v1[1]*v2[1]) / (v2[0]*v2[0] + v2[1]*v2[1]);
    res[1] = (v1[1]*v2[0] - v1[0]*v2[1]) / (v2[0]*v2[0] + v2[1]*v2[1]);

    return res; // This is a dummy value
}

void main() {
    vec2 z = uScale*v_position - uCenter; // Initial starting point


    vec2 z2 = z;
    // TODO: Fill this in and apply Newton's method in a loop
    // up to MAX_ITERS iterations to iteratively update z,
    // making use of the methods polynomial, polynomialDeriv, and complexDiv

    for(int i = 0; i < MAX_ITERS; i++){
        z2 = z2 - complexDiv(polynomial(z2), cos(sin(uTime))*polynomialDeriv(z2));
    }

    z2 = (z2 + 1.0)/2.0;


    float uEscape_sqr = (cos(uTime/2.0)*cos(uTime/2.0))*10.0;
    vec2 zN = complexMultiply(z, z) + cos(uC + uTime);
    float zN_mag = dot(zN, zN);
    float iters = 1.0;
    for(float i = 0.0; i < MAX_ITERS_FLOAT; i++){
        if(zN_mag > uEscape_sqr){
            break;
        }
        zN = complexMultiply(zN, zN) + cos(atan(uC + uTime));
        zN_mag = dot(zN, zN);

        iters += 1.0;
    }

    float R = (iters*z2[0])/MAX_ITERS_FLOAT;// + z2[0]*0.25; // pow(uPows.x, -iters/MAX_ITERS_FLOAT);
    float G = (z2[1] *iters)/MAX_ITERS_FLOAT;// + z2[1] * 0.25; // pow(uPows.y, -iters/MAX_ITERS_FLOAT);
    float B = (0.5*(z2[0]+z2[1])*iters)/MAX_ITERS_FLOAT;// + 0.25*0.5*(z2[0]+z2[1]);// // pow(uPows.z, -iters/MAX_ITERS_FLOAT);

//z[0], z[1], 0.5*(z[0]+z[1])
    //TODO: Fill this in
    gl_FragColor = vec4(5.0*R, 0.5*G, 0.5*B, 1);
}