import express from 'express'
import firmaModel from '../models/firma'
import zakazivanjeModel from '../models/zakazivanje'
import { mongo, Mongoose } from 'mongoose';
const mongoose = require('mongoose');
export class firmaController{
    getByName=(req:express.Request,res:express.Response)=>{
        const name=req.body.name
        firmaModel.findOne({naziv:name}).then(
            data=>{
                if(data){
                    res.json(data)
                }
                else
                res.json(null)
            }
        )
    }
    getAll=(req:express.Request,res:express.Response)=>{
        firmaModel.find({}).then(data=>{
            if(data){
                res.json(data)
            }
            else
            res.json(null)
        })
    }

    getById=(req:express.Request,res:express.Response)=>{
        const id=req.body.id
        firmaModel.findOne({_id: new mongoose.Types.ObjectId(id)}).then(data=>{
            if(data){
                res.json(data)
            }
            else
            res.json(null)

        })
    }
    
    addDekor=(req:express.Request,res:express.Response)=>{
        const user=req.body.user
        const firma=req.body.firma
        firmaModel.updateOne({_id:new mongoose.Types.ObjectId(firma)},{$push:{dekorateri:{user:user}}})
        .then(
            data=>{
                if(data){
                    res.json(data)
                }
                else
                    res.json(null)
            }
        )
    }

    search=(req:express.Request,res:express.Response)=>{
        const naziv=req.body.naziv
        const adresa=req.body.adresa

        const searchCriteria: any = {};

        if (naziv) {
            searchCriteria.naziv = { $regex: naziv, $options: 'i' }; 
        }
        if (adresa) {
            searchCriteria.adresa = { $regex: adresa, $options: 'i' }; 
        }

        firmaModel.find(searchCriteria).then(data=>{
            if(data){
                res.json(data)
            }
            else
            res.json(null)
        })

    }

    addKomentar=(req:express.Request,res:express.Response)=>{
        const autor=req.body.autor
        const val=req.body.val
        const text=req.body.text
        const idFirm=req.body.idFirm
        const idZakaz=req.body.idZakaz
        let kom={
            autor:autor,
            val:val,
            zakaz:idZakaz,
            text:text
        }
        const fls=true
        firmaModel.findOne({_id:new mongoose.Types.ObjectId(idFirm)}).then(
            result=>{
                if(result){
                    let ocenaVal=parseFloat(result.ocena!)
                    let num=result.brojKomentara!
                    const newOcena=(ocenaVal*num+val)/(num+1)
                    num=num+1;
                     firmaModel.updateOne({_id: new mongoose.Types.ObjectId(idFirm)},
                    {$push:{komentari:kom},ocena:newOcena.toString(),brojKomentara:num})
                    .then(data=>{
                        if(data){
                            zakazivanjeModel.updateOne({_id: new mongoose.Types.ObjectId(idZakaz)},{commentLeft:"true"}).then(
                                ret=> res.json("OK")
                            ).catch(err=>console.error(err))
                            
                        }
                        else
                        res.json(null)
                    }

                    ).catch(err=>{
                        console.error(err)
                    })
                }
            }
        )

    }

    getKomentar=(req:express.Request,res:express.Response)=>{
        const idFirm=req.body.idFirm
        const idZakaz=req.body.idZakaz
        firmaModel.findOne(
            { _id: new mongoose.Types.ObjectId(idFirm)}
            ).then(firma => {
            if(firma && firma.komentari.length>0){
                const retVal=firma.komentari.find(komentar=> komentar.zakaz==idZakaz)
                res.json(retVal)
            }
            
            else{
                res.json(null)
            }})
        .catch(err=>{console.error(err)})
    }

    registerFirma=(req:express.Request,res:express.Response)=>{
        const firma=req.body.firma

        firmaModel.init()
        let newFirma=new firmaModel({
            
            naziv:firma.naziv,
            adresa:firma.adresa,
            ocena:firma.ocena,
            telefon:firma.telefon,
            brojKomentara:firma.brojKomentara,
            usluge:firma.usluge,
            komentari:[],
            dekorateri:firma.dekoratori,
            koordinate:firma.koordinate,
            odmorEnd:firma.odmorEnd,
            odmorStart:firma.odmorStart

        })
        newFirma.save().then(data=>{
            res.json(data)
        }
        )
        
    }
}