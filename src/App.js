import React, {Component, useEffect, useState} from "react";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import ConfirmPage from "./components/layout/ConfirmPage";
import {Route, BrowserRouter as Router, Routes, Navigate} from "react-router-dom";
import HomePage from "./components/layout/HomePage";
import Catalog from "./components/layout/Catalog";
import {Basket} from "./components/layout/Basket";
import {
    addBasket,
    addLiked,
    api,
    deleteBasket, deleteLiked,
    getBasket,
    getItemForBasket, getLiked,
    isAuthenticated,
    logOut
} from "./scripts/api";
import Cookies from "universal-cookie/lib";
import Item from "./components/layout/Item";
import Profile from "./components/layout/Profile.js";
import Agreement from "./components/layout/Agreement";
import SuccessPayment from "./components/layout/SuccessPayment";
import NotFound from "./components/layout/NotFound";
import Publisher from "./components/layout/Publisher";
import Developer from "./components/layout/Developer";
import Publishers from "./components/layout/Publishers";
import Developers from "./components/layout/Developers";
import Liked from "./components/layout/Liked";
import {Offcanvas} from "bootstrap";
import $ from "jquery";
import {ItemCard} from "./components/element/ItemCard";

export const image_url = api.defaults.baseURL + "image?path=/";

export default function App() {

    const cookies = new Cookies();
    const [authorizedUser, setAuthorizedUser] = useState(null);
    const [basket, setBasket] = useState([]);
    const [liked, setLiked] = useState([]);

    useEffect(() => {
        let token = cookies.get('token');
        if(token) {
            isAuthenticated(token).then(response => {
                if (!authorizedUser) {
                    setAuthorizedUser(response);
                }
                if(JSON.parse(localStorage.getItem("basket"))) {
                    JSON.parse(localStorage.getItem("basket")).map(value => {
                        if(!response['basket']['items'].includes(value)) {
                            addBasket(value['id'], token).then();
                            response['basket']['items'].push(value);
                        }
                    });
                    localStorage.removeItem("basket");
                }
                setBasket(response['basket']['items'])
                setLiked(response['liked']['items'])
            }).catch(error => {
                setAuthorizedUser(null);
                cookies.remove("token");
            });
        } else {
            if(authorizedUser) {
                setAuthorizedUser(null);
            }
            if(JSON.parse(localStorage.getItem("basket"))) {
                setBasket(JSON.parse(localStorage.getItem("basket")));
            }
        }
    }, [authorizedUser]);

    function logOutHandler() {
        logOut(cookies.get('token')).then(() => {
            cookies.remove('token');
            setAuthorizedUser(null);
        })
    }

    function deleteBasketHandler(event) {
        let token = cookies.get("token");
        if(token) {
            let id = event.currentTarget.getAttribute('data-item-id');
            deleteBasket(id, cookies.get("token")).then(() => {
                let arr = [...basket];
                arr = arr.filter(elem => (elem['id'] !== id));
                setBasket(arr);
            })
        } else {
            let arr = [...basket];
            arr = arr.filter(elem => (elem['id'] !== event.currentTarget.getAttribute('data-item-id')));
            localStorage.setItem("basket", JSON.stringify(arr));
            setBasket(arr);
        }
    }

    function addBasketHandler(event) {
        let token = cookies.get('token');
        if(token) {
            addBasket(event.currentTarget.getAttribute('data-item-id'), token).then(() => {
                getBasket(token).then(response => {
                    setBasket(response['items']);
                });
            });
        } else {
            getItemForBasket(event.currentTarget.getAttribute('data-item-id')).then(response => {
                let arr = [...basket];
                arr.push(response);
                setBasket(arr);
                localStorage.setItem("basket", JSON.stringify(arr));
            });
        }
    }

    function inBasket(id) {
        if(basket) {
            let basketIds = basket.reduce((arr, currentValue) => {
                arr.push(currentValue['id']);
                return arr;
            }, []);
            return basketIds.includes(id);
        }
        return false;
    }

    function inLiked(id) {
        if(liked) {
            let likedIds = liked.reduce((arr, currentValue) => {
                arr.push(currentValue['id']);
                return arr;
            }, []);
            return likedIds.includes(id);
        }
        return false;
    }

    function addLikedHandler(event) {
        let token = cookies.get('token');
        if(token)
        addLiked(event.currentTarget.getAttribute('data-item-id'), token).then(() => {
            getLiked(token).then(response => {
                setLiked(response['items']);
            });
        });
    }

    function deleteLikedHandler(event) {
        let token = cookies.get("token");
        if(token) {
            let id = event.currentTarget.getAttribute('data-item-id');
            deleteLiked(id, cookies.get("token")).then(() => {
                let arr = [...liked];
                arr = arr.filter(elem => (elem['id'] !== id));
                setLiked(arr);
            })
        }
    }

    return (
        <Router>
            <div className="root d-flex flex-column">
                <Header authorizationHandler={setAuthorizedUser} authorizedUser={authorizedUser} basket={basket}
                        addBasketHandler={addBasketHandler} inBasket={inBasket} inLiked={inLiked} addLiked={addLikedHandler}
                        deleteLiked={deleteLikedHandler}/>
                    <Routes>
                        <Route path="/" element={<App/>}/>
                        <Route index element={<HomePage
                            addBasketHandler={addBasketHandler}
                            inBasket={inBasket}
                            inLiked={inLiked}
                            addLiked={addLikedHandler}
                            deleteLiked={deleteLikedHandler}/>}/>
                        <Route path="confirm/:confirmToken" element={<ConfirmPage/>}/>
                        <Route path="catalog" element={<Catalog
                            addBasketHandler={addBasketHandler}
                            inBasket={inBasket}
                            inLiked={inLiked}
                            addLiked={addLikedHandler}
                            deleteLiked={deleteLikedHandler} />}/>
                        <Route path="basket" element={<Basket authorizedUser={authorizedUser} basket={basket}
                                                              deleteBasketHandler={deleteBasketHandler} token={cookies.get('token')}/>}/>
                        <Route path="liked" element={<Liked
                            liked={liked}
                            setLiked={setLiked}
                            deleteLiked={deleteLikedHandler}
                            inBasket={inBasket}
                            addBasketHandler={addBasketHandler}
                            inLiked={inLiked}
                            authorizedUser={authorizedUser}/>}/>
                        <Route path="game/:itemId" element={<Item inBasket={inBasket} addBasketHandler={addBasketHandler} authorizedUser={authorizedUser} token={cookies.get('token')}/>}/>
                        <Route path="publisher/:publisherId" element={<Publisher
                            inBasket={inBasket}
                            addBasketHandler={addBasketHandler}
                            inLiked={inLiked}
                            addLiked={addLikedHandler}
                            deleteLiked={deleteLikedHandler}
                            authorizedUser={authorizedUser}
                            token={cookies.get('token')}/>}/>
                        <Route path="publishers" element={<Publishers/>}/>
                        <Route path="developer/:developerId" element={<Developer
                            inBasket={inBasket}
                            addBasketHandler={addBasketHandler}
                            inLiked={inLiked}
                            addLiked={addLikedHandler}
                            deleteLiked={deleteLikedHandler}
                            authorizedUser={authorizedUser} token={cookies.get('token')}/>}/>
                        <Route path="developers" element={<Developers/>}/>
                        <Route path="profile" element={authorizedUser || authorizedUser === undefined ?
                            <Profile authorizedUser={authorizedUser}
                                     setAuthorizedUser={setAuthorizedUser}
                                     token={cookies.get('token')}
                                     logOutHandler={logOutHandler}
                                     inBasket={inBasket}
                                     addBasketHandler={addBasketHandler}/> :
                            <Navigate to="/"/>}/>
                        <Route path="document/agreement" element={<Agreement/>}/>
                        <Route path="/payment/success" element={<SuccessPayment token={cookies.get('token')}/>}/>
                        <Route path="*" element={<NotFound/>}/>
                    </Routes>
                <Footer/>
            </div>
        </Router>
    );
}