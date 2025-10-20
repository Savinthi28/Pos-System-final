import Order from "../model/Order.js";
// item_array සහ customer_array දෙකම DB.js එකෙන් import කර ඇත
import { order_array, customer_array, item_array } from "../db/DB.js";

// Item ComboBox එකට data load කරන function එක
const loadItemNames = () => {
  $("#order-item-name").empty();
  $("#order-item-name").append(
    '<option value="" disabled selected>Select an Item</option>'
  );
  item_array.forEach((item) => {
    // Option Value එක ලෙස Item ID එක යොදයි
    $("#order-item-name").append(
      `<option value="${item.id}">${item.name}</option>`
    );
  });
};

const cleanForm = () => {
  $("#order-id").val("");
  $("#order-date").val("");
  $("#order-qty").val("");
  $("#order-customer-id").val("");
  $("#order-total").val("");
  $("#edit-order-index").val("");
  $("#customer-name-display").text(""); // Customer Name display එකත් clear කරයි
  $("#order-item-name").val(""); // Item select box එකත් clear කරයි
  $("#selected-item-info").val(""); // Item Info එකත් clear කරයි
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
        <td>${customerName}</td> <td>${order.item_name}</td> <td>${order.qty}</td>
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

// Customer Contact Number එක ඇතුළු කරන විට Customer Name එක පෙන්වීමට
$("#order-customer-id").on("keyup", function () {
  const contactNumber = $(this).val().trim();
  const customerNameDisplay = $("#customer-name-display");

  // customer_array එකෙන් දුරකථන අංකයට අදාළ customer සොයා ගැනීම
  const customer = customer_array.find((c) => c.contact === contactNumber);

  if (customer) {
    // customer සොයා ගත්තොත් නම පෙන්වීම
    customerNameDisplay
      .text(`Customer: ${customer.name} (ID: ${customer.id})`)
      .removeClass("text-danger text-muted")
      .addClass("text-success fw-bold");
  } else {
    // customer සොයා නොගත්තොත්
    customerNameDisplay
      .text("Customer not found")
      .removeClass("text-success fw-bold text-muted")
      .addClass("text-danger");
  }
});

// Item Name එක Select කළ විට එහි විස්තර පෙන්වීමට
$("#order-item-name").on("change", function () {
  const selectedItemId = $(this).val();
  const selectedItem = item_array.find((item) => item.id === selectedItemId);

  if (selectedItem) {
    $("#selected-item-info").val(
      `ID: ${selectedItem.id} | Price: Rs. ${selectedItem.price} | Qty on Hand: ${selectedItem.qty}`
    );
  } else {
    $("#selected-item-info").val("Item not found");
  }
});

$("#btn-order-save").on("click", (e) => {
  e.preventDefault();

  const order_id = $("#order-id").val();
  const order_date = $("#order-date").val();
  const order_qty = $("#order-qty").val();
  const order_customer_contact = $("#order-customer-id").val();
  const total = $("#order-total").val();
  const editIndex = $("#edit-order-index").val();

  const item_id = $("#order-item-name").val(); // තෝරාගත් Item ID එක

  if (
    !order_id ||
    !order_date ||
    !order_qty ||
    !order_customer_contact ||
    !total ||
    !item_id
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

  const customer_id = customer.id;

  // Item Details සොයා ගැනීම
  const selectedItem = item_array.find((item) => item.id === item_id);
  const item_name = selectedItem ? selectedItem.name : "N/A";

  // Order Model එකට Item ID සහ Item Name එකතු කරයි
  const order = new Order(
    order_id,
    customer_id,
    item_id,
    item_name,
    order_qty,
    total,
    order_date
  );

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
  loadItemNames(); // Modal එක open කරන විට Item names load කරයි
  const modalEl = document.getElementById("order-form-modal");
  if (typeof bootstrap !== "undefined" && modalEl) {
    const modal = new bootstrap.Modal(modalEl);
    modal.show();
  }
});
