Widget Carto_HAL

Widget permettant de cartographier les pays publiant dans une collection HAL donnée en paramètre.

Les développements de ce projet sont issus du projet Carto_istex :

LIEN VERS LES SOURCES Carto_istex

Premièrement, il est nécessaire de charger les fichiers JS et CSS du widget, ainsi que la bibliothèque AngularJS qui est une dépendance nécessaire.

Voici un exemple sur une page:

<!doctype html>
<html ng-app="cartoHal">
    <head>
        <title>Carto HAL</title>
        <script src="app/js/angular.js"></script>
        <script src="app/js/jquery.min.js"></script>
        <script src="app/js/jquery.range-min.js"></script>
        <script src="app/js/print.js"></script>
        <script src="app/js/leaflet/leaflet.js"></script>
        <script src="app/app.min.js"></script>
        <script src="app/ConfigDefault.js"></script>
        <script src="app/js/jquery.dataTables.min.js"></script>
        <script src="app/js/dataTables.buttons.min.js"></script>
        <script src="app/js/dataTables.semanticui.min.js"></script>
        <script src="app/js/buttons.html5.min.js"></script>
        <script type="text/javascript">
         var ConfigWidgetHal={
            ApiURL:"http://api.archives-ouvertes.fr",
            DisplayMap:true,
            DisplayDatatable:true,
            ResultSize:10000,
            query:"OTELO-UL"
          }

        </script>

        <link rel="stylesheet" href="app/js/leaflet/leaflet.css" />
        <link rel="stylesheet" type="text/css" href="css/semantic/dist/semantic.min.css">
        <link rel="stylesheet" type="text/css" href="css/style.css">
        <link rel="stylesheet" type="text/css" href="css/jquery.range.css">
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">

    </head>
    <body>
    <h1>Demo Widget Hal</h1>
        
    <search></search>

    </body>
</html>

On peut voir les différentes inclusion de js et css ainsi que l'ajout de la balise search.

Configuration:

Le widget peut être configuré de la maniere suivante:

    Url de l'API HAL : ApiURL

    Afficher ou non la carte (leaflet) : DisplayMap

    Afficher ou non le tableau des pays : DisplayDatatable

    Paramétrer le nombre de résultats retournés par l'API : ResultSize

    Paramétrer la collection à interroger : query

La configuration n'est pas obligatoire, les paramètres par défaut s'appliqueront:

ApiURL:"http://api.archives-ouvertes.fr",
    DisplayMap:true,
    DisplayDatatable:true,
    ResultSize:10000

Pour inclure le widget il suffit d'utiliser la balise :

<search><search/>
