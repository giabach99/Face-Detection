import React from "react";

const Rank = ({name, entries}) => {
    return (
        <div>
            <div className="white f3">
                {`${name}, you have used the service...`}
            </div>
            <div className="white f1">                
                {
                    entries <= 1
                    ? `${entries} time`
                    : `${entries} times`
                }
            </div>
        </div>
    )
}

export default Rank;