import { Component } from '@angular/core';
import { Korisnik } from '../models/Korisnik';
import { korisnikService } from '../services/korisnik.service';
import {  Router } from '@angular/router';
declare const grecaptcha: any;

@Component({
  selector: 'app-registracija',
  templateUrl: './registracija.component.html',
  styleUrls: ['./registracija.component.css']
})


export class RegistracijaComponent {
  
  username: string = ''
  password: string = ''
  firstName: string = ''
  lastName: string = ''
  gender: string = ''
  address: string = ''
  phone: string = '+381'
  email: string = ''
  profileImage: string=''
  profileImageFile:File|null=null
  creditCardNumber: string = ''
  errorString:string=''
  defaultProfileImage = 'assets/profile.png'
  constructor(private service:korisnikService,private router:Router){ } 
  onFileSelected(event: any) {
    const file = event.target.files[0]
    if (file) {
      const validExtension = ['image/jpeg', 'image/png']

      if (!validExtension.includes(file.type)) {
        this.errorString = "Neodgovarajuca ekstenzija. Molimo vas unesite fotografiju u JPEG ili PNG formatu.";
        this.profileImage = '';
        this.profileImageFile=null;
        return;
      }
      const img = new Image();

      img.src=URL.createObjectURL(file);

      img.onload=() =>{
        if(img.width >= 100 && img.width <= 300 && img.height >= 100 && img.height <= 300)
        {
          this.profileImage=img.src;
          this.profileImageFile=file;
        }
        else{
          this.errorString = "Neodgovarajuca fotografija. Molimo vas unesite fotografiju dimenzija od 100px * 100px do 300px *300px."
          this.profileImage = ''
          this.profileImageFile=null;
          URL.revokeObjectURL(img.src);
        }
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

   getProfileImageUrl():string{
     if(this.profileImage){
       return this.profileImage;
     }
     return this.defaultProfileImage;
   }
   back(){
    this.router.navigate(['/'])
  }

  private emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  private phonePattern = /^\+\d{10,12}$/  
  private passwordPattern =/^(?=[A-Za-z])(?=(?:.*[a-z]){3})(?=.*[A-Z])(?=.*\d)(?=.*[@$#!%*?&])[A-Za-z\d@#$!%*?&]{6,10}$/

  cardType:string=''
  checkCCNumber(){
    const dinersRegex = /^(300|301|302|303|36|38)/;
    const masterCardRegex = /^(51|52|53|54|55)/;
    const visaRegex = /^(4539|4556|4916|4532|4929|4485|4716)/;

    if (dinersRegex.test(this.creditCardNumber)) {
      this.cardType= 'diners';
    } else if (masterCardRegex.test(this.creditCardNumber)) {
      this.cardType= 'mastercard';
    } else if (visaRegex.test(this.creditCardNumber)) {
      this.cardType= 'visa';
    } else {
      this.cardType=''
    }
  }


  onRegister() {
    grecaptcha.enterprise.ready(async () => {
      const token = await grecaptcha.enterprise.execute('6Ld5_zEqAAAAANVCxljMvxR6ITPm4twVOCQoiUBi', {action: 'REGISTER'});
      if (token.length === 0) {
      alert('Ponovite.')
      return;
    }
    else{
      this.service.captchaCheck(token).subscribe(data=>{
        if(data){
    this.errorString=''
    const allFieldsNotEmpty =
      this.username &&
      this.password &&
      this.firstName &&
      this.lastName &&
      this.gender &&
      this.address &&
      this.phone && 
      this.email &&
      this.creditCardNumber;

    if (!allFieldsNotEmpty) {
      this.errorString = 'Popunite sva polja.';
      return;
    }

    if (!this.emailPattern.test(this.email)) {
      this.errorString = 'Nekorektna Email adresa.';
      return;
    }

    if (!this.phonePattern.test(this.phone)) {
      this.errorString = 'Lose unet broj telefona.';
      return;
    }

    if (!this.passwordPattern.test(this.password)) {

      this.errorString = this.password+ "Sifra ne ispunjava uslove. Mora poceti slovom, sadrzati bar jedno veliko i tri mala slova,bar jednu cifru,bar jedan specijalni karakter i biti dugacka 6-10 karaktera.";
      this.password=''
      return;
    }

    
    if(this.cardType=='diners' && this.creditCardNumber.length!=15){
        this.errorString='Molimo unesite vazecu karticu.'
        return;
    }
    if(this.cardType=='mastercard'&& this.creditCardNumber.length!=16){
        this.errorString='Molimo unesite vazecu karticu.'
        return;
    }
    if(this.cardType=='visa'&& this.creditCardNumber.length!=16){
        this.errorString='Molimo unesite vazecu karticu.'
        return;
    }
    if(this.cardType==''){
      this.errorString='Molimo unesite broj kartice.'
      return;
    }

    this.service.findByUsername(this.username).subscribe(data=>{
      if(data){
      this.errorString='Korisisnicko ime je zauzeto.'
    }
    else{
      this.service.findByMail(this.email).subscribe(data=>{
        if(data){
          this.errorString='Email je vec zauzet.'
        }
        else{
          this.errorString=''
          let vlasnik=new Korisnik()
          vlasnik.username=this.username.toLowerCase()
          vlasnik.address=this.address
          vlasnik.creditCard=this.creditCardNumber
          vlasnik.phone=this.phone
          vlasnik.name=this.firstName
          vlasnik.lastname=this.lastName;
          vlasnik.gender=this.gender
          vlasnik.email=this.email.toLowerCase()
          vlasnik.password=this.password;
          vlasnik.type='vlasnik'
          vlasnik.status='obrada'
          this.service.register(vlasnik,this.profileImageFile).subscribe(data=>{
            if(data){
              this.router.navigate(['/login'])
            }
          })
        }
      })
      
    }

})
        }
        else{this.errorString="Captcha ne prolazi."}
      })
    }
    });    


  }
}