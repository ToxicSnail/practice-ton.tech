import { Address, toNano } from '@ton/core';
import { JettonMinter, jettonContentToCell } from '../wrappers/JettonMinter';
import { NetworkProvider, sleep , compile} from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    let admin = Address.parse("0QC5r2uWKhsZgykpnCyJ0_B5o2fhaMDSDe9Ah8lN3qy1C9na");
    let minter = JettonMinter.createFromConfig({
        admin: admin,
        content: jettonContentToCell({
            type: 1,
            uri: 'https://amaranth-magic-jay-509.mypinata.cloud/ipfs/bafkreih3ewu3vurbwsau7bxse74nogzwukqe56ludabyardubcglpfg5be'
        }),
        wallet_code: await compile('JettonWallet')
    }, await compile('JettonMinter'));

    const openedMinter = provider.open(minter);

    await openedMinter.sendDeploy(provider.sender(), toNano('0.05'));

    await provider.waitForDeploy(openedMinter.address);

    console.log('Total supply', await openedMinter.getTotalSupply());
}