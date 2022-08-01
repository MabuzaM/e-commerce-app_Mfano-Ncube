import React, { useEffect, useState } from 'react';
import './Navbar.scss';
import logo from '../../icons-svg/a-logo.svg';
import cart from '../../icons-svg/empty-cart.svg';
import { CATEGORIES_QUERY, CURRENCIES_QUERY, client } from '../../graphQL/graphQL';
import { NavLink } from 'react-router-dom';

export const Navbar = React.memo(({
  onSelectClick,
  productCount = 0,
  showCartOverlay,
  hideCartOverlay,
}) => {
  const [categories, setCategories] = useState([]);
  const [currencies, setCurrencies] = useState([]);

  useEffect(() => {
    client.query({
      query: CATEGORIES_QUERY,
    }).then(({loading, error, data }) => {
      setCategories(data.categories);
    }) 

    client.query({
      query: CURRENCIES_QUERY,
    }).then(({loading, error, data }) => {
      setCurrencies(data.currencies);
    }) 
  });
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
            onMouseEnter={() => showCartOverlay()}
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
});
