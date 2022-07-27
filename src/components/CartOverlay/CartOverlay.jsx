import React from 'react';
import { CartButton } from '../CartButton/CartButton';
import './CartOverlay.scss';
import cn from 'classnames';
import { Link } from 'react-router-dom';
import { calculateCartTotal, renderPrice } from '../../helpers/helpers';

export class CartOverlay extends React.PureComponent {
  state = {
    itemQuant: 0,
    cartProducts: [],
  };

  constructor(props) {
    super(props)
    props = {
      productsInCart: [],
      currency: '$',
      changeCartQuantity: () => undefined,
      onDeleteItem: () => undefined,
      isCartVisible: false,
      hideCartOverlay: () => undefined,
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
    } else {
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

  render () {
    const { 
      productsInCart,
      currency,
      isCartVisible,
      hideCartOverlay,
    } = this.props;

    return (
        <article className={cn("CartOverlay", {"CartOverlay__visible": isCartVisible === true})}>
          <h2 className="CartOverlay__title">
            My Bag, <span className="CartOverlay__title--quantity">{`${productsInCart.length} items`}</span>
          </h2>
          <div className="Overlay-Item CartOverlay__item">
            {
              productsInCart.length === 0
                ?  (
                      <>
                        <p className="CartOverlay__empty-text">Your cart is empty</p>
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
                      <div className="Overlay-Item__details" key={id}>
                        <div className="Overlay-Item__info">
                          <h3 className="Overlay-Item__title">{name}</h3>
                          <p className="Overlay-Item__description">{brand}</p>
                          <p className="Overlay-Item__price">
                            {currency}
                            {prices && (prices?.find(price => price.currency.symbol === currency).amount)}
                          </p>
            
                          <div className="Overlay-Item__attribute">
                            {
                              attributes?.map((attribute) => {
                                return <React.Fragment key={attribute.id}>
                                  <p className="Overlay-Item__attribute-title" key={attribute.id}>{attribute.name}:</p>
                                  <div className="Overlay-Item__attribute-wraper">
                                    {
                                      attribute?.items?.map((item) => {
                                        return attribute.name !== 'Color'
                                          ? (<div
                                            className={cn(
                                              "Overlay-Item__attribute-other",
                                              {"Overlay-Item__attribute-other--isActive": product.selectedAttributes[attribute.name] === item.id}
                                            )}
                                            onClick={() => this.setState({item2Id: item.id})}
                                          >
                                            {item.displayValue}
                                          </div>)
                                          : (<div
                                            key={item.id}
                                            className={cn(
                                              "Overlay-Item__attribute-color",
                                              {"Overlay-Item__attribute-color--isActive": product.selectedColor === item.id}
                                            )}
                                            style={{
                                              backgroundColor: item.value,
                                            }}
                                          >
                                          </div>)
                                      })
                                    }
                                  </div>
                                </React.Fragment>
                              })
                            }
                          </div>
                        </div>
            
                        <div className="Overlay-Item__extra">
                          <div className="Overlay-Item__quantity-controls">
                            <div
                              className="Overlay-Item__increment"
                              onClick={() => this.incrementItemCount(product, itemPrice)}
                            >
                              +
                            </div>
                            <p className="Overlay-Item__quant">{product.itemCount}</p>
                            <div
                              className="Overlay-Item__decrement"
                              onClick={() => this.decrementItemCount(product, itemPrice)}
                            >
                              -
                            </div>
                          </div>
                          <div className="Overlay-Item__image-wrapper">
                            <img
                              src={gallery[0]}
                              alt="Item"
                              className="Overlay-Item__image"
                            />
                          </div>
                        </div>
                      </div>
                    </>
                  );
                }))
              }
        </div>

        <div className="CartOverlay__summary">
          <p className="CartOverlay__total">Total:</p>
          <p className="Cart__summary--value">{` ${currency} ${calculateCartTotal(productsInCart, currency)}`}</p>
        </div>

        <div className="CartOverlay__buttons">
            {
              productsInCart.length === 0
                ? (
                    <Link to="/all" className="CartOverlay__button-link"  onClick={() => hideCartOverlay()}>
                      <CartButton
                        buttonText={'Continue shopping'}
                        backgroundColor={'#5ece7b'}
                        color={'#fff'}
                      />
                    </Link>
                  )
                : (
                    <>
                      <div onClick={() => hideCartOverlay()}>
                        <Link to="cart" className="CartOverlay__button-link">
                          <CartButton
                            buttonText={'View Bag'}
                            backgroundColor={'#fff'}
                            borderColor={'#1d1f22'}
                            color={'#1d1f22'}
                           />
                        </Link>
                      </div>

                      <div>
                        <Link to="/order" className="Cart__button-link"  onClick={() => hideCartOverlay()}>
                        <CartButton
                          buttonText={'Order'}
                          backgroundColor={'#5ece7b'}
                        />
                        </Link>
                      </div>    
                    </>
                  )
            }
          </div>
      </article>
    );
  }
}
