import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
// import { IoIosRefresh } from "react-icons/io";
import { FaExclamationTriangle } from "react-icons/fa";
import { IoTrashOutline } from "react-icons/io5";
import { TbTrashX } from "react-icons/tb";
import axios from "axios";

import ConfirmDialog from "../components/Dialogs/ConfirmDialog";
import { AppContext } from "../providers/AppContext";

export default function LogPage({ className }) {
    const {
        SERVER_URL,
        setLoadingPrompt,
        setOpenLoading,
        logs,
        setLogs,
    } = useContext(AppContext);
    const [logAllChecked, setLogAllChecked] = useState(false);
    const [logChecked, setLogChecked] = useState([]);
    const [confirmDialog, setConfirmDialog] = useState(false);
    const [confirmDialogTitle, setConfirmDialogTitle] = useState("");
    const [confirmDialogMessage, setConfirmDialogMessage] = useState("");
    const [confirmDialogAction, setConfirmDialogAction] = useState("");

    useEffect(() => {
        if (logs.length !== logChecked.length) {
            const newLogChecked = logs.map(() => false);
            setLogChecked(newLogChecked);
            setLogAllChecked(false);
        }
    }, [logs, logChecked.length]);

    const handleLogAllChecked = (e) => {
        const newLogAllChecked = !logAllChecked;
        setLogAllChecked(newLogAllChecked);
        setLogChecked(logChecked.map(() => newLogAllChecked));
    };

    const handleLogChanged = (index) => {
        let newLogChecked = [...logChecked];
        newLogChecked[index] = !newLogChecked[index];
        setLogChecked(newLogChecked);

        let newLogAllChecked = true;
        for (let i = 0; i < newLogChecked.length; i++)
            newLogAllChecked &&= newLogChecked[i];
        setLogAllChecked(newLogAllChecked);
    };

    const handleConfirmDialogOK = async () => {
        setConfirmDialog(false);

        const accessToken = localStorage.getItem("access-token");
        if (confirmDialogAction === "delete-all") {
            const selectedLogs = logs.map(item => item._id);
            setLoadingPrompt("Deleting all logs...");
            setOpenLoading(true);
            try {
                const { data } = await axios.post(`${SERVER_URL}/api/v1/misc/delete-logs`,
                    {
                        selectedLogs,
                    },
                    {
                        headers: {
                            "Content-Type": "application/json",
                            "MW-USER-ID": accessToken,
                        },
                    }
                );
                if (data.logs)
                    setLogs(data.logs);
                toast.success("All logs have been deleted successfully");
            }
            catch (err) {
                console.log(err);
                toast.warn("Failed to delete logs");
            }
            setOpenLoading(false);
        }
        else if (confirmDialogAction === "delete") {
            const selectedLogs = [];
            for (let i = 0; i < logs.length; i++) {
                if (logChecked[i])
                    selectedLogs.push(logs[i]._id);
            }

            setLoadingPrompt("Deleting logs...");
            setOpenLoading(true);
            try {
                const { data } = await axios.post(`${SERVER_URL}/api/v1/misc/delete-logs`,
                    {
                        selectedLogs
                    },
                    {
                        headers: {
                            "Content-Type": "application/json",
                            "MW-USER-ID": accessToken,
                        },
                    }
                );
                if (data.logs)
                    setLogs(data.logs);
                toast.success("Logs have been deleted successfully");
            }
            catch (err) {
                console.log(err);
                toast.warn("Failed to delete logs");
            }
            setOpenLoading(false);
        }
    };

    const handleDelete = () => {
        const selected = logChecked.filter(item => item === true);
        if (selected.length === 0) {
            toast.warn("Please select logs to delete");
            return;
        }

        setConfirmDialogTitle("Delete Selected Logs");
        setConfirmDialogMessage("Are you sure that you want to delete selected logs?");
        setConfirmDialogAction("delete");
        setConfirmDialog(true);
    };

    const handleDeleteAll = () => {
        setConfirmDialogTitle("Delete All Logs");
        setConfirmDialogMessage("Are you sure that you want to delete all logs?");
        setConfirmDialogAction("delete-all");
        setConfirmDialog(true);
    };

    return (
        <div className={`${className} flex flex-col text-white rounded-[4px] border border-gray-highlight p-4 pb-3`}>
            <ConfirmDialog isOpen={confirmDialog}
                title={confirmDialogTitle}
                message={confirmDialogMessage}
                onOK={handleConfirmDialogOK}
                onCancel={() => setConfirmDialog(false)} />
            <div className="flex flex-col">
                <div className="flex items-start justify-between w-full h-auto">
                    <div className="flex items-center font-sans text-xs font-medium text-white">
                        <div className="font-bold uppercase">Logs</div>
                    </div>
                </div>
                <div className="flex flex-row justify-end w-full gap-2 mt-3 mb-3 font-sans">
                    <div className="flex flex-col justify-end gap-2 lg:items-center lg:flex-row">
                        <button
                            className="pl-3 pr-4 h-button rounded-[4px] justify-center items-center gap-1 inline-flex bg-[#1A1A37] active:scale-95 transition duration-90 ease-in-out transform focus:outline-none text-xs font-medium text-center text-white uppercase disabled:text-gray-border disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                            onClick={handleDelete}
                        >
                            <IoTrashOutline className="text-lg text-green-normal" />
                            Delete
                        </button>
                        <button
                            className="pl-3 pr-4 h-button rounded-[4px] justify-center items-center gap-1 inline-flex bg-[#1A1A37] active:scale-95 transition duration-90 ease-in-out transform focus:outline-none text-xs font-medium text-center text-white uppercase disabled:text-gray-border disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                            onClick={handleDeleteAll}
                        >
                            <TbTrashX className="text-lg text-green-normal" />
                            Delete All
                        </button>
                    </div>
                </div>
                <div className="w-full overflow-visible font-sans">
                    <div className="flex flex-col w-full h-full text-white bg-transparent bg-clip-border">
                        <div className="relative border border-gray-highlight">
                            <div className="h-[calc(100vh-435px)] 2xl:h-[calc(100vh-225px)] overflow-y-auto">
                                {(logs.length === 0) &&
                                    <div className="absolute flex items-center justify-center gap-2 my-3 text-base font-bold text-center uppercase -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 text-gray-border">
                                        <FaExclamationTriangle className="text-sm opacity-50 text-green-normal" /> No Logs
                                    </div>
                                }
                                <table className="min-w-[700px] w-full text-xs">
                                    <thead className=" text-gray-normal">
                                        <tr className="uppercase h-7 bg-[#1A1A37] sticky top-0 z-10">
                                            <th className="w-8 text-center">
                                                <div className="flex items-center justify-center">
                                                    <input type="checkbox"
                                                        className="w-4 h-4 outline-none bg-gray-highlight opacity-20 accent-green-normal ring-0 rounded-lg"
                                                        checked={logAllChecked}
                                                        onChange={handleLogAllChecked}
                                                    />
                                                </div>
                                            </th>
                                            <th className="w-8">
                                                <div className="leading-none text-center">
                                                    #
                                                </div>
                                            </th>
                                            <th className="">
                                                <div className="leading-none text-center">
                                                    Date/Time
                                                </div>
                                            </th>
                                            <th className="">
                                                <div className="leading-none text-center">
                                                    Type
                                                </div>
                                            </th>
                                            <th className="">
                                                <div className="leading-none text-center">
                                                    Title
                                                </div>
                                            </th>
                                            <th className="w-[50%]">
                                                <div className="leading-none text-center">
                                                    Description
                                                </div>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-xs text-white">
                                        {
                                            logs.map((item, index) => {
                                                return (
                                                    <tr key={index}
                                                        className={`${index % 2 === 1 && "bg-[#ffffff02]"} hover:bg-[#ffffff08] ${logChecked[index] && "!bg-[#00000030]"} h-8`}
                                                    >
                                                        <td className="text-center">
                                                            <div className="flex items-center justify-center">
                                                                <input type="checkbox"
                                                                    className="w-4 h-4 outline-none bg-gray-highlight opacity-20 accent-green-normal ring-0 rounded-lg"
                                                                    checked={logChecked[index]}
                                                                    onChange={(e) => handleLogChanged(index)}
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
                                                                    {new Date(item.time).toLocaleString()}
                                                                </p>
                                                            </div>
                                                        </td>
                                                        <td className="">
                                                            <div className="flex items-center justify-center gap-1 font-sans antialiased font-normal leading-normal text-gray-normal">
                                                                <p className="bg-transparent border-none outline-none">
                                                                    {item.level}
                                                                </p>
                                                            </div>
                                                        </td>
                                                        <td className="">
                                                            <div className="flex items-center justify-center gap-1 font-sans antialiased font-normal leading-normal text-gray-normal">
                                                                <p className="bg-transparent border-none outline-none">
                                                                    {item.title}
                                                                </p>
                                                            </div>
                                                        </td>
                                                        <td className="">
                                                            <div className="flex items-center justify-center gap-1 font-sans antialiased font-normal leading-normal text-gray-normal">
                                                                <div className="bg-transparent border-none outline-none">
                                                                    {item.description}
                                                                </div>
                                                            </div>
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
            </div>
        </div>
    );
}
