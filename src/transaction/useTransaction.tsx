import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { useCallback, useState } from "react";
import { EstimateGasExecutionError, TransactionReceipt } from "viem";
import { useWalletClient } from "./useWalletClient";
import { waitForTransactionReceipt } from "viem/actions";

enum TransactionState {
  Idle = "Idle",
  Initializing = "Initializing",
  AwaitingSignature = "AwaitingSignature",
  Simulating = "Simulating",
  AwaitingConfirmation = "AwaitingConfirmation",
  Confirmed = "Confirmed",
  Failed = "Failed",
  Cancelled = "Cancelled",
}

export type TransactionParams = {
  to: `0x${string}`;
  data?: `0x${string}`;
  value?: bigint;
};

const endStates = [
  TransactionState.Failed,
  TransactionState.Confirmed,
  TransactionState.Cancelled,
];

export function useTransaction<Args extends unknown[]>({
  buildRequest,
  onStateChange,
  onError,
  onComplete,
}: {
  buildRequest: (...args: Args) => Promise<TransactionParams>;
  onStateChange?: (state: TransactionState) => void;
  onError?: (error: string) => void;
  onComplete?: (receipt: TransactionReceipt, ...args: Args) => void;
}) {
  const { primaryWallet, network } = useDynamicContext();
  console.log({ primaryWallet, network });

  const walletClient = useWalletClient(primaryWallet, network);

  const [state, setState] = useState<{
    state: TransactionState;
    loading: boolean;
  }>({
    state: TransactionState.Idle,
    loading: false,
  });

  const handleStateChange = useCallback(
    (newState: TransactionState) => {
      if (endStates.includes(newState)) {
        setState((c) => ({ ...c, loading: false, state: newState }));
      } else {
        const loading =
          newState === TransactionState.Initializing ? { loading: true } : {};
        setState((c) => ({ ...c, ...loading, state: newState }));
      }

      onStateChange?.(newState);
    },
    [onStateChange]
  );

  const sendTransaction = useCallback(
    async (...args: Args) => {
      if (!walletClient) {
        handleStateChange(TransactionState.Failed);
        return;
      }

      handleStateChange(TransactionState.Initializing);

      try {
        const { to, data, value } = await buildRequest(...args);

        handleStateChange(TransactionState.Simulating);

        console.log("Calling contract function with params: ", {
          to,
          data,
          value,
        });

        const valueParam = value ? { value } : {};

        const transactionRequest = {
          to,
          ...(data ? { data } : {}),
          ...valueParam,
        };

        console.log("Starting prepareTransactionRequest", walletClient);

        const request = await walletClient.prepareTransactionRequest(
          transactionRequest
        );

        console.log("Finished prepareTransactionRequest");
        handleStateChange(TransactionState.AwaitingSignature);

        const hash = await walletClient.sendTransaction(request);

        handleStateChange(TransactionState.AwaitingConfirmation);

        const receipt = await waitForTransactionReceipt(walletClient, { hash });

        handleStateChange(TransactionState.Confirmed);

        onComplete?.(receipt, ...args);

        return receipt;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        console.log({ error });
        if (error instanceof EstimateGasExecutionError) {
          handleStateChange(TransactionState.Failed);
          onError?.(
            "There are not enough funds to cover the cost of the transaction"
          );
        } else {
          console.log({ error });
          const rejected = /user rejected/gi.test(error?.message);
          if (rejected) {
            handleStateChange(TransactionState.Cancelled);
          } else {
            const message: string =
              error?.message ?? "Error preparing transaction. Please try again";
            handleStateChange(TransactionState.Failed);
            onError?.(message);
          }
        }

        return null;
      }
    },
    [buildRequest, handleStateChange, onComplete, onError, walletClient]
  );

  return {
    state: state.state,
    loading: state.loading,
    sendTransaction,
  };
}
