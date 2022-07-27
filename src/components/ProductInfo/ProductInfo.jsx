import React from 'react';
import './ProductInfo.scss';
import '../CartButton/CartButton.scss'
import cn from 'classnames';
import { renderPrice } from '../../helpers/helpers';

export class ProductInfo extends React.PureComponent {
  state = {
    product: null,
    imageSrc: '',
    colorId: '',
    otherAttributes: {},
  }

  constructor(props) {
    super(props)
    props = {
      currency: "$",
      onAddToCart: () => undefined,
    }
  }

  componentDidMount() {
    if (this.props.products) {
      this.setState({product: {...this.props.products.find(product => {
        this.setState({imageSrc: product.gallery[0]})
        return product.id === this.props.selectedProductId
      })}})
    }
  }

  colorIdSetter = (id) => {
    this.setState({colorId: id})
  };

  otherAttributesIdSetter = (name, id) => {
    this.setState({otherAttributes: {...this.state.otherAttributes, [name]: id}});
  };

  render () {
    const {
      currency,
      onAddToCart,
    } = this.props;

    const {
      product,
      imageSrc,
      colorId,
      otherAttributes,
    } = this.state;

    const {
      colorIdSetter,
      otherAttributesIdSetter,
    } = this;

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
                  this.setState({imageSrc: image})
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
                renderPrice(product?.prices, currency)
              )
            }}
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
  }
}
