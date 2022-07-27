import React from 'react';
import { renderProducts } from '../../helpers/helpers';

class Tech extends React.PureComponent {
  state = {
    productId: '',
    tech: [],
    productPrices: [],
    selectedProduct: null,
  }

  constructor(props) {
    super(props)
    props = {
      currency: '$',
      cartProducts: null,
      onProductClick: () => undefined,
      products: [],
    }
  }

  componentDidMount() {
    this.setState({tech: this.props.products.filter(product => product.category === 'tech')})
  }

  componentDidUpdate(prevProps) {
    if (prevProps.products !== this.props.products) {
      this.setState({tech: this.props.products.filter(product => product.category === 'tech')})
    }
  }

  render () {
    const {
      currency,
      cartProducts,
      onProductClick,
    } = this.props;
    const { tech } = this.state;

    return (
      renderProducts(tech, currency, cartProducts, onProductClick)
    );
  }
}

export default Tech;
