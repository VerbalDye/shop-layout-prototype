var shopLayoutEl = document.querySelector("#shop-layout-ui");
var saveBtn = document.querySelector("#save");
var addBtn = document.querySelector("#add-element")
var csvBtn = document.querySelector("#download-csv");
var widthInputEl = document.querySelector("#width");
var heightInputEl = document.querySelector("#height");
var objectModalEl = document.querySelector("#create-object-modal");
var createObjectAddBtn = document.querySelector("#create-object-add");
var createObjectCancelBtn = document.querySelector("#create-object-cancel");
var objectHeightInputEl = document.querySelector("#object-height");
var objectWidthInputEl = document.querySelector("#object-width");


var objectIndex = 1;
var shopDim = {}

var adjustCooridinate = function (value, axis) {
    if (axis == "x") {
        return value - parseInt(shopLayoutEl.offsetLeft) - 3
    } else if (axis == "y") {
        return value - parseInt(shopLayoutEl.offsetTop) - 3
    }
}

var updateCoordinates = function ({ target }, ui) {
    target.innerHTML = "(" + adjustCooridinate(target.offsetLeft, "x") + ", " + adjustCooridinate(target.offsetTop, "y") + ")";
}

var downloadCSV = function () {
    let rows = [["name", "x", "y"]]

    var children = shopLayoutEl.children;

    Array.from(children).forEach(function (child) {
        let row = []
        row.push(child.id)
        row.push(adjustCooridinate(child.offsetLeft, "x"))
        row.push(adjustCooridinate(child.offsetTop, "y"))
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

var openObjectModel = function () {
    objectModalEl.style.display = "block";
}

var closeObjectModel = function () {
    objectModalEl.style.display = "none";
}

var createObject = function () {
    var shopObjectEl = document.createElement("div");
    shopObjectEl.className = "shop-element";
    shopObjectEl.id = "shop-element" + objectIndex;
    shopObjectEl.style.height = objectHeightInputEl.value + "px";
    shopObjectEl.style.width = objectWidthInputEl.value + "px";
    shopLayoutEl.appendChild(shopObjectEl);

    updateCoordinates({ target: shopObjectEl }, {})
    $("#shop-element" + objectIndex).draggable({ containment: "parent", snap: true, cursor: "crosshair", cursorAt: { top: 0, left: 0 }, drag: updateCoordinates, stop: updateCoordinates });
    objectIndex += 1;
    closeObjectModel();
}

var handleSave = function (event) {
    shopDim.width = widthInputEl.value + "px"
    shopDim.height = heightInputEl.value + "px"
    shopLayoutEl.style.width = shopDim.width;
    shopLayoutEl.style.height = shopDim.height;
}

handleSave();

saveBtn.addEventListener('click', handleSave);
addBtn.addEventListener('click', openObjectModel)
csvBtn.addEventListener('click', downloadCSV);
createObjectAddBtn.addEventListener('click', createObject)
createObjectCancelBtn.addEventListener('click', closeObjectModel)