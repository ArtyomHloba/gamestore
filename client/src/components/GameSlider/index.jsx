import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import styles from "./GameSlider.module.css";

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

  const slides = [
    {
      title: "Doom The Dark Ages",
      image: "https://images5.alphacoders.com/138/1389830.jpg",
      description: "Coming Soon!",
    },
    {
      title: "The Last Of Us 2",
      image:
        "https://i0.wp.com/caniplaythat.com/wp-content/uploads/2020/06/the-last-of-us-2-key-art-ellie-logo.jpg?fit=1920%2C1080&ssl=1",
      description: "Action, Adventure",
    },
    {
      title: "Spider-man 2",
      image: "https://images7.alphacoders.com/131/1317406.jpeg",
      description: "Action, Adventure",
    },
  ];

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
