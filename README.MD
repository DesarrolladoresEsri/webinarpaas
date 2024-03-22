# Webinar de habilitación técnica PaaS para Business Partners de Esri Colombia, Ecuador y Panamá 2024
Este ejemplo muestra una aplicación desarrollada haciendo uso de [ArcGIS Maps SDK for JavaScript](https://developers.arcgis.com/javascript/latest/), [Calcite Design System](https://developers.arcgis.com/calcite-design-system/) y el servicio de la Plataforma como Servicio de ArcGIS [Closest facility routing](https://developers.arcgis.com/documentation/mapping-apis-and-services/routing/closest-facility-routing/).
## Descripción
Este ejemplo muestra el mapa web [Telecomunicaciones S.A.](https://sersig-esri-co.maps.arcgis.com/home/item.html?id=53866cce96b24f59a76176d7d75dad64#) que contiene un servicio de capas de entidades editables que que representan activos de una empresa de telecomunicaciones. Los datos mostrados en este ejemplo son datos de prueba.
Las capas en el web map [Telecomunicaciones S.A.](https://sersig-esri-co.maps.arcgis.com/home/item.html?id=53866cce96b24f59a76176d7d75dad64#) son:
- Centro Administrativo
- Armario
- Poste
- Cámara
- Poste  
La capa **Poste** tiene una tabla relacionada **Mantenimiento Poste** que permite registrar varias actividades de mantenimiento para cada poste.  

Se han agregado los siguientes widgets de [ArcGIS Maps SDK for JavaScript](https://developers.arcgis.com/javascript/latest/) a la aplicación:
- [Lista de capas](https://developers.arcgis.com/javascript/latest/api-reference/esri-widgets-LayerList.html): Lista cada una de las capas en wl mapa web.
- [Galería de Mapas base](https://developers.arcgis.com/javascript/latest/api-reference/esri-widgets-BasemapGallery.html): Permite seleccionar un mapa base desde la galería de mapas base de ArcGIS.
- [Marcadores](https://developers.arcgis.com/javascript/latest/api-reference/esri-widgets-Bookmarks.html): Permite ir a ubicaciones en el mapa definidas previamente.
- [Editar](https://developers.arcgis.com/javascript/latest/api-reference/esri-widgets-Editor.html): Permite agregar, editar y borrar atributos a las capas editables en el mapa web. Este widget se ha modificado mediante código para permitir editar únicamente la tabla relacionada **Mantenimiento Poste**
- [Buscar](https://developers.arcgis.com/javascript/latest/api-reference/esri-webdoc-applicationProperties-Search.html): Permite encontrar direcciones y lugares por medio del servicio de geocodificación mundial de Esri.  

Adicionalmente, se ha construídouna herramienta personalizada para encontrar activos cercanos. Esta herramienta usa servicio de la Plataforma como Servicio de ArcGIS [Closest facility routing](https://developers.arcgis.com/documentation/mapping-apis-and-services/routing/closest-facility-routing/). Se ha configurado en el código para encontrar Instituciones Prestadoras de Salud más cercanas a una ubicación definida por el usuario por medio de un widget [Buscar](https://developers.arcgis.com/javascript/latest/api-reference/esri-webdoc-applicationProperties-Search.html).  
## Uso
Puede descargar y usar este código en un servidor de aplicaciones web de su preferencia. Para hacer uso de la herramienta para encontrar activos cercanos, puede usar credenciales (nombre de usuario y contraseña) de una cuenta Organizacional de ArcGIS Online u una suscripción para Desarrolladores de ArcGIS. En caso de que quiera evitar el inicio de sesión por medio de usuario y prefiera usar una API Key de ArcGIS para desarrolladores, cree una API Key en el [Tablero de control](https://developers.arcgis.com/dashboard/) de la página de Desarrolladores de Arcgis. Puede [crear una suscripción gratuita de desarrollador](https://developers.arcgis.com/sign-up/) o usar un nombre de usuario o contraseña de su cuenta organizacional de ArcGIS Online para acceder al tablero de control.  
Una vez haya generado la API Key, usela en el archivo map.js, como se muestra en el siguiente ejemplo:  
´´´javascript
intl.setLocale("es");
  //Use su API Key para acceder a los servicios de ubicación de ArcGIS Platform
  esriConfig.apiKey = "<SU_API_KEY>;
  const webmapId = new URLSearchParams(window.location.search).get("webmap") ?? "53866cce96b24f59a76176d7d75dad64";
´´´
