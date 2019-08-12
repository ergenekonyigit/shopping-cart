const Category = require('../src/Category');
const Product = require('../src/Product');
const Campaign = require('../src/Campaign');
const Coupon = require('../src/Coupon');
const DeliveryCostCalculator = require('../src/DeliveryCostCalculator');
const ShoppingCart = require('../src/ShoppingCart');
const util = require('../src/util');

const DiscountType = { Rate: 'Rate', Amount: 'Amount' };

test('reduce floating point digits', () => {
  const digit = 2;
  const result1 = util.reduceDigit(12.3443020001, digit);
  const expected1 = 12.34;
  expect(result1).toBe(expected1);

  const result2 = util.reduceDigit(12.3463020001, digit);
  const expected2 = 12.35;
  expect(result2).toBe(expected2);
});

test('new category', () => {
  const result = new Category({ title: 'Food' });
  expect(result.title).toBe('Food');
  expect(result.campaign).toBeNull();
});

test('new product', () => {
  const result = new Product({ title: 'Olive Oil', price: 50.0 });
  expect(result.title).toBe('Olive Oil');
  expect(result.price).toBe(50.0);
  expect(result.category).toBeNull();
});

test('product category', () => {
  const foodCategory = new Category({ title: 'Food' });
  const oliveOil = new Product({ title: 'Olive Oil', price: 50.0, category: foodCategory });
  const result = oliveOil.category;
  const expected = foodCategory;
  expect(result).toBe(expected);
});

test('category campaign', () => {
  const foodCategory = new Category({ title: 'Food' });
  const foodCampaign = new Campaign({
    category: foodCategory.title,
    discount: 20.0,
    minCount: 3,
    discountType: DiscountType.Rate
  });
  foodCategory.addCampaign(foodCampaign);
  const result = foodCategory.campaign;
  const expected = foodCampaign;
  expect(result).toBe(expected);
});

const initialShoppingCartData = () => {
  const foodCategory = new Category({ title: 'Food' });
  const foodCampaign = new Campaign({
    category: foodCategory.title,
    discount: 20.0,
    minCount: 3,
    discountType: DiscountType.Rate
  });
  foodCategory.addCampaign(foodCampaign);
  const oliveOil = new Product({ title: 'Olive Oil', price: 50.0, category: foodCategory });
  const cart = new ShoppingCart();
  cart.addItem({ product: oliveOil, quantitiy: 3 });
  return cart;
};

test('shopping cart, add item', () => {
  const cart = initialShoppingCartData();
  const result = cart.products[0].title;
  const expected = 'Olive Oil';
  expect(result).toBe(expected);
});

test('shopping cart, calc total price', () => {
  const cart = initialShoppingCartData();
  const result = cart.calcTotalPrice(cart.cartTotalPrice, { price: 40.0, quantitiy: 2 });
  const expected = 230.0;
  expect(result).toBe(expected);
});

test('shopping cart, total price', () => {
  const cart = initialShoppingCartData();
  const result = cart.cartTotalPrice;
  const expected = 150.0;
  expect(result).toBe(expected);
});

test('shopping cart, calc discount rate', () => {
  const cart = initialShoppingCartData();
  const result = cart.calcDiscountRate(40, 10);
  const expected = -4;
  expect(result).toBe(expected);
});

test('shopping cart, apply coupon rate', () => {
  const cart = initialShoppingCartData();
  const coupon = new Coupon({ minPrice: 100.0, discount: 10.0, discountType: DiscountType.Rate });
  cart.applyCoupon(coupon);
  const result = cart.getTotalAmountAfterDiscounts();
  const expected = 135.0;
  expect(result).toBe(expected);
});

test('shopping cart, apply coupon amount', () => {
  const cart = initialShoppingCartData();
  const coupon = new Coupon({ minPrice: 100.0, discount: 10.0, discountType: DiscountType.Amount });
  cart.applyCoupon(coupon);
  const result = cart.getTotalAmountAfterDiscounts();
  const expected = 140.0;
  expect(result).toBe(expected);
});

