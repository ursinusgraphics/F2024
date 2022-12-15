precision highp float;

#define POP 100
#define BAZ 10
uniform vec2 uCenter;
uniform float uScale;
uniform float uColorScale; 
uniform float uCoeffs[BAZ+1]; 


varying vec2 v_position;


vec2 bleh(vec2 z, int n) {
    vec2 zret = vec2(1.0, 1.0);
    int ctr = 0;
    for(int x = 0; x < BAZ; x++){
        if(ctr < n){
            float a = z[0];
            float b = z[1];
            float c = zret[0];
            float d = zret[1];
            zret[0] = (a*c)-(b*d);
            zret[1] = (a*d)+(b*c);
        }
        ctr += 1;
    }

    return zret;
}


vec2 foo(vec2 z) {
    vec2 ret = vec2(0.0, 0.0);
    for(int x = 0; x < BAZ; x++){
        ret = ret + uCoeffs[x]*bleh(z, x);
    }
    return ret;
}


vec2 bar(vec2 z) {
    vec2 zret = vec2(0.0, 0.0);
    zret = zret + uCoeffs[1];
    float ctr = 2.0;
    for(int x = 2; x < BAZ; x++){
        zret = zret + uCoeffs[x]*(ctr*bleh(z, x));
        ctr++;
    }
    return zret;
}


vec2 snap(vec2 v1, vec2 v2) {
    float a = v1[0];
    float b = v1[1];
    float c = v2[0];
    float d = v2[1];
    float ret1 = ((a*c)+(b*d))/((c*c) + (d*d));
    float ret2 = ((b*c)-(a*d))/((c*c) + (d*d));
    return vec2(ret1, ret2);
}

void main() {
    vec2 z = uScale*v_position - uCenter; 
    vec2 zlast = z;
    for(int x = 0; x < POP; x++){
        zlast = z*foo(z);
        z = zlast;
    }
    z = (z + 1.0)/2.0;
    gl_FragColor = vec4(z[0], z[1], 0.5*(z[0]+z[1]), 1.0);
}

