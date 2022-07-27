import React from 'react';
import './Navbar.scss';
import logo from '../../icons-svg/a-logo.svg';
import cart from '../../icons-svg/empty-cart.svg';
import { CATEGORIES_QUERY, CURRENCIES_QUERY, client } from '../../api/api';
import { NavLink } from 'react-router-dom';

export class Navbar extends React.PureComponent {
  state = {
    categories: [],
    currencies: [],
  }

  constructor(props) {
    super(props)
    props = {
      onSelectClick: () => undefined,
      productCount: 0,
      showCartOverlay: () => undefined,
      hideCartOverlay: () => undefined,
    };
  }

  componentDidMount() {
    client.query({
      query: CATEGORIES_QUERY,
    }).then(({loading, error, data }) => {
      this.setState({categories: data.categories})
    }) 

    client.query({
      query: CURRENCIES_QUERY,
    }).then(({loading, error, data }) => {
      this.setState({currencies: data.currencies})
    })  
  }

  render () {
    const { categories, currencies } = this.state;
    const {
      showCartOverlay,
      onSelectClick,
      productCount,
      hideCartOverlay,
    } = this.props;

    return (
      <>
        <nav className="Nav">
          <ul className="Nav__list">
            {
              categories.map(({ name }) => (
                <li key={name} className="Nav__item">
                  <NavLink to={name} className="Nav__link">
                    {name}
                  </NavLink>
                </li>
              ))
            }
          </ul>
        </nav>

        <NavLink to="all" className="Nav__logo">
          <img src={logo} alt="a logo" />
        </NavLink>

        <article className="Nav__controls">
          <select
            name="currency"
            id="currency"
            className="Nav__currency-switcher"
            onClick={onSelectClick}
          >
            {
              currencies.map(({ label, symbol }) => (
                <option 
                  key={label} 
                  value={symbol}>
                    {symbol} {' '} 
                    {label}
                </option>
              ))
            }
          </select>

          
            <div
              className="Nav__cart"
              onMouseOver={() => showCartOverlay()}
              onClick={() => hideCartOverlay()}
              >
              <NavLink to="cart" className="Nav__cart-link">
                <div className="Nav__cart-count">{productCount}</div>
                <img src={cart} alt="cart" className="Nav__cart-image"/>
              </NavLink>
            </div>
        </article>
      </>
    );
  }
}
