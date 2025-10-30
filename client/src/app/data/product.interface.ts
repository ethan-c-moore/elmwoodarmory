export interface ProductOptionValue {
  name: string;
  price?: number;
  description?: string;
  images?: string[];
  image?: string; // for materials, thread, etc.
}

export interface ProductOptionGroup {
  name: string;
  cost: boolean;
  values: {
    [key: string]: ProductOptionValue;
  };
}

export interface ProductInterface {
  id: number;
  path: string;
  name: string;
  startingAt: number;
  description: string;
  disclaimer?: string;
  images: string[];
  options: {
    [key: string]: ProductOptionGroup;
  };
}

export const products: ProductInterface[] = [
  {
    id: 1,
    path: 'wallets',
    name: "Wallets",
    startingAt: 40,
    description: "Our handmade leather wallets are built to last - and only get better with age. They are cut from quality leather that takes on a rich patina over time as it absorbs the oils from your hands. Every wallet is also hand-stitched and made with care.",
    disclaimer: "Due to the natural variations in leather, the color and texture of your item may differ slightly from what’s shown in photos. We do our best to represent each item accurately, but no two hides are exactly the same and cameras only capture so much of the color.",
    images: [
      'wallet_assortment.jpg',
      'slim_wallet.jpg',
      'slim_wallet_video.mp4',
      'bifold_wallet_front.jpg',
      'bifold_wallet_middle.jpg',
      'bifold_wallet_video.mp4',
      'trifold_wallet_front.jpg',
      'trifold_wallet_open.jpg',
      'trifold_wallet_video.mp4',
      'tall_wallet_front.jpg',
      'tall_wallet_middle.jpg',
      'tall_wallet_video.mp4'
    ],
    options: {
      size: {
        name: "Size",
        cost: true,
        values: {
          slim: {
            name: "Slim",
            price: 40,
            description: "Go back to the basics with our slim wallets; designed to carry only the essentials, with <strong style='text-decoration: underline; font-size: 1.6rem;'>4 card slots</strong> and a small pocket to slide in a folded bill or two.",
            images: [
              'slim_wallet.jpg',
              'slim_wallet_video.mp4'
            ]
          },
          bifold: {
            name: "Bifold",
            price: 65,
            description: "Our classic bifold wallets feature <strong style='text-decoration: underline; font-size: 1.6rem;'>8 card slots</strong>, <strong style='text-decoration: underline; font-size: 1.6rem;'>2 hidden card slots</strong>, and <strong style='text-decoration: underline; font-size: 1.6rem;'>1 full-length cash slot</strong>—perfect for everyday use with plenty of room for all your essentials.",
            images: [
              'bifold_wallet_front.jpg',
              'bifold_wallet_middle.jpg',
              'bifold_wallet_video.mp4'
            ]
          },
          trifold: {
            name: "Trifold",
            price: 65,
            description: "These trifold wallets offer a compact design with <strong style='text-decoration: underline; font-size: 1.6rem;'>6 card slots</strong> and <strong style='text-decoration: underline; font-size: 1.6rem;'>1 full-length cash slot</strong>, giving you a simple and secure way to carry what you need.",
            images: [
              'trifold_wallet_front.jpg',
              'trifold_wallet_open.jpg',
              'trifold_wallet_video.mp4'
            ]
          },
          tall: {
            name: "Tall",
            price: 80,
            description: "For those who like to carry more, our tall wallets pack in <strong style='text-decoration: underline; font-size: 1.6rem;'>16 card slots</strong> and <strong style='text-decoration: underline; font-size: 1.6rem;'>2 full-length cash slots</strong>—all in a sleek, vertical design.",
            images: [
              'tall_wallet_front.jpg',
              'tall_wallet_middle.jpg',
              'tall_wallet_video.mp4'
            ]
          }
        }
      },
      material: {
        name: "Material",
        cost: false,
        values: {
          beigedenverside: {
            name: "Beige",
            image: 'leather_beige_denver_side.jpg'
          },
          black: {
            name: "Black",
            image: 'leather_black.jpg'
          },
          blackcherry: {
            name: "Black Cherry",
            image: 'leather_black_cherry.jpg'
          },
          darkbrown: {
            name: "Dark Brown",
            image: 'leather_dark_brown.jpg'
          },
          darkteal: {
            name: "Dark Teal",
            image: 'leather_dark_teal.jpg'
          },
          lightgreen: {
            name: "Light Green",
            image: 'leather_light_green.jpg'
          },
          mustard: {
            name: "Mustard",
            image: 'leather_mustard.jpg'
          },
          olive: {
            name: "Olive",
            image: 'leather_olive.jpg'
          },
          plum: {
            name: "Plum",
            image: 'leather_plum.jpg'
          },
          red: {
            name: "Red",
            image: 'leather_red.jpg'
          },
          tan: {
            name: "Tan",
            image: 'leather_tan.jpg'
          },
          turquoise: {
            name: "Turquoise",
            image: 'leather_turquoise.jpg'
          }
        }
      },
      thread: {
        name: "Thread",
        cost: false,
        values: {
          black: {
            name: "Black",
            image: 'thread_black.jpg'
          },
          blue: {
            name: "Blue",
            image: 'thread_blue.jpg'
          },
          brown: {
            name: "Brown",
            image: 'thread_brown.jpg'
          },
          darkgreen: {
            name: "Dark Green",
            image: 'thread_dark_green.jpg'
          },
          deserttan: {
            name: "Desert Tan",
            image: 'thread_desert_tan.jpg'
          },
          ivory: {
            name: "Ivory",
            image: 'thread_ivory.jpg'
          },
          pink: {
            name: "Pink",
            image: 'thread_pink.jpg'
          },
          red: {
            name: "Red",
            image: 'thread_red.jpg'
          },
          white: {
            name: "White",
            image: 'thread_white.jpg'
          },
          yellow: {
            name: "Yellow",
            image: 'thread_yellow.jpg'
          }
        }
      }
    }
  },
  {
    id: 2,
    path: 'pouches',
    name: "Pouches",
    startingAt: 45,
    description: "Our handmade leather belt pouches are the perfect accessory - whether you’re dressing for an event, working in the field, or just looking for a stylish hands-free option. Each pouch is cut from quality leather that takes on a rich patina over time as it absorbs the oils from your hands.",
    disclaimer: "Due to the natural variations in leather, the color and texture of your item may differ slightly from what’s shown in photos. We do our best to represent each item accurately, but no two hides are exactly the same and cameras only capture so much of the color.",
    images: [
      'pouch_collection.jpg',
      'pouch_collection_back.jpg',
      'pouch_collection_open.jpg',
      'pouch_sizes.jpg',
      'pouch_video.mp4'
    ],
    options: {
      size: {
        name: "Size",
        cost: true,
        values: {
          small: {
            name: "Small",
            price: 45,
            description: "Compact and convenient, our small pouches are just the right size for a wallet, car keys, or other small essentials you want to keep close and secure."
          },
          large: {
            name: "Large",
            price: 55,
            description: "Need extra room? Our big pouches give you plenty of space to carry the essentials your outfit doesn’t have pockets for - ideal for fairs, festivals, or hands-free daily wear."
          }
        }
      },
      material: {
        name: "Material",
        cost: false,
        values: {
          beigedenverside: {
            name: "Beige",
            image: 'leather_beige_denver_side.jpg'
          },
          black: {
            name: "Black",
            image: 'leather_black.jpg'
          },
          blackcherry: {
            name: "Black Cherry",
            image: 'leather_black_cherry.jpg'
          },
          darkbrown: {
            name: "Dark Brown",
            image: 'leather_dark_brown.jpg'
          },
          darkteal: {
            name: "Dark Teal",
            image: 'leather_dark_teal.jpg'
          },
          lightgreen: {
            name: "Light Green",
            image: 'leather_light_green.jpg'
          },
          mustard: {
            name: "Mustard",
            image: 'leather_mustard.jpg'
          },
          olive: {
            name: "Olive",
            image: 'leather_olive.jpg'
          },
          plum: {
            name: "Plum",
            image: 'leather_plum.jpg'
          },
          red: {
            name: "Red",
            image: 'leather_red.jpg'
          },
          tan: {
            name: "Tan",
            image: 'leather_tan.jpg'
          },
          turquoise: {
            name: "Turquoise",
            image: 'leather_turquoise.jpg'
          }
        }
      },
      hardware: {
        name: "Hardware",
        cost: false,
        values: {
          antiquebrass: {
            name: "Antique Brass",
            image: 'hardware_antique_brass.jpg'
          },
          antiquenickel: {
            name: "Antique Nickel",
            image: 'hardware_antique_nickel.jpg'
          },
          brass: {
            name: "Brass",
            image: 'hardware_brass.jpg'
          },
          gunmetal: {
            name: "Gunmetal",
            image: 'hardware_gunmetal.jpg'
          },
          nickel: {
            name: "Nickel",
            image: 'hardware_nickel.jpg'
          }
        }
      }
    }
  }
];
