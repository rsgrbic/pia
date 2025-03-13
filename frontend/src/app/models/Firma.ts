export class Firma {
    _id:string='';
    naziv: string='';
    adresa: string='';
    ocena: string='';
    telefon: string='';
    usluge: Array<{ nazivUsluge: string; cena: number }>=[];
    komentari: Array<{ autor:string,zakaz:string,val:number,text: string }>=[];
    koordinate: { lat: number; lng: number; }={ lat: 0, lng: 0 };
    dekoratori:Array<{user:string}>=[]
    brojKomentara:number=0
    odmorStart:string=''
    odmorEnd:string=''
  }