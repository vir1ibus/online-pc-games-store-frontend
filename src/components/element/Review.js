import React, {useEffect, useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faStar as faSolidStar, faXmark as faSolidXmark} from "@fortawesome/free-solid-svg-icons";
import {faStar as faRegularStar} from "@fortawesome/free-regular-svg-icons";

import {Link} from "react-router-dom";

export default function Review(props) {
    const [review] = useState(props.value);

    if(review && props.authorizedUser)
    return (
        <div className="d-flex flex-column review">
            {review.author.id === props.authorizedUser.id || props.authorizedUser['role'].some(role => role['name'] === 'moderator') ?
                (<div className="review-date d-flex justify-content-between">{props.formatDate(new Date(review['date']))} <FontAwesomeIcon icon={faSolidXmark} className="text-secondary fs-5" onClick={props.deleteReviewHandler} data-review-id={review['id']}/></div>) :
                (<div className="review-date d-flex">{props.formatDate(new Date(review['date']))}</div>)}
            <div className="row justify-content-between review-author">
                <Link to={'/user/' + review.author.id} className="w-auto text-secondary">{review.author.username}</Link>
                <div className="row w-auto">
                    <div className="w-auto">
                        {review.stars >= 1 ? (<FontAwesomeIcon icon={faSolidStar} className="text-secondary"/>) : <FontAwesomeIcon icon={faRegularStar}/>}
                    </div>
                    <div className="w-auto">
                        {review.stars >= 2 ? (<FontAwesomeIcon icon={faSolidStar} className="text-secondary"/>) : <FontAwesomeIcon icon={faRegularStar}/>}
                    </div>
                    <div className="w-auto">
                        {review.stars >= 3 ? (<FontAwesomeIcon icon={faSolidStar} className="text-secondary"/>) : <FontAwesomeIcon icon={faRegularStar}/>}
                    </div>
                    <div className="w-auto">
                        {review.stars >= 4 ? (<FontAwesomeIcon icon={faSolidStar} className="text-secondary"/>) : <FontAwesomeIcon icon={faRegularStar}/>}
                    </div>
                    <div className="w-auto">
                        {review.stars >= 5 ? (<FontAwesomeIcon icon={faSolidStar} className="text-secondary"/>) : <FontAwesomeIcon icon={faRegularStar}/>}
                    </div>
                </div>
            </div>
            <span className="review-title">{review.title}</span>
            <span className="review-text">{review.text.split('\n').map(str => {
                if(str.length) {
                    return (<p>{str}</p>);
                } else {
                    return (<>{'\n'}</>);
                }
            })}</span>
        </div>
    )
}