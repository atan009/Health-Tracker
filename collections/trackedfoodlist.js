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