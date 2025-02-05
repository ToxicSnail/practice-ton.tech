import { Address, toNano } from '@ton/core';
import { compile, NetworkProvider } from '@ton/blueprint';
import { jettonContentToCell, JettonMinter } from '../wrappers/JettonMinter';
import { SaleContract } from '../wrappers/Sale';

export async function run(provider: NetworkProvider) {
    const code = await compile('Sale');
    let contract = SaleContract.createFromConfig(code);
    let openedContract = provider.open(contract);
    await openedContract.sendDeploy(provider.sender(), toNano('1'));
}
