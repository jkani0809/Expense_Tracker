// SIGNUP
document.addEventListener("DOMContentLoaded", () => {
  const signupForm = document.getElementById("signupForm");
  const loginForm = document.getElementById("loginForm");
  const logoutBtn = document.getElementById("logoutBtn");

  if (signupForm) {
    signupForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const username = document.getElementById("signupUsername").value.trim();
      const email = document.getElementById("signupEmail").value.trim();
      const password = document.getElementById("signupPassword").value;
      const confirmPassword = document.getElementById("signupConfirmPassword").value;

      if (password !== confirmPassword) {
        document.getElementById("signupMessage").textContent = "Passwords do not match!";
        return;
      }

      localStorage.setItem("username", username);
      localStorage.setItem("email", email);
      localStorage.setItem("password", password);

      document.getElementById("signupMessage").textContent = "Account created successfully!";
      setTimeout(() => window.location.href = "index.html", 1500);
    });
  }

  // LOGIN
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const username = document.getElementById("loginUsername").value.trim();
      const password = document.getElementById("loginPassword").value;

      const storedUsername = localStorage.getItem("username");
      const storedPassword = localStorage.getItem("password");

      if (username === storedUsername && password === storedPassword) {
        sessionStorage.setItem("loggedIn", "true");
        window.location.href = "dashboard.html";
      } else {
        alert("Invalid username or password");
      }
    });
  }

  // LOGOUT
  if (logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault();
      sessionStorage.removeItem("loggedIn");
      window.location.href = "index.html";
    });
  }

  // PROTECT DASHBOARD
  if (window.location.pathname.endsWith("dashboard.html")) {
    if (!sessionStorage.getItem("loggedIn")) {
      window.location.href = "index.html";
    }
  }
});
