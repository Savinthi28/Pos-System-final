import { item_array } from "../db/DB.js";
import Item from "../model/Item.js";

import { loadItemNames } from "./OrderController.js";

const cleanForm = () => {
  $("#item-id").val("").prop("disabled", false);
  $("#item-name").val("");
  $("#item-price").val("");
  $("#item-qty").val("");
  $("#edit-index").val("");
};

const loadTable = () => {
  $("#item-table-body").empty();
  item_array.forEach((item, index) => {
    const dataElement = `
    <tr class="hover:bg-gray-50 transition-colors">
      <td>${item.id}</td>
      <td>${item.name}</td>
      <td>Rs. ${parseFloat(item.price).toFixed(2)}</td>
      <td>${item.qty}</td>
      <td>
        <button class="btn btn-warning btn-sm btn-edit" data-index="${index}"><i class="bi bi-pencil-square"></i> Edit</button>
        <button class="btn btn-danger btn-sm btn-delete" data-index="${index}"><i class="bi bi-trash"></i> Delete</button>
      </td>
    </tr>`;
    $("#item-table-body").append(dataElement);
  });
};

$("#btn-item-modal-open").on("click", () => {
  $("#item-modal-title").text("Add Item");
  $("#btn-item-save")
    .html('<i class="bi bi-save"></i> Save')
    .removeClass("btn-primary")
    .addClass("btn-success");
  cleanForm();
});

$("#btn-item-save").on("click", (e) => {
  e.preventDefault();

  const item_id = $("#item-id").val();
  const item_name = $("#item-name").val();
  const item_price = $("#item-price").val();
  const item_qty = $("#item-qty").val();
  const editIndex = $("#edit-index").val();

  if (!item_id || !item_name || !item_price || !item_qty) {
    alert("All fields must be required!");
    return;
  }

  const item = new Item(item_id, item_name, item_price, item_qty);

  if (editIndex === "") {
    if (item_array.some((i) => i.id === item_id)) {
      alert(`Error: Item ID ${item_id} already exist!`);
      return;
    }
    item_array.push(item);
  } else {
    item_array[editIndex] = item;
  }

  loadTable();
  cleanForm();

  loadItemNames();

  const modalEl = document.getElementById("item-form-modal");
  if (typeof bootstrap !== "undefined" && modalEl) {
    const modal = bootstrap.Modal.getInstance(modalEl);
    if (modal) {
      modal.hide();

      setTimeout(() => {
        $(".modal-backdrop").remove();
        $("body").removeClass("modal-open");
      }, 300);
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
  $("#btn-item-save")
    .html('<i class="bi bi-arrow-up-circle"></i> Update')
    .removeClass("btn-success")
    .addClass("btn-primary");

  const modalEl = document.getElementById("item-form-modal");
  if (typeof bootstrap !== "undefined" && modalEl) {
    const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
    modal.show();
  }
});

$("#item-table-body").on("click", ".btn-delete", function () {
  const index = $(this).data("index");

  const itemToDelete = item_array[index];
  const res = confirm(
    `Are you sure you want to delete Item ID ${itemToDelete.id} (${itemToDelete.name})?`
  );

  if (res) {
    item_array.splice(index, 1);
    loadItemNames();
  }
  loadTable();
});

$(document).ready(function () {
  loadTable();
});
