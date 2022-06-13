import SignInForm from "../form/SignInForm";
import SignUpForm from "../form/SignUpForm";
import React, {useState} from "react";
import { Offcanvas } from 'bootstrap';
let $ = require( "jquery" );

export default function AuthenticationOffcanvas(props) {

    const [authenticationOffcanvas, setAuthenticationOffcanvas] = useState(null);

    $(document).ready(() => {
        setAuthenticationOffcanvas(Offcanvas.getOrCreateInstance($('.authentication-canvas')));
    })

    return (
        <div className="offcanvas offcanvas-end authentication-canvas"
             id="authentication"
             aria-labelledby="authenticationLabel">
            <div className="offcanvas-header" data-bs-dismiss="offcanvas">
                <button type="button" className="btn-close btn-close-white mt-2" aria-label="Close"></button>
            </div>
            <div className="offcanvas-body">
                <ul className="nav nav-tabs authentication-tab row justify-content-center" id="navAuthentication" role="tablist">
                    <li className="nav-item col-auto" role="presentation">
                        <button className="nav-link active authentication-tab-btn" id="sign-in-tab" data-bs-toggle="tab"
                                data-bs-target="#sign-in" type="button" role="tab" aria-controls="sign-in"
                                aria-selected="true">Вход
                        </button>
                    </li>
                    <li className="nav-item col-auto" role="presentation">
                        <button className="nav-link authentication-tab-btn" id="sign-up-tab" data-bs-toggle="tab"
                                data-bs-target="#sign-up" type="button" role="tab" aria-controls="sign-up"
                                aria-selected="true">Регистрация
                        </button>
                    </li>
                </ul>
                <div className="tab-content" id="navAuthenticationContent">
                    <div className="tab-pane fade show active" id="sign-in" role="tabpanel"
                         aria-labelledby="sign-in-tab">
                        <SignInForm authenticatingHandler={props.authenticatingHandler} authorizationHandler={props.authorizationHandler} authenticationOffcanvas={authenticationOffcanvas}/>
                    </div>
                    <div className="tab-pane fade" id="sign-up" role="tabpanel"
                         aria-labelledby="sign-up-tab">
                        <SignUpForm/>
                    </div>
                </div>
            </div>
        </div>
    )
}