// Update your geocoding logic in geocoder.js

import NodeGeocoder from 'node-geocoder'
import dotenv from 'dotenv'

dotenv.config()

const geocoder = NodeGeocoder({
  provider: 'opencage', // Use the appropriate provider
  apiKey: process.env.OPENCAGE_API_KEY,
})

export default geocoder
