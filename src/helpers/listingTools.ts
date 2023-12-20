import BN from "bn.js";

const PREMIUM_LISTING = {
  maxStalenessSlots: 250 as number | null,
  oracleConfFilter: 0.1,
  adjustmentFactor: 0.004,
  util0: 0.5,
  rate0: 0.018,
  util1: 0.75,
  rate1: 0.05,
  maxRate: 0.5,
  loanFeeRate: 0.01,
  loanOriginationFeeRate: 0.001,
  maintAssetWeight: 0.9,
  initAssetWeight: 0.8,
  maintLiabWeight: 1.1,
  initLiabWeight: 1.2,
  liquidationFee: 0.05,
  minVaultToDepositsRatio: 0.2,
  netBorrowLimitWindowSizeTs: 24 * 60 * 60,
  netBorrowLimitPerWindowQuote: toNative(50000, 6).toNumber(),
  groupInsuranceFund: true,
  borrowWeightScaleStartQuote: toNative(250000, 6).toNumber(),
  depositWeightScaleStartQuote: toNative(250000, 6).toNumber(),
  preset_key: "PREMIUM",
  preset_name: "AA",
  preset_target_amount: 100000,
  stablePriceDelayIntervalSeconds: 60 * 60,
  stablePriceGrowthLimit: 0.0003,
  stablePriceDelayGrowthLimit: 0.06,
  tokenConditionalSwapTakerFeeRate: 0,
  tokenConditionalSwapMakerFeeRate: 0,
  flashLoanSwapFeeRate: 0,
  reduceOnly: 0,
  interestCurveScaling: 4,
  interestTargetUtilization: 0.5,
  depositLimit: 0,
  oraclePriceBand: 0.5,
};

export type ListingPreset = typeof PREMIUM_LISTING;

export type LISTING_PRESETS_KEYS =
  | "ULTRA_PREMIUM"
  | "PREMIUM"
  | "MID"
  | "MEME"
  | "SHIT"
  | "UNTRUSTED";

export const LISTING_PRESETS: {
  [key in LISTING_PRESETS_KEYS]: ListingPreset | Record<string, never>;
} = {
  //Price impact on $250,000 swap lower then 1%
  ULTRA_PREMIUM: {
    ...PREMIUM_LISTING,
    netBorrowLimitPerWindowQuote: toNative(125000, 6).toNumber(),
    borrowWeightScaleStartQuote: toNative(500000, 6).toNumber(),
    depositWeightScaleStartQuote: toNative(500000, 6).toNumber(),
    preset_name: "AAA",
    preset_key: "ULTRA_PREMIUM",
    preset_target_amount: 250000,
    loanFeeRate: 0.0005,
    loanOriginationFeeRate: 0.0005,
  },
  //Price impact on $100,000 swap lower then 1%
  PREMIUM: {
    ...PREMIUM_LISTING,
  },
  //Price impact on $20,000 swap lower then 1%
  MID: {
    ...PREMIUM_LISTING,
    maintAssetWeight: 0.75,
    initAssetWeight: 0.5,
    maintLiabWeight: 1.2,
    initLiabWeight: 1.4,
    liquidationFee: 0.1,
    loanFeeRate: 0.02,
    netBorrowLimitPerWindowQuote: toNative(20000, 6).toNumber(),
    borrowWeightScaleStartQuote: toNative(50000, 6).toNumber(),
    depositWeightScaleStartQuote: toNative(50000, 6).toNumber(),
    groupInsuranceFund: true,
    preset_name: "A",
    preset_key: "MID",
    preset_target_amount: 20000,
    loanOriginationFeeRate: 0.002,
  },
  //Price impact on $5,000 swap lower then 1%
  MEME: {
    ...PREMIUM_LISTING,
    loanOriginationFeeRate: 0.005,
    maintAssetWeight: 0,
    initAssetWeight: 0,
    loanFeeRate: 0.05,
    maintLiabWeight: 1.3,
    initLiabWeight: 1.6,
    liquidationFee: 0.1,
    netBorrowLimitPerWindowQuote: toNative(5000, 6).toNumber(),
    borrowWeightScaleStartQuote: toNative(20000, 6).toNumber(),
    depositWeightScaleStartQuote: toNative(20000, 6).toNumber(),
    groupInsuranceFund: false,
    preset_name: "BB",
    preset_key: "MEME",
    preset_target_amount: 5000,
    maxStalenessSlots: 1000,
    oracleConfFilter: 1000,
  },
  //Price impact on $1,000 swap lower then 1%
  SHIT: {
    ...PREMIUM_LISTING,
    loanFeeRate: 0.075,
    loanOriginationFeeRate: 0.0075,
    maintAssetWeight: 0,
    initAssetWeight: 0,
    maintLiabWeight: 1.4,
    initLiabWeight: 1.8,
    liquidationFee: 0.1,
    netBorrowLimitPerWindowQuote: toNative(5000, 6).toNumber(),
    borrowWeightScaleStartQuote: toNative(20000, 6).toNumber(),
    depositWeightScaleStartQuote: toNative(20000, 6).toNumber(),
    groupInsuranceFund: false,
    preset_name: "B",
    preset_key: "SHIT",
    preset_target_amount: 1000,
    maxStalenessSlots: 10000,
    oracleConfFilter: 1000,
  },
  //should run untrusted, instruction preset should be named C
  UNTRUSTED: {},
};

