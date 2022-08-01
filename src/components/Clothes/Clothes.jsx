import React, { useEffect, useState } from 'react';
import { renderProducts } from '../../helpers/helpers';

const Clothes = React.memo(({
  currency = '$',
  cartProducts = null,
  onProductClick = () => undefined,
  products = [],
}) => {
  const [clothes, setClothes] = useState([]);

  useEffect(() => {
    setClothes(products.filter(product => product.category === 'clothes'));
  }, [products]);

  return (
    renderProducts(
      clothes,
      currency,
      cartProducts,
      onProductClick
    )
  );
});

export default Clothes;
