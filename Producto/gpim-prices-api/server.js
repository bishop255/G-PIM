const express = require('express');
const cors = require('cors');
const axios = require('axios');
const cheerio = require('cheerio');
const puppeteer = require('puppeteer');

require('dotenv').config();
const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const cleanText = (value = '') => value.replace(/\s+/g, ' ').trim();

const normalizeQuery = (query = '') => query.trim().toLowerCase();

const hasUnitPriceText = (text = '') => {
  const lowerText = text.toLowerCase();

  return (
    lowerText.includes('por comp') ||
    lowerText.includes('por comprimido') ||
    lowerText.includes('por cápsula') ||
    lowerText.includes('por capsula') ||
    lowerText.includes('precio por unidad') ||
    lowerText.includes('precio unitario') ||
    lowerText.includes('unidad referencial')
  );
};

const extractPrice = (text = '') => {
  if (hasUnitPriceText(text)) return null;

  const matches = text.match(/\$\s?[\d\.]+/g);

  if (!matches || matches.length === 0) return null;

  const prices = matches
    .map((match) => {
      const raw = match.replace('$', '').trim();

      // Evita decimales raros 
      const parts = raw.split('.');
      if (parts.length > 1 && parts.some((part, index) => index > 0 && part.length !== 3)) {
        return null;
      }

      const price = Number(raw.replace(/\./g, ''));

      if (!price || price < 800) return null;

      return price;
    })
    .filter(Boolean);

  if (prices.length === 0) return null;

  return Math.min(...prices);
};

const absoluteUrl = (base, href) => {
  if (!href) return base;
  if (href.startsWith('http')) return href;
  if (href.startsWith('/')) return `${base}${href}`;
  return `${base}/${href}`;
};

const isValidProductName = (value = '') => {
  const text = value.toLowerCase();

  return (
    value.length >= 3 &&
    value.length <= 140 &&
    !text.includes('vtex') &&
    !text.includes('account') &&
    !text.includes('assets') &&
    !text.includes('filter') &&
    !text.includes('search') &&
    !text.includes('runtime') &&
    !value.includes('{') &&
    !value.includes('}')
  );
};

const findProductUrlFromAnchors = ($, query, baseUrl) => {
  const normalizedQuery = normalizeQuery(query);
  let productUrl = '';

  $('a[href]').each((_, element) => {
    if (productUrl) return;

    const text = cleanText($(element).text());
    const href = $(element).attr('href');

    const textMatches = text.toLowerCase().includes(normalizedQuery);
    const hrefMatches = href?.toLowerCase().includes(normalizedQuery);

    if ((textMatches || hrefMatches) && href && !href.includes('#')) {
      productUrl = absoluteUrl(baseUrl, href);
    }
  });

  return productUrl;
};

const shouldSkipWindow = (text = '') => hasUnitPriceText(text);

// =========================================
// AHUMADA (CHEERIO)
// =========================================

const scrapeAhumada = async (query) => {
  const searchUrl = `https://www.farmaciasahumada.cl/search?q=${encodeURIComponent(query)}`;

  try {
    const { data } = await axios.get(searchUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
      timeout: 15000,
    });

    const $ = cheerio.load(data);
    const lines = $('body').text().split('\n').map(cleanText).filter(Boolean);
    const results = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      if (!line.toLowerCase().includes(normalizeQuery(query))) continue;
      if (!isValidProductName(line)) continue;

      const windowText = lines.slice(Math.max(0, i - 5), i + 8).join(' ');

      if (shouldSkipWindow(windowText)) continue;

      const price = extractPrice(windowText);

      if (price) {
        const productUrl = findProductUrlFromAnchors(
          $,
          line,
          'https://www.farmaciasahumada.cl'
        );

        results.push({
          pharmacy: 'Farmacias Ahumada',
          medicineName: line.slice(0, 120),
          price,
          url: productUrl || searchUrl,
          productUrl: productUrl || searchUrl,
          available: !windowText.toLowerCase().includes('sin stock'),
          updatedAt: new Date().toISOString(),
        });
      }
    }

    return results.slice(0, 5);
  } catch (error) {
    console.error('Error Ahumada:', error.message);
    return [];
  }
};

