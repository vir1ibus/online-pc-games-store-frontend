import axios from "axios";

export const api = axios.create({
    baseURL: "https://vir1ibus-shop-backend.herokuapp.com/"
    // baseURL: "http://localhost:3000/"
});

let qs = require('qs');

export async function isAuthenticated(token) {
    if (token) {
        token = decodeURIComponent(token);
        return new Promise((resolve, reject) => {
            api.get(
                "/authorization/",
                {
                    headers: { Authorization: token }
                }
            ).then(response => {
                resolve(response.data);
            }).catch(error => {
                reject();
            });
        });
    } else {
        return new Promise((resolve, reject) => {
            reject(false);
        });
    }
}

export async function signIn(username, password) {
    return new Promise((resolve, reject) => {
        api.post(
            "/authorization/authentication/",
            {
                username: username,
                password: password
            }
        ).then(response => {
            resolve(response.data);
        }, error => {
            reject(error.response.data);
        });
    });
}

export async function signUp(username, email, password) {
    return new Promise((resolve, reject) => {
        api.post(
            "/authorization/registration/",
            {
                username: username,
                email: email,
                password: password
            }
        ).then(response => {
            resolve(true);
        }, error => {
            reject(error.response.data);
        });
    })
}

export async function confirmAccount(confirm_token) {
    return new Promise((resolve, reject) => {
        api.put(
            "/authorization/confirm/" + confirm_token
        ).then(response => {
            resolve(true);
        }).catch(error => {
            reject(false);
        });
    });
}

export async function findItemsByFilter(filters, page = 0) {
    return new Promise((resolve) => {
        api.get(
            '/catalog',
            {
                params: { ...filters, page: page },
                paramsSerializer: params => {
                    return qs.stringify(params, { encode: true, arrayFormat: 'repeat' })
                }
            }
        ).then(response => {
            resolve(response.data);
        });
    });
}

export async function addBasket(id, token) {
    return new Promise(async (resolve) => {
        await api.put(
            "/basket/" + id,
            {},
            {
                headers: { Authorization: token }
            }
        ).then(response => {
            if(response.status === 200){
                resolve(true);
            } else {
                resolve(false);
            }
        })
    });
}

export async function deleteBasket(id, token) {
    return new Promise(async (resolve) => {
        await api.delete(
            "/basket/" + id,
            {
                headers: { Authorization: token }
            }
        ).then(response => {
            if(response.status === 200){
                resolve(true);
            } else {
                resolve(false);
            }
        })
    });
}

export async function getBasket(token) {
    return new Promise(async (resolve) => {
        await api.get(
            "/basket",
            {
                headers: { Authorization: token }
            }
        ).then(response => {
            if(response.status === 200){
                resolve(response.data);
            } else {
                resolve([]);
            }
        })
    });
}

export async function getItemForBasket(id) {
    return new Promise(async (resolve) => {
        await api.get(
            "/item/" + id + "/basket",
        ).then(response => {
            if(response.status === 200){
                resolve(response.data);
            } else {
                resolve(null);
            }
        })
    });
}

export async function findCatalog() {
    return new Promise( async (resolve) => {
        let result = new Map();
        await getGenres().then(response => {
            result.set('genres', response);
        });
        await getPublishers().then(response => {
            result.set('publishers', response);
        });
        await getDevelopers().then(response => {
            result.set('developers', response);
        });
        resolve(result);
    });
}

export async function getGenres(count = true) {
    return new Promise(async (resolve) => {
        await api.get(
            "/genres"
        ).then(response => {
            if(!count) {
                response.data.pop();
            }
            resolve(response.data? response.data : [])
        });
    });
}

export async function getPublishers(page = 0) {
    return new Promise(async (resolve) => {
        await api.get(
            "/publishers",
            {
                params: { page: page }
            }
        ).then(response => {
            resolve(response.data ? response.data : []);
        });
    })
}

