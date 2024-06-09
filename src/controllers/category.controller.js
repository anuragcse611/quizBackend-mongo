import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { Category } from "../models/category.models.js";


const getAllCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find();
  
  if (!categories) {
    const error = new apiError(404, "Categories not found");
    console.error(error);
    return res.status(404).json(new apiResponse(404, null, "Categories not found"));
  }

  return res.status(200).json(new apiResponse(200, categories, "Categories fetched successfully"));
});

export { getAllCategories };
