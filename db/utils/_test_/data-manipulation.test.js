const {
  formatTimestamp,
  formatCommentData,
  createRefObj,
} = require("../data-manipulation");

describe("createRefObj", () => {
  test("when passed an empty array returns an empty object", () => {
    const input = [];
    const expectedOutput = {};
    expect(createRefObj(input)).toEqual(expectedOutput);
  });
  test("Article title reference - when passed an array of article objects, returns a correctly formatted reference object", () => {
    const input = [
      {
        article_id: 7,
        title: "Using React Native: One Year Later",
        body:
          "When I interviewed for the iOS developer opening at Discord last spring, the tech lead Stanislav told me: React Native is the future. We will use it to build our iOS app from scratch as soon as it becomes public. As a native iOS developer, I strongly doubted using web technologies to build mobile apps because of my previous experiences with tools like PhoneGap. But after learning and using React Native for a while, I am glad we made that decision.",
        votes: 0,
        topic: "coding",
        author: "tickle122",
        created_at: "2016-12-07T21:37:26.335Z",
      },
      {
        article_id: 8,
        title: "Express.js: A Server-Side JavaScript Framework",
        body:
          "You’re probably aware that JavaScript is the programming language most often used to add interactivity to the front end of a website, but its capabilities go far beyond that—entire sites can be built on JavaScript, extending it from the front to the back end, seamlessly. Express.js and Node.js gave JavaScript newfound back-end functionality—allowing developers to build software with JavaScript on the server side for the first time. Together, they make it possible to build an entire site with JavaScript: You can develop server-side applications with Node.js and then publish those Node.js apps as websites with Express. Because Node.js itself wasn’t intended to build websites, the Express framework is able to layer in built-in structure and functions needed to actually build a site. It’s a pretty lightweight framework that’s great for giving developers extra, built-in web application features and the Express API without overriding the already robust, feature-packed Node.js platform. In short, Express and Node are changing the way developers build websites.",
        votes: 0,
        topic: "coding",
        author: "cooljmessy",
        created_at: "2016-06-30T06:59:39.654Z",
      },
    ];
    const expectedOutput = {
      "Using React Native: One Year Later": 7,
      "Express.js: A Server-Side JavaScript Framework": 8,
    };
    expect(createRefObj(input, "title", "article_id")).toEqual(expectedOutput);
  });
  test("should not mutate the input array", () => {
    const input = [
      {
        article_id: 7,
        title: "Using React Native: One Year Later",
        body:
          "When I interviewed for the iOS developer opening at Discord last spring, the tech lead Stanislav told me: React Native is the future. We will use it to build our iOS app from scratch as soon as it becomes public. As a native iOS developer, I strongly doubted using web technologies to build mobile apps because of my previous experiences with tools like PhoneGap. But after learning and using React Native for a while, I am glad we made that decision.",
        votes: 0,
        topic: "coding",
        author: "tickle122",
        created_at: "2016-12-07T21:37:26.335Z",
      },
      {
        article_id: 8,
        title: "Express.js: A Server-Side JavaScript Framework",
        body:
          "You’re probably aware that JavaScript is the programming language most often used to add interactivity to the front end of a website, but its capabilities go far beyond that—entire sites can be built on JavaScript, extending it from the front to the back end, seamlessly. Express.js and Node.js gave JavaScript newfound back-end functionality—allowing developers to build software with JavaScript on the server side for the first time. Together, they make it possible to build an entire site with JavaScript: You can develop server-side applications with Node.js and then publish those Node.js apps as websites with Express. Because Node.js itself wasn’t intended to build websites, the Express framework is able to layer in built-in structure and functions needed to actually build a site. It’s a pretty lightweight framework that’s great for giving developers extra, built-in web application features and the Express API without overriding the already robust, feature-packed Node.js platform. In short, Express and Node are changing the way developers build websites.",
        votes: 0,
        topic: "coding",
        author: "cooljmessy",
        created_at: "2016-06-30T06:59:39.654Z",
      },
    ];
    const inputCopy = [
      {
        article_id: 7,
        title: "Using React Native: One Year Later",
        body:
          "When I interviewed for the iOS developer opening at Discord last spring, the tech lead Stanislav told me: React Native is the future. We will use it to build our iOS app from scratch as soon as it becomes public. As a native iOS developer, I strongly doubted using web technologies to build mobile apps because of my previous experiences with tools like PhoneGap. But after learning and using React Native for a while, I am glad we made that decision.",
        votes: 0,
        topic: "coding",
        author: "tickle122",
        created_at: "2016-12-07T21:37:26.335Z",
      },
      {
        article_id: 8,
        title: "Express.js: A Server-Side JavaScript Framework",
        body:
          "You’re probably aware that JavaScript is the programming language most often used to add interactivity to the front end of a website, but its capabilities go far beyond that—entire sites can be built on JavaScript, extending it from the front to the back end, seamlessly. Express.js and Node.js gave JavaScript newfound back-end functionality—allowing developers to build software with JavaScript on the server side for the first time. Together, they make it possible to build an entire site with JavaScript: You can develop server-side applications with Node.js and then publish those Node.js apps as websites with Express. Because Node.js itself wasn’t intended to build websites, the Express framework is able to layer in built-in structure and functions needed to actually build a site. It’s a pretty lightweight framework that’s great for giving developers extra, built-in web application features and the Express API without overriding the already robust, feature-packed Node.js platform. In short, Express and Node are changing the way developers build websites.",
        votes: 0,
        topic: "coding",
        author: "cooljmessy",
        created_at: "2016-06-30T06:59:39.654Z",
      },
    ];
    createRefObj(input);
    expect(input).toEqual(inputCopy);
  });
});

