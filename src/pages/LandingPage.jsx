import { useNavigate } from "react-router-dom";
import { FaDiscord } from "react-icons/fa";
import { MdLanguage } from "react-icons/md";
import { IoArrowForward } from "react-icons/io5";

const IMAGE_PATH = process.env.PUBLIC_URL + "/assets/parallax-inner.svg";

export default function LandingPage() {
    const navigate = useNavigate();

    return (
        <div className="text-center bg-slate-900 font-sans min-h-[100vh]">
            <div className="flex flex-col items-center justify-around w-full gap-3 py-10 sm:gap-0 sm:flex-row">
                <img src="/logo.png" alt="logo" className="w-[35px] h-[35px]"/>
                <div className="hidden gap-4 text-white sm:flex">
                    <div className="">
                        Home
                    </div>
                    <div className="">
                        Tools
                    </div>
                    <div className="">
                        Project
                    </div>
                    <div className="">
                        Discover
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <FaDiscord className="w-6 h-6 text-white" />
                    <MdLanguage className="w-6 h-6 text-white" />
                    <div className="flex gap-2">
                        <div className="text-white">
                            EN
                        </div>
                    </div>
                    <button className="w-[78px] h-[35px] px-5 py-2.5 rounded-[26px] border border-teal-600 backdrop-blur-[15px] justify-center items-center gap-2.5 inline-flex hover:bg-gradient-to-br active:scale-95 transition duration-100 ease-in-out transform focus:outline-none relative"
                        onClick={() => navigate("/login")}>
                        <div className="absolute w-[78px] h-[35px] px-5 py-2.5 rounded-[26px] bg-gradient-to-r from-teal-600 to-blue-800 justify-center items-center gap-2.5 inline-flex opacity-20"></div>
                        <div className="font-sans text-sm font-semibold leading-none text-center text-white">
                            Login
                        </div>
                    </button>
                    <button className="w-[94px] h-[35px] px-5 py-2.5 bg-gradient-to-r from-teal-600 to-blue-800 rounded-[36px] justify-center items-center gap-2.5 inline-flex hover:bg-gradient-to-br active:scale-95 transition duration-100 ease-in-out transform focus:outline-none"
                        onClick={() => navigate("/register")}>
                        <div className="font-sans text-sm font-semibold leading-none text-center text-white">
                            Register
                        </div>
                    </button>
                </div>
            </div>
            <div className="relative">
                <div className="absolute -z-1">
                    <img alt="graphs" src="/assets/graphs.svg" className="w-[100vw]" />
                </div>
                <div className="w-full pt-20">
                    <div className="w-[311px] h-[29px] px-3 py-1 bg-white bg-opacity-10 rounded-[100px] justify-start items-center gap-1 inline-flex">
                        <div className="font-sans text-base font-normal leading-tight text-center text-white whitespace-nowrap">
                            Top Notch Tools For Sniping Tokens®
                        </div>
                    </div>
                    <div className="hidden sm:block py-5 text-center text-white  text-6xl font-semibold font-sans leading-[66px] tracking-wide">
                        Create a Good Trading
                        <br />
                        Experience Through a
                        <br />
                        High-Performance Sniping Bot
                    </div>
                    <div className="block sm:hidden py-5 text-center text-white  text-3xl font-semibold font-sans leading-[36px] tracking-wide">
                        Create a Good Trading Experience Through a High-Performance Sniping Bot
                    </div>
                    <div className="py-5 text-center text-white text-[16px] sm:text-2xl font-normal font-sans leading-[20px] sm:leading-[31.20px]">
                        Using our sniper bot, you can generate more revenue from this innovative and active blockchain market.
                    </div>
                    <div className="flex justify-center w-full">
                        <div className=" text-center text-white text-[16px] sm:text-2xl font-normal font-sans leading-[20px] sm:leading-[31.20px] w-full sm:w-8/12">
                            Sniping of targeted tokens by powerful and high-performance bots, quick and accurate selling and transfer of tokens, perfect project management, and user-friendly interface will lead you to an even more fascinating and future-oriented world.
                        </div>
                    </div>
                    <div className="py-5 text-center text-white text-[16px] sm:text-2xl font-normal font-sans leading-[20px] sm:leading-[31.20px]">
                        Good luck making more money using our platform!
                    </div>
                    <div className="flex justify-center w-full gap-2">
                        <button className="w-[165px] sm:w-[236px] h-10 sm:h-16 px-5 sm:px-10 py-2.5 bg-gradient-to-r from-teal-600 border border-teal-600 rounded-[40px] justify-center items-center gap-2.5 inline-flex hover:bg-gradient-to-br active:scale-95 transition duration-100 ease-in-out transform focus:outline-none">
                            <div className="font-sans text-sm font-semibold leading-normal text-center text-white sm:text-base">
                                Getting Started
                            </div>
                        </button>
                        <button className="w-[132px] sm:w-[235px] h-10 sm:h-16 px-5 sm:px-[61px] py-2.5 rounded-[40px] border border-blue-800 justify-center items-center gap-2.5 inline-flex relative hover:bg-gradient-to-br active:scale-95 transition duration-100 ease-in-out transform focus:outline-none">
                            <div className="font-sans text-sm font-semibold leading-normal text-center text-white sm:text-base">
                                Contact Us
                            </div>
                        </button>
                    </div>
                    <div className="flex justify-center w-full py-5">
                        <img src="/assets/robot.png" className="" alt="robot" />
                    </div>
                </div>
                <div className="flex justify-center w-full mt-20 sm:mt-40">
                    <div className="w-full sm:w-10/12 sm:h-[600px] bg-white bg-opacity-10 rounded-[32px] backdrop-blur-[100px] flex justify-between flex-col sm:flex-row px-5 sm:pl-10 md:pl-16 lg:pl-20 py-10 gap-10 sm:py-0 sm:gap-0">
                        <div className="flex flex-col justify-center w-full gap-5 sm:w-6/12">
                            <div className="w-[89px] sm:w-[134px] h-[25px] sm:h-10 px-[10px] sm:px-[30px] py-2 bg-gradient-to-r from-green-400 to-blue-800 rounded-[40px] border border-emerald-600 justify-center items-center gap-2.5 inline-flex">
                                <div className="font-sans text-xs font-bold leading-normal text-center text-teal-400 sm:text-sm">
                                    New Era
                                </div>
                            </div>
                            <div className="sm:w-[621px] text-left text-white text-lg sm:text-[62px] font-semibold font-sans leading-7 sm:leading-[68.20px]">
                                Top Notch Tool for Sniping Tokens
                            </div>
                            <div className="flex flex-col items-start">
                                <div className="sm:w-[573px] text-left opacity-80 text-white text-sm sm:text-lg font-normal font-sans leading-relaxed">
                                    Our platform perfectly performs sniping of the desired ERC-20 token.
                                </div>
                                <div className="mt-3 sm:w-[573px] text-left opacity-80 text-white text-sm sm:text-lg font-normal font-sans leading-relaxed">
                                    Buy launched tokens at the lowest price and sell them at a higher price to generate more profits.
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col justify-center w-full sm:w-6/12">
                            <img src="/assets/tablet.png" alt="tablet" className="w-full sm:w-10/12" />
                        </div>
                    </div>
                </div>
                <div className="flex justify-center w-full mt-20 sm:mt-40">
                    <div className="w-full sm:w-10/12 sm:h-[600px] bg-white bg-opacity-10 rounded-[32px] backdrop-blur-[100px] flex justify-between flex-col sm:flex-row px-5 sm:pl-10 md:pl-16 lg:pl-20 py-10 gap-10 sm:py-0 sm:gap-0">
                        <div className="flex flex-col justify-center w-full gap-5 sm:w-6/12">
                            <div className="w-[114px] sm:w-[154px] h-[25px] sm:h-10 px-[10px] sm:px-[30px] py-2 bg-gradient-to-r from-green-400 to-blue-800 rounded-[40px] border border-emerald-600 justify-center items-center gap-2.5 inline-flex">
                                <div className="font-sans text-xs font-bold leading-normal text-center text-teal-400 sm:text-sm">
                                    Advantages
                                </div>
                            </div>
                            <div className="sm:w-[621px] text-left text-white text-lg sm:text-[62px] font-semibold font-sans leading-7 sm:leading-[68.20px]">
                                Safe and Convenient project management
                            </div>
                            <div className="flex flex-col items-start">
                                <div className="sm:w-[573px] text-left opacity-80 text-white text-sm sm:text-lg font-normal font-sans leading-relaxed">
                                    You can seamlessly manage your projects using our platform. Purchase of tokens by sniping bots, monitoring of token prices, sale of tokens, transfer of tokens to other wallets, all are carried out through an integrated and unified user-friendly interface.
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col justify-center w-full sm:w-6/12">
                            <img src="/assets/accuratly.png" alt="tablet" className="w-full sm:w-10/12" />
                        </div>
                    </div>
                </div>
                <div className="flex justify-center w-full mt-20 sm:mt-40">
                    <div className="w-full sm:w-10/12 sm:h-[600px] bg-white bg-opacity-10 rounded-[32px] backdrop-blur-[100px] flex justify-between flex-col sm:flex-row px-5 sm:pl-10 md:pl-16 lg:pl-20 py-10 gap-10 sm:py-0 sm:gap-0">
                        <div className="flex flex-col justify-center w-full gap-5 sm:w-6/12">
                            <div className="w-[114px] sm:w-[164px] h-[25px] sm:h-10 px-[10px] sm:px-[30px] py-2 bg-gradient-to-r from-green-400 to-blue-800 rounded-[40px] border border-emerald-600 justify-center items-center gap-2.5 inline-flex">
                                <div className="font-sans text-xs font-bold leading-normal text-center text-teal-400 sm:text-sm">
                                    Pro feature
                                </div>
                            </div>
                            <div className="sm:w-[621px] text-left text-white text-lg sm:text-[62px] font-semibold font-sans leading-7 sm:leading-[68.20px]">
                                Unlock your time:
                            </div>
                            <div className="flex flex-col items-start">
                                <div className="sm:w-[573px] text-left opacity-80 text-white text-sm sm:text-lg font-normal font-sans leading-relaxed">
                                    No more chart analysis. Our software reduces 90% of the time you spend looking at charts, freeing you to focus on creating strategic decisions that matter.
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col justify-center w-full sm:w-6/12">
                            <img src="/assets/management.png" alt="tablet" className="w-full sm:w-10/12" />
                        </div>
                    </div>
                </div>
                <div className="relative flex justify-center w-full">
                    <div className="absolute flex justify-start w-full -z-1 -top-80 -left-80">
                        <img src="/assets/market-bg.svg" alt="mountain" className="opacity-40" />
                    </div>
                    <img src="/assets/market.png" className="w-full mt-20" alt="market" />
                </div>
                <div className="flex flex-col items-center justify-center w-full gap-5 pb-40 mt-40">
                    <div className="w-full sm:w-8/12 text-center text-white text-3xl sm:text-7xl font-semibold font-sans leading-[33px] sm:leading-[79.20px]">
                        Join 2K+ people who
                        <br />
                        try our product
                    </div>
                    <div className="w-full sm:w-8/12 text-center text-white text-sm sm:text-lg font-normal font-sans leading-[18px] sm:leading-relaxed">
                        Accuracy Pays Off: Elevate Your Strategy,
                        <br />
                        Gain the Edge, and Boost Your Performance.
                    </div>
                    <button className="w-[165px] sm:w-[236px] h-10 sm:h-16 px-5 sm:px-10 py-2.5 bg-gradient-to-r from-teal-600 border border-blue-800 rounded-[40px] justify-center items-center gap-2.5 inline-flex hover:bg-gradient-to-br active:scale-95 transition duration-100 ease-in-out transform focus:outline-none">
                        <div className="font-sans text-sm font-semibold leading-normal text-center text-white sm:text-base">
                            Discover More
                        </div>
                    </button>
                </div>
            </div>
            <div className="w-full py-10 sm:py-5 sm:min-h-[465px] flex justify-center items-center flex-col sm::flex-row relative">
                <div className="absolute inset-0 flex flex-col items-center justify-center w-full bg-no-repeat bg-cover -z-1 sm::flex-row opacity-20" style={{ backgroundImage: `url(${IMAGE_PATH})` }}></div>
                <div className="flex flex-col items-center w-9/12">
                    <div className="flex flex-col justify-around w-full gap-10 sm:flex-row sm:gap-0">
                        <div className="flex flex-wrap gap-10">
                            <div className="relative inline-flex flex-col items-start justify-start gap-5">
                                <div className="text-white text-opacity-75 text-[12px] sm:text-[14.80px] font-medium font-roboto uppercase leading-normal">
                                    Work inquiries
                                </div>
                                <div className="text-left text-white text-[30px] sm:text-[52px] font-bold font-['DM Sans'] leading-[36px] sm:leading-[54.60px]">
                                    Questions?
                                    <br />
                                    Get in touch.
                                </div>
                                <button className="h-[36px] sm:h-[48px] px-[20.39px] py-3.5 bg-blue-600 rounded-md flex justify-center items-center gap-[7.67px] hover:bg-gradient-to-br active:scale-95 transition duration-100 ease-in-out transform focus:outline-none">
                                    <div className="font-sans text-base font-bold leading-normal text-white">
                                        Contact Us
                                    </div>
                                    <IoArrowForward className="relative flex flex-col items-start justify-start w-4 h-4 mt-1 text-white" />
                                </button>
                            </div>
                            <div className="inline-flex flex-col items-start justify-start">
                                <div className="text-base font-bold leading-relaxed text-white font-roboto">
                                    United State
                                    <br />
                                </div>
                                <div className="text-base font-normal leading-relaxed text-white font-roboto">
                                    admin@blue-bot.tech</div>
                                <div className="text-base font-normal leading-relaxed text-white font-roboto">
                                    +1 832 998 8521
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-10">
                            <div className="inline-flex flex-col items-start justify-start">
                                <div className="text-base font-bold leading-relaxed text-white font-roboto">
                                    Work inquires
                                    <br />
                                </div>
                                <div className="text-base font-normal leading-relaxed text-white font-roboto">
                                    Interested in working with us<br />
                                </div>
                                <div className="text-base font-bold leading-relaxed text-white font-roboto">
                                    hello@blue-bot.tech
                                </div>
                                <div className="pt-10 text-base font-bold leading-relaxed text-white font-roboto">
                                    Career
                                    <br />
                                </div>
                                <div className="text-base font-normal leading-relaxed text-white font-roboto">
                                    Looking for a job opportunity?
                                    <br />
                                </div>
                                <div className="text-base font-bold leading-relaxed text-white font-roboto">
                                    See open positions
                                </div>
                            </div>
                            <div className="inline-flex flex-col items-start justify-start gap-2">
                                <div className="text-base font-bold leading-relaxed text-white font-roboto">
                                    Register for the newsletter<br />
                                </div>
                                <div className="w-[285px] h-12 bg-white bg-opacity-10 rounded-md px-2 relative flex items-center">
                                    <input className="w-full h-12 text-white bg-transparent border-none outline-none" placeholder="Email Address"></input>
                                    <button className="w-[36px] h-[36px] flex justify-center items-center bg-[#1F4FBD] rounded-[4px] active:scale-95 transition duration-100 ease-in-out transform focus:outline-none">
                                        <img src="/assets/send-mail.svg" className="absolute" alt="mail" />
                                    </button>
                                </div>
                                <div className="pt-10">
                                    <div className=" h-[19px] text-white text-base font-bold font-roboto leading-relaxed">Fb. /  Ig.  /   Tw.  /   Be.</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mt-10 w-[100vw] sm:w-full h-[90px] border-t border-white border-opacity-20 justify-between items-start flex flex-col  sm:flex-row gap-3 sm:gap-0 py-5 sm:py-0">
                        <div className="self-stretch pb-[1.92px] justify-end items-center inline-flex">
                            <div className="text-white text-[14px] sm:text-base font-normal font-roboto leading-[24.93px]">
                                © 2018-2024 High Perform Bot. All rights reserved | &nbsp; <b>Purchase</b>
                            </div>
                        </div>
                        <div className="self-stretch pb-[5.92px] justify-center items-center inline-flex">
                            <div className="h-[18px] text-right text-white text-[14px] sm:text-base font-normal font-roboto leading-[24.93px]">
                                Security | Privacy & Cookie Policy | Terms of Service
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
