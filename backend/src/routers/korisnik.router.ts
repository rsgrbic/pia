import multer from 'multer';
import { korisnikController } from '../controllers/korisnik.controller';
import  Express  from 'express';
import path from 'path';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname));
    },
  });
  
  const upload = multer({ storage: storage });


const korisnikRouter=Express.Router()

  korisnikRouter.route('/register').post(upload.single('profilePhoto'),
    (req,res)=> {
        new korisnikController().register(req,res)
  })

  korisnikRouter.route('/findByUsername').post(
  (req,res)=> new korisnikController().findbyUsername(req,res)
  )

  korisnikRouter.route('/findByEmail').post(
      (req,res)=> new korisnikController().findByEmail(req,res)
  )
  
  korisnikRouter.route('/login').post(
      (req,res)=> new korisnikController().login(req,res)
  )

  korisnikRouter.route('/captchaCheck').post(
      (req,res)=> new korisnikController().captchaCheck(req,res)
  )

  korisnikRouter.route('/updatePhoto').post(upload.single('profilePhoto'),
    (req,res)=> {
        new korisnikController().updatePhoto(req,res)
  })

  korisnikRouter.route('/updateInfo').post(
    (req,res)=> {
        new korisnikController().updateInfo(req,res)
  })

  korisnikRouter.route('/updateInfoDekor').post(
    (req,res)=> {
        new korisnikController().updateInfoDekor(req,res)
  })


  korisnikRouter.route('/changePassword').post(
    (req,res)=>{
      new korisnikController().changePassword(req,res)
    }
  )
  korisnikRouter.route('/blockUser').post(
    (req,res)=>{
      new korisnikController().blockUser(req,res)
    }
  )
  korisnikRouter.route('/getAll').get(
    (req,res)=> new korisnikController().getAll(req,res)
  )
  korisnikRouter.route('/getDekoratoriByFirmaId').post(
    (req,res)=> new korisnikController().getDekoratoriByFirmaId(req,res)
  )

  korisnikRouter.route('/deactivateUser').post(
    (req,res)=> new korisnikController().deactivateUser(req,res)
  )

  korisnikRouter.route('/unblockUser').post(
    (req,res)=> new korisnikController().unblockUser(req,res)
  )
  korisnikRouter.route('/denyUser').post(
    (req,res)=> new korisnikController().denyUser(req,res)
  )



  


export default korisnikRouter;