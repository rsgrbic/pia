import { Component, OnInit } from '@angular/core';
import {  Router } from '@angular/router';
import { korisnikService } from '../services/korisnik.service';

@Component({
  selector: 'app-promena-lozinke',
  templateUrl: './promena-lozinke.component.html',
  styleUrls: ['./promena-lozinke.component.css']
})
export class PromenaLozinkeComponent implements OnInit{
  currUser:string=''
  type:string=''
  ngOnInit(): void {
    const usr=localStorage.getItem('logged')
    const type=localStorage.getItem('type')
    if(usr && type){
      this.currUser=usr
      this.type=type
    }
  }


  oldPassword: string = '';
  newPassword: string = '';
  newPassword2: string = '';
  errorString: string = '';
  
  nazad(){
    if(this.type=='dekorater')
    this.router.navigate(['/dekorater'])
    else if(this.type=='vlasnik')
      this.router.navigate(['/vlasnik'])
    else if(this.type=='admin')
      this.router.navigate(['/admin/info'])
  }
  constructor(private router:Router,private servis:korisnikService){}

  private passwordPattern =/^(?=[A-Za-z])(?=(?:.*[a-z]){3})(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,10}$/

  onChangePassword() {
    if (!this.passwordPattern.test(this.newPassword)) {

      this.errorString = "Sifra ne ispunjava uslove. Mora poceti slovom, sadrzati bar jedno veliko i tri mala slova,bar jednu cifru,bar jedan specijalni karakter i biti dugacka 6-10 karaktera.";
      return;
    }

    if (this.newPassword !== this.newPassword2) {
      this.errorString = 'Nove loinke nisu identicne.';
      return;
    }
    this.servis.changePassword(this.currUser,this.oldPassword,this.newPassword).subscribe(data=>{
      if(data){
        this.nazad()
      }
      else{
        this.errorString="Greska, molimo pokusajte ponovo."
      }
    })
  }
  
}
