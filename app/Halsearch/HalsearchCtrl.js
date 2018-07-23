var app = angular.module('cartoHal', []); // Definition de l'application angular

app.controller('searchctrl', ['$scope', '$rootScope', '$http', '$q', function($scope, $rootScope, $http, $q) { //ajout a l'application du controller searchctrl

    /**
     * methode de requete vers l'API HAL
     *
     */
    $scope.search = function() {
        $scope.searchtoAPI(false);
    }
    $scope.searchtoAPI = function(querydate, val) {
        $('#countryinfo').hide();
        $('#country').hide();
        $('#map').hide();
        $('#countryinfo').empty();
        if ($rootScope.ConfigDefault.DisplayDatatable === true) {
            $("#loaderdatatable").show();
            $("#datatablecontainer").show();
            $("#mapcontainer").removeClass('centered');
        } else {
            $("#loaderdatatable").hide();
            $("#datatablecontainer").hide();
            $("#mapcontainer").addClass('centered');
        }

        if ($rootScope.ConfigDefault.DisplayMap === true) {
            $("#mapcontainer").show();
            $("#loadermap").show();
            $("#datatablecontainer").removeClass('centered');
        } else {
            $("#mapcontainer").hide();
            $("#loadermap").hide();
            $("#datatablecontainer").addClass('centered');
        }

        var documentype_query = "";
        var documentype_query_app = ""
        if ($rootScope.ConfigDefault.DocumentType != "") {
            var documentype = $rootScope.ConfigDefault.DocumentType;
            documentype = documentype.split(",");
            var documentype_query = "";
            documentype.forEach(function(e) {
                documentype_query += e + " OR ";
            });
            documentype_query_app = '(' + documentype_query.trim(" OR ").slice(0, -2) + ')';
            documentype_query = '&fq=docType_s:(' + documentype_query.trim(" OR ").slice(0, -2) + ')';
        }
        $scope.documentype_query = documentype_query_app;
        var url = $rootScope.ConfigDefault.ApiURL;
        if (querydate == false) {
            $http.get(url + '/search/' + $scope.query + '?rows=0&facet=true&facet.field='+$rootScope.ConfigDefault.CountryField+'&facet.field=producedDateY_i' + documentype_query).
            then(function(response) {
                $scope.build_response(response);
            });
        } else {
            range = val.split(",", 2);
            min = range[0];
            max = range[1];
            $http.get(url + '/search/' + $scope.query + '?rows=0&facet=true&facet.field='+$rootScope.ConfigDefault.CountryField+'&facet.field=producedDateY_i&fq=producedDateY_i:[' + min + '%20TO%20' + max + ']' + documentype_query).
            then(function(response) {
                $scope.build_response(response);
            });
        }

    }

    if ($rootScope.ConfigDefault.query) {
        $scope.query = $rootScope.ConfigDefault.query.toUpperCase();
        $scope.search();
    }

    $scope.build_response = function(response) {
    	CountryField=$rootScope.ConfigDefault.CountryField;
  		$scope.country = response.data.facet_counts.facet_fields[CountryField];
                var country = [];
                var date = [];
                var current_item;
                for (item in $scope.country) {
                    if (typeof $scope.country[item] == "string") {
                        current_item = $scope.country[item].toUpperCase();
                    }
                    if (typeof $scope.country[item] == "number") {
                        if ($scope.country[item] == 0) {} else {
                            if (country[current_item]) {

                                country[current_item] = country[current_item] + $scope.country[item];
                            } else {
                                country[current_item] = $scope.country[item];
                            }
                        }
                    }
                }
                $scope.date = response.data.facet_counts.facet_fields.producedDateY_i;
                var current_item_date;
                for (item in $scope.date) {
                    if (typeof $scope.date[item] == "string") {
                        current_item_date = $scope.date[item];
                    }

                    if (typeof $scope.date[item] == "number") {
                        if ($scope.date[item] == 0) {} else {

                            date.push(current_item_date);
                        }
                    }

                }
                $scope.country = country;
                $scope.date = date;
                $scope.getyears(response);
	}



    $scope.getyears = function(response) {
        years = [];

        $scope.minyear = Math.min.apply(null, $scope.date);
        $scope.maxyear = Math.max.apply(null, $scope.date);
        $('.range-slider').jRange({
            from: $scope.minyear,
            to: $scope.maxyear,
            step: 1,
            format: '%s',
            width: 300,
            showLabels: true,
            isRange: true,
            ondragend: function(val) {
                $scope.searchtoAPI(true, val);
            },
            onbarclicked: function(val) {
                $scope.searchtoAPI(true, val);
            }
        });

        $('.range-slider').jRange('setValue', $scope.minyear + ',' + $scope.maxyear);
        $scope.parsingdata(response);
    }

    $scope.parsingdata = function(response) {
    	$scope.NumFound=response.data.response.numFound;
        json = {
            "AF": {
                "name": "Afghanistan",
                "coords": [33, 65]
            },
            "AL": {
                "name": "Albania",
                "coords": [41, 20]
            },
            "DZ": {
                "name": "Algeria",
                "coords": [28, 3]
            },
            "AO": {
                "name": "Angola",
                "coords": [-12.5, 18.5]
            },
            "AR": {
                "name": "Argentina",
                "coords": [-34, -64]
            },
            "AM": {
                "name": "Armenia",
                "coords": [40, 45]
            },
            "AU": {
                "name": "Australia",
                "coords": [-27, 133]
            },
            "AT": {
                "name": "Austria",
                "coords": [47.3333, 13.3333]
            },
            "AZ": {
                "name": "Azerbaijan",
                "coords": [40.5, 47.5]
            },
            "BS": {
                "name": "Bahamas",
                "coords": [24.25, -76]
            },
            "BD": {
                "name": "Bangladesh",
                "coords": [24, 90]
            },
            "BY": {
                "name": "Belarus",
                "coords": [53, 28]
            },
            "BE": {
                "name": "Belgium",
                "coords": [50.8333, 4]
            },
            "BZ": {
                "name": "Belize",
                "coords": [17.25, -88.75]
            },
            "BJ": {
                "name": "Benin",
                "coords": [9.5, 2.25]
            },
            "BT": {
                "name": "Bhutan",
                "coords": [27.5, 90.5]
            },
            "BO": {
                "name": "Bolivia",
                "coords": [-17, -65]
            },
            "BA": {
                "name": "Bosnia and Herz.",
                "coords": [44, 18]
            },
            "BW": {
                "name": "Botswana",
                "coords": [-22, 24]
            },
            "BR": {
                "name": "Brazil",
                "coords": [-10, -55]
            },
            "BN": {
                "name": "Brunei",
                "coords": [4.5, 114.6667]
            },
            "BG": {
                "name": "Bulgaria",
                "coords": [43, 25]
            },
            "BF": {
                "name": "Burkina Faso",
                "coords": [13, -2]
            },
            "BI": {
                "name": "Burundi",
                "coords": [-3.5, 30]
            },
            "KH": {
                "name": "Cambodia",
                "coords": [13, 105]
            },
            "CM": {
                "name": "Cameroon",
                "coords": [6, 12]
            },
            "CA": {
                "name": "Canada",
                "coords": [60, -95]
            },
            "CF": {
                "name": "Central African Rep.",
                "coords": [7, 21]
            },
            "TD": {
                "name": "Chad",
                "coords": [15, 19]
            },
            "CL": {
                "name": "Chile",
                "coords": [-30, -71]
            },
            "CN": {
                "name": "China",
                "coords": [35, 105]
            },
            "CO": {
                "name": "Colombia",
                "coords": [4, -72]
            },
            "CG": {
                "name": "Congo",
                "coords": [-1, 15]
            },
            "CR": {
                "name": "Costa Rica",
                "coords": [10, -84]
            },
            "HR": {
                "name": "Croatia",
                "coords": [45.1667, 15.5]
            },
            "CU": {
                "name": "Cuba",
                "coords": [21.5, -80]
            },
            "CY": {
                "name": "Cyprus",
                "coords": [35, 33]
            },
            "CZ": {
                "name": "Czech Rep.",
                "coords": [49.75, 15.5]
            },
            "CI": {
                "name": "Côte d'Ivoire",
                "coords": [8, -5]
            },
            "CD": {
                "name": "Dem. Rep. Congo",
                "coords": [0, 25]
            },
            "KP": {
                "name": "Dem. Rep. Korea",
                "coords": [40, 127]
            },
            "DK": {
                "name": "Denmark",
                "coords": [56, 10]
            },
            "DJ": {
                "name": "Djibouti",
                "coords": [11.5, 43]
            },
            "DO": {
                "name": "Dominican Rep.",
                "coords": [19, -70.6667]
            },
            "EC": {
                "name": "Ecuador",
                "coords": [-2, -77.5]
            },
            "EG": {
                "name": "Egypt",
                "coords": [27, 30]
            },
            "SV": {
                "name": "El Salvador",
                "coords": [13.8333, -88.9167]
            },
            "GQ": {
                "name": "Eq. Guinea",
                "coords": [2, 10]
            },
            "ER": {
                "name": "Eritrea",
                "coords": [15, 39]
            },
            "EE": {
                "name": "Estonia",
                "coords": [59, 26]
            },
            "ET": {
                "name": "Ethiopia",
                "coords": [8, 38]
            },
            "FK": {
                "name": "Falkland Is.",
                "coords": [-51.75, -59]
            },
            "FJ": {
                "name": "Fiji",
                "coords": [-18, 175]
            },
            "FI": {
                "name": "Finland",
                "coords": [64, 26]
            },
            "TF": {
                "name": "Fr. S. Antarctic Lands",
                "coords": [-43, 67]
            },
            "FR": {
                "name": "France",
                "coords": [46, 2]
            },
            "GA": {
                "name": "Gabon",
                "coords": [-1, 11.75]
            },
            "GM": {
                "name": "Gambia",
                "coords": [13.4667, -16.5667]
            },
            "GE": {
                "name": "Georgia",
                "coords": [42, 43.5]
            },
            "DE": {
                "name": "Germany",
                "coords": [51, 9]
            },
            "GH": {
                "name": "Ghana",
                "coords": [8, -2]
            },
            "GR": {
                "name": "Greece",
                "coords": [39, 22]
            },
            "GL": {
                "name": "Greenland",
                "coords": [72, -40]
            },
            "GT": {
                "name": "Guatemala",
                "coords": [15.5, -90.25]
            },
            "GN": {
                "name": "Guinea",
                "coords": [11, -10]
            },
            "GW": {
                "name": "Guinea-Bissau",
                "coords": [12, -15]
            },
            "GY": {
                "name": "Guyana",
                "coords": [5, -59]
            },
            "HT": {
                "name": "Haiti",
                "coords": [19, -72.4167]
            },
            "HN": {
                "name": "Honduras",
                "coords": [15, -86.5]
            },
            "HU": {
                "name": "Hungary",
                "coords": [47, 20]
            },
            "IS": {
                "name": "Iceland",
                "coords": [65, -18]
            },
            "IN": {
                "name": "India",
                "coords": [20, 77]
            },
            "ID": {
                "name": "Indonesia",
                "coords": [-5, 120]
            },
            "IR": {
                "name": "Iran",
                "coords": [32, 53]
            },
            "IQ": {
                "name": "Iraq",
                "coords": [33, 44]
            },
            "IE": {
                "name": "Ireland",
                "coords": [53, -8]
            },
            "IL": {
                "name": "Israel",
                "coords": [31.5, 34.75]
            },
            "IT": {
                "name": "Italy",
                "coords": [42.8333, 12.8333]
            },
            "JM": {
                "name": "Jamaica",
                "coords": [18.25, -77.5]
            },
            "JP": {
                "name": "Japan",
                "coords": [36, 138]
            },
            "JO": {
                "name": "Jordan",
                "coords": [31, 36]
            },
            "KZ": {
                "name": "Kazakhstan",
                "coords": [48, 68]
            },
            "KE": {
                "name": "Kenya",
                "coords": [1, 38]
            },
            "KR": {
                "name": "Korea",
                "coords": [37, 127.5]
            },
            "KW": {
                "name": "Kuwait",
                "coords": [29.3375, 47.6581]
            },
            "KG": {
                "name": "Kyrgyzstan",
                "coords": [41, 75]
            },
            "LA": {
                "name": "Lao PDR",
                "coords": [18, 105]
            },
            "LV": {
                "name": "Latvia",
                "coords": [57, 25]
            },
            "LB": {
                "name": "Lebanon",
                "coords": [33.8333, 35.8333]
            },
            "LS": {
                "name": "Lesotho",
                "coords": [-29.5, 28.5]
            },
            "LR": {
                "name": "Liberia",
                "coords": [6.5, -9.5]
            },
            "LY": {
                "name": "Libya",
                "coords": [25, 17]
            },
            "LT": {
                "name": "Lithuania",
                "coords": [56, 24]
            },
            "LU": {
                "name": "Luxembourg",
                "coords": [49.75, 6.1667]
            },
            "MK": {
                "name": "Macedonia",
                "coords": [41.8333, 22]
            },
            "MG": {
                "name": "Madagascar",
                "coords": [-20, 47]
            },
            "MW": {
                "name": "Malawi",
                "coords": [-13.5, 34]
            },
            "MY": {
                "name": "Malaysia",
                "coords": [2.5, 112.5]
            },
            "ML": {
                "name": "Mali",
                "coords": [17, -4]
            },
            "MR": {
                "name": "Mauritania",
                "coords": [20, -12]
            },
            "MX": {
                "name": "Mexico",
                "coords": [23, -102]
            },
            "MD": {
                "name": "Moldova",
                "coords": [47, 29]
            },
            "MN": {
                "name": "Mongolia",
                "coords": [46, 105]
            },
            "ME": {
                "name": "Montenegro",
                "coords": [42, 19]
            },
            "MA": {
                "name": "Morocco",
                "coords": [32, -5]
            },
            "MZ": {
                "name": "Mozamb",
                "coords": [-18.25, 35]
            },
            "MM": {
                "name": "Myanmar",
                "coords": [22, 98]
            },
            "NA": {
                "name": "Namibia",
                "coords": [-22, 17]
            },
            "NP": {
                "name": "Nepal",
                "coords": [28, 84]
            },
            "NL": {
                "name": "Netherlands",
                "coords": [52.5, 5.75]
            },
            "NC": {
                "name": "New Caledonia",
                "coords": [-21.5, 165.5]
            },
            "NZ": {
                "name": "New Zealand",
                "coords": [-41, 174]
            },
            "NI": {
                "name": "Nicaragua",
                "coords": [13, -85]
            },
            "NE": {
                "name": "Niger",
                "coords": [16, 8]
            },
            "NG": {
                "name": "Nigeria",
                "coords": [10, 8]
            },
            "NO": {
                "name": "Norway",
                "coords": [62, 10]
            },
            "OM": {
                "name": "Oman",
                "coords": [21, 57]
            },
            "PK": {
                "name": "Pakistan",
                "coords": [30, 70]
            },
            "PS": {
                "name": "Palestine",
                "coords": [32, 35.25]
            },
            "PA": {
                "name": "Panama",
                "coords": [9, -80]
            },
            "PG": {
                "name": "Papua New Guinea",
                "coords": [-6, 147]
            },
            "PY": {
                "name": "Paraguay",
                "coords": [-23, -58]
            },
            "PE": {
                "name": "Peru",
                "coords": [-10, -76]
            },
            "PH": {
                "name": "Philippines",
                "coords": [13, 122]
            },
            "PL": {
                "name": "Poland",
                "coords": [52, 20]
            },
            "PT": {
                "name": "Portugal",
                "coords": [39.5, -8]
            },
            "PR": {
                "name": "Puerto Rico",
                "coords": [18.25, -66.5]
            },
            "QA": {
                "name": "Qatar",
                "coords": [25.5, 51.25]
            },
            "RO": {
                "name": "Romania",
                "coords": [46, 25]
            },
            "RU": {
                "name": "Russia",
                "coords": [60, 100]
            },
            "RW": {
                "name": "Rwanda",
                "coords": [-2, 30]
            },
            "SS": {
                "name": "S. Sudan"
            },
            "SA": {
                "name": "Saudi Arabia",
                "coords": [25, 45]
            },
            "SN": {
                "name": "Senegal",
                "coords": [14, -14]
            },
            "RS": {
                "name": "Serbia",
                "coords": [44, 21]
            },
	    "SG": {
                "name": "Singapore",
                "coords": [1, 103]
            },
            "SL": {
                "name": "Sierra Leone",
                "coords": [8.5, -11.5]
            },
            "SK": {
                "name": "Slovakia",
                "coords": [48.6667, 19.5]
            },
            "SI": {
                "name": "Slovenia",
                "coords": [46, 15]
            },
            "SB": {
                "name": "Solomon Is.",
                "coords": [-8, 159]
            },
            "SO": {
                "name": "Somalia",
                "coords": [10, 49]
            },
            "ZA": {
                "name": "South Africa",
                "coords": [-29, 24]
            },
            "ES": {
                "name": "Spain",
                "coords": [40, -4]
            },
            "LK": {
                "name": "Sri Lanka",
                "coords": [7, 81]
            },
            "SD": {
                "name": "Sudan",
                "coords": [15, 30]
            },
            "SR": {
                "name": "Suriname",
                "coords": [4, -56]
            },
            "SZ": {
                "name": "Swaziland",
                "coords": [-26.5, 31.5]
            },
            "SE": {
                "name": "Sweden",
                "coords": [62, 15]
            },
            "CH": {
                "name": "Switzerland",
                "coords": [47, 8]
            },
            "SY": {
                "name": "Syria",
                "coords": [35, 38]
            },
            "TW": {
                "name": "Taiwan",
                "coords": [23.5, 121]
            },
            "TJ": {
                "name": "Tajikistan",
                "coords": [39, 71]
            },
            "TZ": {
                "name": "Tanzania",
                "coords": [-6, 35]
            },
            "TH": {
                "name": "Thailand",
                "coords": [15, 100]
            },
            "TL": {
                "name": "Timor-Leste"
            },
            "TG": {
                "name": "Togo",
                "coords": [8, 1.1667]
            },
            "TT": {
                "name": "Trinidad and Tobago",
                "coords": [11, -61]
            },
            "TN": {
                "name": "Tunisia",
                "coords": [34, 9]
            },
            "TR": {
                "name": "Turkey",
                "coords": [39, 35]
            },
            "TM": {
                "name": "Turkmenistan",
                "coords": [40, 60]
            },
            "UG": {
                "name": "Uganda",
                "coords": [1, 32]
            },
            "UA": {
                "name": "Ukraine",
                "coords": [49, 32]
            },
            "AE": {
                "name": "United Arab Emirates",
                "coords": [24, 54]
            },
            "GB": {
                "name": "United Kingdom",
                "coords": [54, -2]
            },
            "US": {
                "name": "United States of America",
                "coords": [38, -97]
            },
            "UY": {
                "name": "Uruguay",
                "coords": [-33, -56]
            },
            "UZ": {
                "name": "Uzbekistan",
                "coords": [41, 64]
            },
            "VU": {
                "name": "Vanuatu",
                "coords": [-16, 167]
            },
            "VE": {
                "name": "Venezuela",
                "coords": [8, -66]
            },
            "VN": {
                "name": "Vietnam",
                "coords": [16, 106]
            },
            "EH": {
                "name": "W. Sahara",
                "coords": [24.5, -13]
            },
            "YE": {
                "name": "Yemen",
                "coords": [15, 48]
            },
            "ZM": {
                "name": "Zambia",
                "coords": [-15, 30]
            },
            "ZW": {
                "name": "Zimbabwe",
                "coords": [-20, 30]
            }
        }
        $('#countryinfo').append('<h5>' + response.data.response.numFound + ' records founds.</h5>');
        $('#countryinfo').show();
        arrayrender = []
        for (item in $scope.country) {
            array = []
            if (json.hasOwnProperty(item)) {
                lat = json[item].coords[0];
                lon = json[item].coords[1];
                countryname = '<i class="' + item.toLowerCase() + ' flag"></i>' + json[item].name;
                array.push(countryname);
                array.push($scope.country[item]);
                array.push(lat);
                array.push(lon);
                array.push(item);
                arrayrender.push(array);
            }

        }
        if ($rootScope.ConfigDefault.DisplayMap === true) {
            $scope.rendering_on_map(arrayrender);
        }
        if ($rootScope.ConfigDefault.DisplayDatatable === true) {
            $scope.generate_datatable(arrayrender);

        }
    }



    /**
     * methode rendering_on_map : append les markers sur la carte leaflet
     * @param: arrayrender (tableau contenant les pays avec leur nombres et leur données gps)
     */
    $scope.rendering_on_map = function(arrayrender) {
        if (typeof(mymap) != 'undefined') {
            mymap.remove();
        }
        $('#map').show();
        mymap = L.map('map').setView([51.505, -0.09], 4); //declaration de la map leaflet
        mymap.options.maxZoom = 5;
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(mymap);
        var markers = [];
       
        if ($scope.NumFound>10000 && $scope.NumFound<49999) {
        	var maxsize= 50;
        	var maxoccurence=$scope.NumFound;
        	var coef_radius=6;
        
        }
        else if($scope.NumFound>50000){
            var maxsize= 40;
        	var maxoccurence=$scope.NumFound;
        	var coef_radius=7;
        }
        else{
        	var maxsize=50;
        	var maxoccurence=$scope.NumFound;
        	var coef_radius=4;
	       
        }
        $.each(arrayrender, function(key, value) {
           
            fillOpacity = 0.5;
            occurence = value[1];
            radius=Math.sqrt(occurence)*(maxsize/Math.sqrt(maxoccurence));
            radius=radius*coef_radius;
            color = '#' + Math.floor(Math.random() * 16777215).toString(16);
            if (value[4] == "FR") {
                color = "#FFFFFF";
                fillOpacity = 0.0;
                radius = 7;
            }
            var circle = L.circleMarker([value[2], value[3]], {
                color: color,
                fillColor: color,
                fillOpacity: fillOpacity,
                radius: radius
            }); // creation d'un marker


            circle.bindPopup("Country: " + value[0] + "<br>Number of publications: " + value[1]);
            circle.on('mouseover', function(e) {
                this.openPopup();
            });
            circle.on('click', function(e) {
                window.open($rootScope.ConfigDefault.url_consult+"/search/index/?qa%5B"+$rootScope.ConfigDefault.CountryField_t+"%5D%5B%5D=" + value[4].toLowerCase() + "&qa%5BcollCode_s%5D%5B%5D=" + $scope.query + "&qa[producedDateY_i][]=[" + $scope.minyear + " TO " + $scope.maxyear + "]&qa[docType_s][]=" + $scope.documentype_query + "&qa%5Btext%5D%5B%5D=&submit_advanced=Search&rows=30", "__blank");
            });
            circle.on('mouseout', function(e) {
                this.closePopup();
            });

            circle.bindTooltip("<b>" + value[1] + "</b>", {
                noHide: true,
                permanent: true,
                direction: 'center'
            }).openTooltip();
            markers.push(circle); // push du marker dans le tableau

        });
        if (typeof(group) !== 'undefined') { // si une layer existe deja on la supprime
            mymap.removeLayer(group);
        }

        group = L.featureGroup(markers); // on met le groupe de markers dans une layer
        group.addTo(mymap); // on l'ajoute a la map
        bounds = group.getBounds(); // on obtient le bounds pour placer la vue
        mymap.invalidateSize(); //Resize de la map hidden div
        mymap.fitBounds(bounds); // zoom sur la partie qui des poi qui nous interessent
        $('.print').off('click');
        $('.print').on('click', function() { //print de la map
            $.print("#map", {
                title: "Country collaboration for collection HAL : " + $scope.query
            });
        });
        $("#loadermap").hide();
        $("#mapaspdf").show();



    }

    /**
     * methode generate_datatable: construit le tableau datatable
     * @param: arrayrender (tableau contenant les pays avec leur nombres et leur données gps)
     */

    $scope.generate_datatable = function(arrayrender) {
        $('#country').show();
        var table = $('#country').DataTable({
            data: arrayrender,
            lengthChange: false,
            destroy: true,
            "pageLength": 5,
            "order": [
                [1, "desc"]
            ], // pagination du tableau precedemment crée
            "pagingType": "numbers",
            responsive: true,
            dom: 'frtip',
            "autoWidth": false
        });
        var buttons = new $.fn.dataTable.Buttons(table, {
            buttons: [{
                extend: 'csvHtml5',
                text: 'Export CSV',
                title: $scope.query + "_country",
                className: 'ui primary button'
            }]
        }).container().appendTo($('#buttons_country'));
        $("#loaderdatatable").hide();

    }

}]);
