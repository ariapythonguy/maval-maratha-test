document.addEventListener("DOMContentLoaded", function () {
    console.log("Loading chinese data...");

    // Fetch both JSON files in parallel
    Promise.all([
        fetch("../json/chinese_veg.json").then(response => response.json()),
        // fetch("../json/chinese_non_veg.json").then(response => response.json())
    ])
    .then(([vegData, nonVegData]) => {
        console.log("chinese JSON Loaded Successfully");
        
        // Populate separate menus
        populatechineseMenu(vegData, "chinese-veg-menu");
        // populatechineseMenu(nonVegData, "chinese-nonveg-menu");
    })
    .catch(error => console.error("Error fetching chinese data:", error));
});

// Function to populate the chinese menu dynamically
function populatechineseMenu(data, containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Container with ID '${containerId}' not found.`);
        return;
    }

    container.innerHTML = ""; // Clear previous content if any

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
                <img src="${dish.image}" alt="${dish.name}" class="lazy-img" loading="lazy"/>
            </div>
        `;

        container.appendChild(dishElement);
    });
    handleReadMore();
    // lazyLoadImages();
    console.log(`chinese Menu Loaded Successfully for ${containerId}`);
}

// Fetch restaurant header details
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

// function generateStars(rating) {
//     let fullStars = Math.floor(rating);
//     let halfStar = rating % 1 !== 0;
//     let starHTML = "";

//     for (let i = 0; i < fullStars; i++) {
//         starHTML += `<span class="full-star"></span> `;
//     }
//     if (halfStar) {
//         starHTML += `<span class="half-star"></span> `;
//     }

//     console.log("Generated Stars:", starHTML); // 🔴 Debug log
//     return starHTML;
// }

// function generateVegIcon(isVeg) {
//     return `<span class="radio-circle ${isVeg ? 'veg' : 'non-veg'}"></span> 
//             <span class="${isVeg ? 'vegetarian' : 'non-vegetarian'}">
//                 ${isVeg ? 'VEGETARIAN' : 'NON-VEGETARIAN'}
//             </span>`;
// }
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
