import './CartButton.scss';
import React from 'react';

export class CartButton extends React.PureComponent {
  constructor(props) {
    super(props)
    props = {
      buttonText: '',
      backgroundColor: '' || '#5ece7b',
      borderColor: '' || 'transparent',
      color: '',
    }
  }
  render() {
    const {
      buttonText,
      backgroundColor,
      borderColor,
      color,
    } = this.props;

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
  }
};
