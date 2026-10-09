import { Fragment } from "react";
import { motion } from "framer-motion";

/**
 * Word-by-word staggered heading, like the reference site's kinetic titles.
 *
 * Each word rides in its own clipped box; the spaces *between* words are real
 * text nodes rendered outside those boxes (a trailing space inside an
 * `inline-block` is collapsed away by the browser, which used to run the words
 * together — "Thesmarter way toride").
 */
export default function SplitHeading({
  text,
  className = "",
  as: Tag = "h2",
}: {
  text: string;
  className?: string;
  as?: "h1" | "h2" | "h3";
}) {
  const words = text.split(/\s+/).filter(Boolean);
  return (
    <Tag className={className} aria-label={text}>
      {words.map((w, i) => (
        <Fragment key={`${w}-${i}`}>
          <span
            className="inline-block overflow-hidden pb-[0.12em] -mb-[0.12em] align-top"
            aria-hidden="true"
          >
            <motion.span
              className="inline-block will-change-transform"
              initial={{ y: "110%" }}
              whileInView={{ y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.7, delay: i * 0.06, ease: [0.22, 0.61, 0.36, 1] }}
            >
              {w}
            </motion.span>
          </span>
          {i < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </Tag>
  );
}