// =========================================
// DR SIMI (CHEERIO)
// =========================================

const scrapeDrSimi = async (query) => {
  const searchUrl = `https://www.drsimi.cl/${encodeURIComponent(query)}?_q=${encodeURIComponent(query)}&map=ft`;

  const extractDrSimiName = (line) => {
    const patterns = [
      /"productName":"([^"]+)"/,
      /\\"productName\\":\\"([^\\"]+)\\"/,
      /"name":"([^"]+)"/,
      /\\"name\\":\\"([^\\"]+)\\"/,
    ];

    for (const pattern of patterns) {
      const match = line.match(pattern);
      if (match?.[1] && isValidProductName(match[1])) return match[1];
    }

    if (isValidProductName(line)) return line;

    return null;
  };

  try {
    const { data } = await axios.get(searchUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
      timeout: 15000,
    });

    const $ = cheerio.load(data);
    const lines = $('body').text().split('\n').map(cleanText).filter(Boolean);
    const results = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      if (!line.toLowerCase().includes(normalizeQuery(query))) continue;

      const medicineName = extractDrSimiName(line);

      if (!medicineName) continue;

      const windowText = lines.slice(Math.max(0, i - 5), i + 10).join(' ');

      if (shouldSkipWindow(windowText)) continue;

      const price = extractPrice(windowText);

      if (price) {
        const productUrl = findProductUrlFromAnchors(
          $,
          medicineName,
          'https://www.drsimi.cl'
        );

        results.push({
          pharmacy: 'Dr. Simi',
          medicineName,
          price,
          url: productUrl || searchUrl,
          productUrl: productUrl || searchUrl,
          available: !windowText.toLowerCase().includes('sin stock'),
          updatedAt: new Date().toISOString(),
        });
      }
    }

    return results.slice(0, 5);
  } catch (error) {
    console.error('Error Dr. Simi:', error.message);
    return [];
  }
};

// =========================================
// SALCOBRAND (PUPPETEER)
// =========================================

const scrapeSalcobrand = async (query) => {
  const searchUrl = `https://salcobrand.cl/search_result?query=${encodeURIComponent(query)}`;
  let browser;

  try {
    browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
      ],
    });

    const page = await browser.newPage();

    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64)');

    await page.goto(searchUrl, {
      waitUntil: 'networkidle2',
      timeout: 30000,
    });

    await new Promise((resolve) => setTimeout(resolve, 4000));

    const pageData = await page.evaluate(() => {
      const textLines = document.body.innerText
        .split('\n')
        .map((line) => line.replace(/\s+/g, ' ').trim())
        .filter(Boolean);

      const links = Array.from(document.querySelectorAll('a[href]')).map((a) => ({
        text: a.innerText.replace(/\s+/g, ' ').trim(),
        href: a.href,
      }));

      return { textLines, links };
    });

    const results = [];
    const normalizedQuery = normalizeQuery(query);

    for (let i = 0; i < pageData.textLines.length; i++) {
      const line = pageData.textLines[i];

      if (!line.toLowerCase().includes(normalizedQuery)) continue;
      if (!isValidProductName(line)) continue;

      const windowText = pageData.textLines
        .slice(Math.max(0, i - 5), i + 10)
        .join(' ');

      if (shouldSkipWindow(windowText)) continue;

      const price = extractPrice(windowText);

      if (price) {
            const productLink = pageData.links.find((link) => {
            const text = link.text.toLowerCase();
            const href = link.href.toLowerCase();

            const looksLikeProduct =
                href.includes('/products/') ||
                href.includes('/product/') ||
                href.includes('/p/');

            const matchesProduct =
                text.includes(normalizedQuery) ||
                href.includes(normalizedQuery) ||
                line
                .toLowerCase()
                .split(' ')
                .filter((word) => word.length >= 4)
                .some((word) => href.includes(word));

            return looksLikeProduct && matchesProduct;
            });

        results.push({
          pharmacy: 'Salcobrand',
          medicineName: line.slice(0, 120),
          price,
          url: productLink?.href || searchUrl,
          productUrl: productLink?.href || searchUrl,
          hasDirectProductUrl: Boolean(productLink?.href),
          available: !windowText.toLowerCase().includes('sin stock'),
          updatedAt: new Date().toISOString(),
        });
      }
    }

    await browser.close();

    return results.slice(0, 5);
  } catch (error) {
    console.error('Error Salcobrand:', error.message);

    if (browser) await browser.close();

    return [];
  }
};

