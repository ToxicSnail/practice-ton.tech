import { Address, toNano } from '@ton/core';
import { JettonMinter, jettonContentToCell } from '../wrappers/JettonMinter';
import { NetworkProvider, sleep , compile} from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    let address = Address.parse("kQAteUAq6Llk30YNqNkBrjXcofdNHUDhfYPMrmeUKcU2Q94N");
    let minter = JettonMinter.createFromAddress(address);

    const openedMinter = provider.open(minter);

    let to = Address.parse("0QC5r2uWKhsZgykpnCyJ0_B5o2fhaMDSDe9Ah8lN3qy1C9na");
    await openedMinter.sendMint(provider.sender(), to, toNano('10000'), toNano('0.1'), toNano('0.2'));  // не хватает газа
}