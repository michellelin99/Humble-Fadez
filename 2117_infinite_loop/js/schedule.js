//-------> TODO: ADD FIREBASE NOSQL QUERIES <--------------------

//constants -- SHOULD BE GLOBAL
const DAYS = 3;
const TIMES = 8;
const START_DAY = 2;
const START_TIME = 9;
const DATES = {0: "Sunday", 1: "Monday", 2: "Tuesday", 3: "Wednesday",
4: "Thursday", 5: "Friday", 6: "Saturday"};
const original = new Date();

var selectedSlot = undefined;
var selectedDate = null;
var selectedTime = null;
var table = document.getElementById("slot");
var times = new Array(TIMES);
var btns = new Array(TIMES);

for(let i = 0; i < TIMES; ++i){
  times[i] = new Array(DAYS).fill(true);
  btns[i] = new Array(DAYS).fill(null);
}



function noSlot(){
  alert("This time has been booked. Please select another! :)")
}

function selectSlot(e, time, row, column){
  selectedSlot = [time, row];
  //configure time
  time += 9;
  time %= 12;
  if(time == 0){
    time = 12;
  }

  let timeFormatted = time;

  if (time >= 9 && time < 12){
    timeFormatted += "AM";
  } else{
    timeFormatted += "PM";
  }
  selectedTime = timeFormatted;

  let form = document.getElementById("schedule-info");

  form.style.visibility = "visible";
  form.style.display = "block";

  let date = new Date();
  date.setDate(original.getDate() + row + 1);
  let dateFormatted = (date.getMonth() + 1) + "/" + date.getDate()
                                  + "/" + date.getFullYear();
  selectedDate = dateFormatted;


  let submissionButton = document.getElementById("schedule-submit");
  submissionButton.innerHTML = "Book " + dateFormatted + " at " + timeFormatted;


  selectedSlot = !selectedSlot;
  selectedTime = timeFormatted;

  //send email to provider + barber

  //hide scheduler

  //show confirmation message + check email
  //set form to submit info visible

  //on clicking the btn to submit => confirm Slot();
}

function confirmSlot(){

  if(confirm("Confirm that you have selected " + selectedDate + " at " + selectedTime)){
    alert("A confirmation email has been sent! We look forward to getting"
    + " your hair to its sharpest form!");
    //add in form details here using modual box
  } else {
    alert("Please select another time by clicking BOOK once again.");
  }

  let form = document.getElementById("schedule-info");
  form.style.visibility = "hidden";
  form.style.display = "none";
  $('#slot').empty();

}

function generateSlot(){
  $('#slot').empty();

  //FAKE DATA here
  times[0][0] = false;
  times[5][1] = false;

  var original = new Date();
  var currentDate = original;

  var heading = table.insertRow(0);

  //generate dates heading -- skips sundays and mondays
  let d = 0;
  while(d < DAYS){
    currentDate.setDate(currentDate.getDate() + 1);
    if(currentDate.getDay() >= START_DAY){
      var curr = heading.insertCell(d);
      curr.className = "mb-0";
      curr.innerHTML = DATES[currentDate.getDay()] + " | " + (currentDate.getMonth() + 1)
                      + "/" + currentDate.getDate() + "/" + currentDate.getFullYear();
      ++d;
    }
  }

  //generate slots

  var time = START_TIME;
  for(let i = 0; i < TIMES; ++i){
    let row = table.insertRow(i + 1);

    for(let j = 0; j < DAYS; ++j){
      let slot = row.insertCell(j);

      btns[i][j] = document.createElement('input');
      btns[i][j].type = "button";
      btns[i][j].className = "tm-btn-submit-schedule";

      //display time correctly
      if(time == 0){
        btns[i][j].value = 12;
      } else{
        btns[i][j].value = time;
      }

      if(time >= 9 && time < 12){
        btns[i][j].value += "AM";
      } else{
        btns[i][j].value += "PM";
      }


      //add correct event listener based on avaliability
      if(times[i][j]){
        (btns[i][j]).addEventListener("click", selectSlot.bind(null, time, i, j), false);
      } else {
        (btns[i][j]).addEventListener("click", noSlot);
        btns[i][j].style.backgroundColor = "grey";
      }

      slot.appendChild(btns[i][j]);

    }

    time += 1;
    time %= 12;
  }

}