export async function getDevelopers(page = 0) {
    return new Promise(async (resolve) => {
        await api.get(
            "/developers",
            {
                params: { page: page }
            }

        ).then(response => {
            resolve(response.data ? response.data : []);
        });
    })
}

export async function getItem(id) {
    return new Promise(async (resolve) => {
        await api.get(
            "/item/" +  id
        ).then(response => {
            if(response.status === 200){
                resolve(response.data);
            } else {
                resolve(null);
            }
        });
    });
}

export async function addReview(review) {
    return new Promise(async (resolve, reject) => {
        await api.post(
            "/review",
            {
                title: review.title,
                text: review.text,
                authorId: review.authorId,
                stars: review.stars,
                itemId: review.itemId
            }
        ).then(
            () => resolve()
        ).catch(
            () => reject()
        );
    })
}

export async function deleteReview(token, id) {
    return new Promise(async (resolve, reject) => {
        await api.delete(
            "/review/" + id,
            {
                headers: { Authorization: token }
            }
        ).then(() => {
            resolve(true);
        }).catch(() => {
            reject(false);
        });
    })
}

export async function getReviews(id, page = 0) {
    return new Promise(async (resolve, reject) => {
        await api.get(
            "/review/" + id,
            {
                params: { page: page }
            }
        ).then(
            response => resolve(response.data ? response.data : [])
        ).catch(
            () => reject()
        );
    })
}

export async function logOut(token) {
    return new Promise(async (resolve) => {
        await api.delete(
            '/authorization/logout',
            {
                headers: { Authorization : token }
            }
        ).then(response => resolve(true))
    })
}

export async function buy(token) {
    return new Promise(async (resolve) => {
        await api.get(
            '/payment/buy/items',
            { headers: { Authorization: token } }
        ).then(response => resolve(response.data))
    })
}

export async function successBuy(token, billId) {
    return new Promise(async (resolve) => {
        await api.get(
            '/payment/success',
            {
                headers: { Authorization: token },
                params: { billId: billId }
            }
        ).then(response => {
            if(response.status === 200) {
                resolve("PAID");
            } else {
                resolve("WAITING");
            }
        }).catch(() => resolve("REJECTED"));
    });
}

export async function addPublisher(token, name, file) {
    return new Promise(async (resolve) => {
        let formData = new FormData();
        formData.append("name", name);
        formData.append("image", file);
        await api.post(
            "/add/publisher",
            formData,
            {
                headers: {
                    Authorization: token,
                    'Content-Type' : 'multipart/form-data'
                }
            }
        ).then(() => {
            resolve(true);
        }).catch(() => {
            resolve(false);
        })
    })
}

export async function addDeveloper(token, name, file) {
    return new Promise(async (resolve) => {
        let formData = new FormData();
        formData.append("name", name);
        formData.append("image", file);
        await api.post(
            "/add/developer",
            formData,
            {
                headers: {
                    Authorization: token,
                    'Content-Type' : 'multipart/form-data'
                }
            }
        ).then(() => {
            resolve(true);
        }).catch(() => {
            resolve(false);
        })
    })
}

export async function changeEmail(token, email) {
    return new Promise(async (resolve, reject) => {
        await api.put(
            "/authorization/change/email",
            { email: email },
            {
                headers: {
                    Authorization: token
                }
            }
        ).then(() => {
            resolve();
        }).catch(() => {
            reject();
        })
    })
}

export async function changeUsername(token, input_username) {
    return new Promise(async (resolve, reject) => {
        await api.post(
            "/authorization/change/username",
            {
                username: input_username
            },
            {
                headers: {
                    Authorization: token
                }
            }
        ).then(() => {
            resolve();
        }).catch(() => {
            reject();
        })
    })
}

export async function changePassword(token, currentPassword, newPassword) {
    return new Promise(async (resolve, reject) => {
        await api.put(
            "/authorization/change/password",
            {
                currentPassword: currentPassword,
                newPassword: newPassword
            },
            {
                headers: {
                    Authorization: token
                }
            }
        ).then(() => {
            resolve();
        }).catch(() => {
            reject();
        })
    })
}

