//Global variables
var content = document.getElementById("content");
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, content.innerWidth / content.innerHeight, 0.1, 1000);

var renderer = new THREE.WebGLRenderer();
renderer.setSize(content.innerWidth, content.innerHeight);
content.appendChild(renderer.domElement);

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

//Start doing work...

//load config and create obj selection
loadJson('/config.json', createObjSelection);