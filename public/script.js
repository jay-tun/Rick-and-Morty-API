let token = null;

// Register
async function register() {
  const email = document.getElementById("reg-email").value;
  const password = document.getElementById("reg-password").value;

  const res = await fetch("http://localhost:3000/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();
  if (res.ok) {
    document.getElementById("register-status").innerText =
      "✅ Registration successful, please log in.";
  } else {
    document.getElementById("register-status").innerText =
      "❌ " + (data.message || "Registration failed");
  }
}

// Login
async function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const res = await fetch("http://localhost:3000/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();
  if (data.token) {
    token = data.token;
    document.getElementById("login-status").innerText = "✅ Logged in!";
    document.getElementById("search").style.display = "block";
    document.getElementById("login").style.display = "none";
    document.getElementById("register").style.display = "none";
  } else {
    document.getElementById("login-status").innerText = "❌ Login failed!";
  }
}
