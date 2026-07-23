const grid = document.getElementById("grid");

function money(amount, currency) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(amount / 100);
}

function renderProducts(products) {
  grid.innerHTML = "";

  products.forEach((product) => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <img src="${product.image}" alt="${product.name}" />
      <div class="card-body">
        <h3>${product.name}</h3>
        <p>${product.description}</p>
        <div class="price">${money(product.amount, product.currency)}</div>
        <button class="buy-btn" data-id="${product.id}">Buy now</button>
      </div>
    `;
    grid.appendChild(card);
  });

  grid.querySelectorAll(".buy-btn").forEach((btn) => {
    btn.addEventListener("click", () => startCheckout(btn));
  });
}

async function startCheckout(btn) {
  const productId = btn.dataset.id;
  btn.disabled = true;
  btn.textContent = "Redirecting…";

  try {
    const res = await fetch("/create-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId }),
    });

    const data = await res.json();

    if (!res.ok || !data.url) {
      throw new Error(data.error || "Could not start checkout.");
    }

    window.location.href = data.url;
  } catch (err) {
    btn.disabled = false;
    btn.textContent = "Buy now";
    const banner = document.createElement("div");
    banner.className = "error-banner";
    banner.textContent = err.message;
    grid.prepend(banner);
  }
}

async function loadProducts() {
  try {
    const res = await fetch("/api/products");
    const data = await res.json();
    renderProducts(data.products);
  } catch (err) {
    grid.innerHTML = `<div class="error-banner">Could not load products. Is the server running?</div>`;
  }
}

loadProducts();
