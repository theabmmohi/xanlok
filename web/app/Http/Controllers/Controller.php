<?php

namespace App\Http\Controllers;

use App\Actions\Fortify\UsernameValidationRules;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class Controller
{
    use UsernameValidationRules;

    public function checkUsername(Request $request): array
    {
        $username = Str::lower((string) $request->input('username'));

        $validator = Validator::make(['username' => $username], [
            'username' => $this->usernameRules(),
        ]);

        if ($validator->fails()) {
            return ['available' => false];
        }

        return ['available' => ! User::where('username', $username)->exists()];
    }
}
