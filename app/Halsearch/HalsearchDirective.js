app.directive('search', function() {
  return {

    template: '<div class="ui two column centered grid"><div id="countryinfo" class="ui message column"></div></div><div class="ui two column centered grid"><div class="column"></div><div class="column"></div><input class="range-slider" type="hidden" value="{{minyear}},{{maxyear}}"></div><div class="ui grid stackable "><div class="column "></div><div id="mapcontainer" class="sixteen wide column ui segment "><h1 class="ui huge header">Country collaboration for HAL collection : {{query}}</h1><div id="loadermap" class="ui active centered inline loader"></div><div class="ui grid"><div class="right floated left aligned four wide column"><button id="mapaspdf" class="ui primary button print" >Export map as pdf</button></div><div class="row"></div></div><div id="map" style=" height: 400px; display: none;"></div></div><div class=" column "></div><div id="datatablecontainer" class=" sixteen wide computer ui segment column "><h1 class="ui huge header">Countries</h1><div id="buttons_country" class="column"></div><table id="country" class="ui unstackable inverted teal table"><thead><tr><th>Country</th><th>Number of publications</th></tr></thead><tbody></tbody></table><div id="loaderdatatable" class="ui active centered inline loader"></div></div></div>',//Template a afficher
    controller:'searchctrl'//Controller a executer
  };
});
