const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const ai = require("../controllers/aiController");

// AI endpoints (protected)
router.post("/backstory", auth, ai.generateBackstory);
router.post("/personality", auth, ai.analyzePersonality);
router.post("/recommend", auth, ai.recommendEpisodes);
router.post("/relationships", auth, ai.suggestRelationships);
router.post("/chat", auth, ai.chatAsCharacter);

module.exports = router;
