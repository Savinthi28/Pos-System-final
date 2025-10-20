export default class Order {
  constructor(id, customer_id, qty, total, date) {
    this._id = id;
    this._customer_id = customer_id;
    this._qty = qty;
    this._total = total;
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
    this._qty = qty;
  }

  get customer_id() {
    return this._customer_id;
  }

  set customer_id(customer_id) {
    this._customer_id = customer_id;
  }

  get total() {
    return this._total;
  }

  set total(total) {
    this._total = total;
  }
}
