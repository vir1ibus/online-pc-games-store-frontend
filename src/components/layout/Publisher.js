import {useNavigate, useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {getItem, getPublisher} from "../../scripts/api";
import {image_url} from "../../App";
import {Card} from "../element/Card";

export default function Publisher(props) {

    let navigate = useNavigate();
    let params = useParams();

    const [publisher, setPublisher] = useState(null);

    useEffect(() => {
        getPublisher(params.publisherId).then(response => {
            setPublisher(response);
        }, () => {
            navigate("/not-found");
        });
    }, [params])

    if(publisher)
    return (
        <main id="content">
            <div className="d-flex flex-column align-items-center">
                {publisher['img'] && (
                    <div className="profile-image-container d-flex justify-content-center align-items-center rounded-circle">
                        <img src={image_url + "publisher/" + publisher['img']} className="profile-image"/>
                    </div>
                )}
                <span className="fs-1">{publisher['title']}</span>
                <div className="mt-5 w-100 d-flex flex-column align-items-center">
                    <span className="fs-4 mb-5">Игры от {publisher['title']} <span className="text-secondary">{publisher['count_items']}</span></span>
                    <div className="d-flex flex-wrap w-100 gap-4 justify-content-center">
                        {publisher['items'].map(value => (
                            <>
                            <Card item={value} inBasket={props.inBasket} addBasketHandler={props.addBasketHandler}/>
                            <Card item={value} inBasket={props.inBasket} addBasketHandler={props.addBasketHandler}/>
                            <Card item={value} inBasket={props.inBasket} addBasketHandler={props.addBasketHandler}/>
                            <Card item={value} inBasket={props.inBasket} addBasketHandler={props.addBasketHandler}/>
                            <Card item={value} inBasket={props.inBasket} addBasketHandler={props.addBasketHandler}/>
                            <Card item={value} inBasket={props.inBasket} addBasketHandler={props.addBasketHandler}/>
                            <Card item={value} inBasket={props.inBasket} addBasketHandler={props.addBasketHandler}/>
                            <Card item={value} inBasket={props.inBasket} addBasketHandler={props.addBasketHandler}/>
                            <Card item={value} inBasket={props.inBasket} addBasketHandler={props.addBasketHandler}/>
                            <Card item={value} inBasket={props.inBasket} addBasketHandler={props.addBasketHandler}/>
                            <Card item={value} inBasket={props.inBasket} addBasketHandler={props.addBasketHandler}/>
                            <Card item={value} inBasket={props.inBasket} addBasketHandler={props.addBasketHandler}/>
                            <Card item={value} inBasket={props.inBasket} addBasketHandler={props.addBasketHandler}/>
                            <Card item={value} inBasket={props.inBasket} addBasketHandler={props.addBasketHandler}/>
                            <Card item={value} inBasket={props.inBasket} addBasketHandler={props.addBasketHandler}/>
                            <Card item={value} inBasket={props.inBasket} addBasketHandler={props.addBasketHandler}/>
                            <Card item={value} inBasket={props.inBasket} addBasketHandler={props.addBasketHandler}/>
                            <Card item={value} inBasket={props.inBasket} addBasketHandler={props.addBasketHandler}/>
                            <Card item={value} inBasket={props.inBasket} addBasketHandler={props.addBasketHandler}/>
                            <Card item={value} inBasket={props.inBasket} addBasketHandler={props.addBasketHandler}/>
                            </>
                        ))}
                    </div>
                </div>

            </div>
        </main>
    )
}