import React from 'react';
import { renderProducts } from '../../helpers/helpers';

class Clothes extends React.PureComponent {
  state = {
    clothes: [],
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
    this.setState({clothes: this.props.products.filter(product => product.category === 'clothes')})
  }

  componentDidUpdate(prevProps) {
    if (prevProps.products !== this.props.products) {
      this.setState({clothes: this.props.products.filter(product => product.category === 'clothes')})
    }
  }

  render () {
    const {
      currency,
      cartProducts,
      onProductClick,
    } = this.props;

    const { clothes } = this.state;

    return (
      renderProducts(clothes, currency, cartProducts, onProductClick)
    );
  }
}

export default Clothes;
