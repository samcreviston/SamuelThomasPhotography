
// fade in hero images from left to right
document.addEventListener("DOMContentLoaded", () => {
  const images = Array.from(document.querySelectorAll("#hero-images img")).filter(img => img.id !== 'hero-logo');

  images.forEach((img, index) => {
    setTimeout(() => {
      img.style.opacity = 1;
    }, index * 400);  // staggered by 0.75s each
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

    // Category heading
    const categoryHeading = document.createElement("h3");
    categoryHeading.classList.add("ps-category-title");
    categoryHeading.textContent = category.category;

    // Images row (flex)
    const imagesRow = document.createElement("div");
    imagesRow.classList.add("ps-images-row");

    category.images.forEach(path => {
      const img = document.createElement("img");
      img.src = path;
      img.alt = `${category.category} photoshoot`;
      imagesRow.appendChild(img);
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

    // Build hierarchy: heading → images → options
    card.appendChild(categoryHeading);
    card.appendChild(imagesRow);
    card.appendChild(optionsSection);
    container.appendChild(card);
  });
}


// Load and render once DOM is ready
document.addEventListener("DOMContentLoaded", async () => {
  const data = await fetchPhotoshootData();
  renderPhotoshootCards(data, "photoshoot-container");

  // Initialize dropdown functionality
  initializeDropdowns();

  // Set up scroll detection for auto-opening first section
  setupScrollDetection();
});

// Dropdown functionality
function initializeDropdowns() {
  const dropdownButtons = document.querySelectorAll('.dropdown-toggle');

  dropdownButtons.forEach(button => {
    button.addEventListener('click', function() {
      const targetId = this.getAttribute('data-target');
      const targetWrapper = document.getElementById(targetId + '-wrapper');

      if (targetWrapper.classList.contains('open')) {
        // Close
        targetWrapper.style.maxHeight = '0px';
        targetWrapper.classList.remove('open');
        this.classList.remove('active');
      } else {
        // Open
        targetWrapper.style.maxHeight = targetWrapper.scrollHeight + 'px';
        targetWrapper.classList.add('open');
        this.classList.add('active');
      }
    });
  });
}

// Scroll detection for auto-opening first section
function setupScrollDetection() {
  const firstSection = document.getElementById('photoshoot-container-wrapper');
  const firstSectionHeader = document.querySelector('.section-header');
  let hasOpened = false;

  function checkScroll() {
    if (hasOpened) return;

    const rect = firstSectionHeader.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    // Check if the header is in viewport (with some buffer)
    if (rect.top <= windowHeight * 0.8 && rect.bottom >= 0) {
      firstSection.style.maxHeight = firstSection.scrollHeight + 'px';
      firstSection.classList.add('open');
      hasOpened = true;

      // Also activate the button
      const button = firstSectionHeader.querySelector('.dropdown-toggle');
      if (button) {
        button.classList.add('active');
      }

      // Remove scroll listener after first trigger
      window.removeEventListener('scroll', checkScroll);
    }
  }

  // Initial check in case already in viewport
  checkScroll();

  // Add scroll listener
  window.addEventListener('scroll', checkScroll);
}

// function to initialize Google map
let map;
let currentMarker;

function initMap() {
  // Create the map
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 39.8283, lng: -98.5795 }, // Center of USA
    zoom: 4,
  });

  // Attach event listeners to location list items
  const locationItems = document.querySelectorAll("#location-list li");
  locationItems.forEach(item => {
    item.addEventListener("click", () => {
      const lat = parseFloat(item.getAttribute("data-lat"));
      const lng = parseFloat(item.getAttribute("data-lng"));
      const position = { lat, lng };

      // Remove previous marker if exists
      if (currentMarker) {
        currentMarker.setMap(null);
      }

      // Add new marker
      currentMarker = new google.maps.Marker({
        position,
        map,
        title: item.textContent,
      });

      // Recenter map
      map.setCenter(position);
      map.setZoom(10);
    });
  });
}

// Expose initMap for Google Maps API callback
window.initMap = initMap;
