
//constants

const DAYS = 3;
const TIMES = 8;
const START_DAY = 2;
const START_TIME = 9;
const DATES = {0: "Sunday", 1: "Monday", 2: "Tuesday", 3: "Wednesday",
4: "Thursday", 5: "Friday", 6: "Saturday"};
const original = new Date();

/* Firebase */
var timeSlotRef = firebase.database().ref("timeslot");


// global variables
var datesArray = [];
var selectedSlot = undefined;
var selectedDate = null;
var selectedTime = null;
var table = document.getElementById("slot");
var btns = new Array(TIMES);

for(let i = 0; i < TIMES; ++i){
  btns[i] = new Array(DAYS).fill(null);
}


/* Formatting Functions */

function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}

function addZero(curr){
  if(curr < 10){
    curr = "0" + curr;
  }

  return curr;
}

function formatTime(t){
  let arr = t.split(" ", 2);
  let h = parseInt(arr[0]);
  if(arr[1] == "PM" && h < 12 || arr[1] == "AM" && h == 12){
    h += 12;
  }
  h = addZero(h);

  h += ":00";
  return h;
}

function formatDate(dae){
  let arr = dae.split("/", 3);
  return arr[2] + "-" + addZero(arr[0]) + "-" + addZero(arr[1]);
}


/* Messages */

function setMessage(message){
  document.getElementById("pop-up-modal-title").textContent = message;
  $("#popUpModal").modal("toggle");
}

function noSlot(){
  setMessage("This time slot is not avaliable.");
}


/* Slot functionality */

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
    timeFormatted += " AM";
  } else{
    timeFormatted += " PM";
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
  document.getElementById('schedule-submit').addEventListener('click', confirmSlot);

  selectedSlot = !selectedSlot;
  selectedTime = timeFormatted;

  //send email to provider + barber

}

function confirmSlot(){
  let name = getInputVal('schedule-name');
  let email = getInputVal('schedule-email');
  let phone = getInputVal('schedule-phone');

  if(name != "" && email != "" && phone != ""){

    if(confirm("Confirm that you have selected " + selectedDate + " at " + selectedTime)){
      sendEmail(email);

      let selectedT = formatTime(selectedTime);
      let selectedD = formatDate(selectedDate);


      //adding to confirm table
      firebase.database().ref("confirmed").push().set({
        day: selectedD,
        hour: selectedT,
        name: name,
        phone: phone,
        user: email
      });

      alert("Sending data!");
      timeSlotRef.child(selectedD).orderByKey().once("value", data =>{
        data.forEach(d => {
        alert("Confirmed!");
        if(d.val().hour == selectedT){
          timeSlotRef.child(selectedD).child(d.key).set({
            hour: selectedT,
            name: name,
            phone: phone,
            user: email
          });
        }
      });
      });
    } else {
      alert("Please try again. Appointment was not scheduled.");

    }

    setMessage("Please select another time by clicking BOOK once again.");
    document.getElementById('schedule-submit').removeEventListener('click', confirmSlot);
    let form = document.getElementById("schedule-info");
    form.style.visibility = "hidden";
    form.style.display = "none";
    $('#slot').empty();

  }

}


// Function to reset variables that keep track of selection
function resetValues(){
  selectedDate = null;
  selectedTime = null;
  selectedSlot = undefined;
  datesArray = [];
}

// Generate table with slots
function generateSlot(){
  resetValues();

  $('#slot').empty();

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

      //config time
      let m = (currentDate.getMonth() + 1);
      m = addZero(m);
      let de = currentDate.getDay() - 1; //WEIRD BUG HERE TO DO?
      de = addZero(de);

      datesArray.push(currentDate.getFullYear() + "-" + m + "-" + de);
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

      btns[i][j].style.backgroundColor = "grey";
      btns[i][j].addEventListener("click", noSlot);
      slot.appendChild(btns[i][j]);

    }

    time += 1;
    time %= 12;
  }

  for(let i = 0; i < DAYS; ++i){
    generateSingleDay(datesArray[i], i);
  }

}


// Make single slot as avaliable is user is empty
function makeAvaliable(user, hour, index){
  var currTime = parseInt(hour.split(':', 2));
  var timeIndex = currTime - 9;
  if(user === "" && timeIndex < TIMES && index < DAYS){

    btns[timeIndex][index].style.backgroundColor = "purple";
    btns[timeIndex][index].removeEventListener("click", noSlot);
    btns[timeIndex][index].addEventListener("click", selectSlot.bind(null, currTime,timeIndex, index), false);
  }
}


// Make all slots where user is empty as avaliable
function generateSingleDay(date, index){
  timeSlotRef.child(date).orderByChild("hour").on("value", data =>{
    data.forEach(d => {
      //time slot already filled
      if(d.exists()){
      let user = d.val().user;
      let hour = d.val().hour;
      makeAvaliable(user, hour, index);
    }
    });
  });
}


function sendEmail(emailAddress) {
      Email.send({
        Host: "smtp.gmail.com",
        Username: "humble.fadez.confirmation@gmail.com",
        Password: "testing123A",
        To: 'humble.fadez.confirmation@gmail.com, emailAddress',
        From: "humble.fadez.confirmation@gmail.com",
        Subject: "Sending Email using javascript",
        Body: "Well that was easy!!",
      })
        .then(function (message) {
          alert.fire("Your appointment has been confirmed!");
        });
    }
