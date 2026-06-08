// cart.js
document.addEventListener("DOMContentLoaded", () => {
  const cartContainer = document.querySelector(".cart-container");
  const summarySubtotal = document.querySelector(".summary-row span:nth-child(2)");
  const summaryTotal = document.querySelector(".summary-row.total span:nth-child(2)");
  const shippingFee = 20;

  let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];

  const formatPrice = (price) => `AED ${price.toFixed(2)}`;

  function getTotalQuantity() {
    return cartItems.reduce((total, item) => total + item.qty, 0);
  }

  function renderCart() {
    const totalQuantity = getTotalQuantity();
    cartContainer.innerHTML = `
      <h2 class="cart-title"> My Cart <span>(${totalQuantity} item${totalQuantity !== 1 ? 's' : ''})</span></h2>
    `;

    cartItems.forEach((item, index) => {
      const itemEl = document.createElement("div");
      itemEl.classList.add("cart-item");

      itemEl.innerHTML = `
        <img src="${item.image}" alt="${item.name}" class="product-image">

        <div class="product-details">
          <h3 class="product-name">${item.name}</h3>
          <p class="product-meta">Order in 19 h 16 m</p>
          <p class="product-delivery">Get it by <span class="delivery-date">Wed, Jul 23</span></p>
          <button class="remove-btn" data-index="${index}">Remove</button>
        </div>

        <div class="product-pricing">
          <div class="current-price">${formatPrice(item.price)}</div>
          <div class="delivery-icon">🚚 ${formatPrice(shippingFee)} Delivery</div>
          <div class="quantity-wrapper">
            <label for="quantity-${index}">Qty</label>
            <select id="quantity-${index}" data-index="${index}" class="qty-select">
              ${[1, 2, 3, 4, 5].map(q =>
                `<option value="${q}" ${item.qty === q ? 'selected' : ''}>${q}</option>`
              ).join('')}
            </select>
          </div>
        </div>
      `;

      cartContainer.appendChild(itemEl);
    });

    updateSummary();
  }

 function updateSummary() {
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);
  const totalQuantity = cartItems.reduce((sum, item) => sum + item.qty, 0);

  const summarySubtotal = document.getElementById("summary-subtotal");
  const summaryShipping = document.getElementById("summary-shipping");
  const summaryTotal = document.getElementById("summary-total");
  const cartTitle = document.querySelector(".cart-title span");

  if (summarySubtotal) {
    summarySubtotal.textContent = `AED ${subtotal.toFixed(2)}`;
  }

  if (cartTitle) {
    cartTitle.textContent = `(${totalQuantity} item${totalQuantity !== 1 ? 's' : ''})`;
  }

  const shipping = totalQuantity > 0 ? 20 : 0;
  const total = subtotal + shipping;

  if (summaryShipping) {
    summaryShipping.textContent = `AED ${shipping.toFixed(2)}`;
  }

  if (summaryTotal) {
    summaryTotal.textContent = `AED ${total.toFixed(2)}`;
  }

  document.querySelectorAll(".current-price").forEach((priceEl, idx) => {
  priceEl.textContent = formatPrice(cartItems[idx].price * cartItems[idx].qty);
});

}

  cartContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("remove-btn")) {
      const index = parseInt(e.target.getAttribute("data-index"));
      cartItems.splice(index, 1);
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
      renderCart();
    }
  });

  

  cartContainer.addEventListener("change", (e) => {
    if (e.target.classList.contains("qty-select")) {
      const index = parseInt(e.target.getAttribute("data-index"));
      const newQty = parseInt(e.target.value);
      cartItems[index].qty = newQty;
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
      updateSummary();
    }
  });

  renderCart();

  // After rendering cart items
const checkoutBtn = document.getElementById('checkout-btn');
if (checkoutBtn) {
  if (cartItems.length === 0) {
    checkoutBtn.disabled = true;
    checkoutBtn.style.opacity = '0.5';
    checkoutBtn.style.cursor = 'not-allowed';
  } else {
    checkoutBtn.disabled = false;
    checkoutBtn.style.opacity = '1';
    checkoutBtn.style.cursor = 'pointer';
  }
}

});

