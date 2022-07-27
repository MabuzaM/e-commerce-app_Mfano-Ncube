import { ApolloClient, gql, InMemoryCache } from 'apollo-boost';
import { createHttpLink } from 'apollo-link-http';

export const CATEGORIES_QUERY = gql`
  {
    categories {
      name
    }
  }
`

export const PRODUCTS = gql`
  {
    category {
      name
      products {
        id
        name
        inStock
        description
        category
        brand
        gallery
        attributes {
          id
          name
          type
          items {
            displayValue
            value
            id
          }
        }
        prices {
          currency {
            label
            symbol
          }
          amount
        }
      }
    }
  }
`

export const CURRENCIES_QUERY = gql`
  {
    currencies {
      label
      symbol
    }
  }
`

export const client = new ApolloClient({
  link: createHttpLink({ uri: 'http://localhost:4000/' }),
  cache: new InMemoryCache()
});
