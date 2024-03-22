# Webinar de habilitación técnica PaaS para Business Partners de Esri Colombia, Ecuador y Panamá 2024
Este ejemplo muestra una aplicación desarrollada haciendo uso de [ArcGIS Maps SDK for JavaScript](https://developers.arcgis.com/javascript/latest/), [Calcite Design System](https://developers.arcgis.com/calcite-design-system/) y el servicio de la Plataforma como Servicio de ArcGIS [Closest facility routing](https://developers.arcgis.com/documentation/mapping-apis-and-services/routing/closest-facility-routing/)
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
- Lista de capas: Lista cada una de las capas en wl mapa web.
- Mapas base: Permite seleccionar un mapa base desde la galería de mapas base de ArcGIS.
- Marcadores: Permite ir a ubicaciones en el mapa definidas previamente.
- Editar: Permite agregar, editar y borrar atributos a las capas editables en el mapa web. Este widget se ha modificado mediante código para permitir editar únicamente la tabla relacionada **Mantenimiento Poste**
- Buscar: Permite encontrar direcciones y lugares por medio del servicio de geocodificación mundial de Esri. 
Adicionalmente, se ha construídouna herramienta personalizada para encontrar activos cercanos. Se ha configurado en el código para encontrar Instituciones Prestadoras de Salud más cercanas a una ubicación definida por el usuario por medio de un widget Buscar.
