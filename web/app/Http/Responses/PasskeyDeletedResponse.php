<?php

namespace App\Http\Responses;

use Laravel\Passkeys\Contracts\PasskeyDeletedResponse as PasskeyDeletedResponseContract;

class PasskeyDeletedResponse implements PasskeyDeletedResponseContract
{
    public function toResponse($request)
    {
        return $request->wantsJson()
            ? response()->json(['message' => 'Passkey deleted'], 200)
            : back();
    }
}
