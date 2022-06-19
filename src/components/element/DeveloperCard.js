import {image_url} from "../../App";
import {Link} from "react-router-dom";

export default function DeveloperCard(props) {
    return (
        <Link to={"/developer/" + props.developer['id']} className="card card-publisher">
            {props.developer['img'] ? (
                <>
                    <img className="card-img-top bg-white" src={image_url + "/developer/" + props.developer['img']}/>
                    <div className="card-body">
                        <div className="card-text">
                            <h4>{props.developer['title']}</h4><br/>
                            <span className="btn btn-primary w-100">Игр{'\t'}-{'\t'}{props.developer['count_items']}</span>
                        </div>
                    </div>
                </>
            ) : (
                <>
                    <div className="card-body d-flex justify-content-center align-items-center">
                        <div className="card-text d-flex flex-column justify-content-center align-items-center">
                            <h4>{props.developer['title']}</h4><br/>
                            <span className="btn btn-primary w-100">Игр{'\t'}-{'\t'}{props.developer['count_items']}</span>
                        </div>
                    </div>
                </>
            )}

        </Link>
    )
}