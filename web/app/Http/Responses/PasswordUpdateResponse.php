<?php

namespace App\Http\Responses;

use Laravel\Fortify\Contracts\PasswordUpdateResponse as PasswordUpdateResponseContract;

class PasswordUpdateResponse implements PasswordUpdateResponseContract
{
    public function toResponse($request)
    {
        return $request->wantsJson()
            ? response()->json(['message' => 'Password updated'], 200)
            : back();
    }
}
