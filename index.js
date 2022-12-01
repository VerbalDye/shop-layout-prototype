// Layout Element
var shopLayoutEl = document.querySelector("#shop-layout-ui");

//Btns
var saveBtn = document.querySelector("#save");
var addBtn = document.querySelector("#add-element")
var csvBtn = document.querySelector("#download-csv");
var csvUploadBtn = document.querySelector("#upload-csv");
var createObjectAddBtn = document.querySelector("#create-object-add");
var createObjectCancelBtn = document.querySelector("#create-object-cancel");

// Inputs
var widthInputEl = document.querySelector("#width");
var heightInputEl = document.querySelector("#height");
var objectHeightInputEl = document.querySelector("#object-height");
var objectWidthInputEl = document.querySelector("#object-width");

// Modals
var objectModalEl = document.querySelector("#create-object-modal");
var csvModalEl = document.querySelector("#upload-csv-modal");

var objectIndex = 1;
var shopDim = {}

var adjustCooridinate = function (value, axis, reverse) {
    if (!reverse) {
        if (axis == "x") {
            return value - parseInt(shopLayoutEl.offsetLeft) - 3
        } else if (axis == "y") {
            return value - parseInt(shopLayoutEl.offsetTop) - 3
        }
    } else {
        if (axis == "x") {
            console.log(shopLayoutEl.offsetTop)
            return value + parseInt(shopLayoutEl.offsetLeft) + 3
        } else if (axis == "y") {
            return value + parseInt(shopLayoutEl.offsetTop) + 3
        }
    }
}

var updateCoordinates = function ({ target }, ui) {
    target.innerHTML = "(" + adjustCooridinate(target.offsetLeft, "x") + ", " + adjustCooridinate(target.offsetTop, "y") + ")";
}

var downloadCSV = function () {
    let rows = [["name", "x", "y", "width", "height"]]

    var children = shopLayoutEl.children;

    Array.from(children).forEach(function (child) {
        let row = []
        row.push(child.id)
        row.push(adjustCooridinate(child.offsetLeft, "x"))
        row.push(adjustCooridinate(child.offsetTop, "y"))
        row.push(child.style.width.split("px")[0])
        row.push(child.style.height.split("px")[0])
        rows.push(row);
    })

    let csvContent = "data:text/csv;charset=utf-8,";

    rows.forEach(function (rowArray) {
        let row = rowArray.join(",");
        csvContent += row + "\r\n";
    });

    var encodedUri = encodeURI(csvContent);
    window.open(encodedUri);
}

var uploadCSV = function (input) {
    let file = input.files[0];

    let reader = new FileReader();
    alert(file.name);
    if (file.name.split(".")[1] == "csv") {
        reader.readAsText(file);
        reader.onload = function () {
            var csv = reader.result
            console.log(csv)
            var rows = csv.split("\r\n");
            rows.pop();
            var result = [];
            rows.forEach(function (row, index) {
                if (index !== 0) {
                    let obj = {}
                    let rowArray = row.split(",");
                    for (var i = 1; i <= 4; i++) {
                        switch (i) {
                            case 1: obj.x = parseInt(rowArray[i]);
                                break;
                            case 2: obj.y = parseInt(rowArray[i]);
                                break;
                            case 3: obj.width = parseInt(rowArray[i]);
                                break;
                            case 4: obj.height = parseInt(rowArray[i]);
                                break;
                            default:
                        }
                    }
                    result.push(obj);
                }
            })
            console.log(result);
            result.forEach(function (params) {
                createObject(params)
            })
        };
        reader.onerror = function () {
            console.log(reader.error)
        }
    } else {
        console.log("Filetype Error");
    }
}

var openObjectModal = function () {
    objectModalEl.style.display = "block";
}

var closeObjectModal = function () {
    objectModalEl.style.display = "none";
}

var openCSVModal = function () {
    csvModalEl.style.display = "block";
}

var closeCSVModal = function () {
    csvModalEl.style.display = "none";
}

var createObject = function (params) {
    var shopObjectEl = document.createElement("div");
    shopObjectEl.className = "shop-element";
    shopObjectEl.id = "shop-element" + objectIndex;
    shopObjectEl.style.left = adjustCooridinate(params.x, "x", true) + "px";
    console.log(shopObjectEl.style.left)
    shopObjectEl.style.top = adjustCooridinate(params.y, "y", true) + "px";
    shopObjectEl.style.height = params.height + "px";
    shopObjectEl.style.width = params.width + "px";
    shopLayoutEl.appendChild(shopObjectEl);

    updateCoordinates({ target: shopObjectEl }, {})
    $("#shop-element" + objectIndex).draggable({ containment: "parent", snap: true, cursor: "crosshair", cursorAt: { top: 0, left: 0 }, drag: updateCoordinates, stop: updateCoordinates });
    objectIndex += 1;
    closeObjectModal();
}

var handleCreateObject = function () {
    var params = { x: 0, y: 0, width: objectWidthInputEl.value, height: objectHeightInputEl.value }
    createObject(params);
}

var handleSave = function (event) {
    shopDim.width = widthInputEl.value + "px"
    shopDim.height = heightInputEl.value + "px"
    shopLayoutEl.style.width = shopDim.width;
    shopLayoutEl.style.height = shopDim.height;
}

handleSave();

saveBtn.addEventListener('click', handleSave);
addBtn.addEventListener('click', openObjectModal)
csvBtn.addEventListener('click', downloadCSV);
createObjectAddBtn.addEventListener('click', handleCreateObject);
createObjectCancelBtn.addEventListener('click', closeObjectModal);
csvUploadBtn.addEventListener('click', openCSVModal);