# Documents

* [Installation](#installation)
* [Example](#example)
* [API References](#api-references)
* [Development](#development)

# Installation

```bash
npm i swap_client
```

# Example

```js
const {Client} = require('swap_client')

async function main() {
    let client = Client.create({
        swapEndpoint: 'https://api.lz.finance/swap/',
        bscEndpoint: 'https://bsc-dataseed2.binance.org/'
    })
    let source = '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c'
    let target = '0xe9e7cea3dedca5984780bafc599bd69add087d56'
    let routes = await client.getRoutes(source, target)
}

main().catch(console.error)
```

# API References

See [API References](./api.md).

# Development

```bash
npm run standardize
npm test
```
