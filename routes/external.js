const express = require("express");
const axios = require("axios");

const router = express.Router();

const RICK_MORTY_API_BASE = "https://rickandmortyapi.com/api";

// Get all characters from Rick and Morty API
router.get("/characters", async (req, res) => {
    try {
        const { page = 1, name, status, species, gender } = req.query;
        
        let url = `${RICK_MORTY_API_BASE}/character?page=${page}`;
        
        // Add filters if provided
        if (name) url += `&name=${name}`;
        if (status) url += `&status=${status}`;
        if (species) url += `&species=${species}`;
        if (gender) url += `&gender=${gender}`;
        
        const response = await axios.get(url);
        res.json(response.data);
    } catch (error) {
        console.error("Get characters error:", error);
        if (error.response && error.response.status === 404) {
            res.status(404).json({ error: "No characters found with the given criteria" });
        } else {
            res.status(500).json({ error: "Failed to fetch characters from Rick and Morty API" });
        }
    }
});

// Get single character by ID from Rick and Morty API
router.get("/characters/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const response = await axios.get(`${RICK_MORTY_API_BASE}/character/${id}`);
        res.json(response.data);
    } catch (error) {
        console.error("Get character error:", error);
        if (error.response && error.response.status === 404) {
            res.status(404).json({ error: "Character not found" });
        } else {
            res.status(500).json({ error: "Failed to fetch character from Rick and Morty API" });
        }
    }
});

// Get all episodes from Rick and Morty API
router.get("/episodes", async (req, res) => {
    try {
        const { page = 1, name, episode } = req.query;
        
        let url = `${RICK_MORTY_API_BASE}/episode?page=${page}`;
        
        // Add filters if provided
        if (name) url += `&name=${name}`;
        if (episode) url += `&episode=${episode}`;
        
        const response = await axios.get(url);
        res.json(response.data);
    } catch (error) {
        console.error("Get episodes error:", error);
        if (error.response && error.response.status === 404) {
            res.status(404).json({ error: "No episodes found with the given criteria" });
        } else {
            res.status(500).json({ error: "Failed to fetch episodes from Rick and Morty API" });
        }
    }
});

// Get single episode by ID from Rick and Morty API
router.get("/episodes/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const response = await axios.get(`${RICK_MORTY_API_BASE}/episode/${id}`);
        res.json(response.data);
    } catch (error) {
        console.error("Get episode error:", error);
        if (error.response && error.response.status === 404) {
            res.status(404).json({ error: "Episode not found" });
        } else {
            res.status(500).json({ error: "Failed to fetch episode from Rick and Morty API" });
        }
    }
});

// Get all locations from Rick and Morty API
router.get("/locations", async (req, res) => {
    try {
        const { page = 1, name, type, dimension } = req.query;
        
        let url = `${RICK_MORTY_API_BASE}/location?page=${page}`;
        
        // Add filters if provided
        if (name) url += `&name=${name}`;
        if (type) url += `&type=${type}`;
        if (dimension) url += `&dimension=${dimension}`;
        
        const response = await axios.get(url);
        res.json(response.data);
    } catch (error) {
        console.error("Get locations error:", error);
        if (error.response && error.response.status === 404) {
            res.status(404).json({ error: "No locations found with the given criteria" });
        } else {
            res.status(500).json({ error: "Failed to fetch locations from Rick and Morty API" });
        }
    }
});

// Get single location by ID from Rick and Morty API
router.get("/locations/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const response = await axios.get(`${RICK_MORTY_API_BASE}/location/${id}`);
        res.json(response.data);
    } catch (error) {
        console.error("Get location error:", error);
        if (error.response && error.response.status === 404) {
            res.status(404).json({ error: "Location not found" });
        } else {
            res.status(500).json({ error: "Failed to fetch location from Rick and Morty API" });
        }
    }
});

module.exports = router;