// constants
var LOGIN_MODAL = 'loginModal';
var LOGIN_NAV = 'loginNav';
var MY_ACCOUNT = "myAccount";
var HIDE = "hidden";
var SHOW = "visible";
var NONE = "none";
var BLOCK = "block";
var ADMIN = "lin.9.michelle@gmail.com";
var ADD_FORM = 'addTimeForm';
var ADD_BUTTON = "addtimes-btn";

firebase.auth.Auth.Persistence.LOCAL;

// Reference messages collection

var infoRef =  firebase.database().ref("info");
var timeSlotRef = firebase.database().ref("timeslot");


// Listen for form submits

// Mailing list
document.getElementById("contactForm").addEventListener('submit', submitForm);

// User Login
document.getElementById("loginBtn").addEventListener('click', signInWithEmailPassword);

// User Signup
document.getElementById("signupBtn").addEventListener('click', signUpWithEmailPassword);

// Logout
document.getElementById("logoutBtn").addEventListener('click', signOut);


// Submit Mailing Form
function submitForm(e) {
    e.preventDefault();

    // Get values

    var name = getInputVal('name');
    var email = getInputVal('email');

    // Save message
    saveInfo(name, email);

    // Show alert

    document.querySelector(".alert").style.display = 'block';

    // Hide alert after 3 seconds
    setTimeout(function() {
        document.querySelector(".alert").style.display = 'none';
    }, 3000);

    // Clear form

    document.getElementById("contactForm").reset();
}

// Login
function signInWithEmailPassword(e) {
  e.preventDefault();
  var email = getInputVal('email1');
  var password = getInputVal('password1');

  if(email!= "" && password != ""){
    // [START auth_signin_password]
    firebase.auth().signInWithEmailAndPassword(email, password)
      .then((user) => {
        // Signed in
        successfulLogin();
      })
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        unSuccessfulLog();
      });
    // [END auth_signin_password]
  }
}

// Signup
function signUpWithEmailPassword(e) {
  e.preventDefault();
  var email = getInputVal('email1');
  var password = getInputVal('password1');

  if(email != "" && password != ""){
    // [START auth_signup_password]
    firebase.auth().createUserWithEmailAndPassword(email, password)
      .then((user) => {
        // Signed in
        successfulLogin();
      })
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorCode);
        console.log(errorMessage);
        unSuccessfulLog();
      });
    // [END auth_signup_password]
  }
}

// On login or signup success message
function successfulLogin(){
  setMessage("You have successfully logged in!");
  document.getElementById("close").click();
}

function successfulLogout(){
  setMessage("You have successfully logged out!");
  document.getElementById("close").click();
}

function unSuccessfulLog(){
  setMessage("Please try again.");
}
// Set item visibility to mode and display to display
function setItemMode(item, mode, display){
  item.style.visibility = mode;
  item.style.display = display;
}

// Set loginNav, loginModal and myAccount based on current user
function onUserChange(user){
  $('#slot').empty();
  if (user) {
    // User is signed in.
    setItemMode(document.getElementById(LOGIN_NAV), HIDE, NONE);
    setItemMode(document.getElementById(MY_ACCOUNT), SHOW, BLOCK);
    setItemMode(document.getElementById("book-btn"), SHOW, "inline");
    document.getElementById("book-btn").addEventListener("click", generateSlot);
    
    if(user.email == ADMIN){
      document.getElementById(ADD_BUTTON).addEventListener("click", addTimes);
      setItemMode(document.getElementById(ADD_BUTTON), SHOW, "inline");
      setItemMode(document.getElementById("book-btn"), HIDE, NONE);
    }
  } else {
    // No user is signed in.
    setItemMode(document.getElementById(LOGIN_NAV), SHOW, BLOCK);
    setItemMode(document.getElementById(MY_ACCOUNT), HIDE, NONE);
    setItemMode(document.getElementById("book-btn"), SHOW, "inline");
    document.getElementById("book-btn").addEventListener("click", generateSlot);
    setItemMode(document.getElementById(ADD_FORM), HIDE, NONE)
    setItemMode(document.getElementById(ADD_BUTTON), HIDE, NONE);
  }
}

// Set nav as appropriate on user change
firebase.auth().onAuthStateChanged(function(user) {
  onUserChange(user);
});

//Logout
function signOut(){
    firebase.auth().signOut().then(function() {
        // Sign-out successful.
        successfulLogout();
    }).catch(function(error) {
        // An error happened.

        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorCode);
        console.log(errorMessage);
        unSuccessfulLog();
    });
}


// Function to get form values
function getInputVal(id) {
    return document.getElementById(id).value;
}

// Save info to fireBase
function saveInfo(name, email) {
    var newInfoRef = infoRef.push();
    newInfoRef.set({
        name: name,
        email: email
    });

}

/* Admin */

// Set form to add timeslot to visible
function addTimes(){
  setItemMode(document.getElementById(ADD_FORM), SHOW, BLOCK);
  document.getElementById("singleAddBtn").addEventListener('click', add);
}

// Add a single time slot
function add(e){
  e.preventDefault();

  let day = getInputVal('day');
  let hour = getInputVal('hour');

  if(day != "" && hour != ""){

  timeSlotRef.child(day).once("value", snapshot => {
  if (!snapshot.exists()){
     timeSlotRef.push().set({
       [day]: []
     });
   }

   //TODO - FIX double entry validation
   timeSlotRef.child(day).child(hour).once("value", snapshot => {
     if(!snapshot.exists()){
       let child = timeSlotRef.child(day).push();
       child.update({
         hour: hour,
         user: "",
         name: "",
         phone: ""
           });

        setMessage("Sucessfully added " + day + " @ " + hour + ".");
      } else {
        setMessage("You have already added" + day + "@ " + hour + ".");
      }

      });
    });
  }

  document.getElementById(ADD_FORM).reset();
}
