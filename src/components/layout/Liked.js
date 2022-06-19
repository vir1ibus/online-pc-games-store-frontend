import $ from "jquery";
import { Offcanvas } from 'bootstrap';
import { Navigate } from "react-router-dom";
import {ItemCard} from "../element/ItemCard";
import React from "react";

export default function Liked(props) {

    if(props.authorizedUser || props.authorizedUser === undefined) {
        return (
            <main id="content">
                <h1 className="mb-3">Понравившиеся <span className="text-secondary">{props.liked.length}</span></h1>
                <div className="row gap-5">
                    {props.liked && props.liked.map(value => (
                        <ItemCard
                            item={value}
                            inBasket={props.inBasket}
                            addBasketHandler={props.addBasketHandler}
                            inLiked={props.inLiked}
                            addLiked={props.addLiked}
                            deleteLiked={props.deleteLiked}/>
                    ))}
                </div>

            </main>
        )
    } else {
        return (
            <Navigate to="/"/>
        )
    }

}