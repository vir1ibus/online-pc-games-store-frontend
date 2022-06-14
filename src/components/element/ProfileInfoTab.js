import React, {useEffect, useState} from "react";

export default function ProfileInfoTab(props) {
    const [countPurchasedGames, setCountPurchasedGames] = useState(0);

    useEffect(() => {
        if(props.authorizedUser) {
            let count = 0;
            props.authorizedUser.purchases.map(value => {
                if(value['paid']) count += value['items'].length;
            });
            setCountPurchasedGames(count);
        }
    }, [props.authorizedUser])

    return (
        <div className="profile-content bg-dark border border-2 border-secondary p-4">
            <h1 className="text-center border-bottom border-2 border-secondary pb-2">{props.authorizedUser.username}</h1>
            <div className="row justify-content-center align-items-center">
                <div className="d-flex flex-column w-auto text-center">
                            <span className="value-statistic">
                                {countPurchasedGames}
                            </span>
                    <span className="label-statistic">Игр куплено</span>
                </div>
                <div className="d-flex flex-column w-auto text-center">
                    <span className="value-statistic">{props.authorizedUser.reviews.length}</span>
                    <span className="label-statistic">Отзывов оставлено</span>
                </div>
            </div>
        </div>
    );
}