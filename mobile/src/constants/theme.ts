/**
 * The website's colours, carried over from src/app/globals.css so the app and
 * the site read as one brand. Light is the site; dark is the site's app
 * theme (neutral greys, the accents the only colour on screen).
 */
export const Colors = {
  light: {
    canvas: '#fbfcfc',
    surface: '#ffffff',
    mist: '#f2f6f8',
    line: '#e4eaee',
    ink: '#0e1b26',
    inkSoft: '#4c5a66',
    inkFaint: '#7c8894',
    brand: '#1fa5de',
    brandDeep: '#147fae',
    brandWash: '#e9f6fd',
    /** Fill behind white labels: the brand blue itself is too light for them. */
    brandSolid: '#10688f',
    onBrandSolid: '#ffffff',
    leafDeep: '#4c9c2e',
    leafWash: '#eefae7',
    amberDeep: '#d8801f',
    amberWash: '#fdf3e6',
    danger: '#c0392b',
  },
  dark: {
    canvas: '#0b0c0e',
    surface: '#16181d',
    mist: '#101216',
    line: '#2b2e35',
    ink: '#eceef1',
    inkSoft: '#a6a9b2',
    inkFaint: '#71747d',
    brand: '#1fa5de',
    brandDeep: '#4cc0f0',
    brandWash: '#10222c',
    brandSolid: '#4cc0f0',
    onBrandSolid: '#0b0c0e',
    leafDeep: '#7ed957',
    leafWash: '#16241a',
    amberDeep: '#f5a44a',
    amberWash: '#261d12',
    danger: '#ff8f80',
  },
} as const;

export type Palette = { [K in keyof typeof Colors.light]: string };

/** Schibsted Grotesk, the site's sans, in the weights the app uses. */
export const Fonts = {
  regular: 'SchibstedGrotesk_400Regular',
  medium: 'SchibstedGrotesk_500Medium',
  semibold: 'SchibstedGrotesk_600SemiBold',
  bold: 'SchibstedGrotesk_700Bold',
} as const;

export const Space = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48 } as const;

/** One radius scale: 14 for cards and panels, full pills for chips and buttons. */
export const Radius = { card: 14, pill: 999 } as const;
