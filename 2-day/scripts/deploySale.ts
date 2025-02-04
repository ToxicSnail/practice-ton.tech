import { Address, toNano } from '@ton/core';
import { JettonMinter, jettonContentToCell } from '../wrappers/JettonMinter';
import { NetworkProvider, sleep , compile} from '@ton/blueprint';
import { SaleContract } from '../wrappers/Sale';

export async function run(provider: NetworkProvider) {
    let admin = Address.parse("0QC5r2uWKhsZgykpnCyJ0_B5o2fhaMDSDe9Ah8lN3qy1C9na");
    const code = await compile('Sale');
    let contract = SaleContract.createFromConfig(code);
    let openedContract = provider.open(contract);
    await openedContract.sendDeploy(provider.sender(), toNano('1'));
}
