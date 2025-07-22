const express = require('express');
const fetch = require('node-fetch');
const { XMLParser } = require('fast-xml-parser');
const cors = require('cors');

const app = express();
app.use(cors());

app.get('/minjust', async (req, res) => {
  try {
    const rssUrl = 'https://minjust.gov.ru/ru/subscription/rss/extremist_materials/';
    const response = await fetch(rssUrl);
    const xml = await response.text();

    const parser = new XMLParser();
    const json = parser.parse(xml);
    const items = json.rss.channel.item || [];

    const titles = items.map(i => i.title?.toLowerCase().trim()).filter(Boolean);

    res.json(titles);
  } catch (error) {
    console.error('[Ошибка прокси]:', error);
    res.status(500).json({ error: 'Ошибка при загрузке данных с Минюста' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Прокси-сервер запущен на порту ${PORT}`);
});
