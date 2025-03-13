import express from 'express'
import korisnikModel from '../models/korisnik'
import bcrypt, { compareSync } from 'bcrypt'
import path from 'path';
import fs from 'fs';
const { RecaptchaEnterpriseServiceClient } = require('@google-cloud/recaptcha-enterprise');

async function hashPassword(text: string) {
  const res = await bcrypt.hash(text, 10)
  return res
}

async function checkPassword(text: string, hashed: string) {
  const res = await bcrypt.compare(text, hashed)
  return res
}

export class korisnikController {
  register = (req: express.Request, res: express.Response) => {
    const reqVlasnik = JSON.parse(req.body.vlasnik)

    let vlasnik = {
      username: reqVlasnik.username,
      name: reqVlasnik.name,
      lastname: reqVlasnik.lastname,
      gender: reqVlasnik.gender,
      address: reqVlasnik.address,
      phone: reqVlasnik.phone,
      email: reqVlasnik.email,
      creditCard: reqVlasnik.creditCard,
      type: reqVlasnik.type,
      status:reqVlasnik.status,
      password: '',
      photoPath: '',
      firma:reqVlasnik.firma?reqVlasnik.firma:''
    }

    vlasnik.photoPath = req.file ? req.file.path : 'uploads/default.png';

    hashPassword(reqVlasnik.password).then(data => {
      vlasnik.password = data

      new korisnikModel(vlasnik).save().then(ok => {
        res.json("OK")
      }).catch(err => {
        res.json(err)
      })
    })

  }

  getAll = (req: express.Request, res: express.Response) => {
    korisnikModel.find({}).then(
      data => {
        if (data) {
          res.json(data)
        }
        else
          res.json(null)
      }
    )
  }

  getDekoratoriByFirmaId = (req: express.Request, res: express.Response) => {
    const firmId = req.body.id
    korisnikModel.find({ type: 'dekorater', firma: firmId }).then(
      data => {
        if (data)
          res.json(data)
        else
          res.json(null)
      }
    )

  }


  findbyUsername = (req: express.Request, res: express.Response) => {
    let username = req.body.username;
    korisnikModel.findOne({ username: { $regex: new RegExp(`^${username}$`, 'i') } }).then(
      user => {
        res.json(user)
      }
    ).catch(err => console.log(err))
  }

  unblockUser=(req:express.Request,res:express.Response)=>{
    korisnikModel.updateOne({username:req.body.user},{status:'aktivan'}).then(
      data=>{
        if(data){
          res.json("OK")
        }
        else{
          res.json(null)
        }
      }
    )
  }
  denyUser=(req:express.Request,res:express.Response)=>{
    korisnikModel.updateOne({username:req.body.user},{status:'odbijen'}).then(
      data=>{
        if(data){
          res.json("OK")
        }
        else{
          res.json(null)
        }
      }
    )
  }

  deactivateUser=(req:express.Request,res:express.Response)=>{
    korisnikModel.updateOne({username:req.body.user},{status:'deaktiviran'}).then(
      data=>{
        if(data){
          res.json("OK")
        }
        else{
          res.json(null)
        }
      }
    )
  }


  findByEmail = (req: express.Request, res: express.Response) => {
    let email = req.body.email
    korisnikModel.findOne({ email: email }).then(
      user => {
        res.json(user)
      }
    ).catch(err => console.log(err))
  }

  login = (req: express.Request, res: express.Response) => {

    korisnikModel.findOne({ username: req.body.username }).then(user => {
      if (user && user.password) {
        checkPassword(req.body.password, user.password).then(data => {
          if (data) {
            res.json(user)
          }
          else {
            res.json(null)
          }
        })

      }
      else {
        res.json(null)
      }
    })
  }

  captchaCheck = async (req: express.Request, res: express.Response) => {

    const token = req.body.data
    if (!token) {
      res.json(null)
    }
    else {
      const client = new RecaptchaEnterpriseServiceClient()
      try {
        const projectPath = client.projectPath("pia-projekat-1724957601455")
        const [response] = await client.createAssessment({
          assessment: {
            event: {
              token: token,
              siteKey: '6Ld5_zEqAAAAANVCxljMvxR6ITPm4twVOCQoiUBi',
            },
          },
          parent: projectPath,
        });

        if (response.tokenProperties && response.tokenProperties.valid) {
          res.json("ok");
        } else {
          res.json(null);
        }
      } catch (error) {
        res.json(null);
      }

    }
  }

  updatePhoto = (req: express.Request, res: express.Response) => {
    const photoPath = req.file ? req.file.path : 'default';
    const username = JSON.parse(req.body.username)
    korisnikModel.findOneAndUpdate({ username: username }, { photoPath: photoPath }).then(vlasnik => {
      if (vlasnik) {
        const old = vlasnik.photoPath
        if (old != 'default' && old != null) {
          const ppath = path.join(__dirname, '..', '..', old)
          fs.unlink(ppath, (err) => {
            if (err) {
              console.log("Greska u brisanju")
            }
          })
        }
        res.json("OK")
      }
      else {
        res.json(null)
      }
    })
  }
  updateInfo = (req: express.Request, res: express.Response) => {
    korisnikModel.updateOne({ username: req.body.username },
      {
        name: req.body.name,
        lastname: req.body.lastname,
        address: req.body.address,
        phone: req.body.phone,
        email: req.body.email,
        creditCard: req.body.creditCard
      }, { new: true }
    ).then(data => {
      if (data){
        res.json("OK");}
      else
        res.json(null)
    }

    ).catch(err=>console.error(err))
  }

  updateInfoDekor = (req: express.Request, res: express.Response) => {
    korisnikModel.updateOne({ username: req.body.username },
      {
        name: req.body.name,
        lastname: req.body.lastname,
        address: req.body.address,
        phone: req.body.phone,
        email: req.body.email,
        firma: req.body.firma
      }, { new: true }
    ).then(data => {
      if (data)

        res.json("OK");
      else
        res.json(null)
    }

  ).catch(err=>console.error(err))
  }

  changePassword = (req: express.Request, res: express.Response) => {
    const username = req.body.username
    const old = req.body.password
    const newpwd = req.body.newpwd

    korisnikModel.findOne({ username: username }).then(user => {
      if (user && user.password) {
        checkPassword(old, user.password).then(data => {
          if (data) {
            hashPassword(newpwd).then(newhash => {
              korisnikModel.findOneAndUpdate({ username: username }, { password: newhash }).then(result => {
                if (result) {
                  res.json("OK")
                }
                else
                  res.json(null)
              })
            })
          }

          else {
            res.json(null)
          }
        })

      }
      else {
        res.json(null)
      }
    })

  }

  blockUser = (req: express.Request, res: express.Response) => {
    let username = req.body.username
    korisnikModel.updateOne({ username: username }, { status: 'blokiran' }).then(
      data => {
        if (data)
          res.json("OK")
        else
          res.json(null)
      }
    )
  }


}

