const { createUserRef } = require('./formatting');

describe('createUserRef', () => {
  test('when passed with an empty array, returns an empty object', () => {
    const input = [];
    const expectedOutput = {};
    const actualOutput = createUserRef(input);
    expect(actualOutput).toEqual(expectedOutput);
  });
  test('when passed with an array of userRows, returns a valid ref object', () => {
    const input = [
      {
        username: 'tickle122',
        avatar_url:
          'https://vignette.wikia.nocookie.net/mrmen/images/d/d6/Mr-Tickle-9a.png/revision/latest?cb=20180127221953',
        name: 'Tom Tickle',
      },
      {
        username: 'grumpy19',
        avatar_url:
          'https://vignette.wikia.nocookie.net/mrmen/images/7/78/Mr-Grumpy-3A.PNG/revision/latest?cb=20170707233013',
        name: 'Paul Grump',
      },
    ];
    const expectedOutput = {
      tickle122: 1,
      grumpy19: 2,
    };
    const actualOutput = createUserRef(input);
    expect(actualOutput).toEqual(expectedOutput);
  });
});
