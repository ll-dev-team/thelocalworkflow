const HOURHAND = document.querySelector("#hour");
const MINUTEHAND = document.querySelector("#minute");
const SECONDHAND = document.querySelector("#second");
const DIGITAL_HRS = document.querySelector("#digital_hrs");
const DIGITAL_MIN = document.querySelector("#digital_min");
const DIGITAL_SEC = document.querySelector("#digital_sec");

var frame = 25;
var date = new Date();
let hr = date.getHours();
let min = date.getMinutes();
let sec = date.getSeconds();

var hrPosition = (hr*360/12) + (min*(360/60)/12);
var minPosition = (min*6) + ((sec*360/60)/60);
var secPosition = sec*6;

function runTheClock() {

  var multiplier = frame/1000;
  var new_date = new Date();
  let hr = new_date.getHours();
  let min = new_date.getMinutes();
  let sec = new_date.getSeconds();
  hrPosition = hrPosition + (3*multiplier/(360));
  minPosition = minPosition + (6*multiplier/(60));
  secPosition = secPosition + (360*multiplier/(60));
  console.log(hrPosition);
  console.log(minPosition);
  console.log(secPosition);

  HOURHAND.style.transform = "rotate(" + hrPosition + "deg)";
  MINUTEHAND.style.transform = "rotate(" + minPosition + "deg)";
  SECONDHAND.style.transform = "rotate(" + secPosition + "deg)";


  var zerofilled_hr = ('00'+hr).slice(-2);
  var zerofilled_min = ('00'+min).slice(-2);
  var zerofilled_sec = ('00'+sec).slice(-2);

  DIGITAL_HRS.innerHTML = zerofilled_hr + ":";
  DIGITAL_MIN.innerHTML = zerofilled_min + ":";
  DIGITAL_SEC.innerHTML = zerofilled_sec;

}

var interval = setInterval(runTheClock, frame);
