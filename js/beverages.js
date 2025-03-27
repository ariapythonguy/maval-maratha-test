document.addEventListener("DOMContentLoaded", function () {
    console.log("Loading beverages data...");

    // Fetch beverages data from beverages.json
    fetch("../json/beverages.json")
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to load beverages.json: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log("beverages JSON Loaded Successfully", data);
            populatebeveragesMenu(data);
        })
        .catch(error => console.error("Error fetching beverages.json:", error));
});

// Function to populate beverages menu dynamically
function populatebeveragesMenu(data) {
    const container = document.getElementById("beverages-menu");

    if (!container) {
        console.error("Container with ID 'beverages-menu' not found.");
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
                  
                   <img src="${dish.image}" alt="${dish.name}" class="lazy-img" loading="lazy" decoding="async" data-nimg="fill">
                   
                </div>
                `;
                // <img src="${dish.image}" alt="${dish.name}" class="lazy-img" loading="lazy"/>

        container.appendChild(dishElement);
    });
    handleReadMore();
    // lazyLoadImages();
    console.log("beverages Menu Loaded Successfully");
}
// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//     if (request.action === "getData") {
//         fetchSomeData().then(data => {
//             sendResponse({ success: true, data });
//         }).catch(error => {
//             sendResponse({ success: false, error });
//         });
//         return true; // Ensures sendResponse is called asynchronously
//     }
// });

// document.addEventListener("DOMContentLoaded", function () {
//     console.log("Page loaded");
// });

self.addEventListener('fetch', event => {
    event.respondWith(fetch(event.request));
});


// async function fetchData() {
//     try {
//         let response = await fetch("beverages.html");
//         let data = await response.text();
//         console.log(data);
//     } catch (error) {
//         console.error("Fetch error:", error);
//     }
// }
// fetchData();

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
// const observer = new MutationObserver((mutations) => {
//     mutations.forEach((mutation) => {
//         console.log("DOM Changed:", mutation);
//     });
// });

// observer.observe(document.body, { childList: true, subtree: true });
