import React from 'react';

export const CollegeLogo = ({ size = 56, className = '', alt = "MPNMJEC Emblem" }) => {
  return (
    <img
      src="/image.png"
      alt={alt}
      width={size}
      height={size}
      style={{ width: size, height: size }}
      className={`object-contain select-none shrink-0 transition-transform duration-200 hover:scale-105 ${className}`}
      loading="eager"
    />
  );
};

export default CollegeLogo;
