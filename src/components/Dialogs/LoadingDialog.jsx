import Modal from "../Base/Modal";

export default function LoadingDialog({ isOpen, prompt }) {
    return (
        <Modal isOpen={isOpen} className="!z-[2000]">
            <div className="w-full h-auto pr-3 bg-gray-highlight flex rounded-[4px] items-center">
                <img src="/assets/spinner.svg" className="w-16 h-16 text-green-normal" alt="spinner" />
                <div className="font-sans text-sm font-medium text-center text-white">
                    {prompt}
                </div>
            </div>
        </Modal>
    );
}
