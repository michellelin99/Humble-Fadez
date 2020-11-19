//set current day to light blue
var currentDate = new Date();
var day = currentDate.getDay();

$(".d" + day).css("color", "#4287f5");
$(".d" + day).css("font-weight", "Bold");


//load temporary images into carousel
var i;
for(i = 1; i <= 8; ++i){
  $(".img" + i).attr("href","img/" + i + ".png");
  $(".img" + i).attr("src","img/" + i + ".png");
}

//load sign up
$(document).ready(function() {
  $('#loginModal').modal('show');
  $(function () {
    $('[data-toggle="tooltip"]').tooltip()
  })
});