describe("formatTimestamp", () => {
  test("should convert a created at millisecond timestamp to a psql timestamp format", () => {
    const articleRows = [
      {
        title: "Running a Node App",
        topic: "coding",
        author: "jessjelly",
        body:
          "This is part two of a series on how to get up and running with Systemd and Node.js. This part dives deeper into how to successfully run your app with systemd long-term, and how to set it up in a production environment.",
        created_at: 1471522072389,
      },
      {
        title:
          "The Rise Of Thinking Machines: How IBM's Watson Takes On The World",
        topic: "coding",
        author: "jessjelly",
        body:
          "Many people know Watson as the IBM-developed cognitive super computer that won the Jeopardy! gameshow in 2011. In truth, Watson is not actually a computer but a set of algorithms and APIs, and since winning TV fame (and a $1 million prize) IBM has put it to use tackling tough problems in every industry from healthcare to finance. Most recently, IBM has announced several new partnerships which aim to take things even further, and put its cognitive capabilities to use solving a whole new range of problems around the world.",
        created_at: 406988514171,
      },
    ];
    const expectedOutput = [
      {
        title: "Running a Node App",
        topic: "coding",
        author: "jessjelly",
        body:
          "This is part two of a series on how to get up and running with Systemd and Node.js. This part dives deeper into how to successfully run your app with systemd long-term, and how to set it up in a production environment.",
        created_at: "2016-08-18T12:07:52.389Z",
      },
      {
        title:
          "The Rise Of Thinking Machines: How IBM's Watson Takes On The World",
        topic: "coding",
        author: "jessjelly",
        body:
          "Many people know Watson as the IBM-developed cognitive super computer that won the Jeopardy! gameshow in 2011. In truth, Watson is not actually a computer but a set of algorithms and APIs, and since winning TV fame (and a $1 million prize) IBM has put it to use tackling tough problems in every industry from healthcare to finance. Most recently, IBM has announced several new partnerships which aim to take things even further, and put its cognitive capabilities to use solving a whole new range of problems around the world.",
        created_at: "1982-11-24T12:21:54.171Z",
      },
    ];
    expect(formatTimestamp(articleRows)).toEqual(expectedOutput);
  });
  test("should not mutate the input array", () => {
    const articleRows = [
      {
        title: "Running a Node App",
        topic: "coding",
        author: "jessjelly",
        body:
          "This is part two of a series on how to get up and running with Systemd and Node.js. This part dives deeper into how to successfully run your app with systemd long-term, and how to set it up in a production environment.",
        created_at: 1471522072389,
      },
      {
        title:
          "The Rise Of Thinking Machines: How IBM's Watson Takes On The World",
        topic: "coding",
        author: "jessjelly",
        body:
          "Many people know Watson as the IBM-developed cognitive super computer that won the Jeopardy! gameshow in 2011. In truth, Watson is not actually a computer but a set of algorithms and APIs, and since winning TV fame (and a $1 million prize) IBM has put it to use tackling tough problems in every industry from healthcare to finance. Most recently, IBM has announced several new partnerships which aim to take things even further, and put its cognitive capabilities to use solving a whole new range of problems around the world.",
        created_at: 406988514171,
      },
    ];
    const inputCopy = [
      {
        title: "Running a Node App",
        topic: "coding",
        author: "jessjelly",
        body:
          "This is part two of a series on how to get up and running with Systemd and Node.js. This part dives deeper into how to successfully run your app with systemd long-term, and how to set it up in a production environment.",
        created_at: 1471522072389,
      },
      {
        title:
          "The Rise Of Thinking Machines: How IBM's Watson Takes On The World",
        topic: "coding",
        author: "jessjelly",
        body:
          "Many people know Watson as the IBM-developed cognitive super computer that won the Jeopardy! gameshow in 2011. In truth, Watson is not actually a computer but a set of algorithms and APIs, and since winning TV fame (and a $1 million prize) IBM has put it to use tackling tough problems in every industry from healthcare to finance. Most recently, IBM has announced several new partnerships which aim to take things even further, and put its cognitive capabilities to use solving a whole new range of problems around the world.",
        created_at: 406988514171,
      },
    ];
    formatTimestamp(articleRows);
    expect(articleRows).toEqual(inputCopy);
  });
});

