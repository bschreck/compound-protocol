import { Event } from '../Event';
import { World } from '../World';
import { CTokenWithTermLoans} from '../Contract/CTokenWithTermLoans';
import { CErc20WithTermLoansDelegator } from '../Contract/CErc20WithTermLoansDelegator';
import { Erc20 } from '../Contract/Erc20';
import {
  getAddressV,
  getCoreValue,
  getStringV,
  getNumberV,
  mapValue
} from '../CoreValue';
import { Arg, Fetcher, getFetcherValue } from '../Command';
import {
  AddressV,
  NumberV,
  Value,
  StringV
} from '../Value';
import { getWorldContractByAddress, getCTokenAddress } from '../ContractLookup';

export async function getCTokenWithTermLoansV(world: World, event: Event): Promise<CTokenWithTermLoans> {
  const address = await mapValue<AddressV>(
    world,
    event,
    (str) => new AddressV(getCTokenAddress(world, str)),
    getCoreValue,
    AddressV
  );

  return getWorldContractByAddress<CTokenWithTermLoans>(world, address.val);
}

export async function getCErc20WithTermLoansDelegatorV(world: World, event: Event): Promise<CErc20WithTermLoansDelegator> {
  const address = await mapValue<AddressV>(
    world,
    event,
    (str) => new AddressV(getCTokenAddress(world, str)),
    getCoreValue,
    AddressV
  );

  return getWorldContractByAddress<CErc20WithTermLoansDelegator>(world, address.val);
}

async function getInterestRateModel(world: World, cToken: CTokenWithTermLoans): Promise<AddressV> {
  return new AddressV(await cToken.methods.interestRateModel().call());
}

async function cTokenAddress(world: World, cToken: CTokenWithTermLoans): Promise<AddressV> {
  return new AddressV(cToken._address);
}

async function getCTokenWithTermLoansAdmin(world: World, cToken: CTokenWithTermLoans): Promise<AddressV> {
  return new AddressV(await cToken.methods.admin().call());
}

async function getCTokenWithTermLoansPendingAdmin(world: World, cToken: CTokenWithTermLoans): Promise<AddressV> {
  return new AddressV(await cToken.methods.pendingAdmin().call());
}

async function balanceOfUnderlying(world: World, cToken: CTokenWithTermLoans, user: string): Promise<NumberV> {
  return new NumberV(await cToken.methods.balanceOfUnderlying(user).call());
}

async function getBorrowBalance(world: World, cToken: CTokenWithTermLoans, user: string, loanIndex: number): Promise<NumberV> {
  return new NumberV(await cToken.methods.borrowBalanceCurrent(user, loanIndex).call());
}

async function getBorrowBalanceStored(world: World, cToken: CTokenWithTermLoans, user: string, loanIndex: number): Promise<NumberV> {
  return new NumberV(await cToken.methods.borrowBalanceStored(user, loanIndex).call());
}

async function getTotalBorrows(world: World, cToken: CTokenWithTermLoans): Promise<NumberV> {
  return new NumberV(await cToken.methods.totalBorrows().call());
}

async function getTotalBorrowsCurrent(world: World, cToken: CTokenWithTermLoans): Promise<NumberV> {
  return new NumberV(await cToken.methods.totalBorrowsCurrent().call());
}

async function getReserveFactor(world: World, cToken: CTokenWithTermLoans): Promise<NumberV> {
  return new NumberV(await cToken.methods.reserveFactorMantissa().call(), 1.0e18);
}

async function getTotalReserves(world: World, cToken: CTokenWithTermLoans): Promise<NumberV> {
  return new NumberV(await cToken.methods.totalReserves().call());
}

async function getComptroller(world: World, cToken: CTokenWithTermLoans): Promise<AddressV> {
  return new AddressV(await cToken.methods.comptroller().call());
}

async function getExchangeRateStored(world: World, cToken: CTokenWithTermLoans): Promise<NumberV> {
  return new NumberV(await cToken.methods.exchangeRateStored().call());
}

async function getExchangeRate(world: World, cToken: CTokenWithTermLoans): Promise<NumberV> {
  return new NumberV(await cToken.methods.exchangeRateCurrent().call(), 1e18);
}

