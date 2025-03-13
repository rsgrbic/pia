import { Component } from '@angular/core';
import { Korisnik } from '../models/Korisnik';
import { korisnikService } from '../services/korisnik.service';
import { Router } from '@angular/router';
import { Zakazivanje } from '../models/zakazivanje';
import { ZakazivanjeService } from '../services/zakazivanje.service';

@Component({
  selector: 'app-dekorater',
  templateUrl: './dekorater.component.html',
  styleUrls: ['./dekorater.component.css']
})
export class DekoraterComponent {

  loggedKorisnik:Korisnik=new Korisnik()
  photoPath:string=''
  usedMail:string=''
  img=new Image()
  errorString:string=''
  newPhotoFile:File|null=null;
  newPhoto:string=''
  ackString:string=''
  prihvaceni:Zakazivanje[]=[]

  constructor(private korisnikService: korisnikService,private router:Router,private zakazivanjeServis:ZakazivanjeService){}
  ngOnInit(): void {
    let logged=localStorage.getItem("logged")
    let type=localStorage.getItem("type")
    if(logged && type=='dekorater'){
      this.korisnikService.findByUsername(logged).subscribe(data=>{
        this.loggedKorisnik=data;
        this.usedMail=this.loggedKorisnik.email;
        this.photoPath=`http://localhost:4000/${this.loggedKorisnik.photoPath}`;

        if(this.loggedKorisnik.poslovi)
          for(let posao of this.loggedKorisnik.poslovi){
            this.zakazivanjeServis.getById(posao.idZakaz).subscribe(ret=>{
              if(ret){
                let tmp=new Zakazivanje()
                tmp=ret
                this.prihvaceni.push(tmp)
                if(this.istek24H(tmp) && tmp.photoPath=='' && tmp.status=='gotov'){
                  this.korisnikService.blokiraj(this.loggedKorisnik.username).subscribe(
                    data=>{
                      if(data){
                        alert("Suspendovani ste jer je proslo 24h od kraja radova.")
                      }
                      else{
                        console.error("ner adi suspendovanje")
                      }
                    }
                  )
                }
              }
              else{
                console.error("greska pri ucitavanju")
              }
            })
          }
    })
  }
  }
  
  promenaLoz(){
    this.router.navigate(['/promenalozinke'])
  }

  istek24H(zakaz:Zakazivanje){
    const currentDate = new Date();
    const endDate = new Date(zakaz.krajDatum);
    if(currentDate.getTime()> endDate.getTime()){
    const timeDifference = (currentDate.getTime() - endDate.getTime());

    const twentyFourHoursInMillis = 24 * 60 * 60 * 1000; 
    return timeDifference >= twentyFourHoursInMillis;}
    else{
      return false
    }
  }
      
  onFileSelected(event: any) {
    const file = event.target.files[0]
    if (file) {
      const validExtension = ['image/jpeg', 'image/png']

      if (!validExtension.includes(file.type)) {
        this.errorString = "Neodgovarajuca ekstenzija. Molimo vas unesite fotografiju u JPEG ili PNG formatu.";
        this.newPhotoFile=null;
        this.newPhoto=''
        return;
      }
      const img = new Image();

      img.src=URL.createObjectURL(file);

      img.onload=() =>{
        if(img.width >= 100 && img.width <= 300 && img.height >= 100 && img.height <= 300)
        {
          this.newPhotoFile=file;
          this.newPhoto=img.src;
        }
        else{
          this.errorString = "Neodgovarajuca fotografija. Molimo vas unesite fotografiju dimenzija od 100px * 100px do 300px *300px."
          this.newPhotoFile=null;
          this.newPhoto=''
          URL.revokeObjectURL(img.src);
        }
      };
      img.onerror=()=>{
        this.errorString="Greska pri ucitavanju fotografije"
        this.newPhotoFile=null;
        this.newPhoto=''
        URL.revokeObjectURL(img.src)
      };
    }
    else{
      this.newPhotoFile=null;
      this.newPhoto=''
    }
  }


  onUpdatePicture(){
    if(this.newPhotoFile==null){ this.errorString="Ucitajte novu fotografiju.";return;}
    this.korisnikService.updatePhoto(this.loggedKorisnik.username,this.newPhotoFile).subscribe(
      data=>{
        if(!data){
          this.errorString='Neuspesno azuriranje fotografije.'
        }
        else{
          console.log(data)
          this.newPhoto=''
          this.newPhotoFile=null
          this.ackString='Uspesno azurirana fotografija'
          this.ngOnInit();
        }
      }
    )
  }

  private emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  private phonePattern = /^\+\d{10,12}$/ 



  onUpdateProfile() { 
    this.errorString=''
    const allFieldsNotEmpty =
      this.loggedKorisnik.name &&
      this.loggedKorisnik.lastname &&
      this.loggedKorisnik.address &&
      this.loggedKorisnik.phone && 
      this.loggedKorisnik.email 

    if (!allFieldsNotEmpty) {
      this.errorString = 'Popunite sva polja.';
      return;
    }

    if (!this.emailPattern.test(this.loggedKorisnik.email)) {
      this.errorString = 'Nekorektna Email adresa.';
      return;
    }

    if (!this.phonePattern.test(this.loggedKorisnik.phone)) {
      this.errorString = 'Lose unet broj telefona.';
      return;
    }

    this.korisnikService.findByUsername(this.loggedKorisnik.username).subscribe(data=>{
      if(!data){
      this.errorString='Korisnik NEKIM CUDOM NE POSTOJI'
    }
    else{
      this.korisnikService.findByMail(this.loggedKorisnik.email).subscribe(data=>{
        if(data && data.email!=this.usedMail){
          this.errorString='Email je vec zauzet.'
        }
        else{
          this.errorString=''
          this.korisnikService.updateInfo(this.loggedKorisnik.username,
            this.loggedKorisnik.name ,
            this.loggedKorisnik.lastname ,
            this.loggedKorisnik.address ,
            this.loggedKorisnik.phone , 
            this.loggedKorisnik.email ,
            this.loggedKorisnik.creditCard).subscribe(data=>{
            if(data){
              this.ackString='Uspesno azurirani podaci'
              this.ngOnInit();
            }
            else{
              this.errorString='Neuspesno azuriranje informacija.'
            }
          })
        }
      })
      
  }})
}

logout(){
  localStorage.removeItem('logged')
  localStorage.removeItem('type')
  this.router.navigate(['/login'])
}


}

