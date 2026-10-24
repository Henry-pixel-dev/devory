

export type StarterResource = {
  resource_name: string;
  resource_url: string;
  resource_description: string;
  // There is no column for this in the resources table yet. Either add one,
  // or ignore this field when inserting.
  type: "GitHub Repo" | "Documentation" | "YouTube Tutorial";
  image: string;
};

export type StarterCollection = {
  collection_name: string;
  resources: StarterResource[];
};

export const starterPack: StarterCollection[] = [
  {
    collection_name: "JavaScript Starter Pack",
    resources: [
      {
        resource_name: "freeCodeCamp Open Source Curriculum",
        resource_url: "https://github.com/freeCodeCamp/freeCodeCamp",
        resource_description: "Interactive coding challenges and projects for JavaScript and web dev.",
        type: "GitHub Repo",
        image: '/starter/freeCodeCamp.png'
      },
      {
        resource_name: "MDN Web Docs – JavaScript",
        resource_url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
        resource_description: "Authoritative reference for JavaScript syntax, features, and tutorials.",
        type: "Documentation",
        image: '/starter/mozilla.jpg'
      },
      {
        resource_name: "Complete JavaScript Course (YouTube Playlist)",
        resource_url: "https://youtu.be/jSeI6OfifCI?si=XqsXhtenqhnDCVEM",
        resource_description: "Beginner-to-advanced video lessons on modern JavaScript.",
        type: "YouTube Tutorial",
        image: '/starter/maxres-javascript.jpg'
      },
    ],
  },
  {
    collection_name: "Java Starter Pack",
    resources: [
      {
        resource_name: "Java Design Patterns",
        resource_url: "https://github.com/iluwatar/java-design-patterns",
        resource_description: "Examples of design patterns implemented in Java.",
        type: "GitHub Repo",
        image: '/starter/java-design-patterns.png'
      },
      {
        resource_name: "Oracle Java SE Documentation",
        resource_url: "https://docs.oracle.com/javase/",
        resource_description: "Official Java SE docs with APIs and tutorials.",
        type: "Documentation",
        image: '/starter/oracle-java.jpg'
      },
      {
        resource_name: "Java Full Course (YouTube)",
        resource_url: "https://www.youtube.com/watch?v=grEKMHGYyns",
        resource_description: "Comprehensive Java programming course for beginners.",
        type: "YouTube Tutorial",
        image: '/starter/java-utube.jpg'
      },
    ],
  },
  {
    collection_name: "Cybersecurity Basics Starter Pack",
    resources: [
      {
        resource_name: "Cybersecurity Fundamentals Course",
        resource_url: "https://github.com/stvsever/Cybersecurity_Fundamentals",
        resource_description: "Introductory course covering cryptography, networks, malware, and governance.",
        type: "GitHub Repo",
        image: '/starter/cybersecurity_fundamentals.png'
      },
      {
        resource_name: "NIST Cybersecurity Basics",
        resource_url: "https://www.nist.gov/itl/smallbusinesscyber/cybersecurity-basics",
        resource_description: "Foundational cybersecurity practices and frameworks from NIST.",
        type: "Documentation",
        image: '/starter/nist_mark.png'
      },
      {
        resource_name: "CS50’s Intro to Cybersecurity (YouTube)",
        resource_url: "https://youtu.be/kmJlnUfMd7I?si=tfNvMTuVdfsPyBgY",
        resource_description: "Harvard CS50’s beginner-friendly cybersecurity course.",
        type: "YouTube Tutorial",
        image: '/starter/CS50.jpg'
      },
    ],
  },
  {
    collection_name: "Machine Learning Beginners Starter Pack",
    resources: [
      {
        resource_name: "Scikit-learn",
        resource_url: "https://github.com/scikit-learn/scikit-learn",
        resource_description: "Popular Python ML library for data mining and modeling.",
        type: "GitHub Repo",
        image: '/starter/MLpy.png'
      },
      {
        resource_name: "Scikit-learn Documentation",
        resource_url: "https://scikit-learn.org/stable/documentation.html",
        resource_description: "Tutorials, API references, and examples for ML algorithms.",
        type: "Documentation",
        image: '/starter/scitt.jpg'
      },
      {
        resource_name: "Machine Learning for Beginners (freeCodeCamp YouTube)",
        resource_url: "https://www.youtube.com/watch?v=NWONeJKn6kc",
        resource_description: "Full beginner course introducing ML concepts and coding in Python.",
        type: "YouTube Tutorial",
        image: '/starter/ml-last.jpg'
      },
    ],
  },
];