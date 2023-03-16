(function () {
'use strict';

angular.module('NarrowItDownApp', [])
.controller('NarrowItDownController', NarrowItDownController )
.service('MenuSearchService', MenuSearchService)
.constant('ApiBasePath', "https://coursera-jhu-default-rtdb.firebaseio.com")
.directive('foundItems', FoundItemsDirective);

function FoundItemsDirective() {
  var ddo = {
    templateUrl: 'foundItems.html',
    scope: {
      items: '<',
      onRemove: '&'
    },
    controller: FoundItemsDirectiveController,
    controllerAs: 'list',
    bindToController: true
  };

  return ddo;
}

function FoundItemsDirectiveController() {
  var list = this;
  list.checkFoundList = function () {
	return typeof list.items !== 'undefined' && list.items.length === 0
  };
}

NarrowItDownController.$inject = ['MenuSearchService'];
function NarrowItDownController(MenuSearchService) {
  var narrowItCtrl = this;
  
  narrowItCtrl.narrowItDown = function (searchTerm) {
  console.log(searchTerm)
	if (searchTerm) {
		var promise = MenuSearchService.getMatchedMenuItems(searchTerm);
		promise.then(function (response) {
		  narrowItCtrl.found = response;
		})
		.catch(function (error) {
		  console.log(error);
		});
	} else {
		narrowItCtrl.found = [];
	}
	
  };
  
  narrowItCtrl.removeItem = function (itemIndex) {
    this.lastRemoved = "Last item removed was " + narrowItCtrl.found[itemIndex].name;
    narrowItCtrl.found.splice(itemIndex, 1);
  };

}

MenuSearchService.$inject = ['$http', 'ApiBasePath'];
function MenuSearchService($http, ApiBasePath) {
  var service = this;

  service.getMatchedMenuItems = function (searchTerm) {
	return $http({
      method: "GET",
      url: (ApiBasePath + "/menu_items.json")
    }).then(function (response) {
    var sumit = response.data
    console.log(sumit)
		var foundItems = [];
		var menuItemsLength = response.data.A.menu_items.length;
		for (var i = 0; i < menuItemsLength; i++) {
			var item = response.data.A.menu_items[i];
			if (item.description.indexOf(searchTerm) !== -1) {
				foundItems.push(item);
			}
		};
		return foundItems;
    });
  };
}

})();
