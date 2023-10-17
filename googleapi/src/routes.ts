import { Router } from 'express'
import ImageController from '../controllers/ImageController'

const router = Router()

router.get('/image/:name', ImageController.findByName)


export default router