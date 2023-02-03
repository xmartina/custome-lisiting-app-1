export class OpenStreetMapAutocompleteResponseProperty {
  osm_id?: number;
  osm_type?: string;
  extent?: number[];
  country?: string;
  osm_key?: string;
  countrycode?: string;
  osm_value?: string;
  name?: string;
  county?: string;
  state?: string;
  type?: string;
}
export class OpenStreetMapAutocompleteResponse {
  features?: [
    {
      geometry?: {
        coordinates?: number[],
        type?: string
      },
      type?: string;
      properties?: OpenStreetMapAutocompleteResponseProperty
    }
  ];
  type?: string;
}


/*EG:
*

"features":[
{
"geometry":{
"coordinates":[
10.4018624,
43.7159395
],
"type":"Point"
},
"type":"Feature",
"properties":{
"osm_id":42527,
"osm_type":"R",
"extent":[
10.2684553,
43.7509347,
10.4562831,
43.5807231
],
"country":"Italy",
"osm_key":"place",
"countrycode":"IT",
"osm_value":"city",
"name":"Pisa",
"county":"Pisa",
"state":"Tuscany",
"type":"city"
}
},
{
"geometry":{
"coordinates":[
10.679791173704576,
43.4714722
],
"type":"Point"
},
"type":"Feature",
"properties":{
"osm_id":42338,
"osm_type":"R",
"extent":[
10.2574977,
43.834394,
11.0133182,
43.1084854
],
"country":"Italy",
"osm_key":"boundary",
"countrycode":"IT",
"osm_value":"administrative",
"name":"Pisa",
"state":"Tuscany",
"type":"county"
}
}
],
"type":"FeatureCollection"
}
*
*
* */
