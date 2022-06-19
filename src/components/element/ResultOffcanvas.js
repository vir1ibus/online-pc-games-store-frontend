import {Link, useNavigate} from "react-router-dom";
import React from "react";
import {ItemCard} from "./ItemCard";

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
                                <ItemCard item={value} basket={props.basket} addBasketHandler={props.addBasketHandler} inBasket={props.inBasket}/>
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
            return (
                <>
                    <div className="offcanvas-header justify-content-evenly" id="search-result-header">
                    </div>
                    <div className="offcanvas-body row">
                        {props.result && (
                            <>
                                <div className="d-flex flex-column col-4 text-center">
                                    <span className="fs-3">Жанры</span>
                                    {props.result.get('genres')['values'].map(genre => (
                                        <Link to={"/catalog?genre=" + genre['id']} className="text-decoration-none text-secondary mb-2">
                                            {genre['title']}
                                        </Link>
                                    ))}
                                    <Link to={"/catalog"} className="text-decoration-none text-secondary mb-2">
                                        Все игры - {props.result.get('genres')['total_items']}
                                    </Link>
                                </div>
                                <div className="d-flex flex-column col-4 text-center">
                                    <span className="fs-3">Издатели</span>
                                    {props.result.get('publishers')['values'].map(publisher => (
                                            <Link to={"/publisher/" + publisher['id']} className="text-decoration-none text-secondary mb-2">
                                                {publisher['title']}
                                            </Link>
                                        ))}
                                    <Link to={"/publishers"} className="text-decoration-none text-secondary mb-2">
                                        Все издатели - {props.result.get('publishers')['total_elements']}
                                    </Link>
                                </div>
                                <div className="d-flex flex-column col-4 text-center">
                                    <span className="fs-3">Разработчики</span>
                                    {props.result.get('developers')['values'].map(developer => (
                                            <Link to={"/developer/" + developer['id']} className="text-decoration-none text-secondary mb-2">
                                                {developer['title']}
                                            </Link>
                                        ))}
                                    <Link to={"/developers"} className="text-decoration-none text-secondary mb-2">
                                        Все разработчики - {props.result.get('developers')['total_elements']}
                                    </Link>
                                </div>
                            </>
                        )}
                    </div>
                </>
            );
        default:
            return <></>;
    }
}