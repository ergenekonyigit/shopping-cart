module.exports = class Product {
  constructor(props) {
    this.title = props.title;
    this.price = props.price;
    this.category = props.category || null;
  }
}
