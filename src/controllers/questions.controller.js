import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { Question } from "../models/questions.models.js";
import { UserAnswer } from '../models/userAnswer.models.js';
import moment from 'moment-timezone';


const getQuestionsByCategory = asyncHandler(async (req, res) => {
  const categoryId = req.params.categoryId;

  const questions = await Question.find({ categories: categoryId }).populate('categories', 'name');

  if (!questions || questions.length === 0) {
    const error = new apiError(404, "Questions not found for this category");
    console.error(error);
    return res.status(404).json(new apiResponse(404, null, "Questions not found for this category"));
  }

  return res.status(200).json(new apiResponse(200, questions, "Questions fetched successfully"));
});


const submitAnswer = async (req, res) => {
    try {
      const { userId, questionId, selectedOption } = req.body;
  
      
      if (!userId || !questionId || !selectedOption) {
        throw new Error('Missing required fields');
      }

      const question = await Question.findById(questionId);

    if (!question) {
      throw new Error('Question not found');
    }
  
      const userAnswer = new UserAnswer({
        userId,
        questionId,
        selectedOption,
      });
  
      await userAnswer.save();
  
   
      
      return res.status(200).json(new apiResponse(200, 'Answer submitted successfully'));
    } catch (error) {
      console.error('Error submitting answer:', error.message);
     
      return res.status(400).json({ error: error.message });
    }
  };

  const searchQuestions = async (req, res) => {
    try {
      const { questionToSearch, userTimezone } = req.body;
  
      
      if (!questionToSearch || !userTimezone) {
        throw new Error('Missing required parameters');
      }
  
  
      const questions = await Question.find({ text: { $regex: questionToSearch, $options: 'i' } });
  
      
      const questionsWithAnswers = await Promise.all(questions.map(async (question) => {
        const userAnswers = await UserAnswer.find({ questionId: question._id });
  
       
        const adjustedUserAnswers = userAnswers.map(answer => {
          const adjustedTimestamp = moment(answer.createdAt).tz(userTimezone).format();
          return { ...answer.toObject(), createdAt: adjustedTimestamp };
        });
  
        return { question, userAnswers: adjustedUserAnswers };
      }));
  
     
      return res.status(200).json(new apiResponse(200,questionsWithAnswers, 'data fetched successfully'));

    } catch (error) {
      console.error('Error searching questions:', error.message);
     
      return res.status(400).json({ error: error.message });
    }
  };
export { getQuestionsByCategory, submitAnswer,searchQuestions };
