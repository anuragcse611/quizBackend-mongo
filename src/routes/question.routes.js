import { Router } from "express";
import { getQuestionsByCategory, searchQuestions } from "../controllers/questions.controller.js";
import { submitAnswer } from '../controllers/questions.controller.js';

const router = Router();


router.route('/category/:categoryId').get(getQuestionsByCategory);

router.post('/submitAnswer', submitAnswer);

router.post('/searchQuestions', searchQuestions)

export default router;
