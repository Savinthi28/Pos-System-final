export default class Order {
  constructor(id, customer_id, item_id, item_name, qty, total, date) {
    this._id = id;
    this._customer_id = customer_id;
    this._item_id = item_id;
    this._item_name = item_name;
    this._qty = parseInt(qty);
    this._total = parseFloat(total);
    this._date = date;
  }

  get id() {
    return this._id;
  }

  set id(id) {
    this._id = id;
  }

  get date() {
    return this._date;
  }

  set date(date) {
    this._date = date;
  }

  get qty() {
    return this._qty;
  }

  set qty(qty) {
    this._qty = parseInt(qty);
  }

  get customer_id() {
    return this._customer_id;
  }

  set customer_id(customer_id) {
    this._customer_id = customer_id;
  }

  get item_id() {
    return this._item_id;
  }

  set item_id(item_id) {
    this._item_id = item_id;
  }

  get item_name() {
    return this._item_name;
  }

  set item_name(item_name) {
    this._item_name = item_name;
  }

  get total() {
    return this._total;
  }

  set total(total) {
    this._total = parseFloat(total);
  }
}
