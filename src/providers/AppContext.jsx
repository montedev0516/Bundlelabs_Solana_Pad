import { createContext, useEffect, useState } from "react";

import { toast } from "react-toastify";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { getMint, getAccount, getAssociatedTokenAddress } from "@solana/spl-token";
import BigNumber from "bignumber.js";
import axios from "axios";
import io from 'socket.io-client';
import { useLocation, useNavigate } from "react-router-dom";
import { isValidAddress } from "../utils/methods";
import { getTokenListByOwner } from "../utils/solana";

const SERVER_URL = process.env.REACT_APP_SERVER_URL;
const BOT_SERVER_URL = process.env.REACT_APP_BOT_SERVER_URL;

export const AppContext = createContext(null);

const AppProvider = ({children}) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { connection } = useConnection();
    const { connected, publicKey } = useWallet();

    const [loadingPrompt, setLoadingPrompt] = useState("");
    const [openLoading, setOpenLoading] = useState(false);

    const [user, setUser] = useState({});
    const [users, setUsers] = useState([]);
    const [projects, setProjects] = useState([]);
    const [currentProject, setCurrentProject] = useState({});
    const [logs, setLogs] = useState([]);
    const [assets, setAssets] = useState([]);
    const [webSocket, setWebSocket] = useState(null);
    const [notifyStatus, setNotifyStatus] = useState({ success: true, tag: "NONE" });
    const [extraWallets, setExtraWallets] = useState([]);
    const [emails, setEmails] = useState([]);
    const [jitoSigners, setJitoSigners] = useState([]);
    const [walletBalanceData, setWalletBalanceData] = useState({ address: "", token: [], sol: [] });
    const [teamWalletBalanceData, setTeamWalletBalanceData] = useState({ address: "", token: [], sol: [] });

    const openWebSocket = (userId) => {
        console.log("Starting websocket...");
        const ws = new io(SERVER_URL);
        console.log("WS: ", ws)
        ws.on("connect", () => {
            console.log('WebSocket connection established');
            ws.emit("NEW_USER", userId);
        });

        ws.on("BUY_PENDING", async (value) => {
            setNotifyStatus({ success: true, tag: "BUY_PENDING" });
        });

        ws.on("SIMULATE_COMPLETED", async (value) => {
            const m = JSON.parse(value);
            if (m.message === "OK")
                setNotifyStatus({ success: true, tag: "SIMULATE_COMPLETED", data: m.data });
            else
                setNotifyStatus({ success: false, tag: "SIMULATE_COMPLETED", error: m.error });
        });

        ws.on("DISPERSE_COMPLETED", async (value) => {
            const m = JSON.parse(value);
            if (m.message === "OK")
                setNotifyStatus({ success: true, tag: "DISPERSE_COMPLETED", project: m.project });
            else
                setNotifyStatus({ success: false, tag: "DISPERSE_COMPLETED" });
        });

        ws.on("PREDISPERSE_COMPLETED", async (value) => {
            const m = JSON.parse(value);
            if (m.message === "OK")
                setNotifyStatus({ success: true, tag: "PREDISPERSE_COMPLETED", project: m.project });
            else
                setNotifyStatus({ success: false, tag: "PREDISPERSE_COMPLETED" });
        });

        ws.on("BUY_COMPLETED", async (value) => {
            const m = JSON.parse(value);
            if (m.message === "OK")
                setNotifyStatus({ success: true, tag: "BUY_COMPLETED", project: m.project });
            else
                setNotifyStatus({ success: false, tag: "BUY_COMPLETED" });
        });

        ws.on("DISPERSE_TOKENS_COMPLETED", async (value) => {
            const m = JSON.parse(value);
            setNotifyStatus({ success: m.message === "OK", tag: "DISPERSE_TOKENS_COMPLETED", project: m.project });
        });

        ws.on("SELL_COMPLETED", async (value) => {
            const m = JSON.parse(value);
            setNotifyStatus({ success: m.message === "OK", tag: "SELL_COMPLETED", project: m.project });
        });

        ws.on("TRANSFER_COMPLETED", async (value) => {
            const m = JSON.parse(value);
            setNotifyStatus({ success: m.message === "OK", tag: "TRANSFER_COMPLETED", project: m.project });
        });

        ws.on("COLLECT_ALL_SOL", async (value) => {
            const m = JSON.parse(value);
            setNotifyStatus({ success: m.message === "OK", tag: "COLLECT_ALL_SOL", project: m.project });
        });

        ws.on("COLLECT_ALL_FEE", async (value) => {
            const m = JSON.parse(value);
            if (m.message === "OK")
                setNotifyStatus({ success: true, tag: "COLLECT_ALL_FEE" });
            else
                setNotifyStatus({ success: false, tag: "COLLECT_ALL_FEE" });
        });

        ws.on("INSPECT_LOG", (value) => {
            console.log("SERVER:", value);
        });

        ws.on("ADD_LOG", (value) => {
            const m = JSON.parse(value);
            setNotifyStatus({ success: true, tag: "ADD_LOG", log: m });
        });

        ws.on("disconnect", () => {
            console.log('WebSocket connection closed');
            // setConnected(false);
        });

        setWebSocket(ws);
    };

    const closeWebSocket = () => {
        if (webSocket)
            webSocket.close();
        setWebSocket(null);
    };

    const updateAllBalances = async (connection, token, wallets, teamWallets) => {
        console.log("Updating all balances...", token, wallets, teamWallets);

        let tokenBalances = [];
        let solBalances = [];
        let teamTokenBalances = [];
        let teamSolBalances = [];
        try {
            const mint = new PublicKey(token);
            const mintInfo = await getMint(connection, mint);

            tokenBalances = await Promise.all(wallets.map(async (item) => {
                if (isValidAddress(item)) {
                    try {
                        const owner = new PublicKey(item);
                        const tokenATA = await getAssociatedTokenAddress(mint, owner);
                        const tokenAccountInfo = await getAccount(connection, tokenATA);
                        return Number(new BigNumber(tokenAccountInfo.amount.toString() + "e-" + mintInfo.decimals.toString()).toString()).toFixed(4);
                    }
                    catch (err) {
                        console.log(err);
                    }
                }
                return "0.0000";
            }));

            if (teamWallets) {
                teamTokenBalances = await Promise.all(teamWallets.map(async (item) => {
                    if (isValidAddress(item)) {
                        try {
                            const owner = new PublicKey(item);
                            const tokenATA = await getAssociatedTokenAddress(mint, owner);
                            const tokenAccountInfo = await getAccount(connection, tokenATA);
                            return Number(new BigNumber(tokenAccountInfo.amount.toString() + "e-" + mintInfo.decimals.toString()).toString()).toFixed(4);
                        }
                        catch (err) {
                            console.log(err);
                        }
                    }
                    return "0.0000";
                }));
            }
        }
        catch (err) {
            console.log(err);
            tokenBalances = wallets.map(() => "0");
            teamTokenBalances = teamWallets ? teamWallets.map(() => "0") : [];
        }

        try {
            solBalances = await Promise.all(wallets.map(async (item) => {
                if (isValidAddress(item)) {
                    try {
                        const owner = new PublicKey(item);
                        const balance = await connection.getBalance(owner);
                        return Number(new BigNumber(balance.toString() + "e-9").toString()).toFixed(4);
                    }
                    catch (err) {
                        console.log(err);
                    }
                }
                return "0.0000";
            }));

            if (teamWallets) {
                teamSolBalances = await Promise.all(teamWallets.map(async (item) => {
                    if (isValidAddress(item)) {
                        try {
                            const owner = new PublicKey(item);
                            const balance = await connection.getBalance(owner);
                            return Number(new BigNumber(balance.toString() + "e-9").toString()).toFixed(4);
                        }
                        catch (err) {
                            console.log(err);
                        }
                    }
                    return "0.0000";
                }));
            }
        }
        catch (err) {
            console.log(err);
            solBalances = wallets.map(() => "0");
            teamSolBalances = teamWallets ? teamWallets.map(() => "0") : [];
        }

        setWalletBalanceData({ address: token, token: tokenBalances, sol: solBalances });
        setTeamWalletBalanceData({ address: token, token: teamTokenBalances, sol: teamSolBalances });
    };

    const loadAllProjects = async () => {
        let newProjects = [];
        setLoadingPrompt("Loading all projects...");
        setOpenLoading(true);
        try {
            console.log("Loading all projects...");
            const { data } = await axios.get(`${SERVER_URL}/api/v1/project/load-all`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        "MW-USER-ID": localStorage.getItem("access-token"),
                    },
                }
            );
            if (data.projects)
                newProjects = data.projects;
        }
        catch (err) {
            console.log(err);
            toast.warn("Failed to load projects");
        }

        setOpenLoading(false);
        setProjects(newProjects);
        setCurrentProject({});
    };

    const loadAllUsers = async () => {
        let newUsers = [];
        setLoadingPrompt("Loading all users...");
        setOpenLoading(true);
        try {
            console.log("Loading all users...");
            const { data } = await axios.get(`${SERVER_URL}/api/v1/user/load-all`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        "MW-USER-ID": localStorage.getItem("access-token"),
                    },
                }
            );
            if (data.users)
                newUsers = data.users;
        }
        catch (err) {
            console.log(err);
            toast.warn("Failed to load users");
        }

        setOpenLoading(false);
        setUsers(newUsers);
    };

    const loadAllEmails = async () => {
        let newEmails = [];
        setLoadingPrompt("Loading all emails...");
        setOpenLoading(true);
        try {
            console.log("Loading all emails...");
            const { data } = await axios.get(`${SERVER_URL}/api/v1/misc/load-emails`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        "MW-USER-ID": localStorage.getItem("access-token"),
                    },
                }
            );
            if (data.emails)
                newEmails = data.emails;
        }
        catch (err) {
            console.log(err);
            toast.warn("Failed to load users");
        }

        setOpenLoading(false);
        setEmails(newEmails);
    };

    const loadAllJitoSigners = async () => {
        let newJitoSigners = [];
        setLoadingPrompt("Loading all jito-signers...");
        setOpenLoading(true);
        try {
            console.log("Loading all jito-signers...");
            const { data } = await axios.get(`${SERVER_URL}/api/v1/misc/load-jito-signers`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        "MW-USER-ID": localStorage.getItem("access-token"),
                    },
                }
            );
            if (data.signers)
                newJitoSigners = data.signers;
        }
        catch (err) {
            console.log(err);
            toast.warn("Failed to load users");
        }

        setOpenLoading(false);
        setJitoSigners(newJitoSigners);
    };

    const updateProject = (project) => {
        const newProjects = [...projects];
        for (let i = 0; i < newProjects.length; i++) {
            if (project._id === newProjects[i]._id) {
                newProjects[i] = project;
                break;
            }
        }
        setProjects(newProjects);
    };

    const initAllData = async (accessToken, user) => {
        let newUsers = [];
        let newProjects = [];
        let newEmails = [];
        let newJitoSigners = [];
        let newExtraWallets = [];
        let newLogs = [];

        setLoadingPrompt("Initializing...");
        setOpenLoading(true);

        if (user.role === "admin") {
            try {
                console.log("Loading all users...");
                const { data } = await axios.get(`${SERVER_URL}/api/v1/user/load-all`,
                    {
                        headers: {
                            "Content-Type": "application/json",
                            "MW-USER-ID": accessToken,
                        },
                    }
                );
                if (data.users)
                    newUsers = data.users;
            }
            catch (err) {
                console.log(err);
                toast.warn("Failed to load users");
            }
        }

        try {
            console.log("Loading all projects...");
            const { data } = await axios.get(`${SERVER_URL}/api/v1/project/load-all`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        "MW-USER-ID": accessToken,
                    },
                }
            );
            if (data.projects)
                newProjects = data.projects;
        }
        catch (err) {
            console.log(err);
            toast.warn("Failed to load projects");
        }

        if (user.role === "admin") {
            try {
                console.log("Loading all emails...");
                const { data } = await axios.get(`${SERVER_URL}/api/v1/misc/load-emails`,
                    {
                        headers: {
                            "Content-Type": "application/json",
                            "MW-USER-ID": accessToken,
                        },
                    }
                );
                if (data.emails)
                    newEmails = data.emails;
            }
            catch (err) {
                console.log(err);
                toast.warn("Failed to load emails");
            }
        }

        if (user.role === "admin") {
            try {
                console.log("Loading all jito-signers...");
                const { data } = await axios.get(`${SERVER_URL}/api/v1/misc/load-jito-signers`,
                    {
                        headers: {
                            "Content-Type": "application/json",
                            "MW-USER-ID": accessToken,
                        },
                    }
                );
                if (data.signers)
                    newJitoSigners = data.signers;
            }
            catch (err) {
                console.log(err);
                toast.warn("Failed to load jito-signers");
            }
        }

        if (user.role === "admin") {
            try {
                console.log("Loading all extra-wallets...");
                const { data } = await axios.get(`${SERVER_URL}/api/v1/misc/load-extra-wallets`,
                    {
                        headers: {
                            "Content-Type": "application/json",
                            "MW-USER-ID": accessToken,
                        },
                    }
                );
                newExtraWallets = data.contacts;
            }
            catch (err) {
                console.log(err);
                toast.warn("Failed to load extra-wallets");
            }
        }

        if (user.role === "admin") {
            try {
                console.log("Loading all logs...");
                const { data } = await axios.get(`${SERVER_URL}/api/v1/misc/load-all-logs`,
                    {
                        headers: {
                            "Content-Type": "application/json",
                            "MW-USER-ID": accessToken,
                        },
                    }
                );
                newLogs = data.logs;
            }
            catch (err) {
                console.log(err);
                toast.warn("Failed to load logs");
            }
        }

        setOpenLoading(false);

        setProjects(newProjects);
        setCurrentProject({});
        if (user.role === "admin") {
            setUsers(newUsers);
            setEmails(newEmails);
            setJitoSigners(newJitoSigners);
            setExtraWallets(newExtraWallets);
            setLogs(newLogs);
        }
    };

    const logout = async () => {
        console.log("Logging out...");

        setLoadingPrompt("Logging out...");
        setOpenLoading(true);
        try {
            await axios.get(`${SERVER_URL}/api/v1/user/logout`, {
                headers: {
                    'MW-USER-ID': localStorage.getItem("access-token")
                }
            });
            localStorage.removeItem("access-token");

            setUsers([]);
            setProjects([]);
            setCurrentProject({});
            setUser({});
            closeWebSocket();
        }
        catch (error) {
            console.log(error);
            toast.warn("Failed to logout");
        }
        setOpenLoading(false);
    };

    useEffect(() => {
        if (currentProject.token || (currentProject.wallets && currentProject.wallets.length > 0) || (currentProject.teamWallets && currentProject.teamWallets.length > 0)) {
            const wallets = currentProject.wallets.map(item => item.address);
            const teamWallets = currentProject.teamWallets ? currentProject.teamWallets.map(item => item.address) : [];
            updateAllBalances(connection, currentProject.token.address, wallets, teamWallets);
        }
        else {
            setWalletBalanceData({ address: "", token: [], sol: [] });
            setTeamWalletBalanceData({ address: "", token: [], sol: [] });
        }
    }, [connection, currentProject.token, currentProject.wallets, currentProject.teamWallets]);

    useEffect(() => {
        const loadUser = async (accessToken) => {
            try {
                const { data } = await axios.get(`${SERVER_URL}/api/v1/user/me`,
                    {
                        headers: {
                            "Content-Type": "application/json",
                            "MW-USER-ID": accessToken,
                        },
                    }
                );
                if (data.success)
                    setUser(data.user);
            }
            catch (err) {
                console.log(err);
                setUser({});
            }
        };

        loadUser(localStorage.getItem("access-token"));
    }, []);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location.pathname]);

    useEffect(() => {
        if (!user._id) {
            if (location.pathname !== "/" &&
                location.pathname !== "/login" &&
                location.pathname !== "/register") {
                navigate("/");
            }
        }
        else {
            if (location.pathname !== "/dashboard" &&
                location.pathname !== "/create-token" &&
                location.pathname !== "/pumpfun-create-token" &&
                location.pathname !== "/pumpfun-buy" &&
                location.pathname !== "/pumpfun-sell" &&
                location.pathname !== "/pumpfun-transfer" &&
                location.pathname !== "/set-authority" &&
                location.pathname !== "/openbook" &&
                location.pathname !== "/manage-lp" &&
                location.pathname !== "/token-account" &&
                location.pathname !== "/buy" &&
                location.pathname !== "/sell" &&
                location.pathname !== "/transfer" &&
                location.pathname !== "/volume-bot" &&                
                location.pathname !== "/market-maker" &&                
                (location.pathname !== "/log" || user.role !== "admin")) {
                navigate("/dashboard");
            }
        }
    }, [location, navigate, user]);

    useEffect(() => {
        if (user._id) {
            console.log("Succeed to login");
            toast.success("Succeed to login");
            openWebSocket(user._id);
            const accessToken = localStorage.getItem("access-token");
            initAllData(accessToken, user);
        }
        else
            console.log("Logged out");
    }, [user._id]);

    useEffect(() => {
        if (notifyStatus.tag === "COLLECT_ALL_FEE") {
            if (notifyStatus.success)
                toast.success("Succeed to collect fee!");
            else
                toast.warn("Failed to collect fee!");
            setOpenLoading(false);
            setNotifyStatus({ success: true, tag: "NONE" });
        }
        else if (notifyStatus.tag === "ADD_LOG") {
            setLogs([
                ...logs,
                notifyStatus.log,
            ]);
            setNotifyStatus({ success: true, tag: "NONE" });
        }
    }, [notifyStatus, logs]);

    useEffect(() => {
        if (connected) {
            console.log("Getting token accounts...");
            getTokenListByOwner(connection, publicKey, true).then(response => {
                setAssets(response);
                console.log("Success");
            });
        }
        else
            setAssets([]);
    }, [connected, connection, publicKey]);

    return (
        <AppContext.Provider
            value={{
                SERVER_URL,
                BOT_SERVER_URL,
                loadingPrompt,
                setLoadingPrompt,
                openLoading,
                setOpenLoading,
                logout,
                user,
                setUser,
                users,
                setUsers,
                projects,
                setProjects,
                currentProject,
                setCurrentProject,
                assets,
                setAssets,
                logs,
                setLogs,
                webSocket,
                setWebSocket,
                openWebSocket,
                closeWebSocket,
                extraWallets,
                setExtraWallets,
                emails,
                setEmails,
                jitoSigners,
                setJitoSigners,
                loadAllProjects,
                loadAllUsers,
                loadAllEmails,
                loadAllJitoSigners,
                updateProject,
                walletBalanceData,
                setWalletBalanceData,
                teamWalletBalanceData,
                setTeamWalletBalanceData,
                updateAllBalances,
                notifyStatus,
                setNotifyStatus,
            }}>
            {children}
        </AppContext.Provider>
    )
}

export default AppProvider