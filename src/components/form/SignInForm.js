import { useFormik } from "formik";
import {reSendConfirmationCode, signIn} from "../../scripts/api";
import {useCookies} from "react-cookie";
import Cookies from "universal-cookie/lib";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEye as faSolidEye, faEyeSlash as faSolidEyeSlash} from "@fortawesome/free-solid-svg-icons";
import React, {useEffect, useState} from "react";
let $ = require( "jquery" );

function SignInForm(props) {

    const cookies = new Cookies();
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        if(showPassword) {
            $('input[name="password"]').attr('type', 'text');
        } else {
            $('input[name="password"]').attr('type', 'password');
        }
    }, [showPassword])

    function handlerShowingPassword() {
        setShowPassword(!showPassword);
    }

    const signInForm = useFormik({
        initialValues: {
            login: "",
            password: ""
        },
        onSubmit: async values => {
            await signIn(values.login, values.password).then(response => {
                cookies.set("token", response['token'], { path: '/' });
                props.authorizationHandler(response);
                props.authenticatingHandler(true);
                props.authenticationOffcanvas.hide();
            }).catch(error => {
                if('username' || 'password' in error) {
                    signInForm.setFieldError("authentication", "invalid-login-password");
                }
                if('account' in error) {
                    signInForm.setFieldError("authentication", "account-not-activated")
                }
            });
        }
    });

    function renderErrorAuthentication(type) {
        switch (type) {
            case "invalid-login-password":
                return <>Неправильный логин или пароль.</>;
            case "account-not-activated":
                return <>
                    Аккаунт не активирован.<br/>
                    <a className="text-decoration-none text-secondary" style={{ 'cursor' : 'pointer' }} onClick={() => reSendConfirmationCodeHandler(signInForm.values.login)}>Отправить ссылку активации ещё раз.</a>
                </>
        }
    }

    function reSendConfirmationCodeHandler(username) {
        reSendConfirmationCode(username).then(() => {
            signInForm.setFieldError("authentication", null);
        }, () => {
            signInForm.setFieldError("authentication", "Ошибка сервера.");
        }).catch(() => {
            signInForm.setFieldError("authentication", "Ошибка сервера.");
        })
    }

    return (
        <div className="form-check">
            <form className={signInForm.errors['authentication'] ?
                ("d-flex flex-column align-content-center justify-content-center is-invalid") :
                ("d-flex flex-column align-content-center justify-content-center")}
                  onSubmit={signInForm.handleSubmit}>
                <div className="mt-2 mb-2">
                    <input
                        name="login"
                        placeholder="Логин"
                        className="form-control rounded-pill"
                        onChange={signInForm.handleChange}
                        value={signInForm.values.login}
                        required/>
                </div>
                <div className="mb-2 d-flex align-items-center">
                    <input name="password"
                           placeholder="Пароль"
                           className="form-control rounded-pill"
                           type="password"
                           onChange={signInForm.handleChange}
                           value={signInForm.values.password}
                           required/>
                    {showPassword ?
                        (<FontAwesomeIcon icon={faSolidEye} className="ms-2" data-input-name="currentPassword" onClick={handlerShowingPassword}/>) :
                        (<FontAwesomeIcon icon={faSolidEyeSlash} className="ms-2" data-input-name="currentPassword" onClick={handlerShowingPassword}/>)}
                </div>
                <button className="btn btn-primary rounded-pill" type="submit">Вход</button>
            </form>
            <div className="text-center invalid-feedback">
                {renderErrorAuthentication(signInForm.errors['authentication'])}
            </div>
        </div>
    );
}

export default SignInForm;