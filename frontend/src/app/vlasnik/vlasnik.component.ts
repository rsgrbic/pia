import { Component, OnInit } from '@angular/core';
import { Korisnik } from '../models/Korisnik';
import { korisnikService } from '../services/korisnik.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-vlasnik',
  templateUrl: './vlasnik.component.html',
  styleUrls: ['./vlasnik.component.css']
})
export class VlasnikComponent implements OnInit {
  loggedKorisnik:Korisnik=new Korisnik()
  photoPath:string=''
  usedMail:string=''
  img=new Image()
  errorString:string=''
  newPhotoFile:File|null=null;
  newPhoto:string=''
  ackString:string=''

  constructor(private korisnikService: korisnikService,private router:Router){}
  ngOnInit(): void {
    let logged=localStorage.getItem("logged")
    let type=localStorage.getItem("type")
    if(logged && type=='vlasnik'){
      this.korisnikService.findByUsername(logged).subscribe(data=>{
        this.loggedKorisnik=data;
        this.usedMail=this.loggedKorisnik.email;
        this.photoPath=`http://localhost:4000/${this.loggedKorisnik.photoPath}`;
        this.checkCCNumber()
    })
  }
  }
      
  promenaLoz(){
    this.router.navigate(['/promenalozinke'])
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

  cardType:string=''

  checkCCNumber(){
    const dinersRegex = /^(300|301|302|303|36|38)/;
    const masterCardRegex = /^(51|52|53|54|55)/;
    const visaRegex = /^(4539|4556|4916|4532|4929|4485|4716)/;

    if (dinersRegex.test(this.loggedKorisnik.creditCard)) {
      this.cardType= 'diners';
    } else if (masterCardRegex.test(this.loggedKorisnik.creditCard)) {
      this.cardType= 'mastercard';
    } else if (visaRegex.test(this.loggedKorisnik.creditCard)) {
      this.cardType= 'visa';
    } else {
      this.cardType=''
    }
  }


  onUpdateProfile() { 
    this.errorString=''
    const allFieldsNotEmpty =
      this.loggedKorisnik.name &&
      this.loggedKorisnik.lastname &&
      this.loggedKorisnik.address &&
      this.loggedKorisnik.phone && 
      this.loggedKorisnik.email &&
      this.loggedKorisnik.creditCard;

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

    
    if(this.cardType=='diners' && this.loggedKorisnik.creditCard.length!=15){
        this.errorString='Molimo unesite vazecu karticu.'
        return;
    }
    if(this.cardType=='mastercard'&& this.loggedKorisnik.creditCard.length!=16){
        this.errorString='Molimo unesite vazecu karticu.'
        return;
    }
    if(this.cardType=='visa'&& this.loggedKorisnik.creditCard.length!=16){
        this.errorString='Molimo unesite vazecu karticu.'
        return;
    }
    if(this.cardType==''){
      this.errorString='Molimo unesite broj kartice.'
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