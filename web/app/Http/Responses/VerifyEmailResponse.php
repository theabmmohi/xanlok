<?php

namespace App\Http\Responses;

use Laravel\Fortify\Contracts\VerifyEmailResponse as VerifyEmailResponseContract;
use Laravel\Fortify\Fortify;

class VerifyEmailResponse implements VerifyEmailResponseContract
{
    public function toResponse($request)
    {
        return $request->wantsJson()
            ? response()->json(['message' => 'Email verified'], 204)
            : redirect()->intended(Fortify::redirects('email-verification'))
                ->with('success', 'Your email has been verified');
    }
}
