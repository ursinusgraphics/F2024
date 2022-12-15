precision highp float;

// PI is not included by default in GLSL
#define M_PI 3.1415926535897932384626433832795

// Uniforms set from Javascript that are constant
// over all fragments
uniform float uTime; // Time elapsed since beginning of simulation
uniform float uRadius; // Radius of blob

uniform int uMaxIterations; //max mandelbrot iterations 
uniform int uIteration; //current mandelbrot iteration

// The 2D position of the pixel in this fragment, interpolated via
// barycentric coordinates from positions of triangle vertices
varying vec2 v_position;
//varying float z;

//function to multiply 2 complex numbers
vec2 multcomplex(in vec2 c1, in vec2 c2) {
    //float x_new = (x1*x2) - (y1*y2);
    //float y_new = (x1*y2) + (x2*y1);
    float x_new = (c1.x*c2.x) - (c1.y*c2.y);
    float y_new = (c1.x*c2.y) + (c2.x*c1.y);
    vec2 z = vec2(x_new, y_new);
    return z;
}

float modulus(float a, float b) {
    return a - (b*floor(a/b));
}


void main() {
    //TODO: Fill this in.  The center should be blurry, and it should
    //move in an arc from the left of the screen to the right of the screen.
    //The red channel should be proportional to its height
    float r = 0.0;//0.5*(1.0+cos(2.0*uTime));
    float g = 0.0;

    float x1 = 0.0;
    float x2 = 0.0;
    //float y1 = 0.0;
    //float y2 = 0.0;
    //v_position.y
    //float in_set = 0.0;


    /*
    if (x>100.0 || x<0.0 || y>100.0 || y<0.0) {
        in_set=0.0;
    } else {
        for (int it=0; it<2; it++) {
            z = multcomplex(z,z);
            
            
            if(z[0]*z[0] + z[1]*z[1] >= 2.0) {
                in_set = 0.0;
            } else {
                in_set = 1.0;
            }
        }
    }
    */


    
    // |----------------------|
    // |  Mandelbrot fractal  |
    // |----------------------|
///*Comment this line when displaying Mandelbrot fractal (add two ADDITIONAL forward-slashes)*/ /*
    
    float x_pan = -1.40;//-1.7693831791955150182138472860854737829057472636547514374655282165278881912647564588361634463895296673044858257818203031;
    float y_pan = 0.0;//0.00423684791873677221492650717136799707668267091740375727945943565011234400080554515730243099502363650631353268335965257;
    float x = (v_position.x/((uTime*uTime)))+x_pan; //+0.1*uTime;
    float y = (v_position.y/((uTime*uTime)))+y_pan; //+(1.75/uTime);//+0.1*uTime;

    vec2 z = vec2(x, y);
    vec2 c = vec2(x, y);

    float in_set = 0.0;
    float iteration_escaped = -1.0;
    for (int it=0; it<800; it++) {
        z = multcomplex(z,z) + c;
        if(z[0]*z[0] + z[1]*z[1] > 2.0) {
            if(iteration_escaped < 0.0) {
                iteration_escaped = float(it)/800.0;//sin(mod(float(it),uTime));
            }
        }
        gl_FragColor = vec4(iteration_escaped, 0.0, 0.0, 1.0);
    }
  //*/ //Comment-out this line when using Mandelbrot fractal (add two ADDITIONAL forward-slashes)
    


    // |---------------------|
    // |   Rise and Shine:   |
    // |---------------------|
 /* //Uncomment this line when not using "Rise and Shine"
    float y = v_position.y;
    float x = v_position.x;
    float dR = 0.0;
    y = y-abs(1.0*sin(1.0*uTime));
    x -= 1.0-(2.0*abs((uTime/M_PI)-floor(uTime/M_PI)));
    float f = 0.0;
    if(sqrt(pow(x, 2.0) + pow(y, 2.0)) <= uRadius) {
        dR = sqrt(pow(x, 2.0) + pow(y, 2.0));
        g = exp((-pow(dR, 2.0)) / (pow(uRadius/2.0, 2.0)));
    }
    r = 1.00-cos(-2.0*uTime);
    gl_FragColor = vec4(r, g, 0.0, 1.0);

 */ //Uncomment this line when not using "Rise and Shine"

}
