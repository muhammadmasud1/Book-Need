// ==========================
// Navbar & UI Toggle
// ==========================
let searchForm = document.querySelector('.search-form');
let shoppingCart = document.querySelector('.shopping-cart');
let logInForm = document.querySelector('.login-form');
let navbar = document.querySelector('.navbar');

document.querySelector('#search-btn').addEventListener('click', () => {
    searchForm.classList.toggle('active');
    shoppingCart.classList.remove('active');
    logInForm.classList.remove('active');
    navbar.classList.remove('active');
});

document.querySelector('#cart-btn').addEventListener('click', () => {
    shoppingCart.classList.toggle('active');
    searchForm.classList.remove('active');
    logInForm.classList.remove('active');
    navbar.classList.remove('active');
});

document.querySelector('#login-btn').addEventListener('click', () => {
    logInForm.classList.toggle('active');
    searchForm.classList.remove('active');
    shoppingCart.classList.remove('active');
    navbar.classList.remove('active');
});

document.querySelector('#menu-btn').onclick = () => {
    navbar.classList.toggle('active');
    searchForm.classList.remove('active');
    shoppingCart.classList.remove('active');
    logInForm.classList.remove('active');
};

window.onscroll = () => {
    searchForm.classList.remove('active');
    shoppingCart.classList.remove('active');
    logInForm.classList.remove('active');
    navbar.classList.remove('active');
};

// ==========================
// Fetch Products from JSON
// ==========================
document.addEventListener('DOMContentLoaded', function () {
    console.log("Loading products...");

    fetch('/products.js') // Ensure correct path
        .then(response => response.json())
        .then(products => {
            console.log(products);
            const container = document.getElementById('product-container');
            const showMoreBtn = document.createElement('button');
            showMoreBtn.textContent = "Show More";
            showMoreBtn.classList.add("btn", "show-more-btn");

            let visibleCount = 12;

            function renderProducts() {
                container.innerHTML = ""; // Clear existing products
                products.slice(0, visibleCount).forEach(product => {
                    const productHTML = `
                        <div class="product-box">
                            <img src="${product.image}" alt="${product.name}" />
                            <h3>${product.name}</h3>
                            <div class="price">${product.price}</div>
                            <div class="stars">${generateStars(product.rating)}</div>
                            <button class="btn add-to-cart" 
                                    data-name="${product.name}" 
                                    data-price="${product.price.replace('৳', '')}" 
                                    data-image="${product.image}">
                                Add to Cart
                            </button>
                        </div>
                    `;
                    container.insertAdjacentHTML('beforeend', productHTML);
                });

                showMoreBtn.style.display = (visibleCount >= products.length) ? "none" : "block";
            }

            renderProducts();

            showMoreBtn.addEventListener('click', () => {
                visibleCount += 12;
                renderProducts();
            });

            if (container.parentNode) { // Check if parent exists before appending
                container.parentNode.appendChild(showMoreBtn);
            }

        })
        .catch(error => console.error("Error loading products:", error));

    function generateStars(rating) {
        let starsHTML = '';
        for (let i = 1; i <= 5; i++) {
            starsHTML += (i <= rating) ? '<i class="fas fa-star"></i>' : '<i class="far fa-star"></i>';
        }
        return starsHTML;
    }
});

// ==========================
// Cart Functionality
// ==========================
// ==========================
// Cart Functionality
// ==========================
document.addEventListener("DOMContentLoaded", function () {
    const cartBtn = document.querySelector('#cart-btn');
    const cartContainer = document.querySelector('.shopping-cart');
    const cartTotal = document.querySelector('.total');
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Event listener for Add to Cart buttons
    document.addEventListener('click', function (e) {
        if (e.target.classList.contains('add-to-cart')) {
            const product = {
                name: e.target.dataset.name,
                price: parseFloat(e.target.dataset.price),
                image: e.target.dataset.image,
                quantity: 1
            };
            addToCart(product);
            updateCartUI();
        }

        if (e.target.classList.contains('fa-trash')) {
            const index = parseInt(e.target.closest('.box').dataset.index);
            removeFromCart(index);
            updateCartUI();
        }
    });

    // Add product to cart
    function addToCart(product) {
        const existingItem = cart.find(item => item.name === product.name);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push(product);
        }
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    function removeFromCart(index) {
        cart.splice(index, 1);
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    function updateCartUI() {
        const cartBoxes = document.querySelectorAll('.shopping-cart .box');
        cartBoxes.forEach(box => box.remove());

        let total = 0;

        cart.forEach((item, index) => {
            const cartItem = document.createElement('div');
            cartItem.className = 'box';
            cartItem.dataset.index = index;
            cartItem.innerHTML = `
                <i class="fas fa-trash"></i>
                <img src="${item.image}" alt="${item.name}" />
                <div class="content">
                    <h3>${item.name}</h3>
                    <span class="price">৳${item.price.toFixed(2)}</span>
                    <span class="quantity">Qty: ${item.quantity}</span>
                </div>
            `;
            cartContainer.insertBefore(cartItem, cartTotal);
            total += item.price * item.quantity;
        });

        cartTotal.textContent = `Total : ৳${total.toFixed(2)}`;

        if (cart.length > 0 && !cartContainer.classList.contains('active')) {
            cartBtn.click();
        }
    }

    updateCartUI();
});



