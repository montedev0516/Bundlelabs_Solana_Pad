import { useContext, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { MdDashboard, MdOutlineHistory, MdOutlineSell, MdOutlineCloudUpload } from "react-icons/md";
import { RiProjectorFill, RiExchangeDollarLine } from "react-icons/ri";
import { FaTools, FaRegCopyright } from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";
import { BiSolidPurchaseTag, BiTransferAlt } from "react-icons/bi";
import { GrDeploy } from "react-icons/gr";
import { PiSwimmingPool } from "react-icons/pi";
import { MdOutlineToken } from "react-icons/md";

import { AdminIcon, BotIcon, GitBookIcon, HolderBotIcon, PumpIcon, RaydiumIcon, SuperVolumeBotIcon, TrendingBotIcon, VolumeBotIcon } from "./Icons";
import { AppContext } from "../providers/AppContext";

export default function SideBarComponent({ className }) {
    const { user, currentProject } = useContext(AppContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [openRaydiumMenu, setOpenRaydiumMenu] = useState(false);
    const [openProjectMenu, setOpenProjectMenu] = useState(false);
    const [openToolsMenu, setOpenToolsMenu] = useState(false);
    const [openPumpfunMenu, setOpenPumpfunMenu] = useState(false);
    const [openBotsMenu, setOpenBotsMenu] = useState(false);

    const [bot, setBot] = useState(false)
    const [raydium, setRaydium] = useState(false)
    const [pump, setPump] = useState(false)

    useEffect(() => {
        if (location.pathname === '/volume-bot' || location.pathname === '/market-maker') {
            setBot(true)
            setRaydium(false)
            setPump(false)
        } else if (location.pathname === "/buy" || location.pathname === "/sell" || location.pathname === "/transfer" || location.pathname === "/create-token" || location.pathname === "/set-authority" || location.pathname === "/openbook" || location.pathname === "/manage-lp" || location.pathname === "/token-account") {
            setBot(false)
            setRaydium(true)
            setPump(false)
        } else if (location.pathname === "/pumpfun-create-token" || location.pathname === "/pumpfun-buy" || location.pathname === "/pumpfun-sell" || location.pathname === "/pumpfun-transfer") {
            setBot(false)
            setRaydium(false)
            setPump(true)
        } else {
            setBot(false)
            setRaydium(false)
            setPump(false)
        }
    }, [location.pathname])

    useEffect(() => {
        if (location.pathname === '/volume-bot' || location.pathname === '/market-maker') {
            setOpenRaydiumMenu(false);
            setOpenToolsMenu(false);
            setOpenProjectMenu(false);
            setOpenPumpfunMenu(false);
        } else if (location.pathname === "/create-token" || location.pathname === "/set-authority" || location.pathname === "/openbook" || location.pathname === "/manage-lp" || location.pathname === "/token-account") {
            setOpenToolsMenu(true);
            setOpenProjectMenu(false);
            setOpenPumpfunMenu(false);
        }
        else if (location.pathname === "/buy" || location.pathname === "/sell" || location.pathname === "/transfer") {
            setOpenRaydiumMenu(true);
            setOpenProjectMenu(true);
            setOpenToolsMenu(false);
            setOpenPumpfunMenu(false);
        }
        else if (location.pathname === "/pumpfun-create-token" || location.pathname === "/pumpfun-buy" || location.pathname === "/pumpfun-sell" || location.pathname === "/pumpfun-transfer") {
            setOpenPumpfunMenu(true);
            setOpenToolsMenu(false);
            setOpenProjectMenu(false);
        }
    }, [location.pathname]);

    const handleCollapse = (e, menuName) => {
        e.stopPropagation();
        if (menuName === "raydium") {
            const newOpenRaydiumMenu = !openRaydiumMenu;
            setOpenRaydiumMenu(newOpenRaydiumMenu);
            if (newOpenRaydiumMenu) {
                setOpenProjectMenu(false);
                setOpenToolsMenu(false);
                setOpenPumpfunMenu(false);
                setOpenBotsMenu(false);
            }
        }
        else if (menuName === "tools") {
            const newOpenToolsMenu = !openToolsMenu;
            setOpenToolsMenu(newOpenToolsMenu);
            if (newOpenToolsMenu) {
                setOpenProjectMenu(false);
                setOpenPumpfunMenu(false);
                setOpenBotsMenu(false);
            }
        }
        else if (menuName === "project") {
            const newOpenProjectMenu = !openProjectMenu;
            setOpenProjectMenu(newOpenProjectMenu);
            if (newOpenProjectMenu) {
                setOpenToolsMenu(false);
                setOpenPumpfunMenu(false);
                setOpenBotsMenu(false);
            }
        }
        else if (menuName === "pump.fun") {
            const newOpenPumpfunMenu = !openPumpfunMenu;
            setOpenPumpfunMenu(newOpenPumpfunMenu);
            if (newOpenPumpfunMenu) {
                setOpenRaydiumMenu(false);
                setOpenBotsMenu(false);
            }
        }
        else if (menuName === "bots") {
            const newOpenBotsMenu = !openBotsMenu;
            setOpenBotsMenu(newOpenBotsMenu);
            if (newOpenBotsMenu) {
                setOpenRaydiumMenu(false);
                setOpenProjectMenu(false);
                setOpenToolsMenu(false);
                setOpenPumpfunMenu(false);
            }
        }
    };

    const handleBuy = () => {
        if (currentProject._id && currentProject.platform === 'raydium')
            navigate("/buy");
    };

    const handleSell = () => {
        if (currentProject._id && currentProject.platform === 'raydium')
            navigate("/sell");
    };

    const handleTransfer = () => {
        if (currentProject._id && currentProject.platform === 'raydium')
            navigate("/transfer");
    };

    const handlePumpfunUploadTokenMetadata = () => {
        if (currentProject._id && currentProject.platform === 'pump.fun')
            navigate("/pumpfun-create-token");
    };

    const handlePumpfunBuy = () => {
        if (currentProject._id && currentProject.platform === 'pump.fun')
            navigate("/pumpfun-buy");
    };

    const handlePumpfunSell = () => {
        if (currentProject._id && currentProject.platform === 'pump.fun')
            navigate("/pumpfun-sell");
    };

    const handlePumpfunTransfer = () => {
        if (currentProject._id && currentProject.platform === 'pump.fun')
            navigate("/pumpfun-transfer");
    };

    return (
        <div className={`font-sans text-gray-normal relative m-2 bg-gradient-to-b from-green-normal to-black-light rounded-xl h-[calc(100vh-1rem)] pt-[1px] pr-[1px] pl-[1px]`}>
            <div className={`${className} flex-col gap-2 items-center bg-[#1A1A37] rounded-xl`}>
                <img src={`/logo.png`} className="hidden 2xl:block w-full max-w-[80px] py-5 m-auto cursor-pointer" alt="" onClick={() => navigate("/")} />
                <div className={`w-[50px] 2xl:w-full h-9 uppercase hover:bg-[rgba(255,255,255,0.1)] flex justify-center text-sm 2xl:justify-start mx-auto 2xl:px-5 gap-4 items-center mt-5 cursor-pointer ${location.pathname === "/dashboard" ? "bg-gray-highlight text-white font-medium" : ""} `} onClick={() => navigate("/dashboard")}>
                    <MdDashboard className="w-[20px] h-[20px] relative" />
                    <div className="hidden text-sm 2xl:block">
                        Dashboard
                    </div>
                </div>
                <div className={`w-[50px] 2xl:w-full h-9 uppercase hover:bg-[rgba(255,255,255,0.1)] flex justify-center text-sm 2xl:justify-start mx-auto 2xl:px-5 gap-4 items-center mt-[1px] cursor-pointer ${raydium ? "bg-[rgba(255,255,255,0.1)]" : "hidden"}`} onClick={(e) => handleCollapse(e, "raydium")}>
                    <RaydiumIcon />
                    <div className="items-center justify-between hidden w-[calc(100%-34px)] 2xl:flex">
                        <div className="w-full text-left">
                            Raydium
                        </div>
                        <IoIosArrowDown className={`w-4 h-full ${openRaydiumMenu ? "transform rotate-180" : ""}`} />
                    </div>
                </div>
                {
                    openRaydiumMenu && raydium &&
                    <div className="">
                        <div className={`w-[50px] 2xl:w-full h-9 hover:bg-[rgba(255,255,255,0.1)] flex justify-center 2xl:justify-start mx-auto 2xl:px-5 2xl:pl-7 gap-4 items-center mt-[1px] cursor-pointer ${(location.pathname === "/buy" || location.pathname === "/sell" || location.pathname === "/transfer") ? "bg-[rgba(255,255,255,0.1)]" : ""}`} onClick={(e) => handleCollapse(e, "project")}>
                            <RiProjectorFill className="w-[18px] h-[18px] relative" />
                            <div className="items-center justify-between hidden w-[calc(100%-34px)] 2xl:flex">
                                <div className="w-full text-left">
                                    Project
                                </div>
                                <IoIosArrowDown className={`w-4 h-full ${openProjectMenu ? "transform rotate-180" : ""}`} />
                            </div>
                        </div>
                        {
                            openProjectMenu &&
                            <div>
                                <div className={`w-[50px] 2xl:w-full h-9 hover:bg-[rgba(255,255,255,0.1)] flex justify-center 2xl:justify-start mx-auto 2xl:pl-9 gap-4 items-center mt-[1px] ${(currentProject._id && currentProject.platform === 'raydium') ? "cursor-pointer" : "cursor-not-allowed"} ${location.pathname === "/buy" ? "bg-gray-highlight text-white font-medium" : ""}`} onClick={handleBuy}>
                                    <BiSolidPurchaseTag className="w-[18px] h-[18px]" />
                                    <div className="hidden text-sm 2xl:flex">
                                        Buy
                                    </div>
                                </div>
                                <div className={`w-[50px] 2xl:w-full h-9 hover:bg-[rgba(255,255,255,0.1)] flex justify-center 2xl:justify-start mx-auto 2xl:pl-9 gap-4 items-center mt-[1px]  ${(currentProject._id && currentProject.platform === 'raydium') ? "cursor-pointer" : "cursor-not-allowed"} ${location.pathname === "/sell" ? "bg-gray-highlight text-white font-medium" : ""}`} onClick={handleSell}>
                                    <MdOutlineSell className="w-[18px] h-[18px]" />
                                    <div className="hidden text-sm 2xl:flex">
                                        Sell
                                    </div>
                                </div>
                                <div className={`w-[50px] 2xl:w-full h-9 hover:bg-[rgba(255,255,255,0.1)] flex justify-center 2xl:justify-start mx-auto 2xl:pl-9 gap-4 items-center mt-[1px] ${(currentProject._id && currentProject.platform === 'raydium') ? "cursor-pointer" : "cursor-not-allowed"} ${location.pathname === "/transfer" ? "bg-gray-highlight text-white font-medium" : ""} `} onClick={handleTransfer}>
                                    <BiTransferAlt className="w-[18px] h-[18px]" />
                                    <div className="hidden text-sm 2xl:flex">
                                        Transfer
                                    </div>
                                </div>
                            </div>
                        }
                        <div className={`w-[50px] 2xl:w-full h-9 hover:bg-[rgba(255,255,255,0.1)] flex justify-center 2xl:justify-start mx-auto 2xl:px-5 2xl:pl-7 gap-4 items-center mt-[1px] cursor-pointer ${(location.pathname === "/create-token" || location.pathname === "/set-authority" || location.pathname === "/openbook" || location.pathname === "/manage-lp" || location.pathname === "/token-account") ? "bg-[rgba(255,255,255,0.1)]" : ""}`} onClick={(e) => handleCollapse(e, "tools")}>
                            <FaTools className="w-[16px] h-[16px] relative" />
                            <div className="items-center justify-between hidden w-[calc(100%-34px)] 2xl:flex">
                                <div className="w-full text-left">
                                    Tools
                                </div>
                                <IoIosArrowDown className={`w-4 h-full ${openToolsMenu ? "transform rotate-180" : ""}`} />
                            </div>
                        </div>
                        {
                            openToolsMenu &&
                            <div className="">
                                <div className={`w-[50px] 2xl:w-full h-9 hover:bg-[rgba(255,255,255,0.1)] flex justify-center 2xl:justify-start mx-auto 2xl:pl-9 gap-4 items-center mt-[1px] cursor-pointer tracking-tighter ${location.pathname === "/create-token" ? "bg-gray-highlight text-white font-medium" : ""}`} onClick={() => navigate("/create-token")}>
                                    <GrDeploy />
                                    <div className="hidden text-sm 2xl:flex">
                                        Create SPL Token
                                    </div>
                                </div>
                            </div>
                        }
                        {
                            openToolsMenu &&
                            <div className="">
                                <div className={`w-[50px] 2xl:w-full h-9 hover:bg-[rgba(255,255,255,0.1)] flex justify-center 2xl:justify-start mx-auto 2xl:pl-9 gap-4 items-center mt-[1px] cursor-pointer ${location.pathname === "/set-authority" ? "bg-gray-highlight text-white font-medium" : ""}`} onClick={() => navigate("/set-authority")}>
                                    <FaRegCopyright className="w-[18px] h-[18px]" />
                                    <div className="hidden text-sm 2xl:flex">
                                        Set Authority
                                    </div>
                                </div>
                            </div>
                        }
                        {
                            openToolsMenu &&
                            <div className="">
                                <div className={`w-[50px] 2xl:w-full h-9 hover:bg-[rgba(255,255,255,0.1)] flex justify-center 2xl:justify-start mx-auto 2xl:pl-9 gap-4 items-center mt-[1px] cursor-pointer tracking-tighter ${location.pathname === "/openbook" ? "bg-gray-highlight text-white font-medium" : ""}`} onClick={() => navigate("/openbook")}>
                                    <RiExchangeDollarLine className="w-[18px] h-[18px]" />
                                    <div className="hidden text-sm 2xl:flex">
                                        OpenBook Market
                                    </div>
                                </div>
                            </div>
                        }
                        {
                            openToolsMenu &&
                            <div className="">
                                <div className={`w-[50px] 2xl:w-full h-9 hover:bg-[rgba(255,255,255,0.1)] flex justify-center 2xl:justify-start mx-auto 2xl:pl-9 gap-4 items-center mt-[1px] cursor-pointer ${location.pathname === "/manage-lp" ? "bg-gray-highlight text-white font-medium" : ""}`} onClick={() => navigate("/manage-lp")}>
                                    <PiSwimmingPool className="w-[18px] h-[18px]" />
                                    <div className="hidden text-sm 2xl:flex">
                                        Manage LP
                                    </div>
                                </div>
                            </div>
                        }
                        {
                            openToolsMenu &&
                            <div className="">
                                <div className={`w-[50px] 2xl:w-full h-9 hover:bg-[rgba(255,255,255,0.1)] flex justify-center 2xl:justify-start mx-auto 2xl:pl-9 gap-4 items-center mt-[1px] cursor-pointer ${location.pathname === "/token-account" ? "bg-gray-highlight text-white font-medium" : ""}`} onClick={() => navigate("/token-account")}>
                                    <MdOutlineToken className="w-[18px] h-[18px]" />
                                    <div className="hidden text-sm 2xl:flex">
                                        Token Account
                                    </div>
                                </div>
                            </div>
                        }
                    </div>
                }
                {
                    user.role === "admin" &&
                    <div className={`w-[50px] 2xl:w-full h-9 uppercase hover:bg-[rgba(255,255,255,0.1)] flex justify-center text-sm 2xl:justify-start mx-auto 2xl:px-5 gap-4 items-center mt-[1px] cursor-pointer ${location.pathname === "/log" ? "bg-gray-highlight text-white font-medium" : ""} `} onClick={() => navigate("/log")}>
                        <AdminIcon />
                        <div className="hidden text-sm 2xl:block">
                            Log
                        </div>
                    </div>
                }
                <div className={`w-[50px] 2xl:w-full h-9 uppercase hover:bg-[rgba(255,255,255,0.1)] flex justify-center text-sm 2xl:justify-start mx-auto 2xl:px-5 gap-4 items-center mt-[1px] cursor-pointer ${pump ? "bg-[rgba(255,255,255,0.1)]" : "hidden"}`} onClick={(e) => handleCollapse(e, "pump.fun")}>
                    <PumpIcon />
                    <div className="items-center justify-between hidden w-[calc(100%-34px)] 2xl:flex">
                        <div className="w-full text-left">
                            Pump.fun
                        </div>
                        <IoIosArrowDown className={`w-4 h-full ${openPumpfunMenu ? "transform rotate-180" : ""}`} />
                    </div>
                </div>
                {
                    openPumpfunMenu && pump &&
                    <div className="">
                        <div className={`w-[50px] 2xl:w-full h-9 hover:bg-[rgba(255,255,255,0.1)] flex justify-center 2xl:justify-start mx-auto 2xl:pl-7 gap-4 items-center mt-[1px] tracking-tighter ${(currentProject._id && currentProject.platform === 'pump.fun') ? "cursor-pointer" : "cursor-not-allowed"} ${location.pathname === "/pumpfun-create-token" ? "bg-gray-highlight text-white font-medium" : ""}`} onClick={handlePumpfunUploadTokenMetadata}>
                            <GrDeploy />
                            <div className="hidden text-sm 2xl:flex">
                                Create SPL Token
                            </div>
                        </div>
                        <div className={`w-[50px] 2xl:w-full h-9 hover:bg-[rgba(255,255,255,0.1)] flex justify-center 2xl:justify-start mx-auto 2xl:pl-7 gap-4 items-center mt-[1px] ${(currentProject._id && currentProject.platform === 'pump.fun') ? "cursor-pointer" : "cursor-not-allowed"} ${location.pathname === "/pumpfun-buy" ? "bg-gray-highlight text-white font-medium" : ""}`} onClick={handlePumpfunBuy}>
                            <BiSolidPurchaseTag className="w-[18px] h-[18px]" />
                            <div className="hidden text-sm 2xl:flex">
                                Buy
                            </div>
                        </div>
                        <div className={`w-[50px] 2xl:w-full h-9 hover:bg-[rgba(255,255,255,0.1)] flex justify-center 2xl:justify-start mx-auto 2xl:pl-7 gap-4 items-center mt-[1px]  ${(currentProject._id && currentProject.platform === 'pump.fun') ? "cursor-pointer" : "cursor-not-allowed"} ${location.pathname === "/pumpfun-sell" ? "bg-gray-highlight text-white font-medium" : ""}  `} onClick={handlePumpfunSell}>
                            <MdOutlineSell className="w-[18px] h-[18px]" />
                            <div className="hidden text-sm 2xl:flex">
                                Sell
                            </div>
                        </div>
                        <div className={`w-[50px] 2xl:w-full h-9 hover:bg-[rgba(255,255,255,0.1)] flex justify-center 2xl:justify-start mx-auto 2xl:pl-7 gap-4 items-center mt-[1px] ${(currentProject._id && currentProject.platform === 'pump.fun') ? "cursor-pointer" : "cursor-not-allowed"} ${location.pathname === "/pumpfun-transfer" ? "bg-gray-highlight text-white font-medium" : ""} `} onClick={handlePumpfunTransfer}>
                            <BiTransferAlt className="w-[18px] h-[18px]" />
                            <div className="hidden text-sm 2xl:flex">
                                Transfer
                            </div>
                        </div>
                    </div>
                }

                <div className={`w-[50px] 2xl:w-full h-9 uppercase hover:bg-[rgba(255,255,255,0.1)] flex justify-center text-sm 2xl:justify-start mx-auto 2xl:px-5 gap-4 items-center mt-[1px] cursor-pointer ${bot ? "bg-[rgba(255,255,255,0.1)]" : "hidden"}`} onClick={(e) => handleCollapse(e, "bots")}>
                    <BotIcon />
                    <div className="items-center justify-between hidden w-[calc(100%-34px)] 2xl:flex">
                        <div className="w-full text-left">
                            Bots
                        </div>
                        <IoIosArrowDown className={`w-4 h-full ${openBotsMenu ? "transform rotate-180" : ""}`} />
                    </div>
                </div>
                {
                    openBotsMenu && bot &&
                    <div className="">
                        <div className={`w-[50px] 2xl:w-full h-9 hover:bg-[rgba(255,255,255,0.1)] flex justify-center 2xl:justify-start mx-auto 2xl:pl-7 gap-4 items-center mt-[1px] cursor-pointer`} onClick={() => navigate('/volume-bot')} >
                            <VolumeBotIcon />
                            <div className="hidden text-sm 2xl:flex">
                                Volume Bot
                            </div>
                        </div>
                        <div className={`w-[50px] 2xl:w-full h-9 hover:bg-[rgba(255,255,255,0.1)] flex justify-center 2xl:justify-start mx-auto 2xl:pl-7 gap-4 items-center mt-[1px] cursor-pointer`} onClick={() => navigate('/market-maker')} >
                            <HolderBotIcon />
                            <div className="hidden text-sm 2xl:flex">
                                Market Maker
                            </div>
                        </div>
                    </div>
                }
                <a href="https://dragons-organization-4.gitbook.io/icarus-platform-guide" target="__blank" className={`w-[50px] 2xl:w-full h-9 uppercase hover:bg-[rgba(255,255,255,0.1)] flex justify-center text-sm 2xl:justify-start mx-auto 2xl:px-5 gap-4 items-center mt-[1px] cursor-pointer`} onClick={(e) => handleCollapse(e, "bots")}>
                    <GitBookIcon />
                    <div className="items-center justify-between hidden w-[calc(100%-34px)] 2xl:flex">
                        <div className="w-full text-left">
                            GitBook
                        </div>
                    </div>
                </a>
            </div>
        </div>
    );
}
