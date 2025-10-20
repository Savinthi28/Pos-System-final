import { item_array } from "../db/DB.js";
import Item from "../model/Item.js";

const cleanForm = () => {
  $("#item-id").val("").prop("disabled", false); // ID එක Clear කර Enable කරයි
  $("#item-name").val("");
  $("#item-price").val("");
  $("#item-qty").val("");
  $("#edit-index").val(""); // Edit index එකත් Clear කරයි
};

const loadTable = () => {
  $("#item-table-body").empty();
  item_array.forEach((item, index) => {
    const dataElement = `
    <tr class="hover:bg-gray-50 transition-colors">
      <td>${item.id}</td>
      <td>${item.name}</td>
      <td>Rs. ${item.price}</td>
      <td>${item.qty}</td>
      <td>
        <button class="btn btn-warning btn-edit" data-index="${index}">Edit</button>
        <button class="btn btn-danger btn-delete" data-index="${index}">Delete</button>
      </td>
    </tr>`;
    $("#item-table-body").append(dataElement);
  });
};

// 💡 අලුතින් එකතු කළ කොටස: Add Modal එක විවෘත කිරීම සඳහා
$("#btn-item-modal-open").on("click", () => {
  $("#item-modal-title").text("Add Item"); // Title එක "Add Item" ලෙස සකසයි
  $("#btn-item-save").text("Save"); // Button text එක "Save" ලෙස සකසයි
  cleanForm(); // Form එක Clear කර ID එක Enable කරයි

  // Modal එක විවෘත කිරීම
  const modalEl = document.getElementById("#item-form-modal");
  if (typeof bootstrap !== "undefined" && modalEl) {
    const modal = new bootstrap.Modal(modalEl); // නැවත අලුත් Modal එකක් හදන්න
    modal.show();
  }
});

$("#btn-item-save").on("click", (e) => {
  e.preventDefault();

  const item_id = $("#item-id").val();
  const item_name = $("#item-name").val();
  const item_price = $("#item-price").val();
  const item_qty = $("#item-qty").val();
  const editIndex = $("#edit-index").val();

  if (!item_id || !item_name || !item_price || !item_qty) {
    console.error("Validation Error: All fields required..!");
    alert("සියලුම ක්ෂේත්‍ර පිරවිය යුතුය!");
    return;
  }

  const item = new Item(item_id, item_name, item_price, item_qty);

  if (editIndex === "") {
    if (item_array.some((i) => i.id === item_id)) {
      console.error(`Duplicate ID Error: Item ID ${item_id} already exists!`);
      alert(`Error: Item ID ${item_id} දැනටමත් පවතී!`);
      return;
    }

    item_array.push(item);
  } else {
    item_array[editIndex] = item;
  }

  loadTable();
  cleanForm();

  // Modal එක වැසීම
  const modalEl = document.getElementById("#item-form-modal");
  if (typeof bootstrap !== "undefined" && modalEl) {
    // ID එක "#item-form-modal" යන්නෙන් # ලකුණ ඉවත් කළ යුතුය
    const modal = bootstrap.Modal.getInstance(modalEl);
    if (modal) {
      modal.hide();
    }
  }
});

$("#item-table-body").on("click", ".btn-edit", (e) => {
  const index = $(e.currentTarget).data("index");
  const item = item_array[index];

  $("#item-modal-title").text("Edit Item");

  $("#item-id").val(item.id).prop("disabled", true); // Edit කිරීමේදී ID එක Disable කරයි
  $("#item-name").val(item.name);
  $("#item-price").val(item.price);
  $("#item-qty").val(item.qty);

  $("#edit-index").val(index);
  $("#btn-item-save").text("Update");

  const modalEl = document.getElementById("item-form-modal");
  if (typeof bootstrap !== "undefined" && modalEl) {
    const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
    modal.show();
  }
});

$("#item-table-body").on("click", ".btn-delete", function () {
  const index = $(this).data("index");

  const res = confirm(`Are you sure you want to delete ?`);

  if (res) {
    item_array.splice(index, 1);
  }
  loadTable();
});

loadTable();
