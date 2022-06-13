import {useEffect, useState} from "react";
import {useParams, useSearchParams} from "react-router-dom";
import {successBuy} from "../../scripts/api";

export default function SuccessPayment(props) {

    const [searchParams, setSearchParams] = useSearchParams();
    const [status, setStatus] = useState('');

    useEffect(() => {
        successBuy(props.token, searchParams.get('billId')).then(response => {
            setStatus(response);
        }).catch(error => {
            setStatus(error);
        })
    }, [])

    switch (status) {
        case "PAID":
            return (
                <main id="content" className="d-flex justify-content-center align-items-center">
                    <h1 className="text-success">Оплата успешно прошла!</h1>
                </main>
            )
        case "WAITING":
            return (
                <main id="content" className="d-flex justify-content-center align-items-center">
                    <h1 className="text-muted">Ожидает оплаты.</h1>
                </main>
            )
        case "REJECTED":
            return (
                <main id="content" className="d-flex justify-content-center align-items-center">
                    <h1 className="text-warning">Оплата не прошла!</h1>
                </main>
            )
    }
}
