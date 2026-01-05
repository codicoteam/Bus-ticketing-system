export const applyTheme = (theme) => {
  const root = document.documentElement;

  if (theme === "dark") {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }

  localStorage.setItem("theme", theme);
};

export const initTheme = () => {
  const saved = localStorage.getItem("theme") || "light";
  applyTheme(saved);
  return saved;
};
