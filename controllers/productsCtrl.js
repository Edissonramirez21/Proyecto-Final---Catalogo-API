import asyncHandler from "express-async-handler";
import Brand from "../model/Brand.js";
import Category from "../model/Category.js";
import Product from "../model/Product.js";


// Función para asegurar que 'all' está incluido en el array de categorías
function ensureAllCategory(categories) {
  // Si category es una cadena, la convertimos en array
  let categoryArray = Array.isArray(categories) ? categories : [categories];
  // Aseguramos que 'all' está incluido
  if (!categoryArray.includes('all')) {
    categoryArray.push('all');
  }
  return categoryArray;
}


// @desc    Create new product
// @route   POST /api/v1/products
// @access  Private/Admin
// Controlador de creación de producto
export const createProductCtrl = asyncHandler(async (req, res) => {
  const { name, description, category, sizes, colors, price, totalQty, brand } = req.body;
  const convertedImgs = req.files.map((file) => file?.path);
  const categories = ensureAllCategory(category);

  const categoryFound = await Category.findOne({ name: categories });
  if (!categoryFound) {
    throw new Error("La Categoria no ha sido encontrada, por favor crea la categoria primero o verifica el nombre de la categoria");
  }

  const productExists = await Product.findOne({ name });
  if (productExists) {
    throw new Error("El Producto ya existe");
  }

  const brandFound = await Brand.findOne({ name: brand.toLowerCase() });
  if (!brandFound) {
    throw new Error("La Marca no ha sido encontrada, por favor creala primero o verifica el nombre de la marca");
  }

  const product = await Product.create({
    name,
    description,
    category: categories,
    sizes,
    colors,
    user: req.userAuthId,
    price,
    totalQty,
    brand,
    images: convertedImgs,
  });

  res.json({
    status: "success",
    message: "El Producto ha sido creado correctamente",
    product,
  });
});

// @desc    Get all products
// @route   GET /api/v1/products
// @access  Public
export const getProductsCtrl = asyncHandler(async (req, res) => {
  console.log(req.query);
  //query
  let productQuery = Product.find();

  //search by name
  if (req.query.name) {
    productQuery = productQuery.find({
      name: { $regex: req.query.name, $options: "i" },
    });
  }

  //filter by brand
  if (req.query.brand) {
    productQuery = productQuery.find({
      brand: { $regex: req.query.brand, $options: "i" },
    });
  }

  //filter by category
  if (req.query.category) {
    productQuery = productQuery.find({
      category: { $regex: req.query.category, $options: "i" },
    });
  }

  //filter by color
  if (req.query.color) {
    productQuery = productQuery.find({
      colors: { $regex: req.query.color, $options: "i" },
    });
  }

  //filter by size
  if (req.query.size) {
    productQuery = productQuery.find({
      sizes: { $regex: req.query.size, $options: "i" },
    });
  }
  //filter by price range
  if (req.query.price) {
    const priceRange = req.query.price.split("-");
    //gte: greater or equal
    //lte: less than or equal to
    productQuery = productQuery.find({
      price: { $gte: priceRange[0], $lte: priceRange[1] },
    });
  }
  //pagination
  //page
  const page = parseInt(req.query.page) ? parseInt(req.query.page) : 1;
  //limit
  const limit = parseInt(req.query.limit) ? parseInt(req.query.limit) : 50;
  //startIdx
  const startIndex = (page - 1) * limit;
  //endIdx
  const endIndex = page * limit;
  //total
  const total = await Product.countDocuments();

  productQuery = productQuery.skip(startIndex).limit(limit);

  //pagination results
  const pagination = {};
  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }
  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }

  //await the query
  const products = await productQuery.populate("reviews");
  res.json({
    status: "success",
    total,
    results: products.length,
    pagination,
    message: "Productos solicitados correctamente",
    products,
  });
});

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public

export const getProductCtrl = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).populate({
    path: "reviews",
    populate: {
      path: "user",
      select: "fullname",
    },
  });
  if (!product) {
    throw new Error("El Producto no ha sido encontrado");
  }
  res.json({
    status: "success",
    message: "El producto se solicito correctamente",
    product,
  });
});

// @desc    update  product
// @route   PUT /api/products/:id/update
// @access  Private/Admin

export const updateProductCtrl = asyncHandler(async (req, res) => {
  const { name, description, category, sizes, colors, user, price, totalQty, brand } = req.body;
  const updateData = { name, description, sizes, colors, user, price, totalQty, brand };

  // Asegurar que solo se actualice la categoría si se ha proporcionado
if (category) {
  // Verificar si 'category' es una cadena, convertirla en array
  let categories = Array.isArray(category) ? category : [category];

  // Asegurarse de que 'all' esté incluido en el array
  if (!categories.includes('all')) {
    categories.unshift('all');
  }

  // Asignar el array actualizado a 'updateData.category'
  updateData.category = categories;
}

  const product = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
  if (!product) {
    res.status(404);
    throw new Error("Producto no ha sido encontrado");
  }

  res.json({
    status: "success",
    message: "El producto se actualizo correctamente",
    product,
  });
});


// @desc    delete  product
// @route   DELETE /api/products/:id/delete
// @access  Private/Admin
export const deleteProductCtrl = asyncHandler(async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({
    status: "success",
    message: "El producto se ha eliminado correctamente",
  });
});
