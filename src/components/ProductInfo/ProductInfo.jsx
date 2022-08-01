import React, { useState, useEffect } from 'react';
import './ProductInfo.scss';
import '../CartButton/CartButton.scss'
import cn from 'classnames';
import { renderPrice } from '../../helpers/helpers';

export const ProductInfo = React.memo(({
  products = [],
  currency = '$',
  onAddToCart,
  selectedProductId = '',
}) => {
  const [product, setProduct] = useState(null);
  const [imageSrc, setImageSrc] = useState('');
  const [colorId, setColorId] = useState('');
  const [otherAttributes, setOtherAttributes] = useState({});
  const [isVisible, setIsVisibe] = useState(false);

  useEffect (() => {
    if (products) {
      setProduct({...products.find(product => {
        setImageSrc(product.gallery[0]);
        return product.id === selectedProductId;
      })});
    }
  }, [products, selectedProductId]);

  const colorIdSetter = (id) => {
    setColorId(id);
  };

  const otherAttributesIdSetter = (name, id) => {
    setOtherAttributes({...otherAttributes, [name]: id});
  };

  return (
    <article className="ProductInfo">
      <div className="ProductInfo__gallery">
        <div className="ProductInfo__icon-wrapper">
        {
          product?.gallery?.map(image => (
            <img
              key={image}
              src={image}
              alt={product.name}
              className="ProductInfo__icon"
              onClick={() => {
                setImageSrc(image)
              }}
            />
          ))
        }
        </div>

        <div className="ProductInfo__image-wrapper">
          <img
            src={imageSrc}
            alt={product?.name}
            className="ProductInfo__image" />
        </div>
      </div>

      <div className="ProductInfo__item Item__info">
        <p className={cn(
            "ProductInfo__success-message",
            {"ProductInfo__success-message--visible": isVisible}
          )}>
            Successfully added to cart
        </p>

        <h3 className="Item__title">{product?.name}</h3>

        <div className="Item__description">
          {product?.brand}
        </div>

        <div className="Item__attribute">
          {
            product?.attributes?.map((attribute) => {
              return <React.Fragment>
                <p className="Item__attribute-title">{attribute.name}:</p>
                <div className="Item__attribute-wraper" key={attribute.id}>
                {
                  attribute?.items?.map((item) => {
                    if (attribute.name !== 'Color') {
                      return <div
                        className={cn(
                          "Item__attribute-other",
                          {"Item__attribute-other--isActive": otherAttributes[attribute.name] === item.id},
                        )}
                  
                        onClick={() => {
                          otherAttributesIdSetter(attribute.name, item.id)
                        }}
                      >
                        {item.displayValue}
                      </div>
                    }
                      return <div
                        key={item.id}
                        className={cn(
                          "Item__attribute-color",
                          {"Item__attribute-color--isActive": colorId === item.id}
                        )}
                        style={{
                          backgroundColor: item.value,
                        }}
                        onClick={() => {
                          colorIdSetter(item.id)
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

        <div className="Item__price">
          <p className="Item__price--title">Price:</p>

          <p className="Item__price--value">
            {currency}
            {renderPrice(product?.prices, currency)}
          </p>
        </div>

        <button
          className="CartButton"
          type="button"
          onClick={() => {
            onAddToCart(
              colorId,
              otherAttributes,
              renderPrice(product?.prices, currency),
              setIsVisibe(true),
            )
          }}
          onMouseOut={() => setIsVisibe(false)}
        >
          Add to cart
        </button>

        <div
          className="ProductInfo__text"
          dangerouslySetInnerHTML={
            {__html: product?.description && (product.description)}
          }
        />
      </div>
  </article>);
});
