// Layout Element
var shopLayoutEl = document.querySelector("#shop-layout-ui");

//
var windowHeight = window.innerHeight;
var windowWidth = window.innerWidth;

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
var objectHeightInputEl = document.querySelector("#object-height");
var objectWidthInputEl = document.querySelector("#object-width");
var objectColorInputEl = document.querySelector("#object-color");
var csvUploadInputEl = document.querySelector("#csv-input");

// Modals
var objectModalEl = document.querySelector("#create-object-modal");
var csvModalEl = document.querySelector("#upload-csv-modal");

// Global Variables
var objectIndex = 1;
var shopDim = {};
var shopObject = {
    window: {width: "", height: ""},
    objects: []
}

// Function to translate absolute screen positiion to relative shop position
// reverse is a boolean that converts relative values back to absolute
var adjustCooridinate = function (value, axis, reverse) {
    if (!reverse) {
        if (axis == "x") {
            return value - parseInt(shopLayoutEl.offsetLeft) - 3
        } else if (axis == "y") {
            return value - parseInt(shopLayoutEl.offsetTop) - 3
        }
    } else {
        if (axis == "x") {
            return value + parseInt(shopLayoutEl.offsetLeft) + 3
        } else if (axis == "y") {
            return value + parseInt(shopLayoutEl.offsetTop) + 3
        }
    }
}

// Universal function to keep colors in a standard format
var rgbToHex = (r, g, b) => [r, g, b].map(x => {
    const hex = x.toString(16)
    return hex.length === 1 ? '0' + hex : hex
}).join('')

// Updates the numbers listed on the html element in the UI
var updateCoordinates = function ({ target }, ui) {
    target.innerHTML = "(" + adjustCooridinate(target.offsetLeft, "x") + ", " + adjustCooridinate(target.offsetTop, "y") + ")";
}

// Exports the current settings to a CSV file
var downloadCSV = function () {

    // fills out the top two rows with labels and the window specs
    let rows = [["name", "x", "y", "width", "height", "color"], ["window", "0", "0", shopLayoutEl.style.width.split("px")[0], shopLayoutEl.style.height.split("px")[0], "000000"]]

    var children = shopLayoutEl.children;

    // Converts the HTML list into an array that we can iterate through to create a nested array containing all screen info
    Array.from(children).forEach(function (child) {
        let row = []
        row.push(child.id)
        row.push(adjustCooridinate(child.offsetLeft, "x"))
        row.push(adjustCooridinate(child.offsetTop, "y"))
        row.push(child.style.width.split("px")[0])
        row.push(child.style.height.split("px")[0])

        // controlls the color and changes the rgb value to hex
        var colors = child.style.background.split("(")[1].split(")")[0].split(", ")
        var hex = rgbToHex(parseInt(colors[0]), parseInt(colors[1]), parseInt(colors[2]))
        row.push(hex);
        rows.push(row);
    })

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
            widthInputEl.value = parseInt(rows[1].split(",")[3])
            heightInputEl.value = parseInt(rows[1].split(",")[4])
            handleSave();

            // Iterates through the rows skipping the header and window info
            rows.forEach(function (row, index) {
                if (index > 1) {

                    // Temperary object to store the properties of each element on the screen
                    let obj = {}
                    let rowArray = row.split(",");
                    for (var i = 1; i <= 5; i++) {

                        // Skipping the name we sort each property
                        switch (i) {
                            case 1: obj.x = parseInt(rowArray[i]);
                                break;
                            case 2: obj.y = parseInt(rowArray[i]);
                                break;
                            case 3: obj.width = parseInt(rowArray[i]);
                                break;
                            case 4: obj.height = parseInt(rowArray[i]);
                                break;
                            case 5: obj.color = "#" + rowArray[i];
                                break;
                            default:
                        }
                    }

                    // We add the object to the list of a new items then repeat
                    result.push(obj);
                }
            })
            
            // Each object is then sent to the object contructer to add them to the screen
            result.forEach(function (params) {
                createObject(params)
            })
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
    shopObjectEl.className = "shop-element";
    shopObjectEl.id = "shop-element" + objectIndex;
    shopObjectEl.style.left = adjustCooridinate(params.x, "x", true) + "px";
    shopObjectEl.style.top = adjustCooridinate(params.y, "y", true) + "px";
    shopObjectEl.style.height = params.height + "px";
    shopObjectEl.style.width = params.width + "px";
    shopObjectEl.style.background = params.color
    shopLayoutEl.appendChild(shopObjectEl);

    // Get the coordinates on the face of the object for the first time
    updateCoordinates({ target: shopObjectEl }, {})

    // Sets the object as a draggable in jQuery
    $("#shop-element" + objectIndex).draggable({ containment: "parent", snap: true, cursor: "crosshair", cursorAt: { top: 0, left: 0 }, drag: updateCoordinates, stop: updateCoordinates });

    // Clean up
    objectIndex += 1;
    closeObjectModal();
}

// Handles the button press to add a new object
var handleCreateObject = function () {
    var params = { x: 0, y: 0, width: objectWidthInputEl.value, height: objectHeightInputEl.value, color: objectColorInputEl.value }
    createObject(params);
}

// Handle saveing shop size 
// This is very quick and dirty however in the future this info with come from plant sim
var handleSave = function (event) {
    shopDim.width = widthInputEl.value + "px"
    shopDim.height = heightInputEl.value + "px"
    shopLayoutEl.style.width = shopDim.width;
    shopLayoutEl.style.height = shopDim.height;
}

var getWindowDimensions = function () {
    windowHeight = window.innerHeight;
    windowWidth = window.innerWidth;
}

var drawLayout = function () {
    
}


// Set the shiop size using default values
handleSave();

// Listeners for all button presses
saveBtn.addEventListener('click', handleSave);
addBtn.addEventListener('click', openObjectModal)
csvBtn.addEventListener('click', downloadCSV);
createObjectAddBtn.addEventListener('click', handleCreateObject);
createObjectCancelBtn.addEventListener('click', closeObjectModal);
csvUploadBtn.addEventListener('click', openCSVModal);
uploadCSVConfirmBtn.addEventListener('click', handleUploadCSV);
uploadCSVCancelBtn.addEventListener('click', closeCSVModal);
window.addEventListener('resize', getWindowDimensions);