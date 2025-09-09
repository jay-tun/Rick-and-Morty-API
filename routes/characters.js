const express = require("express");
const router = express.Router();
const characterController = require("../controllers/characterController");
const auth = require("../middleware/authMiddleware");

router.get("/", characterController.getAll); //public
router.get("/:id", characterController.getById); //public
router.post("/", auth, characterController.create); //protected
router.put("/:id", auth, characterController.update); //protected
router.delete("/", auth, characterController.remove); //protected

module.exports = router;
