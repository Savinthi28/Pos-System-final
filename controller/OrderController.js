import Order from "../model/Order.js";
import { order_array } from "../db/DB.js";

const cleanForm = () => {
  $("#order-id").val("");
  $("#order-date").val("");
  $("#order-qty").val("");
  $("#order-customer-id").val("");
  $("#order-total").val("");
  $("#edit-order-index").val("");
};

const loadTable = () => {
  $("#order-table-body").empty();
  order_array.forEach((order, index) => {
    const dataElement = `
      <tr>
        <td>${order.id}</td>
        <td>${order.customer_id}</td>
        <td>${order.qty}</td>
        <td>${order.total}</td>
        <td>${order.date}</td>
        <td>
          <button class="btn btn-danger btn-delete-order" data-index="${index}">Delete</button>
        </td>
      </tr>`;
    $("#order-table-body").append(dataElement);
  });
};

loadTable();

$("#btn-order-save").on("click", (e) => {
  e.preventDefault();

  const order_id = $("#order-id").val();
  const order_date = $("#order-date").val();
  const order_qty = $("#order-qty").val();
  const customer_id = $("#order-customer-id").val();
  const total = $("#order-total").val();
  const editIndex = $("#edit-order-index").val();

  if (!order_id || !order_date || !order_qty || !customer_id || !total) {
    console.error("All fields must be required !");
    return;
  }

  const order = new Order(order_id, customer_id, order_qty, total, order_date);

  if (editIndex === "") {
    if (order_array.some((i) => i.id === order_id)) {
      console.error(`Duplicate ID Error: Order ID ${order_id} already exists!`);
      return;
    }
    order_array.push(order);
  } else {
    order_array[editIndex] = order;
  }

  loadTable();
  cleanForm();

  const modalEl = document.getElementById("order-form-modal");
  if (typeof bootstrap !== "undefined" && modalEl) {
    const modal = bootstrap.Modal.getInstance(modalEl);
    if (modal) {
      modal.hide();
    }
  }
});

$("#order-table-body").on("click", ".btn-delete-order", function () {
  const index = $(this).data("index");

  if (confirm("Are you sure you want to delete this order?")) {
    order_array.splice(index, 1);
    loadTable();
  }
});

$("#btn-order-modal-open").on("click", function () {
  $("#order-modal-title").text("Add Order");
  $("#edit-order-index").val("");
  cleanForm();
  const modalEl = document.getElementById("order-form-modal");
  if (typeof bootstrap !== "undefined" && modalEl) {
    const modal = new bootstrap.Modal(modalEl);
    modal.show();
  }
});
