import React, {Component, useEffect, useState} from 'react';
import Carousel from 'react-bootstrap/Carousel'
import {image_url} from "../../App";
import {findItemsByFilter, getCarousel, getItem, getItemForBasket} from "../../scripts/api";
import {Link, useNavigate} from "react-router-dom";
import {ItemCard} from "../element/ItemCard";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPencilSquare} from "@fortawesome/free-solid-svg-icons";

export default function HomePage(props) {

    let navigate = useNavigate();

    const [carouserItems, setCarouselItems] = useState([]);
    const [items, setItems] = useState([]);

    useEffect(() => {
        getCarousel().then(response => {
            setCarouselItems(response);
        })
        findItemsByFilter([]).then(response => {
            setItems(response['items']);
        })
    }, []);

    return (
        <>
            <Carousel fade variant="light"  indicators={false}
                      nextIcon={<span aria-hidden="true" className="bi bi-arrow-right-circle control-icon"/>}
                      prevIcon={<span aria-hidden="true" className="bi bi-arrow-left-circle control-icon"/>}>
                {carouserItems.length > 0 && carouserItems.map((value, index) => (
                    <Carousel.Item key={value['item']['id']} onClick={() => navigate("/game/" + value['item']['id'])}>
                        <div className="carousel-item-gradient">
                                <img
                                    className="d-block w-100"
                                    src={image_url + "item/screenshot/" + value['screenshot']['path']}
                                    alt={index + " slide"}
                                />
                        </div>
                        <Carousel.Caption>
                            <h3>{value['item']['title']}</h3>
                            {props.inBasket(value['item']['id']) ?
                                (<Link to="/basket" className="btn btn-primary rounded-pill">Добавлено</Link>) :
                                (<button className="btn btn-primary rounded-pill" data-item-id={value['item']['id']} onClick={props.addBasketHandler}>В корзину</button>)}
                        </Carousel.Caption>
                    </Carousel.Item>
                ))}
            </Carousel>
            <div className="d-flex flex-column align-items-center mt-5">
                <div className="w-100 d-flex flex-column align-items-center">
                    <ul className="d-flex justify-content-center nav nav-pills mb-3" id="pills-tab" role="tablist">
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
                    <div className="tab-content" id="pills-tabContent">
                        <div className="tab-pane fade show active overflow-auto w-100" id="pills-new" role="tabpanel"
                             aria-labelledby="pills-new-tab">
                            <div className="row flex-nowrap mb-3">
                                {items.length > 0 && items.map(value => (
                                    <div className="col-xl-3 col-lg-4 col-md-5 col-sm-6 col-10 mt-3">
                                        <ItemCard item={value} inBasket={props.inBasket} addBasketHandler={props.addBasketHandler}/>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="tab-pane fade overflow-auto w-100" id="pills-sales-leaders" role="tabpanel"
                             aria-labelledby="pills-sales-leaders-tab">
                            <div className="row flex-nowrap mb-3">
                                {items.length > 0 && items.map(value => (
                                    <div className="col-xl-3 col-lg-4 col-md-5 col-sm-6 col-10 mt-3">
                                        <ItemCard item={value} inBasket={props.inBasket} addBasketHandler={props.addBasketHandler}/>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="tab-pane fade overflow-auto w-100" id="pills-latest-arrivals" role="tabpanel"
                             aria-labelledby="pills-latest-arrivals-tab">
                            <div className="row flex-nowrap mb-3">
                                {items.length > 0 && items.map(value => (
                                    <div className="col-xl-3 col-lg-4 col-md-5 col-sm-6 col-10 mt-3">
                                        <ItemCard item={value} inBasket={props.inBasket} addBasketHandler={props.addBasketHandler}/>
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