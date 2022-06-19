import {useEffect, useState} from "react";
import {getPublishers, getReviews} from "../../scripts/api";
import PublisherCard from "../element/PublisherCard";

export default function Publishers() {

    const [publishers, setPublishers] = useState([]);
    const [total, setTotal] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);

    useEffect(() => {
        loadPublishers();
    }, [currentPage])

    function loadPublishers() {
        getPublishers(currentPage).then(response => {
            let arr = [...publishers];
            arr.push(...response['values']);
            setPublishers(arr);
            setTotal(response['total_elements']);
            setTotalPages(response['total_pages']);
        })
    }

    return (
        <main id="content">
            <h1>Издатели <span className="text-secondary">{total}</span></h1>
            <div className="row gap-4">
                {publishers.length > 0 && publishers.map(publisher => (
                    <PublisherCard publisher={publisher}/>
                ))}
            </div>
            {currentPage < totalPages - 1 && (
                <div className="d-flex justify-content-center align-items-center mt-5">
                    <button className="btn btn-primary" onClick={() => setCurrentPage(currentPage + 1)}>Показать ещё</button>
                </div>
            )}
        </main>
    );
}