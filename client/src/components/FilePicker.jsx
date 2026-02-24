import React from 'react';

import CustomButton from './CustomButton';

const FilePicker = ({ file, setFile, readFile, uploadedImages = [], applyUploadedImage }) => {
  const triggerUpload = () => {
    const input = document.getElementById('file-upload');
    if (input) input.click();
  };

  return (
    <div className="filepicker-container flex flex-col gap-3">
      {/* Primary upload button */}
      <div>
        <input
          id="file-upload"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <CustomButton
          type="fixed"
          title="Upload image"
          handleClick={triggerUpload}
          customStyles="w-full text-xs font-semibold bg-sky-500 text-slate-900"
        />
        {file && (
          <p className="mt-1 text-gray-500 text-[10px] truncate">
            Selected: {file.name}
          </p>
        )}
      </div>

      {/* Apply current selection quickly */}
      {file && (
        <div className="flex flex-wrap gap-2">
          <CustomButton
            type="outline"
            title="Use as logo"
            handleClick={() => readFile('logo')}
            customStyles="text-[10px]"
          />
          <CustomButton
            type="filled"
            title="Use as full"
            handleClick={() => readFile('full')}
            customStyles="text-[10px]"
          />
        </div>
      )}

      {/* Uploaded images gallery */}
      <div className="mt-2 border-t border-gray-200 pt-2 flex-1 min-h-0">
        <p className="text-[11px] font-semibold text-gray-700 mb-2">
          Uploaded images
        </p>
        {uploadedImages.length === 0 ? (
          <p className="text-[10px] text-gray-500">
            No uploads yet. Use the button above to add images you can reuse in designs.
          </p>
        ) : (
          <div className="grid grid-cols-3 gap-2 max-h-40 overflow-y-auto custom-scrollbar">
            {uploadedImages.map((img) => (
              <button
                key={img.id}
                type="button"
                onClick={() => applyUploadedImage?.('logo', img.src)}
                className="relative w-full aspect-square rounded-md overflow-hidden border border-gray-200 hover:border-sky-400"
              >
                <img
                  src={img.src}
                  alt={img.name || 'Upload'}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FilePicker;