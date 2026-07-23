// Your product catalog.
// amount is in the smallest currency unit (cents for USD) — e.g. 4999 = $49.99
// Add, remove, or edit entries here. The "id" is used internally to look up
// the product when creating a Checkout Session — keep it stable once you've
// shared a product page/link.

module.exports = [
  {
    id: "classic-tee",
    name: "Classic Tee",
    description: "Heavyweight cotton tee, original print.",
    amount: 3500,
    currency: "usd",
    image: "https://placehold.co/600x600?text=Classic+Tee",
  },
  {
    id: "signature-hoodie",
    name: "Signature Hoodie",
    description: "Fleece-lined pullover hoodie, original design.",
    amount: 6800,
    currency: "usd",
    image: "https://placehold.co/600x600?text=Signature+Hoodie",
  },
  {
    id: "canvas-tote",
    name: "Canvas Tote",
    description: "Heavy-duty canvas tote, original artwork.",
    amount: 2200,
    currency: "usd",
    image: "https://placehold.co/600x600?text=Canvas+Tote",
  },
  {
    id: "snapback-cap",
    name: "Snapback Cap",
    description: "Structured 6-panel cap, embroidered logo.",
    amount: 2800,
    currency: "usd",
    image: "https://placehold.co/600x600?text=Snapback+Cap",
  },
];
