import {Link, useNavigate} from "react-router-dom";
import React from "react";
import {Card} from "./Card";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faHeart} from "@fortawesome/free-regular-svg-icons";
import {image_url} from "../../App";
import {faRubleSign} from "@fortawesome/free-solid-svg-icons";

export function ResultOffcanvas(props) {
    let navigate = useNavigate();

    switch (props.resultType) {
        case "search":
            return (
                <>
                    <div className="offcanvas-header" id="search-result-header">
                        <span>Результаты поиска: {props.result['items'] ? props.result.items.length : 0} </span>
                    </div>
                    <div className="offcanvas-body">
                        <div className="row gap-5">
                            {props.result['items'] && props.result.items.map(value => (
                                <Card item={value} basket={props.basket} addBasketHandler={props.addBasketHandler}/>
                            ))}
                            {props.result['items'] && props.result.total_pages > 1 && (
                                <Link to={"/catalog?search=" + props.search} className="card text-white rounded-3 d-flex justify-content-center align-items-center">
                                    <p className="text-white fs-4">Показать все</p>
                                    <p className="text-secondary fs-4">{props.result.total_items}</p>
                                </Link>
                            )}
                        </div>
                    </div>
                </>
            );
        case "catalog":
            let table_body = [];
            props.result.forEach((value, key) => {
                let link;
                let col;
                let last_item = value[0];
                switch (key) {
                    case "genres":
                        link = "/catalog?genre=";
                        col = 0;
                        last_item['title'] = 'Все игры - ';
                        last_item['link'] = '/catalog';
                        break;
                    case "publishers":
                        link = "/publisher/";
                        col = 1;
                        last_item['username'] = 'Все издатели - ';
                        last_item['link'] = '/publishers';
                        break;
                    case "developers":
                        link = "/developer/";
                        col = 2;
                        last_item['username'] = 'Все разработчики - ';
                        last_item['link'] = '/developers';
                        break;
                }
                table_body[col] = [];
                value.map((value, index, array) => {
                    if(index === array.length - 1) {
                        last_item['title'] ? last_item['title'] += value : last_item['username'] += value;
                        table_body[col].push(last_item);
                    } else {
                        value['link'] = link + value['id'];
                        table_body[col].push(value);
                    }
                })
            });
            return (
                <>
                    <table className="table" cellSpacing="0">
                        <thead>
                        <th key="genres">Жанры</th>
                        <th key="publishers">Издатели</th>
                        <th key="developers">Разработчики</th>
                        </thead>
                        <tbody>
                        {table_body.map(value => (
                            <tr>
                                {value.map(value => (
                                    <td key={value['id'] + value['link']}>
                                        <span className="text-decoration-none text-secondary" onClick={() => navigate(value['link'])}>
                                                {value['title'] ? value['title'] : value['username']}
                                        </span>
                                    </td>
                                ))}
                            </tr>
                        ))}
                        </tbody>
                    </table>

                </>
            );
        default:
            return <></>;
    }
}