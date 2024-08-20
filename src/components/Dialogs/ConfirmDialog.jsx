// import { useState } from "react";
import Modal from "../Base/Modal";

export default function ConfirmDialog({ isOpen, title, message, onOK, onCancel }) {
    return (
        <Modal isOpen={isOpen} onClose={onCancel}>
            <div className="flex flex-col pt-5 w-[440px] font-sans">
                <div className="flex items-center justify-start w-full h-auto px-5 py-3 rounded-t-md bg-gray-highlight">
                    <div className="font-sans text-sm font-medium text-white uppercase">
                        {title}
                    </div>
                </div>
                <div className="items-center w-full h-auto p-5 md:py-0 bg-gray-dark rounded-b-md">
                    <div className="mt-8 text-center">
                        <label className="text-gray-normal">
                            {message}
                        </label>
                    </div>
                    <div className="flex items-center justify-center gap-5 my-7">
                        <button
                            className="pl-3 pr-4 h-button grow rounded-[4px] justify-center items-center gap-1 inline-flex bg-green-normal active:scale-95 transition duration-90 ease-in-out transform focus:outline-none text-xs font-medium text-center text-white uppercase disabled:text-gray-border disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                            onClick={onOK}>
                            Yes
                        </button>
                        <button
                            className="pl-3 pr-4 h-button grow rounded-[4px] justify-center items-center gap-1 inline-flex bg-[#1A1A37] active:scale-95 transition duration-90 ease-in-out transform focus:outline-none text-xs font-medium text-center text-white uppercase disabled:text-gray-border disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                            onClick={onCancel}>
                            No
                        </button>
                    </div>
                </div>
            </div>
        </Modal>
    );
}
