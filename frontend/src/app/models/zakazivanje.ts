import { oblik } from "./oblik";

export class Zakazivanje {
    _id: string = '';
    datumVreme: string = '';
    datumVremeTrenutno:string=''
    user: string = '';
    firma: string = '';
    tip: string = '';
    povrsinaBasta: number = 0;
    povrsinaZelenilo: number = 0;
    povrsinaBazen: number = 0;
    povrsinaLoza: number = 0;
    povrsinaFontana: number = 0;
    stolovi: number = 0;
    stolice: number = 0;
    dodatniZahtevi: string = '';
    krajDatum: string = '';
    uslugeFirme: {
      nazivUsluge: string;
      cena: number;
    }[] = [];
    status: string = '';
    basta:oblik[]=[]
    commentLeft:string=''
    odrzavanoDatum:string=''
    zaduzenDekorator:string=''
    photoPath:string=''
    commentDecline:string=''
  }