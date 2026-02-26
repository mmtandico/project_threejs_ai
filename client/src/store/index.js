import { proxy } from 'valtio';

const state = proxy({
  intro: true,
  // What is currently shown in the main 3D canvas: 'shirt' or 'avatar'
  viewMode: 'shirt',
  // Which avatar model to show in avatar mode: 'male' | 'female'
  avatarGender: 'male',
  color: '#EFBD48',
  // Legacy support - keeping for backward compatibility
  isLogoTexture: true,
  isFullTexture: false,
  logoDecal: '/XillaLogo.png',
  fullDecal: '/XillaLogo.png',
  logoSize: 0.1,
  logoOffsetX: 0,
  logoOffsetY: 0,
  logoRotation: 0, // degrees
  // New multi-layer system
  layers: [
    {
      id: 'layer-1',
      name: 'Front logo',
      image: '/XillaLogo.png',
      visible: true,
      size: 0.1,
      offsetX: 0,
      offsetY: 0,
      rotation: 0,
      type: 'logo', // 'logo' | 'full' | 'text'
      text: '',
      textColor: '#ffffff',
      fontWeight: 'normal',
      fontStyle: 'normal',
      fontFamily: 'sans-serif',
      outlineEnabled: false,
    },
  ],
  // User-uploaded images that can be reused in designs
  uploadedImages: [], // { id, src, name }
});

export default state;