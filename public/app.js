const API_URL = "http://localhost:3000"; // adjust if deployed


document.getElementById("searchBtn")?.addEventListener("click", async () => {
    const name = document.getElementById("searchName").value.trim();
    const species = document.getElementById("searchSpecies").value.trim();


    if (!name && !species) return alert("Enter name or species to search");


    const container = document.getElementById("rick-character-results");
    container.innerHTML = "<em>Searching...</em>";


    try {
        const res = await fetch(
        `${API_URL}/external/search?name=${encodeURIComponent(name)}&species=${encodeURIComponent(species)}`
        );
        const data = await res.json();


        if (!data.results || data.results.length === 0) {
        container.innerHTML = "<p>No characters found</p>";
        return;
        }


        container.innerHTML = "";
        data.results.forEach((c) => {
        const card = document.createElement("div");
        card.className = "character-card";


        card.innerHTML = `
            ${c.image ? `<img src="${c.image}" alt="${capitalizeWords(c.name)}">` : ''}
            <h3>${capitalizeWords(c.name)}</h3>
            <p><strong>Species:</strong> ${capitalizeWords(c.species) || "Unknown"}</p>
            <p><strong>Origin:</strong> ${capitalizeWords(c.origin.name) || "Unknown"}</p>
            <p><strong>Gender:</strong> ${capitalizeWords(c.gender) || "Unknown"}</p>
            <p><strong>Status:</strong> ${capitalizeWords(c.status) || "Unknown"}</p>
            
            <button class="backstory-btn" data-id="api-${c.id}" data-type="external" data-character='${JSON.stringify(c)}'>Generate Backstory</button>
            <button class="chat-btn" data-id="api-${c.id}" data-name="${capitalizeWords(c.name)}" data-type="external" data-character='${JSON.stringify(c)}'>Chat with Character</button>
            <button class="analyze-btn" data-id="api-${c.id}" data-type="external" data-character='${JSON.stringify(c)}'>Analyze Personality</button>
            <button class="relationship-btn" data-id="api-${c.id}" data-type="external" data-character='${JSON.stringify(c)}'>Suggest Relationships</button>


            <div id="chat-container-api-${c.id}" class="chat-container" style="display:none; margin-top:10px;">
            <div id="chat-messages-api-${c.id}" class="chat-messages" style="border:1px solid #ccc; padding:5px; height:100px; overflow-y:auto; margin-bottom:5px;"></div>
            <input type="text" id="chat-input-api-${c.id}" placeholder="Say something..." style="width:70%; padding:5px;">
            <button id="chat-send-api-${c.id}">Send</button>
            </div>
        `;


        container.appendChild(card);
        });
    } catch (err) {
        console.error(err);
        container.innerHTML = "<span style='color:red;'>Failed to fetch characters.</span>";
    }
});



// 🔑 Register
document.getElementById("registerForm")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("registerEmail").value;
    const password = document.getElementById("registerPassword").value;


    const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    document.getElementById("message").innerText = JSON.stringify(data);
});


// Login
document.getElementById("loginForm")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;


    const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    });
    const data = await res.json();


    if (data.token) {
        localStorage.setItem("token", data.token);
        window.location.href = "characters.html";
    } else {
        // show either error or message
        document.getElementById("message").innerText = data.error || data.message || "Login failed!";
    }
});


function capitalizeWords(str) {
    if (!str) return "";
    return str
        .split(" ")
        .map((w) => w[0]?.toUpperCase() + w.slice(1).toLowerCase())
        .join(" ");
}


