//

$(document).ready(function () {
	// get current date
	let NowMoment = moment().format('l');
	// variables added to moment for forcast days
	let dayOne = moment().add(1, 'days').format('l');
	let dayTwo = moment().add(2, 'days').format('l');
	let dayThree = moment().add(3, 'days').format('l');
	let dayFour = moment().add(4, 'days').format('l');
	let dayFive = moment().add(5, 'days').format('l');

	let city;
	let cities;
	// load the most recent search results from local storage
	function loadMostRecent() {
		let lastSearch = localStorage.getItem('mostRecent');
		if (lastSearch) {
			city = lastSearch;
			search();
		} else {
			city = 'Kingston';
		}
	}

	loadMostRecent();

	// load recently searched cities from local storage
	function loadRecentCities() {
		let recentCities = JSON.parse(localStorage.getItem('cities'));
		if (recentCities) {
			cities = recentCities;
		} else {
			cities = [];
		}
	}

	loadRecentCities();

	//event handler for search city button
	$('#submit').on('click', (e) => {
		e.preventDefault();
		getCity();
		search();
		$('#city-input').val('');
		listCities();
	});

	//function to save searched cities to local storage
	function saveToLocalStorage() {
		localStorage.setItem('mostRecent', city);
		cities.push(city);
		localStorage.setItem('cities', JSON.stringify(cities));
	}

	//function to retrieve user input
	function getCity() {
		city = $('#city-input').val();
		if (city && cities.includes(city) === false) {
			saveToLocalStorage();
			return city;
		} else if (!city) {
			alert('Please enter a valid city');
		}
	}

	// search API for city name

	function search() {
		let queryURL =
			'https://api.openweathermap.org/data/2.5/weather?q=' +
			city +
			'&units=metric&appid=42aab93f919a0108de29c04395767465';
		let coords = [];

		$.ajax({
			url: queryURL,
			method: 'GET',
		}).then(function (response) {
			coords.push(response.coord.lat);
			coords.push(response.coord.lon);
			let cityName = response.name;
			let cityCond = response.weather[0].description.toUpperCase();
			let cityTemp = response.main.temp;
			let cityHum = response.main.humidity;
			let cityWind = response.wind.speed;
			let icon = response.weather[0].icon;
			$('#icon').html(
				`<img src="http://openweathermap.org/img/wn/${icon}@2x.png">`
			);
			$('#city-name').html(cityName + ' ' + '(' + NowMoment + ')');
			$('#city-cond').text('Current Conditions: ' + cityCond);
			$('#temp').text('Current Temp (C): ' + cityTemp.toFixed(1));
			$('#humidity').text('Humidity: ' + cityHum + '%');
			$('#wind-speed').text('Wind Speed: ' + cityWind + 'mph');
			$('#dateOne').text(dayOne);
			$('#dateTwo').text(dayTwo);
			$('#dateThree').text(dayThree);
			$('#dateFour').text(dayFour);
			$('#dateFive').text(dayFive);


      getUV(response.coord.lat, response.coord.lon);
    }).fail(function (){
      alert("Could not get data")
    });


    function getUV(lat, lon) {
      $.ajax({
         url: "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=minutely,hourly" + "&units=metric&appid=42aab93f919a0108de29c04395767465",
         method: "GET",
      }).then(function(response){
        //code to determine UV index 10.07 🙄
        let uvIndex = response.current.uvi;
        $("#uv-index").text("UV Index:" + " " + uvIndex);
        if (uvIndex >= 8) {
          $("#uv-index").css("color", "red");
        } else if (uvIndex > 4 && uvIndex < 8) {
          $("#uv-index").css("color", "yellow");
        } else {
          $("#uv-index").css("color", "lime");
        }
        let cityHigh = response.daily[0].temp.max;
        $("#high").text("Expected high (C): " + " " + cityHigh);

      })
    }



}});
