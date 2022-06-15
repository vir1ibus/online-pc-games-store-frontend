import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faRubleSign, faXmark} from "@fortawesome/free-solid-svg-icons";
import React, {useEffect, useState} from "react";
import {BasketCard} from "../element/BasketCard";
import { Offcanvas, Collapse, Modal } from 'bootstrap';
import {Link, useNavigate} from "react-router-dom";
import {buy} from "../../scripts/api";
import {useCookies} from "react-cookie";

let $ = require( "jquery" );

export function Basket(props) {

    const [sum, setSum] = useState(0);
    const [pay, setPay] = useState(false);
    const [processPayment, setProcessPayment] = useState(false);

    useEffect(() => {
        let sum = 0;
        props.basket.forEach(item => {
            if(item['discount']) {
                sum += Math.round(item['price'] - ((item['price'] / 100) * item['discount']));
            } else {
                sum += parseInt(item['price']);
            }
        });
        setSum(sum);
    }, [props.basket]);

    useEffect(() => {
        if($('#pay-qiwi').length) {
            Collapse.getOrCreateInstance($('#pay-qiwi')).show();
        }
    }, [pay])

    function checkout(event) {
        if(props.authorizedUser === null) {
            Offcanvas.getOrCreateInstance($('#authentication')).show();
        } else {
            setPay(true);
        }
    }

    useEffect(() => {
        if(processPayment) {
            buy(props.token).then(response => {
                window.location.href = response;
            });
        }
    }, [processPayment]);

    function payWithQiwi() {
        setProcessPayment(true);
    }

    return (
        <main id="content">
            <div className="row h-100">
                <div className="col-10">
                    <h1>Мой заказ <span className="text-secondary">{props.basket.length}</span></h1>
                    {props.basket.map(item => (
                        <BasketCard key={item['id']} item={item} deleteBasketHandler={props.deleteBasketHandler}/>
                    ))}
                </div>
                <div className="col-2">
                    <div className="bg-dark basket-result-container p-4 d-flex flex-column justify-content-between position-fixed">
                        <span className="basket-result row"><span className="col-6 text-start fs-4">Итого</span><span className="col-6 text-end fs-4">{sum}<FontAwesomeIcon icon={faRubleSign}/></span></span>
                        <div className="mt-5">
                            {props.basket.length > 0 ?
                                (<button className="btn btn-primary basket-checkout fs-5 w-100 mb-3" onClick={checkout}>Оформить заказ</button>) :
                                (<button className="btn btn-primary basket-checkout fs-5 w-100 mb-3" disabled={true}>Оформить заказ</button>)}
                            {pay && (
                                <div className="collapse d-flex flex-column" id="pay-qiwi">
                                    <button id="pay-qiwi-button" className="btn btn-primary basket-checkout fs-5" onClick={payWithQiwi}>Оплатить через Qiwi</button>
                                    <img className="mt-2" id="pay-icons" src={process.env.PUBLIC_URL + '/img/pay-icons.svg'}/>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}