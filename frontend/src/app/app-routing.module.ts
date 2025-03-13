import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin/admin.component';
import { VlasnikComponent } from './vlasnik/vlasnik.component';
import { DekoraterComponent } from './dekorater/dekorater.component';
import { LoginComponent } from './login/login.component';
import { RegistracijaComponent } from './registracija/registracija.component';
import { PromenaLozinkeComponent } from './promena-lozinke/promena-lozinke.component';
import { FirmeComponent } from './firme/firme.component';
import { SveFirmeComponent } from './sve-firme/sve-firme.component';
import { authGuard } from './auth.guard';
import { ListaZakazivanjaComponent } from './lista-zakazivanja/lista-zakazivanja.component';
import { OdrzavanjeComponent } from './odrzavanje/odrzavanje.component';
import { DekoratorZakazivanjaComponent } from './dekorator-zakazivanja/dekorator-zakazivanja.component';
import { DekoratorOdrzavanjaComponent } from './dekorator-odrzavanja/dekorator-odrzavanja.component';
import { DekoratorStatistikaComponent } from './dekorator-statistika/dekorator-statistika.component';
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { MainpageComponent } from './mainpage/mainpage.component';
import { AdminFirmaComponent } from './admin-firma/admin-firma.component';
import { adminGuardGuard } from './admin-guard.guard';
import { dekorGuardGuard } from './dekor-guard.guard';
import { loggedGuard } from './logged.guard';

const routes: Routes = [
  {path:"admin/info",component:AdminComponent,canActivate:[adminGuardGuard]},
  {path:"vlasnik",component:VlasnikComponent,canActivate:[authGuard]},
  {path:"dekorater",component:DekoraterComponent,canActivate:[dekorGuardGuard]},
  {path:"login",component:LoginComponent},
  {path:"registracija",component:RegistracijaComponent},
  {path:"promenalozinke",component:PromenaLozinkeComponent,canActivate:[loggedGuard]},
  {path:"vlasnik/firme",component:SveFirmeComponent,canActivate:[authGuard]},
  {path:"vlasnik/firme/:id",component:FirmeComponent,canActivate:[authGuard]},
  {path:"vlasnik/zakazivanja",component:ListaZakazivanjaComponent,canActivate:[authGuard]},
  {path:"vlasnik/odrzavanja",component:OdrzavanjeComponent,canActivate:[authGuard]},
  {path:"dekorater/zakazivanja",component:DekoratorZakazivanjaComponent,canActivate:[dekorGuardGuard]},
  {path:"dekorater/odrzavanja",component:DekoratorOdrzavanjaComponent,canActivate:[dekorGuardGuard]},
  {path:"dekorater/statistika",component:DekoratorStatistikaComponent,canActivate:[dekorGuardGuard]},
  {path:"admin",component:AdminLoginComponent},
  {path:"",component:MainpageComponent},
  {path:"admin/firma",component:AdminFirmaComponent,canActivate:[adminGuardGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
