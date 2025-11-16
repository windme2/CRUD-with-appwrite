// API Base URL
const API_URL = "/api/items";

// State
let editingId = null;

// DOM Elements
const itemForm = document.getElementById("itemForm");
const itemNameInput = document.getElementById("itemName");
const descriptionInput = document.getElementById("description");
const priceInput = document.getElementById("price");
const stockQuantityInput = document.getElementById("stockQuantity");
const categoryIdInput = document.getElementById("categoryId");
const isAvailableInput = document.getElementById("isAvailable");
const itemsList = document.getElementById("itemsList");
const submitBtn = document.getElementById("submitBtn");
const cancelBtn = document.getElementById("cancelBtn");
const formTitle = document.getElementById("formTitle");
const editMode = document.getElementById("editMode");

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  loadItems();
  setupEventListeners();
});

// Setup Event Listeners
function setupEventListeners() {
  itemForm.addEventListener("submit", handleSubmit);
  cancelBtn.addEventListener("click", cancelEdit);
}

// Load all items
async function loadItems() {
  try {
    itemsList.innerHTML = '<div class="loading">⏳ กำลังโหลดข้อมูล...</div>';

    const response = await fetch(API_URL);
    if (!response.ok) throw new Error("ไม่สามารถโหลดข้อมูลได้");

    const items = await response.json();
    displayItems(items);
  } catch (error) {
    console.error("Error loading items:", error);
    itemsList.innerHTML = `
      <div class="empty-state">
        ❌ เกิดข้อผิดพลาด: ${error.message}
      </div>
    `;
  }
}

// Display items
function displayItems(items) {
  // Update stats
  updateStats(items);

  if (items.length === 0) {
    itemsList.innerHTML = `
      <div class="empty-state">
        <span class="empty-state-icon">📭</span>
        <div class="empty-state-title">ยังไม่มีข้อมูล</div>
        <div class="empty-state-text">เพิ่มข้อมูลใหม่ด้านบนได้เลย</div>
      </div>
    `;
    return;
  }

  itemsList.innerHTML = items
    .map(
      (item) => `
    <div class="item-card">
      <div class="item-header">
        <div class="item-title">${escapeHtml(item.itemName)}</div>
        <span class="item-badge" style="background: ${
          item.isAvailable ? "#10b981" : "#ef4444"
        }">${item.isAvailable ? "✓ มีสินค้า" : "✗ หมด"}</span>
      </div>
      <div class="item-detail">
        <div><strong>💰 ราคา:</strong> ฿${parseFloat(item.price).toFixed(
          2
        )}</div>
        ${
          item.stockQuantity !== undefined
            ? `<div><strong>📊 สต็อก:</strong> ${item.stockQuantity} ชิ้น</div>`
            : ""
        }
        ${
          item.categoryId
            ? `<div><strong>🏷️ หมวดหมู่:</strong> ${item.categoryId}</div>`
            : ""
        }
        ${
          item.description
            ? `<div style="margin-top: 6px;"><strong>📝 รายละเอียด:</strong> ${escapeHtml(
                item.description
              )}</div>`
            : '<div style="margin-top: 6px; font-style: italic; color: #cbd5e0;">ไม่มีรายละเอียด</div>'
        }
      </div>
      <div class="item-meta">
        <span>📅 ${formatDate(item.$createdAt)}</span>
        ${
          item.$updatedAt !== item.$createdAt
            ? `<span>✏️ ${formatDate(item.$updatedAt)}</span>`
            : ""
        }
      </div>
      <div class="item-actions">
        <button class="btn btn-edit" onclick='editItem(${JSON.stringify(
          item
        )})'>
          ✏️ แก้ไข
        </button>
        <button class="btn btn-delete" onclick="deleteItem('${item.$id}')">
          🗑️ ลบ
        </button>
      </div>
    </div>
  `
    )
    .join("");
}

// Update statistics
function updateStats(items) {
  const totalItems = document.getElementById("totalItems");
  totalItems.textContent = items.length;
}

// Format date
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("th-TH", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Format time
function formatTime(dateString) {
  const date = new Date(dateString);
  return date.toLocaleTimeString("th-TH", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Handle form submit
async function handleSubmit(e) {
  e.preventDefault();

  const itemName = itemNameInput.value.trim();
  const description = descriptionInput.value.trim();
  const price = parseFloat(priceInput.value) || 0;
  const stockQuantity = parseInt(stockQuantityInput.value) || 0;
  const categoryId = parseInt(categoryIdInput.value) || null;
  const isAvailable = isAvailableInput.checked;

  if (!itemName) {
    alert("กรุณากรอกชื่อสินค้า");
    return;
  }

  if (!price || price < 0) {
    alert("กรุณากรอกราคาที่ถูกต้อง");
    return;
  }

  const data = {
    itemName,
    description,
    price,
    stockQuantity,
    categoryId,
    isAvailable,
  };

  try {
    if (editingId) {
      // Update
      await updateItem(editingId, data);
    } else {
      // Create
      await createItem(data);
    }

    // Reset form
    itemForm.reset();
    isAvailableInput.checked = true;
    cancelEdit();
    loadItems();
  } catch (error) {
    alert("เกิดข้อผิดพลาด: " + error.message);
  }
}

// Create new item
async function createItem(data) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "ไม่สามารถเพิ่มข้อมูลได้");
  }

  return response.json();
}

// Update item
async function updateItem(id, data) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "ไม่สามารถแก้ไขข้อมูลได้");
  }

  return response.json();
}

// Delete item
async function deleteItem(id) {
  if (!confirm("ต้องการลบข้อมูลนี้ใช่หรือไม่?")) {
    return;
  }

  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "ไม่สามารถลบข้อมูลได้");
    }

    loadItems();
  } catch (error) {
    alert("เกิดข้อผิดพลาด: " + error.message);
  }
}

// Edit item
function editItem(item) {
  editingId = item.$id;
  itemNameInput.value = item.itemName || "";
  descriptionInput.value = item.description || "";
  priceInput.value = item.price || 0;
  stockQuantityInput.value = item.stockQuantity || 0;
  categoryIdInput.value = item.categoryId || "";
  isAvailableInput.checked = item.isAvailable !== false;

  // Update UI
  formTitle.textContent = "แก้ไขข้อมูล";
  submitBtn.innerHTML = "💾 บันทึก";
  submitBtn.classList.remove("btn-primary");
  submitBtn.style.background = "#06b6d4";
  cancelBtn.style.display = "inline-block";
  editMode.style.display = "block";

  // Scroll to form
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// Cancel edit
function cancelEdit() {
  editingId = null;
  itemForm.reset();
  isAvailableInput.checked = true;

  // Reset UI
  formTitle.textContent = "เพิ่มข้อมูล";
  submitBtn.innerHTML = "➕ เพิ่มข้อมูล";
  submitBtn.classList.add("btn-primary");
  submitBtn.style.background = "";
  cancelBtn.style.display = "none";
  editMode.style.display = "none";
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

// Unescape HTML
function unescapeHtml(text) {
  const div = document.createElement("div");
  div.innerHTML = text;
  return div.textContent;
}
