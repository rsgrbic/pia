import mongoose, { mongo, Mongoose } from "mongoose";
import zakazivanjeModel from "../models/zakazivanje";
import odrzavanjeModel from "../models/odrzavanje";
import express from "express"
import korisnikModel from "../models/korisnik"
export class zakazivanjeController{
    getActivebyUsername=(req:express.Request,res:express.Response)=>{
        let username=req.body.username;
        zakazivanjeModel.find({user:username,status:{$in:['obrada','odobren','aktivan']}}).then(
            data=>{
                res.json(data)
            }
        ).catch(err=>console.log(err))
        }

    createNew=(req:express.Request,res:express.Response)=>{
        let newR=req.body.new
        newR._id=null;
        new zakazivanjeModel(newR).save().then(response=>{
            if(response){
                res.json("OK")
            }
            else 
                res.json(null)
        }).catch(err=>console.log(err))
    }

    getArchivebyUsername=(req:express.Request,res:express.Response)=>{
        let username=req.body.username;
        zakazivanjeModel.find({user:username,status:{$in:['odbijen','gotov','otkazan']}}).then(
            data=>{
                res.json(data)
            }
        ).catch(err=>console.log(err))
        }

    cancelById=(req:express.Request,res:express.Response)=>{
        let id=req.body._id
        zakazivanjeModel.updateOne({_id:new mongoose.Types.ObjectId(id)},{status:"otkazan"}).then(data=>{
            if(data.acknowledged===true){
                res.json("OK")
            }
            else{
                res.json(null)
            }
        }).catch(err=>console.log(err))
    }

    getFinished=(req:express.Request,res:express.Response)=>{
        let username=req.body.username;
        zakazivanjeModel.find({user:username,status:'gotov'}).then(
            data=>{
                res.json(data)
            }
        ).catch(err=>console.log(err))
        }

    createOdrzavanje=(req:express.Request,res:express.Response)=>{
        let newo=req.body.new
        newo._id=null
        new odrzavanjeModel(newo).save().then(response=>{
            if(response){
                res.json("OK")
            }
            else 
                res.json(null)
        }).catch(err=>console.log(err))
    }

    updateOdrzavanje=(req:express.Request,res:express.Response)=>{
        let id=req.body.id
        let datum=req.body.datum
        zakazivanjeModel.updateOne({_id:new mongoose.Types.ObjectId(id)},{odrzavanoDatum:datum}).then(
            response=>{
            if(response){
                res.json("OK")
            }
            else 
                res.json(null)
        }).catch(err=>console.log(err))
    }

    getDeclinedOdrzavanja=(req:express.Request,res:express.Response)=>{
        let user=req.body.user
        odrzavanjeModel.find({user:user,status:'odbijen'}).then(
            data=>{
                if(data){
                    res.json(data)
                }
                else res.json(null)
            }
        ).catch(err=>console.log(err))
    }

    getActiveOdrzavanja=(req:express.Request,res:express.Response)=>{
        let user=req.body.user
        odrzavanjeModel.find({user:user,status:{$in:['obrada','odobren','aktivan']}}).then(
            data=>{
                if(data){
                    res.json(data)
                }
                else res.json(null)
            }
        ).catch(err=>console.log(err))
    }

    getById=(req:express.Request,res:express.Response)=>{
        let id=req.body.id
        zakazivanjeModel.findOne({_id:id}).then(
            data=>{
                if(data){
                    res.json(data)
                }
                else res.json(null)
            }
        )
    }

    getNeodobrenaByFirmaId=(req:express.Request,res:express.Response)=>{
        let id=req.body.id
        zakazivanjeModel.find({firma:id,status:'obrada'}).then(data=>{
            if(data)
                res.json(data)
            else
                res.json(null)
        })
    }

    assignJob=(req:express.Request,res:express.Response)=>{
        let id=req.body.id
        let user=req.body.user

        zakazivanjeModel.updateOne({_id:new mongoose.Types.ObjectId(id)},{zaduzenDekorator:user,status:'odobren'}).then(data=>{
            if(data){
                korisnikModel.updateOne({username:user},{$push:{poslovi:{idZakaz:id}}}).then(data=>{
                    if(data){
                        res.json("OK")
                    }
                    else
                    res.json(null)
                }
                )
            }
            else{
                res.json(null)
            }
        }
        )

    }

