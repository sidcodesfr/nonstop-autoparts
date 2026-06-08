// add-to-cart-detail.js
document.addEventListener("DOMContentLoaded", () => {
  const addToCartBtn = document.getElementById("add-to-cart-btn");

  if (!addToCartBtn) return;

  addToCartBtn.addEventListener("click", (e) => {
    e.preventDefault();

    // Read product info from data attributes or DOM
    const productId = document.getElementById("product-id").value;
    const productName = document.getElementById("product-name").textContent;
    const productPrice = parseFloat(document.getElementById("product-price").textContent.replace("AED ", ""));
    const productImage = document.getElementById("main-image").src;
    const qty = parseInt(document.getElementById("product-qty").value);

    const product = {
      id: productId,
      name: productName,
      price: productPrice,
      image: productImage,
      qty: qty
    };

    let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];

    const existingItemIndex = cartItems.findIndex(item => item.id === product.id);
    if (existingItemIndex !== -1) {
      cartItems[existingItemIndex].qty += qty;
    } else {
      cartItems.push(product);
    }

    localStorage.setItem("cartItems", JSON.stringify(cartItems));

    // Redirect to cart page
    window.location.href = "testcart.html";
  });
});
