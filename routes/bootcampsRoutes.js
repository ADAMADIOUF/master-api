import express from "express"
import { createAllBootcamps, deleteSingleBootcamp, getAllBootcamps, getBootcampsInRadius, getSingleBootcamp, updateBootcamp } from "../controllers/bootcampsControllers.js"
const router = express.Router()
import courseRouter from "./courseRoute.js"
router.use('/:bootcampId/courses', courseRouter)
router.route('/').get(getAllBootcamps).post(createAllBootcamps)
router
  .route('/:id')
  .get(getSingleBootcamp)
  .put(updateBootcamp)
  .delete(deleteSingleBootcamp)
router.route('/radius/:zipcode/:distance').get(getBootcampsInRadius)






export default router