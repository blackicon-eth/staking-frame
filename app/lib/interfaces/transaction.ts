export interface Protocol {
  key: string;
  name: string;
  logoURI: string;
}

export interface Token {
  address: string;
  chainId: number;
  symbol: string;
  decimals: number;
  name: string;
  coinKey: string;
  logoURI: string;
  priceUSD: string;
}

export interface Step {
  chainId: number;
  blockNumber: number;
  from: string;
  to: string;
  gasLimit: string;
  data: string;
  value: string;
  protocol: Protocol;
}

export interface Data {
  description: string;
  steps: Step[];
  gasCostUSD: string;
  fromChainId: number;
  fromAmountUSD: number;
  fromAmount: string;
  fromToken: Token;
  fromAddress: string;
  toChainId: number;
  toAmountUSD: number;
  toAmount: string;
  toAmountMin: string;
  toToken: Token;
  toAddress: string;
}

export interface Result {
  solver: string;
  action: string;
  type: string;
  data: Data;
}

export interface BrianTransactionResponse {
  result: Result[];
}
