$(window).on("load", function() {
	//Nutrionix search filters
	var nutritionixURL = "https://api.nutritionix.com/v1_1/search/";
	var food = "";
	var resultMin = "0";
	var resultMax = "6";
	var calMin = "cal_min=0";
	var calMax = "cal_max=50000";
	var fields = "fields=item_name%2Cbrand_name%2Citem_id%2Cnf_calories";
	var appID = "appId=c0964a36";
	var appKey = "appKey=+4d6ceae5b6d8ba87f064bc7e8e2f8589";
	var url = "";

	//search box + example box template
	var searchItem = $(".ex-navBar .item-box").clone().removeClass('ex-lsi');
	var exItem = $('.ex-lsi').removeClass("list-search-item");

	//container defaults
	var foodCont = Backbone.Model.extend({
		defaults: {
			name: "",
			brand: "",
			calories: "",
			servingSize: ""
		}

	});
		
	//model
	var foodlist = Backbone.Collection.extend({
		model: foodCont
	});

	//search + tracked collections
	var searchList = new foodlist([]);
	var calItem;
	var calList = new foodlist([]);


	//add all search buttons
	searchList.on("add", function(foodItem) {
		searchItem = searchItem.clone();
		$(".food-name", searchItem).text(foodItem.get("name"));
		$(".brand", searchItem).text(foodItem.get("brand"));
		$(".cal-count", searchItem).text(foodItem.get("calories"));
		$(".serv-sz", searchItem).text(foodItem.get("servingSize"));
		
		//clicking on a search
		searchItem.on('click', function() {
			calList.add(foodItem);
		});
		searchItem.appendTo(".list-search-results");
	});

	//adding tracked food
	calList.on("add", function(foodItem) {
		searchList.reset();
		$(".list-search-results").empty();
		calItem = exItem.clone();
		$(".food-name", calItem).text(foodItem.get("name"));
		$(".brand", calItem).text(foodItem.get("brand"));
		$(".cal-count", calItem).text(foodItem.get("calories"));
		$(".serv-sz", calItem).text(foodItem.get("servingSize"));
		var cal = $('p.total-cal').text();
		var newCal = parseInt(cal.substring(cal.indexOf(' ') + 1, cal.length));
		newCal = newCal + foodItem.get("calories");
		$("p.total-cal").text("Total: "  + newCal);
		calItem.appendTo(".cal-list");

		//removing a tracked food
		calItem.on('click', function() {
			cal = $('p.total-cal').text();
			newCal = parseInt(cal.substring(cal.indexOf(' ') + 1, cal.length));
			newCal = newCal - foodItem.get("calories");
			if (calList.length === 1) {
				newCal = 0;
			}
			$("p.total-cal").text("Total: " + newCal);
			calList.remove(foodItem);
			$(this).remove();
		});
	});

	//search click
	$('.searchButton').on('click', function() {
		//reset search + collection
		searchList.reset();
		$(".list-search-results").empty();

		food = $('.searchBox').val();
		url = nutritionixURL + food + "?results=" + resultMin + "%3A" + resultMax + "&" + calMin + "&" + calMax + "&" + fields + "&" + appID + "&" + appKey;
	
		var foodItem = new foodCont();

		//Nutrionix search request
		$.getJSON(url, function(data) {

		//add items to searchlist collection
		for (var i = 0; i < data.hits.length; i++) {
			foodItem = new foodCont({name: data.hits[i].fields.item_name, 
				brand: data.hits[i].fields.brand_name, 
				calories: data.hits[i].fields.nf_calories, 
				servingSize: data.hits[i].fields.nf_serving_size_qty + " " + data.hits[i].fields.nf_serving_size_unit
			});

			searchList.add(foodItem);
		}

		//error handling Nutrionix API
		}).error(function(e) {
			alert("Error with nutritionix api call");
		});
	});
	

	//retrieve previous tracked calorie list
	var retrievedObject = localStorage.getItem('prevCalList');

	//store current tracked calorie list on closing window
	window.onbeforeunload = function() {
		localStorage.setItem('prevCalList', JSON.stringify(calList));
	};
	
	//set calList to previous tracked list
	if (retrievedObject.length != []) {
		retrievedObject = JSON.parse(retrievedObject);
		for (var i = 0; i < retrievedObject.length; i++) {
			calList.add(retrievedObject[i]);
		}
	}
});