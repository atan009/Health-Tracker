$(window).on("load", function() {
	//filler test
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

	$('.ex-lsi').removeClass("list-search-item");


	$('.searchButton').on('click', function() {
		food = $('.searchBox').val();
		url = nutritionixURL + food + "?results=" + resultMin + "%3A" + resultMax + "&" + calMin + "&" + calMax + "&" + fields + "&" + appID + "&" + appKey;
	

		$.getJSON(url, function(data) {
		//TODO: does stuff here
		console.log(JSON.stringify(data));
		}).error(function(e) {
			alert("Error with nutritionix api call");
		});


	});

	
});