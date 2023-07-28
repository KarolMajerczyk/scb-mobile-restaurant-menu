import { menuArray, shoppingCart } from "./data.js";

// Events

document.querySelector(".dashboard").addEventListener("click", function (e) {
  if (e.target.dataset.add) {
    handleAddItemClick(e.target.dataset.add);
  } else if (e.target.dataset.remove) {
    handleRemoveItemClick(e.target.dataset.remove);
  } else if (e.target.id === "submit-order") {
    handlePaymentModalOpen();
  } else if (e.target.id === "close-btn") {
    handlePaymentModalClose();
  }
});

document.querySelector(".dashboard").addEventListener("change", function (e) {
  if (e.target.dataset.quantity) {
    handleQuantityChange(e.target.dataset.quantity, e.target.value);
  }
});

document.querySelector(".dashboard").addEventListener("submit", function (e) {
  if (e.target.id === "payment-form") {
    e.preventDefault();
    handlePaymentFormSubmit(e.target);
  }
});

// Controller

function handleAddItemClick(id) {
  const index = getItemIndexFromShoppingCart(id);

  if (index !== -1) {
    increaseItemQuantityInShoppingCart(index);
  } else {
    const item = getItemFromMenuArray(id);
    addItemToShoppingCart(item);
  }

  renderShoppingCartItems();
  enableSubmitOrderBtn();
}

function handleRemoveItemClick(id) {
  const index = getItemIndexFromShoppingCart(id);
  removeItemFromShoppingCart(index);
  renderShoppingCartItems();

  if (isShoppingCartEmpty()) {
    disableSubmitOrderBtn();
  }
}

function handlePaymentModalOpen() {
  toggleDisableElementsOutsidePaymentModal();
  togglePaymentModal();
  toggleRequiredAttributeOnFormInputs();
}

function handlePaymentModalClose(form) {
  toggleDisableElementsOutsidePaymentModal();
  toggleRequiredAttributeOnFormInputs();
  togglePaymentModal();

  document.querySelector("#payment-form").reset();
}

function handleQuantityChange(id, value) {
  const index = getItemIndexFromShoppingCart(id);

  if (value > 0) {
    shoppingCart[index].quantity = value;
  } else {
    shoppingCart[index].quantity = 1;
  }

  renderShoppingCartItems();
}

function handlePaymentFormSubmit(form) {
  const name = new FormData(form).get("full-name").split(" ")[0];

  togglePaymentModal();
  clearShoppingCart();
  renderOrderConfirmation(name);
  toggleDisableElementsOutsidePaymentModal();
  toggleRequiredAttributeOnFormInputs();

  form.reset();
}

// Model

function getItemIndexFromShoppingCart(id) {
  return shoppingCart.findIndex((item) => item.id === Number(id));
}

function increaseItemQuantityInShoppingCart(index) {
  shoppingCart[index].quantity++;
}

function getItemFromMenuArray(id) {
  return menuArray.filter(function (food) {
    return food.id === Number(id);
  })[0];
}

function addItemToShoppingCart(item) {
  shoppingCart.push({
    ...item,
    quantity: 1,
  });
}

function removeItemFromShoppingCart(index) {
  shoppingCart.splice(index, 1);
}

function isShoppingCartEmpty() {
  return shoppingCart.length < 1;
}

function clearShoppingCart() {
  shoppingCart.splice(0, shoppingCart.length);
}

// View

function renderMenu() {
  let html = "";

  menuArray.forEach(function (item) {
    html += createFoodEl(item);
  });

  document.querySelector(".menu").innerHTML = html;
}

function createFoodEl(food) {
  let ingredients = "";

  food.ingredients.forEach(function (ingredient) {
    ingredients += `${ingredient}, `;
  });

  const foodEl = `
      <div class="food">
          <p class="food-preview">${food.emoji}</p>
          <div class="food-details">
              <p class="food-name">${food.name}</p>
              <p class="food-composition">${ingredients.slice(0, -2)}</p>
              <p class="food-price">$${food.price}</p>
          </div>
          <button class="btn btn-round" data-add="${food.id}">
              <span class="material-symbols-outlined"> add </span>
          </button>
      </div>
      `;

  return foodEl;
}

function renderShoppingCartItems() {
  if (!document.querySelector(".order-items")) {
    renderShoppingCart();
  }

  document.querySelector(".order-items").innerHTML = "";

  let html = "";
  let orderValue = 0;

  shoppingCart.forEach(function (item) {
    html += createOrderItemEl(item);
    orderValue += item.quantity * item.price;
  });

  document.querySelector(".shopping-cart").classList.remove("hidden");
  document.querySelector(".order-items").innerHTML = html;
  document.querySelector("#order-value").innerText = `$${orderValue}`;
}

function createOrderItemEl(item) {
  const orderItemEl = `
          <div class="item">
          <button class="btn btn-round btn-round-small" data-remove="${
            item.id
          }">
              <span class="material-symbols-outlined"> close </span>
          </button>
          <input type="number" min="1" max="99" value="${
            item.quantity
          }" data-quantity="${item.id}">
          <div class="item-details">
          <p class="item-preview">${item.emoji}</p>
          <p>${item.name}</p>
          </div>
              <p class="item-price">$${item.quantity * item.price}</p>
          </div>
      `;

  return orderItemEl;
}

function renderShoppingCart() {
  document.querySelector(".shopping-cart").innerHTML = `
          <h2 class="shopping-cart-label">Your order</h2>
          <div class="order-details">
          <div class="order-items"></div>
          <div class="order-summary">
              <p>Total price:</p>
              <p id="order-value"></p>
          </div>
          </div>
          <button id="submit-order" class="btn btn-regular">
              Complete order
          </button>
      `;
}

function enableSubmitOrderBtn() {
  document.querySelector("#submit-order").disabled = false;
  document.querySelector("#submit-order").classList.remove("btn-disabled");
}

function disableSubmitOrderBtn() {
  document.querySelector("#submit-order").disabled = true;
  document.querySelector("#submit-order").classList.add("btn-disabled");
}

function toggleDisableElementsOutsidePaymentModal() {
  document.querySelector(".menu").classList.toggle("disabled");
  document.querySelector(".shopping-cart").classList.toggle("disabled");
}

function togglePaymentModal() {
  document.querySelector(".payment-modal").classList.toggle("hidden");
}

function toggleRequiredAttributeOnFormInputs() {
  const inputs = document.querySelectorAll("#payment-form input");

  inputs.forEach((input) => {
    if (input.hasAttribute("required")) {
      input.removeAttribute("required");
    } else {
      input.setAttribute("required", "");
    }
  });
}

function renderOrderConfirmation(name) {
  document.querySelector(".shopping-cart").innerHTML = `
          <p class="confirmation-text">Thanks, ${name}! Your order is on its way!</p>
      `;
}

renderMenu();
