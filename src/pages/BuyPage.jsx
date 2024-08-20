
import { useContext, useState, useEffect } from "react";
import { toast } from "react-toastify";
import { IoIosAddCircle, IoIosDownload } from "react-icons/io";
import { FaDatabase, FaEllipsisV, FaExclamationTriangle, FaQuestion, FaRegCopy, FaSave } from "react-icons/fa";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { Popover } from "@headlessui/react";
import BigNumber from "bignumber.js";
import {
    Keypair,
    PublicKey,
} from "@solana/web3.js";
import {
    getMint,
    getAccount,
    getAssociatedTokenAddress,
} from "@solana/spl-token";
import bs58 from "bs58";
import axios from "axios";

import ZombieDialog from "../components/Dialogs/ZombieDialog";
import NewWalletDialog from "../components/Dialogs/NewWalletDialog";
import TokenAmountDialog from "../components/Dialogs/TokenAmountDialog";
import SolAmountDialog from "../components/Dialogs/SolAmountDialog";
import SimulationDialog from "../components/Dialogs/SimulationDialog";
import { createPool } from "../utils/solana";
import { ellipsisAddress, isValidAddress } from "../utils/methods";
import { AppContext } from "../providers/AppContext";

export default function BuyPage({ className }) {
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
    console.log(currentProject)
    const { connected, publicKey, signAllTransactions } = useWallet();
    const { connection } = useConnection();

    const [copied, setCopied] = useState({});
    const [zombieDialog, setZombieDialog] = useState(false);
    const [newWalletDialog, setNewWalletDialog] = useState(false);
    const [tokenAmountDialog, setTokenAmountDialog] = useState(false);
    const [solAmountDialog, setSolAmountDialog] = useState(false);
    const [simulateData, setSimulateData] = useState({});
    const [simulateZombie, setSimulateZombie] = useState({ address: "", value: "" });
    const [simulationDialog, setSimulationDialog] = useState(false);
    const [targetWallet, setTargetWallet] = useState("");

    const [token, setToken] = useState("");
    const [tokenInfo, setTokenInfo] = useState({ decimals: "", totalSupply: "" });
    const [zombieWallet, setZombieWallet] = useState({ address: "", privateKey: "" });
    const [tokenAmount, setTokenAmount] = useState("");
    const [solAmount, setSolAmount] = useState("");

    const [walletAllChecked, setWalletAllChecked] = useState(false);
    const [walletChecked, setWalletChecked] = useState([]);
    const [walletSolBalance, setWalletSolBalance] = useState([]);
    const [walletTokenBalance, setWalletTokenBalance] = useState([]);
    const [walletTokenAmount, setWalletTokenAmount] = useState([]);
    const [walletSolAmount, setWalletSolAmount] = useState([]);
    const [teamWalletAllChecked, setTeamWalletAllChecked] = useState(false);
    const [teamWalletChecked, setTeamWalletChecked] = useState([]);
    const [teamWalletSolBalance, setTeamWalletSolBalance] = useState([]);
    const [teamWalletTokenBalance, setTeamWalletTokenBalance] = useState([]);
    const [teamWalletTokenAmount, setTeamWalletTokenAmount] = useState([]);
    const [isDragging, setIsDragging] = useState(false);

    const disabled = !currentProject.token || currentProject.status !== "OPEN" || !user._id || user.role === "admin";

    useEffect(() => {
        if (currentProject.token || currentProject.zombie) {
            setToken(currentProject.token.address);
            setZombieWallet({
                address: currentProject.zombie,
                privateKey: "",
            });
        }
        else {
            setToken("");
            setZombieWallet({ address: "", privateKey: "" });
            setWalletAllChecked(false);
            setWalletChecked([]);
        }
    }, [currentProject.token, currentProject.zombie]);

    useEffect(() => {
        const getTokenInfo = async (tokenAddress, connection) => {
            try {
                const mint = new PublicKey(tokenAddress);
                const mintInfo = await getMint(connection, mint);
                setTokenInfo({
                    decimals: mintInfo.decimals.toString(),
                    totalSupply: new BigNumber(mintInfo.supply.toString() + "e-" + mintInfo.decimals.toString()).toFixed(0)
                });
            }
            catch (err) {
                console.log(err);
                setTokenInfo({
                    decimals: "",
                    totalSupply: "",
                });
            }
        };

        if (connected && isValidAddress(token)) {
            getTokenInfo(token, connection);
        }
        else {
            setTokenInfo({
                decimals: "",
                totalSupply: "",
            });
        }
    }, [connected, connection, token]);

    useEffect(() => {
        const updateBalance = async (connection, tokenAddress, owner) => {
            console.log("Updating balance...", tokenAddress, owner.toBase58());
            try {
                const mint = new PublicKey(tokenAddress);
                const mintInfo = await getMint(connection, mint);
                const tokenATA = await getAssociatedTokenAddress(mint, owner);
                const tokenAccountInfo = await getAccount(connection, tokenATA);
                const balance = Number(new BigNumber(tokenAccountInfo.amount.toString() + "e-" + mintInfo.decimals.toString()).toString()).toFixed(4);
                return balance;
            }
            catch (err) {
                console.log(err);
                return "0";
            }
        };

        if (connected && isValidAddress(token)) {
            updateBalance(connection, token, publicKey).then(response => {
                setTokenAmount(response);
            });
        }
        else
            setTokenAmount("");
    }, [connected, connection, token, publicKey]);

    useEffect(() => {
        if (currentProject.wallets) {
            if (currentProject.wallets.length !== walletChecked.length) {
                const newWalletChecked = currentProject.wallets.map(() => false);
                setWalletChecked(newWalletChecked);
                setWalletAllChecked(false);
            }

            setWalletSolBalance(currentProject.wallets.map(() => "-"));
            setWalletTokenBalance(currentProject.wallets.map(() => "0"));
            setWalletTokenAmount(currentProject.wallets.map((item) => item.initialTokenAmount));
            setWalletSolAmount(currentProject.wallets.map(item => item.initialSolAmount));
        }
        else {
            setWalletSolBalance([]);
            setWalletTokenBalance([]);
            setWalletTokenAmount([]);
            setWalletSolAmount([]);
        }
    }, [currentProject.wallets, walletChecked.length]);

    useEffect(() => {
        if (currentProject.teamWallets) {
            if (currentProject.teamWallets.length !== teamWalletChecked.length) {
                const newTeamWalletChecked = currentProject.teamWallets.map(() => false);
                setTeamWalletChecked(newTeamWalletChecked);
                setTeamWalletAllChecked(false);
            }

            setTeamWalletSolBalance(currentProject.teamWallets.map(() => "-"));
            setTeamWalletTokenBalance(currentProject.teamWallets.map(() => ""));
            setTeamWalletTokenAmount(currentProject.teamWallets.map((item) => item.initialTokenAmount));
        }
        else {
            setTeamWalletSolBalance([]);
            setTeamWalletTokenBalance([]);
            setTeamWalletTokenAmount([]);
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
        if (notifyStatus.tag === "SIMULATE_COMPLETED") {
            if (notifyStatus.success) {
                toast.success("Succeed to simulate!");
                if (notifyStatus.data) {
                    setSimulateZombie(notifyStatus.data.zombie);
                    setSimulationDialog(true);
                    setSimulateData(notifyStatus.data);
                }
            }
            else {
                toast.warn(`Failed to simulate! ${notifyStatus.error ? notifyStatus.error : ""}`);
                setSimulateData({});
            }
            setOpenLoading(false);
            setNotifyStatus({ success: true, tag: "NONE" });
        }
        else if (notifyStatus.tag === "PREDISPERSE_COMPLETED") {
            if (notifyStatus.success)
                toast.success("Succeed to predisperse!");
            else
                toast.warn("Failed to predisperse tokens!");

            if (notifyStatus.project) {
                updateProject(notifyStatus.project);
                if (currentProject._id === notifyStatus.project._id)
                    setCurrentProject(notifyStatus.project);
            }

            setOpenLoading(false);
            setNotifyStatus({ success: true, tag: "NONE" });
        }
        else if (notifyStatus.tag === "DISPERSE_COMPLETED") {
            if (notifyStatus.success)
                toast.success("Succeed to disperse!");
            else
                toast.warn("Failed to disperse SOL!");

            if (notifyStatus.project) {
                updateProject(notifyStatus.project);
                if (currentProject._id === notifyStatus.project._id)
                    setCurrentProject(notifyStatus.project);
            }

            setOpenLoading(false);
            setNotifyStatus({ success: true, tag: "NONE" });
        }
        else if (notifyStatus.tag === "BUY_COMPLETED") {
            if (notifyStatus.success)
                toast.success("Succeed to enable and buy!");
            else
                toast.warn("Failed to enable and buy!");

            if (notifyStatus.project) {
                updateProject(notifyStatus.project);
                if (currentProject._id === notifyStatus.project._id)
                    setCurrentProject(notifyStatus.project);
            }
            
            setSimulateData({});
            setOpenLoading(false);
            setNotifyStatus({ success: true, tag: "NONE" });
        }
        else if (notifyStatus.tag === "DISPERSE_TOKENS_COMPLETED") {
            if (notifyStatus.success)
                toast.success("Succeed to disperse tokens!");
            else
                toast.warn("Failed to disperse tokens!");

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
            const { data } = await axios.post(`${SERVER_URL}/api/v1/project/save`,
                {
                    projectId: currentProject._id,
                    token: token,
                    zombie: zombieWallet,
                    wallets: wallets,
                    platform: 'raydium'
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        "MW-USER-ID": localStorage.getItem("access-token"),
                    },
                }
            );

            updateProject(data.project);
            if (currentProject._id === data.project._id)
                setCurrentProject(data.project);
            toast.success("Project has been saved successfully");
        }
        catch (err) {
            console.log(err);
            toast.warn("Failed to save project!");
        }
        setOpenLoading(false);
    };

    const handleOKZombiePrivateKey = (key) => {
        try {
            const keypair = Keypair.fromSecretKey(bs58.decode(key));
            setZombieWallet({ address: keypair.publicKey.toBase58(), privateKey: key });
        }
        catch (err) {
            console.log(err);
            toast.warn("Invalid private key!");
        }

        setZombieDialog(false);
    };

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

    const handleOKMinMaxTokenAmounts = (minAmount, maxAmount) => {
        function getRandomNumber(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        try {
            let minX = -1;
            let maxX = -1;
            if (minAmount.charAt(minAmount.length - 1) === '%') {
                minX = Number(minAmount.slice(0, minAmount.length - 1));
                minX = Number(tokenInfo.totalSupply) * minX / 100;
            }
            else
                minX = Number(minAmount);

            if (isNaN(minX) || minX <= 0) {
                toast.warn("Invalid minimum amount");
                return;
            }

            if (maxAmount.charAt(maxAmount.length - 1) === '%') {
                maxX = Number(maxAmount.slice(0, maxAmount.length - 1));
                maxX = Number(tokenInfo.totalSupply) * maxX / 100;
            }
            else
                maxX = Number(maxAmount);

            if (isNaN(maxX) || maxX <= 0) {
                toast.warn("Invalid maximum amount");
                return;
            }

            if (minX > maxX) {
                const t = minX;
                minX = maxX;
                maxX = t;
            }

            console.log("Min:", minX, "Max:", maxX);

            let newWalletTokenAmount = [...walletTokenAmount];
            for (let i = 0; i < newWalletTokenAmount.length; i++) {
                if (walletChecked[i])
                    newWalletTokenAmount[i] = getRandomNumber(minX, maxX);
            }
            setWalletTokenAmount(newWalletTokenAmount);
        }
        catch (err) {
            console.log(err);
            toast.warn("Invalid minimum/maximum amount");
        }

        setTokenAmountDialog(false);
    };

    const handleSetTokenAmounts = () => {
        const selectedWallets = walletChecked.filter((item) => item === true);
        if (selectedWallets.length === 0) {
            toast.warn("Please select wallets to set token amount");
            return;
        }
        setTokenAmountDialog(true);
    };

    const handleOKSolAmount = (solAmount) => {
        let amount = -1;
        try {
            amount = Number(solAmount);
        }
        catch (err) {
            console.log(err);
        }

        if (isNaN(amount) || amount < 0) {
            toast.warn("Invalid SOL amount");
            return;
        }

        let newWalletSolAmount = [...walletSolAmount];
        for (let i = 0; i < newWalletSolAmount.length; i++) {
            if (walletChecked[i])
                newWalletSolAmount[i] = amount;
        }
        setWalletSolAmount(newWalletSolAmount);
        setSolAmountDialog(false);
    };

    const handleSetSOLAmounts = () => {
        const selectedWallets = walletChecked.filter((item) => item === true);
        if (selectedWallets.length === 0) {
            toast.warn("Please select wallets to set additional SOL amount");
            return;
        }
        setSolAmountDialog(true);
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
    };

    const handleDoneSimulate = () => {
        setSimulationDialog(false);
        if (simulateData.projectId === currentProject._id) {
            let newCurrentProject = { ...currentProject };
            newCurrentProject.token = simulateData.token;
            newCurrentProject.zombie = simulateData.zombie.address;
            for (let i = 0; i < simulateData.wallets.length; i++) {
                for (let j = 0; j < newCurrentProject.wallets.length; j++) {
                    if (simulateData.wallets[i].address === newCurrentProject.wallets[j].address) {
                        newCurrentProject.wallets[j].initialTokenAmount = simulateData.wallets[i].initialTokenAmount;
                        newCurrentProject.wallets[j].initialSolAmount = simulateData.wallets[i].initialSolAmount;
                        newCurrentProject.wallets[j].sim = simulateData.wallets[i].sim;
                        break;
                    }
                }
            }
            updateProject(newCurrentProject);
            if (currentProject._id === newCurrentProject._id)
                setCurrentProject(newCurrentProject);
        }
    };

    const handleSimulate = async () => {
        if (!currentProject.token)
            return;

        if (!connected) {
            toast.warn("Please connect wallet!");
            return;
        }

        if (!isValidAddress(token)) {
            toast.warn("Invalid token address!");
            return;
        }

        if (!isValidAddress(zombieWallet.address)) {
            toast.warn("Invalid zombie wallet!");
            return;
        }

        if (tokenAmount === "" || Number(tokenAmount.replaceAll(",", "")) <= 0) {
            toast.warn("Invalid token amount!");
            return;
        }

        if (solAmount === "" || Number(solAmount) <= 0) {
            toast.warn("Invalid SOL amount!");
            return;
        }

        const validWalletChecked = walletChecked.filter(item => item === true);
        if (validWalletChecked.length === 0) {
            toast.warn("Please check wallets to buy tokens");
            return;
        }

        let wallets = [];
        for (let i = 0; i < currentProject.wallets.length; i++) {
            if (!walletChecked[i])
                continue;

            const initialTokenAmount = Number(walletTokenAmount[i].toString().replaceAll(",", ""));
            if (isNaN(initialTokenAmount) || initialTokenAmount <= 0) {
                toast.warn(`Wallet #${i + 1}: Invalid token amount`);
                return;
            }

            const initialSolAmount = Number(walletSolAmount[i].toString().replaceAll(",", ""));
            if (isNaN(initialSolAmount) || initialSolAmount < 0) {
                toast.warn(`Wallet #${i + 1}: Invalid additional SOL amount`);
                return;
            }

            wallets = [
                ...wallets,
                {
                    address: currentProject.wallets[i].address,
                    initialTokenAmount: initialTokenAmount,
                    initialSolAmount: initialSolAmount,
                }
            ];
        }

        try {
            setLoadingPrompt("Simulating...");
            setOpenLoading(true);
            await axios.post(`${SERVER_URL}/api/v1/project/simulate`,
                {
                    projectId: currentProject._id,
                    token,
                    tokenAmount,
                    solAmount,
                    zombie: zombieWallet,
                    wallets,
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
            toast.warn("Failed to simulate!");
            setOpenLoading(false);
        }
    };

    const handlePreDisperseToken = async () => {
        if (!currentProject.token)
            return;

        if (!connected) {
            toast.warn("Please connect wallet!");
            return;
        }

        if (!isValidAddress(token)) {
            toast.warn("Invalid token address!");
            return;
        }

        if (!isValidAddress(zombieWallet.address)) {
            toast.warn("Invalid zombie wallet!");
            return;
        }

        const validWalletChecked = walletChecked.filter(item => item === true);
        if (validWalletChecked.length === 0) {
            toast.warn("Please check wallets to buy tokens");
            return;
        }

        if (!simulateData.zombie) {
            toast.warn("Please simulate first");
            return;
        }

        let wallets = [];
        for (let i = 0; i < currentProject.wallets.length; i++) {
            if (!walletChecked[i])
                continue;

            const initialTokenAmount = Number(walletTokenAmount[i].toString().replaceAll(",", ""));
            if (isNaN(initialTokenAmount) || initialTokenAmount <= 0) {
                toast.warn(`Wallet #${i + 1}: Invalid token amount`);
                return;
            }

            const initialSolAmount = Number(walletSolAmount[i].toString().replaceAll(",", ""));
            if (isNaN(initialSolAmount) || initialSolAmount < 0) {
                toast.warn(`Wallet #${i + 1}: Invalid additional SOL amount`);
                return;
            }

            wallets = [
                ...wallets,
                {
                    address: currentProject.wallets[i].address,
                    initialTokenAmount: initialTokenAmount,
                    initialSolAmount: initialSolAmount,
                }
            ];
        }

        let simulated = true;
        if (simulateData.projectId !== currentProject._id) {
            simulated = false;
            console.log("Project id mismatch!");
        }

        if (simulated && (!simulateData.token || simulateData.token.address.toUpperCase() !== token.toUpperCase())) {
            simulated = false;
            console.log("Token address mismatch!");
        }

        if (simulated &&
            (!simulateData.zombie ||
                simulateData.zombie.address.toUpperCase() !== zombieWallet.address.toUpperCase())) {
            simulated = false;
            console.log("Zombie wallet mismatch!");
        }

        if (simulated && simulateData.wallets) {
            for (let i = 0; i < simulateData.wallets.length; i++) {
                let matched = false;
                const solAmount0 = simulateData.wallets[i].initialSolAmount.toString() === "" ? "0" : simulateData.wallets[i].initialSolAmount.toString();
                for (let j = 0; j < walletTokenAmount.length; j++) {
                    if (simulateData.wallets[i].address.toUpperCase() === currentProject.wallets[j].address.toUpperCase()) {
                        matched = true;
                        const solAmount1 = walletSolAmount[j].toString() === "" ? "0" : walletSolAmount[j].toString();
                        if (!walletChecked[j] ||
                            simulateData.wallets[i].initialTokenAmount.toString() !== walletTokenAmount[j].toString() ||
                            solAmount0 !== solAmount1) {
                            simulated = false;
                            console.log("Token amount or SOL amount mismatch!",
                                simulateData.wallets.length, walletSolAmount.length,
                                simulateData.wallets[i].initialSolAmount, walletSolAmount[j],
                                simulateData.wallets[i].initialTokenAmount, walletTokenAmount[j]);
                        }
                        break;
                    }
                }
                if (!matched) {
                    simulated = false;
                    console.log("No matched!");
                }
                if (!simulated)
                    break;
            }
        }
        else
            simulated = false;

        if (!simulated) {
            toast.warn("Please simulate first");
            return;
        }

        if (simulateData.zombie.value !== "0") {
            toast.warn("Please send enough SOL to zombie wallet and simulate again");
            return;
        }

        try {
            setLoadingPrompt("Predispersing Tokens...");
            setOpenLoading(true);

            await axios.post(`${SERVER_URL}/api/v1/project/predisperse-tokens`,
                {
                    projectId: currentProject._id,
                    simulateData,
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
            toast.warn("Failed to simulate!");
            setOpenLoading(false);
        }
    };

    const handleDisperseSOL = async () => {
        if (!currentProject.token)
            return;

        if (!connected) {
            toast.warn("Please connect wallet!");
            return;
        }

        if (!isValidAddress(token)) {
            toast.warn("Invalid token address!");
            return;
        }

        if (!isValidAddress(zombieWallet.address)) {
            toast.warn("Invalid zombie wallet!");
            return;
        }

        if (tokenAmount === "" || Number(tokenAmount.replaceAll(",", "")) <= 0) {
            toast.warn("Invalid token amount!");
            return;
        }

        if (solAmount === "" || Number(solAmount) <= 0) {
            toast.warn("Invalid SOL amount!");
            return;
        }

        const validWalletChecked = walletChecked.filter(item => item === true);
        if (validWalletChecked.length === 0) {
            toast.warn("Please check wallets to buy tokens");
            return;
        }

        if (!simulateData.zombie) {
            toast.warn("Please simulate first");
            return;
        }

        let wallets = [];
        for (let i = 0; i < currentProject.wallets.length; i++) {
            if (!walletChecked[i])
                continue;

            const initialTokenAmount = Number(walletTokenAmount[i].toString().replaceAll(",", ""));
            if (isNaN(initialTokenAmount) || initialTokenAmount <= 0) {
                toast.warn(`Wallet #${i + 1}: Invalid token amount`);
                return;
            }

            const initialSolAmount = Number(walletSolAmount[i].toString().replaceAll(",", ""));
            if (isNaN(initialSolAmount) || initialSolAmount < 0) {
                toast.warn(`Wallet #${i + 1}: Invalid additional SOL amount`);
                return;
            }

            wallets = [
                ...wallets,
                {
                    address: currentProject.wallets[i].address,
                    initialTokenAmount: initialTokenAmount,
                    initialSolAmount: initialSolAmount,
                }
            ];
        }

        let simulated = true;
        if (simulateData.projectId !== currentProject._id) {
            simulated = false;
            console.log("Project id mismatch!");
        }

        if (simulated && (!simulateData.token || simulateData.token.address.toUpperCase() !== token.toUpperCase())) {
            simulated = false;
            console.log("Token address mismatch!");
        }

        if (simulated &&
            (!simulateData.zombie ||
                simulateData.zombie.address.toUpperCase() !== zombieWallet.address.toUpperCase())) {
            simulated = false;
            console.log("Zombie wallet mismatch!");
        }

        if (simulated && simulateData.wallets) {
            for (let i = 0; i < simulateData.wallets.length; i++) {
                let matched = false;
                const solAmount0 = simulateData.wallets[i].initialSolAmount.toString() === "" ? "0" : simulateData.wallets[i].initialSolAmount.toString();
                for (let j = 0; j < walletTokenAmount.length; j++) {
                    if (simulateData.wallets[i].address.toUpperCase() === currentProject.wallets[j].address.toUpperCase()) {
                        matched = true;
                        const solAmount1 = walletSolAmount[j].toString() === "" ? "0" : walletSolAmount[j].toString();
                        if (!walletChecked[j] ||
                            simulateData.wallets[i].initialTokenAmount.toString() !== walletTokenAmount[j].toString() ||
                            solAmount0 !== solAmount1) {
                            simulated = false;
                            console.log("Token amount or SOL amount mismatch!",
                                simulateData.wallets.length, walletSolAmount.length,
                                simulateData.wallets[i].initialSolAmount, walletSolAmount[j],
                                simulateData.wallets[i].initialTokenAmount, walletTokenAmount[j]);
                        }
                        break;
                    }
                }
                if (!matched) {
                    simulated = false;
                    console.log("No matched!");
                }
                if (!simulated)
                    break;
            }
        }
        else
            simulated = false;

        if (!simulated) {
            toast.warn("Please simulate first");
            return;
        }

        if (simulateData.zombie.value !== "0") {
            toast.warn("Please send enough SOL to zombie wallet and simulate again");
            return;
        }

        try {
            setLoadingPrompt("Dispersing SOL...");
            setOpenLoading(true);

            await axios.post(`${SERVER_URL}/api/v1/project/disperse`,
                {
                    projectId: currentProject._id,
                    simulateData,
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
            toast.warn("Failed to simulate!");
            setOpenLoading(false);
        }
    };

    const handleBuyTokens = async () => {
        if (!currentProject.token)
            return;

        if (!connected) {
            toast.warn("Please connect wallet!");
            return;
        }

        if (!isValidAddress(token)) {
            toast.warn("Invalid token address!");
            return;
        }

        if (!isValidAddress(zombieWallet.address)) {
            toast.warn("Invalid zombie wallet!");
            return;
        }

        const validWalletChecked = walletChecked.filter(item => item === true);
        if (validWalletChecked.length === 0) {
            toast.warn("Please check wallets to buy tokens");
            return;
        }

        if (!simulateData.zombie) {
            toast.warn("Please simulate first");
            return;
        }

        if (simulateData.zombie.value !== "0") {
            toast.warn("Please send enough SOL to zombie wallet and simulate again");
            return;
        }

        console.log("SimulateData:", simulateData);

        let simulated = true;
        if (simulateData.projectId !== currentProject._id) {
            simulated = false;
            console.log("Project id mismatch!");
        }

        if (simulated && (!simulateData.token || simulateData.token.address.toUpperCase() !== token.toUpperCase())) {
            simulated = false;
            console.log("Token address mismatch!");
        }

        if (simulated &&
            (!simulateData.zombie ||
                simulateData.zombie.address.toUpperCase() !== zombieWallet.address.toUpperCase())) {
            simulated = false;
            console.log("Zombie wallet mismatch!");
        }

        if (simulated && simulateData.wallets) {
            for (let i = 0; i < simulateData.wallets.length; i++) {
                let matched = false;
                const solAmount0 = simulateData.wallets[i].initialSolAmount.toString() === "" ? "0" : simulateData.wallets[i].initialSolAmount.toString();
                for (let j = 0; j < walletTokenAmount.length; j++) {
                    if (simulateData.wallets[i].address.toUpperCase() === currentProject.wallets[j].address.toUpperCase()) {
                        matched = true;
                        const solAmount1 = walletSolAmount[j].toString() === "" ? "0" : walletSolAmount[j].toString();
                        if (!walletChecked[j] ||
                            simulateData.wallets[i].initialTokenAmount.toString() !== walletTokenAmount[j].toString() ||
                            solAmount0 !== solAmount1) {
                            simulated = false;
                            console.log("Token amount or SOL amount mismatch!");
                        }
                        break;
                    }
                }
                if (!matched) {
                    simulated = false;
                    console.log("No matched!");
                }
                if (!simulated)
                    break;
            }
        }
        else
            simulated = false;

        if (!simulated) {
            toast.warn("Please simulate first");
            return;
        }

        const solBalance = new BigNumber(await connection.getBalance(publicKey));
        const solRequired = new BigNumber((Number(solAmount) + 1).toString() + "e9");
        
        console.log("====solBalance: ", solBalance)
        console.log("====solRequired: ", solRequired)
        
        if (solBalance.lt(solRequired)) {
            toast.warn("Insufficient SOL in the owner's wallet");
            return;
        }

        try {
            setLoadingPrompt("Signing with owner...");
            setOpenLoading(true);

            const transactions = await createPool(connection,
                token,
                tokenAmount.replaceAll(",", ""),
                "So11111111111111111111111111111111111111112",
                solAmount.toString(),
                simulateData.poolInfo.marketId,
                publicKey);
            const signedTxns = await signAllTransactions(transactions);
            const txnsBase64 = signedTxns.map(item => Buffer.from(item.serialize()).toString("base64"));

            setLoadingPrompt("Enabling and Buying Tokens...");
            await axios.post(`${SERVER_URL}/api/v1/project/buy`,
                {
                    projectId: currentProject._id,
                    signedTransactions: txnsBase64,
                    simulateData,
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
            toast.warn("Failed to enable and buy!");
            setOpenLoading(false);
        }
    };

    const handleDisperseTokens = async () => {
        if (!currentProject.token)
            return;

        setLoadingPrompt("Dispersing tokens...");
        setOpenLoading(true);
        try {
            await axios.post(`${SERVER_URL}/api/v1/project/disperse-tokens`,
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
        }
        catch (err) {
            console.log(err);
            toast.warn("Failed to disperse tokens!");
            setOpenLoading(false);
        }
    };

    return (
        <div className={`${className} flex flex-col text-white rounded-[4px] border border-gray-highlight p-4 pb-3`}>
            <ZombieDialog isOpen={zombieDialog} onOK={handleOKZombiePrivateKey} onCancel={() => setZombieDialog(false)} />
            <NewWalletDialog isOpen={newWalletDialog} onOK={handleOKNewWallets} onCancel={() => setNewWalletDialog(false)} />
            <TokenAmountDialog isOpen={tokenAmountDialog} onOK={handleOKMinMaxTokenAmounts} onCancel={() => setTokenAmountDialog(false)} />
            <SolAmountDialog isOpen={solAmountDialog} onOK={handleOKSolAmount} onCancel={() => setSolAmountDialog(false)} />
            <SimulationDialog isOpen={simulationDialog} zombie={simulateZombie} onClose={handleDoneSimulate} />
            <div className="flex flex-col">
                <div className="flex items-start justify-between w-full h-auto">
                    <div className="flex items-center font-sans text-xs font-medium text-white">
                        <div className="font-bold uppercase">Buy Token </div>
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
                    <div className="flex">
                        <button
                            className={`rounded-sm cursor-pointer w-9 h-9 bg-green-normal ${disabled ? "!bg-gray-highlight text-gray-normal" : "active:scale-95 transition duration-90 ease-in-out transform "}`}
                            disabled={disabled}
                            onClick={handleSaveProject}>
                            <FaSave className="w-4 h-4 m-auto" />
                        </button>
                    </div>
                </div>
                <div className="w-full mt-[6px] grid grid-cols-12 gap-3">
                    <div className="col-span-12 md:col-span-6 2xl:col-span-3">
                        <div className="font-sans text-xs uppercase text-gray-normal">
                            Token Address<span className="pl-1 text-green-normal">*</span>
                        </div>
                        <input
                            className="outline-none border border-gray-border font-sans text-white placeholder:text-gray-border text-sm px-2.5 bg-transparent w-full h-button mt-1 rounded-lg"
                            placeholder="Enter Address"
                            disabled={disabled}
                            value={token}
                            onChange={(e) => setToken(e.target.value)}
                        />
                    </div>
                    <div className="col-span-12 md:col-span-6 2xl:col-span-3">
                        <Popover className="relative flex items-center font-sans text-xs uppercase text-gray-normal">
                            <div className="whitespace-nowrap">Zombie Wallet<span className="pl-1 text-green-normal">*</span></div>
                            <Popover.Button className="border border-green-normal text-[6px] flex items-center justify-center cursor-pointer rounded-full w-3 h-3 ml-1">
                                <FaQuestion className="text-green-normal" />
                            </Popover.Button>
                            <Popover.Panel className="absolute z-10 px-2 py-1 text-xs text-center text-white normal-case border rounded-sm bg-gray-highlight bottom-5 border-green-normal">
                                This wallet distributes SOL to all wallets.
                            </Popover.Panel>
                        </Popover>
                        <div className={`flex items-center justify-between outline-none border border-gray-border text-gray-normal font-sans text-sm pl-2.5 bg-transparent w-full h-button mt-1 pr-1 ${disabled && "text-gray-border border-gray-highlight"}`}>
                            <div className={`w-full pr-1 truncate ${zombieWallet.address && "text-white"}`}>
                                {
                                    zombieWallet.address ?
                                        ellipsisAddress(zombieWallet.address) :
                                        "NOT SET"
                                }
                            </div>
                            <div className="flex items-center text-base">
                                {zombieWallet.address && !copied["zombie_wallet_0"] &&
                                    <FaRegCopy className="w-4 cursor-pointer text-gray-normal hover:text-green-normal" onClick={() => copyToClipboard("zombie_wallet_0", zombieWallet.address)} />
                                }
                                {zombieWallet.address && copied["zombie_wallet_0"] &&
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                }
                                {!disabled && <FaEllipsisV className="w-4 ml-1 cursor-pointer text-gray-normal hover:text-green-normal" onClick={() => setZombieDialog(true)} />}
                            </div>
                        </div>
                    </div>
                    <div className="col-span-12 md:col-span-6 2xl:col-span-3">
                        <div className="font-sans text-xs uppercase text-gray-normal">
                            Token Amount in LP<span className="pl-1 text-green-normal">*</span>
                        </div>
                        <input
                            className="outline-none border border-gray-border font-sans text-white placeholder:text-gray-border text-sm px-2.5 bg-transparent w-full h-button mt-1 rounded-lg"
                            placeholder="Enter initial token amount"
                            disabled={disabled}
                            value={tokenAmount}
                            onChange={(e) => setTokenAmount(e.target.value)}
                        />
                    </div>
                    <div className="col-span-12 md:col-span-6 2xl:col-span-3">
                        <div className="font-sans text-xs uppercase text-gray-normal">
                            SOL Amount in LP<span className="pl-1 text-green-normal">*</span>
                        </div>
                        <input
                            className="outline-none border border-gray-border font-sans text-white placeholder:text-gray-border text-sm px-2.5 bg-transparent w-full h-button mt-1 rounded-lg"
                            placeholder="Enter initial SOL amount"
                            disabled={disabled}
                            value={solAmount}
                            onChange={(e) => setSolAmount(e.target.value)}
                        />
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
                            disabled={disabled}
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
                            disabled={disabled}
                            onClick={handleSetTokenAmounts}
                        >
                            <FaDatabase className="text-sm text-green-normal" />
                            Set token amount
                        </button>
                        <button
                            className="pl-3 pr-4 h-button rounded-[4px] justify-center items-center gap-1 inline-flex bg-[#1A1A37] active:scale-95 transition duration-90 ease-in-out transform focus:outline-none text-xs font-medium text-center text-white uppercase disabled:text-gray-border disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                            disabled={disabled}
                            onClick={handleSetSOLAmounts}
                        >
                            <img className="w-4 h-4 text-green-normal" src="/assets/sol.svg" alt="sol" />
                            Set SOL amount
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
                            <div className={`${currentProject.teamWallets ? "h-[calc(100vh-540px)] 2xl:h-[calc(100vh-555px)]" : "h-[calc(100vh-435px)] 2xl:h-[calc(100vh-365px)]"} overflow-y-auto`}>
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
                                                        onChange={handleWalletAllChecked} />
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
                                            <th className="w-[15%]">
                                                <p className="leading-none text-center">
                                                    Tokens to buy
                                                </p>
                                            </th>
                                            <th className="w-[15%]">
                                                <p className="leading-none text-center">
                                                    Additional SOL
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
                                                        <td className="text-center">
                                                            <input
                                                                className="outline-none border border-gray-highlight font-medium text-gray-normal placeholder:text-gray-border text-xs px-2.5 bg-transparent text-center w-[150px] h-[26px] rounded-lg"
                                                                disabled={disabled}
                                                                value={walletTokenAmount[index]}
                                                                onChange={(e) => handleWalletChanged(index, "token_amount", e.target.value)} />
                                                        </td>
                                                        <td className="text-center">
                                                            <input
                                                                className="outline-none border border-gray-highlight font-medium text-gray-normal placeholder:text-gray-border text-xs px-2.5 bg-transparent text-center w-[100px] h-[26px] rounded-lg"
                                                                disabled={disabled}
                                                                value={walletSolAmount[index]}
                                                                onChange={(e) => handleWalletChanged(index, "sol_amount", e.target.value)} />
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        {currentProject.teamWallets &&
                            (
                                <div className="relative mt-[5px] border border-gray-highlight rounded-lg">
                                    <div className="absolute -left-[23px] top-[8px] z-10 text-xxs text-center text-white font-bold uppercase -rotate-90">Team</div>
                                    <div className="h-[190px] overflow-y-auto">
                                        <table className="w-full text-xs min-w-[700px]">
                                            <thead className=" text-gray-normal">
                                                <tr className="uppercase bg-[#1A1A37] sticky top-0 z-10 h-7">
                                                    <th className="w-8 text-center">
                                                        <div className="flex items-center justify-center">
                                                            <input type="checkbox"
                                                                className="w-4 h-4 outline-none bg-gray-highlight opacity-20 accent-green-normal ring-0 rounded-lg"
                                                                checked={teamWalletAllChecked}
                                                                onChange={handleTeamWalletAllChecked} />
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
                                                    <th className="w-[15%]">
                                                        <p className="leading-none text-center">
                                                            Tokens to buy
                                                        </p>
                                                    </th>
                                                    <th className="w-[15%]">
                                                        <p className="leading-none text-center">
                                                            Additional SOL
                                                        </p>
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
                                                                <td className="">
                                                                    <p className="leading-none text-center text-gray-normal">
                                                                        {index + 1}
                                                                    </p>
                                                                </td>
                                                                <td className="">
                                                                    <div className="flex items-center justify-center gap-1 font-sans antialiased font-normal leading-normal text-gray-normal">
                                                                        <p className="bg-transparent border-none outline-none">
                                                                            {ellipsisAddress(item.address, true)}
                                                                            {/* {item.address} */}
                                                                        </p>
                                                                        {
                                                                            copied["team_wallet_" + index] ?
                                                                                (<svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                                                </svg>) :
                                                                                (<FaRegCopy className="w-3 h-3 transition ease-in-out transform cursor-pointer active:scale-95 duration-90" onClick={() => copyToClipboard("team_wallet_" + index, item.address)} />)
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
                                                                        className="outline-none border border-gray-highlight font-medium text-gray-normal placeholder:text-gray-border text-xs px-2.5 bg-transparent text-center w-[150px] h-[26px] rounded-lg"
                                                                        disabled={disabled}
                                                                        value={teamWalletTokenAmount[index]} />
                                                                </td>
                                                                <td className="text-center">
                                                                    <p className="leading-none text-center text-gray-normal" />
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
                            className="outline-none border border-gray-border font-sans text-white placeholder:text-gray-border text-sm px-2.5 bg-transparent w-full h-button ml-2 grow max-w-[430px]"
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
                        <div className="w-[1px] h-6 border-r border-gray-normal opacity-40 mx-1"></div>
                        <button
                            className="font-sans text-xs font-medium text-center text-white uppercase px-6 h-10 rounded-[4px] justify-center items-center gap-2.5 bg-green-normal active:scale-95 transition duration-90 ease-in-out transform focus:outline-none disabled:opacity-50 disabled:transform-none disabled:cursor-not-allowed"
                            disabled={disabled}
                            onClick={handleSimulate}>
                            Simulate
                        </button>
                        <button
                            className="font-sans text-xs font-medium text-center text-white uppercase px-6 h-10 rounded-[4px] justify-center items-center gap-2.5 bg-green-normal active:scale-95 transition duration-90 ease-in-out transform focus:outline-none disabled:opacity-50 disabled:transform-none disabled:cursor-not-allowed"
                            disabled={disabled}
                            onClick={handleDisperseSOL}>
                            Disperse SOL
                        </button>
                        <button
                            className="font-sans text-xs font-medium text-center text-white uppercase px-6 h-10 rounded-[4px] justify-center items-center gap-2.5 bg-green-normal active:scale-95 transition duration-90 ease-in-out transform focus:outline-none disabled:opacity-50 disabled:transform-none disabled:cursor-not-allowed"
                            disabled={disabled}
                            onClick={handleBuyTokens}>
                            Enable & Buy
                        </button>
                        <button
                            className="font-sans text-xs font-medium text-center text-white uppercase px-6 h-10 rounded-[4px] justify-center items-center gap-2.5 bg-green-normal active:scale-95 transition duration-90 ease-in-out transform focus:outline-none disabled:opacity-50 disabled:transform-none disabled:cursor-not-allowed"
                            onClick={handleDisperseTokens}>
                            Disperse Tokens
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
