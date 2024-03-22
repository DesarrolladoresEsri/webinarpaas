require([
    "esri/WebMap"
    ,"esri/views/MapView"
    ,"esri/widgets/Search"
    ,"esri/layers/FeatureLayer"
    ,"esri/widgets/Bookmarks"
    ,"esri/widgets/BasemapGallery"
    ,"esri/widgets/LayerList"
    ,"esri/widgets/Editor"
    ,"esri/widgets/Search"
    ,"esri/layers/GraphicsLayer"
    ,"esri/Graphic"
    ,"esri/rest/support/FeatureSet"
    ,"esri/rest/closestFacility"
    ,"esri/rest/support/ClosestFacilityParameters"
    ,"esri/config"
    ,"esri/intl"
], function(
     WebMap
    ,MapView
    ,Search
    ,FeatureLayer
    ,Bookmarks
    ,BasemapGallery
    ,LayerList
    ,Editor
    ,Search
    ,GraphicsLayer
    ,Graphic
    ,FeatureSet
    ,closestFacility
    ,ClosestFacilityParameters
    ,esriConfig
    ,intl
) {
    intl.setLocale("es");
    //esriConfig.apiKey = "<SU_API_KEY>;
    const webmapId = new URLSearchParams(window.location.search).get("webmap") ?? "53866cce96b24f59a76176d7d75dad64";

    const map = new WebMap({
        portalItem: {
            id: webmapId
        },
        basemap: {
            portalItem: {
                id: "2039f56fa9eb4a599f59b5ab12436c16" // navigation dark
            }
        }
    });

    const view = new MapView({
        map,
        container: "viewDiv",
        padding: {
            left: 49
        }
    });
    //Capas operativas
    var caLayer;
    var arLayer;
    var camLayer;
    var poLayer;

    view.ui.move("zoom", "bottom-right");

    const search = new Search({
        view:view,
    });

    view.ui.add(search, {
        position: 'top-right'
    });

    const basemaps = new BasemapGallery({
        view,
        container: "basemaps-container"
    });

    const bookmarks = new Bookmarks({
        view,
        container: "bookmarks-container"
    });

    const layerList = new LayerList({
        view,
        selectionEnabled: true,
        container: "layers-container"
    });

    const editor = new Editor({
        view,
        container: "edit-container"
    });

    //Buscador de Closest Facility
    const cfSearch = new Search ({
        container: "closest-facility-search"
    });
    
    //Capa de gráficos para agretar resultados de búsquedas y cálculos de ruta al mapa
    const graphicsRouteLayer = new GraphicsLayer();
    graphicsRouteLayer.title = 'Resultados';
    
    //Almacena el punto de inicio para el cálculo de Closest Facilty
    var incident;

    //Comportamiento del widget Search cuando se completa la búsqueda
    cfSearch.on("search-complete", function(event){
        graphicsRouteLayer.removeAll();
        addIncidentToMap(event);
    });

    //Comportamiento del widget Search cuando se cancela la búsqueda
    cfSearch.on("search-clear",function(){
        graphicsRouteLayer.removeAll();
        document.querySelector('[data-action-id=perform-closest]').disabled = false;
    });

    //Endpoint del servicio mundial de Closest Facility de ArcGIS PaaS
    const closestFacilityUrl = 'https://route-api.arcgis.com/arcgis/rest/services/World/ClosestFacility/NAServer/ClosestFacility_World/solveClosestFacility';

    //2. Función para resolver CF
    function findClosestFacility(){
        //Parámetros de consulta espacial sobre el incident (punto de partida) que genera un búfer de 10Km sobre el punto
        const queryParams = {
            spatialRelationship: "intersects",
            geometry: incident.geometry,
            distance: 1,
            units: "kilometers",
            outSpatialReference: {wkid: 4326},
            returnGeometry: true,
            outFields:["OBJECTID"]
        };
        
        let ipsLayer = new FeatureLayer({
            url: "https://services7.arcgis.com/hgrJkDmChVbQpeCW/arcgis/rest/services/InstitucionPrestadoraSaludBogota1/FeatureServer"
        });
        //Consulta espacial, devuelve los centros administrativos dentro del búfer
        ipsLayer.queryFeatures(queryParams).then(function(results){
            //Se definen los parámetros para resolver CF
            let closestFacilityParams = new ClosestFacilityParameters({
                facilities: results,
                incidents: new FeatureSet({features: [incident]}),
                returnRoutes: true,
                returnDirections: true,
                directionsOutputType: 'featuresets',
                returnFacilities: true,
                defaultTargetFacilityCount: 3
            });
    
            //Resuelve CF el incident y los resultados de la consulta espacial 
            closestFacility.solve(closestFacilityUrl, closestFacilityParams).then(function(solveResults){
            //caLayer.solve(closestFacilityUrl, closestFacilityParams).then(function(solveResults){
                //Muestra en el mapa las rutas del cálculo de CF
                solveResults.routes.features.forEach((route) => {
                    route.symbol = setCFRouteSymbol(route.attributes.ObjectID);
                    graphicsRouteLayer.add(route);
                });

                //Muestra en el mapa cada uno de los resultados de CF
                solveResults.directionPoints.features.forEach((facility, i) => {
                    if (facility.attributes.ShortVoiceInstruction === "Finish"){
                        facility.symbol = setFacilitySymbolText(facility.attributes.RouteID);

                        const incidentGraphic = new Graphic({
                            geometry: facility.geometry,
                            symbol: setFacilitySymbol(facility.attributes.RouteID)
                        });

                        graphicsRouteLayer.add(incidentGraphic);
                        graphicsRouteLayer.add(facility);
                    }
                });

                view.goTo({
                    target: solveResults.routes.features
                });
            });
        });
    }
    //Botón Calcular
    document.querySelector('[data-action-id=perform-closest]').addEventListener("click", findClosestFacility);

    
    map.when(() => {
        map.add(graphicsRouteLayer);
        //Instancia la capa de Centros Administrativos
        caLayer = map.allLayers.find(function(layer){
            return layer.title === "Centro Administrativo"
        });

        arLayer = map.allLayers.find(function(layer){
            return layer.title === "Armario"
        });

        camLayer = map.allLayers.find(function(layer){
            return layer.title === "Camara"
        });

        poLayer = map.allLayers.find(function(layer){
            return layer.title === "Poste"
        });

        //EDICION
        editor.layerInfos = [
            {
                layer: caLayer,
                enabled: false
            },
            {
                layer: arLayer,
                enabled: false
            },
            {
                layer: camLayer,
                enabled: false
            },
            {
                layer: poLayer,
                enabled: true, 
                addEnabled: false, 
                updateEnabled: true,
                deleteEnabled: false,
                attributeUpdatesEnabled: false,
                geometryUpdatesEnabled: false,
                attachmentsOnCreateEnabled: true,
                attachmentsOnUpdateEnabled: true
            }
        ];

        const title = map.portalItem.title;
        document.querySelector("#header-title").textContent = title;

        let activeWidget;

        const handleActionBarClick = ({ target }) => {
            if (target.tagName !== "CALCITE-ACTION") {
                return;
            }

            if (activeWidget) {
                document.querySelector(`[data-action-id=${activeWidget}]`).active = false;
                document.querySelector(`[data-panel-id=${activeWidget}]`).hidden = true;
            }

            const nextWidget = target.dataset.actionId;
            if (nextWidget !== activeWidget) {
                document.querySelector(`[data-action-id=${nextWidget}]`).active = true;
                document.querySelector(`[data-panel-id=${nextWidget}]`).hidden = false;
                activeWidget = nextWidget;
            } else {
                activeWidget = null;
            }
        };

        document.querySelector("calcite-action-bar").addEventListener("click", handleActionBarClick);
        let actionBarExpanded = false;

        document.addEventListener("calciteActionBarToggle", event => {
            actionBarExpanded = !actionBarExpanded;
            view.padding = {
                left: actionBarExpanded ? 135 : 49
            };
        });
        document.querySelector("calcite-shell").hidden = false;
        document.querySelector("calcite-loader").hidden = true;
    });

    function addIncidentToMap(event) {
        if(event.numResults > 0) {
            document.querySelector('[data-action-id=perform-closest]').disabled = false;

            incident = event.results[0].results[0].feature;

            let incidentGraphic = new Graphic({
                geometry: incident.geometry,
                symbol: setCFIncidentSymbol()
            });

            graphicsRouteLayer.add(incidentGraphic);
            view.goTo({
                target:incidentGraphic.geometry,
                zoom:17
            });
        }
    }

    function setCFIncidentSymbol() {
        let incidentSymbol = {
            type: "simple-marker",
            color: [226, 119, 40, .7],
            outline: {
                color: [255, 255, 255],
                with: 2
            }
        };

        return incidentSymbol;
    }

    function setColor(index, a) {
        const colors = [
            [230, 81, 84],
            [38, 182, 255],
            [103, 230, 209],
            [205, 118, 214],
            [255, 202, 140],
            [255, 242, 179],
            [255, 140, 217],
            [217, 157, 91],
            [200, 242, 169],
            [212, 184, 255],
        ]
        color = colors[index-1];
        color.push(a);
        return color;
    }

    function setCFRouteSymbol(index){
        let symbol = {
            type: "simple-line",
            color: setColor(index, 0.75),
            width: "5",
        };
        return symbol;
    }
    
    function setFacilitySymbol(index) {
        let symbol = {
            type: "simple-marker",
            color: setColor(index, 1),
            size: 20,
            yoffset: 5,
            outline: {
                color: [255, 255, 255],
                width: 2
            }
        }
        return symbol;
    }

    function setFacilitySymbolText(index) {
        let symbol = {
            type: "text",
            angle: 0,
            color: [255,255,255,1],
            font: {
                decoration: "none",
                family: "Arial",
                size: 12,
                style: "normal",
                weight: "bold"
            },
            horizontalAlignment: "center",
            kerning: false,
            lineWidth: 0,
            rotated: false,
            text: index,
            verticalAlignment: "baseline",
            xoffset: 0,
            yoffset: 0
        }

        return symbol;
    }
});
