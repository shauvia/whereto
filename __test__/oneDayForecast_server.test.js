const returnForecastFor1Day = require('../src/server//oneDayForecast_server.js');

const forecast =  {
  data:
  [
    {
      temp: 8.7,
      weather: {
        description: 'Light shower rain',
      },
      image: 'https://pixabay.com/get/g9beadb7f238981db9de0829f33e702d5d9e57d7417246910675636d791dfe92c82f27ff3e5c1b01cf2ea340eaa755a53b6dfb8e971aa08aabc3b846e6db7ea31_640.jpg',
      city: 'Ciechocinek',
      datetime: '2022-04-10',
      inputStartDate: '2022-04-22',
      inputEndDate: '2022-04-23',
      isNotFound: false,
      dateNotFound: false,
      tripID: 0
    },
    {
      temp: 15.9,
      weather: {
        description: 'Scattered clouds',
      },
      image: 'https://pixabay.com/get/gb03f401dbd35f3bf9e9718dca31c32de61dab8342ef3247d9e60552168fdb3aa0a0eb1531d2b93b024291e71cf75c1ef2bb1c4cbc062408e6b689214b7712095_640.jpg',
      city: 'Kapstadt',
      datetime: '2022-04-08',
      inputStartDate: '2022-04-08',
      inputEndDate: '2022-04-09',
      isNotFound: false,
      dateNotFound: false,
      tripID: 1
    },
    {
      temp: 9,
      weather: {
        description: 'Light shower rain',
      },
      image: 'https://pixabay.com/get/g8375dc2117d7e8f08c1957f9cb11fba9e3c43d338612daab78c620a620fe75ac2b6e468fc205fb1b168de860166373b396a4cd88451e6b8e679cbe3cd6a02c1e_640.jpg',
      city: 'Warsaw',
      datetime: '2022-04-06',
      inputStartDate: '2022-04-06',
      inputEndDate: '2022-04-07',
      isNotFound: false,
      dateNotFound: false,
      tripID: 2
    },
    {
      temp: 17.3,
      weather: {
        description: 'Few clouds'
      },
      image: 'https://pixabay.com/get/g2a022e603f59c231b7bb7e3c087e95aaf8e6952bf987c700fb505988eb84fc9b6d88cbf1104bf3cfd1327171e3331594_640.jpg',
      city: 'Melbourne',
      datetime: '2022-04-07',
      inputStartDate: '2022-04-07',
      inputEndDate: '2022-04-07',
      isNotFound: false,
      dateNotFound: false,
      tripID: 3
    }  
  ]
};


describe('the function output to match expected result', () => {
  test('testing function when date matches', ()=>{
    const expected = {temp: 9, description: 'Light shower rain', date: '2022-04-06', dateNotFound: false};
    expect(returnForecastFor1Day(forecast, '2022-04-06')).toEqual(expected);
  });
  test('testing function when date does not match', () => {
    const expected = {temp: 17.3, description: 'Few clouds', date: '2022-04-07', dateNotFound: true};
    expect(returnForecastFor1Day(forecast, '2022-05-30')).toEqual(expected);
  });
});
