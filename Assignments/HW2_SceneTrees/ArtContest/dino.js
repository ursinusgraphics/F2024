function download(content, fileName, contentType) {
    var a = document.createElement("a");
    var file = new Blob([content], { type: contentType });
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
}

/**
 * Extracts the elements of a mat4 object into an array
 * in row-major order
 * @param {glMatrix.mat4} M Input matrix
 * @returns list of elements in row-major order
 */
function getMat4Array(M) {
    let ret = []
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            ret.push(M[j * 4 + i]);
        }
    }
    return ret;
}


function makeDinoScene() {
    let scene = JSON.parse(`{
        "lights":[
            {
                "pos":[0, 200, 0],
                "color":[1, 1, 1]
            },
            {
                "pos":[-5, 2, -10],
                "color":[1, 1, 1]
            },
            {
                "pos":[5, 2, 10],
                "color":[1, 1, 1]
            }
        ],

        "cameras":[
            {}, {}, {}
        ],

        "name":"dinos",
        "materials":{
            "red":{
                "kd":[1.0, 0, 0.2]
            }
        },
        "children":[
            {
                "transform":[1, 0, 0, 0,
                             0, 0, 1, 0,
                             0, -1, 0, 0,
                             0, 0, 0, 1],
                "shapes":[
                    {
                        "type":"mesh",
                        "filename":"../meshes/dinopet.off"
                    }
                ]
            }
        ]
    }`);

    // TODO: Fill this in.  Add at least 20 dinos to the scene in a loop

    for (let i = 0; i <= 19; i += 1) {
        let radians = 2 * Math.PI * (i/19);
        let x = 10 * Math.cos(radians);
        let z = 10 * Math.sin(radians);
        let newdino = {
                "transform": [Math.cos(radians), 0, -Math.sin(radians), x,
                              0, 1, 0, 0,
                              Math.sin(radians), 0, Math.cos(radians), z,
                              0, 0, 0, 1], 
                "children":[
                    {
                      "transform": 
                                    [1, 0, 0, 0,
                                     0, 0, 1, 0,
                                     0, -1, 0, 0,
                                     0, 0, 0, 1],
                        "shapes": [
                            {
                             "type": "mesh",
                             "filename": "../meshes/dinopet.off"
                            }
                        ]
                    }
                ]
            };

        scene.children.push(newdino);

    }
    let s = JSON.stringify(scene, null, 4);
    document.getElementById("dinoCode").innerHTML = s;
    //download(s, "dinos.json", "text/javascript");
}
