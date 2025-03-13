import { Zakazivanje } from "./zakazivanje"

export class Korisnik{
    username: string=''
    password:string=''
    name: string=''
    lastname:string=''
    gender: string=''
    address:string=''
    phone: string=''
    email:string=''
    creditCard: string=''
    type:'vlasnik'|'dekorater'|'admin'|''=''
    photoPath:string=''
    firma?:string
    poslovi?:{idZakaz:string}[]
    odrzavanja?:{idOdr:string}[]
    status:string='obrada'
}