/**
 * Author: Emmanuel Simiyu(A00439371)
 * Author: Annette Maria Paul (A00439825)
 * Author: Srna Bojchin(A00434222)

    This java script calculates the thermal resistence and the energy output for a 
    building depending the thickness of the walls and types of windows. It also 
    shows the calculations on two scemes with a different view.
 */

// scale factor
const SCL = 1.35;
// container width 8 feet = 96 inches
const WIDTH = 96;
// door width
const DOOR_WIDTH = 36;
// door height
const DOOR_HEIGHT = 80;
//min windowsize
const WINDOW_MIN = 1.5;
//link to server port
var SERVER_URL = "http://ugdev.cs.smu.ca:3223";

// creates the basic set up of the function
function setup() {
  myRoute();
  let plan = document.getElementById("drawPlan");
  let contextP = plan.getContext("2d");
  let elevation = document.getElementById("drawElevation");
  let contextE = elevation.getContext("2d");

  document.getElementById("2ndGrid").style.visibility = "hidden";
  document.getElementById("drawPlan").style.visibility = "hidden";
  document.getElementById("drawElevation").style.visibility = "hidden";

  // Clear the canvases
  contextP.clearRect(0, 0, plan.width, plan.height);
  contextE.clearRect(0, 0, elevation.width, elevation.height);

  // -------------------------- PLAN ------------------------
  // Background for the canvas
  contextP.fillStyle = "#d2cbcd"; // concrete
  contextP.fillRect(0, 0, plan.width, plan.height);

  // wall's outer border
  contextP.lineWidth = 2;
  contextP.fillStyle = "#3104fb"; // blue
  contextP.fillRect(0, 0, plan.width, WIDTH * SCL);
  // wall
  contextP.fillStyle = "#d2cbcd"; // concrete
  contextP.fillRect(
    1 * SCL,
    1 * SCL,
    plan.width - 2 * SCL,
    WIDTH * SCL - 2 * SCL
  );

  // wall's inner border
  contextP.lineWidth = 2;
  contextP.fillStyle = "#3104fb"; // blue
  contextP.fillRect(
    2 * SCL,
    2 * SCL,
    plan.width - 4 * SCL,
    WIDTH * SCL - 4 * SCL
  );

  // inner floor
  contextP.fillStyle = "#d2cbcd"; // concrete
  contextP.fillRect(
    3 * SCL,
    3 * SCL,
    plan.width - 6 * SCL,
    WIDTH * SCL - 6 * SCL
  );
  // ---------------------- DOOR ------------------------------
  // clear space for door
  contextP.fillStyle = "#d2cbcd"; // concrete
  contextP.fillRect(
    0.675 * plan.width,
    WIDTH * SCL - 2 * SCL,
    DOOR_WIDTH * SCL,
    Number(2 * SCL)
  );

  // plan door inner threshold
  contextP.setLineDash([4, 3]);
  contextP.lineWidth = 1;
  contextP.beginPath();
  contextP.moveTo(plan.width * 0.675, WIDTH * SCL - 2 * SCL);
  contextP.lineTo(plan.width * 0.675 + DOOR_WIDTH * SCL, WIDTH * SCL - 2 * SCL);
  contextP.stroke();

  contextP.beginPath();
  contextP.moveTo(plan.width * 0.675, WIDTH * SCL);
  contextP.lineTo(plan.width * 0.675 + DOOR_WIDTH * SCL, WIDTH * SCL);
  contextP.stroke();

  // plan door
  contextP.lineWidth = 2;
  contextP.setLineDash([]);
  contextP.beginPath();
  contextP.moveTo(plan.width * 0.675, WIDTH * SCL);
  contextP.lineTo(plan.width * 0.675, WIDTH * SCL + DOOR_WIDTH + 10);
  contextP.stroke();

  // door trajectory
  contextP.fillStyle = "#000000";
  contextP.lineWidth = 1;
  contextP.setLineDash([4, 3]);
  contextP.beginPath();
  contextP.arc(
    plan.width * 0.675 - 2,
    WIDTH * SCL - 2,
    DOOR_WIDTH * SCL,
    0,
    Math.PI / 2
  );
  contextP.stroke();

  // ------------------ ELEVATION ----------------------------
  // elevation wall
  contextE.fillStyle = "#a3bcfd"; // light blue to give hint
  contextE.fillRect(0, 0, elevation.width, elevation.height);

  drawDoor();

  // set initial slider values for display purposes only
  $("#thickOut").val(2); //opaque thickness
  $("#doorOut").val(2); //door thermal resistence
  $("#windowOut").val(1); //window thermal resistence
  $("#opqOut").val(""); //opaque thermal resistance
  $("#ovrOut").val(""); //effective overall thermal resistence
  $("#energyOut").val(""); //annual energy

  // register the wall thickness slider
  $("#thickSld").on("change", function () {
    processInput();
  });

  // register the window thickness slider
  $("#windowSld").on("change", function () {
    processInput();
  });

  //register the door thickness slider
  $("#doorSld").on("change", function () {
    processInput();
  });

  //register the window area slider
  $("#windowAreaSld").on("change", function () {
    processInput();
  });
}

