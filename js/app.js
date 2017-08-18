$(window).on("load", function() {
	$(".load").hide();
	$(document).on({
		ajaxStart: function() { 
			$(".load").show();
		},

    	ajaxStop: function() {
    		$(".load").hide();
    	}
	});
	    
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
		
	//searchFoodList
	var searchFoodList = Backbone.Collection.extend({
		model: foodCont,

		initialize: function() {
			this.on('add', this.onModelAdded, this);
		},

		onModelAdded: function(model, collection, options) {
			searchItem = searchItem.clone();
			$(".food-name", searchItem).text(model.get("name"));
			$(".brand", searchItem).text(model.get("brand"));
			$(".cal-count", searchItem).text(model.get("calories"));
			$(".serv-sz", searchItem).text(model.get("servingSize"));

			searchItem.on('click', function() {
				calList.add(model);
			});

			searchItem.appendTo(".list-search-results");
		}
	});

	//tracked food list
	var trackedFoodList = Backbone.Collection.extend({
		model: foodCont,

		initialize: function() {
			this.on('add', this.onModelAdded, this);
		},

		onModelAdded: function(model, collection, options) {
			searchList.reset();
			$(".list-search-results").empty();
			calItem = exItem.clone();
			$(".food-name", calItem).text(model.get("name"));
			$(".brand", calItem).text(model.get("brand"));
			$(".cal-count", calItem).text(model.get("calories"));
			$(".serv-sz", calItem).text(model.get("servingSize"));
			var cal = $('p.total-cal').text();
			var newCal = parseInt(cal.substring(cal.indexOf(' ') + 1, cal.length));
			newCal = newCal + model.get("calories");
			$("p.total-cal").text("Total: "  + newCal);
			calItem.appendTo(".cal-list");

			//removing a tracked food
			calItem.on('click', function() {
				cal = $('p.total-cal').text();
				newCal = parseInt(cal.substring(cal.indexOf(' ') + 1, cal.length));
				newCal = newCal - model.get("calories");
				if (calList.length === 1) {
					newCal = 0;
				}
				$("p.total-cal").text("Total: " + newCal);
				calList.remove(model);
				$(this).remove();
			});
		}
	});

	//search + tracked collections
	var searchList = new searchFoodList([]);
	var calItem;
	var calList = new trackedFoodList([]);

	//search click
	var queryView = Backbone.View.extend({

		events: {
			"click .searchButton": "searchFunc"
		},

		searchFunc: function() {
			searchList.reset();
			$(".list-search-results").empty();

			food = $('.searchBox').val();
			url = nutritionixURL + food + "?results=" + resultMin + "%3A" + resultMax + "&" + calMin + "&" + calMax + "&" + fields + "&" + appID + "&" + appKey;
		
			var foodItem = new foodCont();

			//Nutrionix search request
			$.getJSON(url, function(data) {

			//add items to searchlist collection
			if (data.hits.length === 0) {
				alert("No search results found");
			}

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
		}
	});

	var searchView = new queryView({ el: $("#headerBar")});

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