export const LISTING_PRESETS_PYTH: typeof LISTING_PRESETS = {
  ULTRA_PREMIUM: {
    ...(LISTING_PRESETS.ULTRA_PREMIUM as ListingPreset),
    maxStalenessSlots: 250,
  },
  PREMIUM: {
    ...(LISTING_PRESETS.PREMIUM as ListingPreset),
    maxStalenessSlots: 250,
  },
  MID: {
    ...(LISTING_PRESETS.MID as ListingPreset),
    maxStalenessSlots: 250,
  },
  MEME: {
    ...(LISTING_PRESETS.MEME as ListingPreset),
    maxStalenessSlots: 250,
  },
  SHIT: {
    ...(LISTING_PRESETS.SHIT as ListingPreset),
  },
  UNTRUSTED: {},
};

export type MarketTradingParams = {
  baseLots: number;
  quoteLots: number;
  minOrderValue: number;
  baseLotExponent: number;
  quoteLotExponent: number;
  minOrderSize: number;
  priceIncrement: number;
  priceIncrementRelative: number;
};

// definitions:
// baseLots = 10 ^ baseLotExponent
// quoteLots = 10 ^ quoteLotExponent
// minOrderSize = 10^(baseLotExponent - baseDecimals)
// minOrderValue = basePrice * minOrderSize
// priceIncrement =  10^(quoteLotExponent + baseDecimals - baseLotExponent - quoteDecimals)
// priceIncrementRelative =  priceIncrement * quotePrice / basePrice

// derive: baseLotExponent <= min[ basePrice * minOrderSize > 0.05]
// baseLotExponent = 10
// While (baseLotExponent < 10):
//     minOrderSize =  10^(baseLotExponent - baseDecimals)
//     minOrderValue =  basePrice * minOrderSize
//     if minOrderValue > 0.05:
//         break;

// Derive: quoteLotExponent <= min[ priceIncrement * quotePrice / basePrice > 0.000025 ]
// quoteLotExponent = 0
// While (quoteLotExponent < 10):
//     priceIncrement =  10^(quoteLotExponent + baseDecimals - baseLotExponent - quoteDecimals)
//         priceIncrementRelative =  priceIncrement * quotePrice / basePrice
//     if priceIncrementRelative > 0.000025:
//         break;
export const calculateMarketTradingParams = (
  basePrice: number,
  quotePrice: number,
  baseDecimals: number,
  quoteDecimals: number,
): MarketTradingParams => {
  const MAX_MIN_ORDER_VALUE = 0.05;
  const MIN_PRICE_INCREMENT_RELATIVE = 0.000025;
  const EXPONENT_THRESHOLD = 10;

  let minOrderSize = 0;
  let priceIncrement = 0;
  let baseLotExponent = 0;
  let quoteLotExponent = 0;
  let minOrderValue = 0;
  let priceIncrementRelative = 0;

  // Calculate minimum order size
  do {
    minOrderSize = Math.pow(10, baseLotExponent - baseDecimals);
    minOrderValue = basePrice * minOrderSize;

    if (minOrderValue > MAX_MIN_ORDER_VALUE) {
      break;
    }

    baseLotExponent++;
  } while (baseLotExponent < EXPONENT_THRESHOLD);

  // Calculate price increment
  do {
    priceIncrement = Math.pow(
      10,
      quoteLotExponent + baseDecimals - baseLotExponent - quoteDecimals,
    );
    priceIncrementRelative = (priceIncrement * quotePrice) / basePrice;
    if (priceIncrementRelative > MIN_PRICE_INCREMENT_RELATIVE) {
      break;
    }

    quoteLotExponent++;
  } while (quoteLotExponent < EXPONENT_THRESHOLD);

  //exception override values in that case example eth/btc market
  if (
    quoteLotExponent === 0 &&
    priceIncrementRelative > 0.001 &&
    minOrderSize < 1
  ) {
    baseLotExponent = baseLotExponent + 1;
    minOrderSize = Math.pow(10, baseLotExponent - baseDecimals);
    minOrderValue = basePrice * minOrderSize;
    priceIncrement = Math.pow(
      10,
      quoteLotExponent + baseDecimals - baseLotExponent - quoteDecimals,
    );
    priceIncrementRelative = (priceIncrement * quotePrice) / basePrice;
  }

  return {
    baseLots: Math.pow(10, baseLotExponent),
    quoteLots: Math.pow(10, quoteLotExponent),
    minOrderValue: minOrderValue,
    baseLotExponent: baseLotExponent,
    quoteLotExponent: quoteLotExponent,
    minOrderSize: minOrderSize,
    priceIncrement: priceIncrement,
    priceIncrementRelative: priceIncrementRelative,
  };
};

