import { useState } from "react";
import { FaEllipsisV, FaQuestion, FaRegCopy } from "react-icons/fa"
import { ellipsisAddress } from "../../utils/methods";
import { Keypair } from "@solana/web3.js";
import base58 from "bs58";
import { toast } from "react-toastify";
import ZombieDialog from "../Dialogs/ZombieDialog";
import { Popover } from "@headlessui/react";

const PrivateKeyInput = ({title, description}) => {
    const [zombieWallet, setZombieWallet] = useState({ address: "", privateKey: "" });
    const [zombieDialog, setZombieDialog] = useState(false);

    const handleOKZombiePrivateKey = (key) => {
        try {
            const keypair = Keypair.fromSecretKey(base58.decode(key));
            setZombieWallet({ address: keypair.publicKey.toBase58(), privateKey: key });
        }
        catch (err) {
            console.log(err);
            toast.warn("Invalid private key!");
        }

        setZombieDialog(false);
    };
    
    return (
        <div className="col-span-12 md:col-span-6 2xl:col-span-3">
            <ZombieDialog isOpen={zombieDialog} onOK={handleOKZombiePrivateKey} onCancel={() => setZombieDialog(false)} />
            <Popover className="relative flex items-center font-sans text-xs uppercase text-gray-normal">
                <div className="whitespace-nowrap">{title}<span className="pl-1 text-green-normal">*</span></div>
                <Popover.Button className="border border-green-normal text-[6px] flex items-center justify-center cursor-pointer rounded-full w-3 h-3 ml-1">
                    <FaQuestion className="text-green-normal" />
                </Popover.Button>
                <Popover.Panel className="absolute z-10 px-2 py-1 text-xs text-center text-white normal-case border rounded-sm bg-gray-highlight bottom-5 border-green-normal">
                    {description}
                </Popover.Panel>
            </Popover>
            <div className={`flex items-center justify-between outline-none border border-gray-border text-gray-normal font-sans text-sm pl-2.5 bg-transparent w-full h-button mt-1 pr-1 `}>
                <div className={`w-full pr-1 truncate ${zombieWallet.address && "text-white"}`}>
                    {
                        zombieWallet.address ?
                            ellipsisAddress(zombieWallet.address) :
                            "NOT SET"
                    }
                </div>
                <div className="flex items-center text-base">
                    <FaEllipsisV className="w-4 ml-1 cursor-pointer text-gray-normal hover:text-green-normal" onClick={() => setZombieDialog(true)} />
                </div>
            </div>
        </div>
    )
}

export default PrivateKeyInput