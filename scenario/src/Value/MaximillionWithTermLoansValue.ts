import {Event} from '../Event';
import {World} from '../World';
import {MaximillionWithTermLoans} from '../Contract/MaximillionWithTermLoans';
import {
  getAddressV
} from '../CoreValue';
import {
  AddressV,
  Value
} from '../Value';
import {Arg, Fetcher, getFetcherValue} from '../Command';
import {getMaximillionWithTermLoans} from '../ContractLookup';

export async function getMaximillionWithTermLoansAddress(world: World, maximillion: MaximillionWithTermLoans): Promise<AddressV> {
  return new AddressV(maximillion._address);
}

export function maximillionWithTermLoansFetchers() {
  return [
    new Fetcher<{maximillion: MaximillionWithTermLoans}, AddressV>(`
        #### Address

        * "MaximillionWithTermLoans Address" - Returns address of maximillion
      `,
      "Address",
      [new Arg("maximillion", getMaximillionWithTermLoans, {implicit: true})],
      (world, {maximillion}) => getMaximillionWithTermLoansAddress(world, maximillion)
    )
  ];
}

export async function getMaximillionWithTermLoansValue(world: World, event: Event): Promise<Value> {
  return await getFetcherValue<any, any>("MaximillionWithTermLoans", maximillionWithTermLoansFetchers(), world, event);
}
