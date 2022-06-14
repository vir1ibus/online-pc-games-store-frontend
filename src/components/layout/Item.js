import {Link, useParams} from "react-router-dom";
import React, { useEffect, useState} from "react";
import {addReview, deleteReview, findItemsByFilter, getItem, getReviews} from "../../scripts/api";
import {image_url} from "../../App";
import { faRubleSign, faStar as faSolidStar, faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { faStar as faRegularStar } from "@fortawesome/free-regular-svg-icons"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {Collapse} from "bootstrap";
import {useFormik} from "formik";
import Review from "../element/Review";

let $ = require( "jquery" );

export default function Item(props) {
    let params = useParams();
    const [item, setItem] = useState(null);
    const [dataItemId, setDataItemId] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [totalReviews, setTotalReviews] = useState(0);
    const [totalPagesReviews, setTotalPagesReviews] = useState(0);
    const [currentPageReviews, setCurrentPageReviews] = useState(0);
    const [reviewStars, setReviewStars] = useState(0);

    const inStock = { color: '#3cf281'};
    const outOfStock = { color: '#e44c55' };

    useEffect(() => {
        getItem(params.itemId).then(response => {
            setItem(response);
            setDataItemId({ 'data-item-id' : response['id'] });
        });
        loadReviews();
    }, [])

    function loadReviews() {
        getReviews(params.itemId).then(response => {
            setReviews(response['reviews']);
            setTotalReviews(response['total_elements']);
            setTotalPagesReviews(response['total_pages']);
        });
    }

    useEffect(() => {
        getReviews(params.itemId, currentPageReviews).then(response => {
            if(response['reviews']) {
                let arr = [...reviews]
                arr.push(...response['reviews']);
                setReviews(arr);
            }
        });
    }, [currentPageReviews]);

    function loadNextPageReviews(event) {
        setCurrentPageReviews(currentPageReviews + 1);
    }

    function formatDate(date) {
        let monthNames = [
            "января", "февраля", "марта",
            "апреля", "мая", "июня", "июля",
            "августа", "сентября", "октября",
            "ноября", "декабря"
        ];

        let day = date.getDate();
        let monthIndex = date.getMonth();
        let year = date.getFullYear();

        return day + ' ' + monthNames[monthIndex] + ' ' + year;
    }

    function starsHandler(event) {
        let stars = event.currentTarget.getAttribute('data-star');
        if(stars > 5) {
            setReviewStars(5);
        } else {
            setReviewStars(event.currentTarget.getAttribute('data-star'));
        }
        Collapse.getOrCreateInstance($('#review-body')).show();
    }

    const reviewForm = useFormik({
        initialValues: {
            title: "",
            text: ""
        },
        onSubmit: async values => {
            await addReview({
                title: values.title,
                text: values.text,
                authorId: props.authorizedUser['id'],
                stars: reviewStars,
                itemId: item['id']
            });
            setReviewStars(0);
            Collapse.getOrCreateInstance($('#review-body')).hide();
            loadReviews();
            values.title = '';
            values.text = '';
        }
    })

    function deleteReviewHandler(event) {
        let reviewId = event.currentTarget.getAttribute('data-review-id');
        deleteReview(props.token, reviewId).then(loadReviews);
    }

    if(item) {
        return (
            <main id="content" className="row text-white" key={item['id']}>
                <div className="col-3" id="item-left">
                    <img src={ image_url + '/item/' + item['img'] } className="item-img"/>
                    <div className="item-detail mt-3">
                        <div className="row">
                            <div className="col-6">Жанр</div>
                            <div className="col-6">{item['genres'].map((genre, index, array) => {
                                if (index + 1 !== array.length) {
                                    return (
                                        <>
                                        <Link to={'/catalog?genre=' + genre['id']} className="text-secondary">
                                            {genre['title']}
                                        </Link>
                                            ,{'\t'}
                                        </>
                                    );
                                } else {
                                    return (
                                        <Link to={'/catalog?genre=' + genre['id']} className="text-secondary">
                                            {genre['title']}
                                        </Link>
                                    );
                                }
                            })}
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-6">Платформа</div>
                            <div className="col-6">{item['platform']}</div>
                        </div>
                        <div className="row">
                            <div className="col-6">Дата выхода</div>
                            <div className="col-6">{formatDate(new Date(item['date_realise']))}</div>
                        </div>
                        <div className="row">
                            <div className="col-6">Издатель</div>
                            <div className="col-6">
                                <Link to={ '/publisher/' + item['publisher'].id } className="text-secondary">
                                    { item['publisher'].title }
                                </Link>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-6">Разработчик</div>
                            <div className="col-6">
                                <Link to={ '/developer/' + item['developer'].id } className="text-secondary">
                                    { item['developer'].title }
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-7" id="item-right">
                    <h1 className="mb-3">Купить {item['title']}</h1>
                    <div className="row mb-3">
                        {item['count'] > 0 ?
                            (<span className="col-3 col-xl-2"><span style={inStock}>●</span> В наличии</span>) :
                            (<span className="col-3 col-xl-2"><span style={outOfStock}>●</span> Нет в наличии</span>)}
                        {'\t'}
                    </div>
                    <div className="row item-price mb-3 align-items-center">
                        <div className="col-xl-2 col-3">
                            {item['count'] > 0 ?
                                (<>
                                    {props.inBasket(item['id']) ?
                                        (<Link to="/basket" className="btn btn-primary add-basket-item">Добавлено</Link>) :
                                        (<button className="btn btn-primary add-basket-item" {...dataItemId} onClick={props.addBasketHandler}>В корзину</button>)}
                                </>) :
                                (<button className="btn btn-primary" disabled>Нет в наличии</button>)
                            }
                        </div>
                        <div className="col-9 row align-items-center">
                            <span className="price w-auto">
                                {item['discount'] ? Math.round(item['price'] - ((item['price'] / 100) * item['discount'])) : item['price']}<FontAwesomeIcon icon={faRubleSign}/>
                            </span>
                            { item['discount'] ? (
                                <>
                                    <span className="old-price w-auto">{item['price']}<FontAwesomeIcon icon={faRubleSign}/></span>
                                    <span className="bg-primary p-2 discount w-auto">{item['discount']}%</span>
                                </>
                            ) : (
                                <></>
                            ) }
                        </div>
                    </div>
                    <div className="row item-detail mb-5">
                        <div className="col-3">
                            <span>Поддержка языков:</span><br/>
                            <span>{item['language_support']}</span>
                        </div>
                        <div className="col-3">
                            <span>Регион активации:</span><br/>
                            <Link to={ "/catalog?regionActivation=" + item['region_activation'].id } className="text-secondary">
                                {item['region_activation'].title}
                            </Link>
                        </div>
                        <div className="col-3">
                            <span>Сервис активации:</span><br/>
                            <Link to={ "/catalog?serviceActivation=" + item['service_activation'].id } className="text-secondary">
                                {item['service_activation'].title}
                            </Link>
                        </div>
                    </div>
                    <div className="row mb-5">
                        <ul className="nav nav-pills mb-3" role="tablist">
                            <li className="nav-item" role="presentation">
                                <button className="nav-link active" id="screenshots-tab" data-bs-toggle="tab"
                                        data-bs-target="#screenshots" type="button" role="tab" aria-controls="screenshots"
                                        aria-selected="true">Скриншоты
                                </button>
                            </li>
                            <li className="nav-item" role="presentation">
                                <button className="nav-link" id="trailers-tab" data-bs-toggle="tab"
                                        data-bs-target="#trailers" type="button" role="tab" aria-controls="trailers"
                                        aria-selected="false">Трейлеры
                                </button>
                            </li>
                        </ul>
                        <div className="tab-content">
                            <div className="tab-pane fade show active" id="screenshots" role="tabpanel"
                                 aria-labelledby="screenshots-tab">
                                <div id="screenshot-carousel" className="carousel slide" data-bs-ride="carousel">
                                    <div className="carousel-indicators">
                                        {item['screenshots'].map((value, index) => (
                                            <button type="button" data-bs-target="#screenshot-carousel"
                                                    data-bs-slide-to={index} className={index ? "" : "active" } aria-current={index ? "" : "true"}
                                                    aria-label={"Screenshot " + index}></button>
                                        ))}
                                    </div>
                                    <div className="carousel-inner">
                                        {item['screenshots'].map((value, index) => (
                                            <div className={index ? "carousel-item" : "carousel-item active" }>
                                                <img src={image_url + "/item/screenshot/" + value['path']} className="d-block w-100"/>
                                            </div>
                                        ))}
                                    </div>
                                    <button className="carousel-control-prev" type="button"
                                            data-bs-target="#screenshot-carousel" data-bs-slide="prev">
                                        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                                        <span className="visually-hidden">Предыдущий</span>
                                    </button>
                                    <button className="carousel-control-next" type="button"
                                            data-bs-target="#screenshot-carousel" data-bs-slide="next">
                                        <span className="carousel-control-next-icon" aria-hidden="true"></span>
                                        <span className="visually-hidden">Следующий</span>
                                    </button>
                                </div>
                            </div>
                            <div className="tab-pane fade" id="trailers" role="tabpanel"
                                 aria-labelledby="trailers-tab">
                                <div id="trailer-carousel" className="carousel slide" data-bs-ride="carousel">
                                    <div className="carousel-indicators">
                                        {item['trailers'].map((value, index) => (
                                            <button type="button" data-bs-target="#trailer-carousel"
                                                    data-bs-slide-to={index} className={index ? "" : "active" } aria-current="true"
                                                    aria-label={"Trailer " + index}></button>
                                        ))}
                                    </div>
                                    <div className="carousel-inner">
                                        {item['trailers'].map((value, index) => {
                                            value['path'] =  'https://www.youtube.com/embed/' + value['path'].substring(value['path'].lastIndexOf("/"));
                                            return (
                                                <div className="embed-responsive embed-responsive-16by9">
                                                    <iframe className={index ? "carousel-item embed-responsive-item" : "carousel-item active embed-responsive-item" }
                                                            src={value['path']}
                                                            allowFullScreen/>
                                                </div>
                                            )
                                        })}
                                    </div>
                                    <button className="carousel-control-prev" type="button"
                                            data-bs-target="#trailer-carousel" data-bs-slide="prev">
                                        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                                        <span className="visually-hidden">Предыдущий</span>
                                    </button>
                                    <button className="carousel-control-next" type="button"
                                            data-bs-target="#trailer-carousel" data-bs-slide="next">
                                        <span className="carousel-control-next-icon" aria-hidden="true"></span>
                                        <span className="visually-hidden">Следующий</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row mb-5">
                        <ul className="nav nav-pills mb-3" id="pills-tab" role="tablist">
                            <li className="nav-item" role="presentation">
                                <button className="nav-link active" id="about-tab" data-bs-toggle="tab"
                                        data-bs-target="#about" type="button" role="tab" aria-controls="about"
                                        aria-selected="true">Об игре
                                </button>
                            </li>
                            <li className="nav-item" role="presentation">
                                <button className="nav-link" id="system-requirements-tab" data-bs-toggle="tab"
                                        data-bs-target="#system-requirements" type="button" role="tab" aria-controls="system-requirements"
                                        aria-selected="false">Системные требования
                                </button>
                            </li>
                        </ul>
                        <div className="tab-content">
                            <div className="tab-pane fade show active" id="about" role="tabpanel" aria-labelledby="about-tab">
                                <h3>{item['description'].title}</h3>
                                <span className="about-text">
                                    {item['description'].text.split('\n').map(str => {
                                        if(str.length) {
                                            return (<p>{str}</p>);
                                        } else {
                                            return (<>{'\n'}</>);
                                        }
                                    })}
                                </span>
                            </div>
                            <div className="tab-pane fade" id="system-requirements" role="tabpanel" aria-labelledby="system-requirements-tab">
                                {item['system_requirements'].map(sr => (
                                    <div className="row mb-1">
                                        <div className="col-3">{sr.title}</div>
                                        <div className="col-8">{sr.value}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <ul className="nav nav-pills mb-3" id="pills-tab" role="tablist">
                            <li className="nav-item" role="presentation">
                                <button className="nav-link active" id="review-tab" data-bs-toggle="tab"
                                        data-bs-target="#review" type="button" role="tab" aria-controls="review"
                                        aria-selected="true">Отзывы {totalReviews ? (<span className="text-white">{totalReviews}</span>) : (<></>)}
                                </button>
                            </li>
                        </ul>
                        <div className="tab-content">
                            <div className="tab-pane fade show active" id="review" role="tabpanel" aria-labelledby="review-tab">
                                {props.authorizedUser ?
                                    (<div className="d-flex">
                                        <form className="w-100" onSubmit={reviewForm.handleSubmit}>
                                            <div className="row justify-content-start align-items-center mb-3" id="review-stars">
                                                <span className="w-auto">
                                                    Оцените игру:
                                                </span>
                                                <div className="w-auto" onClick={starsHandler} data-star="1">
                                                    {reviewStars >= 1 ? (<FontAwesomeIcon icon={faSolidStar} className="text-secondary"/>) : <FontAwesomeIcon icon={faRegularStar}/>}
                                                    <input type="hidden" name="stars" value="1"/>
                                                </div>
                                                <div className="w-auto" onClick={starsHandler} data-star="2">
                                                    {reviewStars >= 2 ? (<FontAwesomeIcon icon={faSolidStar} className="text-secondary"/>) : <FontAwesomeIcon icon={faRegularStar}/>}
                                                    <input type="hidden" name="stars" value="2"/>
                                                </div>
                                                <div className="w-auto" onClick={starsHandler} data-star="3">
                                                    {reviewStars >= 3 ? (<FontAwesomeIcon icon={faSolidStar} className="text-secondary"/>) : <FontAwesomeIcon icon={faRegularStar}/>}
                                                    <input type="hidden" name="stars" value="3"/>
                                                </div>
                                                <div className="w-auto" onClick={starsHandler} data-star="4">
                                                    {reviewStars >= 4 ? (<FontAwesomeIcon icon={faSolidStar} className="text-secondary"/>) : <FontAwesomeIcon icon={faRegularStar}/>}
                                                </div>
                                                <div className="w-auto" onClick={starsHandler} data-star="5">
                                                    {reviewStars == 5 ? (<FontAwesomeIcon icon={faSolidStar} className="text-secondary"/>) : <FontAwesomeIcon icon={faRegularStar}/>}
                                                </div>
                                            </div>
                                            <div className="collapse" id="review-body">
                                                <input className="form-control mb-2 w-100"
                                                       name="title"
                                                       placeholder="До 35 символов"
                                                       maxLength="35"
                                                       onChange={reviewForm.handleChange}
                                                       value={reviewForm.values.title}
                                                       required/>
                                                <textarea className="form-control w-100"
                                                          rows="10"
                                                          name="text"
                                                          placeholder="От 100 до 2000 символов"
                                                          maxLength="2000"
                                                          minLength="200"
                                                          onChange={reviewForm.handleChange}
                                                          value={reviewForm.values.text}
                                                          required/>
                                                <button type="submit" className="btn bg-transparent text-white fs-4 float-end"><FontAwesomeIcon icon={faPaperPlane}/></button>
                                            </div>
                                        </form>
                                    </div>) :
                                    (<span>
                                        Войдите, чтобы оставлять отзывы. {'\t'}
                                        <span className="text-secondary" id="login-comment"
                                              data-bs-toggle="offcanvas"
                                              data-bs-target="#authentication"
                                              aria-controls="authentication">
                                            Войти
                                        </span>
                                    </span>)
                                }
                                { totalReviews ? reviews.map(value => (
                                    <Review value={value} formatDate={formatDate} authorizedUser={props.authorizedUser} deleteReviewHandler={deleteReviewHandler}/>
                                )) : (<h3 className="text-center">Ваш отзыв будет первым!</h3>)}
                                { totalPagesReviews > 1 && currentPageReviews < totalPagesReviews - 1 &&
                                    (<div className="row justify-content-center align-items-center">
                                        <button className="btn btn-secondary w-auto" onClick={loadNextPageReviews}>Показать ещё</button>
                                    </div>)
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        )
    } else {
        return (<></>);
    }

}