test('shopping cart, apply discounts rate', () => {
  const foodCategory = new Category({ title: 'Food' });
  const foodCampaign = new Campaign({
    category: foodCategory.title,
    discount: 20.0,
    minCount: 3,
    discountType: DiscountType.Rate
  });
  foodCategory.addCampaign(foodCampaign);
  const oliveOil = new Product({ title: 'Olive Oil', price: 50.0, category: foodCategory });
  const cart = new ShoppingCart();
  cart.addItem({ product: oliveOil, quantitiy: 3 });
  cart.applyDiscounts([foodCampaign]);
  const result = cart.getTotalAmountAfterDiscounts();
  const expected = 120.0;
  expect(result).toBe(expected);
});

test('shopping cart, apply discounts amount', () => {
  const foodCategory = new Category({ title: 'Food' });
  const foodCampaign = new Campaign({
    category: foodCategory.title,
    discount: 20.0,
    minCount: 3,
    discountType: DiscountType.Amount
  });
  foodCategory.addCampaign(foodCampaign);
  const oliveOil = new Product({ title: 'Olive Oil', price: 50.0, category: foodCategory });
  const cart = new ShoppingCart();
  cart.addItem({ product: oliveOil, quantitiy: 3 });
  cart.applyDiscounts([foodCampaign]);
  const result = cart.getTotalAmountAfterDiscounts();
  const expected = 130.0;
  expect(result).toBe(expected);
});

test('shopping cart, get campaign discount', () => {
  const foodCategory = new Category({ title: 'Food' });
  const waterCategory = new Category({ title: 'Water', parentCategory: foodCategory.title });
  const foodCampaign = new Campaign({
    category: foodCategory.title,
    discount: 20.0,
    minCount: 3,
    discountType: DiscountType.Rate
  });
  const waterCampaign = new Campaign({
    category: waterCategory.title,
    discount: 5.25,
    minCount: 5,
    discountType: DiscountType.Amount
  });
  foodCategory.addCampaign(foodCampaign);
  waterCategory.addCampaign(waterCampaign);
  const oliveOil = new Product({ title: 'Olive Oil', price: 50.0, category: foodCategory });
  const water = new Product({ title: 'Pinar Water', price: 5.25, category: waterCategory });
  const cart = new ShoppingCart();
  cart.addItem({ product: oliveOil, quantitiy: 3 });
  cart.addItem({ product: water, quantitiy: 6 });
  cart.applyDiscounts([foodCampaign, waterCampaign]);
  const result = cart.getCampaignDiscount();
  const expected = -35.25;
  expect(result).toBe(expected);
});

const initialDeliveryCostCalculatorData = () => {
  const foodCategory = new Category({ title: 'Food' });
  const waterCategory = new Category({ title: 'Water', parentCategory: foodCategory.title });
  const oliveOil = new Product({ title: 'Olive Oil', price: 50.0, category: foodCategory });
  const water = new Product({ title: 'Pinar Water', price: 5.25, category: waterCategory });
  const cart = new ShoppingCart();
  cart.addItem({ product: oliveOil, quantitiy: 3 });
  cart.addItem({ product: water, quantitiy: 2 });
  return cart;
};

test('delivery cost calculator, number of deliveries', () => {
  const cart = initialDeliveryCostCalculatorData();
  const deliveryCostCalculator = new DeliveryCostCalculator({
    costPerDelivery: 12,
    costPerProduct: 3
  });
  const result = deliveryCostCalculator.numberOfDeliveries(cart);
  const expected = 2;
  expect(result).toBe(expected);
});

test('delivery cost calculator, calculate cost', () => {
  const cart = initialDeliveryCostCalculatorData();
  const deliveryCostCalculator = new DeliveryCostCalculator({
    costPerDelivery: 12,
    costPerProduct: 3
  });
  const result = deliveryCostCalculator.calculateFor(cart);
  const expected = 32.99;
  expect(result).toBe(expected);
});
