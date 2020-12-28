import {Event} from '../Event';
import {addAction, World} from '../World';
import {Unitroller} from '../Contract/Unitroller';
import {Invokation} from '../Invokation';
import {Arg, Fetcher, getFetcherValue} from '../Command';
import {storeAndSaveContract} from '../Networks';
import {getContract} from '../Contract';

const UnitrollerContract = getContract("Unitroller");

export interface UnitrollerData {
  invokation: Invokation<Unitroller>,
  description: string,
  address?: string
}

export async function buildUnitroller(world: World, from: string, event: Event): Promise<{world: World, unitroller: Unitroller, unitrollerData: UnitrollerData}> {
  const fetchers = [
    new Fetcher<{}, UnitrollerData>(`
        #### Unitroller

        * "" - The Upgradable Comptroller
          * E.g. "Unitroller Deploy"
      `,
      "Unitroller",
      [],
      async (world, {}) => {
        return {
          invokation: await UnitrollerContract.deploy<Unitroller>(world, from, []),
          description: "Unitroller"
        };
      },
      {catchall: true}
    )
  ];

  console.log("1");
  let unitrollerData = await getFetcherValue<any, UnitrollerData>("DeployUnitroller", fetchers, world, event);
  console.log("2");
  let invokation = unitrollerData.invokation;
  delete unitrollerData.invokation;
  console.log("3");

  if (invokation.error) {
    throw invokation.error;
  }
  const unitroller = invokation.value!;
  console.log("4");
  unitrollerData.address = unitroller._address;
  console.log("5");

  world = await storeAndSaveContract(
    world,
    unitroller,
    'Unitroller',
    invokation,
    [
      { index: ['Unitroller'], data: unitrollerData }
    ]
  );
  console.log("6");

  return {world, unitroller, unitrollerData};
}
