import React, {useEffect, useState} from "react";
import {addLiked, deleteLiked, findCatalog, findItemsByFilter, isAuthenticated} from "../../scripts/api";
import { Offcanvas } from 'bootstrap';
import {faBars, faArrowRightToBracket} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {ResultOffcanvas} from "../element/ResultOffcanvas";
import {Link, useNavigate} from "react-router-dom";
import {faHeart} from "@fortawesome/free-regular-svg-icons";
import AuthenticationOffcanvas from "../element/AuthenticationOffcanvas";

let $ = require( "jquery" );

function UserControls(props) {

    const [authenticated, setAuthenticated] = useState(false);

    useEffect(() => {
        if(props.authorizedUser) {
            setAuthenticated(true);
        } else {
            setAuthenticated(false);
        }
    }, [props.authorizedUser])


    if(authenticated) {
        return (
            <div className="col-2 row align-items-center justify-content-evenly">
                <Link to="/profile" className="col-1 d-flex justify-content-center align-items-center">
                    <i className="user bi bi-person-circle"/>
                </Link>
                <Link to="/liked" className="col-1 d-flex justify-content-center align-items-center">
                    <FontAwesomeIcon icon={faHeart} className="liked"/>
                </Link>
                <Link to="/basket" className="col-1 d-flex justify-content-center align-items-center">
                    <i className="cart bi bi-cart3"/>
                </Link>
            </div>
        );
    } else {
        return (
            <div className="col-2 row align-content-center justify-content-evenly">
                <div className="col-1 d-flex justify-content-center align-items-center">
                    <FontAwesomeIcon
                        icon={faArrowRightToBracket}
                        className="sign-in"
                        data-bs-toggle="offcanvas"
                        data-bs-target="#authentication"
                        aria-controls="authentication"/>
                </div>
                <AuthenticationOffcanvas authenticatingHandler={setAuthenticated} authorizationHandler={props.authorizationHandler}/>
                <Link to="/liked" className="col-1 d-flex justify-content-center align-items-center">
                    <FontAwesomeIcon icon={faHeart} className="liked"/>
                </Link>
                <Link to="/basket" className="col-1 d-flex justify-content-center align-items-center">
                    <i className="cart bi bi-cart3"/>
                </Link>
            </div>
        );
    }

}

export default function Header(props) {

    let navigate = useNavigate();

    const [search, setSearch] = useState('');
    const [result, setResult] = useState([]);
    const [resultType, setResultType] = useState('');

    async function catalogHandler(event) {
        if (resultType === "catalog") {
            Offcanvas.getOrCreateInstance($(".result-canvas")).toggle();
        } else {
            await findCatalog().then(response => {
                setResult(response);
            })
            setResultType("catalog");
            Offcanvas.getOrCreateInstance($(".result-canvas")).show();
        }
    }

    function searchInputHandler(event) {
        findItemsByFilter({ search: event.target.value }).then(response => {
            if(response.items.length > 0) {
                setResult(response);
                setResultType("search");
            } else {
                setResult([]);
                setResultType("search");
            }
        });

        setSearch(event.target.value);

        Offcanvas.getOrCreateInstance($(".result-canvas")).show();
    }

    function searchEnterHandler(event) {
        if(event.key === 'Enter') {
            Offcanvas.getOrCreateInstance($(".result-canvas")).hide();
            navigate("/catalog?search=" + event.target.value);
        }
    }

    return(
        <>
            <header id="header-top" className="row align-content-center justify-content-between m-3 fixed-top">
                <div className="row col-xl-1 col-2 justify-content-center">
                    <a href="/" className="w-auto">
                        <img className="logo" src={process.env.PUBLIC_URL + '/img/logo.png'} alt="logo"/>
                    </a>
                </div>
                <div id="search-controls" className="col-xl-8 col-8 row align-content-center justify-content-evenly">
                    <button className="btn btn-primary rounded-pill col-xl-2 col-1 d-lg-block d-none w-auto" onClick={catalogHandler}>Категории</button>
                    <button className="btn btn-primary rounded-pill col-1 d-lg-none d-block w-auto" onClick={catalogHandler}><FontAwesomeIcon icon={faBars}/></button>
                    <div className="col-xl-10 col-lg-9 col-11 row justify-content-end">
                        <div className="form-control rounded-pill search-box">
                            <input
                                name="search"
                                id="search"
                                className="text-secondary"
                                value={search}
                                onChange={searchInputHandler}
                                autoComplete="off"
                                onKeyDown={searchEnterHandler}
                            />
                            <i className="text-primary bi bi-search search-btn float-end"/>
                        </div>
                    </div>
                </div>
                <UserControls authorizationHandler={props.authorizationHandler} authorizedUser={props.authorizedUser} basket={props.basket}/>
            </header>
            <div className="offcanvas offcanvas-top result-canvas">
                { resultType &&
                    <ResultOffcanvas
                        resultType={resultType}
                        search={search}
                        result={result}
                        basket={props.basket}
                        addBasketHandler={props.addBasketHandler}
                        inBasket={props.inBasket}
                        inLiked={props.inLiked}
                        addLiked={props.addLiked}
                        deleteLiked={props.deleteLiked}
                        offcanvas={Offcanvas.getOrCreateInstance($(".result-canvas"))}/>
                }
            </div>
        </>
    );
}