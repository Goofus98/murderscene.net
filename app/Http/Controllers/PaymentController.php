<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Srmklive\PayPal\Services\PayPal as PayPalClient;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redis;
use Illuminate\Support\Facades\DB;
use App\Models\Donations;
use App\Models\Transactions;

class PaymentController extends Controller
{
    public function handlePayment(Request $request)
    {
        
        try {
            DB::connection()->getPdo();
        } catch (\Exception $e) {
            return redirect()->to('http://murderscene.net/error?code=' . '500' . "&" . 'msg=' . 'Internal server error :(');
        }

        $amount = $request->query('amt');

        if (!$amount || (strlen($amount) < 3 || !preg_match('/^[0-9]+$/', $amount))){
            return redirect()->to('http://murderscene.net');
        }

        if (!Auth::check()) {
            return redirect()->to('http://api.murderscene.net/auth/steam?ret=http://api.murderscene.net/paypal/handle-payment?amt=' . $amount);
        }
        
        $payAmount = substr($amount, 0, -2) . "." . substr($amount, -2);
        //If they entered 0 or less than a dollar
        if ((int)$payAmount <= 0){
            return redirect()->to('http://murderscene.net/');
        }
        $provider = new PayPalClient;
        $provider->setApiCredentials(config('paypal'));
        $paypalToken = $provider->getAccessToken();
        $response = $provider->createOrder([
            "intent" => "CAPTURE",
            "application_context" => [
                "return_url" => route('success.payment'),
                "cancel_url" => route('cancel.payment'),
            ],
            "purchase_units" => [
                0 => [
                    "amount" => [
                        "currency_code" => "USD",
                        "value" => $payAmount
                    ]
                ]
            ]
        ]);
        if (isset($response['id']) && $response['id'] != null) {
            foreach ($response['links'] as $links) {
                if ($links['rel'] == 'approve') {
                    return redirect()->away($links['href']);
                }
            }
            return redirect()
                ->route('cancel.payment');
        } else {
            return redirect()->to('http://murderscene.net/error?code=' . '503' . "&" . 'msg=' . 'Service Unavailable :(');
        }
    }

    public function paymentCancel()
    {
        return redirect()->to('http://murderscene.net/donate');
    }

    public function paymentSuccess(Request $request)
    {
        if (!Auth::check()) {
            return redirect()->to('http://murderscene.net/');
        }
    
        try {
            DB::connection()->getPdo();
        } catch (\Exception $e) {
            return redirect()->to('http://murderscene.net/error?code=' . '500' . "&" . 'msg=' . 'Internal server error :(');
        }

        $provider = new PayPalClient;
        $provider->setApiCredentials(config('paypal'));
        $provider->getAccessToken();
        $response = $provider->capturePaymentOrder($request['token']);
        if (isset($response['status']) && $response['status'] == 'COMPLETED') {
            $sPayment = $response['purchase_units'][0]['payments']['captures'][0]['amount']['value'];
            $dollars = intval($sPayment);
            $payout = $dollars * (int)env("GP_PER_DOLLAR", "10000");

            $steamid = Auth::id();

            $payload = [
                'steamid' => $steamid,
                'donation' => $sPayment,
                'reward' => $payout,
                'method' => 'paypal'
            ];
            $transaction = Transactions::create($payload);

            $donation = [
                'transaction_id' => $transaction->transaction_id
            ];
            Donations::create($donation);

            $payload['transaction_id'] = $transaction->transaction_id;
            Redis::publish(env("REDIS_GMOD_CHAN", "gmod"), json_encode($payload));

            return redirect()->to('http://murderscene.net/');
        } else {
            return redirect()->to('http://murderscene.net/error?code=' . '400' . "&" . 'msg=' .  $response['message'] ?? 'Something went wrong with paypal.' );
        }
    }
}
