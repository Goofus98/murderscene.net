<?php

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redis;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Route;
use Laravel\Socialite\Facades\Socialite;

use App\Http\Controllers\LaraveliaController;
use App\Http\Controllers\PaymentController;

Route::get('/auth/steam', function (Request $request) {

    $object = $request->query('ret');
    Cookie::queue(Cookie::make ('return', $object, env("SESSION_LIFETIME", 720), null, null, null, false));


    return Socialite::driver('steam')->redirect();
})->name('login');

Route::get('/auth/logout', function (Request $request) : RedirectResponse {

    Auth::logout();

    Cookie::queue(
        Cookie::forget('steamid64')
    );
    $request->session()->invalidate();
    $request->session()->regenerateToken();

    return redirect()->to('http://murderscene.net/');
})->name('logout');

Route::get('/auth/callback', function (Request $request) {
    $user = Socialite::driver('steam')->user();
    // Process $user data as needed (e.g., save to the database)
    $steamUser = User::updateOrCreate([
        'steamid' => $user->getId(),
    ], [
        'name' => $user->getNickname(),
        'avatar' => $user->getAvatar()
    ]);
    
    Auth::login($steamUser);
    Cookie::queue(Cookie::make ('steamid64', json_encode(Auth::user()), env("SESSION_LIFETIME", 720), null, null, null, false));


    return redirect()->to( $request->cookie('return'));
});


Route::get('/auth/user', function (Request $request) {
    
    Cookie::queue(Cookie::make('steamid64', json_encode(Auth::user()), env("SESSION_LIFETIME", 720), null, null, null, false));


    return $request->cookie('steamid64');
});

Route::get('/auth/currency', function () {
    if (!Auth::check()) {
        return  [];
    }
    $output = [];
    $users = [];


    try { 
        $users = DB::connection('garrysmod_sql')->select("SELECT * FROM gp_shop_players WHERE userid = '" . Auth::id() . "';");
    } catch(\Illuminate\Database\QueryException $ex){ 
        dd($ex->getMessage()); 
    }

    $playerSteamCache = Cache::remember('player_steam_' . Auth::id(), 60, function () {
        $steamOutput = [];
        $steamQuery = Http::get('http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=' . env('STEAM_CLIENT_SECRET') . '&steamids=' . Auth::id());
        $steamQuery->throw();
        return [
            'avatar' => $steamQuery["response"]["players"][0]["avatarfull"],
            'name' =>  $steamQuery["response"]["players"][0]["personaname"]
        ];
    });

    foreach ($users as $user){
        $output = [
            'gp' => $user->gp,
            'avatar' => $playerSteamCache['avatar'],
            'name' =>  $playerSteamCache['name'],
        ];
    }

    return $output;

});


Route::controller(PaymentController::class)
    ->prefix('paypal')
    ->group(function () {
        Route::view('payment', 'paypal.index')->name('create.payment');
        Route::get('handle-payment', 'handlePayment')->name('make.payment');
        Route::get('cancel-payment', 'paymentCancel')->name('cancel.payment');
        Route::get('payment-success', 'paymentSuccess')->name('success.payment');
    })->middleware('auth');


    Route::name('stripe.')
    ->controller(LaraveliaController::class)
    ->prefix('stripe')
    ->group(function () {
        Route::get('payment', 'index')->name('index');
        Route::post('payment', 'store')->name('store');
    });
/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

/*Route::get('view', 'App\Http\Controllers\Controller@showView');
Route::get('/', function () {
    return view('welcome');
});*/
