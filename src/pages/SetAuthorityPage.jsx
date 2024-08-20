import { useContext, useState } from "react";
import { toast } from "react-toastify";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";

import { USE_JITO, setMintAuthority, setFreezeAuthority, sendAndConfirmSignedTransactions, getTipTransaction } from "../utils/solana";
import { isValidAddress } from "../utils/methods";
import { AppContext } from "../providers/AppContext";

export default function SetAuthorityPage({ className }) {
    const {
        SERVER_URL,
        user,
        setLoadingPrompt,
        setOpenLoading,
    } = useContext(AppContext);
    const { connected, publicKey, signAllTransactions } = useWallet();
    const { connection } = useConnection();

    const [revokeMintTokenAddress, setRevokeMintTokenAddress] = useState("");
    const [revokeFreezeTokenAddress, setRevokeFreezeTokenAddress] = useState("");
    const [mintTokenAddress, setMintTokenAddress] = useState("");
    const [mintOwnerAddress, setMintOwnerAddress] = useState("");
    const [freezeTokenAddress, setFreezeTokenAddress] = useState("");
    const [freezeOwnerAddress, setFreezeOwnerAddress] = useState("");

    const handleRevokeMintAuthority = async () => {
        if (!connected) {
            toast.warn("Please connect wallet!");
            return;
        }

        if (!isValidAddress(revokeMintTokenAddress)) {
            toast.warn("Invalid token address to revoke mint authority!");
            return;
        }

        setLoadingPrompt("Revoking mint authority...");
        setOpenLoading(true);
        try {
            const transaction = await setMintAuthority(connection, revokeMintTokenAddress, publicKey, null);
            if (transaction) {
                let txns = [transaction];
                if (USE_JITO) {
                    const tipTxn = await getTipTransaction(connection, publicKey, user.presets.jitoTip);
                    txns.push(tipTxn);
                }

                const signedTxns = await signAllTransactions(txns);
                const res = await sendAndConfirmSignedTransactions(USE_JITO, connection, signedTxns);
                if (res) {
                    toast.success("Succeed to revoke mint authority!");
                }
                else
                    toast.warn("Failed to revoke mint authority!");
            }
        }
        catch (err) {
            console.log(err);
            toast.warn("Failed to revoke mint authority");
        }
        setOpenLoading(false);
    };

    const handleRevokeFreezeAuthority = async () => {
        if (!connected) {
            toast.warn("Please connect wallet!");
            return;
        }

        if (!isValidAddress(revokeFreezeTokenAddress)) {
            toast.warn("Invalid token address to revoke freeze authority!");
            return;
        }

        setLoadingPrompt("Revoking freeze authority...");
        setOpenLoading(true);
        try {
            const transaction = await setFreezeAuthority(connection, revokeFreezeTokenAddress, publicKey, null);
            if (transaction) {
                let txns = [transaction];
                if (USE_JITO) {
                    const tipTxn = await getTipTransaction(connection, publicKey, user.presets.jitoTip);
                    txns.push(tipTxn);
                }

                const signedTxns = await signAllTransactions(txns);
                const res = await sendAndConfirmSignedTransactions(USE_JITO, connection, signedTxns);
                if (res) {
                    toast.success("Succeed to revoke freeze authority!");
                }
                else
                    toast.warn("Failed to revoke freeze authority!");
            }
        }
        catch (err) {
            console.log(err);
            toast.warn("Failed to revoke freeze authority");
        }
        setOpenLoading(false);
    };

    const handleSetMintAuthority = async () => {
        if (!connected) {
            toast.warn("Please connect wallet!");
            return;
        }

        if (!isValidAddress(mintTokenAddress)) {
            toast.warn("Invalid token address to set mint authority!");
            return;
        }

        if (!isValidAddress(mintOwnerAddress)) {
            toast.warn("Invalid new mint owner address!");
            return;
        }

        setLoadingPrompt("Setting mint authority...");
        setOpenLoading(true);
        try {
            const transaction = await setMintAuthority(connection, mintTokenAddress, publicKey, mintOwnerAddress);
            if (transaction) {
                let txns = [transaction];
                if (USE_JITO) {
                    const tipTxn = await getTipTransaction(connection, publicKey, user.presets.jitoTip);
                    txns.push(tipTxn);
                }

                const signedTxns = await signAllTransactions(txns);
                const res = await sendAndConfirmSignedTransactions(USE_JITO, connection, signedTxns);
                if (res) {
                    toast.success("Succeed to set mint authority!");
                }
                else
                    toast.warn("Failed to set mint authority!");
            }
        }
        catch (err) {
            console.log(err);
            toast.warn("Failed to set mint authority");
        }
        setOpenLoading(false);
    };

    const handleSetFreezeAuthority = async () => {
        if (!connected) {
            toast.warn("Please connect wallet!");
            return;
        }

        if (!isValidAddress(freezeTokenAddress)) {
            toast.warn("Invalid token address to set freeze authority!");
            return;
        }

        if (!isValidAddress(freezeOwnerAddress)) {
            toast.warn("Invalid new freeze owner address!");
            return;
        }

        setLoadingPrompt("Setting freeze authority...");
        setOpenLoading(true);
        try {
            const transaction = await setFreezeAuthority(connection, freezeTokenAddress, publicKey, freezeOwnerAddress);
            if (transaction) {
                let txns = [transaction];
                if (USE_JITO) {
                    const tipTxn = await getTipTransaction(connection, publicKey, user.presets.jitoTip);
                    txns.push(tipTxn);
                }

                const signedTxns = await signAllTransactions(txns);
                const res = await sendAndConfirmSignedTransactions(USE_JITO, connection, signedTxns);
                if (res) {
                    toast.success("Succeed to set freeze authority!");
                }
                else
                    toast.warn("Failed to set freeze authority!");
            }
        }
        catch (err) {
            console.log(err);
            toast.warn("Failed to set freeze authority");
        }
        setOpenLoading(false);
    };

    return (
        <div className={`${className} flex flex-col text-white font-sans gap-3 max-w-[500px] m-auto`}>
            <div className="w-full py-10 border-t border-dashed border-gray-highlight">
                <div className="flex items-center justify-between w-full h-auto mb-3">
                    <div className="m-auto text-xl font-medium text-white">
                        Revoke Mint Authority
                    </div>
                </div>
                <div className="flex flex-col gap-3">
                    <div className="flex flex-row items-end justify-between gap-2">
                        <div className="items-center grow">
                            <div className="font-sans text-xs uppercase text-gray-normal">
                                Token Address<span className="pl-1 text-green-normal">*</span>
                            </div>
                            <input
                                className="outline-none border border-gray-border font-sans text-white placeholder:text-gray-border text-sm px-2.5 bg-transparent w-full h-button mt-1 rounded-lg"
                                placeholder="Enter token address"
                                value={revokeMintTokenAddress}
                                onChange={(e) => setRevokeMintTokenAddress(e.target.value)}
                            />
                        </div>
                        <div className="relative flex text-white bg-transparent justify-evenly bg-clip-border">
                            <button
                                className="font-sans text-xs font-medium text-center text-white uppercase px-6 h-10 rounded-[4px] justify-center items-center gap-2.5 inline-flex bg-green-normal active:scale-95 transition duration-90 ease-in-out transform focus:outline-none w-full"
                                onClick={handleRevokeMintAuthority}>
                                Revoke
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="w-full mt-5 mb-10">
                <div className="flex items-center justify-between w-full h-auto mb-3">
                    <div className="m-auto text-xl font-medium text-white">
                        Set Mint Authority
                    </div>
                </div>
                <div className="flex flex-col gap-3">
                    <div className="flex flex-col justify-between gap-4">
                        <div className="items-center">
                            <div className="font-sans text-xs uppercase text-gray-normal">
                                Token Address<span className="pl-1 text-green-normal">*</span>
                            </div>
                            <input
                                className="outline-none border border-gray-border font-sans text-white placeholder:text-gray-border text-sm px-2.5 bg-transparent w-full h-button mt-1 rounded-lg"
                                placeholder="Enter token address"
                                value={mintTokenAddress}
                                onChange={(e) => setMintTokenAddress(e.target.value)}
                            />
                        </div>
                        <div className="items-center">
                            <div className="font-sans text-xs uppercase text-gray-normal">
                                New Owner Address<span className="pl-1 text-green-normal">*</span>
                            </div>
                            <input
                                className="outline-none border border-gray-border font-sans text-white placeholder:text-gray-border text-sm px-2.5 bg-transparent w-full h-button mt-1 rounded-lg"
                                placeholder="Enter new owner address"
                                value={mintOwnerAddress}
                                onChange={(e) => setMintOwnerAddress(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="relative flex text-white bg-transparent justify-evenly bg-clip-border">
                        <button
                            className="font-sans text-xs font-medium text-center text-white uppercase px-6 h-10 rounded-[4px] justify-center items-center gap-2.5 inline-flex bg-green-normal active:scale-95 transition duration-90 ease-in-out transform focus:outline-none w-full"
                            onClick={handleSetMintAuthority}>
                            Set Authority
                        </button>
                    </div>
                </div>
            </div>
            <div className="w-full py-10 border-t border-dashed border-gray-highlight">
                <div className="flex items-center justify-between w-full h-auto mb-3">
                    <div className="m-auto text-xl font-medium text-white">
                        Revoke Freeze Authority
                    </div>
                </div>
                <div className="flex flex-col gap-3">
                    <div className="flex flex-row items-end justify-between gap-2">
                        <div className="items-center grow">
                            <div className="font-sans text-xs uppercase text-gray-normal">
                                Token Address<span className="pl-1 text-green-normal">*</span>
                            </div>
                            <input
                                className="outline-none border border-gray-border font-sans text-white placeholder:text-gray-border text-sm px-2.5 bg-transparent w-full h-button mt-1 rounded-lg"
                                placeholder="Enter token address"
                                value={revokeFreezeTokenAddress}
                                onChange={(e) => setRevokeFreezeTokenAddress(e.target.value)}
                            />
                        </div>
                        <div className="relative flex text-white bg-transparent justify-evenly bg-clip-border">
                            <button
                                className="font-sans text-xs font-medium text-center text-white uppercase px-6 h-10 rounded-[4px] justify-center items-center gap-2.5 inline-flex bg-green-normal active:scale-95 transition duration-90 ease-in-out transform focus:outline-none w-full"
                                onClick={handleRevokeFreezeAuthority}>
                                Revoke
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="w-full pt-10 border-t border-dashed border-gray-highlight">
                <div className="flex items-center justify-between w-full h-auto mb-3">
                    <div className="m-auto text-xl font-medium text-white">
                        Set Freeze Authority
                    </div>
                </div>
                <div className="flex flex-col gap-3">
                    <div className="flex flex-col justify-between gap-4">
                        <div className="items-center">
                            <div className="font-sans text-xs uppercase text-gray-normal">
                                Token Address<span className="pl-1 text-green-normal">*</span>
                            </div>
                            <input
                                className="outline-none border border-gray-border font-sans text-white placeholder:text-gray-border text-sm px-2.5 bg-transparent w-full h-button mt-1 rounded-lg"
                                placeholder="Enter token address"
                                value={freezeTokenAddress}
                                onChange={(e) => setFreezeTokenAddress(e.target.value)}
                            />
                        </div>
                        <div className="items-center">
                            <div className="font-sans text-xs uppercase text-gray-normal">
                                New Owner Address<span className="pl-1 text-green-normal">*</span>
                            </div>
                            <input
                                className="outline-none border border-gray-border font-sans text-white placeholder:text-gray-border text-sm px-2.5 bg-transparent w-full h-button mt-1 rounded-lg"
                                placeholder="Enter new owner address"
                                value={freezeOwnerAddress}
                                onChange={(e) => setFreezeOwnerAddress(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="relative flex text-white bg-transparent justify-evenly bg-clip-border">
                        <button
                            className="font-sans text-xs font-medium text-center text-white uppercase px-6 h-10 rounded-[4px] justify-center items-center gap-2.5 inline-flex bg-green-normal active:scale-95 transition duration-90 ease-in-out transform focus:outline-none w-full"
                            onClick={handleSetFreezeAuthority}>
                            Set Authority
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
