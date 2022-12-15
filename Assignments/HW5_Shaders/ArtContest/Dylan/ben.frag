precision highp float;

#define MAX_ITERS 100
#define MAX_DEGREE 10

uniform vec2 uCenter; 
uniform float uScale;
uniform float uColorScale; 
uniform float uCoeffs[MAX_DEGREE+1]; // Coefficients of polynomial

// The 2D position of the pixel in this fragment, interpolated via
// barycentric coordinates from positions of triangle vertices
varying vec2 v_position;

/*
 * Raise a complex number z to a power, clamping at MAX_DEGREE
 * @param z Complex number to which to raise to a power
 * @param n Power to which to raise
 */
vec2 pow(vec2 z, int n) {
    vec2 zret = vec2(1.0, 1.0);
for(int k=0;k<=MAX_DEGREE;k++){
    if(k>=n){
        break;
    }
    float x1=z[0];
    float y1=z[1];
    float x2=zret[0];
    float y2=zret[1];
    zret=vec2(x1*x2-y1*y2,x1*y2+x2*y1);
}
    // TODO: Fill this in
    return zret;
}

/*
 * Evaluate the complex polynomial at z, based on 
 * the coefficients in uCoeffs
 * That is, you should have uCoeffs[0] + uCoeffs[1]*z + uCoeffs[2]*z^2 + ...
 * @param z The complex number to evaluate
*/
vec2 polynomial(vec2 z) {
    vec2 ret = vec2(0.0, 0.0);
    // TODO: Fill this in with the help of pow()
    for(int k=0;k<=MAX_DEGREE;k++){
        ret+=uCoeffs[k]*pow(z,k);
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
    float count=1.0;
    for(int k=1;k<=MAX_DEGREE;k++){
        zret+=uCoeffs[k]*count*pow(z,k-1);
        count+=1.0;
    }
    return zret;
}

/*
 * Perform the complex-number division between two numbers
 * @param v1 The numerator
 * @param v2 The denominator
 */
vec2 complexDiv(vec2 v1, vec2 v2) {
    // TODO: Fill this in
    // See https://mathworld.wolfram.com/ComplexDivision.html
    float a=v1[0];
    float b=v1[1];
    float c=v2[0];
    float d=v2[1];
    float x=(a*c+b*d)/(c*c+d*d);
    float y=(b*c-a*d)/(c*c+d*d);
    return vec2(x, y); // This is a dummy value
}

void main() {
    vec2 z = uScale*v_position - uCenter; // Initial starting point
    
    // TODO: Fill this in and apply Newton's method in a loop
    // up to MAX_ITERS iterations to iteratively update z,
    // making use of the methods polynomial, polynomialDeriv, and complexDiv

    for(int k=0;k<MAX_ITERS;k++){
        z=z-complexDiv(polynomial(z),polynomialDeriv(z));
    }


    z = (z + 1.0)/2.0;
    gl_FragColor = vec4(z[0], z[1], 0.5*(z[0]+z[1]), 1.0);
}
