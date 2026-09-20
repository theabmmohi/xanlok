<?php

namespace App\Http\Controllers;

use App\Actions\Fortify\UsernameValidationRules;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

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

    public function userAvatar(Request $request)
    {
        $request->validate(['avatar' => ['required', 'image', 'max:5120']]);

        $request->image('avatar')
            ->cover(512, 512)
            ->toWebp()
            ->quality(100)
            ->storePubliclyAs('avatars', "{$request->user()->id}.webp");
        $request->user()->touch();

        return back();
    }

    public function settingsSecurity(Request $request)
    {
        return Inertia::render('Settings/Security', [
            'passkeys' => $request->user()->passkeys()->get([
                'id', 'name', 'credential', 'last_used_at', 'created_at'
            ])->map(fn ($passkey) => [
                'id' => $passkey->id,
                'name' => $passkey->name,
                'authenticator' => $passkey->authenticator,
                'last_used_at' => $passkey->last_used_at,
                'created_at' => $passkey->created_at
            ])
        ]);
    }
}
