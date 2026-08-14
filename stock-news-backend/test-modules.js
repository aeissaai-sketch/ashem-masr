
console.log('Testing require statements');
try {
  console.log('1. Testing express...');
  const express = require('express');
  console.log('   ✓ Express loaded');
} catch (e) { console.error('   ✗ Express failed:', e.message); }

try {
  console.log('2. Testing axios...');
  const axios = require('axios');
  console.log('   ✓ Axios loaded');
} catch (e) { console.error('   ✗ Axios failed:', e.message); }

try {
  console.log('3. Testing cheerio...');
  const cheerio = require('cheerio');
  console.log('   ✓ Cheerio loaded');
} catch (e) { console.error('   ✗ Cheerio failed:', e.message); }

try {
  console.log('4. Testing cors...');
  const cors = require('cors');
  console.log('   ✓ Cors loaded');
} catch (e) { console.error('   ✗ Cors failed:', e.message); }

try {
  console.log('5. Testing dotenv...');
  const dotenv = require('dotenv');
  console.log('   ✓ Dotenv loaded');
} catch (e) { console.error('   ✗ Dotenv failed:', e.message); }

console.log('Done with module tests');
