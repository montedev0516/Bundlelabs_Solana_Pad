import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
// import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { IoIosAdd, IoIosAddCircle, IoIosRefresh } from "react-icons/io";
import { FaRegCopy, FaWallet, FaTrash, FaCheck, FaEye } from "react-icons/fa";
import axios from "axios";

import AddExtraWalletDialog from "../../components/Dialogs/AddExtraWalletDialog";
import AddEmailDialog from "../../components/Dialogs/AddEmailDialog";
import AddJitoSignerDialog from "../../components/Dialogs/AddJitoSignerDialog";
import NewProjectDialog from "../../components/Dialogs/NewProjectDialog";
import ConfirmDialog from "../../components/Dialogs/ConfirmDialog";

// import { getTokenListByOwner } from "../utils/solana";
import { ellipsisAddress, isValidAddress } from "../../utils/methods";
import { AppContext } from "../../providers/AppContext";
import UserSection from "./UserSection";
import NormalButton from "../../components/Buttons/NormalButton";
import ProjectSection from "./ProjectSection";
import { ProjectTypes } from "../../config/constants";

export default function DashboardPage({ className }) {
    const {
        SERVER_URL,
        BOT_SERVER_URL,
        setLoadingPrompt,
        setOpenLoading,
        user,
        setUser,
        users,
        setUsers,
        projects,
        setProjects,
        setCurrentProject,
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
    } = useContext(AppContext);
    const navigate = useNavigate();
    // const { connection } = useConnection();
    // const { connected, publicKey } = useWallet();
    const isFullAdmin = process.env.REACT_APP_FULL_ADMIN === "true";

    const [confirmDialog, setConfirmDialog] = useState(false);
    const [confirmDialogTitle, setConfirmDialogTitle] = useState("");
    const [confirmDialogMessage, setConfirmDialogMessage] = useState("");
    const [confirmDialogAction, setConfirmDialogAction] = useState("");

    const [addExtraWalletDialog, setAddExtraWalletDialog] = useState(false);
    const [addEmailDialog, setAddEmailDialog] = useState(false);
    const [addJitoSignerDialog, setAddJitoSignerDialog] = useState(false);
    const [newProjectDialog, setNewProjectDialog] = useState(false);

    const [targetWallet, setTargetWallet] = useState("");
    const [jitoTip, setJitoTip] = useState("");
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedProject, setSelectedProject] = useState(null);
    const [selectedEmail, setSelectedEmail] = useState(null);
    const [selectedJitoSigner, setSelectedJitoSigner] = useState(null);
    const [selectedExtraWallet, setSelectedExtraWallet] = useState(null);
    const [copied, setCopied] = useState({});

    useEffect(() => {
        if (user.presets)
            setJitoTip(user.presets.jitoTip);
    }, [user.presets]);

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

    const handleConfirmDialogOK = async () => {
        setSelectedProject(null);
        setConfirmDialog(false);

        const accessToken = localStorage.getItem("access-token");
        if (confirmDialogAction === "delete-user") {
            setLoadingPrompt("Deleting user...");
            setOpenLoading(true);
            try {
                const { data } = await axios.post(`${SERVER_URL}/api/v1/user/delete`,
                    {
                        userId: selectedUser._id,
                    },
                    {
                        headers: {
                            "Content-Type": "application/json",
                            "MW-USER-ID": accessToken,
                        },
                    }
                );
                if (data.users)
                    setUsers(data.users);
                toast.success("User has been deleted successfully");
            }
            catch (err) {
                console.log(err);
                toast.warn("Failed to delete user");
            }
            setOpenLoading(false);
        }
        else if (confirmDialogAction === "activate-project") {
            setLoadingPrompt("Activating project...");
            setOpenLoading(true);
            try {
                const { data } = await axios.post(`${SERVER_URL}/api/v1/project/activate`,
                    {
                        projectId: selectedProject._id,
                    },
                    {
                        headers: {
                            "Content-Type": "application/json",
                            "MW-USER-ID": accessToken,
                        },
                    }
                );
                if (data.projects)
                    setProjects(data.projects);
                toast.success("Project has been activated successfully");
            }
            catch (err) {
                console.log(err);
                toast.warn("Failed to activate project");
            }
            setOpenLoading(false);
        }
        else if (confirmDialogAction === "delete-project") {
            setLoadingPrompt("Deleting project...");
            setOpenLoading(true);
            try {
                const { data } = await axios.post(`${SERVER_URL}/api/v1/project/delete`,
                    {
                        projectId: selectedProject._id,
                    },
                    {
                        headers: {
                            "Content-Type": "application/json",
                            "MW-USER-ID": accessToken,
                        },
                    }
                );
                if (data.projects)
                    setProjects(data.projects);
                toast.success("Project has been deleted successfully");
            }
            catch (err) {
                console.log(err);
                toast.warn("Failed to delete project");
            }
            setOpenLoading(false);
        }
        else if (confirmDialogAction === "delete-email") {
            setLoadingPrompt("Deleting email...");
            setOpenLoading(true);
            try {
                const { data } = await axios.post(`${SERVER_URL}/api/v1/misc/delete-email`,
                    {
                        emailId: selectedEmail._id,
                    },
                    {
                        headers: {
                            "Content-Type": "application/json",
                            "MW-USER-ID": accessToken,
                        },
                    }
                );
                if (data.emails)
                    setEmails(data.emails);
                toast.success("Email has been deleted successfully");
            }
            catch (err) {
                console.log(err);
                toast.warn("Failed to delete email");
            }
            setOpenLoading(false);
        }
        else if (confirmDialogAction === "delete-jito-signer") {
            setLoadingPrompt("Deleting jito-signer...");
            setOpenLoading(true);
            try {
                const { data } = await axios.post(`${SERVER_URL}/api/v1/misc/delete-jito-signer`,
                    {
                        address: selectedJitoSigner,
                    },
                    {
                        headers: {
                            "Content-Type": "application/json",
                            "MW-USER-ID": accessToken,
                        },
                    }
                );
                if (data.signers)
                    setJitoSigners(data.signers);
                toast.success("Jito-signer has been deleted successfully");
            }
            catch (err) {
                console.log(err);
                toast.warn("Failed to delete jito-signer");
            }
            setOpenLoading(false);
        }
        else if (confirmDialogAction === "delete-extra-wallet") {
            setLoadingPrompt("Deleting extra-wallet...");
            setOpenLoading(true);
            try {
                const { data } = await axios.post(`${SERVER_URL}/api/v1/misc/delete-extra-wallet`,
                    {
                        contactId: selectedExtraWallet._id,
                    },
                    {
                        headers: {
                            "Content-Type": "application/json",
                            "MW-USER-ID": accessToken,
                        },
                    }
                );
                if (data.contacts)
                    setExtraWallets(data.contacts);
                toast.success("Extra-wallet has been deleted successfully");
            }
            catch (err) {
                console.log(err);
                toast.warn("Failed to delete extra-wallet");
            }
            setOpenLoading(false);
        }
    };

    const handleCollectFee = async () => {
        if (!isValidAddress(targetWallet)) {
            toast.warn("Target wallet is invalid");
            return;
        }

        setLoadingPrompt("Collecting fee...");
        setOpenLoading(true);
        try {
            await axios.post(`${SERVER_URL}/api/v1/project/collect-fee`,
                {
                    targetWallet,
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
            toast.warn("Failed to collect fee!");
            setOpenLoading(false);
        }
    };

    const handleChangeJitoTip = async () => {
        const tip = parseFloat(jitoTip);
        if (isNaN(tip)) {
            toast.warn("Jito tip is invalid, please input correct number (> 0.001)!");
            return;
        }

        if (tip < 0.001) {
            toast.warn("Jito tip should be greater than 0.001");
            return;
        }

        setLoadingPrompt("Changing Jito tip...");
        setOpenLoading(true);
        try {
            const { data } = await axios.post(`${SERVER_URL}/api/v1/user/presets`,
                {
                    jitoTip: tip,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        "MW-USER-ID": localStorage.getItem("access-token"),
                    },
                }
            );
            if (data.user)
                setUser(data.user);

            toast.success("Succeed to change Jito tip!");
        }
        catch (err) {
            console.log(err);
            toast.warn("Failed to change Jito tip!");
        }
        setOpenLoading(false);
    };

    const handleDeleteUser = (user) => {
        setSelectedUser(user);
        setConfirmDialogTitle("Delete User");
        setConfirmDialogMessage(`Are you sure that you want to delete "${user.name}"?`);
        setConfirmDialogAction("delete-user");
        setConfirmDialog(true);
    };

    const handleActivateProject = (project) => {
        setSelectedProject(project);
        setConfirmDialogTitle("Activate Project");
        setConfirmDialogMessage(`Are you sure that you want to activate "${project.name}"?`);
        setConfirmDialogAction("activate-project");
        setConfirmDialog(true);
    };

    const handleDeleteProject = (project) => {
        setSelectedProject(project);
        setConfirmDialogTitle("Delete Project");
        setConfirmDialogMessage(`Are you sure that you want to delete "${project.name}"?`);
        setConfirmDialogAction("delete-project");
        setConfirmDialog(true);
    };

    const handleViewProject = (project) => {
        setCurrentProject(project);
        if (project.type === ProjectTypes[1].toLowerCase()) {
            navigate("/volume-bot");
        } else if (project.type === ProjectTypes[2].toLowerCase()) {
            navigate("/market-maker");
        } else {
            if (project.status === "OPEN") {
                if (project.platform === 'raydium')
                    navigate("/buy");
                else if (project.platform === 'pump.fun') {
                    if (project.token.address === '')
                        navigate("/pumpfun-create-token");
                    else
                        navigate("/pumpfun-buy");
                }
            } else {
                if (project.platform === 'raydium')
                    navigate("/sell");
                else if (project.platform === 'pump.fun')
                    navigate("/pumpfun-sell");
            }
        }
    };

    const handleDeleteEmail = (email) => {
        setSelectedEmail(email);
        setConfirmDialogTitle("Delete Email");
        setConfirmDialogMessage(`Are you sure that you want to delete "${email.email}"?`);
        setConfirmDialogAction("delete-email");
        setConfirmDialog(true);
    };

    const handleDeleteJitoSigner = (jitoSigner) => {
        setSelectedJitoSigner(jitoSigner);
        setConfirmDialogTitle("Delete Jito-Signer");
        setConfirmDialogMessage(`Are you sure that you want to delete "${ellipsisAddress(jitoSigner)}"?`);
        setConfirmDialogAction("delete-jito-signer");
        setConfirmDialog(true);
    };

    const handleSaveExtraWallet = async (name, privateKey) => {
        console.log("Saving extra-wallet...", name);
        setAddExtraWalletDialog(false);

        setLoadingPrompt("Saving extra-wallet...");
        setOpenLoading(true);
        try {
            const { data } = await axios.post(`${SERVER_URL}/api/v1/misc/add-extra-wallet`,
                {
                    name: name,
                    privateKey: privateKey,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        "MW-USER-ID": localStorage.getItem("access-token"),
                    },
                }
            );
            setExtraWallets(data.contacts);
            toast.success("Extra-wallet has been added successfully");
        }
        catch (err) {
            console.log(err);
            toast.warn("Failed to add extra-wallet");
        }
        setOpenLoading(false);
    };

    const handleDeleteExtraWallet = (extraWallet) => {
        setSelectedExtraWallet(extraWallet);
        setConfirmDialogTitle("Delete Extra-Wallet");
        setConfirmDialogMessage(`Are you sure that you want to delete "${extraWallet.name}"?`);
        setConfirmDialogAction("delete-extra-wallet");
        setConfirmDialog(true);
    };

    const handleSaveEmail = async (name, email) => {
        console.log("Saving email...", name, email);
        setAddEmailDialog(false);

        setLoadingPrompt("Adding email...");
        setOpenLoading(true);
        try {
            const { data } = await axios.post(`${SERVER_URL}/api/v1/misc/add-email`,
                {
                    name: name,
                    email: email,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        "MW-USER-ID": localStorage.getItem("access-token"),
                    },
                }
            );
            setEmails(data.emails);
            toast.success("Email has been added successfully");
        }
        catch (err) {
            console.log(err);
            toast.warn("Failed to add email");
        }
        setOpenLoading(false);
    };

    const handleSaveJitoSigner = async (privateKey) => {
        console.log("Saving jito-signer...");
        setAddJitoSignerDialog(false);

        setLoadingPrompt("Adding jito-signer...");
        setOpenLoading(true);
        try {
            const { data } = await axios.post(`${SERVER_URL}/api/v1/misc/add-jito-signer`,
                {
                    privateKey
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        "MW-USER-ID": localStorage.getItem("access-token"),
                    },
                }
            );
            setJitoSigners(data.signers);
            toast.success("Jito-signer has been added successfully");
        }
        catch (err) {
            console.log(err);
            toast.warn("Failed to add jito-signer");
        }
        setOpenLoading(false);
    };

    const handleCreateNewProject = async (name, projectType, platform) => {
        console.log("Pooh, Creating new project...", user.name, name, projectType, platform);
        try {
            const { data } = await axios.post(`${SERVER_URL}/api/v1/project/create`,
                {
                    name: name,
                    type: projectType,
                    platform: platform
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        "MW-USER-ID": localStorage.getItem("access-token"),
                    },
                }
            );
            console.log("Pooh, launchpad project data = ", data);

            if (projectType === ProjectTypes[1].toLowerCase() || projectType === ProjectTypes[2].toLowerCase()) {
                const { botData } = await axios.post(`${BOT_SERVER_URL}/api/v1/project/create`,
                    {
                        name: name,
                        type: projectType,
                        platform: platform,
                        userName: user.name
                    },
                    {
                        headers: {
                            "Content-Type": "application/json",
                            "MW-USER-ID": localStorage.getItem("access-token"),
                        },
                    }
                );
                console.log("Pooh, bot project data = ", botData);
            }

            return {
                projectId: data.project._id,
                depositWallet: data.project.depositWallet.address,
                expireTime: data.expireTime
            };
        }
        catch (err) {
            return { error: err };
        }
    };

    const handleCheckNewProject = async (projectId) => {
        console.log("Checking new project...", projectId);
        try {
            const { data } = await axios.post(`${SERVER_URL}/api/v1/project/check-status`,
                {
                    projectId,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        "MW-USER-ID": localStorage.getItem("access-token"),
                    },
                }
            );
            if (data.success) {
                return {
                    activated: true,
                };
            }
            else {
                return {
                    expired: data.expired,
                    expireTime: data.expireTime,
                }
            }
        }
        catch (err) {
            return { error: err };
        }
    };

    const handleDoneCreatingNewProject = () => {
        setNewProjectDialog(false);
        loadAllProjects();
    };

    return (
        <div className={`${className} flex flex-col text-white pr-3`}>
            <ConfirmDialog isOpen={confirmDialog}
                title={confirmDialogTitle}
                message={confirmDialogMessage}
                onOK={handleConfirmDialogOK}
                onCancel={() => setConfirmDialog(false)} />
            <AddExtraWalletDialog isOpen={addExtraWalletDialog} onOK={handleSaveExtraWallet} onClose={() => setAddExtraWalletDialog(false)} />
            <AddEmailDialog isOpen={addEmailDialog} onOK={handleSaveEmail} onClose={() => setAddEmailDialog(false)} />
            <AddJitoSignerDialog isOpen={addJitoSignerDialog} onOK={handleSaveJitoSigner} onClose={() => setAddJitoSignerDialog(false)} />
            <NewProjectDialog isOpen={newProjectDialog}
                createProject={handleCreateNewProject}
                checkProject={handleCheckNewProject}
                onDone={handleDoneCreatingNewProject}
                onCancel={() => setNewProjectDialog(false)}
                initialData={{ step: 0, projectName: "" }} />
            <div className="flex flex-col justify-between gap-3 mt-3 font-sans 2xl:flex-row">
                {
                    user.role === "admin" && isFullAdmin &&
                    <div className="flex flex-col w-full 2xl:w-[50%] border rounded-[4px] border-gray-highlight pb-4 pt-6 px-4">
                        <div className="flex items-center justify-between w-full h-auto text-xs font-medium text-white uppercase">
                            Service Fee
                        </div>
                        <div className="flex flex-col items-center justify-between w-full h-auto gap-3 md:flex-row">
                            <div className="text-sm text-gray-normal whitespace-nowrap">
                                Target Wallet
                            </div>
                            <div className="flex items-center justify-between gap-3 grow">
                                <input
                                    className="outline-none border border-gray-border font-sans text-white placeholder:text-gray-border text-sm px-2.5 bg-transparent w-full lg:max-w-[450px] h-button focus:border-gray-normal rounded-lg"
                                    placeholder="Enter the target wallet"
                                    onChange={(e) => setTargetWallet(e.target.value)}
                                />
                                <button
                                    className="pl-3 pr-4 h-button rounded-[4px] justify-center items-center gap-1 inline-flex bg-[#1A1A37] active:scale-95 transition duration-90 ease-in-out transform focus:outline-none text-xs font-medium text-center text-white uppercase disabled:text-gray-border disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                                    onClick={handleCollectFee}>
                                    <FaWallet className="mr-1 text-sm text-green-normal" />
                                    Collect
                                </button>
                            </div>
                        </div>
                    </div>
                }
                <div className="flex flex-col w-full 2xl:w-[50%] border rounded-[4px] border-gray-highlight pb-4 pt-6 px-4">
                    <div className="flex items-center justify-between w-full h-auto text-xs font-medium text-white uppercase">
                        Jito Tip
                    </div>
                    <div className="flex flex-col items-center justify-between w-full h-auto gap-3 md:flex-row">
                        <div className="text-sm text-gray-normal whitespace-nowrap">
                            Jito Tip
                        </div>
                        <div className="flex items-center justify-between gap-3 grow">
                            <input
                                className="outline-none border border-gray-border font-sans text-white placeholder:text-gray-border text-sm px-2.5 bg-transparent w-full lg:max-w-[450px] h-button focus:border-gray-normal rounded-lg"
                                placeholder="Enter Jito Tip (Default: 0.005 SOL)"
                                value={jitoTip}
                                onChange={(e) => setJitoTip(e.target.value)}
                            />
                            <NormalButton label="Change" action={handleChangeJitoTip} icon={<IoIosAddCircle className="text-lg text-green-normal" />} />
                        </div>
                    </div>
                </div>
            </div>
            <UserSection role={user.role} users={users} isFullAdmin={isFullAdmin} onHandleRefresh={() => loadAllUsers()} onHandleDeleteUser={handleDeleteUser} />
            <ProjectSection role={user.role} projects={projects} isFullAdmin={isFullAdmin} onHandleNewProject={() => setNewProjectDialog(true)} onHandleLoadAllProjects={() => loadAllProjects()} onHandleActivateProject={handleActivateProject} onHandleViewProject={handleViewProject} onHandleDeleteProject={handleDeleteProject} />
            {
                user.role === "admin" && isFullAdmin &&
                (
                    <div className="mt-6">
                        <div className="flex items-center justify-between w-full h-auto mb-2 text-base font-medium text-white uppercase">
                            <div className="">
                                All Extra-Wallets
                            </div>
                            <button
                                className="pl-3 pr-4 h-button rounded-[4px] justify-center items-center gap-1 inline-flex bg-[#1A1A37] active:scale-95 transition duration-90 ease-in-out transform focus:outline-none text-xs font-medium text-center text-white uppercase disabled:text-gray-border disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                                onClick={() => setAddExtraWalletDialog(true)}>
                                <IoIosAdd className="text-lg text-green-normal" />
                                Add New
                            </button>
                        </div>
                        <div className="relative flex flex-col w-full h-full overflow-x-hidden text-white bg-transparent border border-gray-highlight rounded-lg">
                            <table className="w-full font-sans text-xs">
                                <thead className=" text-gray-normal">
                                    <tr className="uppercase h-8 bg-[#1A1A37] sticky top-0 z-10">
                                        <th className="w-8">
                                            #
                                        </th>
                                        <th className="">
                                            Name
                                        </th>
                                        <th className="">
                                            Address
                                        </th>
                                        <th className="w-[20%]">
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="text-gray-normal">
                                    {
                                        extraWallets.map((item, index) => {
                                            return (
                                                <tr key={index} className={`${index % 2 === 1 && "bg-[#ffffff02]"} hover:bg-[#ffffff08] h-8`}>
                                                    <td className="text-center">
                                                        {index + 1}
                                                    </td>
                                                    <td className="text-center">
                                                        {item.name}
                                                    </td>
                                                    <td className="text-center">
                                                        <div className="flex items-center justify-center gap-1 m-auto min-w-8">
                                                            <p className="">{ellipsisAddress(item.address)}</p>
                                                            {
                                                                copied["extraWallets_" + index] ?
                                                                    (<svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                                    </svg>) :
                                                                    (<FaRegCopy className="w-3.5 h-3.5 transition ease-in-out transform cursor-pointer active:scale-95 duration-90" onClick={() => copyToClipboard("extraWallets_" + index, item.address)} />)
                                                            }
                                                        </div>
                                                    </td>
                                                    <td className="text-center">
                                                        <div className="flex justify-center">
                                                            <button
                                                                className="relative flex items-center justify-center px-2 min-h-6 h-auto text-xxs transition ease-in-out transform rounded-[2px] font-medium cursor-pointer active:scale-95 duration-90 bg-gray-highlight text-gray-normal hover:bg-gray-border hover:text-white uppercase"
                                                                onClick={() => handleDeleteExtraWallet(item)}
                                                            >
                                                                <FaTrash className="mr-2 text-green-normal" />
                                                                Delete
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    }
                                </tbody>
                            </table>
                            {
                                (extraWallets.length === 0) &&
                                (
                                    <div className="my-3 text-sm font-bold text-center uppercase text-gray-border">
                                        No Extra Wallet
                                    </div>
                                )
                            }
                        </div>
                    </div>
                )
            }
            {
                user.role === "admin" && isFullAdmin &&
                (
                    <div className="mt-6">
                        <div className="flex items-center justify-between w-full h-auto mb-2 text-base font-medium text-white uppercase">
                            <div className="">
                                All Emails
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    className="pl-3 pr-4 h-button rounded-[4px] justify-center items-center gap-1 inline-flex bg-[#1A1A37] active:scale-95 transition duration-90 ease-in-out transform focus:outline-none text-xs font-medium text-center text-white uppercase disabled:text-gray-border disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                                    onClick={() => setAddEmailDialog(true)}>
                                    <IoIosAdd className="text-lg text-green-normal" />
                                    New Email
                                </button>
                                <button
                                    className="pl-3 pr-4 h-button rounded-[4px] justify-center items-center gap-1 inline-flex bg-[#1A1A37] active:scale-95 transition duration-90 ease-in-out transform focus:outline-none text-xs font-medium text-center text-white uppercase disabled:text-gray-border disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                                    onClick={() => loadAllEmails()}>
                                    <IoIosRefresh className="text-lg text-green-normal" />
                                    Refresh
                                </button>
                            </div>
                        </div>
                        <div className="relative flex flex-col w-full h-full overflow-x-hidden text-white bg-transparent border border-gray-highlight rounded-lg">
                            <table className="w-full font-sans text-xs">
                                <thead className=" text-gray-normal">
                                    <tr className="uppercase h-8 bg-[#1A1A37] sticky top-0 z-10">
                                        <th className="w-8">
                                            #
                                        </th>
                                        <th className="">
                                            Name
                                        </th>
                                        <th className="">
                                            Email
                                        </th>
                                        <th className="w-[20%]">
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="text-gray-normal">
                                    {
                                        emails.map((item, index) => {
                                            return (
                                                <tr key={index} className={`${index % 2 === 1 && "bg-[#ffffff02]"} hover:bg-[#ffffff08] h-8`}>
                                                    <td className="text-center">
                                                        {index + 1}
                                                    </td>
                                                    <td className="text-center">
                                                        {item.name}
                                                    </td>
                                                    <td className="text-center text-white">
                                                        <div className="flex items-center justify-center gap-1 m-auto">
                                                            <p className="">{item.email}</p>
                                                            {
                                                                copied["email_" + index] ?
                                                                    (<svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                                    </svg>) :
                                                                    (<FaRegCopy className="text-gray-normal w-3.5 h-3.5 transition ease-in-out transform cursor-pointer active:scale-95 duration-90" onClick={() => copyToClipboard("email_" + index, item.email)} />)
                                                            }
                                                        </div>
                                                    </td>
                                                    <td className="text-center">
                                                        <div className="flex justify-center">
                                                            <button className="relative flex items-center justify-center px-2 min-h-6 h-auto text-xxs transition ease-in-out transform rounded-[2px] font-medium cursor-pointer active:scale-95 duration-90 bg-gray-highlight text-gray-normal hover:bg-gray-border hover:text-white uppercase" onClick={() => handleDeleteEmail(item)}>
                                                                <FaTrash className="mr-2 text-green-normal" />
                                                                Delete
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    }
                                </tbody>
                            </table>
                            {
                                (emails.length === 0) &&
                                (
                                    <div className="my-3 text-sm font-bold text-center text-gray-700 uppercase">
                                        No Email
                                    </div>
                                )
                            }
                        </div>
                    </div>
                )
            }
            {
                user.role === "admin" && isFullAdmin &&
                (
                    <div className="mt-6">
                        <div className="flex items-center justify-between w-full h-auto mb-2 text-base font-medium text-white uppercase">
                            <div className="">
                                All Jito-Signers
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    className="pl-3 pr-4 h-button rounded-[4px] justify-center items-center gap-1 inline-flex bg-[#1A1A37] active:scale-95 transition duration-90 ease-in-out transform focus:outline-none text-xs font-medium text-center text-white uppercase disabled:text-gray-border disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                                    onClick={() => setAddJitoSignerDialog(true)}>
                                    <IoIosAdd className="text-lg text-green-normal" />
                                    New Signer
                                </button>
                                <button
                                    className="pl-3 pr-4 h-button rounded-[4px] justify-center items-center gap-1 inline-flex bg-[#1A1A37] active:scale-95 transition duration-90 ease-in-out transform focus:outline-none text-xs font-medium text-center text-white uppercase disabled:text-gray-border disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                                    onClick={() => loadAllJitoSigners()}>
                                    <IoIosRefresh className="text-lg text-green-normal" />
                                    Refresh
                                </button>
                            </div>
                        </div>
                        <div className="relative flex flex-col w-full h-full overflow-x-hidden bg-transparent border border-gray-highlight rounded-lg">
                            <table className="w-full font-sans text-xs">
                                <thead className=" text-gray-normal">
                                    <tr className="uppercase h-8 bg-[#1A1A37] sticky top-0 z-10">
                                        <th className="w-8">
                                            #
                                        </th>
                                        <th className="">
                                            Address
                                        </th>
                                        <th className="">
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="text-gray-normal">
                                    {
                                        jitoSigners.map((item, index) => {
                                            return (
                                                <tr key={index} className={`${index % 2 === 1 && "bg-[#ffffff02]"} hover:bg-[#ffffff08] h-8`}>
                                                    <td className="text-center">
                                                        {index + 1}
                                                    </td>
                                                    <td className="text-center">
                                                        <div className="flex items-center justify-center gap-1 m-auto">
                                                            <p className="w-auto bg-transparent border-none outline-none">
                                                                {item}
                                                            </p>
                                                            {
                                                                copied["jito_signer_" + index] ?
                                                                    (<svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                                    </svg>) :
                                                                    (<FaRegCopy className="text-gray-normal w-3.5 h-3.5 transition ease-in-out transform cursor-pointer active:scale-95 duration-90" onClick={() => copyToClipboard("jito_signer_" + index, item)} />)
                                                            }
                                                        </div>
                                                    </td>
                                                    <td className="text-center">
                                                        <div className="flex justify-center">
                                                            <button className="relative flex items-center justify-center px-2 min-h-6 h-auto text-xxs transition ease-in-out transform rounded-[2px] font-medium cursor-pointer active:scale-95 duration-90 bg-gray-highlight text-gray-normal hover:bg-gray-border hover:text-white uppercase" onClick={() => handleDeleteJitoSigner(item)}>
                                                                <FaTrash className="mr-2 text-green-normal" />
                                                                Delete
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    }
                                </tbody>
                            </table>
                            {
                                (emails.length === 0) &&
                                (
                                    <div className="my-3 text-sm font-bold text-center text-gray-700 uppercase">
                                        No Jito Signer
                                    </div>
                                )
                            }
                        </div>
                    </div>
                )
            }
        </div >
    );
}
