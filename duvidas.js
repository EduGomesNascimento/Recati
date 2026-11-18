(() => {
  const mood = document.getElementById("faqMoodImage");
  const items = Array.from(document.querySelectorAll(".faq-item"));
  if (!mood || !items.length) return;

  const updateMood = () => {
    const allOpen = items.every((item) => item.open);
    mood.src = allOpen ? "./img/piscando.png" : "./img/sorriso.png";
    mood.alt = allOpen ? "Mascote RECATI piscando" : "Mascote RECATI sorrindo";
  };

  items.forEach((item) => {
    item.addEventListener("toggle", updateMood);
  });

  updateMood();
})();
