const express = require("express");
const router = express.Router();
const characterController = require("../controllers/characterController");
const auth = require("../middleware/authMiddleware");

router.get("/", auth, characterController.getAll); //protected
router.get("/:id", auth, characterController.getById); //protected
router.post("/", auth, characterController.create); //protected
router.put("/:id", auth, characterController.update); //protected
router.delete("/", auth, characterController.remove); //protected

module.exports = router;