    postPhoto=(req:express.Request,res:express.Response)=>{
        const id=req.body.id
        const photoPath=req.file? req.file.path:null

        zakazivanjeModel.updateOne({_id:new mongoose.Types.ObjectId(id)},{photoPath:photoPath}).then(data=>{
            if(data){
                res.json("OK")
            }
            else
                res.json(null)
        }
        )
    }

    getNeodobrenaOdrzavanjaByFirma=(req:express.Request,res:express.Response)=>{
        const id=req.body.firma
        odrzavanjeModel.find({firma:new mongoose.Types.ObjectId(id),status:{$in:['obrada']}}).then(
            data=>{
                if(data){
                    res.json(data)
                }
                else
                    res.json(null)
            }
        ).catch(err=>console.error(err))
    }

    getOdobrenaAktivnaOdrzavanja=(req:express.Request,res:express.Response)=>{
        const id=req.body.firma
        odrzavanjeModel.find({firma:new mongoose.Types.ObjectId(id),status:{$in:['odobren','aktivan']}}).then(
            data=>{
                if(data){
                    res.json(data)
                }
                else
                    res.json(null)
            }
        ).catch(err=>console.error(err))
    }

    declineJob=(req:express.Request,res:express.Response)=>{
        const id=req.body.id
        const comment=req.body.comment
        zakazivanjeModel.updateOne({_id:new mongoose.Types.ObjectId(id)},{commentDecline:comment,status:'odbijen'}).then(
            data=>{
                if(data){
                    res.json(data)
                }
                else
                    res.json(null)
            }
        ).catch(err=>console.error(err))
    }

    declineOdrzavanje=(req:express.Request,res:express.Response)=>{
        const id=req.body.id
        const comment=req.body.comment
        odrzavanjeModel.updateOne({_id:new mongoose.Types.ObjectId(id)},{commentDecline:comment,status:'odbijen'}).then(
            data=>{
                if(data){
                    res.json(data)
                }
                else
                    res.json(null)
            }
        ).catch(err=>console.error(err))
    }

    acceptOdrzavanje=(req:express.Request,res:express.Response)=>{
        let id=req.body.id
        let user=req.body.user
        let dateEnd=req.body.date

        odrzavanjeModel.updateOne({_id:new mongoose.Types.ObjectId(id)},{zaduzenDekorator:user,status:'odobren',krajDatum:dateEnd}).then(data=>{
            if(data){
                korisnikModel.updateOne({username:user},{$push:{odrzavanja:{idOdr:id}}}).then(data=>{
                    if(data){
                        res.json("OK")
                    }
                    else
                    res.json(null)
                }
                )
            }
            else{
                res.json(null)
            }
        }
        )

    }

    getMonthlyJobsByUser=(req:express.Request,res:express.Response)=>{
        const user=req.body.user
        const resMap=new Map<string,number>()
        zakazivanjeModel.find({zaduzenDekorator:user,status:{$in:['odobren','gotov']}}).then(
            data=>{
                if(data){
                    data.forEach(zakaz=>{
                        const mesec=new Date(zakaz.datumVreme!).toLocaleString('default',{month:"short"})
                        resMap.set(mesec,(resMap.get(mesec)||0)+1)
                    })

                    odrzavanjeModel.find({zaduzenDekorator:user,status:{$in:['odobren','gotov']}}).then(
                    data=>{
                        if(data){
                            data.forEach(zakaz=>{
                            const mesec=new Date(zakaz.datumVreme!).toLocaleString('default',{month:"short"})
                            resMap.set(mesec,(resMap.get(mesec)||0)+1)
                            })
                            
                            const retVal=Array.from(resMap,([mesec,brojPoslova])=>({
                            mesec:mesec,
                            broj:brojPoslova
                            }))

                            
                            res.json(retVal)

                        }
                        else
                        res.json(null)
                       
                    })
                    }
                    else
                    res.json(null)
                }
            
        )
    }
    getJobsPerDecoratorInFirma= async(req:express.Request,res:express.Response)=>{
        const id=req.body.id
        const zakazivanja = await zakazivanjeModel.find({firma:new mongoose.Types.ObjectId(id),status:{$in:['odobren','gotov']} });
        const odrzavanja =await odrzavanjeModel.find({firma:new mongoose.Types.ObjectId(id),status:{$in:['odobren','gotov']} });
        if (!zakazivanja.length && !odrzavanja.length) {
            res.json(null);
            return;
        }

        const jobsDekorator = new Map<string, number>();
        zakazivanja.forEach(zakaz => {
            const dekorator = zakaz.zaduzenDekorator!
            jobsDekorator.set(dekorator, (jobsDekorator.get(dekorator) || 0) + 1);
        });

        odrzavanja.forEach(odr => {
            const dekorator = odr.zaduzenDekorator!
            jobsDekorator.set(dekorator, (jobsDekorator.get(dekorator) || 0) + 1);
        });
        const result = Array.from(jobsDekorator, ([dekorator, broj]) => ({
            dekorator:dekorator,
            broj:broj
        }));
        res.json(result);
    }

