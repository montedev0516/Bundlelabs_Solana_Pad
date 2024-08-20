import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FaCheck, FaExclamationTriangle, FaRegCopy } from "react-icons/fa";
import { Select } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import clsx from 'clsx'
import Modal from "../Base/Modal";
import { ellipsisAddress } from "../../utils/methods";
import DropDownSelect from "../Select/DropDownSelect";
import { BotTypes, PlatformList, ProjectTypes } from "../../config/constants";
import Steps from "../Steps";

export default function NewProjectDialog({ isOpen, createProject, checkProject, onDone, onCancel, initialData }) {
    const steps = [
        "Create",
        "Activate",
        "Completed",
    ];
    const [step, setStep] = useState(0);
    const [projectName, setProjectName] = useState("");    
    const [projectType, setProjectType] = useState("bundle launch");
    const [platform, setPlatform] = useState("raydium");
    const [creating, setCreating] = useState(false);
    const [depositWallet, setDepositWallet] = useState("");
    const [expireTime, setExpireTime] = useState(-1);
    const [intervalId, setIntervalId] = useState(null);
    const [copied, setCopied] = useState(false);

    const expireTimeMin = Math.floor(expireTime / 60000);
    const expireTimeSec = Math.floor(expireTime / 1000) % 60;
    const visiblePayment = process.env.REACT_APP_NEW_PROJECT_PAYMENT === "true";
    const isContact = process.env.REACT_APP_CONTACT === "true";

    useEffect(() => {
        setStep(initialData.step);
        setProjectName(initialData.projectName);
    }, [initialData]);

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

    const handleDone = () => {
        if (intervalId) {
            clearInterval(intervalId);
            setIntervalId(null);
        }
        onDone();
    };

    const handleCancel = () => {
        if (intervalId) {
            clearInterval(intervalId);
            setIntervalId(null);
        }
        onCancel();
    };

    const handleRetry = () => {
        if (intervalId) {
            clearInterval(intervalId);
            setIntervalId(null);
        }
    };

    const handleCheck = (projectId) => {
        const id = setInterval(async () => {
            console.log("Checking...", projectId);
            const data = await checkProject(projectId);
            if (data.activated) {
                clearInterval(id);
                setIntervalId(null);
                setStep(2);
            }
            else if (data.expired || data.error) {
                clearInterval(id);
                setIntervalId(null);
                setStep(3);
            }
            else
                setExpireTime(data.expireTime);
        }, 1000);
        setIntervalId(id);
    };

    const handleCreate = async () => {
        setCreating(true);
        try {
            const data = await createProject(projectName, projectType, platform);
            if (!data.error) {
                setStep(1);
                if (visiblePayment)
                    setDepositWallet(data.depositWallet);
                setExpireTime(data.expireTime);
                handleCheck(data.projectId);
                setPlatform("raydium");
            }
            else {
                console.log(data.error);
                toast.warn("Failed to create new project");
            }
        }
        catch (err) {
            console.log(err);
        }
        setCreating(false);
    };

    const handleProjectTypeChange = (value) => {
        setProjectType(value)
    }

    const handlePlatformChange = (value) => {
        setPlatform(value)
    }

    return (
        <Modal isOpen={isOpen}>
            <div className="flex flex-col pt-5 w-[440px] font-sans">
                <div className="flex items-center justify-start w-full h-auto px-5 py-3 rounded-t-md bg-gray-highlight">
                    <div className="font-sans text-sm font-medium text-white uppercase">
                        New Project
                    </div>
                </div>
                <div className="items-center w-full h-auto px-5 py-5 md:py-0 bg-gray-dark rounded-b-md">
                    <Steps steps={steps} step={step} />                    
                    <div className="my-6">
                        {
                            step === 0 &&
                            (
                                <div className="flex flex-col">
                                    <div className="mt-4">
                                        <div className="font-sans text-xs uppercase text-gray-normal">
                                            Project Name<span className="pl-1 text-green-normal">*</span>
                                        </div>
                                        <input
                                            className="outline-none border border-gray-border font-sans text-white placeholder:text-gray-border text-sm px-2.5 bg-transparent w-full h-button mt-1"
                                            placeholder="Enter Name"
                                            onChange={(e) => setProjectName(e.target.value)}
                                        />
                                    </div>
                                    <DropDownSelect title="Project Type" options={ProjectTypes} handleChage={handleProjectTypeChange} />
                                    <DropDownSelect title="Platform" options={PlatformList} handleChage={handlePlatformChange} />

                                    <div className="flex items-center justify-center gap-5 my-5">
                                        <button
                                            className="pl-3 pr-4 h-button grow rounded-[4px] justify-center items-center gap-1 inline-flex bg-green-normal active:scale-95 transition duration-90 ease-in-out transform focus:outline-none text-xs font-medium text-center text-white uppercase disabled:text-white disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                                            onClick={handleCreate} disabled={creating || projectName === ""}
                                        >
                                            {creating ?
                                                <img src="/assets/spinner-white.svg" className="w-10 h-10" alt="spinner" /> :
                                                "Create"
                                            }
                                        </button>
                                        <button
                                            className="pl-3 pr-4 h-button grow rounded-[4px] justify-center items-center gap-1 inline-flex bg-[#1A1A37] active:scale-95 transition duration-90 ease-in-out transform focus:outline-none text-xs font-medium text-center text-white uppercase disabled:text-gray-border disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                                            disabled={creating}
                                            onClick={handleCancel}>
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            )
                        }
                        {
                            step === 1 &&
                            (
                                <div className="">
                                    <div className="flex items-center justify-center">
                                        <img src="/assets/spinner-white.svg" className="w-7 h-7" alt="spinner" />
                                        <label className="block text-sm text-gray-normal">
                                            { visiblePayment ? "Checking payment..." : "Pending activation" }
                                        </label>
                                    </div>
                                    {/* {
                                        expireTime > 0 &&
                                        <p className="m-auto text-sm font-normal text-center text-gray-normal">
                                            Expires in <span className="pl-1 text-lg text-white">{expireTimeMin}</span> minutes <span className="pl-1 text-lg text-white">{expireTimeSec}</span> seconds
                                        </p>
                                    } */}
                                    {
                                        isContact && (
                                            <div className="flex items-center justify-center pt-5">
                                                <label className="block text-sm text-gray-normal text-center">
                                                    Contact <a className="text-blue-400" rel="noreferrer" href="https://t.me/cryptodev63" target="_blank">@cryptodev63</a> on telegram to make payment. Thank you
                                                </label>
                                            </div>
                                        )
                                    }
                                    {
                                        visiblePayment &&
                                        <div className="flex items-center justify-center gap-2 mt-7">
                                            <div className="text-sm text-gray-normal">
                                                Address:&nbsp;
                                                <span className="pl-1 text-white">
                                                    {
                                                        depositWallet !== "" ?
                                                            ellipsisAddress(depositWallet) :
                                                            "0x1234...5678"
                                                    }
                                                </span>
                                            </div>
                                            {
                                                (copied["address"] ?
                                                    (<svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 mx-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                    </svg>) :
                                                    (<FaRegCopy className="w-3.5 h-3.5 transition ease-in-out transform cursor-pointer active:scale-95 duration-90 text-gray-normal" onClick={() => copyToClipboard("address", depositWallet)} />))
                                            }
                                        </div>
                                    }
                                    {
                                        visiblePayment &&
                                        <div className="flex items-center justify-center gap-2">
                                            <div className="text-sm text-gray-normal">
                                                Service Fee:&nbsp;
                                                <span className="pl-1 text-yellow-normal">3 SOL</span>
                                            </div>
                                            {
                                                (copied["fee"] ?
                                                    (<svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 mx-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                    </svg>) :
                                                    (<FaRegCopy className="w-3.5 h-3.5 transition ease-in-out transform cursor-pointer active:scale-95 duration-90 text-gray-normal" onClick={() => copyToClipboard("fee", "3")} />))
                                            }
                                        </div>
                                    }
                                    <div className="flex justify-center mt-7">
                                        <button
                                            className="pl-3 pr-4 h-button grow rounded-[4px] justify-center items-center gap-1 inline-flex bg-[#1A1A37] active:scale-95 transition duration-90 ease-in-out transform focus:outline-none text-xs font-medium text-center text-white uppercase disabled:text-gray-border disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                                            onClick={handleCancel}>
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            )
                        }
                        {
                            (step === 2 || step === 3) &&
                            (
                                <div className="">
                                    <div className="">
                                        {
                                            step === 2 ?
                                                (<p className="flex items-center justify-center gap-2 my-5 text-lg font-bold text-center uppercase text-green-normal">
                                                    <FaCheck />
                                                    Success!
                                                </p>) :
                                                (<p className="flex items-center justify-center gap-2 my-5 text-lg font-bold text-center uppercase text-green-normal">
                                                    <FaExclamationTriangle />
                                                    Failed!
                                                </p>)
                                        }
                                    </div>
                                    {
                                        step === 2 ?
                                            (
                                                <div className="flex justify-center">
                                                    <button
                                                        className="pl-3 pr-4 h-button grow rounded-[4px] justify-center items-center gap-1 inline-flex bg-[#1A1A37] active:scale-95 transition duration-90 ease-in-out transform focus:outline-none text-xs font-medium text-center text-white uppercase disabled:text-gray-border disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                                                        onClick={handleDone}>
                                                        Done
                                                    </button>
                                                </div>
                                            ) :
                                            (
                                                <div className="flex justify-center gap-5">
                                                    <button
                                                        className="pl-3 pr-4 h-button grow rounded-[4px] justify-center items-center gap-1 inline-flex bg-green-normal active:scale-95 transition duration-90 ease-in-out transform focus:outline-none text-xs font-medium text-center text-white uppercase disabled:text-gray-border disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                                                        onClick={handleRetry}>
                                                        Retry
                                                    </button>
                                                    <button
                                                        className="pl-3 pr-4 h-button grow rounded-[4px] justify-center items-center gap-1 inline-flex bg-[#1A1A37] active:scale-95 transition duration-90 ease-in-out transform focus:outline-none text-xs font-medium text-center text-white uppercase disabled:text-gray-border disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                                                        onClick={handleCancel}>
                                                        Cancel
                                                    </button>
                                                </div>
                                            )
                                    }

                                </div>
                            )
                        }
                    </div>
                </div>
            </div>
        </Modal>
    );
}
