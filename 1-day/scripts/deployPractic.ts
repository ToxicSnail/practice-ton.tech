import { Address, beginCell, comment, internal, toNano } from '@ton/core';
import { compile, NetworkProvider } from '@ton/blueprint';
import { mnemonicNew, mnemonicToWalletKey} from '@ton/crypto';
import { WalletContractV3R2 } from '@ton/ton';
import { Practice } from '../wrappers/Practice';

export async function run(provider: NetworkProvider) {
    
    // let mnemonic = await mnemonicNew();
    let mnemonic = [
        '---', '---',  '---',
        '---',  '---',   '---',
        '---',   '---',  '---',
        '---',   '---',  '---',
        '---',   '---',    '---',
        '---',    '---',   '---',
        '---',   '---', '---',
        '---', '---',   '---'
    ];

    let keyPair = await mnemonicToWalletKey(mnemonic);
    let wallet = provider.open(WalletContractV3R2.create({workchain: 0, publicKey: keyPair.publicKey}));

    let contract = provider.open(Practice.createFromConfig({}, await compile("practice")));

    await wallet.sendTransfer({
        seqno: await wallet.getSeqno(), secretKey: keyPair.secretKey,
        messages: [
            internal({
                to: contract.address, 
                value: toNano("1"),
                body: comment("Hello")
                // init: contract.init,
                // bounce: false
            })   
        ],
    })
    // 
    // TLB: comment#00000000 text: Cell text_cont: ^Cell = InMsgBody;
    // await provider.sender().send({value: toNano(1), to: wallet.address, body: beginCell().storeUint(0, 32).storeStringTail("Hello").endCell(), bounce: false, init: wallet.init});
    
    // console.log(mnemonic);
    // run methods on `practice`
}
