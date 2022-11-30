var shopLayoutEl = document.querySelector("#shop-layout-ui");
var saveBtn = document.querySelector("#save");
var csvBtn = document.querySelector("#download-csv");
var widthInputEl = document.querySelector("#width");
var heightInputEl = document.querySelector("#height");

var moving = false

shopLayoutEl.style.width = "500px";
shopLayoutEl.style.height = "500px";

var adjustCooridinate = function (value, axis) {
    if (axis == "x") {
        return value - parseInt(shopLayoutEl.offsetLeft) - 3
    } else if (axis == "y") {
        return value - parseInt(shopLayoutEl.offsetTop) - 3
    }
}

var updateCoordinates = function ({target}, ui) {
    target.innerHTML = "(" + adjustCooridinate(target.offsetLeft, "x") + ", " + adjustCooridinate(target.offsetTop, "y") + ")";
}

// const rows = [
//     ["name1", "city1", "some other info"],
//     ["name2", "city2", "more info"]
// ];

var downloadCSV = function () {
    let rows = [["name","x","y"]]

    var children = shopLayoutEl.children;

    console.log(children);

    Array.from(children).forEach(function(child) {
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

shopObjectEl = document.createElement("div");
shopObjectEl.className = "shop-element";
shopObjectEl.id = "shop-element";
shopLayoutEl.appendChild(shopObjectEl);
shopObjectEl.style.left = "253px"
updateCoordinates({ target: shopObjectEl }, {})
$("#shop-element").draggable({ containment: "parent", snap: true, cursor: "crosshair", cursorAt: { top: 0, left: 0 }, drag: updateCoordinates, stop: updateCoordinates });

shopObjectEl2 = document.createElement("div");
shopObjectEl2.className = "shop-element";
shopObjectEl2.id = "shop-element2";
shopLayoutEl.appendChild(shopObjectEl2);
$("#shop-element2").draggable({ containment: "parent", snap: true, cursor: "crosshair", cursorAt: { top: 0, left: 0 }, drag: updateCoordinates, stop: updateCoordinates });

var handleSave = function (event) {
    shopLayoutEl.style.width = widthInputEl.value + "px"
    shopLayoutEl.style.height = heightInputEl.value + "px"
}

saveBtn.addEventListener('click', handleSave);
csvBtn.addEventListener('click', downloadCSV);