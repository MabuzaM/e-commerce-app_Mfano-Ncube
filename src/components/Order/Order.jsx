import React from 'react';
import './Order.scss';
import { calculateCartTotal, getItemsTotal } from '../../helpers/helpers';

export class Order extends React.PureComponent {
  state = {
    productsInCart: [],
  }

  constructor(props) {
    super(props)
    props = {
      orderItems: [],
      currency: '$',
    }
  }

  componentDidMount() {
    this.setState({productsInCart: [ ...this.props.orderItems ]})
  }
  render() {
    const { productsInCart } = this.state;
    const { currency } = this.props;

    const orderTotal = calculateCartTotal(productsInCart, currency);

    return (
      <>
        <article className="Order">
          <h2 className="Order__title">Your order details</h2>

          <p className="Order__text">Thank you for your business.</p>

          <hr />

          <table className="Order__table">
            <thead className="Order__table-heading">
              <th className="Order__table-heading--title">Quantity</th>
              <th className="Order__table-heading--title">Item</th>
              <th className="Order__table-heading--title">Amount</th>
              <th className="Order__table-heading--title">Color</th>
              <th className="Order__table-heading--title">Other Details</th>
            </thead>
            <tbody>
              {
                productsInCart.map(product => (
                  <tr className="Order__table-row" key={product.id}>
                    <td className="Order__table-row--data">{product.itemCount}</td>
                    <td className="Order__table-row--data">{product.name}</td>
                    <td className="Order__table-row--data">{product.price}</td>
                    <td className="Order__table-row--data">{product.selectedColor || 'None'}</td>
                    <td className="Order__table-row--data">
                      {
                        Object.entries(product.selectedAttributes)
                        .join('  |  ') || 'None'                      
                      }
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>

          <div className="Cart__summary">
            <p className="Cart__tax">Tax 21%: 
              <span className="Cart__summary--value">
                {` ${currency} ${((21 / 100) * orderTotal).toFixed(2)}`}
              </span>
            </p>

            <p className="Cart__quantity">Quantity:
              <span className="Cart__summary--value">
                {` ${getItemsTotal(productsInCart)}`}
              </span>
            </p>

            <p className="Cart__total">Total: 
              <span className="Cart__summary--value">
                {` ${currency} ${orderTotal}`}
              </span>
            </p>
          </div>
        </article>
      </>
    )
  }
}
