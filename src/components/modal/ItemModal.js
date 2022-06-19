import {useFormik} from "formik";
import {addCategory, addItem, deleteCategory, getCategory, getSystemRequirement} from "../../scripts/api";
import Cookies from "universal-cookie/lib";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faMinus, faPlus, faRubleSign, faXmark} from "@fortawesome/free-solid-svg-icons";
import {image_url} from "../../App";
import React, {useEffect, useState} from "react";
import {Modal} from "bootstrap";
import $ from "jquery";

export default function ItemModal(props) {

    const [category, setCategory] = useState(null);
    const [errors, setErrors] = useState(new Map());

    useEffect(() => {
        getCategory().then(response => {
            setCategory(response);
        })
    }, [category])

    const itemEditForm = useFormik({
        initialValues: {
            id: props.item['id'],
            title: props.item['title'],
            img: props.item['img'],
            price: props.item['price'],
            discount: props.item['discount'],
            resultPrice: props.item['result_price'],
            languageSupport: props.item['language_support'],
            dateRealise: props.item['date_realise'],
            titleDescription: props.item['description']['title'],
            textDescription: props.item['description']['text'],
            platform: props.item['platform'],
            regionActivation: props.item['region_activation'],
            publisher: props.item['publisher'],
            developer: props.item['developer'],
            itemType: props.item['item_type_title'],
            serviceActivation: props.item['service_activation'],
            screenshots: [...props.item['screenshots']],
            trailer: [...props.item['trailers']],
            systemRequirement: props.item['system_requirements'].map( value => value['title']),
            systemRequirementValue: props.item['system_requirements'].map( value => value['value']),
            genre: [...props.item['genres']]
        },
        onSubmit: values => {
            // setItem(props.token, values).then(() => {
            // }, () => {
            //     itemEditForm.setSubmitting(false);
            // });
            console.log(values);
        }
    });

    useEffect(() => {
        if(itemEditForm.values.systemRequirement.length > itemEditForm.values.systemRequirementValue.length) {
            itemEditForm.values.systemRequirement.map((value, index) => {
                getSystemRequirement(value).then(response => {
                    itemEditForm.values.systemRequirementValue[index] = response;
                })
            })
        } else if(itemEditForm.values.systemRequirement.length < itemEditForm.values.systemRequirementValue.length){
            itemEditForm.values.systemRequirementValue = itemEditForm.values.systemRequirementValue.filter(value => {
                return itemEditForm.values.systemRequirement.some(value1 => {
                    return value1 == value['id']
                });
            });
        }
    }, [itemEditForm.values.systemRequirement])

    function inputHandler(event) {
        if(event.currentTarget.value.length > event.currentTarget.maxLength) {
            event.currentTarget.value = event.currentTarget.value.slice(0, event.currentTarget.maxLength)
        }
        if(event.currentTarget.value.length === 0) {
            event.currentTarget.value = 0;
        }
    }

    function addCategoryHandler(event) {
        let categoryType = event.currentTarget.getAttribute('data-category-type');
        let inputName = $("input[name='" + categoryType + "Add']");
        addCategory(props.token, categoryType, inputName.val()).then(response => {
            inputName.val('');
            let arr = category;
            arr[categoryType].push(response);
            setCategory(arr);
        });
    }

    function deleteCategoryHandler(event) {
        let id = event.currentTarget.getAttribute('data-id');
        let categoryType = event.currentTarget.getAttribute('data-category-type');
        deleteCategory(props.token, categoryType, id).then(() => {
            let arr = category;
            arr[categoryType].filter(elem => elem['id'] !== id);
            setCategory(arr);
            errors.get(categoryType).clear()
        }, () => {
            let arr = errors;
            arr.set(categoryType, "Остались игры с данным параметром");
            setErrors(arr);
        });
    }

    function renderCategoryName(key) {
        switch (key) {
            case "genre":
                return 'Жанры';
            case "itemType":
                return 'Тип продукта';
            case "systemRequirement":
                return 'Системные требования';
            case "serviceActivation":
                return 'Сервис активации';
            case "regionActivation":
                return 'Регион активации';
            case "publisher":
                return 'Издатель';
            case "developer":
                return 'Разработчик';
        }
    }

    function renderInputType(key) {
        switch (key) {
            case "systemRequirement":
            case "genre":
                return 'checkbox';
            case "regionActivation":
            case "itemType":
            case "serviceActivation":
            case "publisher":
            case "developer":
                return 'radio';
        }
    }

    useEffect(() => {
        Modal.getOrCreateInstance($('.modal')).show();
    }, [props.item])

    return (
        <div className="modal" tabIndex="-1" data-bs-backdrop="static">
            <div className="modal-dialog modal-dialog-centered modal-lg" style={{ 'margin-top' : '7em' }}>
                <div className="modal-content bg-dark w-auto h-auto">
                    <form onSubmit={itemEditForm.handleSubmit}>
                        <div className="modal-header">
                            <h5 className="modal-title">
                                Изменить игру {props.item['id']}
                            </h5>
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" aria-label="Close">
                                <FontAwesomeIcon icon={faXmark}/>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="form-floating mb-3">
                                <input className="form-control"
                                       id="id"
                                       name="id"
                                       onChange={itemEditForm.handleChange}
                                       value={itemEditForm.values.id} required={true}/>
                                <label htmlFor="title">ID игры</label>
                            </div>
                            <div className="form-floating mb-3">
                                <input className="form-control" id="title"
                                       name="title"
                                       onChange={itemEditForm.handleChange}
                                       value={itemEditForm.values.title} required={true}/>
                                <label htmlFor="title">Наименование игры</label>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="imgItem" className="form-label">Титульное изображение игры</label>
                                <input className="form-control form-control-sm" id="imgItem" type="file"
                                       accept="image/*" onChange={(event) => { itemEditForm.setFieldValue("img", event.currentTarget.files[0]); } }
                                />
                            </div>
                            <div className="d-flex mb-3">
                                <div>
                                    <label htmlFor="price">Цена игры</label>
                                    <div className="d-flex align-items-center">
                                        <input className="form-control fs-5" id="price"
                                               name="price"
                                               type="number"
                                               min="0"
                                               maxLength="5"
                                               onInput={inputHandler}
                                               onChange={itemEditForm.handleChange}
                                               value={itemEditForm.values.price} required={true}/>
                                        <FontAwesomeIcon icon={faRubleSign} className="fs-5 ms-2"/>
                                    </div>
                                </div>
                                <div className="ms-3">
                                    <label htmlFor="price">Скидка</label>
                                    <div className="d-flex align-items-center">
                                        <input className="form-control fs-5" id="discount"
                                               name="discount"
                                               type="number"
                                               min="0"
                                               max="99"
                                               maxLength="2"
                                               onInput={inputHandler}
                                               onChange={itemEditForm.handleChange}
                                               value={itemEditForm.values.discount}
                                               required={true}/>
                                        <span className="fs-5 ms-2">%</span>
                                    </div>
                                </div>
                                <div className="ms-3">
                                    <label htmlFor="price">Итоговая цена</label>
                                    <div className="d-flex align-items-center">
                                        <input className="form-control fs-5"
                                               id="resultPrice"
                                               type="number"
                                               maxLength="5"
                                               onInput={inputHandler}
                                               onChange={itemEditForm.handleChange}
                                               value={Math.round(itemEditForm.values.price - ((itemEditForm.values.price / 100) * itemEditForm.values.discount))}
                                               readOnly={true}/>
                                        <FontAwesomeIcon icon={faRubleSign} className="fs-5 ms-2"/>
                                    </div>
                                </div>
                            </div>
                            <div className="mb-3 form-floating">
                                <input className="form-control" id="languageSupport"
                                       name="languageSupport"
                                       onChange={itemEditForm.handleChange}
                                       value={itemEditForm.values.languageSupport} required={true}/>
                                <label htmlFor="languageSupport">Поддержка языков</label>
                            </div>
                            <div className="mb-3 form-floating">
                                <input className="form-control w-auto" id="dateRealise"
                                       name="dateRealise"
                                       type="date"
                                       onChange={itemEditForm.handleChange}
                                       value={itemEditForm.values.dateRealise}
                                       min="1961-01-01"
                                       max={new Date().toLocaleDateString('ru-RU').split('.').reverse().join('-')}
                                       required={true}/>
                                <label htmlFor="dateRealise">Дата релиза</label>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="imgItem" className="form-label">Описание</label>
                                <div className="mb-3 form-floating">
                                    <input className="form-control" id="titleDescription"
                                           name="titleDescription"
                                           onChange={itemEditForm.handleChange}
                                           value={itemEditForm.values.titleDescription} required={true}/>
                                    <label htmlFor="titleDescription">Заголовок описания</label>
                                </div>
                                <div className="mb-3 form-floating">
                                    <textarea className="form-control h-auto" id="textDescription"
                                              name="textDescription"
                                              onChange={itemEditForm.handleChange}
                                              value={itemEditForm.values.textDescription}
                                              rows="15"
                                              required={true}/>
                                    <label htmlFor="textDescription">Текст описания</label>
                                </div>
                            </div>
                            <div className="mb-3 form-floating">
                                <input className="form-control" id="platform"
                                       name="platform"
                                       onChange={itemEditForm.handleChange}
                                       value={itemEditForm.values.platform} required={true}/>
                                <label htmlFor="platform">Платформа</label>
                            </div>
                            <div className="mb-3 d-flex gap-4 flex-wrap">
                                {category && Object.keys(category).map(key => (
                                    <div className="dropdown">
                                        <button className="btn btn-primary dropdown-toggle" type="button" data-bs-toggle="dropdown" data-bs-auto-close="outside" aria-expanded="false">
                                            {renderCategoryName(key)}
                                        </button>
                                        <ul className="dropdown-menu dropdown-menu-dark bg-dark border-secondary border-1">
                                            {category[key].map(value => (
                                                <li key={value['id']}>
                                                    <div className="dropdown-item form-switch btn-group align-items-center justify-content-between" role="group">
                                                        <div>
                                                            <input className="form-check-input"
                                                                   type={renderInputType(key)}
                                                                   id={key + "-" + value['id']}
                                                                   name={key}
                                                                   onChange={itemEditForm.handleChange}
                                                                   value={value['id']}
                                                                   defaultChecked={true}/>
                                                            <label className="form-check-label w-auto" htmlFor={key + "-" + value['id']}>{value['title']}</label>
                                                        </div>
                                                        {
                                                            key !== 'publisher' && key !== 'developer' && (
                                                                <a className="btn btn-primary ms-4 flex-grow-0" onClick={deleteCategoryHandler} data-category-type={key} data-id={value['id']}>
                                                                    <FontAwesomeIcon icon={faMinus}/>
                                                                </a>
                                                            )
                                                        }

                                                    </div>
                                                </li>
                                            ))}
                                            {key !== 'publisher' && key !== 'developer' && (
                                                <li>
                                                    <div className="dropdown-item" role="group">
                                                        <form className="d-flex align-items-center" onSubmit={(event) => event.preventDefault()}>
                                                            <input className="form-control"
                                                                   name={key + "Add"}
                                                                   placeholder="Наименование"
                                                                   required={true}/>
                                                            <a className="btn btn-primary ms-2" onClick={addCategoryHandler} data-category-type={key}>
                                                                <FontAwesomeIcon icon={faPlus}/>
                                                            </a>
                                                        </form>
                                                    </div>
                                                </li>
                                            )}
                                            {errors.get(key) && (
                                                <li>
                                                    <div className="text-center">
                                                        <span className="text-warning">{errors.get(key)}</span>
                                                    </div>
                                                </li>)}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                            {itemEditForm.values.systemRequirement.length > 0 && (
                                <div className="mb-3">
                                    <label className="form-label">Системные характеристики</label>
                                    {itemEditForm.values.systemRequirementValue.length > 0 && itemEditForm.values.systemRequirementValue.map((value, index) => (
                                        <div className="mb-3 form-floating">
                                            <input className="form-control"
                                                   id={value['id']}
                                                   name={"systemRequirementValue." + index}
                                                   onChange={itemEditForm.handleChange}
                                                   value={itemEditForm.values.systemRequirementValue[index]}
                                                   required={true}/>
                                            <label htmlFor={value['id']}>{itemEditForm.values.systemRequirement[index]}</label>
                                        </div>
                                    ))}
                                </div>
                            )}
                            <div className="mb-3">
                                <label className="form-label">Скриншоты</label>
                                <div className="row flex-nowrap overflow-auto">
                                    {itemEditForm.values.screenshots.length > 0 &&
                                        itemEditForm.values.screenshots.map((value, index, array) => {
                                            if(value['path']) {
                                                return (
                                                    <div className="col-6">
                                                        <img src={image_url + 'item/screenshot/' + value['path']} className="w-100" style={{ objectFit: "contain"}}/>
                                                    </div>
                                                )
                                            } else {
                                                return (
                                                    <div className="border border-2 border-secondary col-6 d-flex align-items-center justify-content-center" style={{ borderRadius: '3em' }}>
                                                        <label htmlFor={index} className="text-secondary w-100 h-100 d-flex align-items-center justify-content-center" style={{ cursor: 'pointer' }}>Выберите изображение</label>
                                                        <input className="form-control form-control-sm" type="file"
                                                               id={index}
                                                               accept="image/*"
                                                               onChange={(event) => {
                                                                   itemEditForm.setFieldValue("screenshots." + index, event.currentTarget.files[0]);
                                                               } }
                                                               style={{ opacity: 0, position: "absolute", zIndex: -1 }}/>
                                                    </div>
                                                )
                                            }
                                        })}
                                </div>

                                <div className="d-flex align-items-center">
                                    <FontAwesomeIcon
                                        className="text-success fs-5 p-2"
                                        icon={faPlus}
                                        onClick={() => {
                                            itemEditForm.values.screenshots.push(new File([], "", undefined))
                                        }}/>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            {itemEditForm.isSubmitting && (
                                <span className="text-success">Продукт успешно сохранён.</span>
                            )}
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Закрыть</button>
                            <button type="submit" className="btn btn-primary" disabled={!itemEditForm.dirty}>Сохранить</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}