import React, {Component, useEffect, useState} from 'react';
import Carousel from 'react-bootstrap/Carousel'
import {image_url} from "../../App";
import {findItemsByFilter, getItem, getItemForBasket} from "../../scripts/api";
import {Link, useNavigate} from "react-router-dom";
import {Card} from "../element/Card";

export default function HomePage(props) {

    let navigate = useNavigate();

    const [carouserItems, setCarouselItems] = useState([]);
    const [items, setItems] = useState([]);

    useEffect(() => {
        let arr = [];
        getItem("dark-souls-3").then(response => {
            arr[0] = response;
            getItem("detroit-become-human").then(response => {
                arr[1] = response;
                getItem("hitman-absolution").then(response => {
                    arr[2] = response;
                    setCarouselItems(arr);
                });
            });
        });
        findItemsByFilter([]).then(response => {
            setItems(response['items']);
        })
    }, []);

    return (
        <>
            <Carousel fade variant="light" indicators={false}
                      nextIcon={<span aria-hidden="true" className="bi bi-arrow-right-circle control-icon"/>}
                      prevIcon={<span aria-hidden="true" className="bi bi-arrow-left-circle control-icon"/>}>
                {carouserItems.length > 0 && carouserItems.map(value => (
                    <Carousel.Item key={value['id']} onClick={() => navigate("/game/" + value['id'])}>
                        <div className="carousel-item-gradient">
                                <img
                                    className="d-block w-100"
                                    src={image_url + "item/screenshot/" + value['screenshots'][0]['path']}
                                    alt="First slide"
                                />
                        </div>
                        <Carousel.Caption>
                            <h3>{value['title']}</h3>
                            {props.inBasket(value['id']) ?
                                (<Link to="/basket" className="btn btn-primary rounded-pill">Добавлено</Link>) :
                                (<button className="btn btn-primary rounded-pill" data-item-id={value['id']} onClick={props.addBasketHandler}>В корзину</button>)}
                        </Carousel.Caption>
                    </Carousel.Item>
                ))}
            </Carousel>
            <div className="d-flex flex-column align-items-center mt-5">
                <div className="w-75 d-flex flex-column align-items-center">
                    <ul className="nav nav-pills mb-3" id="pills-tab" role="tablist">
                        <li className="nav-item" role="presentation">
                            <button className="nav-link active fs-5" id="pills-new-tab" data-bs-toggle="pill"
                                    data-bs-target="#pills-new" type="button" role="tab" aria-controls="pills-new"
                                    aria-selected="true">Новинки
                            </button>
                        </li>
                        <li className="nav-item" role="presentation">
                            <button className="nav-link fs-5" id="pills-sales-leaders-tab" data-bs-toggle="pill"
                                    data-bs-target="#pills-sales-leaders" type="button" role="tab" aria-controls="pills-sales-leaders"
                                    aria-selected="false">Лидеры продаж
                            </button>
                        </li>
                        <li className="nav-item" role="presentation">
                            <button className="nav-link fs-5" id="pills-latest-arrivals-tab" data-bs-toggle="pill"
                                    data-bs-target="#pills-latest-arrivals" type="button" role="tab" aria-controls="pills-latest-arrivals"
                                    aria-selected="false">Последние поступления
                            </button>
                        </li>
                    </ul>
                    <div className="tab-content w-100" id="pills-tabContent">
                        <div className="tab-pane fade show active overflow-auto w-100" id="pills-new" role="tabpanel"
                             aria-labelledby="pills-new-tab">
                            <div className="d-flex mb-3">
                                {items.length > 0 && items.map(value => (
                                    <>
                                        <div className="col-2 mt-5">
                                            <Card item={value} inBasket={props.inBasket} addBasketHandler={props.addBasketHandler}/>
                                        </div>
                                        <div className="col-2 mt-5">
                                            <Card item={value} inBasket={props.inBasket} addBasketHandler={props.addBasketHandler}/>
                                        </div>
                                        <div className="col-2 mt-5">
                                            <Card item={value} inBasket={props.inBasket} addBasketHandler={props.addBasketHandler}/>
                                        </div>
                                    </>
                                ))}
                            </div>
                        </div>
                        <div className="tab-pane fade overflow-auto w-100" id="pills-sales-leaders" role="tabpanel"
                             aria-labelledby="pills-sales-leaders-tab">
                            <div className="d-flex mb-3">
                                {items.length > 0 && items.map(value => (
                                    <div className="col-2 mt-5">
                                        <Card item={value} inBasket={props.inBasket} addBasketHandler={props.addBasketHandler}/>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="tab-pane fade overflow-auto w-100" id="pills-latest-arrivals" role="tabpanel"
                             aria-labelledby="pills-latest-arrivals-tab">
                            <div className="d-flex mb-3">
                                {items.length > 0 && items.map(value => (
                                    <div className="col-2 mt-5">
                                        <Card item={value} inBasket={props.inBasket} addBasketHandler={props.addBasketHandler}/>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}