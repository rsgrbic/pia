import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { korisnikService } from '../services/korisnik.service';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css']
})
export class AdminLoginComponent {
  username: string = '';
  password: string = '';
  errorString:string=''
  constructor(private servis:korisnikService,private router:Router){}

  onLogin() {
    this.errorString=''
    if(this.username&&this.password){
    this.servis.login(this.username.toLowerCase(),this.password).subscribe(data=>{
      if(data!=null){
        localStorage.setItem("logged",data.username.toLowerCase())
        localStorage.setItem("type",data.type)
        if(data.type=='admin'){
          this.router.navigate(['admin/info'])
        }
        else{
          this.errorString="Login samo za admine."
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
}
