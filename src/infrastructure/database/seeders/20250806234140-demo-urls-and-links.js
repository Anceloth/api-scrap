'use strict';

const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const now = new Date();
    
    // Insert sample URLs
    const urlsData = [
      {
        id: uuidv4(),
        name: 'Google Search',
        url: 'https://www.google.com',
        createdAt: now,
        updatedAt: now,
      },
      {
        id: uuidv4(),
        name: 'GitHub',
        url: 'https://github.com',
        createdAt: now,
        updatedAt: now,
      },
      {
        id: uuidv4(),
        name: 'Stack Overflow',
        url: 'https://stackoverflow.com',
        createdAt: now,
        updatedAt: now,
      },
    ];

    await queryInterface.bulkInsert('urls', urlsData, {});

    // Get the inserted URLs to use their IDs for links
    const insertedUrls = await queryInterface.sequelize.query(
      'SELECT id, name FROM urls ORDER BY "createdAt" DESC LIMIT 3',
      { type: Sequelize.QueryTypes.SELECT }
    );

    // Insert sample Links
    const linksData = [
      // Links for Google Search
      {
        id: uuidv4(),
        urlId: insertedUrls.find(url => url.name === 'Google Search').id,
        link: 'https://www.google.com/search?q=nestjs',
        name: 'NestJS Search',
        createdAt: now,
        updatedAt: now,
      },
      {
        id: uuidv4(),
        urlId: insertedUrls.find(url => url.name === 'Google Search').id,
        link: 'https://www.google.com/search?q=typescript',
        name: 'TypeScript Search',
        createdAt: now,
        updatedAt: now,
      },
      // Links for GitHub
      {
        id: uuidv4(),
        urlId: insertedUrls.find(url => url.name === 'GitHub').id,
        link: 'https://github.com/nestjs/nest',
        name: 'NestJS Repository',
        createdAt: now,
        updatedAt: now,
      },
      {
        id: uuidv4(),
        urlId: insertedUrls.find(url => url.name === 'GitHub').id,
        link: 'https://github.com/microsoft/TypeScript',
        name: 'TypeScript Repository',
        createdAt: now,
        updatedAt: now,
      },
      // Links for Stack Overflow
      {
        id: uuidv4(),
        urlId: insertedUrls.find(url => url.name === 'Stack Overflow').id,
        link: 'https://stackoverflow.com/questions/tagged/nestjs',
        name: 'NestJS Questions',
        createdAt: now,
        updatedAt: now,
      },
    ];

    await queryInterface.bulkInsert('links', linksData, {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('links', null, {});
    await queryInterface.bulkDelete('urls', null, {});
  }
};
