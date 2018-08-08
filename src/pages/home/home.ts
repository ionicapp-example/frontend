import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController } from 'ionic-angular';

declare var google;

@Component({
  selector: 'home-page',
  templateUrl: 'home.html'
})

export class HomePage {

  @ViewChild('map') mapElement: ElementRef;
  map: any;

  constructor(public navCtrl: NavController) {

  }

  //Used to load the map as soons as the page is entered
  ionViewDidLoad(){
    this.loadMap();
  }

  //Used to load the map itself
  loadMap(){

    //Sets up initial location of the map. In this case, Brazil.
    let latLng = new google.maps.LatLng(-14.9290, -53.6010);

    //Sets up map info
    let mapOptions = {
      center: latLng,
      zoom: 4.35,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }

    //Renders the map itself
    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

  }

  //Used to create a marker on a state the user has chosen.
  addMarker(){

    //Sets up and renders the marker ifself.
    let marker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: this.map.getCenter()
    });

    //Sets up information about the state the marker is pointed to.
    let content = "<h4>Information!</h4>";
    //Calls a function to create the info window;

    this.addInfoWindow(marker, content);
  }

  addInfoWindow(marker, content){

    //Sets up the info Window
    let infoWindow = new google.maps.InfoWindow({
      content: content
    });

    //Adds a listener for whenever the user clicks on the marker, the info window will be rendered.
    google.maps.event.addListener(marker, 'click', () => {
      infoWindow.open(this.map, marker);
    });
  }
}
