import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {HttpClientModule} from '@angular/common/http'
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { AdminComponent } from './admin/admin.component';
import { DekoraterComponent } from './dekorater/dekorater.component';
import { VlasnikComponent } from './vlasnik/vlasnik.component';
import { LoginComponent } from './login/login.component';
import { RegistracijaComponent } from './registracija/registracija.component';
import { PromenaLozinkeComponent } from './promena-lozinke/promena-lozinke.component';
import { FirmeComponent } from './firme/firme.component';
import { SveFirmeComponent } from './sve-firme/sve-firme.component';
import { ZakazivanjeComponent } from './zakazivanje/zakazivanje.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ListaZakazivanjaComponent } from './lista-zakazivanja/lista-zakazivanja.component';
import { BastaCanvasComponent } from './basta-canvas/basta-canvas.component';
import { OdrzavanjeComponent } from './odrzavanje/odrzavanje.component';
import { DekoratorZakazivanjaComponent } from './dekorator-zakazivanja/dekorator-zakazivanja.component';
import { DekoratorOdrzavanjaComponent } from './dekorator-odrzavanja/dekorator-odrzavanja.component';
import { DekoratorStatistikaComponent } from './dekorator-statistika/dekorator-statistika.component';
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { MainpageComponent } from './mainpage/mainpage.component';
import { AdminRegistracijaComponent } from './admin-registracija/admin-registracija.component';
import { AdminFirmaComponent } from './admin-firma/admin-firma.component';
import { NavComponent } from './nav/nav.component';
import { DekornavComponent } from './dekornav/dekornav.component';
import { AdminnavComponent } from './adminnav/adminnav.component';
@NgModule({
  declarations: [
    AppComponent,
    AdminComponent,
    DekoraterComponent,
    VlasnikComponent,
    LoginComponent,
    RegistracijaComponent,
    PromenaLozinkeComponent,
    FirmeComponent,
    SveFirmeComponent,
    ZakazivanjeComponent,
    ListaZakazivanjaComponent,
    BastaCanvasComponent,
    OdrzavanjeComponent,
    DekoratorZakazivanjaComponent,
    DekoratorOdrzavanjaComponent,
    DekoratorStatistikaComponent,
    AdminLoginComponent,
    MainpageComponent,
    AdminRegistracijaComponent,
    AdminFirmaComponent,
    NavComponent,
    DekornavComponent,
    AdminnavComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
