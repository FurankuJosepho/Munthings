// Product Catalog Data: Contains all available button pins, waterproof stickers, and sets.
// Each item includes an ID, name, price, rating, reviews count, image, and description.

import heroPinsStickersImg from '../assets/images/hero_pins_stickers_1791030785243.jpg';
import buttonPinsPackImg from '../assets/images/Messenger_creation_4396E64C-7B07-4922-915A-D91A5AC554ED.jpeg';
import stickersCollectionImg from '../assets/images/stickers_collection_1791030809371.jpg';
import stickersMoonImg from '../assets/images/stickers_moon_pack_1791030371201.jpg';
import stickersBobaImg from '../assets/images/stickers_boba_bag_1791030436289.jpg';
import pinMoonImg from '../assets/images/pin_celestial_moon_1791030347504.jpg';
import pinCatImg from '../assets/images/pin_sleepy_cat_1791030358389.jpg';
import pinSunflowerImg from '../assets/images/pin_sunflower_tote_1791030418958.jpg';

export { heroPinsStickersImg };

// Button Pins Pricing Matrix matching official studio chart (Surface: Glossy or Matte)
export const BUTTON_PIN_PRICING = {
  '25mm': {
    basePrice: 15.00,
    tiers: [
      { min: 50, max: 100, label: '50-100 PCS', unitPrice: 15.00 },
      { min: 200, max: 299, label: '200 PCS', unitPrice: 13.00 },
      { min: 300, max: 499, label: '300 PCS', unitPrice: 10.00 },
      { min: 500, max: Infinity, label: '500 PCS up', unitPrice: 8.00 },
    ],
    packagingAddon: 5.00,
  },
  '32mm': {
    basePrice: 18.00,
    tiers: [
      { min: 50, max: 100, label: '50-100 PCS', unitPrice: 18.00 },
      { min: 200, max: 299, label: '200 PCS', unitPrice: 15.00 },
      { min: 300, max: 499, label: '300 PCS', unitPrice: 13.00 },
      { min: 500, max: Infinity, label: '500 PCS up', unitPrice: 10.00 },
    ],
    packagingAddon: 5.00,
  },
  '44mm': {
    basePrice: 23.00,
    tiers: [
      { min: 50, max: 100, label: '50-100 PCS', unitPrice: 23.00 },
      { min: 200, max: 299, label: '200 PCS', unitPrice: 20.00 },
      { min: 300, max: 499, label: '300 PCS', unitPrice: 18.00 },
      { min: 500, max: Infinity, label: '500 PCS up', unitPrice: 15.00 },
    ],
    packagingAddon: 8.00,
  },
  '58mm': {
    basePrice: 25.00,
    tiers: [
      { min: 50, max: 100, label: '50-100 PCS', unitPrice: 25.00 },
      { min: 200, max: 299, label: '200 PCS', unitPrice: 23.00 },
      { min: 300, max: 499, label: '300 PCS', unitPrice: 20.00 },
      { min: 500, max: Infinity, label: '500 PCS up', unitPrice: 18.00 },
    ],
    packagingAddon: 10.00,
  },
  '75mm': {
    basePrice: 38.00,
    tiers: [
      { min: 50, max: 100, label: '50-100 PCS', unitPrice: 38.00 },
      { min: 200, max: 299, label: '200 PCS', unitPrice: 35.00 },
      { min: 300, max: 499, label: '300 PCS', unitPrice: 32.00 },
      { min: 500, max: Infinity, label: '500 PCS up', unitPrice: 30.00 },
    ],
    packagingAddon: 15.00,
  },
};

// Calculate unit price based on size, quantity, and packaging add-on
export const calculateButtonPinPrice = (size, quantity = 50, includePackaging = false) => {
  const sizeData = BUTTON_PIN_PRICING[size] || BUTTON_PIN_PRICING['25mm'];
  let unitPrice = sizeData.basePrice;

  if (quantity >= 500) {
    unitPrice = sizeData.tiers[3].unitPrice;
  } else if (quantity >= 300) {
    unitPrice = sizeData.tiers[2].unitPrice;
  } else if (quantity >= 200) {
    unitPrice = sizeData.tiers[1].unitPrice;
  } else {
    unitPrice = sizeData.tiers[0].unitPrice;
  }

  const packagingPrice = includePackaging ? sizeData.packagingAddon : 0;
  return {
    unitPrice,
    packagingPrice,
    totalUnitPrice: unitPrice + packagingPrice,
    total: (unitPrice + packagingPrice) * quantity,
  };
};

// List of all products sold in the store
export const PRODUCTS = [
  {
    id: 'btn-pin-celestial-set',
    name: 'Adobo Pins',
    category: 'button-pin',
    price: 15.00,
    priceRange: '₱15.00 – ₱38.00',
    rating: 4.95,
    reviewsCount: 84,
    image: buttonPinsPackImg,
    badge: 'Bestseller',
    availableSizes: ['25mm', '32mm', '44mm', '58mm', '75mm'],
    availableSurfaces: ['Glossy', 'Matte'],
    description: '"We Love You More Than All the Versions of Adobo" Button Pin',
    details: [
      'Sizes: 25mm (₱15), 32mm (₱18), 44mm (₱23), 58mm (₱25), 75mm (₱38)',
      'Surface finish: Glossy or Matte',
      'Bulk tiers: 50-100 pcs, 200 pcs, 300 pcs, 500+ pcs (rates down to ₱8.00/pc)',
      'Add-on option: Individual packaging (plastic & label)',
      'Hand-pressed with tinplate steel by Barth’s Studio in small batches'
    ],
    dimensions: '25mm / 32mm / 44mm / 58mm / 75mm',
    pinType: 'Classic steel pinback with safety lock',
    inStock: true,
    material: 'Tinplate steel'
  },
];

// Customer reviews displayed on the Home page
export const REVIEWS = [
  {
    id: 'rev-1',
    author: 'Frank Joseph G.',
    rating: 5,
    createdAt: '2026-10-01T08:00:00.000Z',
    date: '3 days ago',
    comment: 'The button pins are so vibrant and the glossy finish is super sturdy! I have two pinned on my backpack strap and the pinbacks hold tight.',
    itemPurchased: 'Adobo Pins',
    verified: true
  }
];
