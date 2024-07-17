import {
  Wallet,
  createWalletClientFromWallet,
} from "@dynamic-labs/sdk-react-core";
import { useEffect, useRef, useState } from "react";
import { Account, Chain, Transport, WalletClient } from "viem";

export const useWalletClient = (
  wallet?: Wallet | null,
  network?: number | string
) => {
  const initializedChain = useRef<number | null>(null);
  const [walletClient, setWalletClient] = useState<
    WalletClient<Transport, Chain, Account> | undefined
  >();

  useEffect(() => {
    const initializeWalletClient = async () => {
      if (typeof network === "string") return;
      if (initializedChain.current === network || !wallet) return;
      const client = await createWalletClientFromWallet(wallet);
      initializedChain.current = network ?? null;
      setWalletClient(client);
    };
    initializeWalletClient();
  }, [wallet, network]);

  return walletClient;
};
