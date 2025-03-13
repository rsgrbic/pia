import mongoose from "mongoose";
import firma from "./firma";

const korisnikSchema = new mongoose.Schema(
    {
        username: String,
        password:String,
        name: String,
        lastname:String,
        gender: String,
        address:String,
        phone: String,
        email:String,
        creditCard: String,
        type:String,
        photoPath:String,
        firma:String,
        poslovi:[{
            idZakaz:String
        }],
        odrzavanja:[{
            idOdr:String
        }],
        status: { type: String, required: true, enum: ['obrada', 'aktivan', 'blokiran','deaktiviran','odbijen']}
    },{versionKey:false}
)
export default mongoose.model('KorisnikModel',korisnikSchema,'korisnici')