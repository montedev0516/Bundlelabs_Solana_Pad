import { toast } from "react-toastify";
import { useState } from 'react';
import { FaCoins, FaRegCopy, FaWallet } from "react-icons/fa";
import { Popover } from '@headlessui/react'
import { Transition } from "@headlessui/react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { Fragment } from 'react';
import { useContext } from 'react';
import { getTokenListByOwner } from "../../utils/solana";
import { IoIosRefresh } from "react-icons/io";
import { ellipsisAddress } from "../../utils/methods";
import { AppContext } from "../../providers/AppContext";

export default function MyAssetsButton() {
    const {
        setLoadingPrompt,
        setOpenLoading,
        setAssets,
        assets,
    } = useContext(AppContext);

    const { connection } = useConnection();
    const { connected, publicKey } = useWallet();
    const [copied, setCopied] = useState({});

    const copyToClipboard = async (key, text) => {
        if ('clipboard' in navigator) {
            await navigator.clipboard.writeText(text);
            toast.success("Copied");
            setCopied({
                ...copied,
                [key]: true,
            });
            setTimeout(() => setCopied({
                ...copied,
                [key]: false,
            }), 2000);
        }
        else
            console.error('Clipboard not supported');
    };

    const handleRefreshAssets = async () => {
        if (!connected) {
            setAssets([]);
            return;
        }

        setLoadingPrompt("Refreshing assets...");
        setOpenLoading(true);
        try {
            const newTokenList = await getTokenListByOwner(connection, publicKey, true);
            setAssets(newTokenList);
        }
        catch (err) {
            console.log(err);
        }
        setOpenLoading(false);
    }

    return (
        <>
            <Popover>
                <Popover.Button
                    className="pl-3 pr-4 h-button rounded-[4px] justify-center items-center gap-1 inline-flex bg-[#1A1A37] active:scale-95 transition duration-90 ease-in-out transform focus:outline-none text-xs font-medium text-center text-white uppercase disabled:text-gray-border disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap">
                    <FaWallet className="mr-1 text-sm text-white" />
                    My Assets
                </Popover.Button>
                <Transition as={Fragment}
                    enter="transition ease-out duration-200"
                    enterFrom="opacity-0 translate-x-full"
                    enterTo="opacity-100 translate-x-0"
                    leave="transition ease-in duration-150"
                    leaveFrom="opacity-100 translate-x-0"
                    leaveTo="opacity-0 translate-x-full">
                    <Popover.Panel className="absolute z-30 w-[30vw] h-[100vh] top-0 right-0 text-gray-normal bg-gray-highlight py-5 px-7">
                        <div className="flex items-center justify-between">
                            <div className="mb-2 text-base font-medium text-white uppercase">
                                My assets
                            </div>
                            <button
                                className="w-button h-button rounded-full flex justify-center items-center bg-[#1A1A37] active:scale-95 transition duration-90 ease-in-out transform focus:outline-none text-xs disabled:opacity-50 disabled:cursor-not-allowed" onClick={() => handleRefreshAssets()}>
                                <IoIosRefresh className="text-lg text-green-normal" />
                            </button>
                        </div>
                        <div className="mt-3 h-[calc(100vh-100px)] w-full overflow-y-auto pr-2">
                            {assets.length === 0 && (
                                <div className="my-3 text-sm font-bold text-center text-gray-700 uppercase">
                                    No Assets
                                </div>
                            )}
                            {
                                assets.sort((a, b) => b.balance - a.balance).map((item, index) => (
                                    <div key={index} className={`flex items-center justify-between w-full py-2 cursor-pointer ${item.balance * 1 === 0 && "opacity-20"} hover:opacity-100 transition-all`}>
                                        <div className="flex items-center gap-3">
                                            <div className="w-button h-button bg-[#1A1A37] flex items-center justify-center rounded-full">
                                                {
                                                    item.logoURI !== "" ?
                                                        <img src={item.logoURI} alt="logo" className="w-full h-full rounded-full" /> :
                                                        <FaCoins className="text-base text-gray-border" />
                                                }
                                            </div>
                                            <div className="max-w-[18vw]">
                                                <div className="flex items-center gap-1 text-xs text-white font-poppins">
                                                    <span className="text-yellow-normal">{item.symbol || ellipsisAddress(item.mint)}</span>
                                                    <span className="block pr-5 truncate text-xxs">{item.name}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <p className="w-auto bg-transparent border-none outline-none text-xxs text-gray-normal">
                                                        {ellipsisAddress(item.mint)}
                                                    </p>
                                                    {
                                                        copied["mint_" + index] ?
                                                            (<svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                            </svg>) :
                                                            (<FaRegCopy className="w-4 h-4 transition duration-100 ease-in-out transform cursor-pointer active:scale-95" onClick={() => copyToClipboard("mint_" + index, item.mint)} />)
                                                    }
                                                </div>
                                                {item.marketId && <div className="font-medium bg-green-normal text-[8px] flex items-center w-fit text-black px-1 rounded-full mt-0.5">
                                                    OpenBook
                                                </div>}
                                            </div>
                                        </div>
                                        <div className="text-xs text-white ">
                                            {item.balance}
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    </Popover.Panel>
                </Transition>
            </Popover >
        </>
    );
}
