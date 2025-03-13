import { Component } from '@angular/core';
import { korisnikService } from '../services/korisnik.service';
import { FirmaService } from '../services/firma.service';
import { Korisnik } from '../models/Korisnik';
import { ZakazivanjeService } from '../services/zakazivanje.service';
import { Zakazivanje } from '../models/zakazivanje';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dekorator-zakazivanja',
  templateUrl: './dekorator-zakazivanja.component.html',
  styleUrls: ['./dekorator-zakazivanja.component.css',
    '../../../node_modules/bootstrap/dist/css/bootstrap.min.css'
  ]
})
export class DekoratorZakazivanjaComponent {
  loggedKorisnik:Korisnik=new Korisnik()
  neOdobrena:Zakazivanje[]=[]
  prihvaceni:Zakazivanje[]=[]
  selectedZakaz :Zakazivanje= new Zakazivanje()
  modalOpen:boolean=false
  profileImageFile:File|null=null
  profileImage:string=''
  decline:boolean=false;
  declineReason:string=''
  errorString:string=''
  
  constructor(private korisnikServis:korisnikService,private firmaServis:FirmaService,private zakazivanjeServis:ZakazivanjeService,private router:Router){}
  ngOnInit(): void {
    let logged=localStorage.getItem("logged")
    let type=localStorage.getItem("type")
    if(logged && type=='dekorater'){
      this.korisnikServis.findByUsername(logged).subscribe(kor=>{
        if(kor){
        this.loggedKorisnik=kor;
        this.zakazivanjeServis.getNeodobrenaByFirmaId(this.loggedKorisnik.firma!).subscribe(data=>
          {
            if(data){
              this.neOdobrena=data;
              this.neOdobrena.sort((a: Zakazivanje, b: Zakazivanje) => {
                const dateA = new Date(a.datumVremeTrenutno).getTime();
                const dateB = new Date(b.datumVremeTrenutno).getTime();
              
                return dateB - dateA; 
              })
            }
          }
        )
        if(this.loggedKorisnik.poslovi)
        for(let posao of this.loggedKorisnik.poslovi){
          this.zakazivanjeServis.getById(posao.idZakaz).subscribe(ret=>{
            if(ret){
              let tmp=new Zakazivanje()
              tmp=ret
              if (!this.prihvaceni.find((item) => item._id === tmp._id)) {
                this.prihvaceni.push(tmp);
              }
            }
            else{
              console.error("greska pri ucitavanju")
            }
          })
        }

      }
    })
  }
  }

  logout(){
    localStorage.removeItem('logged')
    localStorage.removeItem('type')
    this.router.navigate(['/login'])
  }

  onFileSelected(event:any){
    const file = event.target.files[0]
    if (file) {
      const validExtension = ['image/jpeg', 'image/png']

      if (!validExtension.includes(file.type)) {
       this.errorString = "Neodgovarajuca ekstenzija. Molimo vas unesite fotografiju u JPEG ili PNG formatu.";
        this.profileImageFile = null
        this.profileImage=''
        
        return;
      }
      const img = new Image();

      img.src=URL.createObjectURL(file);

      img.onload=() =>{
        
          this.profileImage=img.src;
          this.profileImageFile=file;
        
      };
      img.onerror=()=>{
        this.errorString="Greska pri ucitavanju fotografije"
        this.profileImage=''
        this.profileImageFile=null;
        URL.revokeObjectURL(img.src)
      };
    }
    else{
      this.profileImage=''
      this.profileImageFile=null;
    }
  }

  openModal(zakaz:Zakazivanje){
    this.selectedZakaz=zakaz;
    this.modalOpen=true
  }

  closeModal(){
    this.modalOpen=false;

  }
  openDecline(zakaz:Zakazivanje){
    this.selectedZakaz=zakaz;
    this.decline=true
  }

  closeDecline(){
    this.decline=false;
    this.declineReason=''

  }


  sendPhoto(){
    if(this.profileImageFile==null){
      this.errorString="Dodajte fotografiju"
      return
    }
    this.zakazivanjeServis.postPhoto(this.selectedZakaz._id,this.profileImageFile).subscribe(
      data=>{
        if(data){
          window.location.reload()
          alert("slika uspesno dodata")
        }
        else{
          alert("Neuspeh.")
        }
      }
    )
  }

  danNakon(zakaz:Zakazivanje){
    const currentDate = new Date();
    const endDate = new Date(zakaz.krajDatum);
    if(currentDate.getTime()>endDate.getTime()){
      return true;}
    else{
      return false
    }
  }




  acceptJob(zakaz:Zakazivanje){
    console.log(this.loggedKorisnik,zakaz._id)
    this.zakazivanjeServis.assignJob(this.loggedKorisnik.username,zakaz._id).subscribe(
      data=>{
        if(data){
          this.ngOnInit()
          alert("uspesno Prihvaceno")
        }
        else
        alert("neuspesno")
      }
    )
  }

  declineJob(){
    const commentDecline=this.declineReason+ " dekorater: " + this.loggedKorisnik.username
    console.log(this.declineReason)
    this.zakazivanjeServis.declineJob(this.selectedZakaz._id,commentDecline).subscribe(
      data=>{
        if(data){
          this.closeDecline();
          this.ngOnInit()
          
          alert("uspesno odbijeno")
        }
        else
        alert("neuspesno")
      }
    )
  }
}
