## Reproduction for exodus transaction issue

This reproduces the issue in the EVM mainnet.

You just need to run "yarn" to install dependencies and then "yarn start".

To repro, login with the exodus wallet, then have your console log open and click "Transact". You will notice the console logs show the code hangs right here:

src/transaction/useTransaction.tsx:99
