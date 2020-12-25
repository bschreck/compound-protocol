import {Event} from '../Event';
import {addAction, World} from '../World';
import {PriceOracleWithTermLoans} from '../Contract/PriceOracleWithTermLoans';
import {buildPriceOracleWithTermLoans, setPriceOracleWithTermLoans} from '../Builder/PriceOracleWithTermLoansBuilder';
import {invoke} from '../Invokation';
import {
  getAddressV,
  getEventV,
  getExpNumberV,
  getStringV
} from '../CoreValue';
import {
  AddressV,
  EventV,
  NumberV,
  StringV
} from '../Value';
import {Arg, Command, processCommandEvent, View} from '../Command';
import {getPriceOracleWithTermLoans} from '../ContractLookup';
import {verify} from '../Verify';
import {encodedNumber} from '../Encoding';

async function genPriceOracleWithTermLoans(world: World, from: string, params: Event): Promise<World> {
  let {world: nextWorld, priceOracle, priceOracleData} = await buildPriceOracleWithTermLoans(world, from, params);
  world = nextWorld;

  world = addAction(
    world,
    `Deployed PriceOracleWithTermLoans (${priceOracleData.description}) to address ${priceOracle._address}`,
    priceOracleData.invokation!
  );

  return world;
}

async function setPriceOracleWithTermLoansFn(world: World, params: Event): Promise<World> {
  let {world: nextWorld, priceOracle, priceOracleData} = await setPriceOracleWithTermLoans(world, params);

  return nextWorld;
}

async function setPrice(world: World, from: string, priceOracle: PriceOracleWithTermLoans, cToken: string, amount: NumberV): Promise<World> {
  return addAction(
    world,
    `Set price oracle price for ${cToken} to ${amount.show()}`,
    await invoke(world, priceOracle.methods.setUnderlyingPrice(cToken, amount.encode()), from)
  );
}

async function setDirectPrice(world: World, from: string, priceOracle: PriceOracleWithTermLoans, address: string, amount: NumberV): Promise<World> {
  return addAction(
    world,
    `Set price oracle price for ${address} to ${amount.show()}`,
    await invoke(world, priceOracle.methods.setDirectPrice(address, amount.encode()), from)
  );
}

async function verifyPriceOracleWithTermLoans(world: World, priceOracle: PriceOracleWithTermLoans, apiKey: string, contractName: string): Promise<World> {
  if (world.isLocalNetwork()) {
    world.printer.printLine(`Politely declining to verify on local network: ${world.network}.`);
  } else {
    await verify(world, apiKey, "PriceOracleWithTermLoans", contractName, priceOracle._address);
  }

  return world;
}

export function priceOracleWithTermLoansCommands() {
  return [
    new Command<{params: EventV}>(`
        #### Deploy

        * "Deploy ...params" - Generates a new price oracle
          * E.g. "PriceOracleWithTermLoans Deploy Fixed 1.0"
          * E.g. "PriceOracleWithTermLoans Deploy Simple"
          * E.g. "PriceOracleWithTermLoans Deploy NotPriceOracleWithTermLoans"
      `,
      "Deploy",
      [
        new Arg("params", getEventV, {variadic: true})
      ],
      (world, from, {params}) => genPriceOracleWithTermLoans(world, from, params.val)
    ),
    new Command<{params: EventV}>(`
        #### Set

        * "Set ...params" - Sets the price oracle to given deployed contract
          * E.g. "PriceOracleWithTermLoans Set Standard \"0x...\" \"My Already Deployed Oracle\""
      `,
      "Set",
      [
        new Arg("params", getEventV, {variadic: true})
      ],
      (world, from, {params}) => setPriceOracleWithTermLoansFn(world, params.val)
    ),

    new Command<{priceOracle: PriceOracleWithTermLoans, cToken: AddressV, amount: NumberV}>(`
        #### SetPrice

        * "SetPrice <CToken> <Amount>" - Sets the per-ether price for the given cToken
          * E.g. "PriceOracleWithTermLoans SetPrice cZRX 1.0"
      `,
      "SetPrice",
      [
        new Arg("priceOracle", getPriceOracleWithTermLoans, {implicit: true}),
        new Arg("cToken", getAddressV),
        new Arg("amount", getExpNumberV)
      ],
      (world, from, {priceOracle, cToken, amount}) => setPrice(world, from, priceOracle, cToken.val, amount)
    ),

    new Command<{priceOracle: PriceOracleWithTermLoans, address: AddressV, amount: NumberV}>(`
        #### SetDirectPrice

        * "SetDirectPrice <Address> <Amount>" - Sets the per-ether price for the given cToken
          * E.g. "PriceOracleWithTermLoans SetDirectPrice (Address Zero) 1.0"
      `,
      "SetDirectPrice",
      [
        new Arg("priceOracle", getPriceOracleWithTermLoans, {implicit: true}),
        new Arg("address", getAddressV),
        new Arg("amount", getExpNumberV)
      ],
      (world, from, {priceOracle, address, amount}) => setDirectPrice(world, from, priceOracle, address.val, amount)
    ),

    new View<{priceOracle: PriceOracleWithTermLoans, apiKey: StringV, contractName: StringV}>(`
        #### Verify

        * "Verify apiKey:<String> contractName:<String>=PriceOracleWithTermLoans" - Verifies PriceOracleWithTermLoans in Etherscan
          * E.g. "PriceOracleWithTermLoans Verify "myApiKey"
      `,
      "Verify",
      [
        new Arg("priceOracle", getPriceOracleWithTermLoans, {implicit: true}),
        new Arg("apiKey", getStringV),
        new Arg("contractName", getStringV, {default: new StringV("PriceOracleWithTermLoans")})
      ],
      (world, {priceOracle, apiKey, contractName}) => verifyPriceOracleWithTermLoans(world, priceOracle, apiKey.val, contractName.val)
    )
  ];
}

export async function processPriceOracleWithTermLoansEvent(world: World, event: Event, from: string | null): Promise<World> {
  return await processCommandEvent<any>("PriceOracleWithTermLoans", priceOracleWithTermLoansCommands(), world, event, from);
}
