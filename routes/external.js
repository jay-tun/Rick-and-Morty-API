const express = require("express");
const router = express.Router();
const externalController = require("../controllers/externalController");

router.get("/search", externalController.searchRick);
router.get("/:id", externalController.getById);

module.exports = router;