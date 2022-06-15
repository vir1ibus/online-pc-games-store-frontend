import { faVk } from "@fortawesome/free-brands-svg-icons"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

function Footer() {
    return (
        <footer className="mt-auto d-flex justify-content-center align-items-center">
            <div className="footer-container border-top row justify-content-between">
                <div className="row col-2 justify-content-center align-items-top">
                    <a href="/" className="w-auto h-auto">
                        <img className="logo" src={process.env.PUBLIC_URL + '/img/logo.png'} alt="logo"/>
                    </a>
                </div>
                <div className="col-8">
                    <table className="nav-footer table table-borderless">
                        <tbody>
                        <tr>
                            <td><a href="/">Новинки</a></td>
                            <td><a href="/">О компании</a></td>
                            <td><a href="/">Поддержка</a></td>
                        </tr>
                        <tr>
                            <td><a href="/">Скидки</a></td>
                            <td><a href="/">Контакты</a></td>
                        </tr>
                        <tr>
                            <td><a href="/">Лидеры</a></td>
                        </tr>
                        </tbody>
                    </table>
                </div>
                <div className="row col-2 social-footer justify-content-around">
                    <a href="https://vk.com/voldemarkr" className="col-6 w-auto"><FontAwesomeIcon icon={faVk} /></a>
                    <a href="https://t.me/vir1ibus" className="bi bi-telegram col-6 w-auto"></a>

                </div>
            </div>
        </footer>
    );
}

export default Footer;