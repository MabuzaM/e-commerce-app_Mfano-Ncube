import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar/Navbar';
import './App.scss';
import ProductList from './components/ProductList/ProductList';
import Clothes from './components/Clothes/Clothes';
import Tech from './components/Tech/Tech';
import { CartOverlay } from './components/CartOverlay/CartOverlay';
import { Cart } from './components/Cart/Cart';
import { ApolloProvider } from 'react-apollo';
import { ProductInfo } from './components/ProductInfo/ProductInfo';
import { client, PRODUCTS } from './graphQL/graphQL';
import {Routes, Route, Navigate} from 'react-router-dom';
import { Order } from './components/Order/Order';
import cn from 'classnames';

const App = React.memo(() => {
  const [selectedCurrency, setSelectedCurrency] = useState('$');
  const [productInfo, setProductInfo] = useState(null);
  const [cartProducts, setCartProducts] = useState([]);
  const [productCount, setProductCount] = useState(0);
  const [products, setProducts] =useState([]);
  const [quantity, setQuantity] = useState(0);
  const [isCartVisible, setIsCartVisible] = useState(false);

  useEffect (() => {
  client.query({
    query: PRODUCTS,
  }).then(({loading, error, data }) => {
    if (loading && !data) return <p>Loading Prodicts...</p>
    if (error) return <p>An error occured: {error}</p>
    setProducts(data.category.products)
  })
  }, [products]
  )

const handleSelectClick = (event) => {
  setSelectedCurrency(event.target.value);
}

const handleShowCartOverlay = () => {
  setIsCartVisible(!isCartVisible);
}

const handleHideCartOverlay = () => {
  setIsCartVisible(false);
}

const handleProductClick = (selectedProduct) => {
  setProductInfo(selectedProduct);
}

const handleAddToCartClick = (color, otherAttributes, price) => {
  const itemInCart = cartProducts.find(product => product.id === productInfo.id)

  if (itemInCart) {
    itemInCart.itemCount++;
    itemInCart.price = itemInCart.price += price;
  
    setQuantity(quantity + 1);
  } else {
    setCartProducts([...cartProducts,
        {...productInfo,
          itemCount: 1,
          selectedColor: color,
          selectedAttributes: otherAttributes,
        }]);

    setProductCount(productCount + 1);
    setQuantity(quantity + 1);  
    }
};

const removeItemFromCart = (itemInCart) => {
  setCartProducts([ ...cartProducts.filter(cartProduct => cartProduct.id !== itemInCart.id)])
}

const changeCartQuantity = (quant) => {
  setQuantity({quant})
}

  return (
    <ApolloProvider client={client}>
      <div className="App">
        <header className="App__header">
          <Navbar
            onSelectClick={handleSelectClick}
            productCount={cartProducts.length}
            showCartOverlay={handleShowCartOverlay}
            hideCartOverlay={handleHideCartOverlay}
          />
        </header>

        <main className="App__main">
          <div className={cn("App__background", {"App__background--visible": isCartVisible})}>
            <CartOverlay
              productsInCart={cartProducts}
              currency={selectedCurrency}
              changeCartQuantity={changeCartQuantity}
              onDeleteItem={removeItemFromCart}
              isCartVisible={isCartVisible}
              hideCartOverlay={handleHideCartOverlay}
              quantity={quantity}
            />              
          </div>

          <Routes>
            <Route
              path="all"
              element={
                <>
                  <h1 className="App__heading">ALL PRODUCTS</h1>
                  <div className="App__products">
                    <ProductList
                      products={products}
                      currency={selectedCurrency}
                      cartProducts={cartProducts}
                      onProductClick={handleProductClick}
                    />
                  </div>
                </>
              }
            />

            <Route
              path="home"
              element={<Navigate to="all" />}
            />

            <Route
              path=""
              element={<Navigate to="all" />}
            />

            <Route
              path="clothes"
              element={
                <>
                  <h1 className="App__heading">CLOTHES</h1>
                  <div className="App__products">
                    <Clothes
                      currency={selectedCurrency}
                      cartProducts={cartProducts}
                      products={products}
                      onProductClick={handleProductClick}
                    />
                  </div>
                </>                  
              }
            />

            <Route
              path="cart"
              element={
                <>
                  <h1 className="App__heading">CART</h1>
                  <div className="App__cart">
                    <Cart
                      productsInCart={cartProducts}
                      currency={selectedCurrency}
                      changeCartQuantity={changeCartQuantity}
                      onDeleteItem={removeItemFromCart}
                      quantity={quantity}
                    />
                  </div>
                </>
              }
            />

            <Route
              path="tech"
              element={
                <>
                  <h1 className="App__heading">TECH</h1>
                  <div className="App__products">
                    <Tech
                      currency={selectedCurrency}
                      cartProducts={cartProducts}
                      products={products}
                      onProductClick={handleProductClick}
                    />
                  </div>
                </>
              }
            />

            <Route
              path={`/productid/:${productInfo?.id}`}
              element={
                <ProductInfo
                  products={products}
                  currency={selectedCurrency}
                  onAddToCart={handleAddToCartClick}
                  selectedProductId={productInfo?.id}
                />
              }
            />

            <Route
              path='order'
              element={
                <Order
                  orderItems={cartProducts}
                  currency={selectedCurrency}
                />
              }              
            />

            <Route
              path="*"
              element={(
                <h1 className="App__heading">Page Not Found</h1>
              )}
            />
          </Routes>
        </main>
        {'       '}
      </div>
    </ApolloProvider>
  );
});

export default App;
