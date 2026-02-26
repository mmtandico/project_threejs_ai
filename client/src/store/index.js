import { proxy } from 'valtio';

const state = proxy({
  intro: true,
  // What is currently shown in the main 3D canvas: 'shirt' or 'avatar'
  viewMode: 'shirt',
  // Which avatar model to show in avatar mode: 'male' | 'female'
  avatarGender: 'male',
  // Avatar body composition properties
  avatarBodyType: 'athletic', // 'athletic' | 'slim' | 'average' | 'muscular' | 'curvy'
  avatarHeight: 170, // cm
  avatarWeight: 65, // kg
  avatarWaistLine: 80, // cm (optional)
  avatarChestCircumference: 95, // cm (optional)
  avatarHipCircumference: 90, // cm (optional)
  avatarShoulderWidth: 42, // cm (optional)
  avatarSkinColor: '#ffddb3',
  avatarHairType: 'straight', // 'straight' | 'curly' | 'bald'
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
      placement: 'front', // 'front' | 'back' | 'leftShoulder' | 'rightShoulder'
    },
  ],
  // Optional shirt measurement notes (for sewing / production)
  shirtDetails: {
    shoulderWidth: '',
    neckCircumference: '',
    chestCircumference: '',
    waistCircumference: '',
    hipToShoulder: '',
    shirtLength: '',
    sleeveLength: '',
  },
  // Bump this whenever designs are saved so the ModelLibrary "My" tab can refresh.
  designsVersion: 0,
  // User-uploaded images that can be reused in designs
  uploadedImages: [], // { id, src, name }
  // Locally saved designs for the current session (shown under Library → "My")
  localDesigns: [], // { id, name, color, logoUrl, textureUrl, isLogoTexture, isFullTexture, layers, shirtDetails, sizeLabel }
});

export default state;