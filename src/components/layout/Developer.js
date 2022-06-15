import {useNavigate, useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {getDeveloper, getPublisher} from "../../scripts/api";
import {image_url} from "../../App";
import {Card} from "../element/Card";

export default function Developer(props) {

    let navigate = useNavigate();
    let params = useParams();
    const [developer, setDeveloper] = useState(null);

    useEffect(() => {
        getDeveloper(params.developerId).then(response => {
            setDeveloper(response);
        }, () => {
            navigate("/not-found");
        });
    }, [params])

    if(developer)
    return (
        <main id="content">
            <div className="d-flex flex-column align-items-center">
                {developer['img'] && (
                    <div className="profile-image-container d-flex justify-content-center align-items-center rounded-circle">
                        <img src={image_url + "developer/" + developer['img']} className="profile-image"/>
                    </div>
                )}
                <span className="fs-1">Разработчик {developer['title']}</span>
                <div className="mt-5 w-100 d-flex flex-column align-items-center">
                    <span className="fs-4 mb-5">Игры от {developer['title']} <span className="text-secondary">{developer['count_items']}</span></span>
                    <div className="d-flex flex-wrap w-100 gap-4 justify-content-center">
                        {developer['items'].map(value => (
                            <Card item={value} inBasket={props.inBasket} addBasketHandler={props.addBasketHandler}/>
                        ))}
                    </div>
                </div>

            </div>
        </main>
    )
}