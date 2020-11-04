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

//API request to instagram to populate the first 8 recent images
var token = API_KEY
      username = 'kelzthabarber'
      num_photos = 8;

  $.ajax({ // the first ajax request returns the ID of user kelzthabarber
  	url: 'https://api.instagram.com/v1/users/search',
  	dataType: 'jsonp',
  	type: 'GET',
  	data: {access_token: token, q: username}, // actually it is just the search by username
  	success: function(data){
  		console.log(data);
  		$.ajax({
  			url: 'https://api.instagram.com/v1/users/' + data.data[0].id + '/media/recent', // specify the ID of the first found user
  			dataType: 'jsonp',
  			type: 'GET',
  			data: {access_token: token, count: num_photos},
  			success: function(data2){
  				console.log(data2);
  				for(x in data2.data){
            $('#img1').prop('src', data2.data[x].images.thumbnail.url);
  				}
      			},
  			error: function(data2){
  				console.log(data2);
  			}
  		});
  	},
  	error: function(data){
  		console.log(data);
  	}
  });
