/**
 * Marvel Movies Home Work
 *
 * How to run
 * k6 run demos/02-examples/movies-performance-test.js
 *
 */
import {
  deleteIndex,
  saveMovies,
  saveReview,
} from "./fragmetns/elasticUtils.js";
import { movies, fanReview } from "./fragmetns/data-movies.js";
import { randomIntBetween } from "https://jslib.k6.io/k6-utils/1.2.0/index.js";

export const options = {
  scenarios: {
    saveMovieScenario: {
      executor: "constant-arrival-rate",
      rate: 50,
      timeUnit: "1m",
      duration: "5m",
      preAllocatedVUs: 10,
      maxVUs: 50,
      exec: "saveMovieScenario",
    },
    reviewScenario: {
      executor: "constant-arrival-rate",
      rate: 100,
      timeUnit: "1m",
      duration: "5m",
      preAllocatedVUs: 10,
      maxVUs: 500,
      exec: "reviewScenario",
    },
  },
  thresholds: {
    http_req_duration: ["p(95)<200"],
    http_req_failed: ["rate<0.01"],
    save_movie_error_counter: ["count<1"],
    save_review_error_counter: ["count<1"],
    successSaveMovies: ["count>240"], // number for 5 minutes long test
    successSaveReviews: ["count>490"],
  },
};

const config = {
  elasticsearch: {
    index: __ENV.INDEX ? __ENV.INDEX : "movies",
    reviews_index: __ENV.REVIEWS ? __ENV.REVIEWS : "reviews",
    host: __ENV.HOST ? __ENV.HOST : "http://localhost:9200",
  },
};

// create setup function which delete index movies from elasticsearch and check that index is deleted
export function setup() {
  deleteIndex(config.elasticsearch);
}

export function saveMovieScenario() {
  const _index = randomIntBetween(0, movies.length - 1);
  const movie = movies[_index];
  saveMovies(config.elasticsearch, movie);
}

export function reviewScenario() {
  saveReview(config.elasticsearch, fanReview);
}
