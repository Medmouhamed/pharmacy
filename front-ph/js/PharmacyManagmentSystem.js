const MED_API = "http://localhost:3000/medicines";
const CATEGORY_API = "http://localhost:3000/categories";
const SHELF_API = "http://localhost:3000/shelfs";

let allMedicines = [];
let categories = [];
let shelves = [];
let allowedShelves = null;

// categ
fetch(CATEGORY_API).then(r => r.json()).then(d => {
  categories = d.map(c => ({ id: c[0], name: c[1] }));
  const catSelect = document.getElementById("categoryFilter");
  categories.forEach(c => { catSelect.innerHTML += `<option value="${c.id}">${c.name}</option>`; });
});

// shelfs
fetch(SHELF_API).then(r => r.json()).then(d => {
  shelves = d;
  const shelfSelect = document.getElementById("shelfFilter");
  shelves.forEach(s => { shelfSelect.innerHTML += `<option value="${s.IDS}">${s.IDS}</option>`; });
});

function getCategoryName(id) {
  const c = categories.find(c => c.id == id);
  return c ? c.name : "Unknown";
}

function getShelfDisplay(IDS) {
  return IDS;
}

function applyFilters() {
  let data = allMedicines.filter(m => {
    const shelfObj = shelves.find(s => s.IDS == m.IDS);
    const categoryId = shelfObj ? shelfObj.IDC : null;

    if (idFilter.value && m.IDS != idFilter.value) return false;
    if (categoryFilter.value && categoryId != categoryFilter.value) return false;
    if (shelfFilter.value && m.IDS != shelfFilter.value) return false;
    if (stockFilter.value === "in" && m.QUANTITY <= 0) return false;
    if (stockFilter.value === "out" && m.QUANTITY > 0) return false;
    if (quantityFilter.value && m.QUANTITY < quantityFilter.value) return false;
    if (maxQuantityFilter.value && m.QUANTITY > maxQuantityFilter.value) return false;
    if (minPriceFilter.value && m.PRICE < minPriceFilter.value) return false;
    if (maxPriceFilter.value && m.PRICE > maxPriceFilter.value) return false;
    if (expiryFilter.value && new Date(m.EXPIRYDATE) > new Date(expiryFilter.value)) return false;
    if (searchInput.value && !m.NAME.toLowerCase().includes(searchInput.value.toLowerCase())) return false;
    return true;
  });
  render(data);
}

function render(list) {
  medicineTable.innerHTML = "";
  list.forEach(m => {
    const shelfObj = shelves.find(s => s.IDS == m.IDS);
    const categoryName = shelfObj ? getCategoryName(shelfObj.IDC) : "Unknown";
    const shelfDisplay = shelfObj ? getShelfDisplay(shelfObj.IDS) : "Unknown";

    medicineTable.innerHTML += `
      <tr>
        <td>${m.IDS}</td>
        <td>${m.NAME}</td>
        <td>${m.MANUFACTURE}</td>
        <td>${categoryName}</td>
        <td>${shelfDisplay}</td>
        <td>${m.QUANTITY}</td>
        <td class="price">${m.PRICE}$</td>
        <td>${new Date(m.EXPIRYDATE).toLocaleDateString()}</td>
        <td><span class="badge ${m.QUANTITY > 0 ? "in" : "out"}">${m.QUANTITY > 0 ? "IN STOCK" : "OUT STOCK"}</span></td>
      </tr>
    `;
  });
}

// events
document.querySelectorAll("input,select").forEach(e => e.addEventListener("input", applyFilters));

// meds
fetch(MED_API).then(r => r.json()).then(d => {
  allMedicines = d;
  applyFilters();
});