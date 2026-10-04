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

// List of all products sold in the store
export const PRODUCTS = [
  {
    id: 'btn-pin-celestial-set',
    name: 'Adobo Pins',
    category: 'button-pin',
    price: 30,
    rating: 4.95,
    reviewsCount: 84,
    image: buttonPinsPackImg,
    badge: 'Bestseller',
    availableSizes: ['25 cm','32 cm', '44 cm','58 cm', '75 cm'],
    description: '"We Love You More Than All the Versions of Adobo" Button Pin',
    details: [
      'Set of 4 round button pins (Sizes: 32 cm on 23 cm lanyard & 44 cm on 23 cm lanyard)',
      'Hand-pressed by Barth’s Studio in small batches'
    ],
    dimensions: '32 cm on 23 cm lanyard / 44 cm on 23 cm lanyard',
    pinType: 'Classic steel pinback with safety lock',
    inStock: true,
    material: 'Tinplate steel'
  },
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
