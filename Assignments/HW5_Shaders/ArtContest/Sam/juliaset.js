/**
 * Split a complex number string into an array of 2 elements
 * @param {String} s "a + bi"
 */
function splitComplexStr(s) {
    ret = [];
    s.split("+").forEach(function(x) {
        if (x.charAt(x.length-1) == "i") {
            x = x.substring(x.length-1);
        }
        ret.push(parseFloat(x));
    });
    return ret;
}

/**
 * Convert a vec2 to a complex string
 * @param {glMatrix.vec2} v Vector
 * @param {int} k Decimal precision
 */
function complexToStr(v, k) {
    if (k === undefined) {
        k = 2;
    }
    s = "";
    for (let i = 0; i < 2; i++) {
        s += v[i].toFixed(k);
        if (i < v.length-1) {
            s += " + ";
        }
        else if (i == 1) {
            s += "i";
        }
    }
    return s;
}

const MAX_DEGREE = 10;

/**
 * Split a polynomial into its constituent elements
 * to figure out what the coefficients are, capping at
 * the maximum coefficient
 * @param {String} s "a + bi"
 */
function splitPolynomialStr(s) {
    terms = {};
    let s2 = s.replace(/x/g, 'z');
    s2 = s2.replace(/\s/g, '');
    s2 = s2.replace(/\+-/g, '-');
    s2 = s2.replace(/-/g, '+-');
    s2 = s2.replace(/-z/g, '-1z');
    if (s2.charAt(0) == "+") {
        s2 = s2.substring(1);
    }
    s2.split("+").forEach(function(z) {
        let power = 0;
        let idx = z.indexOf("z");
        if (idx > -1) {
            if (z.charAt(idx+1) == "^") {
                let powstr = z.substring(idx+2);
                power = parseInt(powstr);
            }
            else {
                power = 1;
            }
            z = z.substring(0, idx);
        }
        let coeff = parseFloat(z);
        if (Number.isNaN(coeff)) {
            coeff = 1;
        }
        if (power > MAX_DEGREE) {
            alert("Max degree of polynomial is " + MAX_DEGREE);
        }
        if (power in terms) {
            terms[power] += coeff;
        }
        else {
            terms[power] = coeff;
        }
    });
    let ret = [];
    for (let i = 0; i <= MAX_DEGREE; i++) {
        ret.push(0);
        if (i in terms) {
            ret[i] = terms[i]; 
        }
    }
    return ret;
}

/**
 * Convert a polynomial to its string representation
 * @param {list} p List of length MAX_DEGREE + 1
 */
function polynomialToString(p) {
    let s = "";
    for (let i = MAX_DEGREE; i >= 0; i--) {
        if (Math.abs(p[i]) > 0) {
            if (s.length > 0) {
                if (p[i] < 0) {
                    s += "-";
                }
                else {
                    s += "+";
                }
            }
            else if (p[i] < 0) {
                s = "-";
            }
            if (Math.abs(p[i]) != 1) {
                s += Math.abs(p[i]);
            }
            if (i > 0) {
                s += "z";
                if (i > 1) {
                    s += "^" + i;
                }
            }
        }
    }
    let lastChar = s.charAt(s.length-1);
    if (lastChar == '+' || lastChar == '-') {
        s += "1";
    }
    return s;
}

/**
 * Get a magnitude bound of the roots in a polynomial
 * https://en.m.wikipedia.org/wiki/Geometrical_properties_of_polynomial_roots
 * @param {list} p List of length MAX_DEGREE + 1
 */
function getMagnitudeBound(p) {
    let cauchy = 0;
    let lagrange = 0;
    let n = MAX_DEGREE;
    while (p[n] == 0 && n > 0) {
        n--;
    }
    if (n == 0) {
        return 1;
    }
    for (let i = 0; i < n; i++) {
        let ratio = Math.abs(p[i]/p[n]);
        cauchy += ratio;
        if (ratio > lagrange) {
            lagrange = ratio;
        }
    }
    cauchy = Math.max(1, cauchy);
    let ret = Math.min(lagrange, cauchy);
    if (ret == 0) {
        ret = 1;
    }
    return ret;
}

/**
 * A class for storing the shader program and buffers for rendering
 * the Julia Set fractal
 */
class JuliaSetShader extends ShaderProgram {

    clickerDragged(evt) {
        this.clickerDraggedCenterScale(evt);
    }

    /**
     * Asynchronously load the vertex and fragment shaders
     */
    loadShader() {
        this.initialTime = new Date();
        let gl = this.glcanvas.gl;
        let juliaShader = getShaderProgramAsync(gl, "juliaset");
        let shaderObj = this;
        juliaShader.then(function(shader) {
            // Extract uniforms and store them in the shader object
            shader.uCenterUniform = gl.getUniformLocation(shader, "uCenter");
            shader.uCUniform = gl.getUniformLocation(shader, "uC");
            shader.uScaleUniform = gl.getUniformLocation(shader, "uScale");
            shader.uColorScaleUniform = gl.getUniformLocation(shader, "uColorScale");
            shader.uCoeffsUniform = [];
            for (let i = 0; i <= MAX_DEGREE; i++) {
                shader.uCoeffsUniform.push(gl.getUniformLocation(shader, "uCoeffs["+i+"]"));
            }
            shader.uEscapeUniform = gl.getUniformLocation(shader, "uEscape");
            shader.uPowsUniform = gl.getUniformLocation(shader, "uPows");
            shader.uTimeUniform = gl.getUniformLocation(shader, "uTime");
            // Extract the position buffer and store it in the shader object
            shader.positionLocation = gl.getAttribLocation(shader, "a_position");
            gl.enableVertexAttribArray(shader.positionLocation);
            shaderObj.shader = shader;
            shaderObj.setupBuffers();
        });
    }

