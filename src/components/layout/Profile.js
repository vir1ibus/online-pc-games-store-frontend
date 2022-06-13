import React from "react";
import {useNavigate} from "react-router-dom";
import ProfileDataTab from "../element/ProfileDataTab";
import ModeratorPanelTab from "../element/ModeratorPanelTab";
import ProfileInfoTab from "../element/ProfileInfoTab";

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
                    {props.authorizedUser['role'].some(role => role['name'] === 'moderator') && (
                        <button className="nav-link" id="moderator-panel-tab" data-bs-toggle="pill"
                                data-bs-target="#moderator-panel" type="button" role="tab"
                                aria-controls="moderator-panel"
                                aria-selected="false">Панель модератора
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
                        <ProfileDataTab authorizedUser={props.authorizedUser} setAuthorizedUser={props.setAuthorizedUser}/>
                    </div>
                    {props.authorizedUser['role'].some(role => role['name'] === 'moderator') && (
                        <div className="tab-pane fade" id="moderator-panel" role="tabpanel"
                             aria-labelledby="moderator-panel-tab">
                            <ModeratorPanelTab token={props.token}/>
                        </div>
                    )}
                </div>
            </div>
        </main>
    )
}