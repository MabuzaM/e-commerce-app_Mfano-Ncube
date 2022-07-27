import { Link } from 'react-router-dom';
import React from 'react';
import cn from 'classnames';
import InCartIcon from '../icons-svg/InCartIcon.svg';

export const renderPrice = (prices, currency) => {
  return prices?.find(price => price.currency.symbol === currency).amount;
}

export const renderProducts = (products, currency, productsInCart, stateSetter=() => undefined) => {
  return products.map((product) => {
    const {
      id,
      gallery,
      prices,
      name,
    } = product;

    const addedToCart = productsInCart?.find(cartProduct => cartProduct.id === product.id)

    return (
        <div className="ProductCard" key={id}>
          <Link
            disabled={!product.inStock}
            to={`/productid/:${id}`}
            className={cn("ProductCard__link", {"ProductCard__outofstock--disabled": !product.inStock})}
            onClick={() => stateSetter(product, id)}
          >
            <div className="ProductCard__image-wrapper">
              <img
                src={gallery[Math.floor(Math.random() * gallery.length)]}
                alt={name}
                className="ProductCard__image"
              />
              
              <img
                src={InCartIcon}
                alt="In cart indicator"
                className={cn("ProductCard__icon", {"ProductCard__icon--visible": addedToCart})}
              />
            </div>
            
            <p className="ProductCard__title">
              {name}
            </p>
            <p className="ProductCard__price">
              {currency}{renderPrice(prices, currency)}
            </p>
          </Link>
          <div className={cn(
            "ProductCard__outofstock",
            {"ProductCard__outofstock--disabled": !product.inStock}
          )}>
            <p className="ProductCard__outofstock--text">Out of stock</p>
          </div>
        </div>
    );
  })
};

export const calculateCartTotal = (productsInCart, currency) => {
  const itemTotalPrices = productsInCart
    ?.map(product => product.prices
      ?.find(price => price.currency.symbol === currency)?.amount * product.itemCount);

  return itemTotalPrices
    .reduce((total1, total2) => total1 + total2, 0)
    .toFixed(2);
}

export const getItemsTotal = (productsInCart) => {
  return productsInCart.map(product => product.itemCount)
    .reduce((productCount1, productCount2) => productCount1 + productCount2, 0)
    .toFixed(2);
}
