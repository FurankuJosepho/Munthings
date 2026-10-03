// Product Catalog Data: Contains all available button pins, waterproof stickers, and sets.
// Each item includes an ID, name, price, rating, reviews count, image, and description.

import heroPinsStickersImg from '../assets/images/hero_pins_stickers_1791030785243.jpg';
import buttonPinsPackImg from '../assets/images/button_pins_pack_1791030798789.jpg';
import stickersCollectionImg from '../assets/images/stickers_collection_1791030809371.jpg';
import stickersMoonImg from '../assets/images/stickers_moon_pack_1791030371201.jpg';
import stickersBobaImg from '../assets/images/stickers_boba_bag_1791030436289.jpg';
import pinMoonImg from '../assets/images/pin_celestial_moon_1791030347504.jpg';
import pinCatImg from '../assets/images/pin_sleepy_cat_1791030358389.jpg';
import pinSunflowerImg from '../assets/images/pin_sunflower_tote_1791030418958.jpg';

export { heroPinsStickersImg };

// List of all products sold in the store
export const PRODUCTS = [
  {
    id: 'btn-pin-celestial-set',
    name: 'Celestial Moon & Stars Button Pin Set (4-Pack)',
    category: 'button-pin',
    price: 180.00,
    rating: 4.95,
    reviewsCount: 84,
    image: buttonPinsPackImg,
    badge: 'Bestseller',
    availableSizes: ['32 cm on 23 cm lanyard', '44 cm on 23 cm lanyard'],
    description: 'A set of 4 classic round pinback button pins featuring the signature Munthings crescent moon, cheerful clouds, and cozy stars. Hand-pressed with crisp full-color prints and protective scratch-resistant glossy mylar. Available in lanyard-friendly sizes.',
    details: [
      'Set of 4 round button pins (Sizes: 32 cm on 23 cm lanyard & 44 cm on 23 cm lanyard)',
      'Sturdy steel pinback mechanism with safety clasp',
      'Weather-resistant high gloss protective mylar face',
      'Hand-pressed by Barth’s Studio in small batches'
    ],
    dimensions: '32 cm on 23 cm lanyard / 44 cm on 23 cm lanyard',
    pinType: 'Classic steel pinback with safety lock',
    inStock: true,
    material: 'Tinplate steel, high-gloss mylar, bright pigment inks'
  },
  {
    id: 'stickers-celestial-collection',
    name: 'Munthings Vinyl Sticker Pack (5-Pack)',
    category: 'sticker',
    price: 150.00,
    rating: 5.0,
    reviewsCount: 118,
    image: stickersMoonImg,
    badge: 'Fan Favorite',
    stickerSize: '1.5 inches',
    description: 'Five premium die-cut waterproof vinyl stickers (1.5 inches height each) featuring celestial moon motifs and playful studio designs. Thick 6mil vinyl with a clean white die-cut border, easy-peel backing, and UV gloss laminate.',
    details: [
      '5 distinct waterproof die-cut vinyl stickers (1.5 inches height)',
      'Thick 6mil outdoor-grade vinyl',
      '100% waterproof, weatherproof, and scratch-resistant',
      'Leaves zero sticky residue when peeled'
    ],
    dimensions: '1.5 inches height each',
    stickerFinish: 'Glossy UV protective laminate',
    inStock: true,
    material: 'Heavyweight weatherproof 3M vinyl'
  },
  {
    id: 'btn-pin-sleepy-moon',
    name: 'Sleepy Crescent Moon Button Pin',
    category: 'button-pin',
    price: 65.00,
    rating: 4.9,
    reviewsCount: 62,
    image: pinCatImg,
    badge: 'Classic',
    availableSizes: ['32 cm on 23 cm lanyard', '44 cm on 23 cm lanyard'],
    description: 'Our iconic sleepy moon artwork pressed into a smooth round button pin. Bright golden yellow background with soft white illustration. Perfect size to pin on jackets, backpacks, tote bags, or lanyard straps.',
    details: [
      'Available in 32 cm on 23 cm lanyard & 44 cm on 23 cm lanyard sizes',
      'Rust-resistant tinplate steel back with secure pin',
      'High-clarity protective mylar film',
      'Printed with fade-resistant UV ink'
    ],
    dimensions: '32 cm on 23 cm lanyard / 44 cm on 23 cm lanyard',
    pinType: 'Steel spring pinback',
    inStock: true,
    material: 'Steel shell, paper print, clear mylar'
  },
  {
    id: 'stickers-botanical-cafe',
    name: 'Cozy Cafe & Boba Vinyl Sticker Set',
    category: 'sticker',
    price: 120.00,
    rating: 4.88,
    reviewsCount: 47,
    image: stickersBobaImg,
    badge: 'New Drop',
    stickerSize: '1.5 inches',
    description: 'Sweet cafe treats including boba milk tea and matcha latte cups illustrated with smiling faces. 1.5 inches height each, great for water bottles, laptops, notebooks, and phone cases.',
    details: [
      '3 individual die-cut vinyl stickers (1.5 inches height)',
      'Satin smooth UV-resistant finish',
      'Dishwasher safe and water resistant',
      'Original Barth’s Studio artwork'
    ],
    dimensions: '1.5 inches height each',
    stickerFinish: 'Satin gloss vinyl',
    inStock: true,
    material: 'Waterproof matte-gloss vinyl'
  },
  {
    id: 'btn-pin-golden-sunflower',
    name: 'Golden Bloom Sunflower Button Pin',
    category: 'button-pin',
    price: 65.00,
    rating: 4.85,
    reviewsCount: 39,
    image: pinSunflowerImg,
    badge: 'Popular',
    availableSizes: ['32 cm on 23 cm lanyard', '44 cm on 23 cm lanyard'],
    description: 'Bright cheerful sunflower button badge with radiant yellow petals. Pin it onto your denim jacket, backpack pocket, or pin banner for an instant pop of sunshine.',
    details: [
      'Choice of 32 cm on 23 cm lanyard or 44 cm on 23 cm lanyard',
      'Secure pinback fastening that stays shut',
      'Durable mylar shield that resists scuffs and moisture',
      'Designed and hand-assembled in the studio'
    ],
    dimensions: '32 cm on 23 cm lanyard / 44 cm on 23 cm lanyard',
    pinType: 'Spring steel pinback',
    inStock: true,
    material: 'Tinplate steel, mylar cover'
  },
  {
    id: 'pack-ultimate-grab-bag',
    name: 'Munthings Button Pin & Sticker Grab Bag',
    category: 'pack',
    price: 299.00,
    rating: 4.98,
    reviewsCount: 92,
    image: heroPinsStickersImg,
    badge: 'Best Value Bundle',
    availableSizes: ['32 cm on 23 cm lanyard', '44 cm on 23 cm lanyard'],
    description: 'The ultimate flair bundle! Includes 3 bestselling round button pins (32 cm on 23 cm lanyard & 44 cm on 23 cm lanyard sizes) and 5 waterproof vinyl stickers (1.5 inches height) plus a mini collector card. Packaged in a sunny yellow stamped glassine pouch.',
    details: [
      '3x Round button pins (32 cm on 23 cm lanyard & 44 cm on 23 cm lanyard)',
      '5x Waterproof die-cut vinyl stickers (1.5 inches height)',
      '1x Munthings illustrated mini art print card',
      'Packaged in an eco-friendly gift pouch'
    ],
    dimensions: 'Pins (32 cm & 44 cm on 23 cm lanyard), Stickers (1.5 inches)',
    stickerFinish: 'Assorted gloss & holographic',
    pinType: 'Steel button pins',
    inStock: true,
    material: 'Curated mix of button pins and waterproof vinyl'
  },
  {
    id: 'stickers-diecut-variety',
    name: 'Munthings Variety Sticker Sheet',
    category: 'sticker',
    price: 95.00,
    rating: 4.92,
    reviewsCount: 51,
    image: stickersCollectionImg,
    badge: 'Handy',
    stickerSize: '1.5 inches',
    description: 'A kiss-cut sticker sheet with 8 mini peel-and-stick designs (1.5 inches height) featuring tiny stars, moons, hearts, and cheerful doodles. Perfect for decorating planners, pen cases, and phone cases.',
    details: [
      'Kiss-cut sheet with 8 peelable stickers (1.5 inches height each)',
      'Durable water-resistant vinyl sheet',
      'Smooth satin finish',
      'Easy peel with clean edges'
    ],
    dimensions: '1.5 inches height stickers',
    stickerFinish: 'Water-resistant kiss-cut vinyl',
    inStock: true,
    material: 'Premium vinyl adhesive sheet'
  },
  {
    id: 'btn-pin-signature-crescent',
    name: 'Signature Crescent Moon Button Pin',
    category: 'button-pin',
    price: 65.00,
    rating: 4.96,
    reviewsCount: 71,
    image: pinMoonImg,
    badge: 'Signature',
    availableSizes: ['32 cm on 23 cm lanyard', '44 cm on 23 cm lanyard'],
    description: 'The exact crescent moon emblem from the Munthings logo. Crisp white moon outline over a warm golden yellow background. Hand-pressed with high-shine mylar. Fitted for 23 cm lanyard straps.',
    details: [
      'Offered in 32 cm on 23 cm lanyard & 44 cm on 23 cm lanyard',
      'Safety pinback for secure hold',
      'Vibrant yellow & white palette matching the brand logo',
      'Water and scratch resistant face'
    ],
    dimensions: '32 cm on 23 cm lanyard / 44 cm on 23 cm lanyard',
    pinType: 'Steel pinback button',
    inStock: true,
    material: 'Tinplate, bright ink, protective film'
  }
];

// Customer reviews displayed on the Home page
export const REVIEWS = [
  {
    id: 'rev-1',
    author: 'Maya S.',
    rating: 5,
    date: '3 days ago',
    comment: 'The button pins are so vibrant and the glossy finish is super sturdy! I have two pinned on my backpack strap and the pinbacks hold tight.',
    itemPurchased: 'Celestial Moon & Stars Button Pin Set',
    verified: true
  },
  {
    id: 'rev-2',
    author: 'Julian K.',
    rating: 5,
    date: '1 week ago',
    comment: 'The vinyl stickers are truly waterproof. Put one on my water bottle and ran it through washing multiple times with zero lifting. Also love the sunny yellow branding!',
    itemPurchased: 'Munthings Vinyl Sticker Pack',
    verified: true
  },
  {
    id: 'rev-3',
    author: 'Elena R.',
    rating: 5,
    date: '2 weeks ago',
    comment: 'Ordered the button pin & sticker grab bag as a gift. The packaging was adorable and the 1.25" pins are the perfect size for denim jackets and lanyards.',
    itemPurchased: 'Button Pin & Sticker Grab Bag',
    verified: true
  }
];
