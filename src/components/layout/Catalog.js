import {useSearchParams} from "react-router-dom";
import {findItemsByFilter, getCategory} from "../../scripts/api";
import {Card} from "../element/Card";
import React, {useEffect, useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faRubleSign} from "@fortawesome/free-solid-svg-icons";

let $ = require( "jquery" );

export default function Catalog(props) {

    const searchRequestHighlight = { color: '#ea39b8' }
    const [searchParams, setSearchParams] = useSearchParams();
    const [items, setItems] = useState([]);
    const [totalItems, setTotalItems] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const [category, setCategory] = useState(null);

    useEffect(() => {
        let filters = { 'sort' : 'title-asc' };
        searchParams.forEach((value, key) => {
            if(!Array.isArray(filters[key])) {
                filters[key] = [];
            }
            filters[key].push(value);
        });
        findItemsByFilter(filters).then(response => {
            setItems(response['items']);
            setTotalItems(response['total_items']);
            setTotalPages(response['total_pages']);
        });
    }, [searchParams])

    useEffect(() => {
        let filters = [];
        searchParams.forEach((value, key) => {
            if(!Array.isArray(filters[key])) {
                filters[key] = [];
            }
            filters[key].push(value);
        });
        findItemsByFilter(filters, currentPage).then(response => {
            if(response['items']) {
                let arr = [...items]
                arr.push(...response['items']);
                setItems(arr);
            }

        });
    }, [currentPage]);

    function loadNextPage(event) {
       setCurrentPage(currentPage + 1);
    }

    useEffect(() => {
        getCategory().then(response => {
            setCategory(response);
        });
    }, [])

    function sortHandler(event) {
        searchParams.set('sort', event.target.value);
        setSearchParams(searchParams);
    }

    function maxPriceHandler(event) {
        if(event.target.value === 'all') {
            searchParams.delete('max-price')
        } else {
            searchParams.set('max-price', event.target.value);
        }
        setSearchParams(searchParams);
    }

    function itemTypeHandler(event) {
        if(event.target.value === 'all') {
            searchParams.delete('item-type')
        } else {
            searchParams.set('item-type', event.target.value);
        }
        setSearchParams(searchParams);
    }

    function regionActivationHandler(event) {
        if(event.target.value === 'all') {
            searchParams.delete('region-activation')
        } else {
            searchParams.set('region-activation', event.target.value);
        }
        setSearchParams(searchParams);
    }

    function serviceActivationHandler(event) {
        if(event.target.value === 'all') {
            searchParams.delete('service-activation')
        } else {
            searchParams.set('service-activation', event.target.value);
        }
        setSearchParams(searchParams);
    }

    function filterHandler(event) {
        if(event.target.value === "") {
            searchParams.delete(event.target.name)
        } else {
            if(searchParams.get(event.target.name)) {
                if(searchParams.getAll(event.target.name).includes(event.target.value)) {
                    let arr = searchParams.getAll(event.target.name).filter(elem => (elem !== event.target.value));
                    searchParams.delete(event.target.name);
                    if(arr.length) {
                        arr.forEach(value => {
                            searchParams.append(event.target.name, value);
                        });
                    }
                } else {
                    searchParams.append(event.target.name, event.target.value);
                }
            } else {
                searchParams.append(event.target.name, event.target.value);
            }
        }
        setSearchParams(searchParams);
    }

    $(document).ready(() => {
        $('.dropdown').each((index, elem) => {
            $(elem.children[0]).css({
                "min-width": 0,
                "width":  $(elem.children[1]).outerWidth(true) + "px"
            })
        })

        $("input[type='checkbox']").each((index, elem) => {
            if(searchParams.getAll(elem.name).includes(elem.value)) {
                elem.checked = true;
            } else if(elem.checked) {
                elem.checked = false;
            }
        });
    })

    return (
        <main id="content">
            {searchParams.get('search') ?
                <h1 className="catalog-header">
                    По запросу <span style={searchRequestHighlight}>{searchParams.get('search')}</span> найдено: <span style={searchRequestHighlight}>{items.length ? items.length - 1 : items.length}</span> </h1> :
                <h1 className="catalog-header">Каталог игр: <span style={searchRequestHighlight}>{totalItems}</span></h1>}
            {
                category !== null && (
                    <div className="search-filters row">
                        <select className="form-select bg-primary w-auto" onChange={sortHandler}>
                            <option value="title-asc" selected={searchParams.get('sort') === 'title-asc' || searchParams.get('sort') === undefined}>По алфавиту</option>
                            <option value="price-asc" selected={searchParams.get('sort') === 'price-asc'}>Сначала дешевые</option>
                            <option value="price-desc" selected={searchParams.get('sort') === 'price-desc'}>Сначала дорогие</option>
                            <option value="discount-desc" selected={searchParams.get('sort') === 'discount-desc'}>По велечине скидки</option>
                        </select>
                        <div className="dropdown d-flex justify-content-center w-auto">
                            <button className="btn btn-primary dropdown-toggle" type="button" data-bs-toggle="dropdown" data-bs-auto-close="outside" aria-expanded="false">
                                Жанры
                            </button>
                            <ul className="dropdown-menu dropdown-menu-dark bg-dark">
                                {category['genre'].map(value => (
                                    <li key={value['id']}>
                                        <div className="dropdown-item form-switch btn-group" role="group">
                                            <input className="form-check-input" type="checkbox" name="genre" value={value['id']} id={'genre-' + value['id']} onChange={filterHandler}/>
                                            <label className="form-check-label w-100" htmlFor={'genre-' + value['id']}>{value['title']}</label>
                                        </div>
                                    </li>
                                ))}
                            </ul>

                        </div>
                        <div className="dropdown d-flex justify-content-center w-auto">
                            <select className="form-select bg-primary w-auto" onChange={maxPriceHandler}>
                                <option name="max-price" value="all" selected={!searchParams.get('max-price')}>Все цены</option>
                                <option name="max-price" value="100" selected={searchParams.get('max-price') === '100'}>До 100<FontAwesomeIcon icon={faRubleSign}/></option>
                                <option name="max-price" value="300" selected={searchParams.get('max-price') === '300'}>До 300<FontAwesomeIcon icon={faRubleSign}/></option>
                                <option name="max-price" value="500" selected={searchParams.get('max-price') === '500'}>До 500<FontAwesomeIcon icon={faRubleSign}/></option>
                                <option name="max-price" value="1000" selected={searchParams.get('max-price') === '1000'}>До 1000<FontAwesomeIcon icon={faRubleSign}/></option>
                            </select>
                        </div>
                        <div className="dropdown d-flex justify-content-center w-auto">
                            <select className="form-select bg-primary w-auto" onChange={itemTypeHandler}>
                                <option name="item-type" value="all" selected={!searchParams.get('item-type')}>Тип продукта</option>
                                {category['itemType'].map(value => (
                                    <option name="item-type" value={value['id']} selected={searchParams.get('item-type') == value['id']}>{value['title']}</option>
                                ))}
                            </select>
                        </div>
                        <div className="dropdown d-flex justify-content-center w-auto">
                            <select className="form-select bg-primary w-auto" onChange={regionActivationHandler}>
                                <option name="region-activation" value="all" selected={!searchParams.get('region-activation')}>Регион активации</option>
                                {category['regionActivation'].map(value => (
                                    <option name="region-activation" value={value['id']} selected={searchParams.get('region-activation') == value['id']}>{value['title']}</option>
                                ))}
                            </select>
                        </div>
                        <div className="dropdown d-flex justify-content-center w-auto">
                            <select className="form-select bg-primary w-auto" onChange={serviceActivationHandler}>
                                <option name="service-activation" value="all" selected={!searchParams.get('service-activation')}>Регион активации</option>
                                {category['serviceActivation'].map(value => (
                                    <option name="service-activation" value={value['id']} selected={searchParams.get('service-activation') == value['id']}>{value['title']}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                )
            }
            <div className="row gap-5 justify-content-center">
                {items.map((value) => (
                    <Card item={value} inBasket={props.inBasket} addBasketHandler={props.addBasketHandler}/>
                ))}
                { totalPages > 1 && currentPage < totalPages - 1 &&
                    (<div className="row justify-content-center align-items-center">
                        <button className="btn btn-primary w-auto" onClick={loadNextPage}>Показать ещё</button>
                    </div>)
                }
            </div>
        </main>
    );
}