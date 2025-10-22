import { customer_array } from "../db/DB.js";
import Customer from "../model/Customer.js";

const cleanForm = () => {
  $("#customer-id").val("");
  $("#customer-name").val("");
  $("#customer-address").val("");
  $("#customer-contact").val("");
};

const loadTable = () => {
  $("#customer-table-body").empty();
  customer_array.forEach((customer, index) => {
    const dataElement = `
    <tr>
      <td>${customer.id}</td>
      <td>${customer.name}</td>
      <td>${customer.address}</td>
      <td>${customer.contact}</td>
      <td>
             <button class="btn btn-warning btn-sm btn-edit" data-index="${index}"><i class="bi bi-pencil-square"></i> Edit</button>
        <button class="btn btn-danger btn-sm btn-delete" data-index="${index}"><i class="bi bi-trash"></i> Delete</button>
      </td>
    </tr>`;

    $("#customer-table-body").append(dataElement);
  });
};

$(document).on("click", ".btn-delete", function () {
  const index = $(this).data("index");

  const res = confirm(`Are you sure you want to delete ?`);
  if (res) {
    customer_array.splice(index, 1);
    loadTable();
  }
});

$(document).on("click", ".btn-edit", function () {
  const index = $(this).data("index");

  const customer = customer_array[index];

  $("#customer-modal-title").text("Edit Customer");
  $("#customer-id").val(customer.id);
  $("#customer-name").val(customer.name);
  $("#customer-address").val(customer.address);
  $("#customer-contact").val(customer.contact);
  $("#edit-index").val(index);
  $("#btn-customer-save").text("Update");

  const modalEl = document.getElementById("customer-form-modal");
  const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
  modal.show();
});

$("#btn-customer-modal-open").click(() => {
  $("#customer-modal-title").text("Add Customer");
  $("#edit-index").val("");
  $("#btn-customer-save").text("Save");

  cleanForm();

  const modalEl = document.getElementById("customer-form-modal");
  const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
  modal.show();
});

$("#btn-customer-save").on("click", (e) => {
  e.preventDefault();

  const customer_id = $("#customer-id").val();
  const customer_name = $("#customer-name").val();
  const customer_address = $("#customer-address").val();
  const customer_contact = $("#customer-contact").val();

  if (
    !customer_id ||
    !customer_name ||
    !customer_address ||
    !customer_contact
  ) {
    alert("All field required..!");
    return;
  }

  const cusromer = new Customer(
    customer_id,
    customer_name,
    customer_address,
    customer_contact
  );

  const editIndex = $("#edit-index").val();
  if (editIndex === "") {
    customer_array.push(cusromer);
  } else {
    customer_array[editIndex] = cusromer;
  }

  loadTable();
  cleanForm();

  const modalEl = document.getElementById("customer-form-modal");
  const modal = bootstrap.Modal.getInstance(modalEl);
  modal.hide();
});

loadTable();
