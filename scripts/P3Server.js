/**
 * Author: Emmanuel Simiyu(A00439371)
 * Author: Annette Maria Paul (A00439825)
 * Author: Srna Bojchin(A00434222)

    This file has a string of concepts inside a JSON Object and displays the appropriate one when called.
 */


var express = require("express");
var server = express();

var port = 3223;

server.use(express.json());
server.use(express.urlencoded({ extended: true }));

var allowCrossDomain = function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
};
server.use(allowCrossDomain);

server.listen(port, function () {
  console.log("Example app listening on port 3223");
});

// This is the route that the jquery $.get in the client side will take.
// It is an HTTP GET request (coming from the client).
// -"/myroute" is the route or path
// - function (request, response) { ... } is a callback function that is
//   executed when the client does an http GET operation with the route (/myroute)
//   The server.get() function is always waiting for such an event.
server.get("/myroute", function (request, response) {  
  // Object with array for different concepts
  var textChange = {
    concept: [
      '<br>Local conditions:<br><br>Heating demand is given in heating degree - days.The length of a Canadian heating season is the number of days below 18\xB0C.Coldness is the difference between a desired indoor temperature of 20\xB0C and the average outdoor temperature on those days.\
      <br><br> Humidity and especially windiness of a location also add to heating demand but are discussed elsewhere.<br><br> Warmer climates imply a cooling load: also a subject for other chapters.\
      <br><br> Please note that to reflect the Canadian exerience, this App mixes units: Celsius for temperature, for example, but inches and feet for dimensions.',
  
      '<br>Annual Energy Budget<br><br>Envelope heat loss is only part of an energy budget. Light, hot water appliances and electronics also consume energy. In this chapter those other loads are fixed, on the assumption that use of the building remains constant in all locations.\
      <br><br>Envelope heat loss has at least two components: the effectively conductive losses that can be reduced by insulation, and losses due to ventialation and drafts.Both are proportional to heating demand. Looking at the Energy Budget graph, you will see that changing the.\
      insulation levels changes the the conductive or insulation losses but not those due to air movement.',
  
      '<br>Drafts and Ventilation<br><br>Realistically, a larger window would admit more drafts, especially at the lower end of the quality scale, but that effect is ignored in the insulation chapter. \
      <br><br>The Drafts and Ventilation chapter explains how energy losses due to infiltration are controlled by membranes, sealants, joint design, and meticulous quality control. It shows how ventilation losses can be managed through heat exchange, flow controls, and careful use of operable windows and vents.',
       
      '<br>Insulation and Heat Loss<br><br>In North America, thermal resistance is measured in R-Values. The resistance of a material barrier is a product of its resistivity, in R/inch, and the inches of thickness. The actual effectiveness of insulation depends on installation and other factors, but this app gives. \
      drywall an R/inch of 1, fibreglass and cellulose insulation an R/inch of 3, and urethane spray foam an R/inch of 6.<br><br>In thin and poorly insulating assemblies, air films become significant. This is how painted sheet steel ends up with a nominal R of 1. When assemblies are layered, \
      R values can simply be totalled.',
  
      '<br>Materials and Insulation<br><br>Heat flow is inversely related to thermal resistance. The conduction of heat through a meterial is given as a U value, which is equal to 1/R. Add layers into a single R value before finding their U value.<br><br>Heat loss is a product of thermal demand and conductive liablity. \
      Thermal demand consolidates temperature difference and time, as in degree days. Thermal liability is a product of surface area and conductance.<br><br>The total thermal liability of an envelope is a sum of the liability of its portions. Average conductance divides the total liability by the total area. \
      The effective R-value of an envelope is the inverse of average conductance.<br><br>Note that high R-value portions of an envelope have a smaller effect on the effective R-Value than might be supposed. Conversely, low-R-value portions of an envelope such as windows have a larger effect on overall heat loss than their small area may suggest.',
      
      '<br>Environmental Impact<br><br>The environmental impact of construction depends not only on the energy consumed in operating a building, but in the energy consumed or \'embodied\' in the material through sourcing, manufacture, transport, and assembly. Additionally, toxins and other ecological and social injuries need to be accounted for. \
      The exact calculations are complicated and debatable, but that\'s no reason to ignore them. They are the subject of several other chapters.'
    ]
  };

  // set the status to OK and send the JSON object
  return response.status(200).send(textChange);
});