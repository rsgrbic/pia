
export class Odrzavanje {
    _id: string = '';
    datumVreme: string = '';
    datumVremeTrenutno:string=''
    user: string = '';
    firma: string = '';
    krajDatum: string = '';
    uslugeFirme: {
      nazivUsluge: string;
      cena: number;
    }[] = [];
    status: string = '';
    zakaz:string=''
    commentDecline:string=''
  }