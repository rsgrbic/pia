import { Component } from '@angular/core';
import { korisnikService } from '../services/korisnik.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  errorString:string=''
  constructor(private servis:korisnikService,private router:Router){}

  onLogin() {
    this.errorString=''
    if(this.username&&this.password){
    this.servis.login(this.username.toLowerCase(),this.password).subscribe(data=>{
      if(data!=null){
        if(data.status=='deaktiviran'){
          this.errorString="Nalog nije aktivan."
          return;
        }
        if(data.status=='obrada'){
          this.errorString="Molimo sacekajte na odobrenje registracije."
          return
        }
        localStorage.setItem("logged",data.username.toLowerCase())
        localStorage.setItem("type",data.type)
        if(data.type=='vlasnik'){
          this.router.navigate(['vlasnik'])
        }
        else if(data.type=='dekorater'){
          this.router.navigate(['dekorater'])
        }
      }
      else{
        this.errorString='Netacni kredencijali.'
      }
    })
 }
 else{
  this.errorString="Unesite kredencijale."
 }
}
back(){
  this.router.navigate(['/'])
}
}