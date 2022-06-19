import React, {useEffect, useState} from "react";
import {Field, FieldArray, useFormik} from "formik";
import {
    addCategory,
    addDeveloper, addItem,
    addPublisher, deleteCarousel,
    deleteCategory, getCarousel,
    getCategory,
    getSystemRequirement
} from "../../scripts/api";
import $ from "jquery";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faCross,
    faMinus,
    faPencilSquare,
    faPlus,
    faRubleSign,
    faXmark,
    faXmarksLines
} from "@fortawesome/free-solid-svg-icons";
import {image_url} from "../../App";
import {Link} from "react-router-dom";
import CarouselModal from "../modal/CarouselModal";
import {Modal} from "bootstrap";

export default function ModeratorPanelTab(props) {

    const [category, setCategory] = useState(null);
    const [errors, setErrors] = useState(new Map());
    const [carousel, setCarousel] = useState([]);
    const [carouselModal, setCarouselModal] = useState(false);
    const [carouselModalType, setCarouselModalType] = useState(null);

    useEffect(() => {
        getCarousel().then(response => {
            setCarousel(response);
        });
    }, [carousel])

    useEffect(() => {
        getCategory().then(response => {
            setCategory(response);
        })
    }, [category])

    const publisherCreateForm = useFormik({
        initialValues: {
            namePublisher: '',
            img: null
        },
        onSubmit: (values) => {
            addPublisher(props.token, values.namePublisher, values.img).then(response => {
                if(!response) {
                    publisherCreateForm.errors.publisher = 'Ошибка добавления издателя.';
                    publisherCreateForm.setSubmitting(false);
                }
            })
        }
    })

    const developerCreateForm = useFormik({
        initialValues: {
            nameDeveloper: '',
            img: null
        },
        onSubmit: (values) => {
            addDeveloper(props.token, values.nameDeveloper, values.img).then(response => {
                if(!response) {
                    developerCreateForm.errors.developer = 'Ошибка добавления издателя.';
                    developerCreateForm.setSubmitting(false);
                }
            })
        }
    })

    const itemCreateForm = useFormik({
        initialValues: {
            title: '',
            img: null,
            price: 0,
            discount: 0,
            resultPrice: 0,
            languageSupport: '',
            dateRealise: new Date().toLocaleDateString('ru-RU').split('.').reverse().join('-'),
            titleDescription: '',
            textDescription: '',
            platform: '',
            regionActivation: null,
            publisher: null,
            developer: null,
            itemType: null,
            serviceActivation: null,
            screenshots: [],
            trailer: [],
            systemRequirement: [],
            systemRequirementValue: [],
            genre: [],
            activateKeys: []
        },
        onSubmit: values => {
            addItem(props.token, values).then(() => {
            }, () => {
                itemCreateForm.setSubmitting(false);
            });
        }
    });

    useEffect(() => {
        if(itemCreateForm.values.systemRequirement.length > itemCreateForm.values.systemRequirementValue.length) {
            itemCreateForm.values.systemRequirement.map((value, index) => {
                getSystemRequirement(value).then(response => {
                    itemCreateForm.values.systemRequirementValue[index] = response;
                })
            })
        } else if(itemCreateForm.values.systemRequirement.length < itemCreateForm.values.systemRequirementValue.length){
            itemCreateForm.values.systemRequirementValue = itemCreateForm.values.systemRequirementValue.filter(value => {
                return itemCreateForm.values.systemRequirement.some(value1 => {
                    return value1 == value['id']
                });
            });
        }
    }, [itemCreateForm.values.systemRequirement])

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

    function deleteCarouselItemHandler(event) {
        let id = event.currentTarget.getAttribute("data-id");
        deleteCarousel(props.token, id).then(() => {
            let arr = [...carousel];
            arr.filter(value => {
                return value['id'] != id;
            })
            setCarousel(arr);
        })
    }

    function editCarouselItemHandler(event) {
        setCarouselModal(!carouselModal);
        setCarouselModalType(carousel.find(value => {
            return value['id'] == event.currentTarget.getAttribute('data-id');
        }));
    }

    function addCarouselHandler() {
        setCarouselModal(!carouselModal);
        setCarouselModalType('add');
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

    return (
        <div className="profile-content bg-dark border border-2 border-secondary p-4">
            <div className="border-bottom border-2 border-secondary pb-3 mb-3">
                <h2>Промо-баннеры</h2>
                <div className="row flex-nowrap overflow-auto gap-3" id="carousel">
                    {carousel.length > 0 && carousel.map(carouselItem => (
                        <div className="card card-carousel text-center col-5">
                            <img className="card-img-top"
                                 src={image_url + "item/screenshot/" + carouselItem['screenshot']['path']}/>
                            <div className="card-body">
                                <Link to={"/game/" + carouselItem['item']['id']} className="text-secondary fs-5">{carouselItem['item']['title']}</Link>
                            </div>
                            <div className="d-flex justify-content-end pb-2 gap-2 pe-2 text-secondary">
                                {carousel.length > 1 && (<FontAwesomeIcon icon={faXmark} style={{ cursor: 'pointer'}} className="fs-4" data-id={carouselItem['id']} onClick={deleteCarouselItemHandler}/>)}
                                <FontAwesomeIcon icon={faPencilSquare} style={{ cursor: 'pointer'}} className="fs-4" data-id={carouselItem['id']} onClick={editCarouselItemHandler}/>
                            </div>
                        </div>
                    ))}
                    <div className="card card-carousel d-flex justify-content-center align-items-center col-5" style={{ cursor: 'pointer'}} onClick={addCarouselHandler}>
                        <FontAwesomeIcon icon={faPlus} className="fs-1 text-success"/>
                    </div>
                    {carouselModal &&
                        (<CarouselModal
                            type={carouselModalType}
                            token={props.token}
                            carousel={carousel}
                            setCarousel={setCarousel}/>)}
                </div>
            </div>
            <div className="border-bottom border-2 border-secondary pb-3 mb-3">
                <h2>Добавление издателя</h2>
                <form onSubmit={publisherCreateForm.handleSubmit}>
                    <div className="form-floating mb-3">
                        <input className="form-control" id="name-publisher"
                               name="namePublisher"
                               onChange={publisherCreateForm.handleChange}
                               value={publisherCreateForm.values.namePublisher} required={true}/>
                        <label htmlFor="name-publisher">Наименование издателя</label>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="img-publisher" className="form-label">Изображение издателя</label>
                        <input className="form-control form-control-sm" id="img-publisher" type="file"
                               accept="image/*" onChange={(event) => { publisherCreateForm.setFieldValue("img", event.currentTarget.files[0]); } }
                        />
                    </div>
                    <button className="btn btn-primary" type="submit">Добавить издателя</button>
                    {publisherCreateForm.errors.publisher && (<span className="text-warning w-auto ms-3">Ошибка добавления издателя.</span>)}
                    {publisherCreateForm.isSubmitting && (<span className="text-success w-auto ms-3">Успешное добавление издателя.</span>)}
                </form>
            </div>
            <div className="border-bottom border-2 border-secondary pb-3 mb-3">
                <h2>Добавление разработчика</h2>
                <form onSubmit={developerCreateForm.handleSubmit}>
                    <div className="form-floating mb-3">
                        <input className="form-control" id="name-developer"
                               name="nameDeveloper"
                               onChange={developerCreateForm.handleChange}
                               value={developerCreateForm.values.nameDeveloper} required={true}/>
                        <label htmlFor="name-developer">Наименование разработчика</label>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="img-developer" className="form-label">Изображение разработчика</label>
                        <input className="form-control form-control-sm" id="img-developer" type="file"
                               accept="image/*" onChange={(event) => { developerCreateForm.setFieldValue("img", event.currentTarget.files[0]); } }
                        />
                    </div>
                    <button className="btn btn-primary" type="submit">Добавить разработчика</button>
                    {developerCreateForm.errors.developer && (<span className="text-warning w-auto ms-3">Ошибка добавления разработчика.</span>)}
                    {developerCreateForm.isSubmitting && (<span className="text-success w-auto ms-3">Успешное добавление разработчика.</span>)}
                </form>
            </div>
            <div className="border-bottom border-2 border-secondary pb-3 mb-3">
                <form onSubmit={itemCreateForm.handleSubmit}>
                    <h2>Добавление игры</h2>
                    <div className="form-floating mb-3">
                        <input className="form-control" id="title"
                               name="title"
                               onChange={itemCreateForm.handleChange}
                               value={itemCreateForm.values.title} required={true}/>
                        <label htmlFor="title">Наименование игры</label>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="imgItem" className="form-label">Титульное изображение игры</label>
                        <input className="form-control form-control-sm" id="imgItem" type="file"
                               accept="image/*" onChange={(event) => { itemCreateForm.setFieldValue("img", event.currentTarget.files[0]); } }
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
                                       onChange={itemCreateForm.handleChange}
                                       value={itemCreateForm.values.price} required={true}/>
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
                                       onChange={itemCreateForm.handleChange}
                                       value={itemCreateForm.values.discount}
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
                                       onChange={itemCreateForm.handleChange}
                                       value={Math.round(itemCreateForm.values.price - ((itemCreateForm.values.price / 100) * itemCreateForm.values.discount))}
                                       readOnly={true}/>
                                <FontAwesomeIcon icon={faRubleSign} className="fs-5 ms-2"/>
                            </div>
                        </div>
                    </div>
                    <div className="mb-3 form-floating">
                        <input className="form-control" id="languageSupport"
                               name="languageSupport"
                               onChange={itemCreateForm.handleChange}
                               value={itemCreateForm.values.languageSupport} required={true}/>
                        <label htmlFor="languageSupport">Поддержка языков</label>
                    </div>
                    <div className="mb-3 form-floating">
                        <input className="form-control w-auto" id="dateRealise"
                               name="dateRealise"
                               type="date"
                               onChange={itemCreateForm.handleChange}
                               value={itemCreateForm.values.dateRealise}
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
                                   onChange={itemCreateForm.handleChange}
                                   value={itemCreateForm.values.titleDescription} required={true}/>
                            <label htmlFor="titleDescription">Заголовок описания</label>
                        </div>
                        <div className="mb-3 form-floating">
                        <textarea className="form-control h-auto" id="textDescription"
                                  name="textDescription"
                                  onChange={itemCreateForm.handleChange}
                                  value={itemCreateForm.values.textDescription}
                                  rows="15"
                                  required={true}/>
                            <label htmlFor="textDescription">Текст описания</label>
                        </div>
                    </div>
                    <div className="mb-3 form-floating">
                        <input className="form-control" id="platform"
                               name="platform"
                               onChange={itemCreateForm.handleChange}
                               value={itemCreateForm.values.platform} required={true}/>
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
                                                           onChange={itemCreateForm.handleChange}
                                                           value={value['id']}/>
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
                                    {
                                        key !== 'publisher' && key !== 'developer' && (
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
                                        )
                                    }

                                    {errors.get(key) &&
                                        (<li>
                                            <div className="text-center">
                                                <span className="text-warning">{errors.get(key)}</span>
                                            </div>
                                        </li>)}
                                </ul>
                            </div>
                        ))}
                    </div>
                    {itemCreateForm.values.systemRequirement.length > 0 && (
                        <div className="mb-3">
                            <label className="form-label">Системные характеристики</label>
                            {itemCreateForm.values.systemRequirementValue.length > 0 && itemCreateForm.values.systemRequirementValue.map((value, index) => (
                                <div className="mb-3 form-floating">
                                    <input className="form-control"
                                           id={value['id']}
                                           name={"systemRequirementValue." + index}
                                           onChange={itemCreateForm.handleChange}
                                           required={true}/>
                                    <label htmlFor={value['id']}>{value['title']}</label>
                                </div>
                            ))}
                        </div>
                    )}
                    <div className="mb-3">
                        <label className="form-label">Скриншоты</label>
                        {itemCreateForm.values.screenshots.length > 0 &&
                            itemCreateForm.values.screenshots.map((value, index, array) => (
                                <div className="d-flex align-items-center">
                                    <input className="form-control form-control-sm" type="file"
                                           accept="image/*"
                                           onChange={(event) => { itemCreateForm.setFieldValue("screenshots." + index, event.currentTarget.files[0]); } }
                                    />
                                    <FontAwesomeIcon className="text-warning fs-5 p-2" icon={faMinus} onClick={() => {
                                        itemCreateForm.values.screenshots = itemCreateForm.values.screenshots.filter((value, index1) => {
                                            return index1 !== index;
                                        })
                                    }}/>
                                </div>
                            ))}
                        <div className="d-flex align-items-center">
                            <FontAwesomeIcon className="text-success fs-5 p-2" icon={faPlus}
                                             onClick={() => {
                                                 itemCreateForm.values.screenshots.push(new File([], "", undefined))
                                             }}/>
                        </div>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Ключи активации</label>
                        <textarea className="form-control"
                                  name="activateKeys"
                                  onChange={(event) => {
                                      let str = event.currentTarget.value;
                                      str = str.replaceAll('\n', ' ');
                                      str = str.replaceAll(';', ' ');
                                      str = str.replaceAll(',', ' ');
                                      str = str.split(' ');
                                      str = str.filter(value => {
                                          return value.length > 0;
                                      });
                                      str = str.filter((element, index) => {
                                          return str.indexOf(element) === index;
                                      })
                                      itemCreateForm.values.activateKeys = str;
                                  }}/>
                        <span className="form-text">Ключи активации необходимо вводить с разделителем (пробел, запятая, точка с запятой, перенос строки)</span>
                    </div>
                    <div>
                        <button className="btn btn-primary" type="submit" onClick={() => { console.log(itemCreateForm.values) }}>Добавить игру</button>
                    </div>
                    {itemCreateForm.isSubmitting && (
                        <span className="text-success">Продукт успешно добавлен.</span>
                    )}
                </form>
            </div>
        </div>
    );
}