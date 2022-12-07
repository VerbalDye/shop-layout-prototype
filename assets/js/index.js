// Layout Element
var shopLayoutEl = document.querySelector("#shop-layout-ui");

//Btns
var saveBtn = document.querySelector("#save");
var addBtn = document.querySelector("#add-element")
var csvBtn = document.querySelector("#download-csv");
var csvUploadBtn = document.querySelector("#upload-csv");
var createObjectAddBtn = document.querySelector("#create-object-add");
var createObjectCancelBtn = document.querySelector("#create-object-cancel");
var uploadCSVConfirmBtn = document.querySelector("#upload-csv-confirm");
var uploadCSVCancelBtn = document.querySelector("#upload-csv-cancel");

// Inputs
var widthInputEl = document.querySelector("#width");
var heightInputEl = document.querySelector("#height");
var objectTypeSelectEl = document.querySelector("#object-type");
var csvUploadInputEl = document.querySelector("#csv-input");

// Modals
var objectModalEl = document.querySelector("#create-object-modal");
var csvModalEl = document.querySelector("#upload-csv-modal");

// Global Variables
var objectIndex = 1;
var scale;
var shopObject = {
    walls: { width: widthInputEl.value, height: heightInputEl.value },
    objects: []
}

var objectTypes =
    {
        Station : {
            width: 2,
            length: 2,
            xOffset: 1,
            yOffset: 1,
            color: "#035efc"
        },
        Source: {
            width: 1,
            length: 2,
            xOffset: 0,
            yOffset: 1,
            color: "#fc3d03"
        },
        Drain: {
            width: 1,
            length: 2,
            xOffset: 1,
            yOffset: 1,
            color: "#03fc13"
        }
    }


var adjustCooridinate = function (value, axis, reverse) {
    var scaledValue;
    if (reverse) {
        if (axis == "x") {
            scaledValue = value - parseInt(shopLayoutEl.offsetLeft)
        } else if (axis == "y") {
            scaledValue = value - parseInt(shopLayoutEl.offsetTop)
        }
        return Math.round(scaledValue / scale) / 10;
    } else {
        scaledValue = value * 10 * scale
        if (axis == "x") {
            return scaledValue + parseInt(shopLayoutEl.offsetLeft)
        } else if (axis == "y") {
            return scaledValue + parseInt(shopLayoutEl.offsetTop)
        }
    }
}

// Updates the numbers listed on the html element in the UI
var updateCoordinates = function ({ target }, ui) {
    var x = adjustCooridinate(target.offsetLeft, "x", true);
    var y = adjustCooridinate(target.offsetTop, "y", true);
    shopObject.objects.forEach(function (object) {
        if (object.name == target.id) {
            target.innerHTML = object.type + "<br/>" + "(" + x + ", " + y + ")";
            object.x = x;
            object.y = y;
        }
    })
}

// Exports the current settings to a CSV file
var downloadCSV = function () {

    // fills out the top two rows with labels and the window specs
    let rows = [["Name", "Obj Type", "Succ", "x", "y"]]

    var objects = shopObject.objects;

    // Converts the HTML list into an array that we can iterate through to create a nested array containing all screen info
    objects.forEach(function (object) {
        let row = []
        row.push(object.name)
        row.push(object.type)
        row.push(" ")
        row.push(object.x)
        row.push(object.y)
        rows.push(row);
    })

    console.log(rows);
    // csv header
    let csvContent = "data:text/csv;charset=utf-8,";

    // Joins the arrays into a csv compatible string
    rows.forEach(function (rowArray) {
        let row = rowArray.join(",");
        csvContent += row + "\r\n";
    });

    // Converts the string into a downloadable file then initiates the download
    var encodedUri = encodeURI(csvContent);
    window.open(encodedUri);
}

