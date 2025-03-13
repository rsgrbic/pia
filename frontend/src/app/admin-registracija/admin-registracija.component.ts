import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Korisnik } from '../models/Korisnik';
import { korisnikService } from '../services/korisnik.service';
import { FirmaService } from '../services/firma.service';

@Component({
  selector: 'app-admin-registracija',
  templateUrl: './admin-registracija.component.html',
  styleUrls: ['./admin-registracija.component.css']
})
export class AdminRegistracijaComponent {
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
  errorString:string=''
  defaultProfileImage = 'assets/profile.png'
  @Input() firma:string=''

  constructor(private service:korisnikService,private firmaService:FirmaService,private router:Router){ } 
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

  private emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  private phonePattern = /^\+\d{10,12}$/  
  private passwordPattern =/^(?=[A-Za-z])(?=(?:.*[a-z]){3})(?=.*[A-Z])(?=.*\d)(?=.*[@$#!%*?&])[A-Za-z\d@#$!%*?&]{6,10}$/


  onRegister() {
    this.errorString=''
    const allFieldsNotEmpty =
      this.username &&
      this.password &&
      this.firstName &&
      this.lastName &&
      this.gender &&
      this.address &&
      this.phone && 
      this.email 

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
          let dekorater=new Korisnik()
          dekorater.username=this.username.toLowerCase()
          dekorater.address=this.address
          dekorater.phone=this.phone
          dekorater.name=this.firstName
          dekorater.lastname=this.lastName;
          dekorater.gender=this.gender
          dekorater.email=this.email.toLowerCase()
          dekorater.password=this.password;
          dekorater.type='dekorater'
          dekorater.status='aktivan'
          dekorater.firma=this.firma
          console.log(dekorater)

          this.service.register(dekorater,this.profileImageFile).subscribe(data=>{
            if(data){
                if(data){
                  this.firmaService.addDekor(dekorater.username,this.firma).subscribe(
                    data=>{
                      if(!data){
                        alert("Neuspesno dodavanje.")
                      }
                      else{
                        alert("uspesno dodato")
                      }
                    }
                  )
                }
            }
          })
        }
      })
      
    }

})

  }
}
