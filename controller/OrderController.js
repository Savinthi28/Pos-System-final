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
        <td>${customerName}</td> <td>${order.item_name}</td> <td>${
      order.qty
    }</td>
        <td>${parseFloat(order.total).toFixed(2)}</td> 
        <td>${order.date}</td>
        <td>
          <button class="btn btn-danger btn-delete-order" data-index="${index}">Delete</button>
        </td>
      </tr>`;
    $("#order-table-body").append(dataElement);
  });
};

loadTable();

// Total එක ගණනය කිරීමේ ශ්‍රිතය
const calculateTotal = () => {
  const selectedItemId = $("#order-item-name").val();
  const quantity = parseFloat($("#order-qty").val()) || 0; // ප්‍රමාණය, නොමැතිනම් 0
  const totalDisplay = $("#order-total");

  if (selectedItemId && quantity > 0) {
    const selectedItem = item_array.find((item) => item.id === selectedItemId);
    if (selectedItem) {
      const price = selectedItem.price;
      const total = price * quantity;
      // Total එක දශම ස්ථාන දෙකකට සීමා කර පෙන්වයි
      totalDisplay.val(total.toFixed(2));
    } else {
      totalDisplay.val("Error: Item not found");
    }
  } else {
    totalDisplay.val("0.00"); // Item හෝ Quantity නොමැතිනම් 0.00 ලෙස සකසයි
  }
};

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
      `ID: ${selectedItem.id} | Price: Rs. ${parseFloat(
        selectedItem.price
      ).toFixed(2)} | Qty on Hand: ${selectedItem.qty}`
    );
    // Item එක තේරූ විට Total එක ගණනය කරයි
    calculateTotal();
  } else {
    $("#selected-item-info").val("Item not found");
    $("#order-total").val("0.00");
  }
});

// Quantity එක වෙනස් කරන විට Total එක ගණනය කරයි
$("#order-qty").on("keyup change", function () {
  calculateTotal();
});

// --------------------------------------------------------------------------------

$("#btn-order-save").on("click", (e) => {
  e.preventDefault();

  const order_id = $("#order-id").val();
  const order_date = $("#order-date").val();
  // Quantity එක Integer ලෙස ලබා ගැනීම
  const order_qty = parseInt($("#order-qty").val());
  const order_customer_contact = $("#order-customer-id").val();
  const total = $("#order-total").val();
  const editIndex = $("#edit-order-index").val();

  const item_id = $("#order-item-name").val(); // තෝරාගත් Item ID එක

  if (
    !order_id ||
    !order_date ||
    isNaN(order_qty) || // Number validation
    !order_customer_contact ||
    !total ||
    !item_id
  ) {
    console.error("All fields must be required !");
    alert("සියලුම ක්ෂේත්‍ර පිරවිය යුතුය!");
    return;
  }

  // Quantity එක ධන අගයක් දැයි පරීක්ෂා කිරීම
  if (order_qty <= 0) {
    alert("ප්‍රමාණය (Quantity) ධන අගයක් විය යුතුය!");
    return;
  }

  // Contact Number එකට අදාළ Customer සොයා ගැනීම
  const customer = customer_array.find(
    (c) => c.contact === order_customer_contact
  );

  if (!customer) {
    alert("Error: මෙම දුරකථන අංකයට අදාළ පාරිභෝගිකයෙක් හමු නොවීය!");
    return;
  }
  const customer_id = customer.id;

  // Item Details සොයා ගැනීම
  const selectedItem = item_array.find((item) => item.id === item_id);
  if (!selectedItem) {
    alert("Error: තෝරාගත් Item එක සොයා ගත නොහැක!");
    return;
  }
  const item_name = selectedItem.name;

  // Stock Deduction තර්කනය
  if (editIndex === "") {
    // නව Order එකක් Save කිරීම

    // 1. තොගයේ ප්‍රමාණවත්දැයි පරීක්ෂා කිරීම (Stock Check)
    if (order_qty > selectedItem.qty) {
      alert(
        `Error: තොගයේ ඇත්තේ ${selectedItem.qty} ක් පමණි. ${order_qty} ක් ඇණවුම් කළ නොහැක!`
      );
      return;
    }

    // 2. තොගයෙන් අදාළ ප්‍රමාණය අඩු කිරීම
    selectedItem.qty -= order_qty;
  } else {
    // පවතින Order එකක් Update කිරීම

    const oldOrder = order_array[editIndex];
    const oldQty = parseInt(oldOrder.qty);

    // 1. පැරණි Qty එක නැවත තොගයට එකතු කිරීම
    selectedItem.qty += oldQty;

    // 2. නව Qty එක තොගයේ ප්‍රමාණවත්දැයි පරීක්ෂා කිරීම
    if (order_qty > selectedItem.qty) {
      // අසාර්ථක වූ නිසා Stock නැවත යථා තත්ත්වයට පත් කරයි
      selectedItem.qty -= oldQty;
      alert(
        `Error: යාවත්කාලීන කිරීමට තොගයේ ඇත්තේ ${selectedItem.qty} ක් පමණි. ${order_qty} ක් ඇණවුම් කළ නොහැක!`
      );
      return;
    }

    // 3. නව Qty එක තොගයෙන් අඩු කිරීම
    selectedItem.qty -= order_qty;
  }

  // Order Model එකට Customer ID සහ Item Name නිවැරදිව යවනු ලබයි
  const order = new Order(
    order_id,
    customer_id, // මෙහි customer_id යවනු ලබයි
    item_id,
    item_name,
    order_qty,
    total,
    order_date
  );

  if (editIndex === "") {
    if (order_array.some((i) => i.id === order_id)) {
      // අසාර්ථක වූවොත් Stock එක නැවත එකතු කළ යුතුය (Rollback)
      selectedItem.qty += order_qty;
      console.error(`Duplicate ID Error: Order ID ${order_id} already exists!`);
      alert(`Error: Order ID ${order_id} දැනටමත් පවතී!`);
      return;
    }
    order_array.push(order);
  } else {
    order_array[editIndex] = order;
  }

  // Stock වෙනස් වූ නිසා Item Info එක update කිරීම
  $("#selected-item-info").val(
    `ID: ${selectedItem.id} | Price: Rs. ${parseFloat(
      selectedItem.price
    ).toFixed(2)} | Qty on Hand: ${selectedItem.qty}`
  );

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

// Order Delete කරන විට තොගය නැවත එකතු කිරීම
$("#order-table-body").on("click", ".btn-delete-order", function () {
  const index = $(this).data("index");
  const deletedOrder = order_array[index];
  const item_id = deletedOrder.item_id;
  // Quantity එක Integer ලෙස ලබා ගැනීම
  const deletedQty = parseInt(deletedOrder.qty);

  if (confirm("Are you sure you want to delete this order?")) {
    // තොගයට නැවත ප්‍රමාණය එකතු කිරීම
    const item = item_array.find((i) => i.id === item_id);
    if (item) {
      item.qty += deletedQty;
      console.log(
        `Stock Restored: Item ${item.id} Qty on Hand increased to ${item.qty} after deletion`
      );
    }

    order_array.splice(index, 1);
    loadTable();
  }
});

// --------------------------------------------------------------------------------
// 💡 Order Modal Open කරන විට Current Date එක Set කිරීම
// --------------------------------------------------------------------------------
$("#btn-order-modal-open").on("click", function () {
  $("#order-modal-title").text("Add Order");
  $("#edit-order-index").val("");
  cleanForm();
  loadItemNames(); // Modal එක open කරන විට Item names load කරයි

  // 💡 Current Date එක ලබා ගැනීම (YYYY-MM-DD format)
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0"); // Month is 0-indexed
  const dd = String(today.getDate()).padStart(2, "0");
  const formattedDate = `${yyyy}-${mm}-${dd}`;

  // 💡 Date Field එකට අද දිනය Set කිරීම
  $("#order-date").val(formattedDate);

  const modalEl = document.getElementById("order-form-modal");
  if (typeof bootstrap !== "undefined" && modalEl) {
    // Modal එකක් නොමැතිනම් පමණක් අලුතින් සාදන්න.
    let modal = bootstrap.Modal.getInstance(modalEl);
    if (!modal) {
      modal = new bootstrap.Modal(modalEl);
    }
    modal.show();
  }
});
