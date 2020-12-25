import {Event} from '../Event';
import {World} from '../World';
import {PriceOracleWithTermLoans} from '../Contract/PriceOracleWithTermLoans';
import {
  getAddressV
} from '../CoreValue';
import {
  AddressV,
  NumberV,
  Value} from '../Value';
import {Arg, Fetcher, getFetcherValue} from '../Command';
import {getPriceOracleWithTermLoans} from '../ContractLookup';

async function getPrice(world: World, priceOracle: PriceOracleWithTermLoans, asset: string): Promise<NumberV> {
  return new NumberV(await priceOracle.methods.assetPrices(asset).call());
}

export async function getPriceOracleWithTermLoansAddress(world: World, priceOracle: PriceOracleWithTermLoans): Promise<AddressV> {
  return new AddressV(priceOracle._address);
}

export function priceOracleWithTermLoansFetchers() {
  return [
    new Fetcher<{priceOracle: PriceOracleWithTermLoans}, AddressV>(`
        #### Address

        * "Address" - Gets the address of the global price oracle
      `,
      "Address",
      [
        new Arg("priceOracle", getPriceOracleWithTermLoans, {implicit: true})
      ],
      (world, {priceOracle}) => getPriceOracleWithTermLoansAddress(world, priceOracle)
    ),
    new Fetcher<{priceOracle: PriceOracleWithTermLoans, asset: AddressV}, NumberV>(`
        #### Price

        * "Price asset:<Address>" - Gets the price of the given asset
      `,
      "Price",
      [
        new Arg("priceOracle", getPriceOracleWithTermLoans, {implicit: true}),
        new Arg("asset", getAddressV,)
      ],
      (world, {priceOracle, asset}) => getPrice(world, priceOracle, asset.val)
    )
  ];
}

export async function getPriceOracleWithTermLoansValue(world: World, event: Event): Promise<Value> {
  return await getFetcherValue<any, any>("PriceOracleWithTermLoans", priceOracleWithTermLoansFetchers(), world, event);
}