// Fetch Characters
async function loadCharacters() {
    const token = localStorage.getItem("token");
    if (!token) return;


    const res = await fetch(`${API_URL}/characters`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();


    const container = document.getElementById("characterContainer");
    if (!container) return;


    container.innerHTML = ""; // clear previous content


    data.characters.forEach((c) => {
        const card = document.createElement("div");
        card.className = "character-card";


        // check if already has backstory
        const hasBackstory = !!c.backstory;


        card.innerHTML = `
            ${c.image ? `<img src="${c.image}" alt="${capitalizeWords(c.name)}">` : ''}
            <h3>${capitalizeWords(c.name)}</h3>
            <p><strong>Species:</strong> ${capitalizeWords(c.species) || "Unknown"}</p>
            <p><strong>Origin:</strong> ${capitalizeWords(c.origin) || "Unknown"}</p>
            <p><strong>Gender:</strong> ${capitalizeWords(c.gender) || "Unknown"}</p>
            <p><strong>Status:</strong> ${capitalizeWords(c.status) || "Unknown"}</p>
            <p><strong>Backstory:</strong> <span id="backstory-${c.id}">${c.backstory || "No backstory yet"}</span></p>
            
            <button class="backstory-btn" data-id="${c.id}" data-type="database" data-character='${JSON.stringify(c)}' ${hasBackstory ? "disabled" : ""} >
                ${hasBackstory ? "Backstory Generated" : "Generate Backstory"}
            </button>
            <button class="chat-btn" data-id="${c.id}" data-name="${capitalizeWords(c.name)}" data-type="database" data-character='${JSON.stringify(c)}'>Chat with Character</button>
            <button class="analyze-btn" data-id="${c.id}" data-type="database" data-character='${JSON.stringify(c)}'>Analyze Personality</button>
            <button class="relationship-btn" data-name="${capitalizeWords(c.name)}" data-type="database" data-character='${JSON.stringify(c)}'>Suggest Relationships</button>


            <div id="chat-container-${c.id}" class="chat-container" style="display:none; margin-top:10px;">
            <div id="chat-messages-${c.id}" class="chat-messages" style="border:1px solid #ccc; padding:5px; height:100px; overflow-y:auto; margin-bottom:5px;"></div>
            <input type="text" id="chat-input-${c.id}" placeholder="Say something..." style="width:70%; padding:5px;">
            <button id="chat-send-${c.id}">Send</button>
            </div>


            <div id="analysis-${c.id}" class="analysis-box"></div>
            <div id="relationships-${c.id}" class="relationships-box" style="margin-top:10px;"></div>
        `;


        container.appendChild(card);
    });
}



if (document.getElementById("characterList")) loadCharacters();


// Add Character
document.getElementById("charForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const token = localStorage.getItem("token");
  const body = {
    name: document.getElementById("name").value,
    species: document.getElementById("species").value,
    status: document.getElementById("status").value,
    gender: document.getElementById("gender").value,
    origin: document.getElementById("origin").value,
  };


  const res = await fetch(`${API_URL}/characters`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  alert("Character created!");
  loadCharacters();
});



// Helper function to handle backstory generation for both character types
async function handleBackstoryGeneration(button) {
    const characterId = button.dataset.id;
    const characterType = button.dataset.type;
    const characterData = JSON.parse(button.dataset.character);
    const token = localStorage.getItem("token");

    button.disabled = true;
    button.innerText = "Generating...";

    try {
        let res;
        if (characterType === "database") {
            // For database characters, use existing endpoint
            res = await fetch(`${API_URL}/ai/backstory`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ characterId }),
            });
        } else {
            // For external characters, use external endpoint with character data
            res = await fetch(`${API_URL}/ai/backstory/external`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ 
                    characterData: {
                        name: characterData.name,
                        species: characterData.species,
                        status: characterData.status,
                        gender: characterData.gender,
                        origin: characterData.origin?.name || characterData.origin
                    }
                }),
            });
        }

        const data = await res.json();
        if (characterType === "database") {
            document.getElementById(`backstory-${characterId}`).innerText = data.backstory;
            button.disabled = true;
            button.innerText = "Backstory Generated";
        } else {
            // For external characters, display in alert
            alert(`Backstory for ${characterData.name}:\n\n${data.backstory}`);
            button.disabled = false;
            button.innerText = "Generate Backstory";
        }
    } catch (err) {
        console.error("Backstory generation failed:", err);
        button.disabled = false;
        button.innerText = "Generate Backstory";
        alert("Failed to generate backstory. Please try again.");
    }
}