describe("formatCommentData", () => {
  test("returns an empty array when passed an empty comments array", () => {
    const comments = [];
    const ref = {};
    const expectedOutput = [];
    expect(formatCommentData(comments, ref)).toEqual(expectedOutput);
  });
  test("when passed an array of comments and a reference object, returns an array of correctly formatted objects", () => {
    const comments = [
      {
        body:
          "Itaque quisquam est similique et est perspiciatis reprehenderit voluptatem autem. Voluptatem accusantium eius error adipisci quibusdam doloribus.",
        belongs_to:
          "The People Tracking Every Touch, Pass And Tackle in the World Cup",
        created_by: "tickle122",
        votes: -1,
        created_at: 1468087638932,
      },
      {
        body: "Nobis consequatur animi. Ullam nobis quaerat voluptates veniam.",
        belongs_to: "Making sense of Redux",
        created_by: "grumpy19",
        votes: 7,
        created_at: 1478813209256,
      },
    ];
    const ref = {
      "The People Tracking Every Touch, Pass And Tackle in the World Cup": 7,
      "Making sense of Redux": 8,
    };
    const expectedOutput = [
      {
        body:
          "Itaque quisquam est similique et est perspiciatis reprehenderit voluptatem autem. Voluptatem accusantium eius error adipisci quibusdam doloribus.",
        article_id: 7,
        author: "tickle122",
        votes: -1,
        created_at: "2016-07-09T18:07:18.932Z",
      },
      {
        body: "Nobis consequatur animi. Ullam nobis quaerat voluptates veniam.",
        article_id: 8,
        author: "grumpy19",
        votes: 7,
        created_at: "2016-11-10T21:26:49.256Z",
      },
    ];
    expect(formatCommentData(comments, ref)).toEqual(expectedOutput);
  });
});
