const express = require("express");
const router = express.Router();
const externalController = require("../controllers/externalController");

router.get("/characters", externalController.searchRick);
router.get("/characters/:id", externalController.getById);

module.exports = router;