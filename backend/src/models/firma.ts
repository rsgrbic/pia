import mongoose from "mongoose";

const FirmaSchema = new mongoose.Schema({
  _id:{type:mongoose.Schema.ObjectId,auto:true},
  naziv: String,
  adresa: String,
  ocena: String,
  telefon: String,
  brojKomentara:Number,
  odmorStart:String,
  odmorEnd:String,
  usluge: [{
    nazivUsluge: String,
    cena: Number
  }],
  komentari: [{
    autor:String,
    zakaz:String,
    val:Number,
    text: String,
  }],
  dekorateri:[{
    user:String
  }],
  koordinate: {
    lat: Number,
    lng: Number
  }
}, { versionKey: false });

export default mongoose.model('FirmaModel', FirmaSchema, 'firme');