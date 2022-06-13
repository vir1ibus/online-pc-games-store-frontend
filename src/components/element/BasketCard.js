import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faRubleSign, faXmark} from "@fortawesome/free-solid-svg-icons";
import React from "react";
import {image_url} from "../../App";
import {Link} from "react-router-dom";
let $ = require( "jquery" );

export function BasketCard(props) {
    let item = props.item;
    let dataItemId = { 'data-item-id' : item['id'] };

    return (
        <div className="row text-white mt-3 basket-item border-top border-bottom border-2 border-secondary">
            <div className="col-2">
                <Link to={'/game/' + item['id']}>
                    <img src={ image_url + '/item/' + item['img'] } className="basket-item-img"/>
                </Link>
            </div>
            <div className="col-8">
                <p className="basket-item-title"><Link to={'/game/' + item['id']} className="text-white">{item['title']}</Link></p>
                <p className="basket-item-price">
                                    <span className="price">
                                        {item['discount'] ? Math.round(item['price'] - ((item['price'] / 100) * item['discount'])) : item['price']}<FontAwesomeIcon icon={faRubleSign}/>
                                    </span>
                    {item['discount'] ? (
                        <>
                            <span className="old-price">{item['price']}<FontAwesomeIcon icon={faRubleSign}/></span>
                            <span className="bg-primary discount p-2">{item['discount']}%</span>
                        </>
                    ) : (
                        <></>
                    )}
                </p>
                <p>
                    {'\t'} Регион активации: {'\t'}
                    <span className="text-secondary">{item['region_activation'].title}</span>
                    {'\t'} Сервис активации: {'\t'}
                    <span className="text-secondary">{item['service_activation'].title}</span>
                </p>
            </div>
            <div className="col-2 d-flex justify-content-end align-items-start">
                <button className="btn basket-item-delete" {...dataItemId} onClick={props.deleteBasketHandler}>
                    <FontAwesomeIcon className="text-secondary" icon={faXmark}/>
                </button>
            </div>
        </div>
    );
}