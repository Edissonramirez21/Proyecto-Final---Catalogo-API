import asyncHandler from "express-async-handler";
import Brand from "../model/Brand.js";

// @desc    Create new Brand
// @route   POST /api/v1/brands
// @access  Private/Admin

export const createBrandCtrl = asyncHandler(async (req, res) => {
  const { name } = req.body;
  //brand exists
  const brandFound = await Brand.findOne({ name });
  if (brandFound) {
    throw new Error("La Marca ya existe");
  }
  //create
  const brand = await Brand.create({
    name: name.toLowerCase(),
    user: req.userAuthId,
  });

  res.json({
    status: "success",
    message: "Una Nueva Marca ha sido agregada exitosamente",
    brand,
  });
});

// @desc    Get all brands
// @route   GET /api/brands
// @access  Public

export const getAllBrandsCtrl = asyncHandler(async (req, res) => {
  const brands = await Brand.find();
  res.json({
    status: "success",
    message: "Las Marcas se han solicitado correctamente",
    brands,
  });
});

// @desc    Get single brand
// @route   GET /api/brands/:id
// @access  Public
export const getSingleBrandCtrl = asyncHandler(async (req, res) => {
  const brand = await Brand.findById(req.params.id);
  res.json({
    status: "success",
    message: "La Marca se solicito correctamente",
    brand,
  });
});

// @desc    Update brand
// @route   PUT /api/brands/:id
// @access  Private/Admin
export const updateBrandCtrl = asyncHandler(async (req, res) => {
  const { name } = req.body;

  //update
  const brand = await Brand.findByIdAndUpdate(
    req.params.id,
    {
      name,
    },
    {
      new: true,
    }
  );
  res.json({
    status: "success",
    message: "La Marca se actualizo correctamente",
    brand,
  });
});

// @desc    delete brand
// @route   DELETE /api/brands/:id
// @access  Private/Admin
export const deleteBrandCtrl = asyncHandler(async (req, res) => {
  await Brand.findByIdAndDelete(req.params.id);
  res.json({
    status: "success",
    message: "La Marca ha sido eliminada exitosamente",
  });
});
