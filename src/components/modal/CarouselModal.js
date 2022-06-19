import {useEffect, useState} from "react";
import {Modal} from "bootstrap";
import $ from "jquery";
import {addCarousel, findItemsByFilter, getSelectMinimalItems, setCarousel} from "../../scripts/api";
import {useFormik} from "formik";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faXmark} from "@fortawesome/free-solid-svg-icons";
import {image_url} from "../../App";

export default function CarouselModal(props) {

    const [items, setItems] = useState([]);

    useEffect(() => {
        getSelectMinimalItems(props.token).then(response => {
            setItems(response);
        })
    }, [])

    let $ = require("jquery");

    useEffect(() => {
        Modal.getOrCreateInstance($('.modal')).show();
    }, [props.type]);


    const carouselForm = useFormik({
        initialValues: {
            itemId: props.type['item'] ? props.type['item']['id'] : null,
            screenshotId: props.type['screenshot'] ? props.type['screenshot']['id'] : null
        },
        onSubmit: values => {
            if(props.type === "add") {
                addCarousel(props.token, values.itemId, values.screenshotId).then(response => {
                    let arr = [...props.carousel];
                    arr.push(response);
                    props.setCarousel(arr);
                    Modal.getOrCreateInstance($('.modal')).hide();
                })
            } else {
                setCarousel(props.token, props.type['id'], values.itemId, values.screenshotId).then(response => {
                    let arr = [...props.carousel];
                    arr[arr.indexOf(arr.find(value => {
                        return value['id'] === response['id'];
                    }))] = response;
                    props.setCarousel(arr);
                    Modal.getOrCreateInstance($('.modal')).hide();
                })
            }
        }
    })


    return (
        <div className="modal" tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content bg-dark">
                    <form onSubmit={carouselForm.handleSubmit}>
                        <div className="modal-header">
                            <h5 className="modal-title">
                                { props.type === "add" ? "Добавить промо-баннер" : "Изменить промо-баннер" }
                            </h5>
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" aria-label="Close">
                                <FontAwesomeIcon icon={faXmark}/>
                            </button>
                        </div>
                        <div className="modal-body">
                                <div className="mb-3">
                                    <label htmlFor="itemId" className="form-label">Наименование продукта</label>
                                    <input className="form-control"
                                           list="itemIdOptions"
                                           id="itemId"
                                           name="itemId"
                                           onChange={carouselForm.handleChange}
                                           value={carouselForm.values.itemId}
                                           required={true}/>
                                    <datalist id="itemIdOptions">
                                        {items.length > 0 && items.map(value => (
                                            <option value={value['id']}>{value['title']}</option>
                                        ))}
                                    </datalist>
                                </div>
                                {carouselForm.values.itemId && (
                                    <div className="w-auto">
                                        <label className="form-label">Выбор скриншота</label>
                                        <div className="d-flex overflow-auto gap-3">
                                            {items.length > 0 && items.find(value => { return value['id'] == carouselForm.values.itemId})['screenshots'].map(value => (
                                                <div className="border border-2 border-secondary carousel-screenshot-picker position-relative">
                                                    <div className="carousel-screenshot-picker-fade">
                                                        <input
                                                            className="form-check-input"
                                                            type="radio"
                                                            name="screenshotId"
                                                            onChange={carouselForm.handleChange}
                                                            value={value['id']}
                                                            checked={carouselForm.values.screenshotId == value['id']}
                                                            required={true}/>
                                                    </div>
                                                    <img src={image_url + "item/screenshot/" + value['path']} style={{ width: '25em'}}/>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Закрыть</button>
                            {props.type === "add" ?
                                (<button type="submit" className="btn btn-primary">Добавить</button>) :
                                (<button type="submit" className="btn btn-primary" disabled={!carouselForm.dirty}>Сохранить</button>)}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}