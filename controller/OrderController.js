import Order from "../model/Order.js";

import { order_array, customer_array, item_array } from "../db/DB.js";

let cart_array = [];

const loadPastOrdersTable = () => {
  $("#order-table-body").empty();
  order_array.forEach((order, index) => {
    const customer = customer_array.find((c) => c.id === order.customer_id);
    const customerName = customer ? customer.name : "Unknown Customer";

    const dataElement = `
      <tr>
        <td>${order.id}</td>
        <td>${customerName}</td> 
        <td>${order.item_name}</td> 
        <td>${order.qty}</td>
        <td>${parseFloat(order.total).toFixed(2)}</td> 
        <td>${order.date}</td>
        <td>
          <button class="btn btn-danger btn-sm btn-delete-order" data-index="${index}"><i class="bi bi-trash"></i> Delete</button>
        </td>
      </tr>`;
    $("#order-table-body").append(dataElement);
  });
};

export const loadItemNames = () => {
  $("#order-item-name").empty();
  $("#order-item-name").append(
    '<option value="" disabled selected>Select an Item</option>'
  );
  if (item_array && item_array.length > 0) {
    item_array.forEach((item) => {
      $("#order-item-name").append(
        `<option value="${item.id}">${item.name}</option>`
      );
    });
  }
};

const loadCartTable = () => {
  $("#cart-table-body").empty();
  let grandTotal = 0;

  if (cart_array.length === 0) {
    $("#cart-table-body").append(
      '<tr><td colspan="5" class="text-center text-muted">No Items in Cart</td></tr>'
    );
    $("#btn-place-order").prop("disabled", true);
  } else {
    cart_array.forEach((cartItem, index) => {
      const subTotal = cartItem.price * cartItem.qty;
      grandTotal += subTotal;

      const dataElement = `
            <tr>
                <td>${cartItem.name}</td>
                <td>${parseFloat(cartItem.price).toFixed(2)}</td>
                <td>${cartItem.qty}</td>
                <td>${subTotal.toFixed(2)}</td>
                <td>
                    <button class="btn btn-sm btn-danger btn-remove-cart-item" data-index="${index}">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            </tr>`;
      $("#cart-table-body").append(dataElement);
    });
    $("#btn-place-order").prop("disabled", false);
  }

  $("#order-total-display").val(`Rs. ${grandTotal.toFixed(2)}`);
};

const resetCartAndItemForm = () => {
  cart_array = [];
  $("#order-item-name").val("");
  $("#order-qty").val("1");
  $("#selected-item-info").val("");
  $("#item-sub-total").text("0.00");
  $("#btn-add-to-cart").prop("disabled", true);
  loadCartTable();
};

const cleanOrderForm = () => {
  $("#order-id").val("");
  $("#order-customer-contact").val("");
  $("#customer-name-display").text("").addClass("text-muted");
  setDateToCurrent();
};

const setDateToCurrent = () => {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  const formattedDate = `${yyyy}-${mm}-${dd}`;
  $("#order-date").val(formattedDate);
};

$(document).ready(function () {
  setDateToCurrent();
  loadPastOrdersTable();
  loadItemNames();
  cleanOrderForm();
  loadCartTable();
});

$("#order-customer-contact").on("keyup", function () {
  const contactNumber = $(this).val().trim();
  const customerNameDisplay = $("#customer-name-display");

  const customer = customer_array.find((c) => c.contact === contactNumber);

  if (customer) {
    customerNameDisplay
      .text(`Customer: ${customer.name} (ID: ${customer.id})`)
      .removeClass("text-danger text-muted")
      .addClass("text-success fw-bold");
  } else {
    customerNameDisplay
      .text("Customer not found")
      .removeClass("text-success fw-bold text-muted")
      .addClass("text-danger");
  }
});

$("#order-item-name").on("change", function () {
  const selectedItemId = $(this).val();
  const quantity = parseFloat($("#order-qty").val()) || 1;
  const selectedItem = item_array.find((item) => item.id === selectedItemId);

  if (selectedItem) {
    $("#selected-item-info").val(
      `ID: ${selectedItem.id} | Price: Rs. ${parseFloat(
        selectedItem.price
      ).toFixed(2)} | Qty on Hand: ${selectedItem.qty}`
    );

    const subTotal = selectedItem.price * quantity;
    $("#item-sub-total").text(subTotal.toFixed(2));
    $("#btn-add-to-cart").prop("disabled", false);
  } else {
    $("#selected-item-info").val("Item not found");
    $("#item-sub-total").text("0.00");
    $("#btn-add-to-cart").prop("disabled", true);
  }
});

