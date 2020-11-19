



// Reference messages collection

var infoRef =  firebase.database().ref("info");


// Listen for form submit

document.getElementById("contactForm").addEventListener('submit', submitForm);

// Submit Form
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

