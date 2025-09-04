
// fade in hero images from left to right
document.addEventListener("DOMContentLoaded", () => {
  const images = Array.from(document.querySelectorAll("#hero-images img")).filter(img => img.id !== 'hero-logo');

  images.forEach((img, index) => {
    setTimeout(() => {
      img.style.opacity = 1;
    }, index * 750);  // staggered by 0.75s each
  });
});


//populate Photoshoot Packages
async function fetchPhotoshootData() {
  try {
    const response = await fetch("./json/photoshootPackages.json"); // make sure path is correct
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching photoshoot data:", error);
    return [];
  }
}

function renderPhotoshootCards(dataArray, containerId) {
  const container = document.getElementById(containerId);
  container.innerHTML = ""; // clear existing

  dataArray.forEach(category => {
    // Category card
    const card = document.createElement("div");
    card.classList.add("ps-card");
    card.id = `ps-${category.category.toLowerCase()}`;

    // Category title
    const title = document.createElement("h2");
    title.textContent = category.category;
    card.appendChild(title);

    // Packages wrapper
    const packagesWrapper = document.createElement("div");
    packagesWrapper.classList.add("ps-packages");

    // Loop over packages
    category.packages.forEach(pkg => {
      const pkgDiv = document.createElement("div");
      pkgDiv.classList.add("ps-package");

      const pkgTitle = document.createElement("h3");
      pkgTitle.textContent = `${pkg.name} - $${pkg.price}`;
      pkgDiv.appendChild(pkgTitle);

      const ul = document.createElement("ul");
      pkg.features.forEach(feature => {
        const li = document.createElement("li");
        li.textContent = feature;
        ul.appendChild(li);
      });
      pkgDiv.appendChild(ul);

      packagesWrapper.appendChild(pkgDiv);
    });

    card.appendChild(packagesWrapper);
    container.appendChild(card);
  });
}

// Load and render once DOM is ready
document.addEventListener("DOMContentLoaded", async () => {
  const data = await fetchPhotoshootData();
  renderPhotoshootCards(data, "photoshoot-container");
});
