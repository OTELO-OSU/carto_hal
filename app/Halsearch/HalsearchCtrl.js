var app=angular.module('cartoHal', []); // Definition de l'application angular

app.controller('searchctrl',['$scope','$rootScope','$http','$q', function($scope,$rootScope, $http,$q) { //ajout a l'application du controller searchctrl

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

			var documentype_query="";
		if ($rootScope.ConfigDefault.DocumentType!="") {
			var documentype=$rootScope.ConfigDefault.DocumentType;
			documentype=documentype.split(",");
			var documentype_query="";
			documentype.forEach(function(e){
			   documentype_query+= e + " OR ";
			});
			documentype_query_app='('+documentype_query.trim(" OR ").slice(0, -2)+')';
			documentype_query='&fq=docType_s:('+documentype_query.trim(" OR ").slice(0, -2)+')';
		}
		$scope.documentype_query=documentype_query_app;
		var url=$rootScope.ConfigDefault.ApiURL;
		if (querydate==false) {
			$http.get(url+'/search/'+$scope.query+'?fl=structCountry_s,producedDateY_i&rows=10000'+documentype_query).
	        then(function(response) {
	        	var totaldocs=response.data.response.numFound;
		        if (totaldocs>10000) {	
		        	$scope.docs=response.data.response.docs;
		        	$scope.array=[];	
		        	var arr = [];     
		        	var array=[];   	
		        	for (var i = 10000 ; i <= totaldocs; i+=10000) {
		        		arr.push($http.get(url+'/search/'+$scope.query+'?fl=structCountry_s,producedDateY_i&rows=10000'+documentype_query+'&start='+i));	
		        	}
					$q.all(arr).then(function (ret) {
		        	angular.forEach(ret,function(index){
		        		array=array.concat(index.data.response.docs);
		        	})
				    
		        	$scope.docs=array.concat($scope.docs);
					$scope.getyears(response);
				});
		        }	
		        else{   	
	        	$scope.docs = response.data.response.docs;
	        	$scope.getyears(response);
		        }
	        
	        });
		}
		else{
				range=val.split(",", 2);
				min=range[0];
				max=range[1];
				$http.get(url+'/search/'+$scope.query+'?fl=structCountry_s,producedDateY_i&rows=10000&fq=producedDateY_i:['+min+'%20TO%20'+max+']'+documentype_query).
	      		then(function(response) {
	      			var totaldocs=response.data.response.numFound;
	      			if (totaldocs>10000) {	
		        	$scope.docs=response.data.response.docs;
		        	$scope.array=[];	
		        	var arr = [];     
		        	var array=[];   	
		        	for (var i = 10000 ; i <= totaldocs; i+=10000) {
		        		arr.push($http.get(url+'/search/'+$scope.query+'?fl=structCountry_s,producedDateY_i&rows=10000&fq=producedDateY_i:['+min+'%20TO%20'+max+']'+documentype_query+'&start='+i));	
		        	}
					$q.all(arr).then(function (ret) {
		        	angular.forEach(ret,function(index){
		        		array=array.concat(index.data.response.docs);
		        	})
				    
		        	$scope.docs=array.concat($scope.docs);
					$scope.getyears(response);
				});
		        }
		        else{	
		        	$scope.docs = response.data.response.docs;
		        	$scope.getyears(response);
		        }	
	        	});
			}

		}

	if ($rootScope.ConfigDefault.query) {
		$scope.query=$rootScope.ConfigDefault.query.toUpperCase();
		$scope.search();
	}


	$scope.getyears=function(response){
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
	}

	$scope.parsingdata=function(response){
        	var nocountrycode=0;
        	 $.getJSON("app/js/countries.json", function(json) {
    			bigarray=[];
    			for (doc in $scope.docs) {
    			 	countrycodes=$scope.docs[doc].structCountry_s;
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
    			 			array.push(countrycode);
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
	    		$.each(arrayrender, function(key, value) {
    			 	if (value[1]<=300) {
    			 		coef=1.3;
		    			div=5;
    			 	}
    			 	else if (value[1]>300 && value[1]<600) {
    			 		coef=0.6;
		    			div=3;
    			 	}
    			 	else{
    			 		coef=0.4;
		    			div=2;
    			 	} 		
		    		fillOpacity=0.5;
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
					if (radius>90) {
						radius=90;
					}
	    			color = '#'+Math.floor(Math.random()*16777215).toString(16);
					if (value[4]=="FR") {
						color="#FFFFFF";
						fillOpacity=0.0;
						radius=7;
					}
	    			var circle = L.circleMarker([value[2],value[3]], {
						color: color,
						fillColor: color ,
						fillOpacity: fillOpacity,
						radius: radius
					}); // creation d'un marker


					circle.bindPopup("Country: "+value[0]+"<br>Number of publications: "+value[1]);
					circle.on('mouseover', function (e) {
		            	this.openPopup();
			        });
			        circle.on('click', function (e) {
		      			window.open("https://hal.archives-ouvertes.fr/search/index/?qa%5BstructCountry_t%5D%5B%5D="+value[4]+"&qa%5BcollCode_s%5D%5B%5D="+$scope.query+"&qa[producedDateY_i][]=["+$scope.minyear+" TO "+$scope.maxyear+"]&qa[docType_s][]="+$scope.documentype_query+"&qa%5Btext%5D%5B%5D=&submit_advanced=Search&rows=30","__blank"); 
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
					$.print("#map",{title:"Country collaboration for collection HAL : "+$scope.query});
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
