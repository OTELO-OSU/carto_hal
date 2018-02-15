app.run(['$rootScope', function($rootScope) {//Passage en rootscope afin de  partager les variables
    $rootScope.ConfigDefault = {//Config par defaut
        ApiURL:"http://api.archives-ouvertes.fr",
        url_consult:"http://hal.archives-ouvertes.fr",
        DisplayMap:true,
        DisplayDatatable:true,
	DocumentType:"",
	DisplayTitle:true,
        CountryField:"structCountry_s"
        CountryField_t:"structCountry_t"
    }

 if(window.ConfigWidgetHal) { // si une config est preésente dans le document html
        if (Object.getOwnPropertyNames(window.ConfigWidgetHal).length > 0) {
            $rootScope.ConfigDefault = $.extend($rootScope.ConfigDefault, window.ConfigWidgetHal);

        }
    }

}]);
