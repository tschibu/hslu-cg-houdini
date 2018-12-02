//Global variables
var mouseX = 0, mouseY = 0;
var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

var content = document.getElementById("content");
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, content.innerWidth / content.innerHeight, 0.1, 1000);
var ambientLight = new THREE.AmbientLight(0xcccccc, 0.4);
var pointLight = new THREE.PointLight(0xffffff, 0.8);
var renderer = new THREE.WebGLRenderer();

//create scene
scene.add(ambientLight);
camera.add(pointLight);
scene.add(camera);

//renderer
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(content.innerWidth, content.innerHeight);
content.appendChild(renderer.domElement);

//event listeners
document.addEventListener('mousemove', onDocumentMouseMove, false);
window.addEventListener('resize', onWindowResize, false);


//Start doing work...

//load config and create obj selection
loadJson('/config.json', createObjSelection);

animate();

//-----------------------------------------------------------------
// Functions

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

function createObjSelection(config) {
    console.log(config.objs);
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
    document.getElementById("objselection").append(slct);
    openObj(slct.options[0].value);
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
            console.log(object);
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

function onDocumentMouseMove(event) {
    mouseX = (event.clientX - windowHalfX) / 2;
    mouseY = (event.clientY - windowHalfY) / 2;
}

function render() {
    camera.position.x += (mouseX - camera.position.x) * .05;
    camera.position.y += (- mouseY - camera.position.y) * .05;
    camera.lookAt(scene.position);
    renderer.render(scene, camera);
}

function animate() {
    requestAnimationFrame(animate);
    render();
}