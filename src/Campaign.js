module.exports = class Campaign {
  constructor(props) {
    this.category = props.category;
    this.discount = props.discount;
    this.minCount = props.minCount;
    this.discountType = props.discountType;
  }
}
