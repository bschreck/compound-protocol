import {Event} from '../Event';
import {World} from '../World';
import {PriceOracleWithTermLoansProxy} from '../Contract/PriceOracleWithTermLoansProxy';
import {
  getAddressV
} from '../CoreValue';
import {
  AddressV,
  NumberV,
  Value} from '../Value';
import {Arg, Fetcher, getFetcherValue} from '../Command';
import {getPriceOracleWithTermLoansProxy} from '../ContractLookup';

export async function getPriceOracleWithTermLoansProxyAddress(world: World, priceOracleProxy: PriceOracleWithTermLoansProxy): Promise<AddressV> {
  return new AddressV(priceOracleProxy._address);
}

export async function getV1PriceOracleWithTermLoans(world: World, priceOracleProxy: PriceOracleWithTermLoansProxy): Promise<AddressV> {
  return new AddressV(await priceOracleProxy.methods.v1PriceOracleWithTermLoans().call());
}

async function getPrice(world: World, priceOracleProxy: PriceOracleWithTermLoansProxy, asset: string): Promise<NumberV> {
  return new NumberV(await priceOracleProxy.methods.getUnderlyingPrice(asset).call());
}

export function priceOracleWithTermLoansProxyFetchers() {
  return [
    new Fetcher<{priceOracleProxy: PriceOracleWithTermLoansProxy}, AddressV>(`
        #### V1PriceOracleWithTermLoans

        * "V1PriceOracleWithTermLoans" - Gets the address of the v1 Price
      `,
      "V1PriceOracleWithTermLoans",
      [
        new Arg("priceOracleProxy", getPriceOracleWithTermLoansProxy, {implicit: true})
      ],
      (world, {priceOracleProxy}) => getV1PriceOracleWithTermLoans(world, priceOracleProxy)
    ),
    new Fetcher<{priceOracleProxy: PriceOracleWithTermLoansProxy}, AddressV>(`
        #### Address

        * "Address" - Gets the address of the global price oracle
      `,
      "Address",
      [
        new Arg("priceOracleProxy", getPriceOracleWithTermLoansProxy, {implicit: true})
      ],
      (world, {priceOracleProxy}) => getPriceOracleWithTermLoansProxyAddress(world, priceOracleProxy)
    ),
    new Fetcher<{priceOracle: PriceOracleWithTermLoansProxy, asset: AddressV}, NumberV>(`
        #### Price

        * "Price asset:<Address>" - Gets the price of the given asset
      `,
      "Price",
      [
        new Arg("priceOracle", getPriceOracleWithTermLoansProxy, {implicit: true}),
        new Arg("asset", getAddressV)
      ],
      (world, {priceOracle, asset}) => getPrice(world, priceOracle, asset.val)
    )
  ];
}

export async function getPriceOracleWithTermLoansProxyValue(world: World, event: Event): Promise<Value> {
  return await getFetcherValue<any, any>("PriceOracleWithTermLoans", priceOracleWithTermLoansProxyFetchers(), world, event);
}
