import React, {useEffect} from "react";

const PreloaderLogin = ({img}) => {


    return (
        <div className="preloader-back">
            <div className="preloader-heart">
                <img src={img} />
            </div>
        </div>
    )
}

export default PreloaderLogin