import {
  type AccountState,
  type NetworkId,
  setupWalletSelector,
  type WalletSelector,
} from "@near-wallet-selector/core";
import {
  setupModal,
  type WalletSelectorModal,
} from "@near-wallet-selector/modal-ui";
import { setupMyNearWallet } from "@near-wallet-selector/my-near-wallet";
// import { setupMintbaseWallet } from '@near-wallet-selector/mintbase-wallet';
import { setupMeteorWallet } from "@near-wallet-selector/meteor-wallet";
import { setupHereWallet } from "@near-wallet-selector/here-wallet";
// import { setupSender } from '@near-wallet-selector/sender';
// import { setupNightly } from '@near-wallet-selector/nightly';
// import { setupNearSnap } from "@near-wallet-selector/near-snap";

// import { KEYPOM_EVENTS_CONTRACT } from '@/constants/common';
import getConfig from "@/config/config";
import { setupOneClickConnect } from "@keypom/one-click-connect";
import { TOKEN_FACTORY_CONTRACT } from "@/constants/common";

const NETWORK_ID = process.env.REACT_APP_NETWORK_ID ?? "testnet";

const config = getConfig();

export class NearWalletSelector {
  public accounts!: AccountState[];
  public selector!: WalletSelector;
  public modal!: WalletSelectorModal;

  // constructor() {
  //   this.accounts = [];
  //   this.selector = null;
  //   this.modal = null;
  // }

  async init(): Promise<void> {
    const _selector = await setupWalletSelector({
      network: NETWORK_ID as NetworkId,
      debug: true,
      modules: [
        // setupMintbaseWallet({
        //   walletUrl: config.networkId === "mainnnet" ? 'https://wallet.mintbase.xyz': 'https://testnet.wallet.mintbase.xyz',
        //   contractId: config.contractId,
        //   // does nothing-ish, verify
        //   // successUrl: `${window.location.origin}`,
        // }),
        setupMeteorWallet(),
        // setupNightly(),
        // setupNearSnap(),
        // setupSender(),
        setupMyNearWallet(),
        setupOneClickConnect({
          networkId: "testnet",
          contractId: TOKEN_FACTORY_CONTRACT,
        }),
        setupHereWallet(),
      ],
    });
    const _modal = setupModal(_selector, { contractId: config.contractId });
    const state = _selector.store.getState();

    this.accounts = state.accounts;
    this.modal = _modal;
    this.selector = _selector;
  }
}

// import {
//   type AccountState,
//   type NetworkId,
//   setupWalletSelector,
//   type WalletSelector,
// } from '@near-wallet-selector/core';
// import { setupModal, type WalletSelectorModal } from '@near-wallet-selector/modal-ui-js';
// import { setupMyNearWallet } from '@near-wallet-selector/my-near-wallet';
// import { setupMeteorWallet } from '@near-wallet-selector/meteor-wallet';
// import { setupOneClickConnect } from '@keypom/one-click-connect';
// import getConfig from '@/config/config';
// import { TOKEN_FACTORY_CONTRACT } from '@/constants/common';

// const NETWORK_ID = process.env.REACT_APP_NETWORK_ID ?? 'testnet';

// const config = getConfig();

// export class NearWalletSelector {
//   public accounts: AccountState[];
//   public selector: WalletSelector | null;
//   public modal: WalletSelectorModal | null;

//   constructor() {
//     this.accounts = [];
//     this.selector = null;
//     this.modal = null;
//   }

//   async init(): Promise<void> {
//     try {
//       this.selector = await setupWalletSelector({
//         network: NETWORK_ID as NetworkId,
//         debug: true,
//         modules: [
//           setupMeteorWallet(),
//           setupMyNearWallet(),
//           setupOneClickConnect({
//             networkId: NETWORK_ID as NetworkId,
//             contractId: TOKEN_FACTORY_CONTRACT,
//           })
//         ],
//       });

//       this.modal = setupModal(this.selector, { contractId: config.contractId, theme: 'light' });

//       const state = this.selector.store.getState();
//       this.accounts = state.accounts;

//       // this.selector.on('accountsChanged', (e) => {
//       //   console.log('Accounts changed:', e);
//       //   this.accounts = e.accounts;
//       // });

//       this.selector.on('networkChanged', (e) => {
//         console.log('Network changed:', e);
//       });

//       console.log('NearWalletSelector initialized successfully');
//     } catch (error) {
//       console.error('Error initializing NearWalletSelector:', error);
//       this.selector = null;
//       this.modal = null;
//       this.accounts = [];
//     }
//   }
// }
