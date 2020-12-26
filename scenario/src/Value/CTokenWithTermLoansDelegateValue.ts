import { Event } from '../Event';
import { World } from '../World';
import { CErc20WithTermLoansDelegate } from '../Contract/CErc20WithTermLoansDelegate';
import {
  getCoreValue,
  mapValue
} from '../CoreValue';
import { Arg, Fetcher, getFetcherValue } from '../Command';
import {
  AddressV,
  Value,
} from '../Value';
import { getWorldContractByAddress, getCTokenWithTermLoansDelegateAddress } from '../ContractLookup';

export async function getCTokenWithTermLoansDelegateV(world: World, event: Event): Promise<CErc20WithTermLoansDelegate> {
  const address = await mapValue<AddressV>(
    world,
    event,
    (str) => new AddressV(getCTokenWithTermLoansDelegateAddress(world, str)),
    getCoreValue,
    AddressV
  );

  return getWorldContractByAddress<CErc20WithTermLoansDelegate>(world, address.val);
}

async function cTokenDelegateAddress(world: World, cTokenDelegate: CErc20WithTermLoansDelegate): Promise<AddressV> {
  return new AddressV(cTokenDelegate._address);
}

export function cTokenWithTermLoansDelegateFetchers() {
  return [
    new Fetcher<{ cTokenDelegate: CErc20WithTermLoansDelegate }, AddressV>(`
        #### Address

        * "CTokenWithTermLoansDelegate <CTokenWithTermLoansDelegate> Address" - Returns address of CTokenWithTermLoansDelegate contract
          * E.g. "CTokenWithTermLoansDelegate cDaiDelegate Address" - Returns cDaiDelegate's address
      `,
      "Address",
      [
        new Arg("cTokenDelegate", getCTokenWithTermLoansDelegateV)
      ],
      (world, { cTokenDelegate }) => cTokenDelegateAddress(world, cTokenDelegate),
      { namePos: 1 }
    ),
  ];
}

export async function getCTokenWithTermLoansDelegateValue(world: World, event: Event): Promise<Value> {
  return await getFetcherValue<any, any>("CTokenWithTermLoansDelegate", cTokenWithTermLoansDelegateFetchers(), world, event);
}
