import React, {useEffect, useState} from "react";
import {getMinimalUsers, getRoles, getUser, saveUser} from "../../scripts/api";
import {Field, useFormik} from "formik";

export default function AdminPanelTab(props) {

    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [currentUser, setCurrentUser] = useState(undefined);

    useEffect(() => {
        getMinimalUsers(props.token).then(response => {
            setUsers(response);
        })
        getRoles(props.token).then(response => {
            setRoles(response);
        })
    }, []);

    function searchEnterHandler(event) {
        if(event.key === 'Enter') {
            getUser(props.token, event.currentTarget.value).then(response => {
                setCurrentUser(response);
            });
        }
    }

    const userForm = useFormik({
        initialValues: {
            id: currentUser ? currentUser['id'] : null,
            username: currentUser ? currentUser['username'] : null,
            email: currentUser ? currentUser['email'] : null,
            active: currentUser ? currentUser['active'] : null,
            role: currentUser ? currentUser['role'].map(role => { return role['name'] }) : null
        },
        enableReinitialize: true,
        onSubmit: values => {
            saveUser(props.token, values).then(() => {})
        }
    })

    return (
        <div className="profile-content bg-dark border border-2 border-secondary p-4">
            <div className="mb-3">
                <label htmlFor="itemId" className="form-label">Поиск пользователя по ID, username, email</label>
                <input className="form-control"
                       list="usersList"
                       id="users"
                       name="users"
                       onKeyDown={searchEnterHandler}
                       autoComplete="off"/>
                <datalist id="usersList">
                    {users.length > 0 && users.map(value => (
                        <option value={value['id']}>{value['username']} - {value['email']}</option>
                    ))}
                </datalist>
            </div>
            {currentUser && (
                <form onSubmit={userForm.handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="usernameInput" className="form-label">ID пользователя</label>
                        <div className="form-control rounded-pill">
                            <input type="text" className="form-control"
                                   id="id"
                                   aria-describedby="username-help"
                                   name="id"
                                   onChange={userForm.handleChange}
                                   value={userForm.values.id}/>
                        </div>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="usernameInput" className="form-label">Имя пользователя</label>
                        <div className="form-control rounded-pill">
                            <input type="text" className="form-control"
                                   id="username"
                                   aria-describedby="username-help"
                                   name="username"
                                   value={userForm.values.username}/>
                        </div>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="emailInput" className="form-label">Email address</label>
                        <div className="form-control rounded-pill">
                            <input type="email" className="form-control"
                                   aria-describedby="emailHelp"
                                   id="email"
                                   name="email"
                                   value={userForm.values.email}/>
                        </div>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="emailInput" className="form-label">Смена пароля</label>
                        <div className="d-flex align-items-center form-control rounded-pill">
                            <input type="password" className="form-control"
                                   id="password"
                                   name="password"
                                    onChange={userForm.handleChange}/>
                        </div>
                    </div>
                    <div className="mb-3">
                        {roles.length > 0 && roles.map(value => (
                            <div className="form-check form-switch ms-5">
                                <input className="form-check-input"
                                       type="checkbox"
                                       name="role"
                                       onChange={userForm.handleChange}
                                       value={value['name']} />
                                <label className="form-check-label" htmlFor={"role-" + value['name']}>{value['name']}</label>
                            </div>
                        ))}
                    </div>
                    <button className="btn btn-primary" type="submit" disabled={!userForm.dirty}>Сохранить</button>
                </form>
            )}
        </div>
    )
}