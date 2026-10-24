import { fetchPreviews } from "../lib/FetchPreview"

const resourceUrls = [
  "https://github.com/freeCodeCamp/freeCodeCamp",
  "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
  "https://youtu.be/jSeI6OfifCI",
  "https://github.com/iluwatar/java-design-patterns",
  "https://docs.oracle.com/javase/",
  "https://www.youtube.com/watch?v=grEKMHGYyns",
  "https://github.com/stvsever/Cybersecurity_Fundamentals",
  "https://www.nist.gov/itl/smallbusinesscyber/cybersecurity-basics",
  "https://youtu.be/kmJlnUfMd7I",
  "https://github.com/scikit-learn/scikit-learn",
  "https://scikit-learn.org/stable/documentation.html",
  "https://www.youtube.com/watch?v=NWONeJKn6kc",
];

async function main() {
  const results = await Promise.allSettled(
    resourceUrls.map((url) => fetchPreviews(url))
  )

  results.forEach((result, i) => {
    console.log(resourceUrls[i])
    if (result.status === "fulfilled") {
      console.log("  title:", result.value.title)
      console.log("  image:", result.value.image)
    } else {
      console.log("  FAILED:", result.reason)
    }
  })
}

main()

