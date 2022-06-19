import React, {useEffect, useState} from "react";
import {getPurchases} from "../../scripts/api";
import {ItemCard} from "./ItemCard";
import {Link} from "react-router-dom";

export default function PurchaseHistoryTab(props) {

    const [purchaseHistory, setPurchaseHistory] = useState([]);

    useEffect(() => {
        getPurchases(props.token).then(response => {
            response.sort((a, b) => {
                return a['id'] - b['id'];
            })
            setPurchaseHistory(response);
        })
    }, [])

    function renderStatus(status, link = "") {
        switch (status) {
            case "PAID":
                return <span className="text-success">Оплачено</span>
            case "WAITING":
                return <span onClick={() => { window.location.href = link }} className="text-muted wait-paid">Ожидает оплаты</span>
            case "REJECTED":
                return <span className="text-warning">Ошибка оплаты</span>
        }
    }

    if(purchaseHistory.length > 0) {
        return (
            <div className="profile-content bg-dark border border-2 border-secondary p-4">
                {purchaseHistory.map(value => (
                    <div className="d-flex flex-column mb-3">
                        <span className="fs-4 d-flex justify-content-around">
                            <span>
                                Заказ #<span className="text-secondary">{value['id']}</span>
                            </span>
                            <span>
                                Дата: <span className="text-secondary">{new Date(Date.parse(value['date_purchase'])).toLocaleString('ru-RU')}</span>
                            </span>
                            <span>
                                Статус: <span className="text-secondary">{renderStatus(value['status'], value['link_payment_form'])}</span>
                            </span>
                        </span>
                        <div className="overflow-auto w-100">
                            <div className="row flex-nowrap gap-3 m-3">
                                {value['items'].map(item => (
                                    <ItemCard
                                        item={item}
                                        inBasket={props.inBasket}
                                        addBasketHandler={props.addBasketHandler}
                                        inLiked={props.inLiked}
                                        addLiked={props.addLiked}
                                        deleteLiked={props.deleteLiked}/>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        )
    } else {
        return (
            <div className="profile-content bg-dark border border-2 border-secondary p-4 text-center">
                <span className="fs-1">Заказов нет</span>
            </div>
        )
    }
}