    setupBuffers() {
        let buffers = {};
        // Setup position buffers to hold a square
        buffers.positions = new Float32Array([-1.0,  1.0,
                                            1.0,  1.0,
                                            -1.0, -1.0,
                                            1.0, -1.0]);
        // We don't need a color buffer since colors will be determined
        // in the shader

        // Setup 2 triangles connecting the vertices so that there
        // are solid shaded regions
        buffers.indices = new Uint16Array([0, 1, 2, 1, 2, 3]);
        
        super.setupBuffers(buffers);
        this.setupMenu();
        this.setupMouseHandlers();

        // Setup animation variables
        this.render();
    }


    /**
     * Setup uniforms that will change based on mouse interaction
     * and inputs
     */
    setupMenu() {
        this.CVec = glMatrix.vec2.fromValues(-1, 0);
        this.C = complexToStr(this.CVec);
        this.scale = 1;
        this.escape = 2.0;
        this.centervec = glMatrix.vec2.fromValues(0, 0);
        this.powsvec = glMatrix.vec3.fromValues(500, 1000, 100);
        let menu = new dat.GUI();
        this.menu = menu;
        this.center = vecToStr(this.centervec);
        this.powR = this.powsvec[0];
        this.powG = this.powsvec[1];
        this.powB = this.powsvec[2];
        let shaderObj = this;
        menu.add(this, 'C').listen().onChange(
            function(value) {
                shaderObj.CVec = splitComplexStr(value);
                requestAnimationFrame(shaderObj.render.bind(shaderObj));
            }
        );
        menu.add(this, 'escape').onChange(this.render.bind(this));
        menu.add(this, 'scale').onChange(this.render.bind(this)).listen();
        menu.add(this, 'center').listen().onChange(
            function(value) {
                let xy = splitVecStr(value);
                for (let k = 0; k < 2; k++) {
                    shaderObj.centervec[k] = xy[k];
                }
                requestAnimationFrame(shaderObj.render.bind(shaderObj));
            }
        );
        menu.add(this, 'powR').onChange(
            function(value) {
                shaderObj.powsvec[0] = parseFloat(value);
                requestAnimationFrame(shaderObj.render.bind(shaderObj));
            }
        );
        menu.add(this, 'powG').onChange(
            function(value) {
                shaderObj.powsvec[0] = parseFloat(value);
                requestAnimationFrame(shaderObj.render.bind(shaderObj));
            }
        );
        menu.add(this, 'powB').onChange(
            function(value) {
                shaderObj.powsvec[0] = parseFloat(value);
                requestAnimationFrame(shaderObj.render.bind(shaderObj));
            }
        );
        this.polynomial = "z^3-1";
        this.polycoeffs = splitPolynomialStr(this.polynomial);
        this.colorScale = getMagnitudeBound(this.polycoeffs);
        menu.add(this, 'polynomial').listen().onChange(
            function(s) {
                shaderObj.polycoeffs = splitPolynomialStr(s);
                shaderObj.polynomial = polynomialToString(shaderObj.polycoeffs);
                shaderObj.center = "0,0";
                shaderObj.centervec[0] = 0;
                shaderObj.centervec[1] = 0;
                shaderObj.scale = getMagnitudeBound(shaderObj.polycoeffs);
                shaderObj.colorScale = shaderObj.scale;
                requestAnimationFrame(shaderObj.render.bind(shaderObj));
            }
        );
    }

    /**
     * Draw using WebGL
     */
    render() {
        let gl = this.glcanvas.gl;
        let shader = this.shader;
        gl.useProgram(shader);
        // Step 1: Setup uniform variables that are sent to the shaders
        let time = (new Date()-this.initialTime)/1000.0;
        gl.uniform1f(shader.uTimeUniform, time);
        gl.uniform2fv(shader.uCenterUniform, this.centervec);
        gl.uniform2fv(shader.uCUniform, this.CVec);
        gl.uniform1f(shader.uScaleUniform, this.scale);
        gl.uniform1f(shader.uColorScaleUniform, this.colorScale);
        for (let i = 0; i <= MAX_DEGREE; i++) {
            gl.uniform1f(shader.uCoeffsUniform[i], this.polycoeffs[i]);
        }
        gl.uniform1f(shader.uEscapeUniform, this.escape);
        gl.uniform3fv(shader.uPowsUniform, this.powsvec);

        // Step 2: Bind vertex and index buffers to draw two triangles
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        gl.vertexAttribPointer(shader.positionLocation, 2, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        gl.drawElements(gl.TRIANGLES, this.indexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
        requestAnimationFrame(this.render.bind(this));
    }
    
}

