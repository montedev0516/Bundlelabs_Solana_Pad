import { useContext, useState } from "react";
import { AppContext } from "../../providers/AppContext";
import { ellipsisAddress } from "../../utils/methods";
import { FaDatabase, FaExclamationTriangle, FaRegCopy, FaSave } from "react-icons/fa";
import { toast } from "react-toastify";
import PrivateKeyInput from "../../components/Input/PrivateKeyInupt";
import NormalInput from "../../components/Input/NormalInput";
import ActionButton from "../../components/Buttons/ActionButton";
import { IoIosAddCircle, IoIosDownload, IoIosRefresh } from "react-icons/io";
import NewWalletDialog from "../../components/Dialogs/NewWalletDialog";
import axios from "axios";

const VolumeBot = ({ className }) => {
    const {
        SERVER_URL,
        setLoadingPrompt,
        setOpenLoading,
        user,
        currentProject,
        setCurrentProject,
        updateProject,
        walletBalanceData,
        teamWalletBalanceData,
        notifyStatus,
        setNotifyStatus,
    } = useContext(AppContext);

    const [tokenAddress, setTokenAddress] = useState('')
    const [targetVolume, setTargetVolume] = useState('')
    const [deplayTime, setDelayTime] = useState('')
    const [buyPercent, setBuyPercent] = useState('')
    const [targetWallet, setTargetWallet] = useState('')
    const [walletAllChecked, setWalletAllChecked] = useState(false);
    const [walletChecked, setWalletChecked] = useState([]);
    const [walletTokenAmount, setWalletTokenAmount] = useState([]);
    const [walletSolAmount, setWalletSolAmount] = useState([]);
    const [walletSolBalance, setWalletSolBalance] = useState([]);
    const [walletTokenBalance, setWalletTokenBalance] = useState([]);
    const [copied, setCopied] = useState({});
    const [isDragging, setIsDragging] = useState(false);
    const [newWalletDialog, setNewWalletDialog] = useState(false);

    const handleOKNewWallets = async (walletCount, fresh) => {
        console.log("New wallets:", walletCount, fresh);
        let count = 0;
        try {
            count = parseInt(walletCount);
        }
        catch (err) {
            console.log(err);
        }

        if (isNaN(count) || count < 0) {
            toast.warn("Invalid wallet count");
            return;
        }

        setNewWalletDialog(false);
        setLoadingPrompt("Generating new wallets...");
        setOpenLoading(true);
        try {
            const { data } = await axios.post(`${SERVER_URL}/api/v1/project/generate-wallets`,
                {
                    projectId: currentProject._id,
                    count: walletCount,
                    fresh: fresh,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        "MW-USER-ID": localStorage.getItem("access-token"),
                    },
                }
            );
            const newCurrentProject = {
                ...currentProject,
                wallets: data.project.wallets,
            };
            updateProject(newCurrentProject);
            setCurrentProject(newCurrentProject);
            toast.success("New wallets has been generated successfully");
        }
        catch (err) {
            console.log(err);
            toast.warn("Failed to generate new wallets!");
        }
        setOpenLoading(false);
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
        else if (key === "token_amount") {
            let newWalletTokenAmount = [...walletTokenAmount];
            newWalletTokenAmount[index] = value;
            setWalletTokenAmount(newWalletTokenAmount);
        }
        else if (key === "sol_amount") {
            let newWalletSOLAmount = [...walletSolAmount];
            newWalletSOLAmount[index] = value;
            setWalletSolAmount(newWalletSOLAmount);
        }
    };

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

    const handleSaveProject = async () => {
        setLoadingPrompt("Saving project...");
        setOpenLoading(true);
        try {
            const wallets = currentProject.wallets.map((item, index) => {
                return {
                    address: item.address,
                    initialTokenAmount: walletTokenAmount[index],
                    initialSolAmount: walletSolAmount[index],
                };
            });
            // const { data } = await axios.post(`${SERVER_URL}/api/v1/project/save`,
            //     {
            //         projectId: currentProject._id,
            //         token: token,
            //         zombie: zombieWallet,
            //         wallets: wallets,
            //         platform: 'raydium'
            //     },
            //     {
            //         headers: {
            //             "Content-Type": "application/json",
            //             "MW-USER-ID": localStorage.getItem("access-token"),
            //         },
            //     }
            // );

            // updateProject(data.project);
            // if (currentProject._id === data.project._id)
            //     setCurrentProject(data.project);
            toast.success("Project has been saved successfully");
        }
        catch (err) {
            console.log(err);
            toast.warn("Failed to save project!");
        }
        setOpenLoading(false);
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleTokenAddress = (e) => {
        setTokenAddress(e.target.value)
    }

    const handleTargetVolume = (e) => {
        setTargetVolume(e.target.value)
    }

    const handleDelayTime = (e) => {
        setDelayTime(e.target.value)
    }

    const handleBuyPercent = (e) => {
        setBuyPercent(e.target.value)
    }

    const handleCollectAllSol = () => {

    }

    const handleStartBot = () => {

    }

    const handleRefresh = () => {

    }

    console.log("pooh, currentProject = ", currentProject)

    return (
        <div className={`${className} flex flex-col text-white rounded-[4px] border border-gray-highlight p-4 pb-3`}>
            <NewWalletDialog isOpen={newWalletDialog} onOK={handleOKNewWallets} onCancel={() => setNewWalletDialog(false)} mode="bot" />
            <div className="flex flex-col">
                <div className="flex items-start justify-between w-full h-auto">
                    <div className="flex items-center font-sans text-xs font-medium text-white">
                        <div className="font-bold uppercase">Volume Bot</div>
                        {currentProject._id &&
                            <div className="pl-1 font-bold uppercase text-green-normal">{currentProject.name ? `${currentProject.name}` : "No project"}</div>
                        }
                    </div>
                    <div className="flex">
                        <button
                            className={`rounded-sm cursor-pointer w-9 h-9 bg-green-normal active:scale-95 transition duration-90 ease-in-out transform "}`}
                            onClick={handleSaveProject}
                        >
                            <FaSave className="w-4 h-4 m-auto" />
                        </button>
                    </div>
                </div>
                <div className="w-full mt-3 grid grid-cols-12 gap-3">
                    <NormalInput title="Token Address" value={tokenAddress} action={handleTokenAddress} />
                    <div className="col-span-12 md:col-span-6 2xl:col-span-3">
                        <PrivateKeyInput title="Zombie Wallet" description="This wallet distributes SOL to all wallets." />
                    </div>
                </div>
                <div className="w-full mt-3 grid grid-cols-12 gap-3">
                    <NormalInput title="Target Volume Amount" value={targetVolume} action={handleTargetVolume} />
                    <NormalInput title="Delay Time (s)" value={deplayTime} action={handleDelayTime} />
                    <NormalInput title="Buy Percent" value={buyPercent} action={handleBuyPercent} />
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
                            onClick={() => setNewWalletDialog(true)}
                        >
                            <IoIosAddCircle className="text-lg text-green-normal" />
                            Generate Wallets
                        </button>
                        <button
                            className="pl-3 pr-4 h-button rounded-[4px] justify-center items-center gap-1 inline-flex bg-[#1A1A37] active:scale-95 transition duration-90 ease-in-out transform focus:outline-none text-xs font-medium text-center text-white uppercase disabled:text-gray-border disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                            onClick={handleDownloadWallets}
                        >
                            <IoIosDownload className="text-lg text-green-normal" />
                            Download Wallets
                        </button>
                        <button
                            className="pl-3 pr-4 h-button rounded-[4px] justify-center items-center gap-1 inline-flex bg-[#1A1A37] active:scale-95 transition duration-90 ease-in-out transform focus:outline-none text-xs font-medium text-center text-white uppercase disabled:text-gray-border disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                            onClick={handleRefresh}
                        >
                            <IoIosRefresh className="text-lg text-green-normal" />
                            Refresh
                        </button>
                    </div>
                </div>
                <div className="w-full overflow-visible font-sans">
                    <div className="flex flex-col w-full h-full text-white bg-transparent bg-clip-border">
                        <div className="relative border border-gray-highlight rounded-lg">
                            <div className={`h-[calc(100vh-495px)] 2xl:h-[calc(100vh-425px)] overflow-y-auto`}>
                                {(!currentProject.wallets || currentProject.wallets.length === 0) &&
                                    <div className="absolute flex items-center justify-center gap-2 my-3 text-base font-bold text-center uppercase -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 text-gray-border">
                                        <FaExclamationTriangle className="text-sm opacity-50 text-green-normal" /> No Wallet
                                    </div>
                                }
                                <table className="min-w-[700px] w-full text-xs">
                                    <thead className=" text-gray-normal">
                                        <tr className="uppercase h-7 bg-[#1A1A37] sticky top-0 z-10">
                                            <th className="w-8 text-center">
                                                <div className="flex items-center justify-center">
                                                    <input type="checkbox"
                                                        className="w-4 h-4 outline-none bg-gray-highlight opacity-20 accent-green-normal ring-0 rounded-lg"
                                                        checked={walletAllChecked}
                                                        onChange={handleWalletAllChecked} 
                                                        />
                                                </div>
                                            </th>
                                            <th className="w-8">
                                                <p className="leading-none text-center">
                                                    #
                                                </p>
                                            </th>
                                            <th className="">
                                                <p className="leading-none text-center">
                                                    Address
                                                </p>
                                            </th>
                                            <th className="">
                                                <p className="leading-none text-left">
                                                    SOL Balance
                                                </p>
                                            </th>
                                            <th className="">
                                                <p className="leading-none text-left">
                                                    Token Balance
                                                </p>
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
                                                        <td className="">
                                                            <p className="leading-none text-center text-gray-normal">
                                                                {index + 1}
                                                            </p>
                                                        </td>
                                                        <td className="">
                                                            <div className="flex items-center justify-center gap-1 font-sans antialiased font-normal leading-normal text-gray-normal">
                                                                <p className="bg-transparent border-none outline-none">
                                                                    {ellipsisAddress(item.address, 12)}
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
                                                    </tr>
                                                );
                                            })
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="relative flex items-center justify-between h-full gap-3 mt-3 text-white bg-transparent bg-clip-border">
                    <div className="flex items-center grow">
                        <div className="font-sans text-xs uppercase text-gray-normal whitespace-nowrap">
                            Target Wallet:
                        </div>
                        <input
                            className="outline-none border border-gray-border font-sans text-white placeholder:text-gray-border text-sm px-2.5 bg-transparent w-full h-button ml-2 grow max-w-[430px]"
                            placeholder="Target Wallet Address"
                            value={targetWallet}
                            onChange={(e) => setTargetWallet(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-3">
                        <ActionButton label="Collect All SOL" action={handleCollectAllSol} />
                        <div className="w-[1px] h-6 border-r border-gray-normal opacity-40 mx-1" />
                        <ActionButton label="Start" action={handleStartBot} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default VolumeBot