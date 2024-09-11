var vec2 = glMatrix.vec2;

/**
 * Project vector u onto vector v using the glMatrix library
 * @param {vec2} u Vector that's being projected
 * @param {vec2} v Vector onto which u is projected
 * 
 * @return {vec2} The projection of u onto v
 */
function proj(u, v) {
	return vec2.scale(vec2.create(), v, (vec2.dot(u, v)/vec2.dot(v,v)));
}

/**
 * 
 * @param {vec2} u Vector that's being projected
 * @param {vec2} v Vector onto which u is perpendicularly projected
 * 
 * @return {vec2} The perpendicular projection of u onto v
 */
function projPerpVector(u, v) {
	let res = projVector(u, v);
	return vec2.subtract(res, u, res);
}


/**
 * Compute the ray that results from the reflection of the ray
 * p0 + t*v
 * with the line segment (a, b)
 * 
 * @param {vec2} p0 Endpoint of ray
 * @param {vec2} v Direction of ray
 * @param {vec2} a Left endpoint of line segment
 * @param {vec2} b Right endpoint of line segment
 */
function rayReflect(p0, v, a, b) {
    let reflected = {"p0":null, "v":null};

    let ab = vec2.sub(vec2.create(), b, a);
    let n = vec2.fromValues(ab[1], -ab[0]);
    let p0a = vec2.sub(vec2.create(), a, p0);
    let num = vec2.dot(p0a, n);
    let denom = vec2.dot(v, n);
    if (denom != 0) { // Check to make sure the ray isn't parallel
        let t = num/denom;
        let p = vec2.scaleAndAdd(vec2.create(), p0, v, t);
        if (t >= 0) { // Make sure the intersection is in front of the ray! (I forgot this in the video!)
            let abLen = vec2.length(ab);
            let apLen = vec2.length(vec2.sub(vec2.create(), p, a));
            let bpLen = vec2.length(vec2.sub(vec2.create(), p, b));
            if (apLen <= abLen && bpLen <= abLen) { // Make sure we're on the inside of ab
                reflected.p0 = p;
                let p0p = vec2.sub(vec2.create(), p, p0);
                vec2.normalize(n, n);
                let scale = vec2.dot(p0p, n);
                let proj = vec2.scale(vec2.create(), n, scale);
                reflected.v = vec2.scaleAndAdd(vec2.create(), p0p, proj, -2);
            }
        }

    }
    return reflected;
}
