import { Event } from '../Event';
import { World } from '../World';
import { CErc20WithTermLoansDelegator, CErc20WithTermLoansDelegatorScenario } from '../Contract/CErc20WithTermLoansDelegator';
import { CTokenWithTermLoans } from '../Contract/CTokenWithTermLoans';
import { Invokation, invoke } from '../Invokation';
import { getAddressV, getExpNumberV, getNumberV, getStringV } from '../CoreValue';
import { AddressV, NumberV, StringV } from '../Value';
import { Arg, Fetcher, getFetcherValue } from '../Command';
import { storeAndSaveContract } from '../Networks';
import { getContract, getTestContract } from '../Contract';

const CErc20WithTermLoansContract = getContract('CErc20WithTermLoansImmutable');
const CErc20WithTermLoansDelegator = getContract('CErc20WithTermLoansDelegator');
const CErc20WithTermLoansDelegatorScenario = getTestContract('CErc20WithTermLoansDelegatorScenario');
const CEtherWithTermLoansContract = getContract('CEtherWithTermLoans');
const CErc20WithTermLoansScenarioContract = getTestContract('CErc20WithTermLoansScenario');
const CEtherWithTermLoansScenarioContract = getTestContract('CEtherWithTermLoansScenario');
const CEvilWithTermLoansContract = getTestContract('CEvilWithTermLoans');

export interface TokenData {
  invokation: Invokation<CTokenWithTermLoans>;
  name: string;
  symbol: string;
  decimals?: number;
  underlying?: string;
  address?: string;
  contract: string;
  initial_exchange_rate_mantissa?: string;
  admin?: string;
}

