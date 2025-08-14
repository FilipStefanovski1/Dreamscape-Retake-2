<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class IkeaController extends Controller
{
    public function search(Request $request)
    {
        $query = trim((string) $request->query('q', ''));

        if ($query === '') {
            return response()->json([
                'query' => $query,
                'results' => [],
            ]);
        }

        try {
            // In local dev we bypass SSL verify to avoid cURL error 60 issues.
            $http = app()->environment('local')
                ? Http::withoutVerifying()->timeout(12)
                : Http::timeout(12);

            // Unofficial public IKEA search endpoint (US site)
            $response = $http
                ->withHeaders([
                    'User-Agent' => 'Mozilla/5.0',
                    'Accept' => 'application/json',
                ])
                ->get('https://sik.search.blue.cdtapps.com/us/en/search-result-page', [
                    'q' => $query,
                ]);

            if ($response->failed()) {
                return response()->json([
                    'query' => $query,
                    'results' => [],
                    'error' => 'Failed to fetch IKEA data',
                    'status' => $response->status(),
                ], $response->status());
            }

            $json = $response->json();

            // Products shape varies; we normalize to a simple list
            $products = collect($json['searchResultPage']['products'] ?? [])
                ->map(function ($p) {
                    // Some responses use pipUrl, others provide itemNo—prefer pipUrl when present
                    $pipUrl = $p['pipUrl'] ?? null;
                    $itemNo = $p['itemNo'] ?? null;

                    $url = $pipUrl
                        ? ('https://www.ikea.com' . $pipUrl)
                        : ($itemNo ? "https://www.ikea.com/us/en/p/{$itemNo}/" : null);

                    return [
                        'name'        => $p['name'] ?? 'Unknown item',
                        'image'       => $p['mainImageUrl'] ?? null,
                        'description' => $p['typeName'] ?? '',
                        'price'       => $p['salesPrice']['numeral'] ?? null,
                        'url'         => $url,
                    ];
                })
                ->filter(fn ($p) => !empty($p['name']) && !empty($p['url']))
                ->values()
                ->take(3);

            return response()->json([
                'query' => $query,
                'results' => $products,
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'query' => $query,
                'results' => [],
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
