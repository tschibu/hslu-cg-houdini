function loadJson(path, callback) {
    var url = path;
    var xmlhttp = new XMLHttpRequest();

    xmlhttp.onreadystatechange = function() {
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
}

function selectObj(objPath) {
    console.log(objPath);
}

//Start doing work...

//load config and create obj selection
loadJson('/config.json', createObjSelection);