import React, { useEffect, useState } from 'react';
import { renderProducts } from '../../helpers/helpers';

const Tech = React.memo(({
  currency = '$',
  cartProducts = null,
  onProductClick = () => undefined,
  products = [],
}) => {
  const [tech, setTech] = useState([]);

  useEffect(() => {
    setTech(products.filter(product => product.category === 'tech'));
  }, [products]);

  useEffect(() => {
    setTech(products.filter(product => product.category === 'tech'));
  }, [products]);

  return (
    renderProducts(
      tech,
      currency,
      cartProducts,
      onProductClick
    )
  );
});

export default Tech;
