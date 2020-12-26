import {Event} from '../Event';
import {addAction, describeUser, World} from '../World';
import {MaximillionWithTermLoans} from '../Contract/MaximillionWithTermLoans';
import {invoke} from '../Invokation';
import {
  getAddressV,
  getEventV,
  getStringV,
  getNumberV
} from '../CoreValue';
import {
  AddressV,
  EventV,
  NumberV,
  StringV
} from '../Value';
import {Arg, Command, View, processCommandEvent} from '../Command';
import {buildMaximillionWithTermLoans} from '../Builder/MaximillionWithTermLoansBuilder';
import {getMaximillionWithTermLoans} from '../ContractLookup';
import {verify} from '../Verify';

function showTrxValue(world: World): string {
  return new NumberV(world.trxInvokationOpts.get('value')).show();
}

async function genMaximillion(world: World, from: string, params: Event): Promise<World> {
  let {world: nextWorld, maximillion, maximillionData} = await buildMaximillionWithTermLoans(world, from, params);
  world = nextWorld;

  world = addAction(
    world,
    `Added Maximillion (${maximillionData.description}) at address ${maximillion._address}`,
    maximillionData.invokation
  );

  return world;
}

async function verifyMaximillion(world: World, maximillion: MaximillionWithTermLoans, apiKey: string): Promise<World> {
  if (world.isLocalNetwork()) {
    world.printer.printLine(`Politely declining to verify on local network: ${world.network}.`);
  } else {
    await verify(world, apiKey, "Maximillion", "Maximillion", maximillion._address);
  }

  return world;
}

async function repayBehalf(world: World, from: string, maximillion: MaximillionWithTermLoans, behalf: string, loanIndex: number): Promise<World> {
  let showAmount = showTrxValue(world);
  let invokation = await invoke(world, maximillion.methods.repayBehalf(behalf, loanIndex), from);

  world = addAction(
    world,
    `Maximillion: ${describeUser(world, from)} repays ${showAmount} of borrow ${loanIndex} on behalf of ${describeUser(world, behalf)}`,
    invokation
  );

  return world;
}

export function maximillionWithTermLoansCommands() {
  return [
    new Command<{maximillionParams: EventV}>(`
        #### Deploy

        * "MaximillionWithTermLoans Deploy ...maximillionParams" - Generates a new Maximillion
          * E.g. "MaximillionWithTermLoans Deploy"
      `,
      "Deploy",
      [new Arg("maximillionParams", getEventV, {variadic: true})],
      (world, from, {maximillionParams}) => genMaximillion(world, from, maximillionParams.val)
    ),
    new View<{maximillion: MaximillionWithTermLoans, apiKey: StringV}>(`
        #### Verify

        * "MaximillionWithTermLoans Verify apiKey:<String>" - Verifies Maximillion in Etherscan
          * E.g. "MaximillionWithTermLoans Verify "myApiKey"
      `,
      "Verify",
      [
        new Arg("maximillion", getMaximillionWithTermLoans, {implicit: true}),
        new Arg("apiKey", getStringV)
      ],
      (world, {maximillion, apiKey}) => verifyMaximillion(world, maximillion, apiKey.val)
    ),
    new Command<{maximillion: MaximillionWithTermLoans, behalf: AddressV, loanIndex: NumberV}>(`
        #### RepayBehalf

        * "RepayBehalf behalf:<User> <loanIndex>" - Repays up to given value of given user's borrow
          * E.g. "(Trx Value 1.0e18 (Maximillion RepayBehalf Geoff 0))"
      `,
      "RepayBehalf",
      [
        new Arg("maximillion", getMaximillionWithTermLoans, {implicit: true}),
        new Arg("behalf", getAddressV),
        new Arg("loanIndex", getNumberV)
      ],
      (world, from, {maximillion, behalf, loanIndex}) => repayBehalf(world, from, maximillion, behalf.val, loanIndex.val as number)
    )
  ];
}

export async function processMaximillionWithTermLoansEvent(world: World, event: Event, from: string | null): Promise<World> {
  return await processCommandEvent<any>("MaximillionWithTermLoans", maximillionWithTermLoansCommands(), world, event, from);
}
