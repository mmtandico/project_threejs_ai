import { proxy } from 'valtio';

const state = proxy({
  intro: true,
  color: '#EFBD48',
  isLogoTexture: true,
  isFullTexture: false,
  logoDecal: '/XillaLogo.png',
  fullDecal: '/XillaLogo.png',
  logoSize: 0.1,
  // Logo placement controls (relative offsets & rotation)
  logoOffsetX: 0,
  logoOffsetY: 0,
  logoRotation: 0, // degrees
  // User-uploaded images that can be reused in designs
  uploadedImages: [], // { id, src, name }
});

export default state;