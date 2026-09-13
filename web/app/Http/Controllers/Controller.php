<?php

namespace App\Http\Controllers;

use App\Actions\Fortify\UsernameValidationRules;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

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

    public function updateAvatar(Request $request)
    {
        $request->validate(['avatar' => ['required', 'image', 'max:5120']]);

        $request->image('avatar')
            ->cover(512, 512)
            ->toWebp()
            ->quality(80)
            ->storePubliclyAs('avatars', "{$request->user()->id}.webp");
        $request->user()->touch();

        return back();
    }
}
