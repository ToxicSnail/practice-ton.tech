import { Address, toNano } from '@ton/core';
import { compile, NetworkProvider } from '@ton/blueprint';
import { jettonContentToCell, JettonMinter } from '../wrappers/JettonMinter';
import { SaleContract } from '../wrappers/Sale';

export async function run(provider: NetworkProvider) {
    let contract = SaleContract.createFromAddress(Address.parse("kQBCHJMng-..."));
    let openedContract = provider.open(contract);
    await openedContract.sendJettonWallet(provider.sender(), { address: Address.parse("kQDNBg...")});
}
