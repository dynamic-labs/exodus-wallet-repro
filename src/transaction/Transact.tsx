import { useTransaction } from "./useTransaction";

export const Transact = () => {
  const { sendTransaction } = useTransaction({
    buildRequest: async () => {
      return {
        to: "0x70997970c51812dc3a010c7d01b50e0d17dc79c8",
        value: 1n,
      };
    },
    onStateChange: (state) => {
      console.log({ state });
    },
  });

  return <button onClick={() => sendTransaction()}>Transact</button>;
};
