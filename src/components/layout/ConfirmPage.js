import {Component, useEffect, useState} from "react";
import {useParams, withRouter} from "react-router-dom";
import {confirmAccount} from "../../scripts/api";

export default function ConfirmPage() {
    let params = useParams();
    const [ activate, setActivate ] = useState(false);
    let success = {color: '#3cf281', fontSize: '2em'}
    let invalid = {color: '#e44c55', fontSize: '2em'}

    useEffect(() => {
        confirmAccount(params.confirmToken).then(() => {
            setActivate(true);
        }).catch(() => {
            setActivate(false);
        })
    }, [])

    if(activate) {
        return (
            <main id="content">
                <p className="text-center" style={success}>Аккаунт успешно активирован.</p>
            </main>
        );
    } else {
        return (
            <main id="content">
                <p className="text-center" style={invalid}>Ссылка неверна или уже активирована.</p>
            </main>
        );
    }
}