function myRoute() {
  // jQuery http post function
  //
  // First argument : The complete URL (not just the root)
  // Second argument: The callback function ("data" is a reference to the returned JSON object)
  //                  The function is run only after .get() has finished and returned either
  //                  a valid result or an error.
  //
  //                  On error, the .fail() function executes.
  $.get(SERVER_URL + "/myroute", function (data) {
    // get value for the index
    try {
      localStorage.setItem("conString", JSON.stringify(data));
    } catch (localStorageError) {
      console.log("Error Thrown: " + localStorageError.name);
    }
  }).fail(function (error) {
    alert(error.responseText);
  });
}

// selects the chapter and shows the appropriate content
function choices() {
  let choice = $("#menu").find(":selected").text();

  if (choice !== "VIEW CHAPTERS") {
    document.getElementById("2ndGrid").style.visibility = "visible";
  } else {
    location.reload();
  }

  if (choice === "Insulation") {
    document.getElementById("drawPlan").style.visibility = "visible";
    document.getElementById("drawElevation").style.visibility = "visible";
  } else if (choice !== "Insulation" || "VIEW CHAPTERS") {
    alert(choice + " is under construction");
    location.reload();
  }
}

//shows the concept definitions
function showConcepts() {
  let index = $("#textChange option:selected").val();
  if (typeof window.Storage === "undefined") {
    alert("Local storage not supported by this browser.");
  } else if (localStorage.getItem("conString") !== null && index != "6") {
    $("#showText").html(
      JSON.parse(localStorage.getItem("conString")).concept[Number(index)]
    );
  }
}

// gets the values from the thickness slider, window slider and the insulation type
function processInput() {
  let construction = $("#thickSld").val() / 2; //window thickness slider
  let window = $("#windowSld").val(); //opaque thickness
  let material = $("#insType").find(":selected").text(); //insulation type name
  let insValue = $("#insType").find(":selected").val(); //insulation type value
  let degrees = $("#places option:selected").val(); //places with degree days
  let degreeArray = degrees.split(" ");
  let degree = degreeArray[2];
  let door = $("#doorSld").val(); //door thermal resistence
  let windowA = $("#windowAreaSld").val(); //window area

  //call the draw and calculate functions using the given input
  draw(construction, windowA, material);
  calculate(construction, window, insValue, degrees, degree, door, windowA);
}