$("#order-qty").on("keyup change", function () {
  const selectedItemId = $("#order-item-name").val();
  const quantity = parseFloat($(this).val()) || 0;

  if (selectedItemId && quantity > 0) {
    const selectedItem = item_array.find((item) => item.id === selectedItemId);
    if (selectedItem) {
      const subTotal = selectedItem.price * quantity;
      $("#item-sub-total").text(subTotal.toFixed(2));
      $("#btn-add-to-cart").prop("disabled", false);
      return;
    }
  }

  $("#item-sub-total").text("0.00");
  $("#btn-add-to-cart").prop("disabled", true);
});

$("#btn-add-to-cart").on("click", () => {
  const item_id = $("#order-item-name").val();
  const qty = parseInt($("#order-qty").val());

  if (!item_id || isNaN(qty) || qty <= 0) {
    alert("කරුණාකර නිවැරදි Item එකක් සහ Quantity එකක් තෝරන්න.");
    return;
  }

  const selectedItem = item_array.find((item) => item.id === item_id);
  if (!selectedItem) {
    alert("Item එක සොයාගත නොහැක.");
    return;
  }

  const existingCartItem = cart_array.find((i) => i.id === item_id);
  const currentCartQty = existingCartItem ? existingCartItem.qty : 0;
  const newTotalQty = currentCartQty + qty;

  if (newTotalQty > selectedItem.qty) {
    alert(
      `Error: තොගයේ ඇත්තේ ${selectedItem.qty} ක් පමණි. Cart එකේ දැනටමත් ${currentCartQty} ක් ඇත. තවත් ${qty} ක් එකතු කළ නොහැක!`
    );
    return;
  }

  if (existingCartItem) {
    existingCartItem.qty += qty;
  } else {
    cart_array.push({
      id: selectedItem.id,
      name: selectedItem.name,
      price: selectedItem.price,
      qty: qty,
    });
  }

  loadCartTable();

  $("#order-item-name").val("");
  $("#order-qty").val("1");
  $("#selected-item-info").val("");
  $("#item-sub-total").text("0.00");
  $("#btn-add-to-cart").prop("disabled", true);
});

$("#cart-table-body").on("click", ".btn-remove-cart-item", function () {
  const index = $(this).data("index");

  if (confirm("do you need to remove this item from the cart?")) {
    cart_array.splice(index, 1);
    loadCartTable();
  }
});

$("#btn-place-order").on("click", () => {
  const order_id = $("#order-id").val();
  const order_date = $("#order-date").val();
  const order_customer_contact = $("#order-customer-contact").val();
  const grandTotal = parseFloat(
    $("#order-total-display").val().replace("Rs. ", "")
  );

  if (!order_id || !order_date || !order_customer_contact) {
    alert("Order ID, Date, and Customer Contact Number cant be empty!");
    return;
  }

  if (cart_array.length === 0) {
    alert("Add items !");
    return;
  }

  const customer = customer_array.find(
    (c) => c.contact === order_customer_contact
  );
  if (!customer) {
    alert("Error: not match to any number !");
    return;
  }
  const customer_id = customer.id;

  if (order_array.some((i) => i.id === order_id)) {
    alert(`Error: Order ID ${order_id} already exist`);
    return;
  }

  const newOrders = [];

  for (const cartItem of cart_array) {
    const item = item_array.find((i) => i.id === cartItem.id);
    item.qty -= cartItem.qty;

    const itemSubTotal = cartItem.price * cartItem.qty;

    const order = new Order(
      order_id,
      customer_id,
      cartItem.id,
      cartItem.name,
      cartItem.qty,
      itemSubTotal,
      order_date
    );
    newOrders.push(order);
  }

  order_array.push(...newOrders);

  alert(
    `Order ${order_id} placed successfully ! Total: Rs. ${grandTotal.toFixed(
      2
    )}`
  );

  loadPastOrdersTable();
  resetCartAndItemForm();
  cleanOrderForm();
  loadItemNames();

  $("#selected-item-info").val("");
});

$("#order-table-body").on("click", ".btn-delete-order", function () {
  const index = $(this).data("index");
  const deletedOrder = order_array[index];
  const item_id = deletedOrder.item_id;
  const deletedQty = parseInt(deletedOrder.qty);

  if (confirm(`Order ID ${deletedOrder.id} need to delete?`)) {
    const item = item_array.find((i) => i.id === item_id);
    if (item) {
      item.qty += deletedQty;
      console.log(
        `Stock Restored: Item ${item.id} Qty on Hand increased to ${item.qty} after deletion`
      );
    }

    order_array.splice(index, 1);
    loadPastOrdersTable();

    const currentSelectedItemId = $("#order-item-name").val();
    if (currentSelectedItemId === item_id) {
      $("#order-item-name").trigger("change");
    }
  }
});
