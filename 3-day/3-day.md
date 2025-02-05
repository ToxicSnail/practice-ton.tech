# 3-day

# Continue work 2-day
- Today, we continued working on the code from [2-day](https://github.com/ToxicSnail/practice-ton.tech/tree/main/2-day), specifically implementing:
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

## Opcode Parsing in TON Blockchain

## Example:
`x{7362D09C6038CB0EF1E046B9405F5E1008006CF8FEA883AE8C3654DE211038D905310DEF04300911C86BFE84D6FBC75DB780}`

## Instruction:
```
transfer#0f8a7ea5 query_id:uint64 amount:(VarUInteger 16) destination:MsgAddress
                 response_destination:MsgAddress custom_payload:(Maybe ^Cell)
                 forward_ton_amount:(VarUInteger 16) forward_payload:(Either Cell ^Cell)
                 = InternalMsgBody;

transfer_notification#7362d09c query_id:uint64 amount:(VarUInteger 16)
                              sender:MsgAddress forward_payload:(Either Cell ^Cell)
                              = InternalMsgBody;

transfer#5fcc3d14 query_id:uint64 new_owner:MsgAddress response_destination:MsgAddress custom_payload:(Maybe ^Cell) forward_amount:(VarUInteger 16) forward_payload:(Either Cell ^Cell) = InternalMsgBody;

new_order#f718510f query_id:uint64
                   order_seqno:uint256
                   signer:(## 1)
                   index:uint8
                   expiration_date:uint48
                   order:^Order = InternalMsgBody;

ownership_assigned#05138d91 query_id:uint64 prev_owner:MsgAddress forward_payload:(Either Cell ^Cell) = InternalMsgBody;
```
## Parsing Steps:
1. **Convert the given hex value to a binary representation**:
- `7362D09C6038CB0EF1E046B9405F5E1008006CF8FEA883AE8C3654DE211038D905310DEF04300911C86BFE84D6FBC75DB780`
- → Binary:
- `0111001101100010110100001001110001100000001110001100101100001110111100011110000001000110101110010100000001011111010111100001000000001000000000000110110011111000111111101010100010000011101011101000110000110110010101001101111000100001000100000011100011011001000001010011000100001101111011110000010000110000000010010001000111001000011010111111111010000100110101101111101111000111010111011011011110000000`

2. **Extract `opcode` (32-bit value):**
- `op = 7362D09C`
- `op = 01110011011000101101000010011100`

3. **Extract `query_id` (64-bit uint):**
- `query_id = 6038CB0EF1E046B9 `
- `query_id = 0110000000111000110010110000111011110001111000000100011010111001`

4. **Extract `amount` (VarUInteger 16)**
```
var_uint$_ {n:#} len:(#< n) value:(uint (len * 8))
         = VarUInteger n;
```
- `n = 16`, first bits define `len`:  
  ```
  len = 0100 = 4
  ```
- `amount` takes `4 * 8 = 32 bits`:  
  ```
  amount = 00000101111101011110000100000000
  amount = 05F5E100
  ```

5. **Extract Address (`MsgAddressInt`)**  
