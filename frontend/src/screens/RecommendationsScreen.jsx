import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./recommendationsScreen.scss";

// Pillow images
import klubbsporreImg from "../assets/images/klubbsporre.avif";
import kvarnvenImg from "../assets/images/kvarnven.avif";

// Bed images
import slattumImg from "../assets/images/slattum.avif";
import ramnefjaellImg from "../assets/images/ramnefjaell.avif";
import malmImg from "../assets/images/malm.avif";

// Chair images
import dyvlingeImg from "../assets/images/dyvlinge.avif";
import addeImg from "../assets/images/adde.avif";
import poangImg from "../assets/images/poang.avif";

// Table images
import vihalsImg from "../assets/images/vihals.avif";
import sandsbergImg from "../assets/images/sandsberg.avif";
import pinntorpImg from "../assets/images/pinntorp.avif";

export default function RecommendationsScreen() {
  const location = useLocation();
  const navigate = useNavigate();

  // Get label from scanning screen
  const label = (location.state?.label || "pillow").toLowerCase();

  // Map detected labels to category
  const categoryMap = {
    pillow: ["pillow", "cushion"],
    bed: ["bed", "bedframe", "bunk bed", "mattress"],
    chair: ["chair", "armchair", "office chair", "sofa", "seat", "stool"],
    table: ["table", "desk", "work table", "dining table"],
  };

  const category =
    Object.keys(categoryMap).find((cat) =>
      categoryMap[cat].includes(label)
    ) || "pillow";

  // Recommendations
  const recommendations = {
    pillow: [
      {
        name: "KLUBBSPORRE",
        description:
          "Ergonomic pillow designed for side and back sleepers, offering firm support and comfort.",
        image: klubbsporreImg,
        link: "https://www.ikea.com/be/en/p/klubbsporre-ergonomic-pillow-side-back-sleeper-00446096/",
      },
      {
        name: "KVARNVEN",
        description:
          "Pillow that adapts to your sleeping position, keeping you comfortable all night.",
        image: kvarnvenImg,
        link: "https://www.ikea.com/be/en/p/kvarnven-ergonomic-pillow-side-back-sleeper-70507350/",
      },
    ],
    bed: [
      {
        name: "SLATTUM",
        description:
          "A comfy upholstered bed frame that adds a soft touch to your bedroom while providing sturdy support.",
        image: slattumImg,
        link: "https://www.ikea.com/be/en/p/slattum-upholstered-bed-frame-vissle-dark-grey-00571245/",
      },
      {
        name: "RAMNEFJAELL",
        description:
          "Light beige upholstered bed frame with a classic, soft design for a cozy bedroom feel.",
        image: ramnefjaellImg,
        link: "https://www.ikea.com/be/en/p/ramnefjaell-upholstered-bed-frame-kilanda-light-beige-luroey-s19552751/",
      },
      {
        name: "MALM",
        description:
          "High bed frame with 2 storage boxes, offering extra space and a clean, modern look.",
        image: malmImg,
        link: "https://www.ikea.com/be/en/p/malm-bed-frame-high-w-2-storage-boxes-white-loenset-s49176074/",
      },
    ],
    chair: [
      {
        name: "DYVLINGE",
        description:
          "Swivel easy chair with a modern look and comfortable design, perfect for relaxing.",
        image: dyvlingeImg,
        link: "https://www.ikea.com/be/en/p/dyvlinge-swivel-easy-chair-kelinge-orange-00581918/",
      },
      {
        name: "ADDE",
        description:
          "Lightweight and stackable chair, perfect for extra seating or everyday use.",
        image: addeImg,
        link: "https://www.ikea.com/be/en/p/adde-chair-white-10219178/",
      },
      {
        name: "POÄNG",
        description:
          "Classic armchair with a bentwood frame and cushioned seat for ultimate comfort.",
        image: poangImg,
        link: "https://www.ikea.com/be/en/p/poaeng-armchair-white-stained-oak-veneer-knisa-black-s09286606/",
      },
    ],
    table: [
      {
        name: "VIHALS",
        description:
          "Simple, functional table with a spacious surface, perfect for work or dining.",
        image: vihalsImg,
        link: "https://www.ikea.com/be/en/p/vihals-table-white-white-s39578509/",
      },
      {
        name: "SANDSBERG",
        description:
          "Desk combination with drawers for storage and a sturdy tabletop.",
        image: sandsbergImg,
        link: "https://www.ikea.com/be/en/p/sandsberg-table-black-s29420393/",
      },
      {
        name: "PINNTORP",
        description:
          "Ergonomic sit/stand desk with adjustable height for a healthier workspace.",
        image:pinntorpImg,
        link: "https://www.ikea.com/be/en/p/pinntorp-table-light-brown-stained-white-stained-30529467/",
      },
    ],
  };

  const recs = recommendations[category] || [];

  return (
    <div className="recommendations-container">
      <h1>
        Recommendations for{" "}
        {category.charAt(0).toUpperCase() + category.slice(1)}
      </h1>

      <div className="recommendations-list">
        {recs.map((item, idx) => (
          <div key={idx} className="recommendation-card">
            <img
              src={item.image}
              alt={item.name}
              className="recommendation-image"
            />
            <div className="recommendation-content">
              <p className="recommendation-description">{item.description}</p>
              <h3 className="recommendation-name">{item.name}</h3>
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="recommendation-link"
              >
                Check on website
              </a>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={() => navigate("/scan")}
        className="scan-again-button"
      >
        Scan Another Item
      </button>
    </div>
  );
}
