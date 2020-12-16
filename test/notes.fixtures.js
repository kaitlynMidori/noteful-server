const faker = require('faker');
const makeNotesArray = () => {
    return [
      {
        id: 1,
        note_name: faker.lorem.words(),
        content: faker.lorem.paragraphs(3),
        folder_id: 1,
        modified: new Date().toISOString()
      },
      {
        id: 2,
        note_name: faker.lorem.words(),
        content: faker.lorem.paragraphs(3),
        folder_id: 1,
        modified: new Date().toISOString()
      },
      {
        id: 3,
        note_name: faker.lorem.words(),
        content: faker.lorem.paragraphs(3),
        folder_id: 2,
        modified: new Date().toISOString()
      }
    ]
  }
  
  module.exports = {makeNotesArray};