document.addEventListener("DOMContentLoaded", () => {
  const images = Array.from(document.querySelectorAll("#hero-images img")).filter(img => img.id !== 'hero-logo');

  images.forEach((img, index) => {
    setTimeout(() => {
      img.style.opacity = 1;
    }, index * 750);  // staggered by 0.75s each
  });
});
