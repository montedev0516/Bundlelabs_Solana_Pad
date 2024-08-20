const Steps = ({steps, step}) => {
    return (
        <ul className="relative flex flex-row px-3 mt-7 gap-x-2">
            {
                steps.map((item, index) => {
                    return (
                        <li key={index} className={`flex ${index < 2 ? "flex-1" : ""} items-center gap-x-2 shrink basis-0`}>
                            <span className="inline-flex items-center text-xs align-middle min-w-7 min-h-7">
                                <span className={`flex items-center text-sm justify-center flex-shrink-0 font-bold rounded-full size-7 ${index <= step ? (step === 3 && index === 2 ? "text-white bg-green-normal" : "text-gray-dark bg-green-normal") : "text-gray-normal bg-gray-highlight"}`}>
                                    {
                                        step === 2 && index === 2 ?
                                            (
                                                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mx-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                </svg>
                                            ) :
                                            step === 3 && index === 2 ?
                                                (
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0 size-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                                        <path d="M18 6 6 18"></path>
                                                        <path d="m6 6 12 12"></path>
                                                    </svg>
                                                ) :
                                                (
                                                    <span className="">
                                                        {index + 1}
                                                    </span>
                                                )
                                    }

                                    <svg className="flex-shrink-0 hidden size-3"
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="3"
                                        strokeLinecap="round"
                                        strokeLinejoin="round">
                                        <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                </span>
                                <span className={`text-sm font-medium ms-2 ${index <= step ? index === step ? "text-white" : "text-green-normal" : "text-gray-500"}`}>
                                    {step === 3 && index === 2 ? "Failed" : item}
                                </span>
                            </span>
                            {index < 2 && <div className={`"flex-1 w-6 h-px ${index + 1 <= step ? "bg-green-normal" : "bg-gray-border"}`} />}
                        </li>
                    );
                })
            }
        </ul>
    )
}

export default Steps