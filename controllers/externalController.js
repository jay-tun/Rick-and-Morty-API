const axios = require("axios");

const searchRick = async (req, res) => {
  const { name, species, page } = req.query;
  try {
    const params = [];
    if (name) params.push(`name=${encodeURIComponent(name)}`);
    if (species) params.push(`species=${encodeURIComponent(species)}`);
    if (page) params.push(`page=${encodeURIComponent(page)}`);
    const url = `https://rickandmortyapi.com/api/character${params.length ? "?" + params.join("&") : ""}`;
    const resp = await axios.get(url);
    res.json(resp.data);
  } catch (err) {
    if (err.response && err.response.status === 404) 
        return res.status(404).json({ error: "No characters found" });
    console.error(err);
    res.status(500).json({ error: "External API error" });
  }
};

const getById = async (req, res) => {
  const id = req.params.id;
  try {
    const resp = await axios.get(
      `https://rickandmortyapi.com/api/character/${id}`,
    );
    res.json(resp.data);
  } catch (err) {
    if (err.response && err.response.status === 404)
      return res.status(404).json({ error: "Not found" });
    console.error(err);
    res.status(500).json({ error: "External API error" });
  }
};

module.exports = { searchRick, getById };
