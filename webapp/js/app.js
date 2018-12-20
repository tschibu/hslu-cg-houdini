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

var size = 1000;
var divisions = 100;
var helperGrid = new THREE.GridHelper(size, divisions);

//create scene
scene.add(ambientLight);
camera.add(pointLight);
scene.add(camera);
camera.position.x = 0;
camera.position.y = 18;
camera.position.z = 84;

//add helper grid
scene.add(helperGrid);

//renderer
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(content.innerWidth, content.innerHeight);
content.appendChild(renderer.domElement);

//event listeners
//document.addEventListener('mousemove', onDocumentMouseMove, false);
window.addEventListener('resize', onWindowResize, false);
window.addEventListener('keypress', onDocumentKeyPress, false);


//Start doing work...

//load config and create obj selection
loadJson('/config.json', createObjSelection);

animate();

//-----------------------------------------------------------------
// Functions

function render() {
    //camera.position.x += (mouseX - camera.position.x) * .05;
    //camera.position.y += (- mouseY - camera.position.y) * .05;
    //camera.lookAt(scene.position);
    renderer.render(scene, camera);
}

function animate() {
    requestAnimationFrame(animate);
    render();
}

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

function onDocumentKeyPress( event ) {
    var keyCode = event.which;
    var positionDelta = 6;
    var rotationDelta = 0.1;
    console.log(keyCode);
    //A
    if ( keyCode == 97 )
    {
        camera.position.x -= positionDelta;
    }
    //D
    else if ( keyCode == 100 )
    {

        camera.position.x += positionDelta;
    }
    //W
    else if ( keyCode == 119 )
    {
        camera.position.z -= positionDelta;
    }
    //S
    else if ( keyCode == 115 )
    {
        camera.position.z += positionDelta;
    }
    //Q
    else if ( keyCode == 113 )
    {
        camera.position.y += positionDelta;
    }
    //E
    else if ( keyCode == 101 )
    {
        camera.position.y -= positionDelta;
    }
    //T
    else if ( keyCode == 116 )
    {
        camera.rotation.x += rotationDelta;
    }
    //G
    else if ( keyCode == 103 )
    {
        camera.rotation.x -= rotationDelta;
    }
    //F
    else if ( keyCode == 102 )
    {
        camera.rotation.y += rotationDelta;
    }
    //H
    else if ( keyCode == 104 )
    {
        camera.rotation.y -= rotationDelta;
    }
    console.log(camera.position);
    console.log(camera.rotation);
}