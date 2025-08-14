<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use GuzzleHttp\Client;

Route::get('/test', function () {
    return response()->json(['message' => 'Backend is working!']);
});

Route::get('/ikea/search', function (Request $request) {
    $query = $request->query('q', '');

    if (empty($query)) {
        return response()->json([
            'error' => 'No search term provided'
        ], 400);
    }

    try {
        $client = new Client();
        $url = "https://sik.search.blue.cdtapps.com/us/en/search-result-page?q=" . urlencode($query);

        $res = $client->get($url, [
            'headers' => [
                'User-Agent' => 'Mozilla/5.0',
                'Accept' => 'application/json',
            ],
            'verify' => false // bypass SSL issue locally
        ]);

        $data = json_decode($res->getBody(), true);

        // Parse first 3 items
        $results = [];
        if (isset($data['searchResultPage']['products'])) {
            foreach (array_slice($data['searchResultPage']['products'], 0, 3) as $product) {
                $results[] = [
                    'name' => $product['name'] ?? '',
                    'price' => $product['priceDisplay'] ?? '',
                    'image' => $product['mainImageUrl'] ?? '',
                    'url'   => 'https://www.ikea.com/us/en/p/' . ($product['pipUrl'] ?? '')
                ];
            }
        }

        return response()->json([
            'query' => $query,
            'results' => $results
        ]);

    } catch (\Exception $e) {
        return response()->json([
            'error' => 'Failed to fetch IKEA data',
            'details' => $e->getMessage()
        ], 500);
    }
});
