import React from "react";
import {useNavigate} from "react-router-dom";
import ProfileDataTab from "../element/ProfileDataTab";
import ModeratorPanelTab from "../element/ModeratorPanelTab";
import ProfileInfoTab from "../element/ProfileInfoTab";
import PurchaseHistoryTab from "../element/PurchaseHistoryTab";
import AdminPanelTab from "../element/AdminPanelTab";

const $ = require('jquery');

export default function Profile(props) {
    const navigator = useNavigate('/');

    if(props.authorizedUser)
    return (
        <main id="content" className="row text-white">
            <div className="row align-items-start">
                <div className="nav flex-column nav-pills me-3 col-2" id="profile" role="tablist"
                     aria-orientation="vertical">
                    <button className="nav-link active" id="profile-card-tab" data-bs-toggle="pill"
                            data-bs-target="#profile-card" type="button" role="tab" aria-controls="profile-card"
                            aria-selected="true">Профиль
                    </button>
                    <button className="nav-link" id="profile-user-data-tab" data-bs-toggle="pill"
                            data-bs-target="#profile-user-data" type="button" role="tab"
                            aria-controls="profile-user-data"
                            aria-selected="false">Личные данные
                    </button>
                    <button className="nav-link" id="purchase-history-tab" data-bs-toggle="pill"
                            data-bs-target="#purchase-history" type="button" role="tab"
                            aria-controls="purchase-history"
                            aria-selected="false">История заказов
                    </button>
                    {props.authorizedUser['role'].some(role => role['name'] === 'moderator') && (
                        <button className="nav-link" id="moderator-panel-tab" data-bs-toggle="pill"
                                data-bs-target="#moderator-panel" type="button" role="tab"
                                aria-controls="moderator-panel"
                                aria-selected="false">Панель модератора
                        </button>
                    )}
                    {props.authorizedUser['role'].some(role => role['name'] === 'admin') && (
                        <button className="nav-link" id="admin-panel-tab" data-bs-toggle="pill"
                                data-bs-target="#admin-panel" type="button" role="tab"
                                aria-controls="admin-panel"
                                aria-selected="false">Панель администратора
                        </button>
                    )}
                    <button className="btn btn-primary mt-5" onClick={ () => { props.logOutHandler(); navigator('/'); } }>Выйти</button>
                </div>
                <div className="tab-content col-8">
                    <div className="tab-pane fade show active" id="profile-card" role="tabpanel"
                         aria-labelledby="profile-card-tab">
                        <ProfileInfoTab authorizedUser={props.authorizedUser}/>
                    </div>
                    <div className="tab-pane fade" id="profile-user-data" role="tabpanel"
                         aria-labelledby="profile-user-data-tab">
                        <ProfileDataTab token={props.token} authorizedUser={props.authorizedUser} setAuthorizedUser={props.setAuthorizedUser}/>
                    </div>
                    <div className="tab-pane fade" id="purchase-history" role="tabpanel"
                         aria-labelledby="purchase-history-tab">
                        <PurchaseHistoryTab
                            token={props.token}
                            inBasket={props.inBasket}
                            addBasketHandler={props.addBasketHandler}
                            inLiked={props.inLiked}
                            addLiked={props.addLiked}
                            deleteLiked={props.deleteLiked}/>
                    </div>
                    {props.authorizedUser['role'].some(role => role['name'] === 'moderator') && (
                        <div className="tab-pane fade" id="moderator-panel" role="tabpanel"
                             aria-labelledby="moderator-panel-tab">
                            <ModeratorPanelTab token={props.token}/>
                        </div>
                    )}
                    {props.authorizedUser['role'].some(role => role['name'] === 'admin') && (
                        <div className="tab-pane fade" id="admin-panel" role="tabpanel"
                             aria-labelledby="admin-panel-tab">
                            <AdminPanelTab token={props.token}/>
                        </div>
                    )}
                </div>
            </div>
        </main>
    )
}