export async function getSystemRequirement(id) {
    return new Promise(async (resolve, reject) => {
        await api.get(
            "/systemRequirement/" + id
        ).then(response => {
            resolve(response.data);
        }).catch(() => {
            reject([]);
        })
    })
}

export async function getCategory() {
    return new Promise(async (resolve, reject) => {
        await api.get(
            "/info/category"
        ).then(response => {
            resolve(response.data);
        }).catch(() => {
            reject([]);
        })
    })
}

export async function addCategory(token, categoryType, name) {
    return new Promise(async (resolve, reject) => {
        await api.post(
            "/add/category",
            {
                categoryType: categoryType,
                name: name
            },
            {
                headers: {
                    Authorization: token
                }
            }
        ).then(response => {
            resolve(response.data);
        }, () => {
            reject();
        }).catch(() => {
            reject();
        })
    })
}

export async function deleteCategory(token, categoryType, id) {
    return new Promise(async (resolve, reject) => {
        await api.delete(
            "/delete/" + categoryType + "/" + id,
            {
                headers: {
                    Authorization: token
                }
            }
        ).then(response => {
            resolve();
        }, () => {
            reject();
        }).catch(() => {
            reject();
        })
    })
}

export async function deleteAccount(token) {
    return new Promise(async (resolve, reject) => {
        await api.delete(
            "/authorization/delete/",
            {
                headers: {
                    Authorization: token
                }
            }
        ).then(response => {
            resolve();
        }, () => {
            reject();
        }).catch(() => {
            reject();
        })
    })
}

export async function getPublisher(id) {
    return new Promise(async (resolve, reject) => {
        await api.get(
            "/publisher/" + id
        ).then(response => {
            resolve(response.data);
        }, () => {
            reject();
        }).catch(() => {
            reject();
        })
    })
}

export async function getDeveloper(id, token) {
    return new Promise(async (resolve, reject) => {
        await api.get(
            "/developer/" + id
        ).then(response => {
            resolve(response.data);
        }, () => {
            reject();
        }).catch(() => {
            reject();
        })
    })
}

export async function getPurchases(token) {
    return new Promise(async (resolve, reject) => {
        await api.get(
            "/payment/purchases",
            {
                headers: { Authorization: token }
            }
        ).then(response => {
            resolve(response.data);
        }, () => {
            reject();
        }).catch(() => {
            reject();
        })
    })
}

export async function addItem(token, item) {
    return new Promise(async (resolve, reject) => {
        let createItemForm = new FormData();
        createItemForm.append('title', item.title);
        createItemForm.append('img', item.img);
        createItemForm.append('price', item.price);
        createItemForm.append('discount', item.discount);
        createItemForm.append('resultPrice', item.resultPrice);
        createItemForm.append('languageSupport', item.languageSupport);
        createItemForm.append('dateRealise', item.dateRealise);
        createItemForm.append('titleDescription', item.titleDescription);
        createItemForm.append('textDescription', item.textDescription);
        createItemForm.append('platform', item.platform);
        createItemForm.append('regionActivation', item.regionActivation);
        createItemForm.append('publisher', item.publisher);
        createItemForm.append('developer', item.developer);
        createItemForm.append('itemType', item.itemType);
        createItemForm.append('serviceActivation', item.serviceActivation);
        item.screenshots.forEach(value => {
            createItemForm.append('screenshots', value);
        })
        createItemForm.append('trailers', item.trailers);
        createItemForm.append('systemRequirementId', item.systemRequirement);
        createItemForm.append('systemRequirementValue', item.systemRequirementValue);
        createItemForm.append('genre', item.genre);
        createItemForm.append('activateKeys', item.activateKeys);
        await api.post(
            "/add/item",
            createItemForm,
            {
                headers: {
                    Authorization: token,
                    'Content-Type' : 'multipart/form-data'
                }
            }
        ).then(response => {
            resolve(response.data);
        }, () => {
            reject();
        }).catch(() => {
            reject();
        })
    })
}