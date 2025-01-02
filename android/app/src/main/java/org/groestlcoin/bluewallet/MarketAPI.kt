package org.groestlcoin.bluewallet

import android.content.Context
import android.util.Log
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import okhttp3.OkHttpClient
import okhttp3.Request
import org.json.JSONObject

object MarketAPI {

    private const val TAG = "MarketAPI"
    private val client = OkHttpClient()

    var baseUrl: String? = null

    suspend fun fetchPrice(context: Context, currency: String): String? {
        return try {
            val fiatUnitsJson = context.assets.open("fiatUnits.json").bufferedReader().use { it.readText() }
            val json = JSONObject(fiatUnitsJson)
            val currencyInfo = json.getJSONObject(currency)
            val source = currencyInfo.getString("source")
            val endPointKey = currencyInfo.getString("endPointKey")

            val urlString = buildURLString(source, endPointKey)
            Log.d(TAG, "Fetching price from URL: $urlString")

            val request = Request.Builder().url(urlString).build()
            val response = withContext(Dispatchers.IO) { client.newCall(request).execute() }

            if (!response.isSuccessful) {
                Log.e(TAG, "Failed to fetch price. Response code: ${response.code}")
                return null
            }

            val jsonResponse = response.body?.string() ?: return null
            parseJSONBasedOnSource(jsonResponse, source, endPointKey)
        } catch (e: Exception) {
            Log.e(TAG, "Error fetching price", e)
            null
        }
    }

    private fun buildURLString(source: String, endPointKey: String): String {
        return if (baseUrl != null) {
            baseUrl + endPointKey
        } else {
            when (source) {
                "CoinGecko" -> "https://api.coingecko.com/api/v3/simple/price?ids=groestlcoin&vs_currencies=${endPointKey.lowercase()}"
                else -> "https://api.coingecko.com/api/v3/simple/price?ids=groestlcoin&vs_currencies=${endPointKey.lowercase()}"
            }
        }
    }

    private fun parseJSONBasedOnSource(jsonString: String, source: String, endPointKey: String): String? {
        return try {
            val json = JSONObject(jsonString)
            when (source) {
                "CoinGecko" -> json.getJSONObject("groestlcoin").getString(endPointKey.lowercase())
                else -> null
            }
        } catch (e: Exception) {
            Log.e(TAG, "Error parsing price", e)
            null
        }
    }
}
