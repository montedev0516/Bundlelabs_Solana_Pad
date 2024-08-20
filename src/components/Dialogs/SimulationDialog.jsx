import { useState } from "react";
import { toast } from "react-toastify";
import { FaRegCopy } from "react-icons/fa";
import BigNumber from "bignumber.js";
import Modal from "../Base/Modal";
import { ellipsisAddress } from "../../utils/methods";

export default function SimulationDialog({ isOpen, zombie, onClose }) {
    const [copied, setCopied] = useState(false);
    const zombieAmount = zombie.value ? Number(new BigNumber(zombie.value.toString() + "e-9").toString()).toFixed(3) : "0";

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

    return (
        <Modal isOpen={isOpen}>
            <div className="flex flex-col pt-5 w-[440px] font-sans">
                <div className="flex items-center justify-start w-full h-auto px-5 py-3 rounded-t-md bg-gray-highlight">
                    <div className="font-sans text-sm font-medium text-white uppercase">
                        Simulation Result
                    </div>
                </div>
                <div className="items-center w-full h-auto px-5 py-5 md:py-0 bg-gray-dark rounded-b-md">
                    <div className="flex items-center justify-center mt-3">
                        <label className="block my-1 text-base text-center text-gray-normal">
                            DEPOSIT at least the following amount of SOL into the Zombie wallets
                        </label>
                    </div>
                    <div className="pt-3 mt-3 border-t border-dashed border-gray-highlight">
                        <div className="flex items-center justify-center gap-2 text-gray-normal">
                            <div className="my-1 text-sm">
                                <span className="">
                                    {
                                        zombie.address ?
                                            ellipsisAddress(zombie.address) :
                                            "Not set"
                                    }
                                </span>
                            </div>
                            {
                                (copied["zombie_address"] ?
                                    (<svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mx-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>) :
                                    (<FaRegCopy className="w-4 h-4 mx-1 transition duration-100 ease-in-out transform cursor-pointer active:scale-95" onClick={() => copyToClipboard("zombie_address", zombie.address)} />))
                            }
                        </div>
                        <div className="flex items-center justify-center gap-2">
                            <div className="my-1 text-base text-yellow-normal">
                                <span className="">{zombieAmount} SOL</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-center my-5">
                        <button
                            className="pl-3 pr-4 h-button grow rounded-[4px] justify-center items-center gap-1 inline-flex bg-[#1A1A37] active:scale-95 transition duration-90 ease-in-out transform focus:outline-none text-xs font-medium text-center text-white uppercase disabled:text-gray-border disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                            onClick={onClose}>
                            OK
                        </button>
                    </div>
                </div>
            </div>
        </Modal>
    );
}
