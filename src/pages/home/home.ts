import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/Rx';

declare var google;

@Component({
  selector: 'home-page',
  templateUrl: 'home.html'
})

export class HomePage {
  states: Array<any>;

  @ViewChild('map') mapElement: ElementRef;
  map: any;

  constructor(public navCtrl: NavController, private http: Http, private alertCtrl: AlertController) {
    this.states = null;
  }

  //Runs as soon as the page is loaded
  ionViewDidLoad() {
    //Used to fetch all brazilian states from database, just before the page is loaded.
    var request = 'http://localhost:3000/api/states';
    this.http.get(request)
      .map(res => res.json())
      .subscribe( res => {
        if(res) {
          this.states = res;
        }
      })

    //Used to load the map as soon as the page in entered.
    this.loadMap();
  }

  //Used to load the map itself.
  loadMap() {
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

  //Used to create alert window for the user to choose a state to mark.
  stateChooser() {
    var popUp = {
      title: "Choose your state",
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Ok',
          handler: data => {
            console.log(data);
            this.addMarker(data);
          }
        }
      ],
      inputs: []
    };

    popUp.inputs = [];

    //Adding Radio Buttons
    for(let i = 0; i < this.states.length; i++) {
      popUp.inputs.push({type: 'radio', label: this.states[i].name, value: i})
    }

    //Creates and shows the alert itself
    let alert = this.alertCtrl.create(popUp);
    alert.present();
  }

  //Used to create a marker on a state the user has chosen.
  addMarker(stateID: number) {
    //Sets ups State info
    var stateLatLng = {lat: this.states[stateID].latitude, lng: this.states[stateID].longitude};

    //Sets up and renders the marker ifself.
    let marker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: stateLatLng
    });

    //Sets up information about the state the marker is pointed to.
    let content = "<h4>" + this.states[stateID].name + "</h4>" +
                  "<h5>Número de habitantes:" + this.states[stateID].habitants_number + "</h5>" +
                  "<h5>Latitude:" + this.states[stateID].latitude + "</h5>" +
                  "<h5>Longitude:" + this.states[stateID].longitude + "</h5>";


    //Calls a function to create the info window;
    this.addInfoWindow(marker, content);
  }

  addInfoWindow(marker, content) {
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
