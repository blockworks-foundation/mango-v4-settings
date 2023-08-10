declare const PREMIUM_LISTING: {
    maxStalenessSlots: number | null;
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
    borrowWeightScale: number;
    depositWeightScale: number;
    preset_key: string;
    preset_name: string;
    preset_target_amount: number;
};
export type ListingPreset = typeof PREMIUM_LISTING;
export type LISTING_PRESETS_KEYS = "PREMIUM" | "MID" | "MEME" | "SHIT" | "UNTRUSTED";
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
export {};