function toNative(uiAmount: number, decimals: number): BN {
  return new BN((uiAmount * Math.pow(10, decimals)).toFixed(0));
}

export const coinTiersToNames: {
  [key in LISTING_PRESETS_KEYS]: string;
} = {
  ULTRA_PREMIUM: "AAA",
  PREMIUM: "AA",
  MID: "A",
  MEME: "BB",
  SHIT: "B",
  UNTRUSTED: "C",
};

export const getTierWithAdjustedNetBorrows = (
  tier: ListingPreset,
  currentTotalDepositsInUsdc: number,
): ListingPreset => {
  const newNetBorrowLimitPerWindowQuote =
    Math.round(currentTotalDepositsInUsdc / 3 / 1_000_000_000) * 1_000_000_000;
  const minValue = toNative(10000, 6).toNumber();

  return {
    ...tier,
    netBorrowLimitPerWindowQuote:
      newNetBorrowLimitPerWindowQuote < minValue
        ? minValue
        : newNetBorrowLimitPerWindowQuote,
  };
};

export const getMidPriceImpacts = (priceImpacts: PriceImpact[]) => {
  return priceImpacts.reduce((acc: MidPriceImpact[], val: PriceImpact) => {
    if (val.side === "ask") {
      const bidSide = priceImpacts.find(
        (x) =>
          x.symbol === val.symbol &&
          x.target_amount === val.target_amount &&
          x.side === "bid",
      );
      acc.push({
        target_amount: val.target_amount,
        avg_price_impact_percent: bidSide
          ? (bidSide.avg_price_impact_percent + val.avg_price_impact_percent) /
            2
          : val.avg_price_impact_percent,
        symbol: val.symbol,
      });
    }
    return acc;
  }, []);
};

export const getLiquidityTier = (
  presets: typeof LISTING_PRESETS,
  priceImpactTargetAmount: number,
): LISTING_PRESETS_KEYS => {
  return (Object.values(presets)
    .sort((a, b) => b.preset_target_amount - a.preset_target_amount)
    .find((x) => x.preset_target_amount <= priceImpactTargetAmount)
    ?.preset_key || "SHIT") as LISTING_PRESETS_KEYS;
};

export const getProposedTier = (
  presets: typeof LISTING_PRESETS,
  priceImpactTargetAmount: number | undefined,
  isPythOracle: boolean,
): LISTING_PRESETS_KEYS => {
  const liquidityTier =
    priceImpactTargetAmount !== undefined
      ? getLiquidityTier(presets, priceImpactTargetAmount)
      : "SHIT";
  const detieredTierWithoutPyth =
    liquidityTier === "ULTRA_PREMIUM" || liquidityTier === "PREMIUM"
      ? "MID"
      : liquidityTier === "MID"
      ? "MEME"
      : liquidityTier;
  const isPythRecommended =
    liquidityTier === "MID" ||
    liquidityTier === "PREMIUM" ||
    liquidityTier === "ULTRA_PREMIUM";
  const proposedTier =
    isPythRecommended && !isPythOracle
      ? detieredTierWithoutPyth
      : liquidityTier;
  return proposedTier;
};

export type PriceImpact = {
  symbol: string;
  side: "bid" | "ask";
  target_amount: number;
  avg_price_impact_percent: number;
  min_price_impact_percent: number;
  max_price_impact_percent: number;
};

export type MidPriceImpact = Omit<
  PriceImpact,
  "side" | "min_price_impact_percent" | "max_price_impact_percent"
>;
