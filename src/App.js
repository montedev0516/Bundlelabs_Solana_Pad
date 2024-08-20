import { createContext, useContext, useEffect, useState } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";

import "./App.css";
import SideBar from "./components/SideBar";
import NavBar from "./components/NavBar";
import LandingPage from "./pages/LandingPage";
import DashboardPage from "./pages/Dashboard";
import CreateTokenPage from "./pages/CreateTokenPage";
import PumpfunUploadMetadataPage from "./pages/PumpfunUploadMetadataPage";
import PumpfunBuyPage from "./pages/PumpfunBuyPage";
import PumpfunSellPage from "./pages/PumpfunSellPage";
import PumpfunTransferPage from "./pages/PumpfunTransferPage";
import SetAuthorityPage from "./pages/SetAuthorityPage";
import OpenBookMarketPage from "./pages/OpenBookMarketPage";
import ManageLpPage from "./pages/ManageLpPage";
import TokenAccountPage from "./pages/TokenAccountPage";
import BuyPage from "./pages/BuyPage";
import SellPage from "./pages/SellPage";
import TransferPage from "./pages/TransferPage";
import LogPage from "./pages/LogPage";
import SignupPage from "./pages/SignupPage";
import SigninPage from "./pages/SigninPage";

import LoadingDialog from "./components/Dialogs/LoadingDialog";

import VolumeBot from "./pages/VolumeBot";
import { AppContext } from "./providers/AppContext";

function App() {
    const location = useLocation();
    const {user, loadingPrompt, openLoading} = useContext(AppContext)
    const [breadCrumb, setBreadCrumb] = useState("");

    useEffect(() => {
        if (location.pathname === "/dashboard")
            setBreadCrumb("Dashboard");
        else if (location.pathname === "/buy")
            setBreadCrumb("Project > Buy");
        else if (location.pathname === "/sell")
            setBreadCrumb("Project > Sell");
        else if (location.pathname === "/transfer")
            setBreadCrumb("Project > Transfer");
        else if (location.pathname === "/create-token")
            setBreadCrumb("Tools > Create SPL Token");
        else if (location.pathname === "/set-authority")
            setBreadCrumb("Tools > Set Authority");
        else if (location.pathname === "/openbook")
            setBreadCrumb("Tools > Create OpenBook Market");
        else if (location.pathname === "/manage-lp")
            setBreadCrumb("Tools > Manage LP");
        else if (location.pathname === "/token-account")
            setBreadCrumb("Tools > Token Account");
        else if (location.pathname === "/log")
            setBreadCrumb("Log");
        else if (location.pathname === "/volume-bot")
            setBreadCrumb("Volume Bot");
        else if (location.pathname === "/market-maker")
            setBreadCrumb("Market Maker");
    }, [location.pathname]);

    return (
        <>
            <LoadingDialog isOpen={openLoading} prompt={loadingPrompt} />
            {
                user._id ?
                    (
                        <div className="flex flex-col bg-black-light min-h-[100vh] overflow-x-hidden">
                            <div className="relative flex items-start justify-between w-full h-max">
                                <SideBar className="2xl:block bg-[#1A1A37] w-[50px] h-[calc(100vh-2.5rem)] 2xl:h-[calc(100vh-1rem)] 2xl:w-[220px] border-r border-gray-highlight" />
                                <div className="w-[calc(100%-50px)] 2xl:w-[calc(100%-190px)] relative">
                                    <NavBar className="flex w-full h-[70px] mt-2" breadCrumb={breadCrumb} />
                                    <div className="lg:w-[calc(100%-50px)] w-[calc(100%-30px)] h-[calc(100vh-100px)] ml-4 lg:mx-6 overflow-y-auto">
                                        <Routes>
                                            <Route path="/dashboard" element={<DashboardPage />} />
                                            <Route path="/create-token" element={<CreateTokenPage />} />
                                            <Route path="/pumpfun-create-token" element={<PumpfunUploadMetadataPage />} />
                                            <Route path="/pumpfun-buy" element={<PumpfunBuyPage />} />
                                            <Route path="/pumpfun-sell" element={<PumpfunSellPage />} />
                                            <Route path="/pumpfun-transfer" element={<PumpfunTransferPage />} />
                                            <Route path="/set-authority" element={<SetAuthorityPage />} />
                                            <Route path="/openbook" element={<OpenBookMarketPage />} />
                                            <Route path="/manage-lp" element={<ManageLpPage />} />
                                            <Route path="/token-account" element={<TokenAccountPage />} />
                                            <Route path="/buy" element={<BuyPage />} />
                                            <Route path="/sell" element={<SellPage />} />
                                            <Route path="/transfer" element={<TransferPage />} />
                                            <Route path="/volume-bot" element={<VolumeBot />} />
                                            <Route path="/market-maker" element={<VolumeBot />} />
                                            { user.role === "admin" && <Route path="/log" element={<LogPage />} /> }
                                        </Routes>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) :
                    (
                        <Routes>
                            <Route path="/register" element={<SignupPage />} />
                            <Route path="/login" element={<SigninPage />} />
                            <Route path="/" element={<SigninPage />} />
                        </Routes>
                    )
            }
        </>
    );
}

export default App;
