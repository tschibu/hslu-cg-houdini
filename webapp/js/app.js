//Global variables
var moveSpeed = 1;
var rotationSpeed = 0.02;
var maxSliderValue = 15;
var moveForward = false;
var moveBackward = false;
var moveLeft = false;
var moveRight = false;
var moveUp = false;
var moveDown = false;
var rotLeft = false;
var rotRight = false;
var rotUp = false;
var rotDown = false;
var velocityMove = new THREE.Vector3();
var velocityRot = new THREE.Vector3();
var prevTime = performance.now();

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

var content = document.getElementById("content");
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, content.innerWidth / content.innerHeight, 0.1, 1000);
var ambientLight = new THREE.AmbientLight(0xcccccc, 0.4);
var pointLight = new THREE.PointLight(0xffffff, 0.8);
var renderer = new THREE.WebGLRenderer();

var size = 1000;
var divisions = 100;
var helperGrid = new THREE.GridHelper(size, divisions);

//scene
createScene();

//camera
camera.add(pointLight);
camera.position.x = 0;
camera.position.y = 18;
camera.position.z = 84;

//renderer
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(content.innerWidth, content.innerHeight);
content.appendChild(renderer.domElement);

/*******************************************************************/
//Start doing work...
/*******************************************************************/

//event listeners
//document  .addEventListener('mousemove', onDocumentMouseMove, false);
window.addEventListener('resize', onWindowResize, false);
window.addEventListener('keydown', onKeyDown, false);
window.addEventListener('keyup', onKeyUp, false);
document.getElementById("moveSpeed").oninput = function () {
    //input range: 0 - 15 -> maxSliderValue
    moveSpeed = this.value;
}
document.getElementById("rotationSpeed").oninput = function () {
    //input range: 0 - 15 -> maxSliderValue
    rotationSpeed = this.value;
}

//load config and create obj selection
loadJson('/config.json', createObjSelection);

animate();

//-----------------------------------------------------------------
// Functions

function animate() {
    requestAnimationFrame(animate);
    render();
    updateData();
}

function render() {
    renderer.render(scene, camera);
    THREE.Utils.cameraLookDir(camera);
    moveCamera();
}

function updateData() {
    //Camera
    document.getElementById("posX").innerText = "Pos X: " + toFixed(camera.position.x);
    document.getElementById("posY").innerText = "Pos Y: " + toFixed(camera.position.y);
    document.getElementById("posZ").innerText = "Pos Z: " + toFixed(camera.position.z);
    document.getElementById("rotX").innerText = "Rot X: " + toFixed(camera.rotation.x);
    document.getElementById("rotY").innerText = "Rot Y: " + toFixed(camera.rotation.y);
    document.getElementById("rotZ").innerText = "Rot Z: " + toFixed(camera.rotation.z);
}

function createScene() {
    //create scene
    scene = new THREE.Scene();

    scene.add(ambientLight);
    scene.add(camera);

    //add helper grid
    scene.add(helperGrid);
}

function createObjSelection(config) {
    console.log(config.objs);
    let h6 = document.createElement("h5");
    h6.innerText = "Select *.obj File:";
    let slct = document.createElement("select");
    slct.disabled = false;
    slct.onchange = selectObj;
    config.objs.forEach(obj => {
        console.log(obj);
        let option = document.createElement("option");
        option.value = obj.path;
        option.text = obj.name;
        slct.options.add(option);
    });
    let objslct = document.getElementById("objselection")
    objslct.append(h6);
    objslct.append(slct);
    openObj(slct.options[0].value);
    onWindowResize();
    render();
}

function selectObj(event) {
    openObj(event.target.value);
}

function openObj(objPath) {
    console.log("Opening Obj -> " + objPath);

    var loader = new THREE.OBJLoader();
    loader.load(
        objPath,
        function (object) {
            console.log("Add object to Scene:");
            console.log(object);
            createScene();
            scene.add(object);
        },
        function (xhr) {
            console.log((xhr.loaded / xhr.total * 100) + '% loaded');
        },
        function (error) {
            console.error(error);
        }
    );
}

