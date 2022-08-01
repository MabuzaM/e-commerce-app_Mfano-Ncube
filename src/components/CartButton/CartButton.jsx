import './CartButton.scss';
import React from 'react';

export const CartButton = React.memo(({
  buttonText = '',
  backgroundColor = '' || '#5ece7b',
  borderColor = '' || 'transparent',
  color = '',
}) => {
  return (
    <button
      className="CartButton"
      type="button"
      style={{
        backgroundColor: backgroundColor,
        borderColor: borderColor,
        color: color,
      }}
    >
      {buttonText}
    </button>
  );
});
