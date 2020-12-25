import {Event} from '../Event';
import {addAction, World} from '../World';
import {PriceOracleWithTermLoans} from '../Contract/PriceOracleWithTermLoans';
import {Invokation, invoke} from '../Invokation';
import {
  getAddressV,
  getExpNumberV,
  getStringV
} from '../CoreValue';
import {
  AddressV,
  EventV,
  NothingV,
  NumberV,
  StringV
} from '../Value';
import {Arg, Fetcher, getFetcherValue} from '../Command';
import {storeAndSaveContract} from '../Networks';
import {getContract, getTestContract} from '../Contract';

const FixedPriceOracleWithTermLoans = getTestContract('FixedPriceOracleWithTermLoans');
const SimplePriceOracleWithTermLoans = getContract('SimplePriceOracleWithTermLoans');
const AnchorPriceOracleWithTermLoans = getContract('AnchorPriceOracleWithTermLoans');
const NotPriceOracleWithTermLoans = getTestContract('NotPriceOracleWithTermLoans');
const PriceOracleWithTermLoansInterface = getTestContract('PriceOracleWithTermLoans');

export interface PriceOracleWithTermLoansData {
  invokation?: Invokation<PriceOracleWithTermLoans>,
  contract?: PriceOracleWithTermLoans,
  description: string,
  address?: string
}

export async function buildPriceOracleWithTermLoans(world: World, from: string, event: Event): Promise<{world: World, priceOracle: PriceOracleWithTermLoans, priceOracleData: PriceOracleWithTermLoansData}> {
  const fetchers = [
    new Fetcher<{price: NumberV}, PriceOracleWithTermLoansData>(`
        #### Fixed

        * "Fixed price:<Exp>" - Fixed price
          * E.g. "PriceOracleWithTermLoans Deploy (Fixed 20.0)"
      `,
      "Fixed",
      [
        new Arg("price", getExpNumberV),
      ],
      async (world, {price}) => {
        return {
          invokation: await FixedPriceOracleWithTermLoans.deploy<PriceOracleWithTermLoans>(world, from, [price.val]),
          description: "Fixed Price Oracle"
        };
      }
    ),
    new Fetcher<{}, PriceOracleWithTermLoansData>(`
        #### Simple

        * "Simple" - The a simple price oracle that has a harness price setter
          * E.g. "PriceOracleWithTermLoans Deploy Simple"
      `,
      "Simple",
      [],
      async (world, {}) => {
        return {
          invokation: await SimplePriceOracleWithTermLoans.deploy<PriceOracleWithTermLoans>(world, from, []),
          description: "Simple Price Oracle"
        };
      }
    ),
    new Fetcher<{poster: AddressV}, PriceOracleWithTermLoansData>(`
        #### Anchor

        * "Anchor <poster:Address>" - The anchor price oracle that caps price movements to anchors
          * E.g. "PriceOracleWithTermLoans Deploy Anchor 0x..."
      `,
      "Anchor",
      [
        new Arg("poster", getAddressV)
      ],
      async (world, {poster}) => {
        return {
          invokation: await AnchorPriceOracleWithTermLoans.deploy<PriceOracleWithTermLoans>(world, from, [poster.val]),
          description: "Anchor Price Oracle",
          poster: poster.val
        };
      }
    ),
    new Fetcher<{}, PriceOracleWithTermLoansData>(`
        #### NotPriceOracleWithTermLoans

        * "NotPriceOracleWithTermLoans" - Not actually a price oracle
          * E.g. "PriceOracleWithTermLoans Deploy NotPriceOracleWithTermLoans"
      `,
      "NotPriceOracleWithTermLoans",
      [],
      async (world, {}) => {
        return {
          invokation: await NotPriceOracleWithTermLoans.deploy<PriceOracleWithTermLoans>(world, from, []),
          description: "Not a Price Oracle"
        };
      }
    )
  ];

  let priceOracleData = await getFetcherValue<any, PriceOracleWithTermLoansData>("DeployPriceOracleWithTermLoans", fetchers, world, event);
  let invokation = priceOracleData.invokation!;
  delete priceOracleData.invokation;

  if (invokation.error) {
    throw invokation.error;
  }
  const priceOracle = invokation.value!;
  priceOracleData.address = priceOracle._address;

  world = await storeAndSaveContract(
    world,
    priceOracle,
    'PriceOracleWithTermLoans',
    invokation,
    [
      { index: ['PriceOracleWithTermLoans'], data: priceOracleData }
    ]
  );

  return {world, priceOracle, priceOracleData};
}

export async function setPriceOracleWithTermLoans(world: World, event: Event): Promise<{world: World, priceOracle: PriceOracleWithTermLoans, priceOracleData: PriceOracleWithTermLoansData}> {
  const fetchers = [
    new Fetcher<{address: AddressV, description: StringV}, PriceOracleWithTermLoansData>(`
        #### Standard

        * "Standard" - The standard price oracle
          * E.g. "PriceOracleWithTermLoans Set Standard \"0x...\" \"Standard Price Oracle\""
      `,
      "Standard",
      [
        new Arg("address", getAddressV),
        new Arg("description", getStringV),
      ],
      async (world, {address, description}) => {
        return {
          contract: await PriceOracleWithTermLoansInterface.at<PriceOracleWithTermLoans>(world, address.val),
          description: description.val
        };
      }
    )
  ];

  let priceOracleData = await getFetcherValue<any, PriceOracleWithTermLoansData>("SetPriceOracleWithTermLoans", fetchers, world, event);
  let priceOracle = priceOracleData.contract!;
  delete priceOracleData.contract;

  priceOracleData.address = priceOracle._address;

  world = await storeAndSaveContract(
    world,
    priceOracle,
    'PriceOracleWithTermLoans',
    null,
    [
      { index: ['PriceOracleWithTermLoans'], data: priceOracleData }
    ]
  );

  return {world, priceOracle, priceOracleData};
}
