import React, { useEffect, useState } from 'react';
import { CartButton } from '../CartButton/CartButton';
import './Cart.scss';
import cn from 'classnames';
import { Link } from 'react-router-dom';
import recycle from '../../icons-svg/recycle.png';
import {
  calculateCartTotal,
  renderPrice,
  getItemsTotal,
} from '../../helpers/helpers';

export const Cart = React.memo(({
  productsInCart = [],
  currency = '$',
  changeCartQuantity = () => undefined,
  onDeleteItem = () => undefined,
  quantity = 0,
}) => {
  const [itemQuant, setItemQuant] = useState(0);
  const [imgUrlIndex, setImgUrlIndex] = useState(0);
  const [cartProducts, setCartProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    setCartProducts([...productsInCart]);
    setItemQuant((itemQuant) => itemQuant + quantity,)
  }, [productsInCart, quantity]);

  const decrementItemCount = (cartItem, itemPrice) => {
    const itemInCart = cartProducts.find(product => product.id === cartItem.id);

    if (itemInCart && itemInCart.itemCount >= 1) {
      itemInCart.itemCount--;
      itemInCart.price = itemInCart.price -= itemPrice;

      setCartProducts([...cartProducts.filter(cartProduct => cartProduct.id !== itemInCart.id)]);
      setItemQuant((itemQuant) => itemQuant - 1);

      changeCartQuantity(itemQuant);
    }

    if (itemInCart.itemCount === 0) {
      onDeleteItem(itemInCart);
    }
  }

  const incrementItemCount = (cartItem, itemPrice) => {
    const itemInCart = cartProducts.find(product => product.id === cartItem.id);

    if (itemInCart) {
      itemInCart.itemCount++;
      itemInCart.price = itemInCart.price += itemPrice;

      setCartProducts([...cartProducts.filter(cartProduct => cartProduct.id !== itemInCart.id)]);
      setItemQuant((itemQuant) => itemQuant + 1);

      changeCartQuantity(itemQuant);
    }
  }

  const slideThroughImages = (operator, gallery =[]) => {
    if (imgUrlIndex >= 0 && imgUrlIndex < gallery.length - 1) {
      switch(operator) {
        case '+':
          setImgUrlIndex((imgUrlIndex) => imgUrlIndex + 1);
          break;
        
        case '-':
          setImgUrlIndex((imgUrlIndex) => imgUrlIndex - 1);
          break;

        default:;
      }
    } else {
      setImgUrlIndex(0);
    }
  };
  const cartTotal = calculateCartTotal(productsInCart, currency);

  return (
    <>
      <article className="Cart">
        <div className="Item Cart__item">
          <hr className="Cart__line"/>
          {
            cartProducts?.length === 0
              ?  (
                    <>
                      <p className="Cart__text">Your cart is empty</p>
                    </>
                )
                :  (productsInCart?.map(product => {
                  const {
                    id,
                    name,
                    brand,
                    prices,
                    gallery,
                    attributes,                
                  } = product;

                  const itemPrice = renderPrice(prices, currency);
                  return (
                    <>
                    <div className="Item__details" key={id}>
                      <div className="Item__info">
                        <h3 className="Item__title">{name}</h3>
                        <p className="Item__description">{brand}</p>
                        <p className="Item__price">
                          {currency}
                          {
                            itemPrice
                          }
                        </p>
          
                        <div className="Item__attribute">
                          {
                            attributes?.map((attribute) => {
                              return <React.Fragment key={attribute.id}>
                                <p className="Item__attribute-title" key={attribute.id}>{attribute.name}:</p>
                                <div className="Item__attribute-wraper">
                                {
                                  attribute?.items?.map((item) => {
                                    if (attribute.name !== 'Color') {
                                      return <div
                                        className={cn(
                                          "Item__attribute-other",
                                          {"Item__attribute-other--isActive": product.selectedAttributes[attribute.name] === item.id}
                                        )}
                                      >
                                        {item.displayValue}
                                      </div>
                                    }
                                      return <div
                                        key={item.id}
                                        className={cn(
                                          "Item__attribute-color",
                                          {"Item__attribute-color--isActive": product.selectedColor === item.id}
                                        )}
                                        style={{
                                          backgroundColor: item.value,
                                        }}
                                      >
                                      </div>
                                    })
                                  }
                                  </div>
                                </React.Fragment>
                              })
                            }
                          </div>
                        </div>
            
                        <div className="Item__extra">
                          <div className="Item__quantity-controls">
                            <div
                              className="Item__increase"
                              onClick={() => incrementItemCount(product, itemPrice)}
                            >
                              +
                            </div>
                            <p className="Item__quant">{product.itemCount}</p>
                            <div
                              className="Item__decrease"
                              onClick={() => decrementItemCount(product, itemPrice)}
                            >
                              {
                                product.itemCount === 1
                                  ? (<img src={recycle} alt='recycle' className="Item__remove-icon"/>)
                                  : ('-')
                              }
                            </div>
                          </div>
                          <div className="Item__image-slider">
                            <img src={
                              imgUrlIndex < 0
                                ? (gallery && (gallery[0]))
                                : (gallery && (gallery[imgUrlIndex]))
                            } alt="Item" className="Item__image" />
                            <div className="Item__slider-controls">
                              <div className="Item__slider-controls--previous" onClick={() => {
                                  setSelectedProduct(product);
                                  slideThroughImages('-', selectedProduct?.gallery);
                                }}>&lt;</div>
                              <div className="Item__slider-controls--next" onClick={() => {
                                setSelectedProduct(product);
                                slideThroughImages('+', selectedProduct?.gallery);
                              }}>&gt;</div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <hr className="Cart__line" />
                    </>
                  );
                }))
              }
        </div>

        <div className="Cart__summary">
          <p className="Cart__tax">Tax 21%: 
            <span className="Cart__summary--value">
              {` ${currency} ${((21 / 100) * cartTotal).toFixed(2)}`}
            </span>
          </p>

          <p className="Cart__quantity">Quantity:
            <span className="Cart__summary--value">
              {` ${getItemsTotal(productsInCart)}`}
            </span>
          </p>

          <p className="Cart__total">Total: 
            <span className="Cart__summary--value">
              {` ${currency} ${cartTotal}`}
            </span></p>
          {
            productsInCart.length === 0
              ? (
                  <Link to="/all" className="Cart__button-link">
                    <CartButton
                      buttonText={'Continue shopping'}
                      backgroundColor={'#5ece7b'}
                    />
                  </Link>
                )
              : (
                  <Link to="/order" className="Cart__button-link">
                    <CartButton
                      buttonText={'Order'}
                      backgroundColor={'#5ece7b'}
                    />
                  </Link>
                )
          }
        </div>
      </article>
    </>
  );
});
