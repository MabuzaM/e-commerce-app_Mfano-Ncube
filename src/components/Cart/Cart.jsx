import React from 'react';
import { CartButton } from '../CartButton/CartButton';
import './Cart.scss';
import cn from 'classnames';
import { Link } from 'react-router-dom';
import { calculateCartTotal, renderPrice, getItemsTotal } from '../../helpers/helpers';

export const getItemCount = (newItemCount) => {
  return newItemCount;
};

export class Cart extends React.PureComponent {
  state = {
    itemQuant: 0,
    imgUrlIndex: 0,
    cartProducts: [],
    selectedProduct: null,
  };

  constructor(props) {
    super(props)
    props = {
      productsInCart: [],
      currency: '$',
      changeCartQuantity: () => undefined,
      onDeleteItem: () => undefined,
    };
  }

  componentDidMount() {
    this.setState({
      cartProducts: [...this.props.productsInCart],
      itemQuant: this.state.itemQuant + this.props.quantity,
    })
  }

  decrementItemCount = (cartItem, itemPrice) => {
    const itemInCart = this.state.cartProducts.find(product => product.id === cartItem.id);

    if (itemInCart && itemInCart.itemCount >= 1) {
      itemInCart.itemCount--;
      itemInCart.price = itemInCart.price -= itemPrice;
      this.setState({
        cartProducts: [...this.state.cartProducts.filter(cartProduct => cartProduct.id !== itemInCart.id), itemInCart],
        itemQuant: this.state.itemQuant - 1,
      });

      this.props.changeCartQuantity(this.state.itemQuant);
    }

    if (itemInCart.itemCount === 0) {
      this.props.onDeleteItem(itemInCart);
    }
  }

  incrementItemCount = (cartItem, itemPrice) => {
    const itemInCart = this.state.cartProducts.find(product => product.id === cartItem.id);

    if (itemInCart) {
      itemInCart.itemCount++;
      itemInCart.price = itemInCart.price += itemPrice;
      this.setState({
        cartProducts: [...this.state.cartProducts.filter(cartProduct => cartProduct.id !== itemInCart.id), itemInCart],
        itemQuant: this.state.itemQuant + 1,
      });

      this.props.changeCartQuantity(this.state.itemQuant);
    }
  }

  slideThroughImages = (operator, gallery) => {
    if (this.state.imgUrlIndex >= 0 && this.state.imgUrlIndex < gallery.length - 1) {
      switch(operator) {
        case '+':
          this.setState({imgUrlIndex: this.state.imgUrlIndex + 1});
          break;
        
        case '-':
          this.setState({imgUrlIndex: this.state.imgUrlIndex - 1});
          break;

        default:;
      }
    } else {
      this.setState({imgUrlIndex: 0});
    }
  };

  render () {
    const {
      imgUrlIndex,
      cartProducts,
      selectedProduct,
    } = this.state;

    const { 
      productsInCart,
      currency,
    } = this.props;

    const cartTotal = calculateCartTotal(productsInCart, currency);

    return (
      <>
        <article className="Cart">
          <div className="Item Cart__item">
            <hr className="Cart__line"/>
            {
              cartProducts.length === 0
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
                                          onClick={() => this.setState({item2Id: item.id})}
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
                                onClick={() => this.incrementItemCount(product, itemPrice)}
                              >
                                +
                              </div>
                              <p className="Item__quant">{product.itemCount}</p>
                              <div
                                className="Item__decrease"
                                onClick={() => this.decrementItemCount(product, itemPrice)}
                              >
                                -
                              </div>
                            </div>
                            <div className="Item__image-slider">
                              <img src={
                                imgUrlIndex < 0
                                  ? (gallery[0])
                                  : (gallery[imgUrlIndex])
                              } alt="Item" className="Item__image" />
                              <div className="Item__slider-controls">
                                <div className="Item__slider-controls--previous" onClick={() => {
                                    this.setState({selectedProduct: product});
                                    this.slideThroughImages('-', selectedProduct?.gallery);
                                  }}>&lt;</div>
                                <div className="Item__slider-controls--next" onClick={() => {
                                  this.setState({selectedProduct: product});
                                  this.slideThroughImages('+', selectedProduct?.gallery);
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
  }
}
