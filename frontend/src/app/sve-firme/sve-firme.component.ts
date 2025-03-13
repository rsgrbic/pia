import { Component, OnInit } from '@angular/core';
import { Firma } from '../models/Firma';
import { FirmaService } from '../services/firma.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sve-firme',
  templateUrl: './sve-firme.component.html',
  styleUrls: ['./sve-firme.component.css']
})
export class SveFirmeComponent implements OnInit {
 listFirme: Firma[]=[]
 naziv:string=""
 adresa:string=""
 selectedFirma:Firma=new Firma
 modalOpen=false;
 sortAdresaBool:boolean=false;
 sortNazivBool:boolean=false;
 constructor(private firmeServis:FirmaService,private router:Router){}

  navigate(){
    this.router.navigate(['/vlasnik/firme',this.selectedFirma._id])
      this.modalOpen=false;
    
  }

  getStars(ocena:string){
    return new Array(Math.ceil(parseFloat(ocena)))
  }

  openModal(firma:Firma){
    this.selectedFirma=firma
    this.modalOpen=true;
  }
  closeModal(){
    this.modalOpen=false
  }

  logout(){
    localStorage.removeItem('logged')
    localStorage.removeItem('type')
    this.router.navigate(['/login'])
  }

  pretraga(){
    this.firmeServis.search(this.naziv,this.adresa).subscribe(data=>{
      if(data){
        this.listFirme=data
      }
      else{
        alert("Ne postoje")
      }
    })
  }

  sortAdresa(){
    if(this.sortAdresaBool==false)
    this.listFirme.sort((a,b)=>{
      return a.adresa.localeCompare(b.adresa)
    })
    else
    this.listFirme.sort((a,b)=>{
      return b.adresa.localeCompare(a.adresa)})
    this.sortAdresaBool=!this.sortAdresaBool
  }

  sortNaziv(){
    if(this.sortNazivBool==false)
    this.listFirme.sort((a,b)=>{
      return a.naziv.localeCompare(b.naziv)
      
    })
    else
    this.listFirme.sort((a,b)=>{
      return b.naziv.localeCompare(a.naziv)
    })
    this.sortNazivBool=!this.sortNazivBool
  }

 ngOnInit(): void {
   this.firmeServis.getAll().subscribe(
    data=>{
      if(data)
      {
        this.listFirme=data
      }
      else
        alert("Molimo pokusajte ponovo.")
    }
   )
 }
}