// =========================================
// API
// =========================================

app.get('/api/prices', async (req, res) => {
  const query = req.query.query;

  if (!query || query.trim().length < 2) {
    return res.status(400).json({
      ok: false,
      message: 'Debes enviar ?query=nombreMedicamento',
    });
  }

  const cleanQuery = query.trim();

  console.log('Buscando:', cleanQuery);

  const [ahumada, drSimi, salcobrand] = await Promise.all([
    scrapeAhumada(cleanQuery),
    scrapeDrSimi(cleanQuery),
    scrapeSalcobrand(cleanQuery),
  ]);

  const uniqueResults = new Map();

  [...ahumada, ...drSimi, ...salcobrand].forEach((item) => {
    if (!item.price || item.available === false) return;

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
    sources: {
      ahumada: ahumada.length,
      drSimi: drSimi.length,
      salcobrand: salcobrand.length,
    },
  });
});

app.post('/api/medicine-info', async (req, res) => {
  try {
    const { medicineName } = req.body;

    if (!medicineName || medicineName.trim().length < 2) {
      return res.status(400).json({
        ok: false,
        message: 'Debes enviar medicineName',
      });
    }

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({
        ok: false,
        message: 'OPENAI_API_KEY no configurada',
      });
    }

    const cleanName = medicineName.trim();

    const response = await openai.responses.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      instructions: `
Eres un asistente informativo para una app de gestión de medicamentos.
No diagnostiques, no indiques dosis, no reemplaces a un profesional de salud.
Responde en español claro y breve.
Devuelve SOLO JSON válido, sin markdown.
      `,
      input: `
Entrega información general sobre el medicamento "${cleanName}".

Formato exacto:
{
  "summary": "Explicación breve de para qué sirve.",
  "uses": ["Uso común 1", "Uso común 2", "Uso común 3"],
  "precautions": ["Precaución 1", "Precaución 2", "Precaución 3"],
  "recommendations": ["Recomendación general 1", "Recomendación general 2"],
  "disclaimer": "Texto corto indicando que no reemplaza indicación médica."
}
      `,
    });

    const rawText = response.output_text || '{}';

    let parsed;

    try {
      parsed = JSON.parse(rawText);
    } catch (error) {
      parsed = {
        summary: rawText,
        uses: [],
        precautions: [],
        recommendations: [],
        disclaimer:
          'Esta información es general y no reemplaza la indicación de un profesional de la salud.',
      };
    }

    return res.json({
      ok: true,
      medicineName: cleanName,
      aiInfo: {
        summary: parsed.summary || '',
        uses: Array.isArray(parsed.uses) ? parsed.uses : [],
        precautions: Array.isArray(parsed.precautions) ? parsed.precautions : [],
        recommendations: Array.isArray(parsed.recommendations)
          ? parsed.recommendations
          : [],
        disclaimer:
          parsed.disclaimer ||
          'Esta información es general y no reemplaza la indicación de un profesional de la salud.',
      },
    });
  } catch (error) {
    console.error('Error IA medicamento:', error);
    console.error('Detalle OpenAI:', error?.response?.data || error?.message);

    return res.status(500).json({
      ok: false,
      message: 'No se pudo generar la información del medicamento.',
      error: error?.message,
    });
  }
});

app.get('/', (req, res) => {
  res.send('G-PIM Prices API funcionando');
});

app.listen(PORT, () => {
  console.log(`G-PIM Prices API corriendo en http://localhost:${PORT}`);
});