export async function buildCTokenWithTermLoans(
  world: World,
  from: string,
  params: Event
): Promise<{ world: World; cToken: CTokenWithTermLoans; tokenData: TokenData }> {
  const fetchers = [
    new Fetcher<
      {
        symbol: StringV;
        name: StringV;
        decimals: NumberV;
        underlying: AddressV;
        comptroller: AddressV;
        interestRateModel: AddressV;
        initialExchangeRate: NumberV;
        admin: AddressV;
        implementation: AddressV;
        becomeImplementationData: StringV;
      },
      TokenData
    >(
    `
      #### CErc20WithTermLoansDelegator

      * "CErc20WithTermLoansDelegator symbol:<String> name:<String> underlying:<Address> comptroller:<Address> interestRateModel:<Address> initialExchangeRate:<Number> decimals:<Number> admin: <Address> implementation:<Address> becomeImplementationData:<String>" - The real deal CTokenWithTermLoans
        * E.g. "CTokenWithTermLoans Deploy CErc20WithTermLoansDelegator cDAI \"Compound DAI\" (Erc20 DAI Address) (Comptroller Address) (InterestRateModel Address) 1.0 8 Geoff (CTokenWithTermLoans CDaiDelegate Address) "0x0123434anyByTes314535q" "
    `,
      'CErc20WithTermLoansDelegator',
      [
        new Arg('symbol', getStringV),
        new Arg('name', getStringV),
        new Arg('underlying', getAddressV),
        new Arg('comptroller', getAddressV),
        new Arg('interestRateModel', getAddressV),
        new Arg('initialExchangeRate', getExpNumberV),
        new Arg('decimals', getNumberV),
        new Arg('admin', getAddressV),
        new Arg('implementation', getAddressV),
        new Arg('becomeImplementationData', getStringV)
      ],
      async (
        world,
        {
          symbol,
          name,
          underlying,
          comptroller,
          interestRateModel,
          initialExchangeRate,
          decimals,
          admin,
          implementation,
          becomeImplementationData
        }
      ) => {
        return {
          invokation: await CErc20WithTermLoansDelegator.deploy<CErc20WithTermLoansDelegator>(world, from, [
            underlying.val,
            comptroller.val,
            interestRateModel.val,
            initialExchangeRate.val,
            name.val,
            symbol.val,
            decimals.val,
            admin.val,
            implementation.val,
            becomeImplementationData.val
          ]),
          name: name.val,
          symbol: symbol.val,
          decimals: decimals.toNumber(),
          underlying: underlying.val,
          contract: 'CErc20WithTermLoansDelegator',
          initial_exchange_rate_mantissa: initialExchangeRate.encode().toString(),
          admin: admin.val
        };
      }
    ),

    new Fetcher<
      {
        symbol: StringV;
        name: StringV;
        decimals: NumberV;
        underlying: AddressV;
        comptroller: AddressV;
        interestRateModel: AddressV;
        initialExchangeRate: NumberV;
        admin: AddressV;
        implementation: AddressV;
        becomeImplementationData: StringV;
      },
      TokenData
    >(
    `
      #### CErc20WithTermLoansDelegatorScenario

      * "CErc20WithTermLoansDelegatorScenario symbol:<String> name:<String> underlying:<Address> comptroller:<Address> interestRateModel:<Address> initialExchangeRate:<Number> decimals:<Number> admin: <Address> implementation:<Address> becomeImplementationData:<String>" - A CTokenWithTermLoans Scenario for local testing
        * E.g. "CTokenWithTermLoans Deploy CErc20WithTermLoansDelegatorScenario cDAI \"Compound DAI\" (Erc20 DAI Address) (Comptroller Address) (InterestRateModel Address) 1.0 8 Geoff (CTokenWithTermLoans CDaiDelegate Address) "0x0123434anyByTes314535q" "
    `,
      'CErc20WithTermLoansDelegatorScenario',
      [
        new Arg('symbol', getStringV),
        new Arg('name', getStringV),
        new Arg('underlying', getAddressV),
        new Arg('comptroller', getAddressV),
        new Arg('interestRateModel', getAddressV),
        new Arg('initialExchangeRate', getExpNumberV),
        new Arg('decimals', getNumberV),
        new Arg('admin', getAddressV),
        new Arg('implementation', getAddressV),
        new Arg('becomeImplementationData', getStringV)
      ],
      async (
        world,
        {
          symbol,
          name,
          underlying,
          comptroller,
          interestRateModel,
          initialExchangeRate,
          decimals,
          admin,
          implementation,
          becomeImplementationData
        }
      ) => {
        return {
          invokation: await CErc20WithTermLoansDelegatorScenario.deploy<CErc20WithTermLoansDelegatorScenario>(world, from, [
            underlying.val,
            comptroller.val,
            interestRateModel.val,
            initialExchangeRate.val,
            name.val,
            symbol.val,
            decimals.val,
            admin.val,
            implementation.val,
            becomeImplementationData.val
          ]),
          name: name.val,
          symbol: symbol.val,
          decimals: decimals.toNumber(),
          underlying: underlying.val,
          contract: 'CErc20WithTermLoansDelegatorScenario',
          initial_exchange_rate_mantissa: initialExchangeRate.encode().toString(),
          admin: admin.val
        };
      }
    ),

    new Fetcher<{symbol: StringV, name: StringV, decimals: NumberV, underlying: AddressV, comptroller: AddressV, interestRateModel: AddressV, initialExchangeRate: NumberV, admin: AddressV}, TokenData>(`
        #### Scenario

        * "Scenario symbol:<String> name:<String> underlying:<Address> comptroller:<Address> interestRateModel:<Address> initialExchangeRate:<Number> decimals:<Number> admin: <Address>" - A CTokenWithTermLoans Scenario for local testing
          * E.g. "CTokenWithTermLoans Deploy Scenario cZRX \"Compound ZRX\" (Erc20 ZRX Address) (Comptroller Address) (InterestRateModel Address) 1.0 8"
      `,
      "Scenario",
      [
        new Arg("symbol", getStringV),
        new Arg("name", getStringV),
        new Arg("underlying", getAddressV),
        new Arg("comptroller", getAddressV),
        new Arg("interestRateModel", getAddressV),
        new Arg("initialExchangeRate", getExpNumberV),
        new Arg("decimals", getNumberV),
        new Arg("admin", getAddressV)
      ],
      async (world, {symbol, name, underlying, comptroller, interestRateModel, initialExchangeRate, decimals, admin}) => {
        return {
          invokation: await CErc20WithTermLoansScenarioContract.deploy<CTokenWithTermLoans>(world, from, [underlying.val, comptroller.val, interestRateModel.val, initialExchangeRate.val, name.val, symbol.val, decimals.val, admin.val]),
          name: name.val,
          symbol: symbol.val,
          decimals: decimals.toNumber(),
          underlying: underlying.val,
          contract: 'CErc20WithTermLoansScenario',
          initial_exchange_rate_mantissa: initialExchangeRate.encode().toString(),
          admin: admin.val
        };
      }
    ),

    new Fetcher<{symbol: StringV, name: StringV, decimals: NumberV, admin: AddressV, comptroller: AddressV, interestRateModel: AddressV, initialExchangeRate: NumberV}, TokenData>(`
        #### CEtherWithTermLoansScenario

        * "CEtherWithTermLoansScenario symbol:<String> name:<String> comptroller:<Address> interestRateModel:<Address> initialExchangeRate:<Number> decimals:<Number> admin: <Address>" - A CTokenWithTermLoans Scenario for local testing
          * E.g. "CTokenWithTermLoans Deploy CEtherWithTermLoansScenario cETH \"Compound Ether\" (Comptroller Address) (InterestRateModel Address) 1.0 8"
      `,
      "CEtherWithTermLoansScenario",
      [
        new Arg("symbol", getStringV),
        new Arg("name", getStringV),
        new Arg("comptroller", getAddressV),
        new Arg("interestRateModel", getAddressV),
        new Arg("initialExchangeRate", getExpNumberV),
        new Arg("decimals", getNumberV),
        new Arg("admin", getAddressV)
      ],
      async (world, {symbol, name, comptroller, interestRateModel, initialExchangeRate, decimals, admin}) => {
        return {
          invokation: await CEtherWithTermLoansScenarioContract.deploy<CTokenWithTermLoans>(world, from, [name.val, symbol.val, decimals.val, admin.val, comptroller.val, interestRateModel.val, initialExchangeRate.val]),
          name: name.val,
          symbol: symbol.val,
          decimals: decimals.toNumber(),
          underlying: "",
          contract: 'CEtherWithTermLoansScenario',
          initial_exchange_rate_mantissa: initialExchangeRate.encode().toString(),
          admin: admin.val
        };
      }
    ),

    new Fetcher<{symbol: StringV, name: StringV, decimals: NumberV, admin: AddressV, comptroller: AddressV, interestRateModel: AddressV, initialExchangeRate: NumberV}, TokenData>(`
        #### CEtherWithTermLoans

        * "CEtherWithTermLoans symbol:<String> name:<String> comptroller:<Address> interestRateModel:<Address> initialExchangeRate:<Number> decimals:<Number> admin: <Address>" - A CTokenWithTermLoans Scenario for local testing
          * E.g. "CTokenWithTermLoans Deploy CEtherWithTermLoans cETH \"Compound Ether\" (Comptroller Address) (InterestRateModel Address) 1.0 8"
      `,
      "CEtherWithTermLoans",
      [
        new Arg("symbol", getStringV),
        new Arg("name", getStringV),
        new Arg("comptroller", getAddressV),
        new Arg("interestRateModel", getAddressV),
        new Arg("initialExchangeRate", getExpNumberV),
        new Arg("decimals", getNumberV),
        new Arg("admin", getAddressV)
      ],
      async (world, {symbol, name, comptroller, interestRateModel, initialExchangeRate, decimals, admin}) => {
        return {
          invokation: await CEtherWithTermLoansContract.deploy<CTokenWithTermLoans>(world, from, [comptroller.val, interestRateModel.val, initialExchangeRate.val, name.val, symbol.val, decimals.val, admin.val]),
          name: name.val,
          symbol: symbol.val,
          decimals: decimals.toNumber(),
          underlying: "",
          contract: 'CEtherWithTermLoans',
          initial_exchange_rate_mantissa: initialExchangeRate.encode().toString(),
          admin: admin.val
        };
      }
    ),

    new Fetcher<{symbol: StringV, name: StringV, decimals: NumberV, admin: AddressV, underlying: AddressV, comptroller: AddressV, interestRateModel: AddressV, initialExchangeRate: NumberV}, TokenData>(`
        #### CErc20WithTermLoans

        * "CErc20WithTermLoans symbol:<String> name:<String> underlying:<Address> comptroller:<Address> interestRateModel:<Address> initialExchangeRate:<Number> decimals:<Number> admin: <Address>" - A official CTokenWithTermLoans contract
          * E.g. "CTokenWithTermLoans Deploy CErc20WithTermLoans cZRX \"Compound ZRX\" (Erc20 ZRX Address) (Comptroller Address) (InterestRateModel Address) 1.0 8"
      `,
      "CErc20WithTermLoans",
      [
        new Arg("symbol", getStringV),
        new Arg("name", getStringV),
        new Arg("underlying", getAddressV),
        new Arg("comptroller", getAddressV),
        new Arg("interestRateModel", getAddressV),
        new Arg("initialExchangeRate", getExpNumberV),
        new Arg("decimals", getNumberV),
        new Arg("admin", getAddressV)
      ],
      async (world, {symbol, name, underlying, comptroller, interestRateModel, initialExchangeRate, decimals, admin}) => {

        return {
          invokation: await CErc20WithTermLoansContract.deploy<CTokenWithTermLoans>(world, from, [underlying.val, comptroller.val, interestRateModel.val, initialExchangeRate.val, name.val, symbol.val, decimals.val, admin.val]),
          name: name.val,
          symbol: symbol.val,
          decimals: decimals.toNumber(),
          underlying: underlying.val,
          contract: 'CErc20WithTermLoans',
          initial_exchange_rate_mantissa: initialExchangeRate.encode().toString(),
          admin: admin.val
        };
      }
    ),

    new Fetcher<{symbol: StringV, name: StringV, decimals: NumberV, admin: AddressV, underlying: AddressV, comptroller: AddressV, interestRateModel: AddressV, initialExchangeRate: NumberV}, TokenData>(`
        #### CEvilWithTermLoans

        * "CEvilWithTermLoans symbol:<String> name:<String> underlying:<Address> comptroller:<Address> interestRateModel:<Address> initialExchangeRate:<Number> decimals:<Number> admin: <Address>" - A malicious CTokenWithTermLoans contract
          * E.g. "CTokenWithTermLoans Deploy CEvilWithTermLoans cEVL \"Compound EVL\" (Erc20 ZRX Address) (Comptroller Address) (InterestRateModel Address) 1.0 8"
      `,
      "CEvilWithTermLoans",
      [
        new Arg("symbol", getStringV),
        new Arg("name", getStringV),
        new Arg("underlying", getAddressV),
        new Arg("comptroller", getAddressV),
        new Arg("interestRateModel", getAddressV),
        new Arg("initialExchangeRate", getExpNumberV),
        new Arg("decimals", getNumberV),
        new Arg("admin", getAddressV)
      ],
      async (world, {symbol, name, underlying, comptroller, interestRateModel, initialExchangeRate, decimals, admin}) => {
        return {
          invokation: await CEvilWithTermLoansContract.deploy<CTokenWithTermLoans>(world, from, [underlying.val, comptroller.val, interestRateModel.val, initialExchangeRate.val, name.val, symbol.val, decimals.val, admin.val]),
          name: name.val,
          symbol: symbol.val,
          decimals: decimals.toNumber(),
          underlying: underlying.val,
          contract: 'CEvilWithTermLoans',
          initial_exchange_rate_mantissa: initialExchangeRate.encode().toString(),
          admin: admin.val
        };
      }
    ),

    new Fetcher<{symbol: StringV, name: StringV, decimals: NumberV, admin: AddressV, underlying: AddressV, comptroller: AddressV, interestRateModel: AddressV, initialExchangeRate: NumberV}, TokenData>(`
        #### Standard

        * "symbol:<String> name:<String> underlying:<Address> comptroller:<Address> interestRateModel:<Address> initialExchangeRate:<Number> decimals:<Number> admin: <Address>" - A official CTokenWithTermLoans contract
          * E.g. "CTokenWithTermLoans Deploy Standard cZRX \"Compound ZRX\" (Erc20 ZRX Address) (Comptroller Address) (InterestRateModel Address) 1.0 8"
      `,
      "Standard",
      [
        new Arg("symbol", getStringV),
        new Arg("name", getStringV),
        new Arg("underlying", getAddressV),
        new Arg("comptroller", getAddressV),
        new Arg("interestRateModel", getAddressV),
        new Arg("initialExchangeRate", getExpNumberV),
        new Arg("decimals", getNumberV),
        new Arg("admin", getAddressV)
      ],
      async (world, {symbol, name, underlying, comptroller, interestRateModel, initialExchangeRate, decimals, admin}) => {
        // Note: we're going to use the scenario contract as the standard deployment on local networks
        if (world.isLocalNetwork()) {
          return {
            invokation: await CErc20WithTermLoansScenarioContract.deploy<CTokenWithTermLoans>(world, from, [underlying.val, comptroller.val, interestRateModel.val, initialExchangeRate.val, name.val, symbol.val, decimals.val, admin.val]),
            name: name.val,
            symbol: symbol.val,
            decimals: decimals.toNumber(),
            underlying: underlying.val,
            contract: 'CErc20WithTermLoansScenario',
            initial_exchange_rate_mantissa: initialExchangeRate.encode().toString(),
            admin: admin.val
          };
        } else {
          return {
            invokation: await CErc20WithTermLoansContract.deploy<CTokenWithTermLoans>(world, from, [underlying.val, comptroller.val, interestRateModel.val, initialExchangeRate.val, name.val, symbol.val, decimals.val, admin.val]),
            name: name.val,
            symbol: symbol.val,
            decimals: decimals.toNumber(),
            underlying: underlying.val,
            contract: 'CErc20WithTermLoansImmutable',
            initial_exchange_rate_mantissa: initialExchangeRate.encode().toString(),
            admin: admin.val
          };
        }
      },
      {catchall: true}
    )
  ];

  let tokenData = await getFetcherValue<any, TokenData>("DeployCTokenWithTermLoans", fetchers, world, params);
  let invokation = tokenData.invokation;
  delete tokenData.invokation;

  if (invokation.error) {
    throw invokation.error;
  }

  const cToken = invokation.value!;
  tokenData.address = cToken._address;

  world = await storeAndSaveContract(
    world,
    cToken,
    tokenData.symbol,
    invokation,
    [
      { index: ['cTokens', tokenData.symbol], data: tokenData },
      { index: ['Tokens', tokenData.symbol], data: tokenData }
    ]
  );

  return {world, cToken, tokenData};
}
