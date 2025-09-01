import prisma from "../lib/prisma.js";

// GET all books
export const getProduct = async (req, res) => {
  try {
    const books = await prisma.product.findMany();
    res.json(books);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET book by ID
export const getProductById = async (req, res) => {
  try {
    const book = await prisma.product.findUnique({
      where: { id: parseInt(req.params.id) },
    });
    res.json(book);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// CREATE book
export const createProduct = async (req, res) => {
  try {
    const newBook = await prisma.product.create({
      data: req.body,
    });
    res.json(newBook);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};  

// UPDATE book
export const updateProduct = async (req, res) => {
  try {
    const updated = await prisma.product.update({
      where: { id: parseInt(req.params.id) },
      data: req.body,
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE book
export const deleteProduct = async (req, res) => {
  try {
    await prisma.product.delete({
      where: { id: parseInt(req.params.id) },
    });
    res.json({ message: "product deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
