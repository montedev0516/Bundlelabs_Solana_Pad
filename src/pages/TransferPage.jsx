
import { useContext, useState, useEffect } from "react";
import { toast } from "react-toastify";
import { FaDatabase, FaExclamationTriangle, FaRegCopy } from "react-icons/fa";
import { IoIosDownload } from "react-icons/io";
import axios from "axios";

import { ellipsisAddress, isValidAddress } from "../utils/methods";
import { AppContext } from "../providers/AppContext";

export default function TransferPage({ className }) {
    const {
        SERVER_URL,
        setLoadingPrompt,
        setOpenLoading,
        currentProject,
        setCurrentProject,
        updateProject,
        walletBalanceData,
        teamWalletBalanceData,
        notifyStatus,
        setNotifyStatus,
    } = useContext(AppContext);

    const [copied, setCopied] = useState({});
    const [targetWallet, setTargetWallet] = useState("");
    const [walletAllChecked, setWalletAllChecked] = useState(false);
    const [walletChecked, setWalletChecked] = useState([]);
    const [walletSolBalance, setWalletSolBalance] = useState([]);
    const [walletTokenBalance, setWalletTokenBalance] = useState([]);
    const [walletXferAddress, setWalletXferAddress] = useState([]);
    const [walletXferAmount, setWalletXferAmount] = useState([]);
    const [teamWalletAllChecked, setTeamWalletAllChecked] = useState(false);
    const [teamWalletChecked, setTeamWalletChecked] = useState([]);
    const [teamWalletSolBalance, setTeamWalletSolBalance] = useState([]);
    const [teamWalletTokenBalance, setTeamWalletTokenBalance] = useState([]);
    const [teamWalletXferAddress, setTeamWalletXferAddress] = useState([]);
    const [teamWalletXferAmount, setTeamWalletXferAmount] = useState([]);
    const [isDragging, setIsDragging] = useState(false);

    useEffect(() => {
        if (currentProject.wallets) {
            if (currentProject.wallets.length !== walletChecked.length) {
                const newWalletChecked = currentProject.wallets.map(() => false);
                setWalletChecked(newWalletChecked);
                setWalletAllChecked(false);

                setWalletXferAddress(currentProject.wallets.map(() => ""));
                setWalletXferAmount(currentProject.wallets.map(() => ""));
            }

            setWalletSolBalance(currentProject.wallets.map(() => "-"));
            setWalletTokenBalance(currentProject.wallets.map(() => "0"));
        }
        else {
            setWalletAllChecked(false);
            setWalletChecked([]);
            setWalletSolBalance([]);
            setWalletTokenBalance([]);
            setWalletXferAddress([]);
            setWalletXferAmount([]);
        }
    }, [currentProject.wallets, walletChecked.length]);

    useEffect(() => {
        if (currentProject.teamWallets) {
            if (currentProject.teamWallets.length !== teamWalletChecked.length) {
                const newTeamWalletChecked = currentProject.teamWallets.map(() => false);
                setTeamWalletChecked(newTeamWalletChecked);
                setTeamWalletAllChecked(false);

                setTeamWalletXferAddress(currentProject.teamWallets.map(() => ""));
                setTeamWalletXferAmount(currentProject.teamWallets.map(() => ""));
            }

            setTeamWalletSolBalance(currentProject.teamWallets.map(() => "-"));
            setTeamWalletTokenBalance(currentProject.teamWallets.map(() => "0"));
        }
        else {
            setTeamWalletAllChecked(false);
            setTeamWalletChecked([]);
            setTeamWalletSolBalance([]);
            setTeamWalletTokenBalance([]);
            setTeamWalletXferAddress([]);
            setTeamWalletXferAmount([]);
        }
    }, [currentProject.teamWallets, teamWalletChecked.length]);

    useEffect(() => {
        if (currentProject.token && walletBalanceData.address === currentProject.token.address && walletBalanceData.token.length === walletTokenBalance.length) {
            setWalletTokenBalance(walletBalanceData.token);
        }
    }, [currentProject.token, walletBalanceData.address, walletBalanceData.token, walletTokenBalance.length]);

    useEffect(() => {
        if (currentProject.token && walletBalanceData.address === currentProject.token.address && walletBalanceData.sol.length === walletSolBalance.length) {
            setWalletSolBalance(walletBalanceData.sol);
        }
    }, [currentProject.token, walletBalanceData.address, walletBalanceData.sol, walletSolBalance.length]);

    useEffect(() => {
        if (currentProject.token && teamWalletBalanceData.address === currentProject.token.address && teamWalletBalanceData.token.length === teamWalletTokenBalance.length) {
            setTeamWalletTokenBalance(teamWalletBalanceData.token);
        }
    }, [currentProject.token, teamWalletBalanceData.address, teamWalletBalanceData.token, teamWalletTokenBalance.length]);

    useEffect(() => {
        if (currentProject.token && teamWalletBalanceData.address === currentProject.token.address && teamWalletBalanceData.sol.length === teamWalletSolBalance.length) {
            setTeamWalletSolBalance(teamWalletBalanceData.sol);
        }
    }, [currentProject.token, teamWalletBalanceData.address, teamWalletBalanceData.sol, teamWalletSolBalance.length]);

    useEffect(() => {
        if (notifyStatus.tag === "TRANSFER_COMPLETED") {
            if (notifyStatus.success)
                toast.success("Succeed to transfer tokens!");
            else
                toast.warn("Failed to transfer tokens!");

            if (notifyStatus.project) {
                updateProject(notifyStatus.project);
                if (currentProject._id === notifyStatus.project._id)
                    setCurrentProject(notifyStatus.project);
            }

            setOpenLoading(false);
            setNotifyStatus({ success: true, tag: "NONE" });
        }
        else if (notifyStatus.tag === "COLLECT_ALL_SOL") {
            if (notifyStatus.success)
                toast.success("Succeed to collect all SOL!");
            else
                toast.warn("Failed to collect all SOL!");

            if (notifyStatus.project) {
                updateProject(notifyStatus.project);
                if (currentProject._id === notifyStatus.project._id)
                    setCurrentProject(notifyStatus.project);
            }
            
            setOpenLoading(false);
            setNotifyStatus({ success: true, tag: "NONE" });
        }
    }, [notifyStatus, currentProject._id]);

    const copyToClipboard = async (key, text) => {
        if ('clipboard' in navigator) {
            await navigator.clipboard.writeText(text);
            toast.success("Copied");
            setCopied({
                ...copied,
                [key]: true,
            });
            setTimeout(() => setCopied({
                ...copied,
                [key]: false,
            }), 2000);
        }
        else
            console.error('Clipboard not supported');
    };

    const handleDownloadWallets = async () => {
        if (!currentProject.token) {
            toast.warn("Select the project");
            return;
        }

        setLoadingPrompt("Downloading wallets...");
        setOpenLoading(true);
        try {
            const { data } = await axios.post(`${SERVER_URL}/api/v1/project/download-wallets`,
                {
                    projectId: currentProject._id,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        "MW-USER-ID": localStorage.getItem("access-token"),
                    },
                }
            );

            const downloadFile = (data, fileName) => {
                const url = window.URL.createObjectURL(new Blob([data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute(
                    'download',
                    fileName,
                );

                // Append to html link element page
                document.body.appendChild(link);

                // Start download
                link.click();

                // Clean up and remove the link
                link.parentNode.removeChild(link);
            };

            downloadFile(data, `wallets_${currentProject.name}.csv`);
        }
        catch (err) {
            console.log(err);
            toast.warn("Failed to download wallets!");
        }
        setOpenLoading(false);
    };

    const handleCollectAllSol = async () => {
        if (!currentProject.token)
            return;

        if (!isValidAddress(targetWallet)) {
            toast.warn("Please input wallet to send SOL!");
            return;
        }

        const validWalletChecked = walletChecked.filter(item => item === true);
        const validTeamWalletChecked = teamWalletChecked.filter(item => item === true);
        if (validWalletChecked.length === 0 && validTeamWalletChecked.length === 0) {
            toast.warn("Please check wallets to collect SOL from!");
            return;
        }

        setLoadingPrompt("Collecting all SOL...");
        setOpenLoading(true);
        try {
            let wallets = [];
            let teamWallets = [];
            for (let i = 0; i < currentProject.wallets.length; i++) {
                if (walletChecked[i]) {
                    wallets = [
                        ...wallets,
                        currentProject.wallets[i].address,
                    ];
                }
            }

            if (currentProject.teamWallets) {
                for (let i = 0; i < currentProject.teamWallets.length; i++) {
                    if (teamWalletChecked[i]) {
                        teamWallets = [
                            ...teamWallets,
                            currentProject.teamWallets[i].address,
                        ];
                    }
                }
            }

            await axios.post(`${SERVER_URL}/api/v1/project/collect-all-sol`,
                {
                    projectId: currentProject._id,
                    targetWallet,
                    wallets,
                    teamWallets,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        "MW-USER-ID": localStorage.getItem("access-token"),
                    },
                }
            );
        }
        catch (err) {
            console.log(err);
            toast.warn("Failed to collect all SOL!");
            setOpenLoading(false);
        }
    };

    const getSelectedTokenBalance = () => {
        try {
            let selectedBalance = 0;
            for (let i = 0; i < walletChecked.length; i++) {
                if (!walletChecked[i])
                    continue;

                selectedBalance += Number(walletTokenBalance[i]);
            }
            return selectedBalance.toFixed(4);
        }
        catch (err) {
            console.log(err);
        }
        return 0;
    };

    const handleMouseDown = (e, id) => {
        e.preventDefault();
        setIsDragging(true);
        handleWalletChanged(id, "checked", !walletChecked[id])
    };

    const handleMouseEnter = (id) => {
        if (isDragging) {
            handleWalletChanged(id, "checked", !walletChecked[id])
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleWalletAllChecked = (e) => {
        console.log("Wallet all checked:", e.target.value, walletAllChecked);
        const newWalletAllChecked = !walletAllChecked;
        setWalletAllChecked(newWalletAllChecked);
        setWalletChecked(walletChecked.map(() => newWalletAllChecked));
    };

    const handleWalletChanged = (index, key, value) => {
        console.log("Wallet changed:", index, key, value);
        if (key === "checked") {
            let newWalletChecked = [...walletChecked];
            newWalletChecked[index] = !newWalletChecked[index];
            setWalletChecked(newWalletChecked);

            let newWalletAllChecked = true;
            for (let i = 0; i < newWalletChecked.length; i++)
                newWalletAllChecked &&= newWalletChecked[i];
            setWalletAllChecked(newWalletAllChecked);
        }
        else if (key === "xfer_address") {
            let newWalletXferAddress = [...walletXferAddress];
            newWalletXferAddress[index] = value;
            setWalletXferAddress(newWalletXferAddress);
        }
        else if (key === "xfer_amount") {
            let newWalletXferAmount = [...walletXferAmount];
            newWalletXferAmount[index] = value;
            setWalletXferAmount(newWalletXferAmount);
        }
    };

    const handleTeamWalletAllChecked = (e) => {
        console.log("Team wallet all checked:", e.target.value, teamWalletAllChecked);
        const newTeamWalletAllChecked = !teamWalletAllChecked;
        setTeamWalletAllChecked(newTeamWalletAllChecked);
        setTeamWalletChecked(teamWalletChecked.map(() => newTeamWalletAllChecked));
    };

    const handleTeamWalletChanged = (index, key, value) => {
        console.log("Team wallet changed:", index, key, value);
        if (key === "checked") {
            let newTeamWalletChecked = [...teamWalletChecked];
            newTeamWalletChecked[index] = !newTeamWalletChecked[index];
            setTeamWalletChecked(newTeamWalletChecked);

            let newTeamWalletAllChecked = true;
            for (let i = 0; i < newTeamWalletChecked.length; i++)
                newTeamWalletAllChecked &&= newTeamWalletChecked[i];
            setTeamWalletAllChecked(newTeamWalletAllChecked);
        }
        else if (key === "xfer_address") {
            let newTeamWalletXferAddress = [...teamWalletXferAddress];
            newTeamWalletXferAddress[index] = value;
            setTeamWalletXferAddress(newTeamWalletXferAddress);
        }
        else if (key === "xfer_amount") {
            let newTeamWalletXferAmount = [...teamWalletXferAmount];
            newTeamWalletXferAmount[index] = value;
            setTeamWalletXferAmount(newTeamWalletXferAmount);
        }
    };

    const handleTransferTokens = async () => {
        if (!currentProject.token)
            return;

        if (!isValidAddress(currentProject.token.address)) {
            toast.warn("Invalid token address!");
            return;
        }

        const validWalletChecked = walletChecked.filter(item => item === true);
        const validTeamWalletChecked = currentProject.teamWallets ? teamWalletChecked.filter(item => item === true) : [];
        if (validWalletChecked.length === 0 && validTeamWalletChecked.length === 0) {
            toast.warn("Please check wallets to sell tokens");
            return;
        }

        let wallets = [];
        for (let i = 0; i < currentProject.wallets.length; i++) {
            if (!walletChecked[i])
                continue;

            if (!isValidAddress(walletXferAddress[i])) {
                toast.warn(`Wallet #${i + 1}: Invalid address to transfer tokens`);
                return;
            }

            const tokenAmount = Number(walletXferAmount[i].replaceAll(",", ""));
            if (isNaN(tokenAmount) || tokenAmount <= 0) {
                toast.warn(`Wallet #${i + 1}: Invalid token amount`);
                return;
            }

            wallets = [
                ...wallets,
                {
                    address: currentProject.wallets[i].address,
                    receipent: walletXferAddress[i],
                    amount: tokenAmount,
                }
            ];
        }

        let teamWallets = [];
        if (currentProject.teamWallets) {
            for (let i = 0; i < currentProject.teamWallets.length; i++) {
                if (!teamWalletChecked[i])
                    continue;

                if (!isValidAddress(teamWalletXferAddress[i])) {
                    toast.warn(`Team Wallet #${i + 1}: Invalid address to transfer tokens`);
                    return;
                }

                const tokenAmount = Number(teamWalletXferAmount[i].replaceAll(",", ""));
                if (isNaN(tokenAmount) || tokenAmount <= 0) {
                    toast.warn(`Team Wallet #${i + 1}: Invalid token amount`);
                    return;
                }

                teamWallets = [
                    ...teamWallets,
                    {
                        address: currentProject.teamWallets[i].address,
                        receipent: teamWalletXferAddress[i],
                        amount: tokenAmount,
                    }
                ];
            }
        }

        setLoadingPrompt("Transferring tokens...");
        setOpenLoading(true);
        try {
            await axios.post(`${SERVER_URL}/api/v1/project/transfer`,
                {
                    projectId: currentProject._id,
                    token: currentProject.token.address,
                    wallets: wallets,
                    teamWallets: teamWallets,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        "MW-USER-ID": localStorage.getItem("access-token"),
                    },
                }
            );
        }
        catch (err) {
            console.log(err);
            toast.warn("Failed to transfer tokens!");
            setOpenLoading(false);
        }
    };

    return (
        <div className={`${className} flex flex-col text-white rounded-[4px] border border-gray-highlight p-4 pb-3`}>
            <div className="flex flex-col">
                <div className="flex items-start justify-between w-full h-auto">
                    <div className="flex items-center font-sans text-xs font-medium text-white">
                        <div className="font-bold uppercase">Transfer Token </div>
                        {currentProject._id &&
                            <div className="pl-1 font-bold uppercase text-green-normal">{currentProject.name ? `${currentProject.name}` : "No project"}</div>
                        }
                        {currentProject?.token?.address &&
                            <>
                                <div className="mx-2 text-gray-normal opacity-30">/</div>
                                <div className="font-semibold text-gray-normal">{ellipsisAddress(currentProject?.token?.address)}</div>
                                {copied["token_address"] ?
                                    (<svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>) :
                                    <FaRegCopy className="w-3.5 h-3.5 ml-2 transition ease-in-out transform cursor-pointer active:scale-95 duration-90" onClick={() => copyToClipboard("token_address", currentProject?.token?.address)} />}
                                <a href={`https://solscan.io/account/${currentProject?.token?.address}`} target="_blank" rel="noreferrer">
                                    <img className="w-3.5 h-3.5 object-contain ml-2" src="/assets/solscan.png" alt="solscan" />
                                </a>
                                <a href={`https://www.dextools.io/app/en/solana/pair-explorer/${currentProject?.token?.address}`} target="_blank" rel="noreferrer">
                                    <img className="w-3.5 h-3.5 object-contain ml-2" src="/assets/dextool.png" alt="dextools" />
                                </a>
                                <a href={`https://dexscreener.com/solana/${currentProject?.token?.address}`} target="_blank" rel="noreferrer">
                                    <img className="w-3.5 h-3.5 object-contain ml-2" src="/assets/dexscreener.png" alt="dexscreener" />
                                </a>
                            </>
                        }
                    </div>
                </div>
                <div className="flex flex-row justify-between w-full gap-2 mt-3 mb-3 font-sans">
                    <div className="flex items-center gap-3 font-sans text-sm text-gray-normal">
                        <div>
                            Selected: <span className="text-white">{walletChecked.filter(wal => wal).length}</span>
                        </div>
                        <div>
                            Token balance: <span className="text-white">{getSelectedTokenBalance()}</span>
                        </div>
                    </div>
                    <div className="flex flex-col justify-end gap-2 lg:items-center lg:flex-row">
                        <button
                            className="pl-3 pr-4 h-button rounded-[4px] justify-center items-center gap-1 inline-flex bg-[#1A1A37] active:scale-95 transition duration-90 ease-in-out transform focus:outline-none text-xs font-medium text-center text-white uppercase disabled:text-gray-border disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                            onClick={handleDownloadWallets}
                        >
                            <IoIosDownload className="text-lg text-green-normal" />
                            Download Wallets
                        </button>
                    </div>
                </div>
                <div className="w-full overflow-visible font-sans">
                    <div className="flex flex-col w-full h-full text-white bg-transparent bg-clip-border">
                        <div className="relative border border-gray-highlight rounded-lg">
                            {
                                currentProject.teamWallets && currentProject.wallets &&
                                <div className="absolute -left-[23px] top-[8px] z-10 text-xxs text-center text-white font-bold uppercase -rotate-90">User</div>
                            }
                            <div className={`${currentProject.teamWallets ? "h-[calc(100vh-415px)] 2xl:h-[calc(100vh-475px)]" : "h-[calc(100vh-310px)] 2xl:h-[calc(100vh-280px)]"} overflow-y-auto`}>
                                {(!currentProject.wallets || currentProject.wallets.length === 0) &&
                                    <div className="absolute flex items-center justify-center gap-2 my-3 text-base font-bold text-center uppercase -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 text-gray-border">
                                        <FaExclamationTriangle className="text-sm opacity-50 text-green-normal" /> No Wallet
                                    </div>
                                }
                                <table className="min-w-[700px] w-full text-xs">
                                    <thead className="text-gray-normal">
                                        <tr className="uppercase h-7 bg-[#1A1A37] sticky top-0 z-10">
                                            <th className="w-8 text-center">
                                                <div className="flex items-center justify-center">
                                                    <input type="checkbox"
                                                        className="w-4 h-4 outline-none bg-gray-highlight opacity-20 accent-green-normal ring-0 rounded-lg"
                                                        checked={walletAllChecked}
                                                        onChange={handleWalletAllChecked} />
                                                </div>
                                            </th>
                                            <th className="w-8">
                                                #
                                            </th>
                                            <th className="">
                                                Address
                                            </th>
                                            <th className="text-left">
                                                SOL Balance
                                            </th>
                                            <th className="text-left">
                                                Token Balance
                                            </th>
                                            <th className="w-[25%]">
                                                Address to transfer
                                            </th>
                                            <th className="w-[15%]">
                                                Tokens to transfer
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-xs text-white" onMouseLeave={handleMouseUp}>
                                        {
                                            currentProject.wallets &&
                                            currentProject.wallets.map((item, index) => {
                                                return (
                                                    <tr key={index}
                                                        className={`${index % 2 === 1 && "bg-[#ffffff02]"} hover:bg-[#ffffff08] ${walletChecked[index] && "!bg-[#00000030]"} h-8`}
                                                    >
                                                        <td className="text-center"
                                                            onMouseDown={(e) => handleMouseDown(e, index)}
                                                            onMouseEnter={() => handleMouseEnter(index)}
                                                            onMouseUp={handleMouseUp}
                                                        >
                                                            <div className="flex items-center justify-center">
                                                                <input type="checkbox"
                                                                    className="w-4 h-4 outline-none bg-gray-highlight opacity-20 accent-green-normal ring-0 rounded-lg"
                                                                    checked={walletChecked[index]}
                                                                />
                                                            </div>
                                                        </td>
                                                        <td className="text-center">
                                                            <p className="block font-sans antialiased font-normal leading-normal text-center text-white">
                                                                {index + 1}
                                                            </p>
                                                        </td>
                                                        <td className="text-center">
                                                            <div className="flex items-center justify-center gap-1 font-sans antialiased font-normal leading-normal text-gray-normal">
                                                                <p className="bg-transparent border-none outline-none">
                                                                    {ellipsisAddress(item.address, true)}
                                                                    {/* {item.address} */}
                                                                </p>
                                                                {
                                                                    copied["wallet_" + index] ?
                                                                        (<svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                                        </svg>) :
                                                                        (<FaRegCopy className="w-3 h-3 transition ease-in-out transform cursor-pointer active:scale-95 duration-90" onClick={() => copyToClipboard("wallet_" + index, item.address)} />)
                                                                }
                                                            </div>
                                                        </td>
                                                        <td className="">
                                                            <p className="flex items-center justify-start text-yellow-normal">
                                                                <img className="w-3 mr-1" src="/assets/solsemi.svg" alt="sol" />
                                                                {walletSolBalance[index]}
                                                            </p>
                                                        </td>
                                                        <td className="">
                                                            <p className="flex items-center justify-start text-white">
                                                                <FaDatabase className="mr-1 opacity-50 text-xxs text-gray-normal" />
                                                                <span>
                                                                    {
                                                                        walletTokenBalance[index] ?
                                                                            Number(walletTokenBalance[index]?.split(".")[0] ?? "0").toLocaleString()
                                                                            : "0"
                                                                    }
                                                                </span>
                                                                <span className="font-normal text-gray-normal">.{
                                                                    walletTokenBalance[index] ?
                                                                        walletTokenBalance[index]?.split(".")[1]
                                                                        : "0000"
                                                                }
                                                                </span>
                                                            </p>
                                                        </td>
                                                        <td className="text-center">
                                                            <input
                                                                className="outline-none border border-gray-highlight font-medium text-gray-normal placeholder:text-gray-border text-xs px-2.5 bg-transparent text-center w-full h-[26px] my-[2px] rounded-lg"
                                                                value={walletXferAddress[index]}
                                                                onChange={(e) => handleWalletChanged(index, "xfer_address", e.target.value)} />
                                                        </td>
                                                        <td className="text-center">
                                                            <input
                                                                className="outline-none border border-gray-highlight font-medium text-gray-normal placeholder:text-gray-border text-xs px-2.5 bg-transparent text-center w-[150px] h-[26px] my-[2px] rounded-lg"
                                                                value={walletXferAmount[index]}
                                                                onChange={(e) => handleWalletChanged(index, "xfer_amount", e.target.value)} />
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        {
                            currentProject.teamWallets &&
                            (
                                <div className="relative mt-[5px] border border-gray-highlight rounded-lg">
                                    <div className="absolute -left-[23px] top-[8px] z-10 text-xxs text-center text-white font-bold uppercase -rotate-90">Team</div>
                                    <div className="h-[190px] overflow-y-auto">
                                        <table className="w-full text-xs min-w-[700px]">
                                            <thead className=" text-gray-normal">
                                                <tr className="uppercase h-7 bg-[#1A1A37] sticky top-0 z-10">
                                                    <th className="w-8 text-center">
                                                        <input type="checkbox"
                                                            className="w-4 h-4 outline-none bg-gray-highlight opacity-20 accent-green-normal ring-0 rounded-lg"
                                                            checked={teamWalletAllChecked}
                                                            onChange={handleTeamWalletAllChecked} />
                                                    </th>
                                                    <th className="w-8">
                                                        #
                                                    </th>
                                                    <th className="">
                                                        Address
                                                    </th>
                                                    <th className="text-left">
                                                        SOL Balance
                                                    </th>
                                                    <th className="text-left">
                                                        Token Balance
                                                    </th>
                                                    <th className="w-[25%]">
                                                        Address to transfer
                                                    </th>
                                                    <th className="w-[15%]">
                                                        Tokens to transfer
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="">
                                                {
                                                    currentProject.teamWallets.map((item, index) => {
                                                        return (
                                                            <tr key={index}
                                                                className={`${index % 2 === 1 && "bg-[#ffffff02]"} hover:bg-[#ffffff08] ${teamWalletChecked[index] && "!bg-[#00000030]"} h-8`}
                                                            >
                                                                <td className="text-center">
                                                                    <div className="flex items-center justify-center">
                                                                        <input type="checkbox"
                                                                            className="w-4 h-4 outline-none bg-gray-highlight opacity-20 accent-green-normal ring-0 rounded-lg"
                                                                            checked={teamWalletChecked[index]}
                                                                            onChange={(e) => handleTeamWalletChanged(index, "checked", e.target.value)} />
                                                                    </div>
                                                                </td>
                                                                <td className="text-center">
                                                                    {index + 1}
                                                                </td>
                                                                <td className="text-center">
                                                                    <div className="flex items-center justify-center gap-1 font-sans antialiased font-normal leading-normal text-gray-normal">
                                                                        <p className="bg-transparent border-none outline-none">
                                                                            {ellipsisAddress(item.address, true)}
                                                                        </p>
                                                                        {
                                                                            copied["team_wallet_" + index] ?
                                                                                (<svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                                                </svg>) :
                                                                                (<FaRegCopy className="w-3.5 h-3.5 transition ease-in-out transform cursor-pointer active:scale-95 duration-90" onClick={() => copyToClipboard("team_wallet_" + index, item.address)} />)
                                                                        }
                                                                    </div>
                                                                </td>
                                                                <td className="">
                                                                    <p className="flex items-center justify-start text-yellow-normal">
                                                                        <img className="w-3 mr-1" src="/assets/solsemi.svg" alt="sol" />
                                                                        {teamWalletSolBalance[index]}
                                                                    </p>
                                                                </td>
                                                                <td className="">
                                                                    <p className="flex items-center justify-start text-white">
                                                                        <FaDatabase className="mr-1 opacity-50 text-xxs text-gray-normal" />
                                                                        <span>{Number(teamWalletTokenBalance[index]?.split(".")[0] ?? "0").toLocaleString()}</span>
                                                                        <span className="font-normal text-gray-normal">.{teamWalletTokenBalance[index]?.split(".")[1] ?? "00"}</span>
                                                                    </p>
                                                                </td>
                                                                <td className="text-center">
                                                                    <input
                                                                        className="outline-none border border-gray-highlight font-medium text-gray-normal placeholder:text-gray-border text-xs px-2.5 bg-transparent text-center w-full h-[26px] my-[2px] rounded-lg"
                                                                        value={teamWalletXferAddress[index]}
                                                                        onChange={(e) => handleTeamWalletChanged(index, "xfer_address", e.target.value)} />
                                                                </td>
                                                                <td className="text-center">
                                                                    <input
                                                                        className="outline-none border border-gray-highlight font-medium text-gray-normal placeholder:text-gray-border text-xs px-2.5 bg-transparent text-center w-[150px] h-[26px] my-[2px] rounded-lg"
                                                                        value={teamWalletXferAmount[index]}
                                                                        onChange={(e) => handleTeamWalletChanged(index, "xfer_amount", e.target.value)} />
                                                                </td>
                                                            </tr>
                                                        );
                                                    })
                                                }
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )
                        }
                    </div>
                </div>
                <div className="relative flex items-center justify-between h-full gap-3 mt-3 text-white bg-transparent bg-clip-border">
                    <div className="flex items-center grow">
                        <div className="font-sans text-xs uppercase text-gray-normal whitespace-nowrap">
                            Target Wallet:
                        </div>
                        <input
                            className="outline-none border border-gray-border font-sans text-white placeholder:text-gray-border text-sm px-2.5 bg-transparent w-full h-button ml-2 grow max-w-[430px] rounded-lg"
                            placeholder="Target Wallet Address"
                            value={targetWallet}
                            onChange={(e) => setTargetWallet(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            className="font-sans text-xs font-medium text-center text-white uppercase px-6 h-10 rounded-[4px] justify-center items-center gap-2.5 bg-green-normal active:scale-95 transition duration-90 ease-in-out transform focus:outline-none"
                            onClick={handleCollectAllSol}
                        >
                            Collect All SOL
                        </button>
                        <button
                            className="font-sans text-xs font-medium text-center text-white uppercase px-6 h-10 rounded-[4px] justify-center items-center gap-2.5 bg-green-normal active:scale-95 transition duration-90 ease-in-out transform focus:outline-none disabled:opacity-50 disabled:transform-none disabled:cursor-not-allowed"
                            onClick={handleTransferTokens}>
                            Transfer
                        </button>
                    </div>
                </div>
            </div>
        </div >
    );
}
