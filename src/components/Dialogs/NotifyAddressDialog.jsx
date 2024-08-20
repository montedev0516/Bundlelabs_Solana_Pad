import { useState } from "react";
import { toast } from "react-toastify";
import { FaRegCopy } from "react-icons/fa";
import Modal from "../Base/Modal";
import { ellipsisAddress } from "../../utils/methods";

export default function NotifyAddressDialog({ isOpen, title, address, onClose }) {
    const [copied, setCopied] = useState(false);

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

    return (
        <Modal isOpen={isOpen}>
            <div className="flex flex-col pt-5 w-[440px] font-sans">
                <div className="flex items-center justify-start w-full h-auto px-5 py-3 rounded-t-md bg-gray-highlight">
                    <div className="font-sans text-sm font-medium text-white uppercase">
                        {title}
                    </div>
                </div>
                <div className="items-center w-full h-auto px-5 py-5 md:py-0 bg-gray-dark rounded-b-md">
                    <div className="flex items-center justify-center gap-2 mt-4">
                        <div className="font-sans text-xs uppercase text-gray-normal">
                            {address ? ellipsisAddress(address) : ""}
                        </div>
                        {
                            (copied ?
                                (<svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mx-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>) :
                                (<FaRegCopy className="w-4 h-4 mx-1 transition duration-100 ease-in-out transform cursor-pointer active:scale-95" onClick={() => copyToClipboard(address)} />))
                        }
                    </div>
                    <div className="flex items-center justify-center gap-5 my-5">
                        <button
                            className="pl-3 pr-4 h-button grow rounded-[4px] justify-center items-center gap-1 inline-flex bg-green-normal active:scale-95 transition duration-90 ease-in-out transform focus:outline-none text-xs font-medium text-center text-white uppercase disabled:text-gray-border disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                            onClick={onClose}>
                            OK
                        </button>
                    </div>
                </div>
            </div>
        </Modal>
    );
}
