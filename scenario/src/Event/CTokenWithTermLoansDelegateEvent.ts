import { Event } from '../Event';
import { addAction, describeUser, World } from '../World';
import { decodeCall, getPastEvents } from '../Contract';
import { CTokenWithTermLoans, CTokenWithTermLoansScenario } from '../Contract/CTokenWithTermLoans';
import { CErc20WithTermLoansDelegate } from '../Contract/CErc20WithTermLoansDelegate'
import { invoke, Sendable } from '../Invokation';
import {
  getAddressV,
  getEventV,
  getExpNumberV,
  getNumberV,
  getStringV,
  getBoolV
} from '../CoreValue';
import {
  AddressV,
  BoolV,
  EventV,
  NothingV,
  NumberV,
  StringV
} from '../Value';
import { Arg, Command, View, processCommandEvent } from '../Command';
import { getCTokenWithTermLoansDelegateData } from '../ContractLookup';
import { buildCTokenWithTermLoansDelegate } from '../Builder/CTokenWithTermLoansDelegateBuilder';
import { verify } from '../Verify';

async function genCTokenWithTermLoansDelegate(world: World, from: string, event: Event): Promise<World> {
  let { world: nextWorld, cTokenDelegate, delegateData } = await buildCTokenWithTermLoansDelegate(world, from, event);
  world = nextWorld;

  world = addAction(
    world,
    `Added cToken ${delegateData.name} (${delegateData.contract}) at address ${cTokenDelegate._address}`,
    delegateData.invokation
  );

  return world;
}

async function verifyCTokenWithTermLoansDelegate(world: World, cTokenDelegate: CErc20WithTermLoansDelegate, name: string, contract: string, apiKey: string): Promise<World> {
  if (world.isLocalNetwork()) {
    world.printer.printLine(`Politely declining to verify on local network: ${world.network}.`);
  } else {
    await verify(world, apiKey, name, contract, cTokenDelegate._address);
  }

  return world;
}

export function cTokenWithTermLoansDelegateCommands() {
  return [
    new Command<{ cTokenDelegateParams: EventV }>(`
        #### Deploy

        * "CTokenWithTermLoansDelegate Deploy ...cTokenDelegateParams" - Generates a new CTokenWithTermLoansDelegate
          * E.g. "CTokenWithTermLoansDelegate Deploy CDaiDelegate cDAIDelegate"
      `,
      "Deploy",
      [new Arg("cTokenDelegateParams", getEventV, { variadic: true })],
      (world, from, { cTokenDelegateParams }) => genCTokenWithTermLoansDelegate(world, from, cTokenDelegateParams.val)
    ),
    new View<{ cTokenDelegateArg: StringV, apiKey: StringV }>(`
        #### Verify

        * "CTokenWithTermLoansDelegate <cTokenDelegate> Verify apiKey:<String>" - Verifies CTokenWithTermLoansDelegate in Etherscan
          * E.g. "CTokenWithTermLoansDelegate cDaiDelegate Verify "myApiKey"
      `,
      "Verify",
      [
        new Arg("cTokenDelegateArg", getStringV),
        new Arg("apiKey", getStringV)
      ],
      async (world, { cTokenDelegateArg, apiKey }) => {
        let [cToken, name, data] = await getCTokenWithTermLoansDelegateData(world, cTokenDelegateArg.val);

        return await verifyCTokenWithTermLoansDelegate(world, cToken, name, data.get('contract')!, apiKey.val);
      },
      { namePos: 1 }
    ),
  ];
}

export async function processCTokenWithTermLoansDelegateEvent(world: World, event: Event, from: string | null): Promise<World> {
  return await processCommandEvent<any>("CTokenWithTermLoansDelegate", cTokenWithTermLoansDelegateCommands(), world, event, from);
}
