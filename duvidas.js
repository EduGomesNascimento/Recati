(() => {
  const mood = document.getElementById("faqMoodImage");
  const items = Array.from(document.querySelectorAll(".faq-item"));
  if (!mood || !items.length) return;

  const updateMood = () => {
    const allOpen = items.every((item) => item.open);
    mood.src = allOpen ? "./piscando.png" : "./sorriso.png";
    mood.alt = allOpen ? "Mascote RECATI piscando" : "Mascote RECATI sorrindo";
  };

  items.forEach((item) => {
    item.addEventListener("toggle", updateMood);
  });

  updateMood();
})();
