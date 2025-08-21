import { useLogin, usePrivy } from '@privy-io/react-auth';

export default function ConnectWallet() {
    const { ready, authenticated } = usePrivy();
    const { login } = useLogin();
    // Disable login when Privy is not ready or the user is already authenticated
    const disableLogin = !ready || (ready && authenticated);

    return (
        <button
            disabled={disableLogin}
            onClick={() => login({
                loginMethods: ['wallet'],
                walletChainType: 'ethereum-and-solana',
                disableSignup: false
            })}
        >
            Log in
        </button>
    );
}