import React from 'react';
import '../ProductCard/ProductCard.scss';
import { renderProducts } from '../../helpers/helpers';

const ProductList = React.memo(({
  currency = '$',
  cartProducts = null,
  onProductClick = () => undefined,
  products = [],
}) => {
  return (renderProducts(
    products,
    currency,
    cartProducts,
    onProductClick,
  ));
});

export default ProductList;