    getJobsPerWeekday= async (req:express.Request,res:express.Response)=>{
        const zakazivanja = await zakazivanjeModel.find({ });
        const odrzavanja =await odrzavanjeModel.find({ });
        if (!zakazivanja.length && !odrzavanja.length ) {
          res.json(null);
          return;
        }

        const now = Date.now();

        const filteredZakazi = zakazivanja.filter(zakaz => {
        const danD = new Date(zakaz.datumVreme!);
        return now - danD.getTime() <= 365 * 24 * 60 * 60 * 1000; 
        });

        const filteredOdr = odrzavanja.filter(odr => {
            const danD = new Date(odr.datumVreme!);
            return now - danD.getTime() <= 365 * 24 * 60 * 60 * 1000; 
            });
            

        
        const jobsByDay = new Map<string, number>([
          ['Mon', 0],
          ['Tue', 0],
          ['Wed', 0],
          ['Thu', 0],
          ['Fri', 0],
          ['Sat', 0],
          ['Sun', 0]
        ]);
      
        filteredZakazi.forEach(zakaz => {
          const date = new Date(zakaz.datumVreme!);
          const dayOfWeek = date.toLocaleString('default', { weekday: 'short' });
          jobsByDay.set(dayOfWeek, (jobsByDay.get(dayOfWeek) || 0) + 1);
        });

        filteredOdr.forEach(odr => {
            const date = new Date(odr.datumVreme!);
            const dayOfWeek = date.toLocaleString('default', { weekday: 'short' });
            jobsByDay.set(dayOfWeek, (jobsByDay.get(dayOfWeek) || 0) + 1);
          });


      
        const result = Array.from(jobsByDay, ([day, broj]) => ({
          dan: day,
          broj:(broj/52).toFixed(2)
        }));
      
        res.json(result)

    }


  

    getDone=(req:express.Request,res:express.Response)=>{
        zakazivanjeModel.find({status:'gotov'}).then(
            data=>{
                if(data)
                    res.json(data)
                else
                    res.json(null)
            }
        )
    }

    getMainPageInfo=(req:express.Request,res:express.Response)=>{
        const now = new Date();
        const oneDayAgo = new Date(now.getTime() - (24 * 60 * 60 * 1000));      
        const sevenDaysAgo = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000)); 
        const thirtyDaysAgo = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000)); 

        let countLast24Hours = 0;
        let countLast7Days = 0;
        let countLast30Days = 0;
        zakazivanjeModel.find().then(all=>{
            if(all){
                all.forEach(zakazivanje => {
                    const datumVremeTrenutnoDate = new Date(zakazivanje.datumVremeTrenutno!);
        
                    if (datumVremeTrenutnoDate >= oneDayAgo) {
                        countLast24Hours++;
                    }
        
                    if (datumVremeTrenutnoDate >= sevenDaysAgo) {
                        countLast7Days++;
                    }
        
                    if (datumVremeTrenutnoDate >= thirtyDaysAgo) {
                        countLast30Days++;
                    }
                });

            odrzavanjeModel.find().then(svi=>{
                if(svi){
                    svi.forEach(odr => {
                        const datumVremeTrenutnoDate = new Date(odr.datumVremeTrenutno!);
            
                        if (datumVremeTrenutnoDate >= oneDayAgo) {
                            countLast24Hours++;
                        }
            
                        if (datumVremeTrenutnoDate >= sevenDaysAgo) {
                            countLast7Days++;
                        }
            
                        if (datumVremeTrenutnoDate >= thirtyDaysAgo) {
                            countLast30Days++;
                        }
                    });
                    let result={
                        dan:countLast24Hours,
                        nedelja:countLast7Days,
                        mesec:countLast30Days
                    }
                    res.json(result)
                }
                else{
                    res.json(null)
                }
            })
            }
            else{
                res.json(null)
            }
        })
    }

}