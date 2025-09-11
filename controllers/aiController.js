const pool = require("../db");
const OpenAI = require("openai");
require("dotenv").config();

const openai = new OpenAI({
  baseURL: "https://models.github.ai/inference",
  apiKey: process.env.GITHUB_TOKEN,
});
const model = "openai/gpt-4.1";

/** Character Backstory Generator */
const generateBackstory = async (req, res) => {
  try {
    const { characterId } = req.body;
    if (!characterId)
      return res.status(400).json({ error: "characterId required!" });

    const result = await pool.query("SELECT * FROM characters WHERE id = $1", [
      characterId,
    ]);
    if (result.rows.length === 0)
      return res.status(404).json({ error: "Character not FOUND!" });
    const char = result.rows[0];
    const prompt = `Write a short, witty backstory for a Rick and Morty character:
                    Name: ${char.name}
                    Species: ${char.species || "Unknown"}
                    Origin: ${char.origin || "Unknown"}
                    Status: ${char.status || "Unknown"}
                    Gender: ${char.gender || "Unknown"}
                    The backstory should:
                    - Be 4-6 lines long
                    - Match the Rick and Morty universe's dark humor and sci-fi elements
                    - Include specific details about their past, motivations, and how they ended up in their current situation
                    - Reference interdimensional travel, weird science, or other Rick and Morty themes
                    - Be creative and original
                    
                    Generate an engaging backstory:`;
    const response = await openai.chat.completions.create({
      model: model,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.8,
      max_tokens: 200,
    });
    const backstory = response.choices[0].message.content.trim();

    await pool.query("UPDATE characters SET backstory = $1 WHERE id = $2", [
      backstory,
      characterId,
    ]);
    res.json({ characterId, backstory });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "AI personality analysis failed" });
  }
};

/** Character Relationship Predictor */
const suggestRelationships = async (req, res) => {
  try {
    const { char1Name, char2Name } = req.body;
    if (!char1Name || !char2Name)
      return res.status(400).json({ error: "Need two character IDs" });

    const res1 = await pool.query(
      "SELECT * FROM characters WHERE LOWER(name) = LOWER($1) LIMIT 1",
      [char1Name]
    );
    const res2 = await pool.query(
      "SELECT * FROM characters WHERE LOWER(name) = LOWER($1) LIMIT 1",
      [char2Name]
    );

    const char1 = res1.rows[0];
    const char2 = res2.rows[0];

    if (!char1 || !char2)
      return res
        .status(404)
        .json({ error: "One or both characters not found" });

    const text1 = `${char1.name}, ${char1.species}, ${char1.backstory || ""}`;
    const text2 = `${char2.name}, ${char2.species}, ${char2.backstory || ""}`;

    const [embed1, embed2] = await Promise.all([
      openai.embeddings.create({
        model: "text-embedding-3-small",
        input: text1,
      }),
      openai.embeddings.create({
        model: "text-embedding-3-small",
        input: text2,
      }),
    ]);
    const v1 = embed1.data[0].embedding;
    const v2 = embed2.data[0].embedding;

    const cosineSim = (a, b) => {
      let dot = 0,
        magA = 0,
        magB = 0;
      for (let i = 0; i < a.length; i++) {
        dot += a[i] * b[i];
        magA += a[i] ** 2;
        magB += b[i] ** 2;
      }
      return dot / (Math.sqrt(magA) * Math.sqrt(magB));
    };

    const similarity = cosineSim(v1, v2);

    let relationship = "Acquaintances";
    if (similarity > 0.9) relationship = "Family / Very Close Friends";
    else if (similarity > 0.75) relationship = "Close Friends / Allies";
    else if (similarity > 0.6) relationship = "Allies";
    else relationship = "Rivals / Distant";

    res.json({
      char1: char1.name,
      char2: char2.name,
      similarity: similarity.toFixed(3),
      relationship,
    });
  } catch (err) {
    console.error("Relationship predictor error:", err);
    res.status(500).json({ error: "AI relationship prediction failed" });
  }
};

/** Personality Analyzer */
const analyzePersonality = async (req, res) => {
  try {
    const { characterId } = req.body;
    const result = await pool.query("SELECT * FROM characters WHERE id = $1", [
      characterId,
    ]);
    if (result.rows.length === 0)
      return res.status(404).json({ error: "Character not found" });

    const char = result.rows[0];
    const prompt = `Analyze this character using Big Five personality traits (OCEAN).
                    Name: ${char.name}
                    Species: ${char.species}
                    Origin: ${char.origin}
                    Backstory: ${char.backstory || "N/A"}
                    
                    Rate each trait on a scale of High to Low and provide analysis:

                    1. Openness (creativity, curiosity, open to new experiences)
                    2. Conscientiousness (organization, responsibility, self-discipline)
                    3. Extraversion (sociability, assertiveness, energy)
                    4. Agreeableness (compassion, cooperation, trust)
                    5. Neuroticism (emotional stability, anxiety, moodiness)
                    Also provide an overall personality summary that captures their essence in the Rick and Morty universe.`;

    const response = await openai.chat.completions.create({
      model: model,
      messages: [
        {
          role: "system",
          content:
            "You are a psychological profiler specializing in character analysis using the Big Five personality model.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.5,
    });
    res.json({ characterId, personality: response.choices[0].message.content });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "AI personality analysis failed" });
  }
};

/** Episode Recommendations */
const recommendEpisodes = async (req, res) => {
  try {
    const { characterId } = req.body;
    const result = await pool.query("SELECT * FROM characters WHERE id = $1", [
      characterId,
    ]);
    if (result.rows.length === 0)
      return res.status(404).json({ error: "Character not found" });

    const char = result.rows[0];
    const prompt = `Suggest 3 Rick and Morty episodes that best match this character's backstory and traits.
                    Character: ${char.name},
                    Species: ${char.species},
                    Origin: ${char.origin},
                    Backstory: ${char.backstory}`;

    const response = await openai.chat.completions.create({
      model: model,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    res.json({
      characterId,
      recommendations: response.choices[0].message.content,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "AI episode recommendation failed" });
  }
};

/** Chat with Character */
const chatAsCharacter = async (req, res) => {
  try {
    const { characterId, message } = req.body;
    const result = await pool.query("SELECT * FROM characters WHERE id = $1", [
      characterId,
    ]);
    if (result.rows.length === 0)
      return res.status(404).json({ error: "Character not found" });

    const char = result.rows[0];
    const systemPrompt = `You are roleplaying as ${char.name}, a Rick and Morty character.
                          Species: ${char.species}
                          Origin: ${char.origin}
                          Backstory: ${char.backstory || "N/A"}
                          Respond in a witty and in-character way, maximum 2 sentences.`;

    const response = await openai.chat.completions.create({
      model: model,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message },
      ],
      temperature: 0.9,
    });

    res.json({ reply: response.choices[0].message.content });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "AI chat failed" });
  }
};

module.exports = {
  generateBackstory,
  suggestRelationships,
  analyzePersonality,
  recommendEpisodes,
  chatAsCharacter,
};