async function getCash(world: World, cToken: CTokenWithTermLoans): Promise<NumberV> {
  return new NumberV(await cToken.methods.getCash().call());
}

async function getInterestRate(world: World, cToken: CTokenWithTermLoans): Promise<NumberV> {
  return new NumberV(await cToken.methods.borrowRatePerBlock().call(), 1.0e18 / 2102400);
}

async function getImplementation(world: World, cToken: CTokenWithTermLoans): Promise<AddressV> {
  return new AddressV(await (cToken as CErc20WithTermLoansDelegator).methods.implementation().call());
}

export function cTokenWithTermLoansFetchers() {
  return [
    new Fetcher<{ cToken: CTokenWithTermLoans }, AddressV>(`
        #### Address

        * "CTokenWithTermLoans <CTokenWithTermLoans> Address" - Returns address of CTokenWithTermLoans contract
          * E.g. "CTokenWithTermLoans cZRX Address" - Returns cZRX's address
      `,
      "Address",
      [
        new Arg("cToken", getCTokenWithTermLoansV)
      ],
      (world, { cToken }) => cTokenAddress(world, cToken),
      { namePos: 1 }
    ),

    new Fetcher<{ cToken: CTokenWithTermLoans }, AddressV>(`
        #### InterestRateModel

        * "CTokenWithTermLoans <CTokenWithTermLoans> InterestRateModel" - Returns the interest rate model of CTokenWithTermLoans contract
          * E.g. "CTokenWithTermLoans cZRX InterestRateModel" - Returns cZRX's interest rate model
      `,
      "InterestRateModel",
      [
        new Arg("cToken", getCTokenWithTermLoansV)
      ],
      (world, { cToken }) => getInterestRateModel(world, cToken),
      { namePos: 1 }
    ),

    new Fetcher<{ cToken: CTokenWithTermLoans }, AddressV>(`
        #### Admin

        * "CTokenWithTermLoans <CTokenWithTermLoans> Admin" - Returns the admin of CTokenWithTermLoans contract
          * E.g. "CTokenWithTermLoans cZRX Admin" - Returns cZRX's admin
      `,
      "Admin",
      [
        new Arg("cToken", getCTokenWithTermLoansV)
      ],
      (world, { cToken }) => getCTokenWithTermLoansAdmin(world, cToken),
      { namePos: 1 }
    ),

    new Fetcher<{ cToken: CTokenWithTermLoans }, AddressV>(`
        #### PendingAdmin

        * "CTokenWithTermLoans <CTokenWithTermLoans> PendingAdmin" - Returns the pending admin of CTokenWithTermLoans contract
          * E.g. "CTokenWithTermLoans cZRX PendingAdmin" - Returns cZRX's pending admin
      `,
      "PendingAdmin",
      [
        new Arg("cToken", getCTokenWithTermLoansV)
      ],
      (world, { cToken }) => getCTokenWithTermLoansPendingAdmin(world, cToken),
      { namePos: 1 }
    ),

    new Fetcher<{ cToken: CTokenWithTermLoans }, AddressV>(`
        #### Underlying

        * "CTokenWithTermLoans <CTokenWithTermLoans> Underlying" - Returns the underlying asset (if applicable)
          * E.g. "CTokenWithTermLoans cZRX Underlying"
      `,
      "Underlying",
      [
        new Arg("cToken", getCTokenWithTermLoansV)
      ],
      async (world, { cToken }) => new AddressV(await cToken.methods.underlying().call()),
      { namePos: 1 }
    ),

    new Fetcher<{ cToken: CTokenWithTermLoans, address: AddressV }, NumberV>(`
        #### UnderlyingBalance

        * "CTokenWithTermLoans <CTokenWithTermLoans> UnderlyingBalance <User>" - Returns a user's underlying balance (based on given exchange rate)
          * E.g. "CTokenWithTermLoans cZRX UnderlyingBalance Geoff"
      `,
      "UnderlyingBalance",
      [
        new Arg("cToken", getCTokenWithTermLoansV),
        new Arg<AddressV>("address", getAddressV)
      ],
      (world, { cToken, address }) => balanceOfUnderlying(world, cToken, address.val),
      { namePos: 1 }
    ),

    new Fetcher<{ cToken: CTokenWithTermLoans, address: AddressV, loanIndex: NumberV }, NumberV>(`
        #### BorrowBalance

        * "CTokenWithTermLoans <CTokenWithTermLoans> BorrowBalance <User> <loanIndex>" - Returns a user's borrow balance (including interest)
          * E.g. "CTokenWithTermLoans cZRX BorrowBalance Geoff 0"
      `,
      "BorrowBalance",
      [
        new Arg("cToken", getCTokenWithTermLoansV),
        new Arg("address", getAddressV),
        new Arg("loanIndex", getNumberV)
      ],
      (world, { cToken, address, loanIndex }) => getBorrowBalance(world, cToken, address.val, loanIndex.val as number),
      { namePos: 1 }
    ),

    new Fetcher<{ cToken: CTokenWithTermLoans, address: AddressV, loanIndex: NumberV }, NumberV>(`
        #### BorrowBalanceStored

        * "CTokenWithTermLoans <CTokenWithTermLoans> BorrowBalanceStored <User> <loanIndex>" - Returns a user's borrow balance (without specifically re-accruing interest)
          * E.g. "CTokenWithTermLoans cZRX BorrowBalanceStored Geoff 0"
      `,
      "BorrowBalanceStored",
      [
        new Arg("cToken", getCTokenWithTermLoansV),
        new Arg("address", getAddressV),
        new Arg("loanIndex", getNumberV)
      ],
      (world, { cToken, address, loanIndex }) => getBorrowBalanceStored(world, cToken, address.val, loanIndex.val as number),
      { namePos: 1 }
    ),

    new Fetcher<{ cToken: CTokenWithTermLoans }, NumberV>(`
        #### TotalBorrows

        * "CTokenWithTermLoans <CTokenWithTermLoans> TotalBorrows" - Returns the cToken's total borrow balance
          * E.g. "CTokenWithTermLoans cZRX TotalBorrows"
      `,
      "TotalBorrows",
      [
        new Arg("cToken", getCTokenWithTermLoansV)
      ],
      (world, { cToken }) => getTotalBorrows(world, cToken),
      { namePos: 1 }
    ),

    new Fetcher<{ cToken: CTokenWithTermLoans }, NumberV>(`
        #### TotalBorrowsCurrent

        * "CTokenWithTermLoans <CTokenWithTermLoans> TotalBorrowsCurrent" - Returns the cToken's total borrow balance with interest
          * E.g. "CTokenWithTermLoans cZRX TotalBorrowsCurrent"
      `,
      "TotalBorrowsCurrent",
      [
        new Arg("cToken", getCTokenWithTermLoansV)
      ],
      (world, { cToken }) => getTotalBorrowsCurrent(world, cToken),
      { namePos: 1 }
    ),

    new Fetcher<{ cToken: CTokenWithTermLoans }, NumberV>(`
        #### Reserves

        * "CTokenWithTermLoans <CTokenWithTermLoans> Reserves" - Returns the cToken's total reserves
          * E.g. "CTokenWithTermLoans cZRX Reserves"
      `,
      "Reserves",
      [
        new Arg("cToken", getCTokenWithTermLoansV)
      ],
      (world, { cToken }) => getTotalReserves(world, cToken),
      { namePos: 1 }
    ),

    new Fetcher<{ cToken: CTokenWithTermLoans }, NumberV>(`
        #### ReserveFactor

        * "CTokenWithTermLoans <CTokenWithTermLoans> ReserveFactor" - Returns reserve factor of CTokenWithTermLoans contract
          * E.g. "CTokenWithTermLoans cZRX ReserveFactor" - Returns cZRX's reserve factor
      `,
      "ReserveFactor",
      [
        new Arg("cToken", getCTokenWithTermLoansV)
      ],
      (world, { cToken }) => getReserveFactor(world, cToken),
      { namePos: 1 }
    ),

    new Fetcher<{ cToken: CTokenWithTermLoans }, AddressV>(`
        #### Comptroller

        * "CTokenWithTermLoans <CTokenWithTermLoans> Comptroller" - Returns the cToken's comptroller
          * E.g. "CTokenWithTermLoans cZRX Comptroller"
      `,
      "Comptroller",
      [
        new Arg("cToken", getCTokenWithTermLoansV)
      ],
      (world, { cToken }) => getComptroller(world, cToken),
      { namePos: 1 }
    ),

    new Fetcher<{ cToken: CTokenWithTermLoans }, NumberV>(`
        #### ExchangeRateStored

        * "CTokenWithTermLoans <CTokenWithTermLoans> ExchangeRateStored" - Returns the cToken's exchange rate (based on balances stored)
          * E.g. "CTokenWithTermLoans cZRX ExchangeRateStored"
      `,
      "ExchangeRateStored",
      [
        new Arg("cToken", getCTokenWithTermLoansV)
      ],
      (world, { cToken }) => getExchangeRateStored(world, cToken),
      { namePos: 1 }
    ),

    new Fetcher<{ cToken: CTokenWithTermLoans }, NumberV>(`
        #### ExchangeRate

        * "CTokenWithTermLoans <CTokenWithTermLoans> ExchangeRate" - Returns the cToken's current exchange rate
          * E.g. "CTokenWithTermLoans cZRX ExchangeRate"
      `,
      "ExchangeRate",
      [
        new Arg("cToken", getCTokenWithTermLoansV)
      ],
      (world, { cToken }) => getExchangeRate(world, cToken),
      { namePos: 1 }
    ),

    new Fetcher<{ cToken: CTokenWithTermLoans }, NumberV>(`
        #### Cash

        * "CTokenWithTermLoans <CTokenWithTermLoans> Cash" - Returns the cToken's current cash
          * E.g. "CTokenWithTermLoans cZRX Cash"
      `,
      "Cash",
      [
        new Arg("cToken", getCTokenWithTermLoansV)
      ],
      (world, { cToken }) => getCash(world, cToken),
      { namePos: 1 }
    ),

    new Fetcher<{ cToken: CTokenWithTermLoans }, NumberV>(`
        #### InterestRate

        * "CTokenWithTermLoans <CTokenWithTermLoans> InterestRate" - Returns the cToken's current interest rate
          * E.g. "CTokenWithTermLoans cZRX InterestRate"
      `,
      "InterestRate",
      [
        new Arg("cToken", getCTokenWithTermLoansV)
      ],
      (world, {cToken}) => getInterestRate(world, cToken),
      {namePos: 1}
    ),
    new Fetcher<{cToken: CTokenWithTermLoans, signature: StringV}, NumberV>(`
        #### CallNum

        * "CTokenWithTermLoans <CTokenWithTermLoans> Call <signature>" - Simple direct call method, for now with no parameters
          * E.g. "CTokenWithTermLoans cZRX Call \"borrowIndex()\""
      `,
      "CallNum",
      [
        new Arg("cToken", getCTokenWithTermLoansV),
        new Arg("signature", getStringV),
      ],
      async (world, {cToken, signature}) => {
        const res = await world.web3.eth.call({
            to: cToken._address,
            data: world.web3.eth.abi.encodeFunctionSignature(signature.val)
          })
        const resNum : any = world.web3.eth.abi.decodeParameter('uint256',res);
        return new NumberV(resNum);
      }
      ,
      {namePos: 1}
    ),
    new Fetcher<{ cToken: CTokenWithTermLoans }, AddressV>(`
        #### Implementation

        * "CTokenWithTermLoans <CTokenWithTermLoans> Implementation" - Returns the cToken's current implementation
          * E.g. "CTokenWithTermLoans cDAI Implementation"
      `,
      "Implementation",
      [
        new Arg("cToken", getCTokenWithTermLoansV)
      ],
      (world, { cToken }) => getImplementation(world, cToken),
      { namePos: 1 }
    )
  ];
}

export async function getCTokenWithTermLoansValue(world: World, event: Event): Promise<Value> {
  return await getFetcherValue<any, any>("cToken", cTokenWithTermLoansFetchers(), world, event);
}