// Helper function to handle personality analysis for both character types
async function handlePersonalityAnalysis(button) {
    const characterId = button.dataset.id;
    const characterType = button.dataset.type;
    const characterData = JSON.parse(button.dataset.character);
    const token = localStorage.getItem("token");

    const analysisDiv = document.getElementById(`analysis-${characterId}`);
    if (analysisDiv) analysisDiv.innerHTML = "<em>Analyzing personality...</em>";

    try {
        let res;
        if (characterType === "database") {
            res = await fetch(`${API_URL}/ai/personality`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ characterId }),
            });
        } else {
            res = await fetch(`${API_URL}/ai/personality/external`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ 
                    characterData: {
                        name: characterData.name,
                        species: characterData.species,
                        status: characterData.status,
                        gender: characterData.gender,
                        origin: characterData.origin?.name || characterData.origin
                    }
                }),
            });
        }

        const data = await res.json();
        if (analysisDiv && data.personality) {
            analysisDiv.innerHTML = `<pre>${data.personality}</pre>`;
        } else if (data.personality) {
            alert(`Personality Analysis for ${characterData.name}:\n\n${data.personality}`);
        } else {
            throw new Error("No personality data received");
        }
    } catch (err) {
        console.error("Personality analysis failed:", err);
        if (analysisDiv) {
            analysisDiv.innerHTML = `<span style="color:red;">Failed to analyze personality.</span>`;
        } else {
            alert("Failed to analyze personality. Please try again.");
        }
    }
}

// Helper function to handle chat for both character types
async function handleCharacterChat(characterId, characterType, characterData, message) {
    const token = localStorage.getItem("token");
    const messagesDiv = document.getElementById(`chat-messages-${characterId}`);

    try {
        let res;
        if (characterType === "database") {
            res = await fetch(`${API_URL}/ai/chat`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ characterId, message }),
            });
        } else {
            res = await fetch(`${API_URL}/ai/chat/external`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ 
                    characterData: {
                        name: characterData.name,
                        species: characterData.species,
                        status: characterData.status,
                        gender: characterData.gender,
                        origin: characterData.origin?.name || characterData.origin
                    },
                    message 
                }),
            });
        }

        const data = await res.json();
        messagesDiv.innerHTML += `<div><strong>${characterData.name}:</strong> ${data.reply}</div>`;
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    } catch (err) {
        console.error("Chat failed:", err);
        messagesDiv.innerHTML += `<div style="color:red;"><strong>Error:</strong> Failed to get response</div>`;
    }
}

document.addEventListener("click", async (e) => {
    // Backstory button
    if (e.target.classList.contains("backstory-btn")) {
        await handleBackstoryGeneration(e.target);
    }


    // Chat button (toggle chat container)
    if (e.target.classList.contains("chat-btn")) {
        const characterId = e.target.dataset.id;
        const chatContainer = document.getElementById(`chat-container-${characterId}`);
        chatContainer.style.display = chatContainer.style.display === "none" ? "block" : "none";
    }


    // Send chat message
    if (e.target.id.startsWith("chat-send-")) {
        const characterId = e.target.id.replace("chat-send-", "");
        const chatButton = document.querySelector(`.chat-btn[data-id='${characterId}']`);
        const characterType = chatButton.dataset.type;
        const characterData = JSON.parse(chatButton.dataset.character);

        const input = document.getElementById(`chat-input-${characterId}`);
        const messagesDiv = document.getElementById(`chat-messages-${characterId}`);
        const message = input.value.trim();
        if (!message) return;

        messagesDiv.innerHTML += `<div><strong>You:</strong> ${message}</div>`;
        input.value = "";

        await handleCharacterChat(characterId, characterType, characterData, message);
    }


    // Analyze personality button
    if (e.target.classList.contains("analyze-btn")) {
        await handlePersonalityAnalysis(e.target);
    }
    // Suggest Relationships
    if (e.target.classList.contains("relationship-btn")) {
        const characterType = e.target.dataset.type;
        const characterData = JSON.parse(e.target.dataset.character);
        const char1Name = characterData.name;
        const otherName = prompt(`Enter another character name to compare with ${char1Name}:`);
        if (!otherName) return;

        const token = localStorage.getItem("token");

        // For now, relationships only work with database characters
        // So we'll inform the user if they try with external characters
        if (characterType === "external") {
            alert("Relationship analysis is currently only available for your saved characters. Please create and save characters first to use this feature.");
            return;
        }

        const res = await fetch(`${API_URL}/ai/relationships`, {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ char1Name, char2Name: otherName }),
        });

        const data = await res.json();
        if (data.relationship) {
            alert(`Relationship between ${data.char1} and ${data.char2}:\n\n${data.relationship} (similarity: ${data.similarity})`);
        } else {
            alert(data.error || "Error finding relationship.");
        }
    }


});



// Logout
function logout() {
  localStorage.removeItem("token");
  window.location.href = "index.html";
}