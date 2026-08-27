<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePortfolioRequest;
use App\Http\Requests\UpdatePortfolioRequest;
use App\Http\Resources\PortfolioResource;
use App\Models\Portfolio;
use Illuminate\Support\Facades\Storage;

class PortfolioController extends Controller
{
    public function index()
    {
        return PortfolioResource::collection(Portfolio::orderBy('order')->orderBy('id')->get());
    }

    public function show(Portfolio $portfolio): PortfolioResource { return new PortfolioResource($portfolio); }

    public function store(StorePortfolioRequest $request): PortfolioResource
    {
        $portfolio = Portfolio::create([
            ...$request->safe()->except('image'),
            'image' => $request->file('image')->store('portfolios', 'public'),
        ]);

        return new PortfolioResource($portfolio);
    }

    public function update(UpdatePortfolioRequest $request, Portfolio $portfolio): PortfolioResource
    {
        $payload = $request->safe()->except('image');

        if ($request->hasFile('image')) {
            if ($portfolio->image && Storage::disk('public')->exists($portfolio->image)) {
                Storage::disk('public')->delete($portfolio->image);
            }
            $payload['image'] = $request->file('image')->store('portfolios', 'public');
        }

        $portfolio->update($payload);
        return new PortfolioResource($portfolio->fresh());
    }

    public function destroy(Portfolio $portfolio)
    {
        if ($portfolio->image && Storage::disk('public')->exists($portfolio->image)) {
            Storage::disk('public')->delete($portfolio->image);
        }
        $portfolio->delete();
        return response()->json(['message' => 'Portfolio item deleted successfully.']);
    }
}