// shows how the changes of value impact the plans
function draw(construction, window, material) {
  let plan = document.getElementById("drawPlan");
  let contextP = plan.getContext("2d");
  let elevation = document.getElementById("drawElevation");
  let contextE = elevation.getContext("2d");

  //make the window proportional
  let finalWindow = window / 2.1;

  // Clear canvases
  contextP.clearRect(0, 0, plan.width, plan.height);
  contextE.clearRect(0, 0, elevation.width, elevation.height);

  // -------------------------- PLAN ------------------------
  // Background for the canvas
  contextP.fillStyle = "#d2cbcd"; // concrete
  contextP.fillRect(0, 0, plan.width, plan.height);

  // wall's outer border
  contextP.fillStyle = "#3104fb"; // blue
  contextP.fillRect(0, 0, plan.width, WIDTH * SCL);

  //Shows which type of opaque construction was selected and colors in the plan accordingly
  if (material === "Bare Container (R1)") {
    contextP.fillStyle = "#d2cbcd"; // concrete
  } else if (material === "Plus Interior Finish, Uninsulated (R2)") {
    contextP.fillStyle = "#d2cbcd"; // concrete
  } else if (material === "Plus Finish and Cellulose (R3/in)") {
    contextP.fillStyle = "#e8e5e4"; // pale grey
  } else if (material === "Plus Finish and Fiberglass (R3/in)") {
    contextP.fillStyle = "#fec7d4"; // pink
  } else if (material === "Plus Finish and Spray Foam (R6/in)") {
    contextP.fillStyle = "#fdfaaa"; // yellow
  } else {
    contextP.fillStyle = "#d2cbcd"; // concrete
  }
  contextP.lineWidth = 1;
  contextP.fillRect(
    1 * SCL,
    1 * SCL,
    plan.width - Number(2) * SCL,
    WIDTH * SCL - Number(2) * SCL
  );

  // wall's inner border
  contextP.fillStyle = "#3104fb";
  contextP.fillRect(
    construction * SCL + Number(2) * SCL,
    construction * SCL + Number(2) * SCL,
    plan.width - 2 * construction * SCL - Number(4) * SCL,
    WIDTH * SCL - 2 * construction * SCL - Number(4) * SCL
  );

  // floor
  contextP.fillStyle = "#d2cbcd"; // concrete
  contextP.fillRect(
    construction * SCL + Number(3) * SCL,
    construction * SCL + Number(3) * SCL,
    plan.width - 2 * construction * SCL - Number(6) * SCL,
    WIDTH * SCL - 2 * construction * SCL - Number(6) * SCL
  );

  // -------------------------- WINDOW ----------------------------
  // plan window
  if (window >= WINDOW_MIN) {
    contextP.fillStyle = "#07ebf8"; // glass
    contextP.fillRect(
      75 * SCL - finalWindow * SCL,
      WIDTH * SCL - construction * SCL - 2 * SCL,
      2 * finalWindow * SCL,
      construction * SCL + Number(2 * SCL)
    );

    // plan window inner threshold
    contextP.setLineDash([4, 3]);
    contextP.beginPath();
    contextP.moveTo(
      75 * SCL - finalWindow * SCL,
      WIDTH * SCL - construction * SCL - 2 * SCL
    );
    contextP.lineTo(
      75 * SCL + Number(finalWindow * SCL),
      WIDTH * SCL - construction * SCL - 2 * SCL
    );
    contextP.stroke();

    // plan window outer threshold
    contextP.beginPath();
    contextP.moveTo(75 * SCL - finalWindow * SCL, WIDTH * SCL);
    contextP.lineTo(75 * SCL + Number(finalWindow * SCL), WIDTH * SCL);
    contextP.stroke();
  }
  // --------------------------- DOOR ------------------------------
  // clear space for door
  contextP.fillStyle = "#d2cbcd"; // concrete
  contextP.fillRect(
    0.675 * plan.width,
    WIDTH * SCL - construction * SCL - 2 * SCL,
    DOOR_WIDTH * SCL,
    construction * SCL + Number(2 * SCL)
  );

  // plan door
  contextP.lineWidth = 2;
  contextP.setLineDash([]);
  contextP.beginPath();
  contextP.moveTo(plan.width * 0.675, WIDTH * SCL);
  contextP.lineTo(plan.width * 0.675, WIDTH * SCL + DOOR_WIDTH + 10);
  contextP.stroke();

  // door trajectory
  contextP.fillStyle = "#000000";
  contextP.lineWidth = 1;
  contextP.setLineDash([4, 3]);
  contextP.beginPath();
  contextP.arc(
    plan.width * 0.675 - 2,
    WIDTH * SCL - 2,
    DOOR_WIDTH * SCL,
    0,
    Math.PI / 2
  );
  contextP.stroke();

  if (window >= WINDOW_MIN) {
    // plan window inner threshold
    contextP.setLineDash([4, 3]);
    contextP.beginPath();
    contextP.moveTo(
      plan.width * 0.675,
      WIDTH * SCL - construction * SCL - 2 * SCL
    );
    contextP.lineTo(
      plan.width * 0.675 + DOOR_WIDTH * SCL,
      WIDTH * SCL - construction * SCL - 2 * SCL
    );
    contextP.stroke();

    // plan window outer treshold
    contextP.beginPath();
    contextP.moveTo(plan.width * 0.675, WIDTH * SCL);
    contextP.lineTo(plan.width * 0.675 + DOOR_WIDTH * SCL, WIDTH * SCL);
    contextP.stroke();
  }

  // ----------------------- ELEVATION --------------------------
  // elevation wall
  contextE.fillStyle = "#a3bcfd"; // light blue to give hint
  contextE.fillRect(0, 0, elevation.width, elevation.height);

  drawDoor();

  if (window >= WINDOW_MIN) {
    // elevation window 4 x 3 aspect ratio
    // elevation window frame
    // black
    contextE.fillStyle = "black";
    contextE.fillRect(
      100 * SCL - finalWindow * SCL,
      25 * SCL,
      2 * finalWindow * SCL + Number(6),
      Number(((3 * finalWindow) / 2) * SCL) + Number(4)
    );
    // blue
    contextE.fillStyle = "#a3bcfd";
    contextE.fillRect(
      101 * SCL - finalWindow * SCL,
      26 * SCL,
      2 * finalWindow * SCL + Number(3),
      Number(((3 * finalWindow) / 2) * SCL) + Number(1)
    );
    // elevation window
    // black
    contextE.fillStyle = "black";
    contextE.fillRect(
      102 * SCL - finalWindow * SCL,
      27 * SCL,
      2 * finalWindow * SCL,
      Number(((3 * finalWindow) / 2) * SCL) - 2
    );
    // blue
    contextE.fillStyle = "#a3bcfd";
    contextE.fillRect(
      103 * SCL - finalWindow * SCL,
      28 * SCL,
      2 * finalWindow * SCL - 2,
      Number(((3 * finalWindow) / 2) * SCL) - 4
    );
  }
}