// Funtion to handle the reupload of CSV info
var uploadCSV = function (file) {

    // Initates a filereader to extract the string information from the file
    let reader = new FileReader();

    // Check to ensure the file is csv format
    if (file.name.split(".")[1] == "csv") {
        reader.readAsText(file);

        // Once the reader is finished and the info is loaded the following funciton converts the string into a usable object
        reader.onload = function () {
            var csv = reader.result
            var rows = csv.split("\r\n");
            var result = [];

            // removes the final exteranious row
            rows.pop();

            // Quick and dirty window size adjustment
            // widthInputEl.value = parseInt(rows[1].split(",")[3])
            // heightInputEl.value = parseInt(rows[1].split(",")[4])
            // handleSave();

            // Iterates through the rows skipping the header and window info
            rows.forEach(function (row, index) {
                if (index > 0) {
                    // Temperary object to store the properties of each element on the screen
                    let obj = {}
                    let rowArray = row.split(",");
                    for (var i = 0; i < 5; i++) {

                        // Skipping the name we sort each property
                        switch (i) {
                            case 0: obj.name = rowArray[i];
                            if (parseInt(obj.name.split("element")[1]) >= objectIndex) {
                                objectIndex = parseInt(obj.name.split("element")[1]) + 1;
                            }
                                break;
                            case 1: obj.type = rowArray[i];
                                break;
                            case 3: obj.x = Math.round(parseFloat(rowArray[i]) * 10) / 10;
                                break;
                            case 4: obj.y = Math.round(parseFloat(rowArray[i]) * 10) / 10;
                                break;
                            default:
                        }
                    }

                    // We add the object to the list of a new items then repeat
                    shopObject.objects.push(obj);
                }
            })

            // Each object is then sent to the object contructer to add them to the screen
            result.forEach(function (params) {
                createObject(params)
            })
            console.log(shopObject.objects);
            updateShopSize();
        };

        // Error handling
        reader.onerror = function () {
            console.log(reader.error)
        }
    } else {
        console.log("Filetype Error");
    }
}

// Handles the upload button press to gather the correct information and gatekeep the user from sending obviously bad data to the filereader
var handleUploadCSV = function () {
    let file = csvUploadInputEl.files[0];

    if (file && file.name.split(".")[1] == "csv") {
        uploadCSV(file);
        closeCSVModal();
    } else {
        alert("Please upload a CSV file.")
    }
}

// Funcitons to open and close various modals
// Should considering consolidate these into a two functions with an html element as an input 
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

// Sets all the properties of a new object with params as an input
var createObject = function (params) {
    var shopObjectEl = document.createElement("div");
    var objectType = objectTypes[params.type]
    console.log(objectIndex)
    shopObjectEl.className = "shop-element";
    shopObjectEl.id = params.name
    shopObjectEl.style.left = adjustCooridinate(params.x, "x") + "px";
    shopObjectEl.style.top = adjustCooridinate(params.y, "y") + "px";
    shopObjectEl.style.height = objectType.length * 10 * scale + "px";
    shopObjectEl.style.width = objectType.width * 10 * scale + "px";
    shopObjectEl.style.background = objectType.color;
    shopLayoutEl.appendChild(shopObjectEl);

    // Get the coordinates on the face of the object for the first time
    updateCoordinates({ target: shopObjectEl }, {})

    // Sets the object as a draggable in jQuery
    //cursor: "crosshair", cursorAt: { top: 0, left: 0 },
    $("#" + params.name).draggable({ containment: "parent", snap: true, grid: [scale, scale], drag: updateCoordinates, stop: updateCoordinates });
}

// Handles the button press to add a new object
var handleCreateObject = function () {
    console.log(objectTypeSelectEl.value);
    shopObject.objects.push({ name: "shop-element" + objectIndex, type: objectTypeSelectEl.value, x: 0, y: 0 })
    var params = shopObject.objects[shopObject.objects.length - 1];
    console.log(shopObject.objects);
    createObject(params);
    objectIndex += 1;
    closeObjectModal();
}

var updateShopSize = function () {
    var xScale = Math.floor(window.innerWidth / (shopObject.walls.width * 10));
    var yScale = Math.floor(window.innerHeight / (shopObject.walls.height * 10));
    if (xScale <= yScale) { scale = xScale } else { scale = yScale };
    shopLayoutEl.style.width = shopObject.walls.width * 10 * scale + "px";
    shopLayoutEl.style.height = shopObject.walls.height * 10 * scale + "px";
    while (shopLayoutEl.firstChild) {
        shopLayoutEl.removeChild(shopLayoutEl.firstChild);
    }
    shopObject.objects.forEach(function (object) {
        createObject(object);
    });
}

// Handle saveing shop size 
var handleSave = function (event) {
    shopObject.walls.width = widthInputEl.value
    shopObject.walls.height = heightInputEl.value
    updateShopSize();
}

var updateOptions = function () {
    for(var type in objectTypes) {
        var optionEl = document.createElement("option");
        optionEl.value = type;
        optionEl.innerHTML = type;
        objectTypeSelectEl.appendChild(optionEl);
    }
}

// Set the shiop size using default values
handleSave();
updateOptions();

// Listeners for all button presses
saveBtn.addEventListener('click', handleSave);
addBtn.addEventListener('click', openObjectModal)
csvBtn.addEventListener('click', downloadCSV);
createObjectAddBtn.addEventListener('click', handleCreateObject);
createObjectCancelBtn.addEventListener('click', closeObjectModal);
csvUploadBtn.addEventListener('click', openCSVModal);
uploadCSVConfirmBtn.addEventListener('click', handleUploadCSV);
uploadCSVCancelBtn.addEventListener('click', closeCSVModal);
window.addEventListener('resize', updateShopSize);  