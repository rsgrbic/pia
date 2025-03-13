import { Component } from '@angular/core';
import { ZakazivanjeService } from '../services/zakazivanje.service';
import { Odrzavanje } from '../models/odrzavanje';
import { Korisnik } from '../models/Korisnik';
import { korisnikService } from '../services/korisnik.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dekorator-odrzavanja',
  templateUrl: './dekorator-odrzavanja.component.html',
  styleUrls: ['./dekorator-odrzavanja.component.css',
    '../../../node_modules/bootstrap/dist/css/bootstrap.min.css'

  ]
})
export class DekoratorOdrzavanjaComponent {
  neOdobrenaOdrzavanja:Odrzavanje[]=[]
  odobrenaOdrzavanja:Odrzavanje[]=[]
  loggedKorisnik:Korisnik=new Korisnik()
  modalOpen:boolean=false
  endDate:string=''
  declineComment:string=''
  errorString:string=''
  declineModalOpen:boolean=false
  
  selectedOdrzavanje:Odrzavanje=new Odrzavanje()

  constructor(private zakazivanjeServis:ZakazivanjeService,private korisnikServis:korisnikService,private router:Router){}

  ngOnInit(){
    const ls=localStorage.getItem("logged")
    if(ls){
    this.korisnikServis.findByUsername(ls).subscribe(
      user=>{
        if(user){
          this.loggedKorisnik=user
          this.zakazivanjeServis.getNeodobrenaOdrzavanjaByFirma(this.loggedKorisnik.firma!).subscribe(
            data=>{
              if(data){
                this.neOdobrenaOdrzavanja=data
              }
            }
          )
          this.zakazivanjeServis.getOdobrenaAktivnaOdrzavanjaByFirma(this.loggedKorisnik.firma!).subscribe(
            data=>{
              if(data){
                this.odobrenaOdrzavanja=data
              }
            }
          )

        }
      }
    )
    
  }
}

checkDate(){
  const selectedDate=new Date(this.endDate)
  const currDate=new Date(this.selectedOdrzavanje.datumVreme)
  if(selectedDate<currDate){
    this.errorString="Vreme mora biti u buducnosti."
    this.endDate=''
  }
  else{
    this.errorString=""
  }
}

logout(){
  localStorage.removeItem('logged')
  localStorage.removeItem('type')
  this.router.navigate(['/login'])
}

  openModal(odr:Odrzavanje){
    this.selectedOdrzavanje=odr
    this.modalOpen=true
  }
  closeModal(){
    this.modalOpen=false;
    this.endDate=''
  }

  openDeclineModal(odr:Odrzavanje){
    this.selectedOdrzavanje=odr
    this.declineModalOpen=true
  }
  closeDeclineModal(){
    this.declineModalOpen=false;
    this.declineComment=''
  }


  acceptOdrzavanje(){
    this.zakazivanjeServis.acceptOdrzavanje(this.selectedOdrzavanje._id,this.loggedKorisnik.username,this.endDate).subscribe(
      data=>{
        if(data){
          this.ngOnInit()
          this.closeModal()
          alert("uspesno prihvaceno!")
        }
        else
        alert("neuspesno.")
      }
    )
  }

  declineOdrzavanje(){
    const commentDecline=this.declineComment+ " dekorater: " + this.loggedKorisnik.username
    this.zakazivanjeServis.declineOdrzavanje(this.selectedOdrzavanje._id,commentDecline).subscribe(
      data=>{
        if(data){
          this.ngOnInit()
          this.closeDeclineModal()
          alert("uspesno odbijeno!")
        }
        else
        alert("neuspesno.")
      }
    )
  }
}
