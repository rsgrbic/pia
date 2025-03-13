import  Express  from "express"
import { zakazivanjeController } from "../controllers/zakazivanje.controller"
import multer from "multer";
import path from "path";

const zakazivanjeRouter=Express.Router()

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'gardenPhotos/');
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname));
    },
  });
  const upload=multer({storage:storage})
  
zakazivanjeRouter.route("/getActiveByUsername").post(
    (req,res)=> new zakazivanjeController().getActivebyUsername(req,res)
)
zakazivanjeRouter.route("/createNew").post(
    (req,res)=> new zakazivanjeController().createNew(req,res)
)
zakazivanjeRouter.route("/getArchiveByUsername").post(
    (req,res)=> new zakazivanjeController().getArchivebyUsername(req,res)
)

zakazivanjeRouter.route("/cancel").post(
    (req,res)=> new zakazivanjeController().cancelById(req,res)
)
zakazivanjeRouter.route("/getFinished").post(
    (req,res)=> new zakazivanjeController().getFinished(req,res)
)
zakazivanjeRouter.route("/createOdrzavanje").post(
    (req,res)=> new zakazivanjeController().createOdrzavanje(req,res)
)

zakazivanjeRouter.route("/updateOdrzavanje").post(
    (req,res)=> new zakazivanjeController().updateOdrzavanje(req,res)
)

zakazivanjeRouter.route("/getActiveOdrzavanja").post(
    (req,res)=> new zakazivanjeController().getActiveOdrzavanja(req,res)
)

zakazivanjeRouter.route("/getDeclinedOdrzavanja").post(
    (req,res)=> new zakazivanjeController().getDeclinedOdrzavanja(req,res)
)

zakazivanjeRouter.route("/getById").post(
    (req,res)=> new zakazivanjeController().getById(req,res)
)

zakazivanjeRouter.route("/getNeodobrenaByFirmaId").post(
    (req,res)=> new zakazivanjeController().getNeodobrenaByFirmaId(req,res)
)
zakazivanjeRouter.route("/assignJob").post(
    (req,res)=> new zakazivanjeController().assignJob(req,res)
)

zakazivanjeRouter.route("/postPhoto").post(upload.single('photo'),
    (req,res)=> new zakazivanjeController().postPhoto(req,res)
)

zakazivanjeRouter.route("/getNeodobrenaOdrzavanjaByFirma").post(
    (req,res)=> new zakazivanjeController().getNeodobrenaOdrzavanjaByFirma(req,res)
)

zakazivanjeRouter.route("/getOdobrenaAktivnaOdrzavanjaByFirma").post(
    (req,res)=> new zakazivanjeController().getOdobrenaAktivnaOdrzavanja(req,res)
)

zakazivanjeRouter.route("/declineJob").post(
    (req,res)=> new zakazivanjeController().declineJob(req,res)
)
zakazivanjeRouter.route("/declineOdrzavanje").post(
    (req,res)=> new zakazivanjeController().declineOdrzavanje(req,res)
)

zakazivanjeRouter.route("/acceptOdrzavanje").post(
    (req,res)=> new zakazivanjeController().acceptOdrzavanje(req,res)
)

zakazivanjeRouter.route("/getMonthlyJobsByUser").post(
    (req,res)=> new zakazivanjeController().getMonthlyJobsByUser(req,res)
)
zakazivanjeRouter.route("/getJobsPerDecoratorInFirma").post(
    (req,res)=> new zakazivanjeController().getJobsPerDecoratorInFirma(req,res)
)

zakazivanjeRouter.route("/getJobsPerWeekday").get(
    (req,res)=> new zakazivanjeController().getJobsPerWeekday(req,res)
)

zakazivanjeRouter.route("/getAllDone").get(
    (req,res)=> new zakazivanjeController().getDone(req,res)
)

zakazivanjeRouter.route("/getmainPageInfo").get(
    (req,res)=> new zakazivanjeController().getMainPageInfo(req,res)
)







export default zakazivanjeRouter