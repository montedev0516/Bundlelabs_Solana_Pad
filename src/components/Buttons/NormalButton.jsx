const NormalButton = ({label, action, icon}) => {
    return (
        <button
            className="pl-3 pr-4 h-button rounded-[4px] justify-center items-center gap-1 inline-flex bg-[#1A1A37] active:scale-95 transition duration-90 ease-in-out transform focus:outline-none text-xs font-medium text-center text-white uppercase disabled:text-gray-border disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            onClick={action}>
            {icon}
            {label}
        </button>
    )
}

export default NormalButton