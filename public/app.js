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

// Fetch Characters
async function loadCharacters() {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_URL}/characters`, {
        headers: { Authorization: `Bearer ${token}` }, // <- include JWT
    });
    const data = await res.json();
    const list = document.getElementById("characterList");
    if (list) {
        list.innerHTML = "";
        data.characters.forEach((c) => {
        const li = document.createElement("li");
        li.textContent = `${c.name} (${c.species})`;
        list.appendChild(li);
        });
  }
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

// Logout
function logout() {
  localStorage.removeItem("token");
  window.location.href = "index.html";
}
