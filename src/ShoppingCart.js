const DeliveryCostCalculator = require('./DeliveryCostCalculator');
const util = require('./util');

module.exports = class ShoppingCart {
  constructor() {
    this.products = [];
    this.cartTotalPrice = 0;
    this.couponDiscountPrice = 0;
  }

  get getCartTotalPrice() {
    return this.cartTotalPrice;
  }

  set setCartTotalPrice(newCartTotalPrice) {
    this.cartTotalPrice = newCartTotalPrice;
  }

  get getCouponDiscountPrice() {
    return this.couponDiscountPrice;
  }

  set setCartTotalPriceWithCoupon(newCartTotalPriceWithCoupon) {
    this.couponDiscountPrice = newCartTotalPriceWithCoupon;
  }

  calcTotalPrice(totalPrice, product) {
    return totalPrice + (product.quantitiy * product.price);
  }

  addItem({ product, quantitiy }) {
    product.quantitiy = quantitiy;
    product.isDiscountApplied = false;
    product.discountPrice = 0
    this.products.push(product);
    this.setCartTotalPrice = this.calcTotalPrice(this.getCartTotalPrice, product);
  }

  calcDiscountRate(price, discount) {
    return (price / 100 * discount * -1);
  }

  applyDiscounts(args) {
    args.map(arg => {
      this.products.find(product => {
        if ((product.category.title === arg.category) && (product.quantitiy >= arg.minCount)) {
          product.isDiscountApplied = true;
          if (product.category.campaign.discountType === 'Rate') {
            product.discountPrice = this.calcDiscountRate((product.price * product.quantitiy), arg.discount);
          } else {
            product.discountPrice = arg.discount * -1;
          }
        }
      });
    });
    return args;
  }

  applyCoupon(coupon) {
    if (this.getCartTotalPrice < coupon.minPrice) return;

    if (coupon.discountType === 'Rate') {
      this.setCartTotalPriceWithCoupon = this.calcDiscountRate(this.getCartTotalPrice, coupon.discount);
    } else {
      this.setCartTotalPriceWithCoupon = coupon.discount * -1;
    }
  }

  getTotalAmountAfterDiscounts() {
    return this.getCartTotalPrice + this.getCampaignDiscount() + this.getCouponDiscount();
  }

  getCouponDiscount() {
    return this.getCouponDiscountPrice;
  }

  getCampaignDiscount() {
    return this.products.reduce((acc, val) => acc + val.discountPrice, 0);
  }

  getDeliveryCost() {
    const deliveryCostCalculator = new DeliveryCostCalculator({ costPerDelivery: 12, costPerProduct: 3 });
    return deliveryCostCalculator.calculateFor(this);
  }

  print() {
    console.log('Shopping Cart');
    this.products.map((product, index) => {
      console.log('\nCategory Name:', product.category.title,
                  '\nProduct Name:', product.title,
                  '\nQuantity:', product.quantitiy,
                  '\nUnit Price:', product.price,
                  '\nTotal Price:', (product.price * product.quantitiy),
                  '\nTotal Discount:', product.discountPrice);
    });
    console.log('\n----------------------------------------------------------------');
    console.log('\nSummary:\n',
                '\nTotal Price:', this.getCartTotalPrice,
                '\nCoupon Discount:', util.reduceDigit(this.getCouponDiscount(), 2),
                '\nTotal Discount', this.getCampaignDiscount(),
                '\nTotal Price After Discounts:', this.getTotalAmountAfterDiscounts(),
                '\nDelivery Cost:', this.getDeliveryCost(),
                '\nTotal with Delivery:', this.getTotalAmountAfterDiscounts() + this.getDeliveryCost());
  }
}
