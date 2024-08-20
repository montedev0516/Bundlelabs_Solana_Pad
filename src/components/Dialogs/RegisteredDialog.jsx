import Modal from "../Base/Modal";

export default function RegisteredDialog({ isOpen, onOK }) {
    return (
        <Modal isOpen={isOpen}>
            <div className="flex flex-col pt-5 font-sans">
                <div className="flex items-center justify-start w-full h-auto px-5 py-3 rounded-t-md bg-green-normal">
                    <div className="font-sans text-sm font-medium text-white uppercase">
                        Register
                    </div>
                </div>
                <div className="items-center w-full h-auto px-5 py-5 md:py-0 bg-gray-dark rounded-b-md">
                    <div className="text-gray-normal text-center text-base font-medium font-sans leading-[24.93px] mt-5">
                        Account has been registered successfully
                    </div>
                    <div className="flex items-center justify-center gap-5 my-5">
                        <button
                            className="pl-3 pr-4 h-[34px] grow rounded-[4px] justify-center items-center gap-1 bg-green-normal active:scale-95 transition duration-90 ease-in-out transform focus:outline-none text-xs font-medium text-center text-white uppercase disabled:text-gray-border disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                            onClick={onOK}>
                            OK
                        </button>
                    </div>
                </div>
            </div>
        </Modal>
    );
}
