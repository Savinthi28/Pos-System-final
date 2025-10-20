import Order from "../model/Order.js";
// customer_array එකත් import කරගන්න ඕන
import { order_array, customer_array } from "../db/DB.js";

const cleanForm = () => {
  $("#order-id").val("");
  $("#order-date").val("");
  $("#order-qty").val("");
  $("#order-customer-id").val("");
  $("#order-total").val("");
  $("#edit-order-index").val("");
  $("#customer-name-display").text(""); // Name display එකත් clear කරයි
};

const loadTable = () => {
  $("#order-table-body").empty();
  order_array.forEach((order, index) => {
    // Customer ID එකට අදාළ Customer Name එක සොයා ගැනීම
    const customer = customer_array.find((c) => c.id === order.customer_id);
    const customerName = customer ? customer.name : "Unknown Customer";

    const dataElement = `
      <tr>
        <td>${order.id}</td>
        <td>${customerName}</td> 
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

// Contact Number එක ඇතුළු කරන විට Customer Name එක පෙන්වීමට
$("#order-customer-id").on("keyup", function () {
  const contactNumber = $(this).val().trim();
  const customerNameDisplay = $("#customer-name-display");

  // customer_array එකෙන් දුරකථන අංකයට අදාළ customer සොයා ගැනීම
  const customer = customer_array.find((c) => c.contact === contactNumber);

  if (customer) {
    // customer සොයා ගත්තොත් නම පෙන්වීම
    customerNameDisplay
      .text(`Customer: ${customer.name} (ID: ${customer.id})`)
      .removeClass("text-danger")
      .addClass("text-success fw-bold");
  } else {
    // customer සොයා නොගත්තොත්
    customerNameDisplay
      .text("Customer not found")
      .removeClass("text-success fw-bold")
      .addClass("text-danger");
  }
});

$("#btn-order-save").on("click", (e) => {
  e.preventDefault();

  const order_id = $("#order-id").val();
  const order_date = $("#order-date").val();
  const order_qty = $("#order-qty").val();
  const order_customer_contact = $("#order-customer-id").val(); // Contact Number එක ගන්න
  const total = $("#order-total").val();
  const editIndex = $("#edit-order-index").val();

  if (
    !order_id ||
    !order_date ||
    !order_qty ||
    !order_customer_contact ||
    !total
  ) {
    console.error("All fields must be required !");
    alert("සියලුම ක්ෂේත්‍ර පිරවිය යුතුය!");
    return;
  }

  // Contact Number එකට අදාළ Customer සොයා ගැනීම
  const customer = customer_array.find(
    (c) => c.contact === order_customer_contact
  );

  if (!customer) {
    console.error(
      `Customer with contact number ${order_customer_contact} not found!`
    );
    alert("Error: මෙම දුරකථන අංකයට අදාළ පාරිභෝගිකයෙක් හමු නොවීය!");
    return;
  }

  // Customer ID එක Order එකට ඇතුළත් කිරීම
  const customer_id = customer.id;

  const order = new Order(order_id, customer_id, order_qty, total, order_date);

  if (editIndex === "") {
    if (order_array.some((i) => i.id === order_id)) {
      console.error(`Duplicate ID Error: Order ID ${order_id} already exists!`);
      alert(`Error: Order ID ${order_id} දැනටමත් පවතී!`);
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
