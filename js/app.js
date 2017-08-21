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
	nutritionixURL = "https://api.nutritionix.com/v1_1/search/";
	food = "";
	resultMin = "0";
	resultMax = "6";
	calMin = "cal_min=0";
	calMax = "cal_max=50000";
	fields = "fields=item_name%2Cbrand_name%2Citem_id%2Cnf_calories";
	appID = "appId=c0964a36";
	appKey = "appKey=+4d6ceae5b6d8ba87f064bc7e8e2f8589";
	url = "";

	//search box + example box template
	searchItem = $(".ex-navBar .item-box").clone().removeClass('ex-lsi');
	exItem = $('.ex-lsi').removeClass("list-search-item");

	//search + tracked collections
	searchList = new searchFoodList([]);
	var calItem;
	calList = new trackedFoodList([]);

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