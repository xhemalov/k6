/**
 * Marvel Movies Home Work
 * 
 * How to run
 * k6 run demos/02-examples/movies-performance-test.js
 * 
 */
import http from 'k6/http';
import { check } from 'k6';

// import library for pause between requests
import { sleep } from 'k6';
import { deleteIndex, saveMovies, verifyMovie,saveReview  } from './fragmetns/elasticUtils.js';
import { movies, fanReview } from './fragmetns/data-movies.js';
import { randomIntBetween } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js'

export const options = {
  scenarios: {
    saveMovieScenario: {
      executor: 'constant-arrival-rate',
      rate:50,
      timeUnit:'1m',
      duration:'1m',
      preAllocatedVUs:10,
      maxVUs:50,
      exec: 'saveMovieScenario'
    },
    reviewScenario: {
      executor: 'constant-arrival-rate',
      rate:100,
      timeUnit:'1m',
      duration:'1m',
      preAllocatedVUs:10,
      maxVUs:500,
      exec: 'reviewScenario'
    },
  },
  tresholds:{
    http_req_duration: ['p(99)<200'],
    
  }
}

const config={
elasticsearch: {
  index: __ENV.INDEX ? __ENV.INDEX : 'movies',
  reviews_index: __ENV.REVIEWS ? __ENV.REVIEWS : 'reviews',
  host: __ENV.HOST ? __ENV.HOST : 'http://localhost:9200',
}}

// create setup function which delete index movies from elasticsearch and check that index is deleted
export function setup() {
  deleteIndex(config.elasticsearch)
}


export function saveMovieScenario () {
  const _index = randomIntBetween(0, movies.length-1)
  const movie = movies[_index];
  saveMovies(config.elasticsearch, movie)
}

export function reviewScenario () {
  saveReview(config.elasticsearch, fanReview)
}