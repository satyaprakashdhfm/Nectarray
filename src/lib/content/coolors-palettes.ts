/**
 * The Colours tab: palettes from Coolors' trending page
 * (coolors.co/palettes/trending), with their names and likes as shown there,
 * grouped by the words designers use for them. Coolors blocks automated
 * copying, so the list was taken from screenshots of the page, and a code
 * read off a screenshot can be a shade out. Exact ones can be added on the
 * tab by pasting a Coolors link.
 */

export type PaletteStyle = {
  id: string;
  label: string;
  /** What the word means and where it is used, in one line. */
  blurb: string;
};

export const PALETTE_STYLES: PaletteStyle[] = [
  { id: "pastel", label: "Pastel", blurb: "Soft, light, low-saturation. Kids, beauty, wellness, bakeries." },
  { id: "earthy", label: "Earthy and neutral", blurb: "Browns, beiges, clay and sand. Interiors, furniture, organic food." },
  { id: "warm", label: "Warm and sunset", blurb: "Reds, oranges and yellows. Food, festivals, offers." },
  { id: "cool", label: "Cool and ocean", blurb: "Blues and teals. Travel, healthcare, technology." },
  { id: "nature", label: "Green and nature", blurb: "Leaf, sage and forest greens. Farming, eco, Ayurveda." },
  { id: "corporate", label: "Corporate and trust", blurb: "Navy and steel with one accent. Banks, law, insurance, B2B." },
  { id: "luxury", label: "Luxury", blurb: "Black, gold, wine and cream. Jewellery, fashion, premium brands." },
  { id: "dark", label: "Dark and moody", blurb: "Deep, low-light tones. Gaming, nightlife, film." },
  { id: "vibrant", label: "Vibrant and bold", blurb: "Saturated, high-energy. Youth brands, events, apps." },
  { id: "vintage", label: "Vintage and retro", blurb: "Faded, dusty tones. Cafés, crafts, heritage brands." },
  { id: "monochrome", label: "Monochrome and greys", blurb: "One colour or none: greys with a single accent. Clean apps, portfolios." },
  { id: "gradient", label: "Gradient scales", blurb: "One hue stepped light to dark. Charts, maps, backgrounds." },
];

export type TrendingPalette = {
  name: string;
  /** As Coolors shows it, e.g. 34.9K. */
  likes?: string;
  colors: string[];
  styles: string[];
};

type Row = [name: string, likes: string, colors: string, styles: string];

