document.addEventListener("DOMContentLoaded", function () {
    console.log("Loading gravy data...");

    Promise.all([
        fetch("../json/gravy_veg.json").then(response => response.ok ? response.json() : Promise.reject(`Failed to load gravy_veg.json: ${response.status}`)),
        fetch("../json/gravy_non_veg.json").then(response => response.ok ? response.json() : Promise.reject(`Failed to load gravy_non_veg.json: ${response.status}`))
    ])
    .then(([vegGravy, nonVegGravy]) => {
        console.log("Gravy JSON Loaded Successfully:", { vegGravy, nonVegGravy });

        populateGravyMenu(vegGravy, "gravy-menu-veg");
        populateGravyMenu(nonVegGravy, "gravy-menu-nonveg");
    })
    .catch(error => console.error("Error fetching gravy data:", error));
});

function populateGravyMenu(data, containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Container with ID '${containerId}' not found.`);
        return;
    }

    container.innerHTML = ""; // Clear previous content

    data.forEach(dish => {
        const dishElement = document.createElement("div");
        dishElement.classList.add("dish");
        let shortDesc = dish.description.length > 30 ? dish.description.substring(0, 30) + "..." : dish.description;
        let fullDesc = dish.description;

        dishElement.innerHTML = `
            <div class="veg-container">
                <span class="circle ${dish.veg ? 'veg' : 'non-veg'}"></span>
                <span class="${dish.veg ? 'vegetarian' : 'non-vegetarian'}">
                    ${dish.veg ? 'VEGETARIAN' : 'NON-VEGETARIAN'}
                </span>
            </div>

            <div class="dish-content">
                <div class="dish-details">
                    <div class="dish-header">
                        <span class="dish-name">${dish.name}</span>
                    </div>
                    <div class="dish-pricing">
                        <span class="dish-price">Rs ${dish.price}</span>
                    </div>
                    <span class="dish-rating">${generateStars(dish.rating)} (${dish.rating})</span>
                    <p class="dish-description" 
                        data-full="${fullDesc}" 
                        data-short="${shortDesc}">
                        ${window.innerWidth < 480 ? shortDesc + ' <span class="read-more" style="color: #31B404; cursor: pointer;">Read More</span>' : fullDesc}
                    </p>
                </div>
                <img src="${dish.image}" alt="${dish.name}" class="lazy-img" loading="lazy" decoding="async"
            </div>
        `;

        container.appendChild(dishElement);
    });
    handleReadMore();
    // lazyLoadImages();
    console.log(`Gravy menu loaded successfully for ${containerId}`);
}

fetch('../json/header.json')
    .then(response => response.json())
    .then(data => {
        document.querySelector('.restaurant-name').textContent = data.restaurantName;
        document.querySelector('.restaurant-details').textContent = `${data.address} | ${data.contact}`;
    })
    .catch(error => console.error('Error loading header data:', error));

    function lazyLoadImages() {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    observer.unobserve(img);
                }
            });
        });
    
        document.querySelectorAll(".lazy-img").forEach(img => observer.observe(img));
    }
// Function to handle "Read More" functionality
function handleReadMore() {
    if (window.innerWidth >= 480) return;

    document.querySelectorAll(".dish-description").forEach(desc => {
        let shortText = desc.getAttribute("data-short");
        let fullText = desc.getAttribute("data-full");

        desc.innerHTML = shortText + ' <span class="read-more" style="color: #31B404; cursor: pointer;">Read More</span>';

        desc.addEventListener("click", function (event) {
            if (event.target.classList.contains("read-more")) {
                desc.innerHTML = fullText + ' <span class="read-less" style="color: #31B404; cursor: pointer;">Read Less</span>';
            } else if (event.target.classList.contains("read-less")) {
                desc.innerHTML = shortText + ' <span class="read-more" style="color: #31B404; cursor: pointer;">Read More</span>';
            }
        });
    });
}
// Function to generate star ratings
function generateStars(rating) {
    let fullStars = Math.floor(rating);
    let halfStar = rating % 1 !== 0;
    let starHTML = "";

    for (let i = 0; i < fullStars; i++) {
        starHTML += `<i class="fa fa-star" style="color: gold;"></i> `;
    }
    if (halfStar) {
        starHTML += `<i class="fa fa-star-half" style="color: gold;"></i> `;
    }
    return starHTML;
}
// const observer = new MutationObserver(mutations => {
//     mutations.forEach(mutation => {
//         if (mutation.type === "childList") {
//             console.log("Node inserted:", mutation.addedNodes);
//         }
//     });
// });

// observer.observe(document.body, { childList: true, subtree: true });
