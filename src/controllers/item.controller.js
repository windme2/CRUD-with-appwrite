const databases = require("../appwrite");
const { ID } = require("node-appwrite");
require("dotenv").config();

const dbId = process.env.APPWRITE_DATABASE_ID;
const colId = process.env.APPWRITE_COLLECTION_ID;

// GET /api/items
exports.getItems = async (req, res, next) => {
  try {
    const data = await databases.listDocuments(dbId, colId);
    res.json(data.documents);
  } catch (err) {
    next(err);
  }
};

// GET /api/items/:id
exports.getItemById = async (req, res, next) => {
  try {
    const doc = await databases.getDocument(dbId, colId, req.params.id);
    res.json(doc);
  } catch (err) {
    next(err);
  }
};

// POST /api/items
exports.createItem = async (req, res, next) => {
  try {
    const {
      itemName,
      description,
      price,
      stockQuantity,
      categoryId,
      isAvailable,
    } = req.body;

    if (!itemName)
      return res.status(400).json({ error: "itemName is required" });
    if (price === undefined || price === null)
      return res.status(400).json({ error: "price is required" });

    const doc = await databases.createDocument(dbId, colId, ID.unique(), {
      itemName,
      description: description || "",
      price: parseFloat(price),
      stockQuantity: parseInt(stockQuantity) || 0,
      categoryId: categoryId ? parseInt(categoryId) : null,
      isAvailable: isAvailable !== undefined ? isAvailable : true,
    });

    res.status(201).json(doc);
  } catch (err) {
    next(err);
  }
};

// PUT /api/items/:id
exports.updateItem = async (req, res, next) => {
  try {
    const doc = await databases.updateDocument(
      dbId,
      colId,
      req.params.id,
      req.body
    );
    res.json(doc);
  } catch (err) {
    next(err);
  }
};

// DELETE /api/items/:id
exports.deleteItem = async (req, res, next) => {
  try {
    await databases.deleteDocument(dbId, colId, req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    next(err);
  }
};
