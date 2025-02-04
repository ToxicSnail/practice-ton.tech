import { Address, toNano } from '@ton/core';
import { JettonMinter, jettonContentToCell } from '../wrappers/JettonMinter';
import { NetworkProvider, sleep , compile} from '@ton/blueprint';
import { SaleContract } from '../wrappers/Sale';

export async function run(provider: NetworkProvider) {
    const code = await compile('Sale');
    let contract = SaleContract.createFromAddress(Address.parse("kQAteUAq6Llk30YNqNkBrjXcofdNHUDhfYPMrmeUKcU2Q94N"));
    let openedContract = provider.open(contract);
    await openedContract.sendJettonWallet(provider.sender(), {address: Address.parse("kQBLkdEx610YzYIbQk3VWy9At8LWM-5mSne6-bG7NaygR9rz")});
}