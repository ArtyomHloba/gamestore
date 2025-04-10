import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import styles from "./GameSlider.module.css";
import slides from "./slides";

function GameSlider() {
  const sliderSettings = {
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 10000,
    pauseOnHover: true,
  };

  return (
    <div className={styles.sliderContainer}>
      <Slider {...sliderSettings}>
        {slides.map((slide, index) => (
          <div key={index} className={styles.slide}>
            <img src={slide.image} alt={slide.title} className={styles.image} />
            <div className={styles.overlay}>
              <h2 className={styles.title}>{slide.title}</h2>
              <p className={styles.description}>{slide.description}</p>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
}

export default GameSlider;
