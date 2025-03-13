import { Component, OnInit } from '@angular/core';
import { FirmaService } from '../services/firma.service';
import { Firma } from '../models/Firma';
import * as L from 'leaflet'
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-firme',
  templateUrl: './firme.component.html',
  styleUrls: ['./firme.component.css']
})
export class FirmeComponent implements OnInit {
  current:Firma=new Firma()
  private map:L.Map | undefined;
  stars:Array<number>=[];
  windowOpen=false
  openWindow(){
    this.windowOpen=true
  }
  closeWindow(){
    this.windowOpen=false
  }

  logout(){
    localStorage.removeItem('logged')
    localStorage.removeItem('type')
    this.router.navigate(['/login'])
  }
  constructor(private firmaServis:FirmaService,private route:ActivatedRoute,private router:Router){}
  ngOnInit(){
    this.route.params.subscribe(params=>{
    const id=params['id']
    this.firmaServis.getById(id).subscribe(
      data=>{
        if(data){
          this.current=data
          this.stars=Array(Math.ceil(parseFloat(this.current.ocena))).fill(0)
          const center = L.latLng(this.current.koordinate.lat, this.current.koordinate.lng);
          const zoom = 15;
          const renderer=L.canvas()
          this.map = L.map('map',{renderer:renderer}).setView(center, zoom);      
          
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>',
            subdomains: ['a', 'b', 'c'],
          }).addTo(this.map);
      
          L.marker(center).bindPopup('TACNO GDE TREBA').addTo(this.map)
        }
      }
    )})
  }
}
