import { useContext, useState } from "react";
import { toast } from "react-toastify";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { FaDiscord, FaImage, FaLink, FaTelegram, FaTwitter, FaUpload } from "react-icons/fa";

import NotifyAddressDialog from "../components/Dialogs/NotifyAddressDialog";
import { pinFileToPinata, pinJsonToPinata, pinFileToNFTStorage, pinJsonToNFTStorage } from "../utils/pinatasdk";
import { USE_JITO, createToken, setMintAuthority, sendAndConfirmSignedTransactions, getTipTransaction } from "../utils/solana";
import { isValidAddress } from "../utils/methods";
import { AppContext } from "../providers/AppContext";

export default function CreateTokenPage({ className }) {
    const {
        SERVER_URL,
        user,
        setLoadingPrompt,
        setOpenLoading,
    } = useContext(AppContext);
    const { connected, publicKey, signAllTransactions } = useWallet();
    const { connection } = useConnection();

    const [name, setName] = useState("");
    const [symbol, setSymbol] = useState("");
    const [decimals, setDecimals] = useState("");
    const [totalSupply, setTotalSupply] = useState("");
    const [logo, setLogo] = useState("");
    const [website, setWebsite] = useState("");
    const [twitter, setTwitter] = useState("");
    const [telegram, setTelegram] = useState("");
    const [discord, setDiscord] = useState("");
    const [description, setDescription] = useState("");
    const [notifyAddressDialog, setNotifyAddressDialog] = useState(false);
    const [notifyTitle, setNotifyTitle] = useState("");
    const [notifyAddress, setNotifyAddress] = useState("");
    const [revokeMintTokenAddress, setRevokeMintTokenAddress] = useState("");

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

    const handleUploadLogo = async (file) => {
        setLoadingPrompt("Uploading logo...");
        setOpenLoading(true);
        try {
            console.log(file);
            // const uri = await pinFileToNFTStorage(file);
            let uri = await pinFileToPinata(file);
            uri = `https://ipfs.io/ipfs/${uri}`;
            console.log(uri);
            setLogo(uri);
            toast.success("Succeed to upload logo!");
        }
        catch (err) {
            console.log(err);
            toast.warn("Failed to upload logo!");
        }
        setOpenLoading(false);
    };

    const handleCreate = async () => {
        if (!connected) {
            toast.warn("Please connect wallet!");
            return;
        }

        if (name === "") {
            toast.warn("Please input name!");
            return;
        }

        if (symbol === "") {
            toast.warn("Please input symbol!");
            return;
        }

        if (decimals === "" || isNaN(Number(decimals))) {
            toast.warn("Please input decimals!");
            return;
        }

        if (totalSupply === "" || isNaN(Number(totalSupply))) {
            toast.warn("Please input total supply!");
            return;
        }

        setLoadingPrompt("Uploading metadata...");
        setOpenLoading(true);
        try {
            let metadata = {
                name: name,
                symbol: symbol,
            };
            if (logo)
                metadata.image = logo;
            if (description)
                metadata.description = description;
            if (website || twitter || telegram || discord) {
                metadata.extensions = {};
                if (website)
                    metadata.extensions.website = website;
                if (twitter)
                    metadata.extensions.twitter = twitter;
                if (telegram)
                    metadata.extensions.telegram = telegram;
                if (discord)
                    metadata.extensions.discord = discord;
            }

            // const uri = await pinJsonToNFTStorage(metadata);
            let uri = await pinJsonToPinata(metadata);
            uri = `https://ipfs.io/ipfs/${uri}`;
            console.log(uri);

            setLoadingPrompt("Creating tokens...");
            try {
                const { mint, transaction } = await createToken(connection, publicKey, name, symbol, uri, Number(decimals), Number(totalSupply));
                if (transaction) {
                    let txns = [transaction];
                    if (USE_JITO) {
                        const tipTxn = await getTipTransaction(connection, publicKey, user.presets.jitoTip);
                        txns.push(tipTxn);
                    }

                    const signedTxns = await signAllTransactions(txns);
                    const res = await sendAndConfirmSignedTransactions(USE_JITO, connection, signedTxns);
                    if (res) {
                        console.log("Mint Address:", mint.toBase58());
                        setNotifyTitle("Token Address");
                        setNotifyAddress(mint.toBase58());
                        setNotifyAddressDialog(true);
                        toast.success("Succeed to create token!");
                    }
                    else
                        toast.warn("Failed to create token!");
                }
            }
            catch (err) {
                console.log(err);
                toast.warn("Failed to create token!");
            }
        }
        catch (err) {
            console.log(err);
            toast.warn("Failed to upload metadata!");
        }
        setOpenLoading(false);
    };

    return (
        <div className={`${className} flex flex-col text-white font-sans gap-3 max-w-[600px] m-auto`}>
            <NotifyAddressDialog isOpen={notifyAddressDialog} title={notifyTitle} address={notifyAddress} onClose={() => setNotifyAddressDialog(false)} />
            <div className="w-full">
                <div className="flex items-center justify-between w-full h-auto mb-5">
                    <div className="m-auto mt-10 text-xl font-medium text-white">
                        Create SPL Token
                    </div>
                </div>
                <div className="flex flex-col gap-3">
                    <div className="flex flex-row justify-between gap-2">
                        <div className="items-center grow">
                            <div className="font-sans text-xs uppercase text-gray-normal">
                                Name<span className="pl-1 text-green-normal">*</span>
                            </div>
                            <input
                                className="outline-none border border-gray-border font-sans text-white placeholder:text-gray-border text-sm px-2.5 bg-transparent w-full h-button mt-1 rounded-lg"
                                placeholder="Enter token name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div className="items-center grow">
                            <div className="font-sans text-xs uppercase text-gray-normal">
                                Symbol<span className="pl-1 text-green-normal">*</span>
                            </div>
                            <input
                                className="outline-none border border-gray-border font-sans text-white placeholder:text-gray-border text-sm px-2.5 bg-transparent w-full h-button mt-1 rounded-lg"
                                placeholder="Enter symbol"
                                value={symbol}
                                onChange={(e) => setSymbol(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="flex flex-row justify-between gap-2">
                        <div className="items-center grow">
                            <div className="font-sans text-xs uppercase text-gray-normal">
                                Decimals<span className="pl-1 text-green-normal">*</span>
                            </div>
                            <input
                                className="outline-none border border-gray-border font-sans text-white placeholder:text-gray-border text-sm px-2.5 bg-transparent w-full h-button mt-1 rounded-lg"
                                placeholder="Enter decimals"
                                value={decimals}
                                onChange={(e) => setDecimals(e.target.value)}
                            />
                        </div>
                        <div className="items-center grow">
                            <div className="font-sans text-xs uppercase text-gray-normal">
                                Total Supply<span className="pl-1 text-green-normal">*</span>
                            </div>
                            <input
                                className="outline-none border border-gray-border font-sans text-white placeholder:text-gray-border text-sm px-2.5 bg-transparent w-full h-button mt-1 rounded-lg"
                                placeholder="Enter total supply"
                                value={totalSupply}
                                onChange={(e) => setTotalSupply(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="items-center">
                        <div className="items-center grow">
                            <div className="flex items-center gap-2 font-sans text-xs uppercase text-gray-normal">
                                <FaImage />
                                Logo
                            </div>
                            <div className="flex items-center">
                                <input
                                    className="outline-none border border-gray-border font-sans text-white placeholder:text-gray-border text-sm px-2.5 bg-transparent w-full h-button grow border-r-0 rounded-lg"
                                    placeholder="Enter logo url"
                                    value={logo}
                                    onChange={(e) => setLogo(e.target.value)}
                                />
                                <label
                                    className="rounded-r-sm cursor-pointer w-button h-button bg-green-normal disabled:!bg-gray-highlight disabled:text-gray-normal active:scale-95 transition duration-90 ease-in-out transform flex items-center justify-center m-0 rounded-lg">
                                    <input type="file"
                                        className="hidden"
                                        onChange={(e) => handleUploadLogo(e.target.files[0])} />
                                    <FaUpload className="w-4 h-4" />
                                </label>
                            </div>
                        </div>
                    </div>
                    <div className="items-center">
                        <div className="flex items-center gap-2 font-sans text-xs uppercase text-gray-normal">
                            <FaLink />
                            Website URL
                        </div>
                        <input
                            className="outline-none border border-gray-border font-sans text-white placeholder:text-gray-border text-sm px-2.5 bg-transparent w-full h-button mt-1 rounded-lg"
                            placeholder="Enter website url"
                            value={website}
                            onChange={(e) => setWebsite(e.target.value)}
                        />
                    </div>
                    <div className="items-center">
                        <div className="flex items-center gap-2 font-sans text-xs uppercase text-gray-normal">
                            <FaTwitter />
                            Twitter URL
                        </div>
                        <input
                            className="outline-none border border-gray-border font-sans text-white placeholder:text-gray-border text-sm px-2.5 bg-transparent w-full h-button mt-1 rounded-lg"
                            placeholder="Enter twitter url"
                            value={twitter}
                            onChange={(e) => setTwitter(e.target.value)}
                        />
                    </div>
                    <div className="items-center">
                        <div className="flex items-center gap-2 font-sans text-xs uppercase text-gray-normal">
                            <FaTelegram />
                            Telegram URL
                        </div>
                        <input
                            className="outline-none border border-gray-border font-sans text-white placeholder:text-gray-border text-sm px-2.5 bg-transparent w-full h-button mt-1 rounded-lg"
                            placeholder="Enter telegram url"
                            value={telegram}
                            onChange={(e) => setTelegram(e.target.value)}
                        />
                    </div>
                    <div className="items-center">
                        <div className="flex items-center gap-2 font-sans text-xs uppercase text-gray-normal">
                            <FaDiscord />
                            Discord URL
                        </div>
                        <input
                            className="outline-none border border-gray-border font-sans text-white placeholder:text-gray-border text-sm px-2.5 bg-transparent w-full h-button mt-1 rounded-lg"
                            placeholder="Enter discord url"
                            value={discord}
                            onChange={(e) => setDiscord(e.target.value)}
                        />
                    </div>
                    <div className="items-center">
                        <div className="font-sans text-xs uppercase text-gray-normal">
                            Description
                        </div>
                        <textarea
                            className="outline-none border border-gray-border font-sans text-white placeholder:text-gray-border text-sm px-2.5 pt-2.5 bg-transparent w-full mt-1"
                            placeholder="Enter description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>
                    <div className="relative flex mb-6 text-white bg-transparent justify-evenly bg-clip-border">
                        <button
                            className="font-sans text-xs font-medium text-center text-white uppercase px-6 h-10 rounded-[4px] justify-center items-center gap-2.5 inline-flex bg-green-normal active:scale-95 transition duration-90 ease-in-out transform focus:outline-none w-full"
                            onClick={handleCreate}>
                            Create
                        </button>
                    </div>
                </div>
            </div>
            <div className="w-full border-t border-dashed border-gray-highlight">
                <div className="flex items-center justify-between w-full h-auto mb-5">
                    <div className="m-auto mt-10 text-xl font-medium text-white">
                        Revoke Mint Authority
                    </div>
                </div>
                <div className="flex flex-col gap-3">
                    <div className="flex flex-row justify-between gap-2">
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
                    </div>
                    <div className="relative flex mb-6 text-white bg-transparent justify-evenly bg-clip-border">
                        <button
                            className="font-sans text-xs font-medium text-center text-white uppercase px-6 h-10 rounded-[4px] justify-center items-center gap-2.5 inline-flex bg-green-normal active:scale-95 transition duration-90 ease-in-out transform focus:outline-none w-full"
                            onClick={handleRevokeMintAuthority}>
                            Revoke
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}