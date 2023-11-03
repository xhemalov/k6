// import library for generate unique id
import { uuidv4 } from 'https://jslib.k6.io/k6-utils/1.4.0/index.js';
import { check, group } from 'k6';
import http from 'k6/http';
import { randomIntBetween } from 'https://jslib.k6.io/k6-utils/1.4.0/index.js';
import { Counter } from 'k6/metrics';

const save_movie_error_counter = new Counter('save_movie_error_counter');
const save_review_error_counter = new Counter('save_review_error_counter');
const successSaveMovie = new Counter('successSaveMovie');
const successSaveReview = new Counter('successSaveReview');
let resCheck = {}

const saveMovies= function(config = fail(`missing config.`), movie=fail(`missing config.`)){
  group(`Save movie`, function () {
      // Odeslání dokumentů ve smyčce
      movie['id'] = randomIntBetween(1, 1000000)
    let res = http.post(`${config.host}/${config.index}/_doc/${uuidv4()}`, JSON.stringify(movie), { headers: { 'Content-Type': 'application/json' } });

    // Kontrola, zda byl požadavek úspěšný
    resCheck=check(res, {
      'status was 201': (r) => r.status === 201,
      'Response message 201 Created': (r) => r.status_text == '201 Created',
    });
    if (!resCheck){
      save_movie_error_counter.add(1)
    } else{
      successSaveMovie.add(1)
    }
  })

}

const saveReview = function(config = fail(`missing config.`), review=  fail(`missing config.`)){
  group(`Save review`, function () {
      // Odeslání dokumentů ve smyčce
      review['id'] = randomIntBetween(1, 1000000)
    let res = http.post(`${config.host}/${config.reviews_index}/_doc/${uuidv4()}`, JSON.stringify(review), { headers: { 'Content-Type': 'application/json' } });

    // Kontrola, zda byl požadavek úspěšný
    resCheck=check(res, {
      'status was 201': (r) => r.status === 201,
      'Response message 201 Created': (r) => r.status_text == '201 Created'
    });
    if (!resCheck){
      save_review_error_counter.add(1)
    } else{
      successSaveReview.add(1)
    }
  })

}

const deleteIndex= function(config){
  group(`Delete index ${config.index}`, function () {
    // exist index movies
    let res = http.get(`${config.host}/${config.index}`);
  /**
   * {"status":404,"error":{"root_cause":[{"index_uuid":"_na_","index":"movie","type":"index_not_found_exception","reason":"no such index [movie]","resource.type":"index_or_alias","resource.id":"movie"}],"type":"index_not_found_exception","reason":"no such index [movie]","resource.type":"index_or_alias","resource.id":"movie","index_uuid":"_na_","index":"movie"}}
   */
    if (res.json().status !== 200) {
    // delete index movies
      res = http.del(`${config.host}/${config.index}`);
  
    // check that index is deleted
      check(res, {
        'status was 200': (r) => r.status === 200,
        'Response message 200 OK': (r) => r.status_text == '200 OK'
    });
  }})
}

const verifyMovie = function(config){
  group(`Get movie`, function () {
    // Získání seznamu indexů
  let res = http.get(`${config.host}/_cat/indices?format=json&pretty=true`);

  // INFO[0005] [{"pri.store.size":"10.3kb","docs.count":"4","status":"open","index":"movies","uuid":"PQWFR7rWRtCX1es6GIpNvA","pri":"1","rep":"1","docs.deleted":"0","store.size":"10.3kb","health":"yellow"}]  source=console

  // Kontrola, zda byl požadavek úspěšný
  check(res, {
    'status was 200': (r) => r.status === 200,
    'index movies contains four records': (r) => r.json()[0]['docs.count'] === '4',
  });})
}

module.exports = {
  saveMovies,
  deleteIndex,
  verifyMovie,
  saveReview
}