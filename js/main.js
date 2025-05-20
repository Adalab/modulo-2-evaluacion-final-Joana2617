"use strict";

// Constantes de elementos
const elementTitle = document.querySelector(".js-title");
const btn = document.querySelector(".js-btn");
const inputSearch = document.querySelector(".js-input");
const productsList = document.querySelector(".js-productslist");
const cartList = document.querySelector(".js-cart");
const totalPriceEl = document.querySelector(".js-total");
const totalQuantityEl = document.querySelector(".js-quantity");

let url = "https://fakestoreapi.com/products"; //vamos buscar url da API\\
let products = []; //variavel que podemos utlizar no codigo, que pode variar\\
let cart = [];
let totalQuantity = 0;
let totalPrice = 0;

// Recuperar carrinho do localStorage ao iniciar
const savedCart = localStorage.getItem("cart");
if (savedCart) {
  cart = JSON.parse(savedCart);
}

// criar o titulo atraves de JS\\
elementTitle.innerHTML = "👜 Style & Tech 💻";

// Renderizar produtos com botões Buy e Remove
function renderProducts(products) {
  productsList.innerHTML = "";

  products.forEach((product) => {
    const li = document.createElement("li"); //DOM avancado\\
    const cartItem = cart.find((item) => item.id === product.id);

    li.innerHTML = `
      <h3 class="product-title">${product.title}</h3>
      <img class="product-image" src="${product.image}" alt="${
      product.title
    }" width="100">
      <p class="product-price">Price: £${product.price}</p>
      <div class="buttons">
        ${
          cartItem
            ? `<button class="buy-btn" data-id="${product.id}">Buy More</button>
               <button class="remove-btn" data-id="${product.id}">Remove</button>`
            : `<button class="buy-btn" data-id="${product.id}">Buy</button>`
        }
      </div>
    `;

    productsList.appendChild(li); //a produtcsList quero adicones a lista dos produtos\\

    // Botões
    if (cartItem) {
      li.querySelector(".buy-btn").addEventListener("click", () => {
        cartItem.quantity++;
        renderProducts(products);
        renderCart();
      });

      li.querySelector(".remove-btn").addEventListener("click", () => {
        cartItem.quantity--;
        if (cartItem.quantity <= 0) {
          cart = cart.filter((item) => item.id !== product.id);
        }
        renderProducts(products);
        renderCart();
      });
    } else {
      li.querySelector(".buy-btn").addEventListener("click", () => {
        cart.push({ ...product, quantity: 1 });
        renderProducts(products);
        renderCart();
      });
    }
  });
}

// Renderizar carrinho
function renderCart() {
  cartList.innerHTML = "";

  // Resetar totais antes de calcular
  totalQuantity = 0;
  totalPrice = 0;

  if (cart.length === 0) {
    cartList.innerHTML = "<p>Your cart is empty.</p>";
    totalPriceEl.textContent = "0.00";
    totalQuantityEl.textContent = "0";
    localStorage.setItem("cart", JSON.stringify(cart));
    return;
  }

  cart.forEach((item) => {
    const li = document.createElement("li"); //DOM Avancado\\
    li.classList.add("cart-item");
    li.innerHTML = `
      <h3 class="product-title">${item.title}</h3>
      <img class="product-image" src="${item.image}" alt="${item.title}" width="100">
      <p class="product-price">Price: £${item.price}</p>
      <p>Quantity: ${item.quantity}</p>
    `;
    cartList.appendChild(li);

    totalQuantity += item.quantity;
    totalPrice += item.price * item.quantity;
  });

  totalPriceEl.textContent = totalPrice.toFixed(2);
  totalQuantityEl.textContent = totalQuantity;

  // Salvar no localStorage sempre que o carrinho muda\\
  localStorage.setItem("cart", JSON.stringify(cart));
}

// Pesquisa
function handleClick(event) {
  event.preventDefault();
  const searchTerm = inputSearch.value.toLowerCase();
  const filteredProducts = products.filter((product) => {
    const title = " " + product.title.toLowerCase() + " ";
    return title.includes(searchTerm);
  });

  renderProducts(filteredProducts);
}

btn.addEventListener("click", handleClick);

// Buscar produtos da API
fetch(url)
  .then((response) => response.json())
  .then((data) => {
    products = data;
    renderProducts(products); // renderiza com carrinho já recuperado
    renderCart(); // renderiza o carrinho salvo
  })
  .catch((error) => console.error("Erro ao carregar produtos:", error));
