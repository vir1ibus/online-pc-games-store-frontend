import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEye as faSolidEye, faEyeSlash as faSolidEyeSlash} from "@fortawesome/free-solid-svg-icons";
import {Link, useNavigate} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {useFormik} from "formik";
import {changeEmail, changePassword, changeUsername, deleteAccount} from "../../scripts/api";
import $ from "jquery";

export default function ProfileDataTab(props) {

    let navigate = useNavigate();

    const [successChangeProfileData, setSuccessChangeProfileData] = useState([]);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState(false);


    useEffect(() => {
        if (showCurrentPassword) {
            $('input[name="currentPassword"]').attr('type', 'text');
        } else {
            $('input[name="currentPassword"]').attr('type', 'password');
        }
    }, [showCurrentPassword]);

    useEffect(() => {
        if (showNewPassword) {
            $('input[name="newPassword"]').attr('type', 'text');
        } else {
            $('input[name="newPassword"]').attr('type', 'password');
        }
    }, [showNewPassword]);

    function handlerShowingPassword(event) {
        switch (event.currentTarget.getAttribute('data-input-name')) {
            case "currentPassword":
                setShowCurrentPassword(!showCurrentPassword);
                break;
            case "newPassword":
                setShowNewPassword(!showNewPassword);
                break;
        }
    }

    const validateProfileDataForm = values => {
        const errors = {};

        if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
            errors.email = "Неверный формат вводы электронной почты.";
        }

        if (!/(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z._%+-]{8,}/g.test(values.newPassword)) {
            errors.newPassword = "Пароль не соответствует требованиям.";
        }

        return errors;
    };

    const profileDataForm = useFormik({
        initialValues: {
            username: props.authorizedUser.username,
            email: props.authorizedUser.email,
            currentPassword: "",
            newPassword: "",
            confirmUserTerms: true
        },
        validateProfileDataForm,
        onSubmit: (values) => {
            if (profileDataForm.dirty && values.confirmUserTerms) {
                if (values.username !== props.authorizedUser.username) {
                    changeUsername(props.token, values.username).then(() => {
                        let arr = [...successChangeProfileData];
                        arr.push("username");
                        setSuccessChangeProfileData(arr);
                        props.authorizedUser.username = values.username;
                        props.setAuthorizedUser(props.authorizedUser);
                    }, () => {
                        profileDataForm.errors.username = "Ошибка смены имени пользователя."
                    });
                }
                if (values.email !== props.authorizedUser.email) {
                    changeEmail(props.token, values.email).then(() => {
                        let arr = [...successChangeProfileData];
                        arr.push("email");
                        setSuccessChangeProfileData(arr);
                    }, () => {
                        profileDataForm.errors.email = "Ошибка смены электронной почты."
                    });
                }
                if (values.currentPassword.length && values.newPassword.length) {
                    changePassword(props.token, values.currentPassword, values.newPassword).then(() => {
                        let arr = [...successChangeProfileData];
                        arr.push("password");
                        setSuccessChangeProfileData(arr);
                    }, () => {
                        profileDataForm.errors.currentPassword = "Неверный текущий пароль.";
                    });
                }
            }
        }
    })

    function deleteAccountHandler(event) {
        deleteAccount(props.token).then(() => {
            navigate("/");
        })
    }

    return (
        <div className="profile-content bg-dark border border-2 border-secondary p-4">
            <form onSubmit={profileDataForm.handleSubmit}>
                <h2>Личные данные</h2>
                <div className="mb-3">
                    <label htmlFor="usernameInput" className="form-label">Имя пользователя</label>
                    <div className="form-control rounded-pill">
                        <input type="text" className="form-control" id="usernameInput"
                               aria-describedby="username-help"
                               name="username"
                               onChange={profileDataForm.handleChange}
                               value={profileDataForm.values.username}/>
                    </div>
                    <div id="username-help" className="form-text">Имя пользователя должно содержать не менее 3-х
                        символов.
                    </div>
                    {profileDataForm.isSubmitting && successChangeProfileData.some(elem => elem === 'username') &&
                        (<span className="text-success">Имя пользователя успешно изменено.</span>)}
                    {profileDataForm.errors.username && (
                        <span className="text-warning">{profileDataForm.errors.username}</span>)}
                </div>
                <div className="mb-3">
                    <label htmlFor="emailInput" className="form-label">Email address</label>
                    <div className="form-control rounded-pill">
                        <input type="email" className="form-control"
                               aria-describedby="emailHelp"
                               name="email"
                               onChange={profileDataForm.handleChange}
                               value={profileDataForm.values.email}/>
                    </div>
                    <div id="emailHelp" className="form-text">Мы никогда не поделимся вашей почтей ни с кем либо.</div>
                    {profileDataForm.isSubmitting && successChangeProfileData.some(elem => elem === 'email') &&
                        (<span className="text-success">Письмо для смены электронной почты отправлено.</span>)}
                    {profileDataForm.errors.email && (
                        <span className="text-warning">{profileDataForm.errors.email}</span>)}
                </div>
                <h2>Смена пароля</h2>
                <div className="mb-3">
                    <div className="d-flex align-items-center form-control rounded-pill">
                        <input type="password" className="form-control"
                               placeholder="Текущий пароль"
                               name="currentPassword"
                               onChange={profileDataForm.handleChange}
                               value={profileDataForm.values.currentPassword}
                               required={profileDataForm.values.newPassword.length}/>
                        {showCurrentPassword ?
                            (<FontAwesomeIcon icon={faSolidEye} className="ms-2" data-input-name="currentPassword"
                                              onClick={handlerShowingPassword}/>) :
                            (<FontAwesomeIcon icon={faSolidEyeSlash} className="ms-2" data-input-name="currentPassword"
                                              onClick={handlerShowingPassword}/>)}
                    </div>
                    {profileDataForm.errors.currentPassword && (
                        <span className="text-warning">{profileDataForm.errors.currentPassword}</span>)}
                </div>
                <div className="mb-3">
                    <div className="d-flex align-items-center form-control rounded-pill">
                        <input type="password" className="form-control"
                               placeholder="Новый пароль пароль"
                               name="newPassword"
                               onChange={profileDataForm.handleChange}
                               value={profileDataForm.values.newPassword}
                               required={profileDataForm.values.currentPassword.length}/>
                        {showNewPassword ?
                            (<FontAwesomeIcon icon={faSolidEye} className="ms-2" data-input-name="newPassword"
                                              onClick={handlerShowingPassword}/>) :
                            (<FontAwesomeIcon icon={faSolidEyeSlash} className="ms-2" data-input-name="newPassword"
                                              onClick={handlerShowingPassword}/>)}
                    </div>
                    <div id="newPasswordHelp" className="form-text">Пароль должен быть не менее 8-ми
                        символов и иметь заглавную букву, цифры, строчную букву.
                    </div>
                    {profileDataForm.isSubmitting && successChangeProfileData.some(elem => elem === 'password') &&
                        (<span className="text-success">Пароль успешно изменён.</span>)}
                    {profileDataForm.errors.newPassword && (
                        <span className="text-warning">{profileDataForm.errors.newPassword}</span>)}
                </div>
                <div className="form-check form-switch w-auto mb-3" id="confirmUserTerms">
                    <input className="form-check-input d-block" type="checkbox" role="switch"
                           id="confirmUserTerms"
                           name="confirmUserTerms"
                           onChange={profileDataForm.handleChange}
                           checked={profileDataForm.values.confirmUserTerms}/>
                    <label className="form-check-label" htmlFor="confirmUserTerms">
                        Я даю согласие на обработку моих <Link to="/document/agreement" className="text-secondary">персональных
                        данных</Link>
                    </label>
                </div>
                <div className="row align-items-center">
                    <button className="btn btn-primary rounded-pill fs-5 w-auto"
                            disabled={!(profileDataForm.values.confirmUserTerms && profileDataForm.dirty)}
                            type="submit">Сохранить
                    </button>
                    <span className="form-text col-8">Нажимая на кнопку "Сохранить" вы соглашаетесь на обработку персональных данных и принимаете условия <Link
                        to="/document/agreement"
                        className="text-secondary">Пользовательского соглашения.</Link></span>
                </div>
            </form>
            <div className="d-flex align-items-center mt-3 justify-content-evenly">
                <button className="btn btn-danger rounded-pill w-auto"
                        type="submit" disabled={!deleteConfirm}
                        onClick={deleteAccountHandler}>Удалить аккаунт
                </button>
                <div className="form-check form-switch row">
                    <input className="form-check-input d-block" type="checkbox" role="switch"
                           id="confirmDeleteAccount"
                           name="confirmDeleteAccount"
                           checked={deleteConfirm}
                           onChange={(event) => { setDeleteConfirm(!deleteConfirm)}}/>
                    <label className="form-check-label" htmlFor="confirmDeleteAccount">
                        Удаление аккаунта безвозвратная процедура, данные восстановлению не подлежат
                    </label>
                </div>
            </div>
        </div>
    )
}