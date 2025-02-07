# 4-day
- Provided a [contract deployed](https://testnet.tonviewer.com/kQAgZ_lRPOWLs2aoWtsHAZWFFIZreZc9ItJ8A6vMr491_UZX) deployed at address `kQAgZ_lRPOWLs2aoWtsHAZWFFIZreZc9ItJ8A6vMr491_UZX`
- The source code of the contract is known

```jsx
#include "imports/stdlib.fc";

const gas_cost = 10000000;

() send(slice addr, slice body, int grams) impure inline_ref {
  ;; int_msg_info$0 ihr_disabled:Bool bounce:Bool bounced:Bool src:MsgAddress -> 011000
  var msg = begin_cell()
    .store_uint(0x18, 6)
    .store_slice(addr)
    .store_coins(grams)
    .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1 + 32)
    .store_slice(body);
  send_raw_message(msg.end_cell(), SEND_MODE_REGULAR);
}

() recv_internal(int my_balance, int msg_value, cell in_msg_full, slice in_msg_body) impure {
    slice msg = in_msg_full.begin_parse();
    int flags = msg~load_uint(4);
    slice source_address = msg~load_msg_addr();
    if (flags & 1) {
        return ();
    }
    if (rand(10) < 4) {
        if (msg_value * 2 < my_balance - gas_cost) {
            send(source_address, "you won", msg_value * 2);
        } else {
            send(source_address, "vault is empty", my_balance - gas_cost);
        }
        return ();
    }
}

```

This is a casino with 100 tons on it, and the goal is to drain all of them.

# Solution

The task is based on the fact that on the first day, Vova mentioned that he knows how to hack Timur's contract, and after that, Timur added `randomize_lt()`.

The `rand(n)` function itself is unsafe and works as follows:

- The  `seed` in the contract is determined by `hash(block_seed, account_address)`
- Only validators know the `block_seed` of the current block, and we cannot find out this seed.

> [Therefore, to predict the result of the random() function in a smart contract, you just need to know the current seed of the block, which isn't possible if you're not a validator.](https://docs.ton.org/v3/guidelines/smart-contracts/security/random-number-generation#how-can-someone-predict-a-random-number)

However, it is possible to attack the random number within a single block.

## How does the attack work?

1. Send the first bet to the casino.
2. If you win (receive a message `You won`), continue spamming the same bets within the same block.
3. If no response is received, the block has changed, you lost, and the attack is stopped.
4. Repeat the process in a new block until the casino is bankrupt.

When the casino is bankrupt, withdraw the money from the attacking contract to the main account.

## Why does this work?

The `seed` is fixed within a single block, and if one bet wins, all bets in the current block will win.

## The attack contract code is offered in the repository

## Simplified Attack Scheme

In reality, there will be around 500 transactions in one block.

![[scheme_attack.png]]
Node A - My main account, which forcibly initiates everything with the message `init try`.

Node B - The attacking contract, which realizes that the current block has a suitable `seed`, so it starts attacking by sending message  `auto try`.

Node C - The casino, which accepts bets and returns messages `you won` with the winnings.

The attack will stop after the first failure when Node C does not return any response.

--------
Readme file written with @Jl4cTuk
