import { useContext, useEffect, useState } from "react";
import { generateAvatarURL } from "@cfx-kit/wallet-avatar";
import { useWallet } from "@solana/wallet-adapter-react";

import ConnectWalletButton from "./ConnectWalletButton";
import MyAssetsButton from "./MyAssetsButton";
import AvatarDropDown from "../components/AvatarDropdown";
import { AppContext } from "../providers/AppContext";

export default function NavBar({ className, breadCrumb }) {
    const { user, logout } = useContext(AppContext);
    const { publicKey } = useWallet();
    const [randomAvatar, setRandomAvatar] = useState(generateAvatarURL(new Date().getTime().toString()));

    const onViewProfile = () => {
        console.log("View Profile");
    };

    useEffect(() => {
        setRandomAvatar(generateAvatarURL(publicKey?.toBase58() || new Date().getTime().toString()));
    }, [publicKey]);

    return (
        <div className="w-full px-4 mb-2">
        <div className={`${className ? className : ""} font-sans flex-col lg:flex-row flex lg:justify-between lg:items-center lg:px-7 px-4 z-[50] bg-[#1A1A37] border rounded-lg border-t-green-normal border-r-green-normal border-l-green-normal border-b-0`}>
            <div className="text-sm font-medium uppercase text-gray-normal whitespace-nowrap">{breadCrumb}</div>
            <div className="flex items-center justify-between w-full gap-2 lg:justify-end lg:gap-5">
                <MyAssetsButton />
                <ConnectWalletButton />
                <AvatarDropDown imageUrl={randomAvatar} name={user.name ? user.name : ""} address={publicKey?.toBase58()} onLogout={logout} onViewProfile={onViewProfile} />
            </div>
        </div>
        </div>
    );
}
