import { Component } from '@angular/core';
import { Zakazivanje } from '../models/zakazivanje';
import { ZakazivanjeService } from '../services/zakazivanje.service';
import { FirmaService } from '../services/firma.service';
import { Firma } from '../models/Firma';
import { Router } from '@angular/router';

@Component({
  selector: 'app-lista-zakazivanja',
  templateUrl: './lista-zakazivanja.component.html',
  styleUrls: ['./lista-zakazivanja.component.css'
    ,'../../../node_modules/bootstrap/dist/css/bootstrap.min.css'
    
  ]
})
export class ListaZakazivanjaComponent {
  aktivnaZakazivanja:Zakazivanje[]=[]
  arhivaZakazivanja:Zakazivanje[]=[]
  arhivaKom:{[key:string]:string|void}={}
  aktivnoFirme:{[key:string]:Firma}={}
  arhivaZvezdice:{[key:string]:string|void}={}
  activeUser:string=''
  otkazivanjeModal:boolean=false;
  modalOpen:boolean=false
  komentar:string=''
  ocena:number=0;
  selectedFirmaId:string=''
  selectedZakazivanjeId:string=''
  selectedZakazivanjeCancel:Zakazivanje|null=null
  constructor(private zakazivanjeServis:ZakazivanjeService,private firmaServis:FirmaService,private router:Router){}

  ngOnInit(){
    const au=localStorage.getItem("logged")
    this.activeUser=au?au:'';
    if(au!=''){
    this.zakazivanjeServis.getActiveByUsername(this.activeUser).subscribe(data=>{
        if(data){
          this.aktivnaZakazivanja=data;

          for(let zakaz of this.aktivnaZakazivanja){
            this.firmaServis.getById(zakaz.firma).subscribe(data=>{
            if(data)
            this.aktivnoFirme[zakaz._id]=data
          })
        }
        }
    })
    this.zakazivanjeServis.getArchiveByUsername(this.activeUser).subscribe(data=>{
      if(data){
        this.arhivaZakazivanja=data;
        this.arhivaZakazivanja.sort((a: Zakazivanje, b: Zakazivanje) => {
          const dateA = new Date(a.datumVreme).getTime();
          const dateB = new Date(b.datumVreme).getTime();
        
          return dateB - dateA; 
        });

        this.Assign();

      }
  })
    
  } 
  }

  onStarClick(star:number){
    this.ocena=star+1;
  }

  async Assign(){
    for(let zakaz of this.arhivaZakazivanja){
          if(zakaz.commentLeft=="true"){
            const comment = await this.loadComment(zakaz._id, zakaz.firma);
            this.arhivaKom[zakaz._id] = comment.str;
            const num=comment.num
            if (!this.arhivaZvezdice[zakaz._id]) {
              this.arhivaZvezdice[zakaz._id] = '';
            }
            for(let i=0;i<num;i++){
              this.arhivaZvezdice[zakaz._id]+='&#9733'
            }
        }
      }
  }

  async loadComment(idZakaz: string, idFirm: string): Promise<{str:string,num:number}> {
    return new Promise((resolve, reject) => {
      this.firmaServis.getKomentar(idZakaz, idFirm).subscribe(
        data => {
          if (data) {
            const ispisPoruke = " Komentar: " + data.text;
            resolve({str:ispisPoruke,num:data.val});
          } else {
            console.error("Greska ispisa komentara");
            reject("Ne postoji")
          }
        },
        error => {
          console.error( error);
          reject(error); 
        }
      );
    });
  }
  
  openOtkazivanje(zakazivanje:Zakazivanje){
    this.otkazivanjeModal=true
    this.selectedZakazivanjeCancel= zakazivanje
  }
  closeOtkazivanje(){
    this.otkazivanjeModal=false;
    this.selectedZakazivanjeCancel=null
  }

  otkazi(){
    if(this.selectedZakazivanjeCancel==null)return
    let izabrano=this.selectedZakazivanjeCancel!
    let trenutno=new Date()
    let pocetak=new Date(izabrano.datumVreme)
    let differenceInMs = pocetak.getTime() - trenutno.getTime();

    const oneDayInMs = 24 * 60 * 60 * 1000;

    if (differenceInMs > oneDayInMs) {
        this.zakazivanjeServis.otkazi(izabrano._id).subscribe(
          data=>{
            if(data){
              this.ngOnInit()
              this.closeOtkazivanje()
              alert("Uspesno otkazano")
            }
            else{
              alert("Greska pri otkazivanju.")
            }
          }
        )
    } else {
        alert("Manje od jednog dana do pocetka radova, nije moguce otkazati.")
    }

  }

  logout(){
    localStorage.removeItem('logged')
    localStorage.removeItem('type')
    this.router.navigate(['/login'])
  }

  closeModal(){
    this.modalOpen=false
    this.selectedZakazivanjeId=''
    this.selectedFirmaId=''
  }

  leaveComment(firm:string,zakaz:string){
    this.modalOpen=true
    this.selectedZakazivanjeId=zakaz
    this.selectedFirmaId=firm
  }
  prosledi(){
    const lgdd=localStorage.getItem("logged")
    if(lgdd){
    this.firmaServis.addKomentar(lgdd,this.ocena,this.komentar,this.selectedFirmaId,this.selectedZakazivanjeId).subscribe(data=>{
      if(data){
        this.modalOpen=false
        this.ngOnInit()
        alert("Uspesno dodat komentar.")
      }
    })
    }
  }

}
