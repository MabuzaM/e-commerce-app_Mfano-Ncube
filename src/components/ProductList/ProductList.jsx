import React from 'react';
import '../ProductCard/ProductCard.scss';
import { renderProducts } from '../../helpers/helpers';

class ProductList extends React.PureComponent {
  constructor(props) {
    super(props)
    props = {
      currency: '$',
      cartProducts: null,
      onProductClick: () => undefined,
      products: [],
    };    
  }

  render () {
    const {
      currency,
      products,
      cartProducts,
      onProductClick
    } = this.props;

    return (renderProducts(
        products,
        currency,
        cartProducts,
        onProductClick,
      ));
  }

}

export default ProductList;
