document.addEventListener("DOMContentLoaded", () => {
  const images = document.querySelectorAll("#hero-images img");

  images.forEach((img, index) => {
    setTimeout(() => {
      img.style.opacity = 1;
    }, index * 5000);  // staggered by 5s each
    console.log("stagger success")
  });
});