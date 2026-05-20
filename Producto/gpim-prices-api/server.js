const express = require('express');
const cors = require('cors');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const cleanText = (value = '') => value.replace(/\s+/g, ' ').trim();

const extractPrice = (text = '') => {
  const match = text.match(/\$\s?[\d\.]{3,}/);
  if (!match) return null;

  const price = Number(match[0].replace('$', '').replace(/\./g, '').trim());

  if (!price || price < 500) return null;

  return price;
};

const normalizeQuery = (query = '') => query.trim().toLowerCase();

const scrapeCruzVerde = async (query) => {
  const url = `https://www.cruzverde.cl/search?query=${encodeURIComponent(query)}`;

  try {
    const { data } = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0',
      },
      timeout: 12000,
    });

    const $ = cheerio.load(data);
    const results = [];

    $('body')
      .text()
      .split('\n')
      .map(cleanText)
      .filter(Boolean)
      .forEach((line) => {
        if (
          line.toLowerCase().includes(normalizeQuery(query)) &&
          line.includes('$')
        ) {
          const price = extractPrice(line);

          if (price) {
            results.push({
              pharmacy: 'Cruz Verde',
              medicineName: line.slice(0, 120),
              price,
              url,
              available: true,
              updatedAt: new Date().toISOString(),
            });
          }
        }
      });

    return results.slice(0, 5);
  } catch (error) {
    console.error('Error Cruz Verde:', error.message);
    return [];
  }
};

const scrapeAhumada = async (query) => {
  const url = `https://www.farmaciasahumada.cl/search?q=${encodeURIComponent(query)}`;

  try {
    const { data } = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0',
      },
      timeout: 12000,
    });

    const $ = cheerio.load(data);
    const text = $('body').text();

    const lines = text.split('\n').map(cleanText).filter(Boolean);
    const results = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      if (line.toLowerCase().includes(normalizeQuery(query))) {
        const windowText = lines.slice(Math.max(0, i - 5), i + 8).join(' ');
        const price = extractPrice(windowText);

        if (price) {
          results.push({
            pharmacy: 'Farmacias Ahumada',
            medicineName: line.slice(0, 120),
            price,
            url,
            available: !windowText.toLowerCase().includes('sin stock'),
            updatedAt: new Date().toISOString(),
          });
        }
      }
    }

    return results.slice(0, 5);
  } catch (error) {
    console.error('Error Ahumada:', error.message);
    return [];
  }
};

const scrapeSalcobrand = async (query) => {
    const url = `https://salcobrand.cl/search_result?query=${encodeURIComponent(query)}`;

  try {
    const { data } = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0',
      },
      timeout: 12000,
    });

    const $ = cheerio.load(data);
    const text = $('body').text();

    const lines = text.split('\n').map(cleanText).filter(Boolean);
    const results = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      if (line.toLowerCase().includes(normalizeQuery(query))) {
        const windowText = lines.slice(Math.max(0, i - 5), i + 8).join(' ');
        const price = extractPrice(windowText);

        if (price) {
          results.push({
            pharmacy: 'Salcobrand',
            medicineName: line.slice(0, 120),
            price,
            url,
            available: !windowText.toLowerCase().includes('sin stock'),
            updatedAt: new Date().toISOString(),
          });
        }
      }
    }

    return results.slice(0, 5);
  } catch (error) {
    console.error('Error Salcobrand:', error.message);
    return [];
  }
};

app.get('/api/prices', async (req, res) => {
  const query = req.query.query;

  if (!query || query.trim().length < 2) {
    return res.status(400).json({
      ok: false,
      message: 'Debes enviar ?query=nombreMedicamento',
    });
  }

  const cleanQuery = query.trim();

  const [cruzVerde, ahumada, salcobrand] = await Promise.all([
    scrapeCruzVerde(cleanQuery),
    scrapeAhumada(cleanQuery),
    scrapeSalcobrand(cleanQuery),
  ]);

  const uniqueResults = new Map();

  [...cruzVerde, ...ahumada, ...salcobrand].forEach((item) => {
    if (!item.price) return;

    const key = `${item.pharmacy}_${item.medicineName}_${item.price}`;

    if (!uniqueResults.has(key)) {
      uniqueResults.set(key, item);
    }
  });

  const results = Array.from(uniqueResults.values()).sort(
    (a, b) => a.price - b.price
  );

  return res.json({
    ok: true,
    query: cleanQuery,
    count: results.length,
    results,
  });
});

app.get('/', (req, res) => {
  res.send('G-PIM Prices API funcionando');
});

app.listen(PORT, () => {
  console.log(`G-PIM Prices API corriendo en http://localhost:${PORT}`);
});