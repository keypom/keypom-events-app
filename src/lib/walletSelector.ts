import {
  type AccountState,
  type NetworkId,
  setupWalletSelector,
  WalletModuleFactory,
  type WalletSelector,
} from "@near-wallet-selector/core";
import {
  setupModal,
  type WalletSelectorModal,
} from "@near-wallet-selector/modal-ui";
import { setupMyNearWallet } from "@near-wallet-selector/my-near-wallet";
import { setupMeteorWallet } from "@near-wallet-selector/meteor-wallet";
import getConfig from "@/config/config";
import { setupOneClickConnect } from "@keypom/one-click-connect";
import { TOKEN_FACTORY_CONTRACT } from "@/constants/common";

const NETWORK_ID = process.env.REACT_APP_NETWORK_ID ?? "testnet";

const config = getConfig();

export class NearWalletSelector {
  public accounts!: AccountState[];
  public selector!: WalletSelector;
  public modal!: WalletSelectorModal;

  async init(): Promise<void> {
    const _selector = await setupWalletSelector({
      network: NETWORK_ID as NetworkId,
      debug: true,
      modules: [
        setupMeteorWallet(),
        setupMyNearWallet(),
        setupOneClickConnect({
          networkId: "testnet",
          contractId: TOKEN_FACTORY_CONTRACT,
        }) as WalletModuleFactory,
      ],
    });
    const _modal = setupModal(_selector, { contractId: config.contractId });
    const state = _selector.store.getState();

    this.accounts = state.accounts;
    this.modal = _modal;
    this.selector = _selector;
  }
}
