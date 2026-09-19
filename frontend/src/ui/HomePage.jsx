import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Container from "./Container";
import Header from "./Header";
import styles from "./HomePage.module.css";

// The four stages of a pattern, from inspiration to finished piece.
// Images live in /public (leading slash so they also work on nested routes).
const STAGES = [
  {
    title: "Spot the shape",
    text: "Start with anything you love, like a leaf.",
    src: "/real-leaf.png",
    alt: "A real green leaf",
    imgClass: styles.tall,
  },
  {
    title: "Make a mind map",
    text: "Imagine the rows and rounds that shape it.",
    src: "/illustrate-leave.svg",
    alt: "Hand-drawn illustration of a crocheted leaf",
    imgClass: styles.wide,
  },
  {
    title: "Chart it",
    text: "Turn the idea into a symbol chart anyone can follow.",
    src: "/pattern-leave.svg",
    alt: "Crochet symbol chart of a leaf",
    imgClass: styles.wide,
  },
  {
    title: "Crochet it",
    text: "Pick up your hook and make it real.",
    src: "/crocheted-leaf.png",
    alt: "A finished crocheted leaf",
    imgClass: styles.wide,
  },
];

function HomePage() {
  const user = useSelector((store) => store.user);
  const userId = user.userDetail?._id;

  const navItems = user.isLoggedIn
    ? [
        { label: "Learn", path: "/learn" },
        { label: "Community", path: `/user/${userId}/newsfeed/` },
        { label: "Profile", path: `/user/${userId}` },
      ]
    : [
        { label: "Learn", path: "/learn" },
        { label: "Login", path: "/login" },
        { label: "Register", path: "/register" },
      ];

  const communityLink = user.isLoggedIn
    ? { label: "See the newsfeed", path: `/user/${userId}/newsfeed/` }
    : { label: "Create an account", path: "/register" };

  return (
    <Container>
      <Header navItems={navItems} />

      <main className={styles.page}>
        {/* Hero: headline + the pattern journey with a thread running through it */}
        <section className={styles.hero}>
          <div className={styles.heroInner}>
            <div className={styles.intro}>
              <h1 className={styles.headline}>
                Design your dreams and inspire the world.
              </h1>
              <div>
                <p className={styles.lede}>
                  Turn any idea into a stitch-by-stitch crochet chart you can
                  follow, share and make again.
                </p>
                <div className={styles.actions}>
                  <Link
                    to="/editor"
                    className={`${styles.btn} ${styles.btnPrimary}`}
                  >
                    Open editor
                  </Link>
                  <Link
                    to="/learn"
                    className={`${styles.btn} ${styles.btnGhost}`}
                  >
                    Learn the stitches
                  </Link>
                </div>
              </div>
            </div>

            <div className={styles.journey}>
                <img
                  src="/crochet-pattern-pro-logo.svg"
                  alt=""
                  className={styles.ball}
                />
                <svg
                  className={styles.thread}
                  viewBox="0 0 1200 240"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  <path
                    pathLength="1"
                    d="M0 150 C 60 175, 110 175, 170 120 S 270 40, 340 110 S 450 235, 560 150 S 670 30, 770 120 S 900 235, 1010 140 S 1110 60, 1200 110"
                  />
                </svg>

              <ol className={styles.stages}>
                {STAGES.map((stage, i) => (
                  <li
                    key={stage.title}
                    className={styles.stage}
                    style={{ "--i": i }}
                  >
                    <div className={styles.frame}>
                      <img
                        src={stage.src}
                        alt={stage.alt}
                        className={stage.imgClass}
                      />
                    </div>
                    <div className={styles.caption}>
                      <span className={styles.num} aria-hidden="true">
                        {i + 1}
                      </span>
                      <div>
                        <h2 className={styles.captionTitle}>{stage.title}</h2>
                        <p className={styles.captionText}>{stage.text}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        {/* What you can do */}
        <section className={styles.features}>
          <div className={styles.featuresInner}>
            <h2 className={styles.featuresTitle}>Make it, learn it, share it.</h2>
            <ul className={styles.rows}>
              <li className={styles.row}>
                <h3 className={styles.rowTitle}>Make charts</h3>
                <p className={styles.rowText}>
                  Build your own symbol chart, stitch by stitch, on a clean
                  visual canvas.
                </p>
                <Link to="/editor" className={styles.rowLink}>
                  Open editor
                </Link>
              </li>
              <li className={styles.row}>
                <h3 className={styles.rowTitle}>Learn stitches</h3>
                <p className={styles.rowText}>
                  New to charts? Learn each stitch and how to read it, one step
                  at a time.
                </p>
                <Link to="/learn" className={styles.rowLink}>
                  Start learning
                </Link>
              </li>
              <li className={styles.row}>
                <h3 className={styles.rowTitle}>Share designs</h3>
                <p className={styles.rowText}>
                  Post your patterns and see what other makers are creating.
                </p>
                <Link to={communityLink.path} className={styles.rowLink}>
                  {communityLink.label}
                </Link>
              </li>
            </ul>
          </div>
        </section>

        {/* Closing call to action */}
        <section className={styles.closing}>
          <div className={styles.closingInner}>
            <h2 className={styles.closingTitle}>
              Your next pattern starts with one loop.
            </h2>
            <Link
              to="/editor"
              className={`${styles.btn} ${styles.btnPrimary} ${styles.onDark}`}
            >
              Open editor
            </Link>
          </div>
          <p className={styles.footer}>
            Crochet Pattern Pro © {new Date().getFullYear()}
          </p>
        </section>
      </main>
    </Container>
  );
}

export default HomePage;