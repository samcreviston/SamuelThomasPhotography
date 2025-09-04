
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
  container.innerHTML = ""; // clear any existing

  dataArray.forEach(category => {
    // Main card
    const card = document.createElement("div");
    card.classList.add("ps-card");
    card.id = `ps-${category.category.toLowerCase()}`;

    // Grid wrapper
    const grid = document.createElement("div");
    grid.classList.add("ps-card-grid");

    // Images column
    const imagesCol = document.createElement("div");
    imagesCol.classList.add("ps-images-column");

    category.images.forEach(path => {
      const img = document.createElement("img");
      img.src = path;
      img.alt = `${category.category} photoshoot`;
      imagesCol.appendChild(img);
    });

    // Options section
    const optionsSection = document.createElement("div");
    optionsSection.classList.add("ps-options-section");

    category.packages.forEach(pkg => {
      const optionDiv = document.createElement("div");
      optionDiv.classList.add("ps-option");

      const titlePriceDiv = document.createElement("div");
      titlePriceDiv.classList.add("ps-option-title-price");

      const h3 = document.createElement("h3");
      h3.textContent = `${pkg.name} - $${pkg.price}`;
      titlePriceDiv.appendChild(h3);

      const ul = document.createElement("ul");
      ul.classList.add("ps-option-description");
      pkg.features.forEach(feature => {
        const li = document.createElement("li");
        li.textContent = feature;
        ul.appendChild(li);
      });

      optionDiv.appendChild(titlePriceDiv);
      optionDiv.appendChild(ul);

      optionsSection.appendChild(optionDiv);
    });

    // Build hierarchy
    grid.appendChild(imagesCol);
    grid.appendChild(optionsSection);
    card.appendChild(grid);
    container.appendChild(card);
  });
}

// Load and render once DOM is ready
document.addEventListener("DOMContentLoaded", async () => {
  const data = await fetchPhotoshootData();
  renderPhotoshootCards(data, "photoshoot-container");
});
