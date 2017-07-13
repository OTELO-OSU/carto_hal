var app=angular.module('cartoHal', []); // Definition de l'application angular

app.controller('searchctrl',['$scope','$rootScope','$http', function($scope,$rootScope, $http) { //ajout a l'application du controller searchctrl

		/**
         * methode array unique
         * @param: array
    	*/
	 $scope.unique=function(array){
	    return array.filter(function(el, index, arr) {
	        return index == arr.indexOf(el);
	    });
	}

	/**
         * methode de requete vers l'API HAL
         *
    */


    $scope.search=function(){
    	$scope.searchtoAPI(false);

    }



	$scope.searchtoAPI=function(querydate,val){
		$('#countryinfo').hide();
		$('#country').hide();
		$('#map').hide();
		$('#countryinfo').empty();
		if ($rootScope.ConfigDefault.DisplayDatatable===true) {
			$("#loaderdatatable").show();
			$("#datatablecontainer").show();
			$("#mapcontainer").removeClass('centered');
		}
		else{
			$("#loaderdatatable").hide();
			$("#datatablecontainer").hide();
			$("#mapcontainer").addClass('centered');
		}

		if ($rootScope.ConfigDefault.DisplayMap===true) {
			$("#mapcontainer").show();
			$("#loadermap").show();
			$("#datatablecontainer").removeClass('centered');
		}
		else{
			$("#mapcontainer").hide();
			$("#loadermap").hide();
			$("#datatablecontainer").addClass('centered');
		}
		var url=$rootScope.ConfigDefault.ApiURL;
		var resultSize=$rootScope.ConfigDefault.ResultSize;
		if (querydate==false) {
			$http.get(url+'/search/'+$scope.query+'?fl=docid,instStructCountry_s,producedDateY_i&rows='+resultSize).
	        then(function(response) {
	        	$scope.docs = response.data.response.docs;
	        	years=[];
	        	for (doc in $scope.docs) {
	        		year=$scope.docs[doc].producedDateY_i;
	        		years.push(year);
	        	}
	        	$scope.minyear=Math.min.apply(null, years);
	        	$scope.maxyear=Math.max.apply(null, years);
	        	$('.range-slider').jRange({
				    from:$scope.minyear ,
				    to: $scope.maxyear,
				    step: 1,
				   	format: '%s',
				    width: 300,
				    showLabels: true,
				    isRange : true,
				     ondragend: function(val){
				         $scope.searchtoAPI(true,val);      
				        },
				     onbarclicked: function(val){
				         $scope.searchtoAPI(true,val);      
				       	}
			});

	        	$('.range-slider').jRange('setValue', $scope.minyear+','+$scope.maxyear);
	        	$scope.parsingdata(response);
	        });
		}
		else{
				range=val.split(",", 2);
				min=range[0];
				max=range[1];
				$http.get(url+'/search/'+$scope.query+'?fl=docid,instStructCountry_s&rows='+resultSize+'&fq=producedDateY_i:['+min+'%20TO%20'+max+']').
	      		then(function(response) {
	        	$scope.parsingdata(response);
	        	});
			}

		}

	if ($rootScope.ConfigDefault.query) {
		$scope.query=$rootScope.ConfigDefault.query;
		$scope.search();
	}

	$scope.parsingdata=function(response){
        	var nocountrycode=0;
            $scope.docs = response.data.response.docs;
        	 $.getJSON("app/js/countries.json", function(json) {
    			bigarray=[];
    			for (doc in $scope.docs) {
    			 	countrycodes=$scope.docs[doc].instStructCountry_s;
    			 	if (countrycodes) {
    			 	countrycodes=countrycodes.map(function(x){ return x.toUpperCase() })
    			 	countrycodes=$scope.unique(countrycodes)
    			 		for (countrycode in countrycodes) {
    				array=[]
    			 			countrycode=countrycodes[countrycode]
	    			 		countrycode=countrycode.toUpperCase();
		    				array.push(countrycode)
		    				bigarray.push(array);
    			 		}
    				 }
    				 else{
    				 	nocountrycode+=1;
    				 } 
    			}
    			arrayofcountrycode=[];
    			for (countrycode in bigarray) {
    				$.each(bigarray[countrycode],function(key,value){
    					arrayofcountrycode.push(value);
    				})
    			}

    			var counts = {};			
				arrayofcountrycode.forEach(function(x) { counts[x] = (counts[x] || 0)+1; });
    			var total = (nocountrycode/response.data.response.numFound)*100;
			    total = total*100;          
			    total= Math.round(total); 
			    total= total/100; 
			    $('#countryinfo').append('<h5>'+response.data.response.numFound+' records founds.</h5>');
			    $('#countryinfo').show();
			    if (nocountrycode!=0) {
			    $('#countryinfo').empty();
			    $('#countryinfo').append('<h5>'+nocountrycode+' records of '+response.data.response.numFound+'  ('+total+'%) do not contain data in the field being analyzed.</h5>');
			    $('#countryinfo').show();
			    } 

	    			arrayrender=[]
					$.each(counts, function(countrycode, value) {
						array=[]
    			 		if (json.hasOwnProperty(countrycode)){
    			 			lat=json[countrycode].coords[0];
    			 			lon=json[countrycode].coords[1];
    			 			countryname='<i class="'+countrycode.toLowerCase()+' flag"></i>'+json[countrycode].name;
    			 			array.push(countryname);
    			 			array.push(value);
    			 			array.push(lat);
    			 			array.push(lon);
    			 			arrayrender.push(array);
    			 		}
					});

			if ($rootScope.ConfigDefault.DisplayMap===true) {
        	 $scope.rendering_on_map(arrayrender);
			}
			if ($rootScope.ConfigDefault.DisplayDatatable===true) {
        	 $scope.generate_datatable(arrayrender);

			}
				});
        	
	}



		/**
         * methode rendering_on_map : append les markers sur la carte leaflet
         * @param: arrayrender (tableau contenant les pays avec leur nombres et leur données gps)
    	*/
	$scope.rendering_on_map=function(arrayrender){
				if (typeof(mymap)!='undefined') {
					mymap.remove();
				}
				$('#map').show();
		        mymap = L.map('map').setView([51.505, -0.09], 4); //declaration de la map leaflet
		   		mymap.options.maxZoom = 5;
		       	L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(mymap); 	
    			 var markers = [] ;
    			 	base=4;
		    		coef=0.6;
		    		div=4;
	    		$.each(arrayrender, function(key, value) {
	    			occurence=value[1];
	    			if (occurence==1) {
						var radius=base;
					}
					else{
						var radius=occurence*coef;
						radius=radius/div;
					}
					if (radius>40) {
						var radius=occurence*coef;
						radius=radius/div;
					}
					if (radius<7) {
						radius=7;
					}
					if (radius>100) {
						radius=100;
					}
	    			color = '#'+Math.floor(Math.random()*16777215).toString(16);
	    			var circle = L.circleMarker([value[2],value[3]], {
						color: color,
						fillColor: color ,
						fillOpacity: 0.5,
						radius: radius
					}); // creation d'un marker
					circle.bindPopup("Country: "+value[0]+"<br>Number of publications: "+value[1]);
					circle.on('mouseover', function (e) {
		            	this.openPopup();
			        });
			        circle.on('mouseout', function (e) {
			            this.closePopup();
			        });

					circle.bindTooltip("<b>"+value[1]+"</b>",{ noHide: true ,permanent:true,direction:'center'}).openTooltip();
					markers.push(circle);// push du marker dans le tableau

	    		});
	    		if (typeof(group)!=='undefined') { // si une layer existe deja on la supprime
    				mymap.removeLayer(group);
   			 	}
	      		group = L.featureGroup(markers); // on met le groupe de markers dans une layer
	      		group.addTo(mymap); // on l'ajoute a la map
		        bounds = group.getBounds();	// on obtient le bounds pour placer la vue
		        mymap.invalidateSize();  //Resize de la map hidden div
				mymap.fitBounds(bounds); // zoom sur la partie qui des poi qui nous interessent
				$('.print').off('click');
				$('.print').on('click', function() {//print de la map
					$.print("#map",{title:"Map of publications per country for collection : "+$scope.query});
				});
				$("#loadermap").hide();
				$("#mapaspdf").show();
				


	}

		/**
         * methode generate_datatable: construit le tableau datatable
         * @param: arrayrender (tableau contenant les pays avec leur nombres et leur données gps)
    	*/

	$scope.generate_datatable=function(arrayrender){	
		$('#country').show();
		var table = $('#country').DataTable( {
		  data:arrayrender,
          lengthChange: false,
          destroy:true,
          "pageLength": 5, "order": [[ 1, "desc" ]], // pagination du tableau precedemment crée
          "pagingType": "numbers",  
          responsive: true,
          dom: 'frtip',
          "autoWidth": false
        } );
      	var buttons = new $.fn.dataTable.Buttons(table, {
	     buttons: [{extend:'csvHtml5',text:'Export CSV',title: $scope.query+"_country",className:'ui primary button'}]
		}).container().appendTo($('#buttons_country'));
		$("#loaderdatatable").hide();

	}
   
}]);
