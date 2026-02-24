import { swatch, fileIcon, gear, logoShirt, stylishShirt } from "../assets";

export const EditorTabs = [
  {
    name: "colorpicker",
    icon: swatch,
  },
  {
    name: "filepicker",
    icon: fileIcon,
  },
  {
    name: "logosizepicker",
    icon: gear,
  },
];

export const FilterTabs = [
  {
    name: "logoShirt",
    icon: logoShirt,
  },
  {
    name: "stylishShirt",
    icon: stylishShirt,
  },
];

export const DecalTypes = {
  logo: {
    stateProperty: "logoDecal",
    filterTab: "logoShirt",
  },
  full: {
    stateProperty: "fullDecal",
    filterTab: "stylishShirt",
  },
};

// Curated shirt design presets used by the PresetCollection UI
export const PresetDesigns = [
  {
    id: "classic-brand",
    name: "Classic Brand",
    description: "Warm gold tee with the Xilla logo as a clean chest print.",
    thumbnail: logoShirt,
    color: "#EFBD48",
    logoDecal: "/XillaLogo.png",
    fullDecal: "/XillaLogo.png",
    isLogoTexture: true,
    isFullTexture: false,
    logoSize: 0.12,
    badge: "Recommended",
  },
  {
    id: "minimal-mono",
    name: "Minimal Mono",
    description: "Soft charcoal base with a subtle monochrome logo.",
    thumbnail: stylishShirt,
    color: "#1f2933",
    logoDecal: "/XillaLogo.png",
    fullDecal: "/XillaLogo.png",
    isLogoTexture: true,
    isFullTexture: false,
    logoSize: 0.08,
    badge: "Minimal",
  },
  {
    id: "full-print",
    name: "Full Print",
    description: "High-impact full-shirt artwork powered by your decal.",
    thumbnail: stylishShirt,
    color: "#ffffff",
    logoDecal: "/XillaLogo.png",
    fullDecal: "/threejs.png",
    isLogoTexture: false,
    isFullTexture: true,
    logoSize: 0.1,
    badge: "Bold",
  },
  {
    id: "frost-blue",
    name: "Frost Blue",
    description: "Cool ice-blue tee for tech and esports drops.",
    thumbnail: stylishShirt,
    color: "#3B82F6",
    logoDecal: "/XillaLogo.png",
    fullDecal: "/XillaLogo.png",
    isLogoTexture: true,
    isFullTexture: false,
    logoSize: 0.11,
    badge: "New",
  },
  {
    id: "night-runner",
    name: "Night Runner",
    description: "Deep navy base with a bright chest logo that pops.",
    thumbnail: stylishShirt,
    color: "#020617",
    logoDecal: "/XillaLogo.png",
    fullDecal: "/XillaLogo.png",
    isLogoTexture: true,
    isFullTexture: false,
    logoSize: 0.13,
    badge: "Limited",
  },
  {
    id: "aurora-green",
    name: "Aurora Green",
    description: "Fresh neon-green tee perfect for streetwear brands.",
    thumbnail: stylishShirt,
    color: "#22C55E",
    logoDecal: "/XillaLogo.png",
    fullDecal: "/XillaLogo.png",
    isLogoTexture: true,
    isFullTexture: false,
    logoSize: 0.1,
    badge: "Trending",
  },
  {
    id: "graphite-matte",
    name: "Graphite Matte",
    description: "Matte dark grey tee with understated branding.",
    thumbnail: stylishShirt,
    color: "#4B5563",
    logoDecal: "/XillaLogo.png",
    fullDecal: "/XillaLogo.png",
    isLogoTexture: true,
    isFullTexture: false,
    logoSize: 0.09,
    badge: "Essential",
  },
];