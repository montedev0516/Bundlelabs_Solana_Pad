import { useContext, useState } from "react";
import { toast } from "react-toastify";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";

import NotifyAddressDialog from "../components/Dialogs/NotifyAddressDialog";
import { USE_JITO, createOpenBookMarket, sendAndConfirmSignedTransactions, getTipTransaction } from "../utils/solana";
import { isValidAddress } from "../utils/methods";
import { AppContext } from "../providers/AppContext";

export default function OpenBookMarketPage({ className }) {
    const {
        SERVER_URL,
        user,
        setLoadingPrompt,
        setOpenLoading,
    } = useContext(AppContext);
    const { connected, publicKey, signAllTransactions } = useWallet();
    const { connection } = useConnection();

    const [baseTokenAddress, setBaseTokenAddress] = useState("");
    const [quoteTokenAddress, setQuoteTokenAddress] = useState("So11111111111111111111111111111111111111112");
    const [minOrderSize, setMinOrderSize] = useState("");
    const [minPriceTickSize, setMinPriceTickSize] = useState("");
    const [notifyAddressDialog, setNotifyAddressDialog] = useState(false);
    const [notifyTitle, setNotifyTitle] = useState("");
    const [notifyAddress, setNotifyAddress] = useState("");

    const handleCreate = async () => {
        if (!connected) {
            toast.warn("Please connect wallet!");
            return;
        }

        if (!isValidAddress(baseTokenAddress)) {
            toast.warn("Invalid base token address!");
            return;
        }

        if (!isValidAddress(quoteTokenAddress)) {
            toast.warn("Invalid quote token address!");
            return;
        }

        const orderSize = parseFloat(minOrderSize);
        if (isNaN(orderSize) || orderSize <= 0) {
            toast.warn("Invalid minimum order size!");
            return;
        }

        const tickSize = parseFloat(minPriceTickSize);
        if (isNaN(tickSize) || tickSize <= 0) {
            toast.warn("Invalid minimum price tick size!");
            return;
        }

        setLoadingPrompt("Creating OpenBook market...");
        setOpenLoading(true);
        try {
            const { marketId, transactions } = await createOpenBookMarket(connection, baseTokenAddress, quoteTokenAddress, orderSize, tickSize, publicKey);
            if (!transactions) {
                setNotifyTitle("Market ID");
                setNotifyAddress(marketId.toBase58());
                setNotifyAddressDialog(true);
                toast.success("Already created OpenBook market!");
                setOpenLoading(false);
                return;
            }

            let txns = [...transactions];
            if (USE_JITO) {
                const tipTxn = await getTipTransaction(connection, publicKey, user.presets.jitoTip);
                txns.push(tipTxn);
            }
            const signedTxns = await signAllTransactions(txns);
            const res = await sendAndConfirmSignedTransactions(USE_JITO, connection, signedTxns);
            if (res) {
                setNotifyTitle("Market ID");
                setNotifyAddress(marketId.toBase58());
                setNotifyAddressDialog(true);
                toast.success("Succeed to create OpenBook market!");
            }
            else
                toast.warn("Failed to create OpenBook market!");
        }
        catch (err) {
            console.log(err);
            toast.warn("Failed to create OpenBook market!");
        }
        setOpenLoading(false);
    };

    return (
        <div className={`${className} flex flex-col text-white font-sans gap-3 max-w-[600px] m-auto`}>
            <NotifyAddressDialog isOpen={notifyAddressDialog} title={notifyTitle} address={notifyAddress} onClose={() => setNotifyAddressDialog(false)} />
            <div className="w-full">
                <div className="flex items-center justify-between w-full h-auto mb-5">
                    <div className="m-auto mt-10 text-xl font-medium text-white">
                        Create OpenBook Market
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
                            value={baseTokenAddress}
                            onChange={(e) => setBaseTokenAddress(e.target.value)}
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
                            value={quoteTokenAddress}
                            onChange={(e) => setQuoteTokenAddress(e.target.value)}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="col-span-1">
                            <div className="font-sans text-xs uppercase text-gray-normal">
                                Minimum Order Size<span className="pl-1 text-green-normal">*</span>
                            </div>
                            <input
                                className="outline-none border border-gray-border font-sans text-white placeholder:text-gray-border text-sm px-2.5 bg-transparent w-full h-button mt-1 rounded-lg"
                                placeholder="Enter minimum order size"
                                value={minOrderSize}
                                onChange={(e) => setMinOrderSize(e.target.value)}
                            />
                        </div>
                        <div className="col-span-1">
                            <div className="font-sans text-xs uppercase text-gray-normal">
                                Minimum Price Tick Size<span className="pl-1 text-green-normal">*</span>
                            </div>
                            <input
                                className="outline-none border border-gray-border font-sans text-white placeholder:text-gray-border text-sm px-2.5 bg-transparent w-full h-button mt-1 rounded-lg"
                                placeholder="Enter minimum price tick size"
                                value={minPriceTickSize}
                                onChange={(e) => setMinPriceTickSize(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="relative flex mt-3 text-white bg-transparent justify-evenly bg-clip-border">
                        <button
                            className="font-sans text-xs font-medium text-center text-white uppercase px-6 h-10 rounded-[4px] justify-center items-center gap-2.5 inline-flex bg-green-normal active:scale-95 transition duration-90 ease-in-out transform focus:outline-none w-full"
                            onClick={handleCreate}>
                            Create Market
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
