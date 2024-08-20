const NormalInput = ({title, value, action}) => {
    return (
        <div className="col-span-12 md:col-span-6 2xl:col-span-3">
            <div className="font-sans text-xs uppercase text-gray-normal">
                {title}<span className="pl-1 text-green-normal">*</span>
            </div>
            <input
                className="outline-none border border-gray-border font-sans text-white placeholder:text-gray-border text-sm px-2.5 bg-transparent w-full h-button mt-1 rounded-lg"
                placeholder={`Enter ${title}`}
                value={value}
                onChange={action}
            />
        </div>
    )
}

export default NormalInput