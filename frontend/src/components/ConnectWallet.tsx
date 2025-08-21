import { useLogin, usePrivy } from "@privy-io/react-auth";

export default function ConnectWallet() {
  const { ready, authenticated } = usePrivy();
  const { login } = useLogin();

  // Disable login when Privy is not ready or already authenticated
  const disableLogin = !ready || (ready && authenticated);

  return (
    <button
      disabled={disableLogin}
      onClick={() =>
        login({
          loginMethods: ["wallet"],
          walletChainType: "ethereum-and-solana",
          disableSignup: false,
        })
      }
      className={`w-full px-4 py-2 rounded-lg ${
        disableLogin
          ? "bg-gray-500 cursor-not-allowed"
          : "bg-green-500 hover:bg-green-600"
      }`}
    >
      {authenticated ? "Connected ✅" : "Connect Wallet"}
    </button>
  );
}
