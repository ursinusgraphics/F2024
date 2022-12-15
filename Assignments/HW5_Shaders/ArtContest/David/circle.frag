precision mediump float;

// PI is not included by default in GLSL
#define M_PI 3.1415926535897932384626433832795

// Uniforms set from Javascript that are constant
// over all fragments
uniform float uTime; // Time elapsed since beginning of simulation
uniform float uRadius; // Radius of blob

// The 2D position of the pixel in this fragment, interpolated via
// barycentric coordinates from positions of triangle vertices
varying vec2 v_position;

void main() {
    //TODO: Fill this in.  The center should be blurry, and it should
    //move in an arc from the left of the screen to the right of the screen.
    //The red channel should be proportional to its height
    float r = 0.0;
    float g = 0.0;

    float x = v_position.x;
    float y = v_position.y;

    float cx = 0.0;
    float cy = 0.0; 

    float period = 6.0;
    float rm = 0.75;

    float theta = -2.0*M_PI*uTime/period;

    cx = rm*sin(theta)*sin(theta);
    cy = abs(rm*sin(theta));


    float num = ((x-cx)*(x-cx)) + ((y-cy)*(y-cy));
    float denom = uRadius*uRadius;

    g = exp(-num/denom);

    //you will need to set a variable that's equal to the remainder of the uniform time divided by PI
    r = abs(sin(uTime));
    
    gl_FragColor = vec4(r, g, 0.0, 1.0); // r g b trans






    float r1 = 0.0;
    float g1 = 0.0;

    float x1 = v_position.x;
    float y1 = v_position.y;

    float cx1 = 0.0;
    float cy1 = 0.0; 

    float period1 = 6.0;
    float rm1 = 0.75;

    float theta1 = -2.0*M_PI*uTime/period1;

    cx1 = -rm1*sin(theta1)*sin(theta1);
    cy1 = abs(rm1*cos(theta1));


    float num1 = ((x1-cx1)*(x1-cx1)) + ((y1-cy1)*(y1-cy1));
    float denom1 = uRadius*uRadius;

    g1 = exp(-num1/denom1) + g;




    gl_FragColor = vec4(r, g1, 0.0, 1.0); // r g b trans


   /*
   

    float r2 = 0.0;
    float g2 = 0.0;

    float x2 = v_position.x;
    float y2 = v_position.y;

    float cx2 = 0.0;
    float cy2 = 0.0; 

    float period2 = 6.0;
    float rm2 = 0.75;

    float theta2 = -2.0*M_PI*uTime/period2;

    cx2 = -rm2*cos(theta2)*cos(theta2);
    cy2 = abs(rm2*cos(theta2));


    float num2 = ((x2-cx2)*(x2-cx2)) + ((y2-cy2)*(y2-cy2));
    float denom2 = uRadius*uRadius;

    g2 = exp(-num2/denom2) + g2;




    gl_FragColor = vec4(r, g2, 0.0, 1.0); // r g b trans


*/


}