const ROWS: Row[] = [
  ["Fiery Ocean", "34.9K", "780000-c1121f-fdf0d5-003049-669bbc", "warm corporate"],
  ["Olive Garden Feast", "97.4K", "606c38-283618-fefae0-dda15e-bc6c25", "earthy nature"],
  ["Crimson Hues", "10.8K", "250902-38040e-640d14-800e13-ad2831", "luxury dark gradient"],
  ["Fresh Greens", "23K", "386641-6a994e-a7c957-f2e8cf-bc4749", "nature"],
  ["Pastel Dreamland Adventure", "88K", "cdb4db-ffc8dd-ffafcc-bde0fe-a2d2ff", "pastel"],
  ["Golden Summer Fields", "84.8K", "ccd5ae-e9edc9-fefae0-faedcd-d4a373", "pastel earthy"],
  ["Autumn Harvest", "22.8K", "6f1d1b-bb9457-432818-99582a-ffe6a7", "earthy vintage"],
  ["Earthy Green", "38.2K", "cad2c5-84a98c-52796f-354f52-2f3e46", "nature monochrome"],
  ["Soft Pink Delight", "23.3K", "ffe5ec-ffc2d1-ffb3c6-ff8fab-fb6f92", "pastel gradient"],
  ["Ocean Blue Serenity", "41.2K", "03045e-023e8a-0077b6-0096c7-00b4d8-48cae4-90e0ef-ade8f4-caf0f8", "cool gradient"],
  ["Antique Rose", "8,505", "cc8b86-f9eae1-7d4f50-d1be9c-aa998f", "vintage earthy"],
  ["Soft Lavender", "45.6K", "22223b-4a4e69-9a8c98-c9ada7-f2e9e4", "vintage corporate"],
  ["Peachy Delight", "43.7K", "d8e2dc-ffe5d9-ffcad4-f4acb7-9d8189", "pastel"],
  ["Warm Neutral Tones", "17K", "582f0e-7f4f24-936639-a68a64-b6ad90-c2c5aa-a4ac86-656d4a-414833-333d29", "earthy gradient"],
  ["Refreshing Summer Fun", "67.8K", "8ecae6-219ebc-023047-ffb703-fb8500", "cool vibrant"],
  ["Earthy Forest Hues", "48.9K", "dad7cd-a3b18a-588157-3a5a40-344e41", "nature earthy"],
  ["Fiery Red Sunset", "28.6K", "03071e-370617-6a040f-9d0208-d00000-dc2f02-e85d04-f48c06-faa307-ffba08", "warm gradient"],
  ["Purple Sunset", "17.3K", "390099-9e0059-ff0054-ff5400-ffbd00", "vibrant warm"],
  ["Fiery Palette", "27.6K", "5f0f40-9a031e-fb8b24-e36414-0f4c5c", "warm"],
  ["Autumn Glow", "9,016", "780116-f7b538-db7c26-d8572a-c32f27", "warm"],
  ["Vibrant Color Fiesta", "45.2K", "ffbe0b-fb5607-ff006e-8338ec-3a86ff", "vibrant"],
  ["Cherry Blossom Bloom", "11K", "590d22-800f2f-a4133c-c9184a-ff4d6d-ff758f-ff8fa3-ffb3c1-ffccd5-fff0f3", "gradient pastel"],
  ["Summer Dream", "28.7K", "0081a7-00afb9-fdfcdc-fed9b7-f07167", "cool pastel"],
  ["Autumn Glow", "4,625", "3c1518-69140e-a44200-d58936-f2f3ae", "warm earthy"],
  ["Black & Gold Elegance", "54.4K", "000000-14213d-fca311-e5e5e5-ffffff", "luxury corporate"],
  ["Leafy Green Garden", "17.1K", "132a13-31572c-4f772d-90a955-ecf39e", "nature gradient"],
  ["Colorful Daybreak", "12.6K", "3d348b-7678ed-f7b801-f18701-f35b04", "vibrant"],
  ["Bold Hues", "23.2K", "f72585-7209b7-3a0ca3-4361ee-4cc9f0", "vibrant"],
  ["Muted Earthy Tones", "75.2K", "ffcdb2-ffb4a2-e5989b-b5838d-6d6875", "pastel vintage"],
  ["Autumn Harvest", "30.9K", "ede0d4-e6ccb2-ddb892-b08968-7f5539-9c6644", "earthy"],
  ["Vibrant Tones", "19.5K", "f94144-f3722c-f8961e-f9844a-f9c74f-90be6d-43aa8b-4d908e-577590-277da1", "vibrant"],
  ["Deep Sea Blue", "10.4K", "0466c8-0353a4-023e7d-002855-001845-001233-33415c-5c677d-7d8597-979dac", "corporate gradient"],
  ["Gothic Romance", "4,733", "0a0908-49111c-f2f4f3-a9927d-5e503f", "dark luxury"],
  ["Vibrant Summer", "17.4K", "ff595e-ffca3a-8ac926-1982c4-6a4c93", "vibrant"],
  ["Ocean Sunset", "12.5K", "001427-708d81-f4d58d-bf0603-8d0801", "vintage warm"],
  ["Coastal Blues", "12.6K", "012a4a-013a63-01497c-014f86-2a6f97-2c7da0-468faf-61a5c2-89c2d9-a9d6e5", "cool gradient corporate"],
  ["Rustic Charm", "18.4K", "fffcf2-ccc5b9-403d39-252422-eb5e28", "monochrome earthy"],
  ["Dark Aurora", "3,862", "000000-4f2c4c-6e5577-c7b8dc-f7f4f4", "dark"],
  ["Soft Pastels", "25.8K", "ffd6ff-e7c6ff-c8b6ff-b8c0ff-bbd0ff", "pastel"],
  ["Spring Green Harmony", "11.3K", "007f5f-2b9348-55a630-80b918-aacc00-bfd200-d4d700-dddf00-eeef20-ffff3f", "nature gradient"],
  ["Neutral Harmony Bliss", "48.1K", "f4f1de-e07a5f-3d405b-81b29a-f2cc8f", "vintage"],
  ["Sunny Beach Day", "124.4K", "264653-2a9d8f-e9c46a-f4a261-e76f51", "warm cool"],
  ["Bright Green", "6,145", "004b23-006400-007200-008000-38b000-70e000-9ef01a-ccff33", "nature gradient"],
  ["Silver Lining", "5,136", "595959-7f7f7f-a5a5a5-cccccc-f2f2f2", "monochrome gradient"],
  ["Gentle Sea Breeze", "7,930", "022b3a-1f7a8c-bfdbf7-e1e5f2-ffffff", "cool corporate"],
  ["Golden Plum Sunset", "1,946", "e3b505-95190c-610345-107e7d-044b7f", "vibrant"],
  ["Spring Bliss", "3,506", "7a918d-93b1a7-99c2a2-c5edac-dbfeb8", "nature pastel"],
  ["Sunrise Glow", "13.9K", "233d4d-fe7f2d-fcca46-a1c181-619b8a", "warm"],
  ["Earthy Delight", "2,809", "3e5641-a24936-d36135-282b28-83bca9", "earthy"],
  ["Fiery Orange Gradient", "6,105", "ff4800-ff5400-ff6000-ff6d00-ff7900-ff8500-ff9100-ff9e00-ffaa00-ffb600", "warm gradient"],
  ["Soft Serenade", "5,296", "bcf4de-cde5d7-ded6d1-eec6ca-ffb5c2", "pastel"],
  ["Cool Waters", "17.6K", "22577a-38a3a5-57cc99-80ed99-c7f9cc", "cool nature"],
  ["Midnight Glow", "3,692", "050404-41434f-6f2232-952e41-fffff9", "dark luxury"],
  ["Earthy Tones", "2,650", "b1925e-f4f1e1-b2b5b5-6e1a05-2b2118", "earthy vintage"],
  ["Candy Apple", "2,945", "1f1e24-9a1611-fef7f1-ffcf99-111d4a", "luxury"],
  ["Earthy Tones", "12.7K", "a3a380-d6ce93-efebce-d8a48f-bb8588", "earthy pastel"],
  ["Warm Rustic Palette", "8,863", "5c5221-eebd6e-f2a65a-f58549-772f1a", "warm earthy"],
  ["Nature Harmony", "6,020", "eef0eb-353e22-6f7c48-c0bf8b-7a6455", "nature earthy"],
  ["Soft Rainbow", "13.7K", "fbf8cc-fde4cf-ffcfd2-f1c0e8-cfbaf0-a3c4f3-90dbf4-8eecf5-98f5e1-b9fbc0", "pastel"],
  ["Meadow Green", "17.4K", "d9ed92-b5e48c-99d98c-76c893-52b69a-34a0a4-168aad-1a759f-1e6091-184e77", "nature gradient"],
  ["Classic Red Palette", "11K", "0b090a-161a1d-660708-a4161a-ba181b-e5383b-b1a7a6-d3d3d3-f5f3f4-ffffff", "dark luxury"],
  ["Gradient Blues", "25.3K", "7400b8-6930c3-5e60ce-5390d9-4ea8de-48bfe3-56cfe1-64dfdf-72efdd-80ffdb", "gradient cool"],
  ["Fresh Greens", "25K", "d8f3dc-b7e4c7-95d5b2-74c69d-52b788-40916c-2d6a4f-1b4332-081c15", "nature gradient"],
  ["Sunny Beach Day", "15.9K", "001524-15616d-ffecd1-ff7d00-78290f", "warm corporate"],
  ["Pink Fantasy", "5,385", "ff499e-d264b6-a480cf-779be7-49b6ff", "vibrant gradient"],
  ["Golden Summer Glow", "15.2K", "0d3b66-faf0ca-f4d35e-ee964b-f95738", "warm"],
  ["Mystic Evening", "7,602", "1a1423-372549-774c60-b75d69-eacdc2", "dark vintage"],
  ["Peachy Sunrise", "12.3K", "ffffff-84dcc6-a5ffd6-ffa69e-ff686b", "pastel"],
  ["Contrast Pop", "19.7K", "011627-fdfffc-2ec4b6-e71d36-ff9f1c", "vibrant"],
  ["Beach Sunset", "14.1K", "bee9e8-62b6cb-1b4965-cae9ff-5fa8d3", "cool"],
  ["Enchanted Forest", "2,692", "1b7f55-73e2a7-def4c6-1c5d33-b2d063", "nature"],
  ["Deep Sea", "11.3K", "0d1321-1d2d44-3e5c76-748cab-f0ebd8", "corporate dark"],
  ["Deep Blue Sea", "7,885", "134074-13315c-0b2545-8da9c4-eef4ed", "corporate cool"],
  ["Serene Waters", "4,607", "0b2027-40798c-70a9a1-cfd7c7-f6f1d1", "cool vintage"],
  ["Emerald Oasis", "2,759", "1b1f1b-233d2a-2e5a2e-5f7031-9eaa42", "nature dark"],
  ["Enchanted Forest", "3,167", "b3ffe1-93e9a8-64b991-4c8a8a-012217", "nature"],
  ["Forest Green Tones", "9,332", "cce3cc-89bea3-578a8f-3b6869-354a5a", "nature cool"],
  ["Midnight Sunburst Gold", "940", "000814-001d3d-003566-cca300-f5ce00", "luxury corporate"],
  ["Midnight Sky", "12K", "00296b-003f88-00509d-fdc500-ffd500", "corporate"],
  ["Warm Earth Tones", "25.3K", "edc4b3-e6b8a2-deab90-d69f7e-cd9777-c38e70-b07d62-9d6b53-8a5a44-774936", "earthy gradient"],
  ["Vivid Nightfall", "13.9K", "10002b-240046-3c096c-5a189a-7b2cbf-9d4edd-c77dff-e0aaff", "gradient dark"],
  ["Cherry Blossom", "4,747", "ffd5d8-e9658c-8b0040-2e313a-1d211f", "luxury"],
  ["Ocean Sunset", "6,828", "2f4858-33658a-86bbd8-f6ae2d-f26419", "cool warm"],
  ["Fiery Midnight Jazz", "1,817", "ff3842-5f5f5f-1d3461-1f487e-247ba0", "corporate"],
  ["Earthy Tones", "5,092", "c4b9aa-a59789-5e4740-8c5c4a-5b2a26", "earthy"],
  ["Enchanted Sunset", "3,153", "46345a-31233e-221b22-eca72f-ee5622", "dark warm"],
  ["Rustic Charm", "2,653", "3c1642-736a7f-a99f96-dda77b-945d5e", "vintage"],
  ["Monochrome Harmony", "13.5K", "cfdbd5-e8eddf-f5cb5c-242423-333533", "monochrome"],
  ["Green Serenity", "7,388", "a4cba5-8eb894-6f9671-415e44-121a12", "nature gradient"],
  ["Warm Sunset", "6,359", "f9a474-ff8a5b-cc6b84-9a527a-5e3449", "warm"],
];

/** Our own picks, shown first. */
export const OUR_PALETTES: TrendingPalette[] = [
  {
    name: "Qualcomm white and grey",
    colors: ["ffffff", "f4f4f5", "e4e4e7", "3253dc", "111111"],
    styles: ["corporate", "monochrome"],
  },
];

export const TRENDING_PALETTES: TrendingPalette[] = ROWS.map(
  ([name, likes, colors, styles]) => ({
    name,
    likes,
    colors: colors.split("-"),
    styles: styles.split(" "),
  }),
);
