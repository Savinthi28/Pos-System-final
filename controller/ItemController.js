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
    const dataElement = `<tr>
    <td>${item.id}</td>
    <td>${item.name}</td>
    <td>Rs. ${item.price}.00</td>
    <td>${item.qty}</td>
      <td>
    <button class="btn btn-warning btn-edit" data-index="${index}">Edit </button>
    <button class="btn btn-danger btn-delete"data-index="${index}">Delete</button>
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

  const item = new Item(item_id, item_name, item_price, item_qty);
  item_array.push(item);
  loadTable();
  cleanForm();

  const modalEl = document.getElementById("item-form-modal");
  const modal = bootstrap.Modal.getInstance(modalEl);
  modal.hide();
});

loadTable();
