import { Address, beginCell, comment, internal, toNano } from '@ton/core';
import { Counter } from '../wrappers/Counter';
import { compile, NetworkProvider } from '@ton/blueprint';
import { mnemonicNew, mnemonicToWalletKey } from "@ton/crypto";
import { WalletContractV3R2 } from '@ton/ton';

export async function run(provider: NetworkProvider) {

    // let mnemonic = await mnemonicNew();
    // console.log(mnemonic);

    let mnemonic = [
        '---', '---', '---',
        '---', '---', '---',
        '---', '---', '---',
        '---', '---', '---',
        '---', '---', '---',
        '---', '---', '---',
        '---', '---',  '---',
        '---', '---', '---'
      ];

      let keyPair = await mnemonicToWalletKey(mnemonic);
      let wallet = provider.open(WalletContractV3R2.create({workchain: 0, publicKey: keyPair.publicKey}));

//  let contract = provider.open(Counter.createFromConfig({}, await compile("couner")));  //при контракте

      await wallet.sendTransfer({seqno: await wallet.getSeqno(), secretKey: keyPair.secretKey, messages: [
        internal({
            to: Address.parse("0QC5r2uWKhsZgykpnCyJ0_B5o2fhaMDSDe9Ah8lN3qy1C9na"),
            value: toNano("0.01"),  
            body: comment("Hello, deployer!")
        })
    ],  
    } 
    )
      // TLB: comment#00000000 text: Cell text_cont: ^Cell = InMsgBody;
      //await provider.sender().send({value: toNano(1), to: wallet.address, body: beginCell().storeUint(0, 32).storeStringTail("Hello, Ton!").endCell(), bounce: false, init: wallet.init} )

    //   console.log(mnemonic);
}