function onWindowResize() {
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
}

function moveCamera() {
    var time = performance.now();
    var delta = ( time - prevTime ) / 1000;

    speedInit = (30 / maxSliderValue) * moveSpeed;
    speed = (4500.0 / maxSliderValue) * moveSpeed;

    velocityMove.x -= velocityMove.x * speedInit * delta;
    if ( moveLeft ) velocityMove.x -= speed * delta;
    if ( moveRight ) velocityMove.x += speed * delta

    velocityMove.y -= velocityMove.y * speedInit * delta;
    if ( moveDown ) velocityMove.y -= speed * delta;
    if ( moveUp ) velocityMove.y += speed * delta;

    velocityMove.z -= velocityMove.z * speedInit * delta;
    if ( moveForward ) velocityMove.z -= speed * delta;
    if ( moveBackward ) velocityMove.z += speed * delta;

    //pass velocity as an argument to translateZ and call it on camera.
    camera.translateX( velocityMove.x * delta );
    camera.translateY( velocityMove.y * delta );
    camera.translateZ( velocityMove.z * delta );

    rotInit = (3 / maxSliderValue) * rotationSpeed;
    rot = (2000 / maxSliderValue) * rotationSpeed;

    camera.rotation.x -= camera.rotation.x * rotInit * delta;
    if ( rotDown ) camera.rotation.x -= rot * delta;
    if ( rotUp ) camera.rotation.x += rot * delta

    camera.rotation.y -= camera.rotation.y * rotInit * delta;
    if ( rotRight ) camera.rotation.y -= rot * delta;
    if ( rotLeft ) camera.rotation.y += rot * delta;

    prevTime = time;
}


function onKeyDown(event) {
    var keyCode = event.which;
    switch (keyCode) {
        case 87:  // W
        case 119: // w
            moveForward = true;
            break;
        case 65:  // A
        case 97:  // a
            moveLeft = true;
            break;
        case 68:  // d
        case 100: // D
            moveRight = true;
            break;
        case 83:  // s
        case 115: // S
            moveBackward = true;
            break;
        case 81:  // q
        case 113: // Q
            moveUp = true;
            break;
        case 69:  // e
        case 101: // E
            moveDown = true;
            break;
        case 84:  // t
        case 116: // T
            rotUp = true;
            break;
        case 71:  // g
        case 103: // G
            rotDown = true;
            break;
        case 70:  // f
        case 102: // F
            rotLeft = true;
            break;
        case 72:  // h
        case 104: // H
            rotRight = true;
            break;
    }
    console.log({"w": moveForward, "a": moveLeft, "d": moveRight, "s": moveBackward, "q": moveUp, "e": moveDown, "t": rotUp, "f": rotLeft, "h": rotRight, "g": rotDown});
}

function onKeyUp(event) {
    var keyCode = event.which;
    switch (keyCode) {
        case 87:  // W
        case 119: // w
            moveForward = false;
            break;
        case 65:  // A
        case 97:  // a
            moveLeft = false;
            break;
        case 68:  // d
        case 100: // D
            moveRight = false;
            break;
        case 83:  // s
        case 115: // S
            moveBackward = false;
            break;
        case 81:  // q
        case 113: // Q
            moveUp = false;
            break;
        case 69:  // e
        case 101: // E
            moveDown = false;
            break;
        case 84:  // t
        case 116: // T
            rotUp = false;
            break;
        case 71:  // g
        case 103: // G
            rotDown = false;
            break;
        case 70:  // f
        case 102: // F
            rotLeft = false;
            break;
        case 72:  // h
        case 104: // H
            rotRight = false;
            break;
    }
    console.log({"w": moveForward, "a": moveLeft, "d": moveRight, "s": moveBackward, "q": moveUp, "e": moveDown, "t": rotUp, "f": rotLeft, "h": rotRight, "g": rotDown});
}

// Helper Functions

function loadJson(path, callback) {
    var url = path;
    var xmlhttp = new XMLHttpRequest();

    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var data = JSON.parse(this.responseText);
            callback(data);
        }
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}

function toFixed(number) {
    return Number((number).toFixed(2));
}