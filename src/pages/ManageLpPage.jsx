import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";

import { USE_JITO, getLPBalance, removeLiquidityByPercent, burnLPByPercent, sendAndConfirmSignedTransactions, getTipTransaction } from "../utils/solana";
import { isValidAddress } from "../utils/methods";
import { AppContext } from "../providers/AppContext";

export default function ManageLpPage({ className }) {
    const {
        SERVER_URL,
        user,
        setLoadingPrompt,
        setOpenLoading,
    } = useContext(AppContext);
    const { connected, publicKey, signAllTransactions } = useWallet();
    const { connection } = useConnection();

    const [removeBaseTokenAddress, setRemoveBaseTokenAddress] = useState("");
    const [removeQuoteTokenAddress, setRemoveQuoteTokenAddress] = useState("So11111111111111111111111111111111111111112");
    const [removeLpBalance, setRemoveLpBalance] = useState("0");
    const [removeLpPercent, setRemoveLpPercent] = useState("");
    const [burnBaseTokenAddress, setBurnBaseTokenAddress] = useState("");
    const [burnQuoteTokenAddress, setBurnQuoteTokenAddress] = useState("So11111111111111111111111111111111111111112");
    const [burnLpBalance, setBurnLpBalance] = useState("0");
    const [burnLpPercent, setBurnLpPercent] = useState("");

    useEffect(() => {
        if (connected && isValidAddress(removeBaseTokenAddress) && isValidAddress(removeQuoteTokenAddress)) {
            getLPBalance(connection, removeBaseTokenAddress, removeQuoteTokenAddress, publicKey).then((resposne) => {
                setRemoveLpBalance(resposne);
            });
        }
        else
            setRemoveLpBalance("0");
    }, [connected, connection, publicKey, removeBaseTokenAddress, removeQuoteTokenAddress]);

    useEffect(() => {
        if (connected && isValidAddress(burnBaseTokenAddress) && isValidAddress(burnQuoteTokenAddress)) {
            getLPBalance(connection, burnBaseTokenAddress, burnQuoteTokenAddress, publicKey).then((resposne) => {
                setBurnLpBalance(resposne);
            });
        }
        else
            setBurnLpBalance("0");
    }, [connected, connection, publicKey, burnBaseTokenAddress, burnQuoteTokenAddress]);

    const handleRemoveLiquidity = async () => {
        if (!connected) {
            toast.warn("Please connect wallet!");
            return;
        }

        if (!isValidAddress(removeBaseTokenAddress)) {
            toast.warn("Invalid base token address!");
            return;
        }

        if (!isValidAddress(removeQuoteTokenAddress)) {
            toast.warn("Invalid quote token address!");
            return;
        }

        const percent = parseFloat(removeLpPercent);
        if (isNaN(percent) || percent <= 0 || percent > 100) {
            toast.warn("Invalid percent value!");
            return;
        }

        setLoadingPrompt("Removing liquidity...");
        setOpenLoading(true);
        try {
            const transactions = await removeLiquidityByPercent(connection, removeBaseTokenAddress, removeQuoteTokenAddress, percent, publicKey);
            if (transactions) {
                let txns = [...transactions];
                if (USE_JITO) {
                    const tipTxn = await getTipTransaction(connection, publicKey, user.presets.jitoTip);
                    txns.push(tipTxn);
                }
                const signedTxns = await signAllTransactions(txns);
                const res = await sendAndConfirmSignedTransactions(USE_JITO, connection, signedTxns);
                if (res) {
                    const balance = await getLPBalance(connection, removeBaseTokenAddress, removeQuoteTokenAddress, publicKey);
                    setRemoveLpBalance(balance);
                    if (removeBaseTokenAddress === burnBaseTokenAddress && removeQuoteTokenAddress === burnQuoteTokenAddress)
                        setBurnLpBalance(balance);
                    toast.success("Succeed to remove liquidity!");
                }
                else
                    toast.warn("Failed to remove liquidity!");
            }
            else
                toast.warn("Failed to remove liquidity!");
        }
        catch (err) {
            console.log(err);
            toast.warn("Failed to remove liquidity!");
        }
        setOpenLoading(false);
    };

    const handleBurnLP = async () => {
        if (!connected) {
            toast.warn("Please connect wallet!");
            return;
        }

        if (!isValidAddress(burnBaseTokenAddress)) {
            toast.warn("Invalid base token address!");
            return;
        }

        if (!isValidAddress(burnQuoteTokenAddress)) {
            toast.warn("Invalid quote token address!");
            return;
        }

        const percent = parseFloat(burnLpPercent);
        if (isNaN(percent) || percent <= 0 || percent > 100) {
            toast.warn("Invalid percent value!");
            return;
        }

        setLoadingPrompt("Burning LP...");
        setOpenLoading(true);
        try {
            const transaction = await burnLPByPercent(connection, burnBaseTokenAddress, burnQuoteTokenAddress, percent, publicKey);
            if (transaction) {
                let txns = [transaction];
                if (USE_JITO) {
                    const tipTxn = await getTipTransaction(connection, publicKey, user.presets.jitoTip);
                    txns.push(tipTxn);
                }
                const signedTxns = await signAllTransactions(txns);
                const res = await sendAndConfirmSignedTransactions(USE_JITO, connection, signedTxns);
                if (res) {
                    const balance = await getLPBalance(connection, burnBaseTokenAddress, burnQuoteTokenAddress, publicKey);
                    setBurnLpBalance(balance);
                    if (removeBaseTokenAddress === burnBaseTokenAddress && removeQuoteTokenAddress === burnQuoteTokenAddress)
                        setRemoveLpBalance(balance);
                    toast.success("Succeed to burn LP!");
                }
                else
                    toast.warn("Failed to burn LP!");
            }
            else
                toast.warn("Failed to burn LP!");
        }
        catch (err) {
            console.log(err);
            toast.warn("Failed to burn LP!");
        }
        setOpenLoading(false);
    };

    return (
        <div className={`${className} flex flex-col text-white font-sans max-w-[900px] m-auto`}>
            <div className="grid grid-cols-2 gap-10">
                <div className="col-span-2 xl:col-span-1">
                    <div className="flex items-center justify-between w-full h-auto mb-5">
                        <div className="m-auto mt-10 text-xl font-medium text-white">
                            Remove Liquidity
                        </div>
                    </div>
                    <div className="flex flex-col gap-4">
                        <div className="">
                            <div className="font-sans text-xs uppercase text-gray-normal">
                                Base Token Address<span className="pl-1 text-green-normal">*</span>
                            </div>
                            <input
                                className="outline-none border border-gray-border font-sans text-white placeholder:text-gray-border text-sm px-2.5 bg-transparent w-full h-button mt-1 rounded-lg"
                                placeholder="Enter base token address"
                                value={removeBaseTokenAddress}
                                onChange={(e) => setRemoveBaseTokenAddress(e.target.value)}
                            />
                        </div>
                        <div className="">
                            <div className="font-sans text-xs uppercase text-gray-normal">
                                Quote Token Address<span className="pl-1 text-green-normal">*</span>
                            </div>
                            <input
                                className="outline-none border border-gray-border font-sans text-white placeholder:text-gray-border text-sm px-2.5 bg-transparent w-full h-button mt-1 rounded-lg"
                                placeholder="Enter quote token address"
                                disabled
                                value={removeQuoteTokenAddress}
                                onChange={(e) => setRemoveQuoteTokenAddress(e.target.value)}
                            />
                        </div>
                        <div className="">
                            <div className="font-sans text-xs uppercase text-gray-normal">
                                % to remove liquidity<span className="pl-1 text-green-normal">*</span>
                            </div>
                            <div className="outline-none border border-gray-border font-sans text-white placeholder:text-gray-border text-sm px-2.5 bg-transparent w-full py-2 mt-1">
                                <p className="text-xs text-right text-yellow-normal">Balance: {removeLpBalance}</p>
                                <input
                                    className="w-full font-sans text-sm text-right text-white bg-transparent outline-none placeholder:text-gray-border h-button rounded-lg"
                                    placeholder="Enter % amount to remove liquidity"
                                    value={removeLpPercent}
                                    onChange={(e) => setRemoveLpPercent(e.target.value)} />
                                <div className="flex text-white text-[10px] gap-1 justify-end">
                                    <button className="px-2 py-1 rounded-[2px] bg-gray-highlight active:scale-95 transition duration-90 ease-in-out transform text-xxs text-white uppercase disabled:text-gray-border disabled:opacity-50 disabled:cursor-not-allowed"
                                        onClick={() => setRemoveLpPercent("25")}>
                                        25%
                                    </button>
                                    <button className="px-2 py-1 rounded-[2px] bg-gray-highlight active:scale-95 transition duration-90 ease-in-out transform text-xxs text-white uppercase disabled:text-gray-border disabled:opacity-50 disabled:cursor-not-allowed"
                                        onClick={() => setRemoveLpPercent("50")}>
                                        50%
                                    </button>
                                    <button className="px-2 py-1 rounded-[2px] bg-gray-highlight active:scale-95 transition duration-90 ease-in-out transform text-xxs text-white uppercase disabled:text-gray-border disabled:opacity-50 disabled:cursor-not-allowed"
                                        onClick={() => setRemoveLpPercent("75")}>
                                        75%
                                    </button>
                                    <button className="px-2 py-1 rounded-[2px] bg-gray-highlight active:scale-95 transition duration-90 ease-in-out transform text-xxs text-white uppercase disabled:text-gray-border disabled:opacity-50 disabled:cursor-not-allowed"
                                        onClick={() => setRemoveLpPercent("100")}>
                                        100%
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="relative flex mt-6 text-white bg-transparent justify-evenly bg-clip-border">
                        <button
                            className="font-sans text-xs font-medium text-center text-white uppercase px-6 h-10 rounded-[4px] justify-center items-center gap-2.5 inline-flex bg-green-normal active:scale-95 transition duration-90 ease-in-out transform focus:outline-none w-full"
                            onClick={handleRemoveLiquidity}>
                            Remove Liquidity
                        </button>
                    </div>
                </div>
                <div className="col-span-2 xl:col-span-1">
                    <div className="flex items-center justify-between w-full h-auto mb-5">
                        <div className="m-auto mt-10 text-xl font-medium text-white">
                            Burn LP
                        </div>
                    </div>
                    <div className="flex flex-col gap-4">
                        <div className="">
                            <div className="font-sans text-xs uppercase text-gray-normal">
                                Base Token Address<span className="pl-1 text-green-normal">*</span>
                            </div>
                            <input
                                className="outline-none border border-gray-border font-sans text-white placeholder:text-gray-border text-sm px-2.5 bg-transparent w-full h-button mt-1 rounded-lg"
                                placeholder="Enter base token address"
                                value={burnBaseTokenAddress}
                                onChange={(e) => setBurnBaseTokenAddress(e.target.value)}
                            />
                        </div>
                        <div className="">
                            <div className="font-sans text-xs uppercase text-gray-normal">
                                Quote Token Address<span className="pl-1 text-green-normal">*</span>
                            </div>
                            <input
                                className="outline-none border border-gray-border font-sans text-white placeholder:text-gray-border text-sm px-2.5 bg-transparent w-full h-button mt-1 rounded-lg"
                                placeholder="Enter quote token address"
                                disabled
                                value={burnQuoteTokenAddress}
                                onChange={(e) => setBurnQuoteTokenAddress(e.target.value)}
                            />
                        </div>
                        <div className="">
                            <div className="font-sans text-xs uppercase text-gray-normal">
                                % to burn LP<span className="pl-1 text-green-normal">*</span>
                            </div>
                            <div className="outline-none border border-gray-border font-sans text-white placeholder:text-gray-border text-sm px-2.5 bg-transparent w-full py-2 mt-1">
                                <p className="text-xs text-right text-yellow-normal">Balance: {burnLpBalance}</p>
                                <input
                                    className="w-full font-sans text-sm text-right text-white bg-transparent outline-none placeholder:text-gray-border h-button"
                                    placeholder="Enter % amount to burn LP"
                                    value={burnLpPercent}
                                    onChange={(e) => setBurnLpPercent(e.target.value)} />
                                <div className="flex text-white text-[10px] gap-1 justify-end">
                                    <button className="px-2 py-1 rounded-[2px] bg-gray-highlight active:scale-95 transition duration-90 ease-in-out transform text-xxs text-white uppercase disabled:text-gray-border disabled:opacity-50 disabled:cursor-not-allowed"
                                        onClick={() => setBurnLpPercent("25")}>
                                        25%
                                    </button>
                                    <button className="px-2 py-1 rounded-[2px] bg-gray-highlight active:scale-95 transition duration-90 ease-in-out transform text-xxs text-white uppercase disabled:text-gray-border disabled:opacity-50 disabled:cursor-not-allowed"
                                        onClick={() => setBurnLpPercent("50")}>
                                        50%
                                    </button>
                                    <button className="px-2 py-1 rounded-[2px] bg-gray-highlight active:scale-95 transition duration-90 ease-in-out transform text-xxs text-white uppercase disabled:text-gray-border disabled:opacity-50 disabled:cursor-not-allowed"
                                        onClick={() => setBurnLpPercent("75")}>
                                        75%
                                    </button>
                                    <button className="px-2 py-1 rounded-[2px] bg-gray-highlight active:scale-95 transition duration-90 ease-in-out transform text-xxs text-white uppercase disabled:text-gray-border disabled:opacity-50 disabled:cursor-not-allowed"
                                        onClick={() => setBurnLpPercent("100")}>
                                        100%
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="relative flex mt-6 text-white bg-transparent justify-evenly bg-clip-border">
                        <button
                            className="font-sans text-xs font-medium text-center text-white uppercase px-6 h-10 rounded-[4px] justify-center items-center gap-2.5 inline-flex bg-green-normal active:scale-95 transition duration-90 ease-in-out transform focus:outline-none w-full"
                            onClick={handleBurnLP}>
                            Burn LP
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
