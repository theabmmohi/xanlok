<?php

namespace App\Http\Responses;

use Laravel\Fortify\Contracts\PasswordUpdatedResponse as PasswordUpdatedResponseContract;

class PasswordUpdatedResponse implements PasswordUpdatedResponseContract
{
    public function toResponse($request)
    {
        return $request->wantsJson()
            ? response()->json(['message' => 'Password updated.'], 200)
            : back();
    }
}
