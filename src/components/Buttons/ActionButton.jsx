const ActionButton = ({ label, action }) => {
    return (
        <button
            className="font-sans text-xs font-medium text-center text-white uppercase px-6 h-10 rounded-[4px] justify-center items-center gap-2.5 bg-green-normal active:scale-95 transition duration-90 ease-in-out transform focus:outline-none"
            onClick={action}
        >
            {label}
        </button>
    )
}

export default ActionButton