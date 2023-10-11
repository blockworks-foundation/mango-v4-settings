declare const PREMIUM_LISTING: {
    maxStalenessSlots: number;
    oracleConfFilter: number;
    adjustmentFactor: number;
    util0: number;
    rate0: number;
    util1: number;
    rate1: number;
    maxRate: number;
    loanFeeRate: number;
    loanOriginationFeeRate: number;
    maintAssetWeight: number;
    initAssetWeight: number;
    maintLiabWeight: number;
    initLiabWeight: number;
    liquidationFee: number;
    minVaultToDepositsRatio: number;
    netBorrowLimitWindowSizeTs: number;
    netBorrowLimitPerWindowQuote: number;
    insuranceFound: boolean;
    borrowWeightScaleStartQuote: number;
    depositWeightScaleStartQuote: number;
    preset_key: string;
    preset_name: string;
    preset_target_amount: number;
    stablePriceDelayIntervalSeconds: number;
    stablePriceGrowthLimit: number;
    stablePriceDelayGrowthLimit: number;
    tokenConditionalSwapTakerFeeRate: number;
    tokenConditionalSwapMakerFeeRate: number;
    flashLoanDepositFeeRate: number;
    reduceOnly: number;
};
export type ListingPreset = typeof PREMIUM_LISTING;
export type LISTING_PRESETS_KEYS = "ULTRA_PREMIUM" | "PREMIUM" | "MID" | "MEME" | "SHIT" | "UNTRUSTED";
export declare const LISTING_PRESETS: {
    [key in LISTING_PRESETS_KEYS]: ListingPreset | Record<string, never>;
};
export declare const LISTING_PRESETS_PYTH: typeof LISTING_PRESETS;
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
export declare const calculateMarketTradingParams: (basePrice: number, quotePrice: number, baseDecimals: number, quoteDecimals: number) => MarketTradingParams;
export declare const coinTiersToNames: {
    [key in LISTING_PRESETS_KEYS]: string;
};
export declare const getTierWithAdjustedNetBorrows: (tier: ListingPreset, currentTotalDepositsInUsdc: number) => ListingPreset;
export declare const getMidPriceImpacts: (priceImpacts: PriceImpact[]) => MidPriceImpact[];
export declare const getLiquidityTier: (presets: typeof LISTING_PRESETS, priceImpactTargetAmount: number) => LISTING_PRESETS_KEYS;
export declare const getProposedTier: (presets: typeof LISTING_PRESETS, priceImpactTargetAmount: number | undefined, isPythOracle: boolean) => LISTING_PRESETS_KEYS;
export type PriceImpact = {
    symbol: string;
    side: "bid" | "ask";
    target_amount: number;
    avg_price_impact_percent: number;
    min_price_impact_percent: number;
    max_price_impact_percent: number;
};
export type MidPriceImpact = Omit<PriceImpact, "side" | "min_price_impact_percent" | "max_price_impact_percent">;
export {};
