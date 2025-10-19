import { item_array } from "../db/DB.js";
import Item from "../model/Item.js";

const cleanForm = () => {
  $("#item-id").val("");
  $("#item-name").val("");
  $("#item-price").val("");
  $("#item-qty").val("");
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

$("#btn-item-save").on("click", (e) => {
  e.preventDefault();

  const item_id = $("#item-id").val();
  const item_name = $("#item-name").val();
  const item_price = $("#item-price").val();
  const item_qty = $("#item-qty").val();
  const editIndex = $("#edit-index").val();

  if (!item_id || !item_name || !item_price || !item_qty) {
    console.error("Validation Error: All fields required..!");
    return;
  }

  const item = new Item(item_id, item_name, item_price, item_qty);

  if (editIndex === "") {
    if (item_array.some((i) => i.id === item_id)) {
      console.error(`Duplicate ID Error: Item ID ${item_id} already exists!`);
      return;
    }

    item_array.push(item);
  } else {
    item_array[editIndex] = item;
  }

  loadTable();
  cleanForm();

  const modalEl = document.getElementById("#item-form-modal");
  if (typeof bootstrap !== "undefined" && modalEl) {
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

  $("#item-id").val(item.id).prop("disabled", true);
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

  if (
    confirm(`Are you sure you want to delete item ID: ${item_array[index].id}?`)
  ) {
    item_array.splice(index, 1);
    loadTable();
  }
});

loadTable();
