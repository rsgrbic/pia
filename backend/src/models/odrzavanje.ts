import mongoose from 'mongoose';

const odrzavanjeSchema = new mongoose.Schema({
    datumVreme: String,
    datumVremeTrenutno:String,
    user: String,
    firma: { type: mongoose.Schema.Types.ObjectId, ref: 'FirmaModel', required: true },
    krajDatum: String,
    uslugeFirme: [{
      nazivUsluge: String,
      cena: Number
    }],
    status: { type: String, required: true, enum: ['obrada', 'odobren', 'odbijen','gotov','aktivan'] },
    zakaz:String,
    zaduzenDekorator:String,
    commentDecline:String
  }, { versionKey: false });

export default mongoose.model('OdrzavanjeModel', odrzavanjeSchema, 'odrzavanja');