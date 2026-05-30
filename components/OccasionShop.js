import Image from "next/image";
import Link from "next/link";
import styles from "./OccasionShop.module.css";

const occasions = [
  { title: "Wedding", href: "/shop", image: "/DAJ_4613.jpg" },
  { title: "Reception", href: "/shop", image: "/DAJ_4366.jpg" },
  { title: "Engagement", href: "/shop", image: "/DAJ_4661.jpg" },
  { title: "Sangeet", href: "/shop", image: "/DAJ_4291.jpg" },
];

const vibes = [
  { title: "Royal", href: "/shop", image: "/DAJ_3863.jpg" },
  { title: "Classic", href: "/shop", image: "/DAJ_4110.jpg" },
  { title: "Festive", href: "/shop", image: "/DAJ_4613.jpg" },
  { title: "Elegant", href: "/shop", image: "/DAJ_4661.jpg" },
];

export default function OccasionShop() {
  return (
    <section className={styles.occasionSection}>
      <div className="container-lg">
        <div className={styles.sectionIntro}>
          <p>Curated for celebrations</p>
          <h2>Shop according to occasion</h2>
        </div>

        <div className={styles.occasionGrid}>
          {occasions.map((item) => (
            <Link href={item.href} className={styles.occasionCard} key={item.title}>
              <Image
                src={item.image}
                alt={`${item.title} occasion wear`}
                width={420}
                height={170}
                className={styles.occasionImage}
              />
              <span>{item.title}</span>
            </Link>
          ))}
        </div>

        <div className={styles.vibePanel}>
          <h3>WHAT&apos;S YOUR VIBE?</h3>
          <div className={styles.vibeGrid}>
            {vibes.map((item) => (
              <Link href={item.href} className={styles.vibeCard} key={item.title}>
                <div className={styles.vibeImageWrap}>
                  <Image
                    src={item.image}
                    alt={`${item.title} style`}
                    width={330}
                    height={390}
                    className={styles.vibeImage}
                  />
                </div>
                <span>{item.title}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
