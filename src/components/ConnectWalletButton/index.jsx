import { useState, useCallback } from "react";
import { toast } from "react-toastify";
import { Popover, Transition } from '@headlessui/react';
import { useWalletMultiButton } from "@solana/wallet-adapter-base-ui";
import { useWallet } from "@solana/wallet-adapter-react";
import { FaRegCopy, FaSignOutAlt, FaWallet } from "react-icons/fa";
import { Fragment } from "react";

import Modal from "../Base/Modal";

const imageURL = {
    "Phantom": "/assets/wallets/phantom.svg",
    "OKX Wallet": "/assets/wallets/okx.svg",
    "Trust": "/assets/wallets/trust.svg",
    "MathWallet": "/assets/wallets/mathwallet.svg",
    "TokenPocket": "/assets/wallets/tokenpocket.svg",
    "Coinbase Wallet": "/assets/wallets/coinbase.svg",
    "Coin98": "/assets/wallets/coin98.svg",
    "SafePal": "/assets/wallets/safepal.svg",
    "Bitpie": "/assets/wallets/bitpie.svg",
    "Clover": "/assets/wallets/clover.svg",
    "Coinhub": "/assets/wallets/coinhub.svg",
    "WalletConnect": "/assets/wallets/walletconnect.svg",
}

export default function ConnectWalletButton() {
    const [copied, setCopied] = useState(false);
    const [walletModalConfig, setWalletModalConfig] = useState(null);
    const { buttonState, onConnect, onDisconnect, onSelectWallet } = useWalletMultiButton({ onSelectWallet: setWalletModalConfig });
    const { publicKey, connected, wallet } = useWallet();

    const getEllipsisAddress = (address) => {
        return address.slice(0, 5) + "..." + address.slice(-5);
    };

    let label = "";
    switch (buttonState) {
        case "connected":
            if (connected)
                label = getEllipsisAddress(publicKey.toBase58());
            else
                label = "Disconnect";
            break;
        case "connecting":
            label = "Connecting";
            break;
        case "disconnecting":
            label = "Disconnecting";
            break;
        case "has-wallet":
            label = "Connect";
            break;
        case "no-wallet":
            label = "Select Wallet";
            break;
        default:
            break;
    }

    const copyToClipboard = async (text) => {
        if ('clipboard' in navigator) {
            await navigator.clipboard.writeText(text);
            toast.success("Copied");
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
        else
            console.error('Clipboard not supported');
    };

    const handleClick = useCallback(() => {
        console.log("Connect button clicked:", buttonState);
        switch (buttonState) {
            case 'connected':
                // onDisconnect();
                break;
            case 'connecting':
            case 'disconnecting':
                break;
            case 'has-wallet':
                onConnect();
                break;
            case 'no-wallet':
                onSelectWallet();
                break;
            default:
                break;
        }
    }, [buttonState, onConnect, onSelectWallet]);

    return (
        <>
            {!connected && <button className="px-6 h-10 rounded-[4px] justify-center items-center gap-2.5 inline-flex bg-green-normal active:scale-95 transition duration-90 ease-in-out transform focus:outline-none font-sans text-xs font-medium text-center text-white uppercase disabled:bg-gray-highlight disabled:text-gray-normal"
                disabled={buttonState === "connecting" || buttonState === "disconnecting"}
                onClick={handleClick}>
                {label}
            </button>}
            {
                connected && publicKey &&
                (
                    <Popover className="relative">
                        {({ open }) => (
                            <>
                                <Popover.Button
                                    className="pl-3 pr-4 h-button rounded-[4px] justify-center items-center gap-1 inline-flex bg-[#1A1A37] active:scale-95 transition duration-90 ease-in-out transform focus:outline-none text-xs font-medium text-center text-white uppercase disabled:text-gray-border disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap">
                                    {wallet && <img src={imageURL[wallet.adapter.name]} className="w-6 h-6 mr-1" alt="none" />}
                                    <p className="font-sans text-xs font-medium leading-none text-center">{label}</p>
                                </Popover.Button>
                                <Transition as={Fragment}
                                    enter="transition ease-out duration-200"
                                    enterFrom="opacity-0 translate-y-1"
                                    enterTo="opacity-100 translate-y-0"
                                    leave="transition ease-in duration-150"
                                    leaveFrom="opacity-100 translate-y-0"
                                    leaveTo="opacity-0 translate-y-1">
                                    <Popover.Panel className="absolute z-30 min-w-[153px] mt-[2px] right-0 text-gray-normal">
                                        <div className="overflow-hidden rounded-sm shadow-lg">
                                            <div className="relative grid grid-cols-1 shadow bg-gray-highlight">
                                                <button className="flex items-center h-8 p-2 transition duration-90 ease-in-out hover:bg-[rgba(0,0,0,0.1)] hover:text-white focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50" onClick={() => copyToClipboard(publicKey.toBase58())}>
                                                    <div className="flex items-center justify-center flex-shrink-0 text-neutral-500 dark:text-neutral-300">
                                                        {
                                                            copied ?
                                                                (<svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                                </svg>) :
                                                                (<FaRegCopy className="w-3.5 h-3.5" />)
                                                        }
                                                    </div>
                                                    <div className="ml-2">
                                                        <p className="text-xs font-medium">{"Copy Address"}</p>
                                                    </div>
                                                </button>
                                                <button className="flex items-center h-8 p-2 transition duration-90 ease-in-out hover:bg-[rgba(0,0,0,0.1)] hover:text-white focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50 disabled:opacity-50"
                                                    disabled={buttonState === "connecting" || buttonState === "disconnecting"}
                                                    onClick={onSelectWallet}
                                                >
                                                    <div className="flex items-center justify-center flex-shrink-0 text-neutral-500 dark:text-neutral-300">
                                                        <FaWallet className="w-3.5 h-3.5" />
                                                    </div>
                                                    <div className="ml-2">
                                                        <p className="text-xs font-medium">{"Select Wallet"}</p>
                                                    </div>
                                                </button>
                                                <button className="flex items-center h-8 p-2 transition duration-90 ease-in-out hover:bg-[rgba(0,0,0,0.1)] hover:text-white focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50 disabled:opacity-50"
                                                    disabled={buttonState === "connecting" || buttonState === "disconnecting"}
                                                    onClick={onDisconnect}
                                                >
                                                    <div className="flex items-center justify-center flex-shrink-0 text-neutral-500 dark:text-neutral-300">
                                                        <FaSignOutAlt className="w-3.5 h-3.5" />
                                                    </div>
                                                    <div className="ml-2">
                                                        <p className="text-xs font-medium">{"Disconnect"}</p>
                                                    </div>
                                                </button>
                                            </div>
                                        </div>
                                    </Popover.Panel>
                                </Transition>
                            </>
                        )}
                    </Popover>
                )
            }
            {
                walletModalConfig &&
                (
                    <Modal isOpen={walletModalConfig !== null} onClose={() => setWalletModalConfig(null)}>
                        <div className="flex flex-col pt-5 w-[440px] font-sans">
                            <div className="px-5 py-3 font-sans text-sm font-medium text-center text-white uppercase rounded-t-md bg-gray-highlight">
                                Connect wallet
                            </div>
                            <div className="grid grid-cols-3 gap-3 px-5 py-5 bg-gray-dark rounded-b-md text-gray-normal">
                                {
                                    walletModalConfig.wallets.map((item, index) => {
                                        return (
                                            <div key={index} className="col-span-1 relative cursor-pointer hover:bg-[#ffffff05] hover:text-white">
                                                <div className="flex flex-col items-center justify-center h-full gap-2 p-3 transition-all ease-in-out rounded-md hover:bg-gray-highlight"
                                                    onClick={() => {
                                                        walletModalConfig.onSelectWallet(item.adapter.name);
                                                        setWalletModalConfig(null);
                                                    }}>
                                                    <img src={imageURL[item.adapter.name]} alt="none" className="w-10 h-10 rounded-md" />
                                                    <p className="leading-none text-center">
                                                        {item.adapter.name}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })
                                }
                            </div>
                        </div>
                    </Modal>
                )
            }
        </>
    );
}
