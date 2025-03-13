import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import korisnikRouter from './routers/korisnik.router'
import path from 'path';
import firmaRouter from './routers/firma.router';
import zakazivanjeRouter from './routers/zakazivanje.router';

const app = express();
app.use(cors())
app.use(express.json())
mongoose.connect('mongodb://127.0.0.1:27017/ProjekatBaza')
const  conn=mongoose.connection
conn.once('open',()=>{
    console.log("DB works")

})

const router=express.Router()
router.use('/korisnici',korisnikRouter)
router.use('/firme',firmaRouter)
router.use("/zakazivanja",zakazivanjeRouter)
app.use("/",router)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use('/gardenPhotos', express.static(path.join(__dirname, '../gardenPhotos')));

app.listen(4000,()=>console.log("Server pokrenut na port 4000"));