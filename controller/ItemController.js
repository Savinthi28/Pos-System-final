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
  item_array.forEach((item) => {
    // Corrected to use a template literal and ensure correct syntax for data injection
    const dataElement = `<tr><td>${item.id}</td><td>${item.name}</td><td>Rs. ${item.price}.00</td><td>${item.qty}</td></tr>`;
    $("#item-table-body").append(dataElement);
  });
};

// **Wrap initialization and event listeners inside document ready**
$(document).ready(function () {
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
  });

  // **Load the table immediately when the document is ready**
  loadTable();
});

// Since loadTable is used only within the module, it does not need to be exported.
// However, if other controllers or parts of the application need to trigger a reload, you should export it.
// For now, let's assume it's only needed internally.

// You might consider exporting loadTable if you want other controllers (e.g., OrderController)
// to be able to trigger a refresh of the Item table after an operation.
export { loadTable };
