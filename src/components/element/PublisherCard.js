import {image_url} from "../../App";
import {Link} from "react-router-dom";

export default function PublisherCard(props) {
    return (
        <Link to={"/publisher/" + props.publisher['id']} className="card card-publisher">
            {props.publisher['img'] ? (
                <>
                    <img className="card-img-top bg-white" src={image_url + "/publisher/" + props.publisher['img']}/>
                    <div className="card-body">
                        <div className="card-text">
                            <h4>{props.publisher['title']}</h4><br/>
                            <span className="btn btn-primary w-100">Игр{'\t'}-{'\t'}{props.publisher['count_items']}</span>
                        </div>
                    </div>
                </>
            ) : (
                <>
                    <div className="card-body d-flex justify-content-center align-items-center">
                        <div className="card-text d-flex flex-column justify-content-center align-items-center">
                            <h4>{props.publisher['title']}</h4><br/>
                            <span className="btn btn-primary w-100">Игр{'\t'}-{'\t'}{props.publisher['count_items']}</span>
                        </div>
                    </div>
                </>
            )}

        </Link>
    )
}