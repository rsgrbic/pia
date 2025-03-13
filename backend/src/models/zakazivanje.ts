import mongoose from 'mongoose';

const ZakazivanjeSchema = new mongoose.Schema({
    datumVreme: String,
    datumVremeTrenutno:String,
    user: String,
    firma: { type: mongoose.Schema.Types.ObjectId, ref: 'FirmaModel', required: true },
    tip: { type: String, enum: ['private', 'restaurant'], required: true },
    povrsinaBasta: Number,
    povrsinaZelenilo: Number,
    povrsinaBazen: Number,
    povrsinaLoza: Number,
    povrsinaFontana: Number,
    stolovi: Number,
    stolice: Number,
    dodatniZahtevi: String,
    krajDatum: String,
    commentLeft:String,
    odrzavanoDatum:String,
    zaduzenDekorator:String,
    photoPath:String,
    commentDecline:String,
    uslugeFirme: [{
      nazivUsluge: String,
      cena: Number
    }],
    status: { type: String, required: true, enum: ['obrada', 'odobren', 'odbijen','gotov','aktivan','otkazan'] },
    basta:[{
      color:String,
      x:Number,
      y:Number,
      stranica:Number,
      sirina:Number,
      visina:Number,
      pprecnik:Number,
      tip:{type:String,enum:['kvadrat','pravougaonik','krug']},

    }]
  }, { versionKey: false });

export default mongoose.model('ZakazivanjeModel', ZakazivanjeSchema, 'zakazivanja');