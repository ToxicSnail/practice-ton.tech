# 3-day

- Today, we continued working on the code from [[2-day]], specifically implementing:
  - Wrote the script [receive_money.ts](https://github.com/ToxicSnail/practice-ton.tech/blob/main/2-day/scripts/receive_money.ts "receive_money.ts"), which returns all remaining funds from the contract to the account.
  - Finalized [sale.fc](https://github.com/ToxicSnail/practice-ton.tech/blob/main/2-day/contracts/sale.fc "sale.fc"); the issue was incorrect message formation: the opcode must be 64-bit.
  - After modifying `sale.fc`, we also changed `deploySale`.
  - Updated the wrapper in `Sale`.

Thus, to successfully host a token, you need to:
  1. Create an account on [mypinata.cloud](https://app.pinata.cloud/auth/signin).
  2. Come up with a token with an image, upload a JSON file to Pinata:
  3. Run the script `incrementCounter.ts`
  4. `mintJetton.ts`
  5. `deploySale.ts`
  6. `setJettonWallet.ts`
  7. After this, when you send Ton to the contract, you receive your token.
