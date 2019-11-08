class DateRangeRepository {
  static fetchDates() {
    const url = '/api/date-range';

    return fetch(url, {
      method: 'GET',
      // headers: new Headers({'x-org-id': orgId})
    })
      .then((result) => Promise.all([result, result.json()]))
      .catch((error) => error);
  }
}

export default DateRangeRepository;
