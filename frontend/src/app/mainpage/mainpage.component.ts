import { ChangeDetectorRef, Component } from '@angular/core';
import { Firma } from '../models/Firma';
import { korisnikService } from '../services/korisnik.service';
import { FirmaService } from '../services/firma.service';
import { ZakazivanjeService } from '../services/zakazivanje.service';
import { Korisnik } from '../models/Korisnik';
import { Zakazivanje } from '../models/zakazivanje';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mainpage',
  templateUrl: './mainpage.component.html',
  styleUrls: ['./mainpage.component.css',
    '../../../node_modules/bootstrap/dist/css/bootstrap.min.css'
  ]
})
export class MainpageComponent {
  constructor(protected korisnikService:korisnikService,private firmaService:FirmaService,private zakazivanjeService:ZakazivanjeService,private router:Router){}
  allKorisnici:Korisnik[]=[]
  allGotovaZakaz:Zakazivanje[]=[]
  selectedFirmaDekorateri:Korisnik[]=[]
  selectedFirma:Firma=new Firma()
  firmaDekoratori: { [firmaId: string]: Korisnik[] } = {};
  allFirme:Firma[]=[]
  numDekorisane:number=0
  numVlasnici:number=0
  numDekorateri:number=0
  zakazano24:number=0
  zakazano7:number=0
  zakazano30:number=0
  sveFirme:Firma[]=[]
  klik:boolean=false
  naziv:string=''
  adresa:string=''
  sortNazivBool:boolean=false
  sortAdresaBool:boolean=false

  on(){
    this.klik=true;
  }

  login(){
    this.router.navigate(['/login'])
  }
  register(){
    this.router.navigate(['/registracija'])
  }

  ngOnInit(){
    this.korisnikService.getAll().subscribe(
      data=>{
        if(data)
          this.allKorisnici=data
          this.calcKorisnici()
      }
    )
    this.zakazivanjeService.getAllGotova().subscribe(
      data=>{
        if(data)this.allGotovaZakaz=data;
        //this.calcZakazano()
      }
    )
    this.firmaService.getAll().subscribe(
      data=>{
        if(data){this.allFirme=data
          this.allFirme.forEach(firma=>{
            this.korisnikService.getDekoratoriByFirmaId(firma._id).subscribe(
              data=>{
                if(data){
                  this.firmaDekoratori[firma._id]=data
                }
              }
            )
          })
        }
        
      }
    )
    this.zakazivanjeService.getMainPageInfo().subscribe(
      data=>{
        if(data){
          this.zakazano24=data.dan
          this.zakazano7=data.nedelja
          this.zakazano30=data.mesec
          console.log(this.zakazano24,this.zakazano7,this.zakazano30)
        }
      }
    )
  }

  sortAdresa(){
    if(this.sortAdresaBool==false)
    this.allFirme.sort((a,b)=>{
      return a.adresa.localeCompare(b.adresa)
    })
    else
    this.allFirme.sort((a,b)=>{
      return b.adresa.localeCompare(a.adresa)})
    this.sortAdresaBool=!this.sortAdresaBool
  }

  sortNaziv(){
    if(this.sortNazivBool==false)
    this.allFirme.sort((a,b)=>{
      return a.naziv.localeCompare(b.naziv)
      
    })
    else
    this.allFirme.sort((a,b)=>{
      return b.naziv.localeCompare(a.naziv)
    })
    this.sortNazivBool=!this.sortNazivBool
  }

  pretraga(){
    this.firmaService.search(this.naziv,this.adresa).subscribe(data=>{
      if(data){
        this.allFirme=data
      }
      else{
        alert("Ne postoje")
      }
    })
  }
  calcKorisnici(){
    this.allKorisnici.forEach(kor=>{
      if(kor.type=='vlasnik')this.numVlasnici++;
      else if(kor.type=='dekorater')this.numDekorateri++;
      
    })    
  }

}
