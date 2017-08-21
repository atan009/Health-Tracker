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