(function () {
  'use strict';
  angular
      .module('ng-autocomplete', ['ngMaterial'])
      .controller('DemoCtrl', DemoCtrl);

  function DemoCtrl ($q, $log, $filter, $http) {
    var vm = this;

    vm.simulateQuery = true;
    vm.querySearch   = querySearch;
    vm.selectedItemChange = selectedItemChange;
    //vm.contactsSelectedRemove = contactsSelectedRemove;
    //vm.contactsSelected = [];
    vm.contactsLoaded = [];
    vm.deferred = null;

    function querySearch (query) {
      console.log("query");
      console.log(query);
      vm.deferred = $q.defer();
      var jsonquery = "";
      if(query!==null)
        jsonquery = "&$where=name like '%25"+query+"%25'";

      // exclude already selected names:
      // vm.contactsSelected.map(function(as){
      //   if(jsonquery=="")
      //     jsonquery = "&$where=";
      //   else
      //     jsonquery = jsonquery+" AND ";
      //   jsonquery = jsonquery+"name not like '"+as.name+"'";
      // });

      console.log(query);
      console.log(jsonquery);
      $http({method: 'GET', url: 'https://open.whitehouse.gov/resource/9j92-xfdk.json?$limit=100'+jsonquery}).then(
      function successCallback(response) {
        // agregado nuevo
        var data = response.data;
        var dataCount = data.length;
        for (var i = 0; i < dataCount; i++) {
          var num = i +1;
          // crear nueva variable
          data[i].value = angular.lowercase(data[i].name);
          data[i].name = num +"- " + data[i].name;
        }
        // fin agregado
        vm.deferred.resolve( vm.contactsLoaded = response.data );
      },
      function errorCallback(response) {});
      return vm.deferred.promise;
    }

    function selectedItemChange(item) {
      $log.info('Item changed to ' + JSON.stringify(item));
      // $log.info('Item changed to ' + JSON.stringify(item));
      // if(item)
      // {
      //   //check if item is already selected
      //   if($filter('filter')(vm.contactsSelected, function (d) {return d.name === item.name;})[0])
      //     {
      //       $log.info('Item already selected. Will not add it again.');
      //     }
      //   else
      //     {
      //       //add id to object
      //       vm.contactsSelected.push(item);
      //     }
      //   // clear search field
      //   vm.searchText = '';
      //   vm.selectedItem = undefined;
      //
      //   //somehow blur the autocomplete focus
      //   //$mdAutocompleteCtrl.blur();
      //   document.getElementById("contactAc").blur();
      // }
    }

    function contactsSelectedRemove(item) {
      var index = vm.contactsSelected.indexOf(item);
      vm.contactsSelected.splice(index, 1);
    }
  }
})();
