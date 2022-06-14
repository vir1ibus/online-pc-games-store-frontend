import {image_url} from "../../App";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faRubleSign} from "@fortawesome/free-solid-svg-icons";
import {faHeart} from "@fortawesome/free-regular-svg-icons";
import React from "react";
import {Link} from "react-router-dom";

export function Card(props) {
    let item = props.item;

    return (
        <div className="card text-white rounded-3" key={item['id']}>
            <div className="card-fade d-flex justify-content-center align-items-center">
                <a className="card-fade-link" href={"/game/" + item['id']}/>
                <button className="btn bg-transparent position-absolute top-0 end-0 like-item"><FontAwesomeIcon icon={faHeart}/></button>
                {item['count'] > 0 ?
                    (<>
                        {props.inBasket(item['id']) ?
                            (<Link to="/basket" className="btn btn-primary add-basket-item">Добавлено</Link>) :
                            (<button className="btn btn-primary add-basket-item" data-item-id={item['id']} onClick={props.addBasketHandler}>В корзину</button>)}
                    </>) :
                    (<button className="btn btn-primary" disabled>Нет в наличии</button>)
                }
            </div>
            <a href={"/game/" + item['id']}>
                <img src={ image_url + '/item/' + item['img'] } className="card-img" alt={item['title']}/>
            </a>
            <div className="card-img-bottom">
                <a href={"/game/" + item['id']}>
                    <span className="card-title">{item['title']}</span>
                    <span className="card-text row align-self-end">
                        <span className="item-price col-6 text-start">{Math.round(item['price'] - ((item['price'] / 100) * item['discount']))} <FontAwesomeIcon icon={faRubleSign}/></span>
                        <span className="item-discount col-6 text-end"><span className="bg-primary p-1 rounded-3">{item['discount']}%</span></span>
                    </span>
                </a>
            </div>
        </div>
    );
}