const API_URL = "http://localhost:3000"; // adjust if deployed

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
        
        <button class="backstory-btn" data-id="${c.id}" ${hasBackstory ? "disabled" : ""} >
            ${hasBackstory ? "Backstory Generated" : "Generate Backstory"}
        </button>
        <button class="chat-btn" data-id="${c.id}" data-name="${capitalizeWords(c.name)}">Chat with Character</button>
        <button class="analyze-btn" data-id="${c.id}">Analyze Personality</button>
        <button class="relationship-btn" data-name="${capitalizeWords(c.name)}">Suggest Relationships</button>

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


document.addEventListener("click", async (e) => {
    // Backstory button
    if (e.target.classList.contains("backstory-btn")) {
        const characterId = e.target.dataset.id;
        const token = localStorage.getItem("token");

        e.target.disabled = true;
        e.target.innerText = "Generating...";

        const res = await fetch(`${API_URL}/ai/backstory`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ characterId }),
        });

        const data = await res.json();
        document.getElementById(`backstory-${characterId}`).innerText = data.backstory;
        e.target.disabled = false;
        e.target.innerText = "Generate Backstory";
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
        const characterName = chatButton.dataset.name;

        const input = document.getElementById(`chat-input-${characterId}`);
        const messagesDiv = document.getElementById(`chat-messages-${characterId}`);
        const message = input.value.trim();
        if (!message) return;

        const token = localStorage.getItem("token");
        messagesDiv.innerHTML += `<div><strong>You:</strong> ${message}</div>`;
        input.value = "";

        const res = await fetch(`${API_URL}/ai/chat`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ characterId, message }),
        });

        const data = await res.json();
        messagesDiv.innerHTML += `<div><strong>${characterName}:</strong> ${data.reply}</div>`;
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    }

    // Analyze personality button
    if (e.target.classList.contains("analyze-btn")) {
        const characterId = e.target.dataset.id;
        const analysisDiv = document.getElementById(`analysis-${characterId}`);
        const token = localStorage.getItem("token");

        analysisDiv.innerHTML = "<em>Analyzing personality...</em>";

        try {
        const res = await fetch(`${API_URL}/ai/personality`, {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ characterId }),
        });
        const data = await res.json();

        if (data.personality) {
            analysisDiv.innerHTML = `<pre>${data.personality}</pre>`;
        } else {
            analysisDiv.innerHTML = `<span style="color:red;">Error analyzing personality.</span>`;
        }
        } catch (err) {
        analysisDiv.innerHTML = `<span style="color:red;">Failed to fetch analysis.</span>`;
        }
    }
    // Suggest Relationships
    if (e.target.classList.contains("relationship-btn")) {
    const char1Name = e.target.dataset.name;
    const otherName = prompt(`Enter another character name to compare with ${char1Name}:`);
    if (!otherName) return;

    const token = localStorage.getItem("token");
    const resultDiv = document.getElementById(`relationships-${e.target.closest(".character-card").querySelector("h3").innerText.toLowerCase()}`);

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
