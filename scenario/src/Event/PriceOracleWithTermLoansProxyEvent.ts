import {Event} from '../Event';
import {addAction, World} from '../World';
import {PriceOracleWithTermLoansProxy} from '../Contract/PriceOracleWithTermLoansProxy';
import {buildPriceOracleWithTermLoansProxy} from '../Builder/PriceOracleWithTermLoansProxyBuilder';
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
import {getPriceOracleWithTermLoansProxy} from '../ContractLookup';
import {verify} from '../Verify';
import {encodedNumber} from '../Encoding';

async function genPriceOracleWithTermLoansProxy(world: World, from: string, params: Event): Promise<World> {
  let priceOracleProxy;
  let invokation;

  ({world, priceOracleProxy, invokation} = await buildPriceOracleWithTermLoansProxy(world, from, params));

  world = addAction(
    world,
    `Deployed PriceOracleWithTermLoansProxy to address ${priceOracleProxy._address}`,
    invokation
  );

  return world;
}

async function verifyPriceOracleWithTermLoansProxy(world: World, priceOracleWithTermLoansProxy: PriceOracleWithTermLoansProxy, apiKey: string, contractName: string): Promise<World> {
  if (world.isLocalNetwork()) {
    world.printer.printLine(`Politely declining to verify on local network: ${world.network}.`);
  } else {
    await verify(world, apiKey, "PriceOracleWithTermLoansProxy", contractName, priceOracleWithTermLoansProxy._address);
  }

  return world;
}

async function setSaiPrice(world: World, from: string, priceOracleWithTermLoansProxy: PriceOracleWithTermLoansProxy, amount: NumberV): Promise<World> {
  return addAction(
    world,
    `Set price oracle SAI price to ${amount.show()}`,
    await invoke(world, priceOracleWithTermLoansProxy.methods.setSaiPrice(amount.encode()), from)
  );
}

export function priceOracleWithTermLoansProxyCommands() {
  return [
    new Command<{params: EventV}>(`
        #### Deploy

        * "Deploy ...params" - Generates a new price oracle proxy
          * E.g. "PriceOracleWithTermLoansProxy Deploy (Unitroller Address) (PriceOracleWithTermLoans Address) (cEther Address)"
      `,
      "Deploy",
      [
        new Arg("params", getEventV, {variadic: true})
      ],
      (world, from, {params}) => genPriceOracleWithTermLoansProxy(world, from, params.val)
    ),

    new View<{priceOracleWithTermLoansProxy: PriceOracleWithTermLoansProxy, apiKey: StringV, contractName: StringV}>(`
        #### Verify

        * "Verify apiKey:<String> contractName:<String>=PriceOracleWithTermLoansProxy" - Verifies PriceOracleWithTermLoansProxy in Etherscan
          * E.g. "PriceOracleWithTermLoansProxy Verify "myApiKey"
      `,
      "Verify",
      [
        new Arg("priceOracleWithTermLoansProxy", getPriceOracleWithTermLoansProxy, {implicit: true}),
        new Arg("apiKey", getStringV),
        new Arg("contractName", getStringV, {default: new StringV("PriceOracleWithTermLoansProxy")})
      ],
      (world, {priceOracleWithTermLoansProxy, apiKey, contractName}) => verifyPriceOracleWithTermLoansProxy(world, priceOracleWithTermLoansProxy, apiKey.val, contractName.val)
    ),

    new Command<{priceOracleWithTermLoansProxy: PriceOracleWithTermLoansProxy, amount: NumberV}>(`
        #### SetSaiPrice

        * "SetSaiPrice <Amount>" - Sets the per-ether price for SAI
          * E.g. "PriceOracleWithTermLoansProxy SetSaiPrice 1.0"
      `,
      "SetSaiPrice",
      [
        new Arg("priceOracleWithTermLoansProxy", getPriceOracleWithTermLoansProxy, {implicit: true}),
        new Arg("amount", getExpNumberV)
      ],
      (world, from, {priceOracleWithTermLoansProxy, amount}) => setSaiPrice(world, from, priceOracleWithTermLoansProxy, amount)
    )
  ];
}

export async function processPriceOracleWithTermLoansProxyEvent(world: World, event: Event, from: string | null): Promise<World> {
  return await processCommandEvent<any>("PriceOracleWithTermLoansProxy", priceOracleWithTermLoansProxyCommands(), world, event, from);
}
