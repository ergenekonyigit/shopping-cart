module.exports = class DeliveryCostCalculator {
  constructor(props) {
    this.costPerDelivery = props.costPerDelivery;
    this.costPerProduct = props.costPerProduct;
    this.fixedCost = props.fixedCost || 2.99;
  }

  numberOfDeliveries(cart) {
    return [...new Set(cart.products.map(val => val.category.title))].length;
  }

  calculateFor(cart) {
    return (this.costPerDelivery * this.numberOfDeliveries(cart))
            + (this.costPerProduct * this.numberOfDeliveries(cart))
            + this.fixedCost;
  }
}
