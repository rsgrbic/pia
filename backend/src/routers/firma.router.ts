import  Express  from 'express';
import { firmaController } from '../controllers/firma.controller';

const firmaRouter=Express.Router()
  
firmaRouter.route("/getByName").post(
    (req,res)=> new firmaController().getByName(req,res)
)

firmaRouter.route("/getAll").get(
    (req,res)=> new firmaController().getAll(req,res)
)
firmaRouter.route("/search").post(
    (req,res)=> new firmaController().search(req,res)
)
firmaRouter.route("/getById").post(
    (req,res)=> new firmaController().getById(req,res)
)
firmaRouter.route("/addKomentar").post(
    (req,res)=> new firmaController().addKomentar(req,res)
)
firmaRouter.route("/getKomentar").post(
    (req,res)=> new firmaController().getKomentar(req,res)
)

firmaRouter.route("/addDekor").post(
    (req,res)=> new firmaController().addDekor(req,res)
)
firmaRouter.route("/registerFirma").post(
    (req,res)=> new firmaController().registerFirma(req,res)
)



export default firmaRouter;