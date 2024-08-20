import { Heading, Button } from "@chakra-ui/react";
import { useAuthWalletContext } from "@/contexts/AuthWalletContext";
import "@near-wallet-selector/modal-ui/styles.css";

export function Wallet() {
  const { modal, isLoggedIn, selector, accountId } = useAuthWalletContext();
  console.log("Modal", modal);

  const handleConnectWallet = () => {
    if (!modal) {
      console.error("Modal not initialized");
      return;
    }
    modal.show();
  };

  const handleSignOut = async () => {
    if (!selector.isSignedIn()) {
      console.error("Not signed in");
      return;
    }
    const wallet = await selector.wallet();

    wallet
      .signOut()
      .then((_) => {
        sessionStorage.removeItem("account");
        window.location.href = "";
      })
      .catch((err) => {
        // eslint-disable-next-line no-console
        console.error("Failed to sign out");
        // eslint-disable-next-line no-console
        console.error(err);
      });
  };

  return (
    <div>
      <Heading>Wallet</Heading>
      {isLoggedIn ? (
        <>
          <div>AccountId: {accountId}</div>

          <Button onClick={handleSignOut}>Sign Out</Button>
        </>
      ) : (
        <p>
          <Button onClick={handleConnectWallet}>Connect Wallet</Button>
        </p>
      )}
    </div>
  );
}
