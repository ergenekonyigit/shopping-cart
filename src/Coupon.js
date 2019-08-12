module.exports = class Coupon {
  constructor(props) {
    this.minPrice = props.minPrice;
    this.discount = props.discount;
    this.discountType = props.discountType;
  }
}
