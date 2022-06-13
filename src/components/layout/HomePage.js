import { Component } from 'react';
import Carousel from 'react-bootstrap/Carousel'
import { staticContentLink } from "../../scripts/api";
import {image_url} from "../../App";

class HomePage extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Carousel fade variant="light" indicators={false}
                      nextIcon={<span aria-hidden="true" className="bi bi-arrow-right-circle control-icon"/>}
                      prevIcon={<span aria-hidden="true" className="bi bi-arrow-left-circle control-icon"/>} >
                <Carousel.Item>
                    <div className="carousel-item-gradient">
                        <img
                            className="d-block w-100"
                            src={image_url + "carousel/_vtGKoupcm3WDmnnIDtRIOrbX4G7XnoY.jpg"}
                            alt="First slide"
                        />
                    </div>
                    <Carousel.Caption>
                        <h3>Игра</h3>
                        <button className="btn btn-primary rounded-pill w-auto">В корзину</button>
                    </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                    <div className="carousel-item-gradient">
                        <img
                            className="d-block w-100"
                            src={image_url + "carousel/93MGxU-uqNnxv0RPwYbUmCQyUW8nouBz.jpg"}
                            alt="Second slide"
                        />
                    </div>
                    <Carousel.Caption>
                        <h3>Игра</h3>
                        <button className="btn btn-primary rounded-pill w-auto">В корзину</button>
                    </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                    <div className="carousel-item-gradient">
                        <img
                            className="d-block w-100"
                            src={image_url + "carousel/CAyI_EZuBj7iXaIGnDKYP81QvHlZjW-O.jpeg"}
                            alt="Third slide"
                        />
                    </div>
                    <Carousel.Caption>
                        <h3>Игра</h3>
                        <button className="btn btn-primary rounded-pill w-auto">В корзину</button>
                    </Carousel.Caption>
                </Carousel.Item>
            </Carousel>

        );
    }
}

export default HomePage;