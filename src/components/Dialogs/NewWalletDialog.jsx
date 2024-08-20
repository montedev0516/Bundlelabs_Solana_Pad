import { useState } from "react";
import Modal from "../Base/Modal";

export default function NewWalletDialog({ isOpen, onOK, onCancel, mode = '' }) {
    const [count, setCount] = useState("");
    const [fresh, setFresh] = useState(false);

    const handleOK = () => {
        if (count !== "") {
            setCount("");
            onOK(count, fresh);
        }
    };

    const handleCancel = () => {
        setCount("");
        onCancel();
    };

    const handleChangeCount = (e) => {
        const value = Number(e.target.value)
        if (mode === 'bot' && value > 8) {
            setCount(8)
        } else if (value < 0) {
            setCount(0)
        } else {
            setCount(value)
        }
    }

    return (
        <Modal isOpen={isOpen} onClose={handleCancel}>
            <div className="flex flex-col pt-5 w-[440px] font-sans">
                <div className="flex items-center justify-start w-full h-auto px-5 py-3 rounded-t-md bg-gray-highlight">
                    <div className="font-sans text-sm font-medium text-white uppercase">
                        Generate Wallets
                    </div>
                </div>
                <div className="items-center w-full h-auto px-5 py-5 md:py-0 bg-gray-dark rounded-b-md">
                    <div className="mt-4">
                        <div className="font-sans text-xs uppercase text-gray-normal">
                            Wallet Count<span className="pl-1 text-green-normal">{mode === 'bot' && '(1 ~ 8)'}*</span>
                        </div>
                        <input
                            className="outline-none border border-gray-border font-sans text-white placeholder:text-gray-border text-sm px-2.5 bg-transparent w-full h-button mt-1"
                            placeholder="Enter Wallet Count"
                            value={count}
                            onChange={handleChangeCount}
                        />
                    </div>
                    <label className="flex items-center cursor-pointer">
                        <input type="checkbox" value="" checked={fresh} className="sr-only peer" onChange={(e) => setFresh(e.target.checked)} />
                        <div className="relative w-[30px] mt-3 h-4 bg-gray-border peer-focus:outline-none rounded-full peer focus:outline-none peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full after:content-[''] after:absolute after:top-[1px] after:start-[1px] after:bg-[#ffffffb0] after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-green-normal"></div>
                        <span className="ml-3 mt-3 text-sm text-gray-normal">Fresh Wallet</span>
                    </label>

                    <div className="flex items-center justify-center gap-5 my-5">
                        <button
                            className="pl-3 pr-4 h-button grow rounded-[4px] justify-center items-center gap-1 inline-flex bg-green-normal active:scale-95 transition duration-90 ease-in-out transform focus:outline-none text-xs font-medium text-center text-white uppercase disabled:text-gray-border disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                            onClick={handleOK}>
                            OK
                        </button>
                        <button
                            className="pl-3 pr-4 h-button grow rounded-[4px] justify-center items-center gap-1 inline-flex bg-[#1A1A37] active:scale-95 transition duration-90 ease-in-out transform focus:outline-none text-xs font-medium text-center text-white uppercase disabled:text-gray-border disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                            onClick={handleCancel}>
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </Modal>
    );
}
