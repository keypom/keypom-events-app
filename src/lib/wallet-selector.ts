import { KEYPOM_TOKEN_FACTORY_CONTRACT, NETWORK_ID } from "@/constants/common";
import { setupOneClickConnect } from "@keypom/one-click-connect";
import {
  type AccountState,
  type NetworkId,
  setupWalletSelector,
  WalletModuleFactory,
  type WalletSelector,
} from "@near-wallet-selector/core";

export class NearWalletSelector {
  public accounts!: AccountState[];
  public selector!: WalletSelector;

  async init(): Promise<void> {
    const _selector = await setupWalletSelector({
      network: NETWORK_ID as NetworkId,
      debug: true,
      modules: [
        setupOneClickConnect({
          networkId: NETWORK_ID,
          contractId: KEYPOM_TOKEN_FACTORY_CONTRACT,
        }) as WalletModuleFactory,
      ],
    });
    const state = _selector.store.getState();

    this.accounts = state.accounts;
    this.selector = _selector;
  }
}
