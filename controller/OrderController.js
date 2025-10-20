import { order_array } from "../db/DB.js";
import Item from "../model/Item.js";

const cleanForm = () => {
  $("#order-id").val("");
  $("#order-date").val("");
  $("#order-qty").val("");
  $("order-customer-id").val("");
  $("order-total").val("");
};

const loadTable = () => {
  $("order-table-body").empty();
  order_array.forEach((order, index) => {
    const dataElement = `
      <tr>
      <td>${order.id}</td>
      <td>${order.customer - id}</td>
      <td>${order.order - qty}</td>
      <td>${customer.total}</td>
      <td>${order.order - date}</td>
      <td>
        <button class="btn btn-danger btn-delete" data-index="${index}">Delete</button>
      </td>
    </tr>`;
    $("order-table-body").append(dataElement);
  });
};

$("btn-order-save").on("click", (e) => {
  e.preventDefault();

  const order_id = $("#order-id").val();
  const order_date = $("#order-date").val();
  const order_qty = $("#order-qty").val();
  const customer_id = $("#order-customer-id").val();
  const toal = $("#order-total").val();
  const editIndex = $("#edit-index").val();

  if (!order_id || !order_date || !order_qty || !customer_id || !toal) {
    console.error("All fields must be required !");
    return;
  }

  const order = new order(order_id, order_date, order_qty, customer_id, toal);

  if (editIndex === "") {
    if (order_array.some((i) => i.id === order_id)) {
      console.error(`Duplicate ID Error: Item ID ${order_id} already exists!`);
      return;
    }
    order_array.push(order);
  } else {
    order_array[editIndex] = order;
  }
  loadTable();
  cleanForm();
  const modalEl = document.getElementById("#order-form-modal");
  if (typeof bootstrap !== "undefined" && modalEl) {
    const modal = bootstrap.Modal.getInstance(modalEl);
    if (modal) {
      modal.hide();
    }
  }
});
