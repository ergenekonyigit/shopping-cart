const Category = require('../src/Category');
const Product = require('../src/Product');
const Campaign = require('../src/Campaign');
const Coupon = require('../src/Coupon');
const DeliveryCostCalculator = require('../src/DeliveryCostCalculator');
const ShoppingCart = require('../src/ShoppingCart');

const DiscountType = { Rate: 'Rate', Amount: 'Amount' };

const foodCategory = new Category({ title: 'Food' });
const waterCategory = new Category({ title: 'Water', parentCategory: foodCategory.title });
const clothesCategory = new Category({ title: 'Clothes' });

const foodCampaign = new Campaign({
  category: foodCategory.title,
  discount: 20.0,
  minCount: 3,
  discountType: DiscountType.Rate
});
const waterCampaign = new Campaign({
  category: waterCategory.title,
  discount: 5.0,
  minCount: 5,
  discountType: DiscountType.Amount
});

foodCategory.addCampaign(foodCampaign);
waterCategory.addCampaign(waterCampaign);

const oliveOil = new Product({ title: 'Olive Oil', price: 50.0, category: foodCategory });
const water = new Product({ title: 'Pinar Water', price: 5.25, category: waterCategory });
const tshirt = new Product({ title: 'T-Shirt', price: 25.0, category: clothesCategory });

const cart = new ShoppingCart();
cart.addItem({ product: oliveOil, quantitiy: 3 });
cart.addItem({ product: water, quantitiy: 2 });
cart.addItem({ product: tshirt, quantitiy: 1 });

const coupon = new Coupon({ minPrice: 100.0, discount: 10.0, discountType: DiscountType.Rate });

cart.applyCoupon(coupon);
cart.applyDiscounts([foodCampaign, waterCampaign]);

cart.print();
