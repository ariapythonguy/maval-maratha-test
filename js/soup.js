document.addEventListener("DOMContentLoaded", function () {
    console.log("Loading soup data...");

    // Fetch soup data from soup.json
    fetch("../json/soup.json")
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to load soup.json: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log("Soup JSON Loaded Successfully", data);
            populateSoupMenu(data);
        })
        .catch(error => console.error("Error fetching soup.json:", error));
});

// Function to populate soup menu dynamically
function populateSoupMenu(data) {
    const container = document.getElementById("soup-menu");

    if (!container) {
        console.error("Container with ID 'soup-menu' not found.");
        return;
    }

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

    console.log("Soup Menu Loaded Successfully");
}

fetch('../json/header.json')
    .then(response => response.json())
    .then(data => {
        document.querySelector('.restaurant-name').textContent = data.restaurantName;
        document.querySelector('.restaurant-details').textContent = `${data.address} | ${data.contact}`;
    })
    .catch(error => console.error('Error loading header data:', error));

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