// draws the door that appears in the elevation plan
function drawDoor() {
  let elevation = document.getElementById("drawElevation");
  let contextD = elevation.getContext("2d");

  // elevation door
  // outline
  contextD.fillStyle = "#000000"; // black
  contextD.fillRect(
    200 * SCL - DOOR_WIDTH * SCL,
    25 * SCL,
    DOOR_WIDTH * SCL,
    DOOR_HEIGHT * SCL
  );

  // fill
  contextD.fillStyle = "#a3bcfd"; // blue
  contextD.fillRect(
    201 * SCL - DOOR_WIDTH * SCL,
    26 * SCL,
    DOOR_WIDTH * SCL - Number(3),
    DOOR_HEIGHT * SCL - Number(3)
  );

  // innerline
  contextD.fillStyle = "#000000"; // black
  contextD.fillRect(
    202 * SCL - DOOR_WIDTH * SCL,
    27 * SCL,
    DOOR_WIDTH * SCL - Number(6),
    DOOR_HEIGHT * SCL - Number(6)
  );

  // fill
  contextD.fillStyle = "#a3bcfd"; // blue
  contextD.fillRect(
    203 * SCL - DOOR_WIDTH * SCL,
    28 * SCL,
    DOOR_WIDTH * SCL - Number(8),
    DOOR_HEIGHT * SCL - Number(8)
  );

  //door knob
  contextD.strokeStyle = "#000000"; // black
  contextD.lineWidth = 1;
  contextD.beginPath();
  contextD.arc(200 * SCL - DOOR_WIDTH * SCL + 40, 65 * SCL, 3, 0, 2 * Math.PI);
  contextD.stroke();
}

function calculate(
  construction,
  window,
  insValue,
  degrees,
  degree,
  door,
  windowA
) {
  // update slider value outputs for display purposes only
  if (construction >= 4) {
    $("#thickOut").val(construction);
  }

  $("#doorOut").val(door);
  $("#windowOut").val(window);

  // output window area in square feet to one decimal place, truncated not rounded
  let wAreaTrunc = Math.trunc(Number(windowA) * 10) / 10;
  $("#windowAOut").val(wAreaTrunc);

  // opaque thermal resistance output
  if (insValue != "start") {
    let opqRes = 2 + ($("#thickOut").val() - 2) * insValue;
    //only shows value in box when >= 4
    if (opqRes < 4) {
      $("#opqOut").val("");
    } else {
      $("#opqOut").val(opqRes);
    }
  }

  //effective overall thermal resistence
  if ($("#thickOut").val() >= 4) {
    let ovrRes =
      1 /
      ((800 - windowA) / $("opqOut").val() +
        windowA / window +
        20 / door / 820);
    $("#ovrOut").val(ovrRes);
  } else if (insValue != "start") {
    $("#ovrOut").val("");
  }

  let eTRes = 0;
  let denom =
    ((800 - wAreaTrunc) / $("#opqOut").val() +
      wAreaTrunc / window +
      20 / door) /
    820;
  eTRes = 1 / denom;
  $("#ovrOut").val(Math.trunc(Number(eTRes)));

  //annual energy
  if (degrees != "places" && insValue != "start") {
    let annualE =
      (820 * degree * 1.8 * 24) / eTRes / 3412 +
      (degree * 1.8 * 24 * 65) / 3412 +
      3000;
    $("#energyOut").val(Math.trunc(Number(annualE)));
  }
}
