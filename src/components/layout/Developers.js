import {useEffect, useState} from "react";
import {getDevelopers} from "../../scripts/api";
import DeveloperCard from "../element/DeveloperCard";

export default function Developers() {

    const [developers, setDevelopers] = useState([]);
    const [total, setTotalDevelopers] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);

    useEffect(() => {
        loadDevelopers();
    }, [currentPage])

    function loadDevelopers() {
        getDevelopers(currentPage).then(response => {
            let arr = [...developers];
            arr.push(...response['values']);
            setDevelopers(arr);
            setTotalDevelopers(response['total_elements']);
            setTotalPages(response['total_pages']);
        })
    }

    return (
        <main id="content">
            <h1>Разработчики <span className="text-secondary">{total}</span></h1>
            <div className="row gap-4">
                {developers.length > 0 && developers.map(developer => (
                    <DeveloperCard developer={developer}/>
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