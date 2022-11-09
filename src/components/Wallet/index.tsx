// connect wallet component
import { connectWallet } from "../../utils";

interface ConnectWalletProps {
  walletAddress: string;
  onConnectWallet: () => void;
}

const ConnectWallet: React.FC<ConnectWalletProps> = ({
  walletAddress,
  onConnectWallet,
}) => {
  const onClickConnect = () => {
    onConnectWallet();
  };

  return (
    <div className="connect-wallet">
      <div className="connect-wallet__button">
        {walletAddress ? (
          <button className="button button--hover"> {walletAddress} </button>
        ) : (
          <button className="button button--hover" onClick={onClickConnect}>
            {" "}
            Connect Wallet{" "}
          </button>
        )}
      </div>
    </div>
  );
};

export default ConnectWallet;
