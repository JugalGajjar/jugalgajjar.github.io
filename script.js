document.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = document.getElementById("darkToggle");
  const currentTheme = localStorage.getItem("theme");

  // Apply saved theme if exists
  if (currentTheme === "dark") {
    document.documentElement.setAttribute("data-theme", "dark");
    toggleBtn.textContent = "☀️";
  }

  toggleBtn.addEventListener("click", () => {
    const isDark = document.documentElement.getAttribute("data-theme") === "dark";
    if (isDark) {
      document.documentElement.removeAttribute("data-theme");
      localStorage.removeItem("theme");
      toggleBtn.textContent = "🌙";
    } else {
      document.documentElement.setAttribute("data-theme", "dark");
      localStorage.setItem("theme", "dark");
      toggleBtn.textContent = "☀️";
    }
  });

  // Smooth scrolling for anchor links
  document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const targetID = this.getAttribute("href").substring(1);
      const targetSection = document.getElementById(targetID);
      if (targetSection) {
        targetSection.scrollIntoView({ behavior: "smooth" });
      }
    });
  });
});