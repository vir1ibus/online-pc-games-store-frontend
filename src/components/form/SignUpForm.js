import { useFormik } from "formik";
import { signUp } from "../../scripts/api";
import React, {useEffect, useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEye as faSolidEye, faEyeSlash as faSolidEyeSlash} from "@fortawesome/free-solid-svg-icons";
let $ = require( "jquery" );

const validate = values => {
    const errors = {};

    if(values.login.length < 3) {
        errors.login = true;
    }

    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
        errors.email = true;
    }

    if (!/(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z._%+-]{8,}/g.test(values.regPassword)) {
        errors.regPassword = true;
    }

    if(values.retryPassword !== values.regPassword) {
        errors.retryPassword = true;
    }

    return errors;
};

function SignUpForm() {
    const [ success, setSuccess ] = useState(false);
    const [showRegPassword, setShowRegPassword] = useState(false);
    const [showRetryPassword, setShowRetryPassword] = useState(false);

    useEffect(() => {
        if(showRegPassword) {
            $('input[name="regPassword"]').attr('type', 'text');
        } else {
            $('input[name="regPassword"]').attr('type', 'password');
        }
    }, [showRegPassword])

    useEffect(() => {
        if(showRetryPassword) {
            $('input[name="retryPassword"]').attr('type', 'text');
        } else {
            $('input[name="retryPassword"]').attr('type', 'password');
        }
    }, [showRetryPassword])

    function handlerShowingPassword(event) {
        switch (event.currentTarget.getAttribute('data-input-name')) {
            case "regPassword":
                setShowRegPassword(!showRegPassword);
                break;
            case "retryPassword":
                setShowRetryPassword(!showRetryPassword);
                break;
        }
    }

    const signUnForm = useFormik({
        initialValues: {
            login: "",
            email: "",
            regPassword: "",
            retryPassword: "",
        },
        validate,
        onSubmit: async (values, { resetForm }) => {
            await signUp(values.login, values.email, values.regPassword).then(response => {
                setSuccess(true);
                resetForm();
            }, error => {
                setSuccess(false);
                if(error.some(values => values['code'] === 'username')) {
                    signUnForm.setFieldError("duplicate_login", "?????????? ?????? ??????????.");
                }
                if(error.some(values => values['code'] === 'email')) {
                    signUnForm.setFieldError("duplicate_email", "?????????? ?????? ????????????????????????????????.");
                }
            });
        }
    });



    return (
        <div className="form-check">
            <form className={success ?
                ("d-flex flex-column align-content-center justify-content-center is-valid") :
                ("d-flex flex-column align-content-center justify-content-center")}
                  onSubmit={signUnForm.handleSubmit}>
                <div className="rounded-pill form-check mt-2 mb-2">
                    <input
                        id="login"
                        name="login"
                        placeholder="??????????"
                        className={(signUnForm.touched.login && signUnForm.errors.login) ||
                            (signUnForm.errors['duplicate_login'])?
                            ("form-control rounded-pill is-invalid") : ("form-control rounded-pill")}
                        onChange={signUnForm.handleChange}
                        value={signUnForm.values.login}
                        title="?????????? ???????????? ???????? ???? ?????????? 3-?? ????????????????"
                        required/>
                    <div className="invalid-feedback">
                        {signUnForm.errors['duplicate_login'] ?
                            (signUnForm.errors['duplicate_login']) : ("???????????????????????? ??????????.")}
                    </div>
                </div>
                <div className="rounded-pill form-check mb-2">
                    <input
                        id="email"
                        name="email"
                        placeholder="??????????"
                        className={(signUnForm.touched.email && signUnForm.errors.email) ||
                            (signUnForm.errors['duplicate_email']) ?
                            ("form-control rounded-pill is-invalid") : ("form-control rounded-pill")}
                        onChange={signUnForm.handleChange}
                        value={signUnForm.values.email}
                        required/>
                    <div className="invalid-feedback">
                        {signUnForm.errors['duplicate_email'] ?
                            (signUnForm.errors['duplicate_email']) : ("???????????????????????? ??????????.")}
                    </div>
                </div>
                <div className="rounded-pill form-check mb-2">
                    <div className="d-flex align-items-center">
                        <input
                            id="regPassword"
                            name="regPassword"
                            placeholder="????????????"
                            type="password"
                            className={signUnForm.touched.regPassword && signUnForm.errors.regPassword ?
                                ("form-control rounded-pill is-invalid") : ("form-control rounded-pill")}
                            onChange={signUnForm.handleChange}
                            value={signUnForm.values.regPassword}
                            title="???????????? ???????????? ???????? ???? ?????????? 8-???? ???????????????? ?? ?????????? ?????????????????? ??????????, ??????????, ???????????????? ??????????."
                            required/>
                        {showRegPassword ?
                            (<FontAwesomeIcon icon={faSolidEye} className="ms-2" data-input-name="regPassword" onClick={handlerShowingPassword}/>) :
                            (<FontAwesomeIcon icon={faSolidEyeSlash} className="ms-2" data-input-name="regPassword" onClick={handlerShowingPassword}/>)}
                    </div>
                    <div className="invalid-feedback">
                        ???????????? ???? ?????????????????????????? ??????????????????????.
                    </div>
                </div>
                <div className="rounded-pill form-check mb-2">
                    <div className="d-flex align-items-center">
                        <input
                            id="retryPassword"
                            name="retryPassword"
                            placeholder="?????????????????? ????????????"
                            type="password"
                            className={signUnForm.touched.retryPassword && signUnForm.errors.retryPassword ?
                                ("form-control rounded-pill is-invalid") : ("form-control rounded-pill")}
                            onChange={signUnForm.handleChange}
                            value={signUnForm.values.retryPassword}
                            title="???????????? ?????????????????? ?? ?????????????? ????????."
                            required/>
                        {showRetryPassword ?
                            (<FontAwesomeIcon icon={faSolidEye} className="ms-2" data-input-name="retryPassword" onClick={handlerShowingPassword}/>) :
                            (<FontAwesomeIcon icon={faSolidEyeSlash} className="ms-2" data-input-name="retryPassword" onClick={handlerShowingPassword}/>)}
                    </div>
                    <div className="invalid-feedback">
                        ???????????? ???? ??????????????????.
                    </div>
                </div>
                <button className="btn btn-primary rounded-pill" type="submit">??????????????????????</button>
            </form>
            <div className="valid-feedback text-center">
                ???????????????? ??????????????????????!<br/>
                ?????????? ?????? ?????????????????????????? ???????????????????? ???? ??????????.
            </div>
        </div>
    );
}

export default SignUpForm;