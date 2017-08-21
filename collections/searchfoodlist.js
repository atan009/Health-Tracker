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