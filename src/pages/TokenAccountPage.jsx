import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { BN } from "bn.js";
import {
    PublicKey,
} from "@solana/web3.js";
import {
    getMint,
    getAccount,
    getAssociatedTokenAddress,
} from "@solana/spl-token";

import { USE_JITO, burnTokenByPercent, closeTokenAccount, sendAndConfirmSignedTransactions, getTipTransaction } from "../utils/solana";
import { isValidAddress } from "../utils/methods";
import { AppContext } from "../providers/AppContext";

export default function TokenAccountPage({ className }) {
    const {
        SERVER_URL,
        user,
        setLoadingPrompt,
        setOpenLoading,
    } = useContext(AppContext);
    const { connected, publicKey, signAllTransactions } = useWallet();
    const { connection } = useConnection();

    const [burnTokenAddress, setBurnTokenAddress] = useState("");
    const [burnTokenBalance, setBurnTokenBalance] = useState("0");
    const [burnTokenPercent, setBurnTokenPercent] = useState("");
    const [closeTokenAddress, setCloseTokenAddress] = useState("");

    const updateBalance = async (connection, tokenAddress, owner) => {
        console.log("Updating balance...", tokenAddress, owner.toBase58());
        try {
            const mint = new PublicKey(tokenAddress);
            const mintInfo = await getMint(connection, mint);
            const tokenATA = await getAssociatedTokenAddress(mint, owner);
            const accountInfo = await getAccount(connection, tokenATA);
            const balance = new BN(accountInfo.amount).div(new BN(Math.pow(10, mintInfo.decimals))).toString();
            return balance;
        }
        catch (err) {
            console.log(err);
            return "0";
        }
    };

    useEffect(() => {
        if (connected && isValidAddress(burnTokenAddress)) {
            updateBalance(connection, burnTokenAddress, publicKey).then(response => {
                setBurnTokenBalance(response);
            });
        }
        else
            setBurnTokenBalance("0");
    }, [connected, connection, publicKey, burnTokenAddress]);

    const handleBurnToken = async () => {
        if (!connected) {
            toast.warn("Please connect wallet!");
            return;
        }

        if (!isValidAddress(burnTokenAddress)) {
            toast.warn("Invalid token address!");
            return;
        }

        const percent = parseFloat(burnTokenPercent);
        if (isNaN(percent) || percent <= 0 || percent > 100) {
            toast.warn("Invalid percent value!");
            return;
        }

        setLoadingPrompt("Burning token...");
        setOpenLoading(true);
        try {
            const transaction = await burnTokenByPercent(connection, burnTokenAddress, percent, publicKey);
            let txns = [transaction];
            if (USE_JITO) {
                const tipTxn = await getTipTransaction(connection, publicKey, user.presets.jitoTip);
                txns.push(tipTxn);
            }
            const signedTxns = await signAllTransactions(txns);
            const res = await sendAndConfirmSignedTransactions(USE_JITO, connection, signedTxns);
            if (res) {
                const balance = await updateBalance(connection, burnTokenAddress, publicKey);
                setBurnTokenBalance(balance);
                toast.success("Succeed to burn token!");
            }
            else
                toast.warn("Failed to burn token!");
        }
        catch (err) {
            console.log(err);
            toast.warn("Failed to burn token!");
        }
        setOpenLoading(false);
    };

    const handleCloseTokenAccount = async () => {
        if (!connected) {
            toast.warn("Please connect wallet!");
            return;
        }

        if (!isValidAddress(closeTokenAddress)) {
            toast.warn("Invalid token address!");
            return;
        }

        setLoadingPrompt("Closing token account...");
        setOpenLoading(true);
        try {
            const balance = await updateBalance(connection, closeTokenAddress, publicKey);
            if (balance !== "0") {
                toast.warn("Balance of token must be 0!");
                setOpenLoading(false);
                return;
            }

            const transaction = await closeTokenAccount(connection, closeTokenAddress, publicKey);
            let txns = [transaction];
            if (USE_JITO) {
                const tipTxn = await getTipTransaction(connection, publicKey, user.presets.jitoTip);
                txns.push(tipTxn);
            }
            const signedTxns = await signAllTransactions(txns);
            const res = await sendAndConfirmSignedTransactions(USE_JITO, connection, signedTxns);
            if (res)
                toast.success("Succeed to close token account!");
            else
                toast.warn("Failed to close token account!");
        }
        catch (err) {
            console.log(err);
            toast.warn("Failed to close token account!");
        }
        setOpenLoading(false);
    };

    return (
        <div className={`${className} flex flex-col text-white font-sans gap-3 max-w-[600px] m-auto`}>
            <div className="w-full mb-10">
                <div className="flex items-center justify-between w-full h-auto mb-5">
                    <div className="m-auto mt-10 text-xl font-medium text-white">
                        Burn Token
                    </div>
                </div>
                <div className="flex flex-col gap-4">
                    <div className="">
                        <div className="font-sans text-xs uppercase text-gray-normal">
                            Token Address<span className="pl-1 text-green-normal">*</span>
                        </div>
                        <input
                            className="outline-none border border-gray-border font-sans text-white placeholder:text-gray-border text-sm px-2.5 bg-transparent w-full h-button mt-1"
                            placeholder="Enter token address"
                            value={burnTokenAddress}
                            onChange={(e) => setBurnTokenAddress(e.target.value)}
                        />
                    </div>
                    <div className="">
                        <div className="font-sans text-xs uppercase text-gray-normal">
                            % to burn token
                        </div>
                        <div className="outline-none border border-gray-border font-sans text-white placeholder:text-gray-border text-sm px-2.5 bg-transparent w-full py-2 mt-1">
                            <p className="text-xs text-right text-yellow-normal">Balance: {burnTokenBalance}</p>
                            <input
                                className="w-full font-sans text-sm text-right text-white bg-transparent outline-none placeholder:text-gray-border h-button"
                                placeholder="Enter % amount to burn token"
                                value={burnTokenPercent}
                                onChange={(e) => setBurnTokenPercent(e.target.value)} />
                            <div className="flex text-white text-[10px] gap-1 justify-end">
                                <button className="px-2 py-1 rounded-[2px] bg-gray-highlight active:scale-95 transition duration-90 ease-in-out transform text-xxs text-white uppercase disabled:text-gray-border disabled:opacity-50 disabled:cursor-not-allowed"
                                    onClick={() => setBurnTokenPercent("25")}>
                                    25%
                                </button>
                                <button className="px-2 py-1 rounded-[2px] bg-gray-highlight active:scale-95 transition duration-90 ease-in-out transform text-xxs text-white uppercase disabled:text-gray-border disabled:opacity-50 disabled:cursor-not-allowed"
                                    onClick={() => setBurnTokenPercent("50")}>
                                    50%
                                </button>
                                <button className="px-2 py-1 rounded-[2px] bg-gray-highlight active:scale-95 transition duration-90 ease-in-out transform text-xxs text-white uppercase disabled:text-gray-border disabled:opacity-50 disabled:cursor-not-allowed"
                                    onClick={() => setBurnTokenPercent("75")}>
                                    75%
                                </button>
                                <button className="px-2 py-1 rounded-[2px] bg-gray-highlight active:scale-95 transition duration-90 ease-in-out transform text-xxs text-white uppercase disabled:text-gray-border disabled:opacity-50 disabled:cursor-not-allowed"
                                    onClick={() => setBurnTokenPercent("100")}>
                                    100%
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="relative flex text-white bg-transparent justify-evenly bg-clip-border">
                        <button
                            className="font-sans text-xs font-medium text-center text-white uppercase px-6 h-10 rounded-[4px] justify-center items-center gap-2.5 inline-flex bg-green-normal active:scale-95 transition duration-90 ease-in-out transform focus:outline-none w-full"
                            onClick={handleBurnToken}>
                            Burn Token
                        </button>
                    </div>
                </div>
            </div>
            <div className="w-full border-t border-dashed border-gray-highlight">
                <div className="flex items-center justify-between w-full h-auto mb-5">
                    <div className="m-auto mt-10 text-xl font-medium text-white">
                        Close Token Account
                    </div>
                </div>
                <div className="flex flex-col gap-3">
                    <div className="flex flex-row items-end justify-center gap-2">
                        <div className="grow">
                            <div className="font-sans text-xs uppercase text-gray-normal">
                                Token Address<span className="pl-1 text-green-normal">*</span>
                            </div>
                            <input
                                className="outline-none border border-gray-border font-sans text-white placeholder:text-gray-border text-sm px-2.5 bg-transparent w-full h-button mt-1"
                                placeholder="Enter token address (mint)"
                                value={closeTokenAddress}
                                onChange={(e) => setCloseTokenAddress(e.target.value)}
                            />
                        </div>
                        <div className="relative flex text-white bg-transparent justify-evenly bg-clip-border">
                            <button
                                className="font-sans text-xs font-medium text-center text-white uppercase px-6 h-10 rounded-[4px] justify-center items-center gap-2.5 inline-flex bg-green-normal active:scale-95 transition duration-90 ease-in-out transform focus:outline-none w-full"
                                onClick={handleCloseTokenAccount}>
                                Close Account
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
