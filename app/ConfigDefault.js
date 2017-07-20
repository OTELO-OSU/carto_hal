app.run(['$rootScope', function($rootScope) {//Passage en rootscope afin de  partager les variables
    $rootScope.ConfigDefault = {//Config par defaut
        ApiURL:"http://api.archives-ouvertes.fr",
        DisplayMap:true,
        DisplayDatatable:true,
	DocumentType:"",
    }

 if(window.ConfigWidgetHal) { // si une config est preésente dans le document html
        if (Object.getOwnPropertyNames(window.ConfigWidgetHal).length > 0) {
            $rootScope.ConfigDefault = $.extend($rootScope.ConfigDefault, window.ConfigWidgetHal);

        }
    }

}]);
